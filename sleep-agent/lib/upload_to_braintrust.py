#!/usr/bin/env python3
"""Upload Claude Code JSONL sessions to Braintrust as traced spans."""

import os, json, sys, glob, requests
from uuid import uuid4
from datetime import datetime

API_URL = "https://api.braintrust.dev"
API_KEY = os.environ["BRAINTRUST_API_KEY"]
PROJECT_NAME = os.environ.get("BRAINTRUST_CC_PROJECT", "self-healing-sleep")
HEADERS = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}
JSONL_DIR = os.path.expanduser(
    "~/.claude/projects/-Users-tejasdc-workspace-self-healing-agents"
)

SKIP_TYPES = frozenset({"file-history-snapshot", "queue-operation"})
BATCH_SIZE = 50


def get_or_create_project():
    """Find an existing project by name, or create a new one."""
    resp = requests.get(
        f"{API_URL}/v1/project",
        headers=HEADERS,
        params={"project_name": PROJECT_NAME},
    )
    resp.raise_for_status()
    projects = resp.json().get("objects", [])
    for p in projects:
        if p["name"] == PROJECT_NAME:
            print(f"Found existing project: {p['id']}")
            return p["id"]

    resp = requests.post(
        f"{API_URL}/v1/project",
        headers=HEADERS,
        json={"name": PROJECT_NAME},
    )
    resp.raise_for_status()
    project = resp.json()
    print(f"Created project: {project['id']}")
    return project["id"]


def _extract_text(content, max_chars=500):
    """Pull concatenated text from assistant content blocks, skipping thinking."""
    if isinstance(content, str):
        return content[:max_chars]
    if not isinstance(content, list):
        return ""
    parts = []
    for block in content:
        if isinstance(block, dict) and block.get("type") == "text":
            parts.append(block.get("text", ""))
    return " ".join(parts)[:max_chars]


def _safe_loads(line):
    """Attempt to parse a single JSONL line, return None on failure."""
    try:
        return json.loads(line)
    except (json.JSONDecodeError, ValueError):
        return None


def parse_session_to_spans(filepath):
    """Convert a JSONL session file into Braintrust span events.

    Returns (session_id, list_of_span_dicts).
    """
    with open(filepath) as f:
        raw_lines = f.readlines()

    lines = []
    for raw in raw_lines:
        stripped = raw.strip()
        if not stripped:
            continue
        obj = _safe_loads(stripped)
        if obj is not None:
            lines.append(obj)

    if not lines:
        return None, []

    # ── First pass: discover session_id and collect tool results ──────
    session_id = None
    tool_results = {}  # tool_use_id -> truncated result string

    for obj in lines:
        if not session_id:
            session_id = obj.get("sessionId")

        if obj.get("type") != "user":
            continue
        content = obj.get("message", {}).get("content")
        if not isinstance(content, list):
            continue
        for block in content:
            if isinstance(block, dict) and block.get("type") == "tool_result":
                tid = block.get("tool_use_id")
                if tid:
                    result_text = block.get("content", "")
                    if isinstance(result_text, list):
                        # Some tool results wrap content in a list of dicts
                        result_text = " ".join(
                            str(r.get("text", r)) for r in result_text
                        )
                    tool_results[tid] = str(result_text)[:2000]

    if not session_id:
        return None, []

    # ── Gather timestamp bounds for the root span ─────────────────────
    timestamps = [obj["timestamp"] for obj in lines if "timestamp" in obj]
    first_ts = min(timestamps) if timestamps else datetime.utcnow().isoformat() + "Z"
    last_ts = max(timestamps) if timestamps else first_ts

    spans = []

    # ── Root session span ─────────────────────────────────────────────
    spans.append(
        {
            "id": uuid4().hex,
            "span_id": session_id,
            "root_span_id": session_id,
            "span_parents": [],
            "input": {"session_file": os.path.basename(filepath)},
            "output": {"status": "completed"},
            "metadata": {"source": "claude-code-jsonl", "session_id": session_id},
            "span_attributes": {
                "name": f"Session {session_id[:8]}",
                "type": "task",
            },
            "created": first_ts,
        }
    )

    # ── Second pass: build child spans ────────────────────────────────
    for obj in lines:
        msg_type = obj.get("type")
        if msg_type in SKIP_TYPES:
            continue

        uuid = obj.get("uuid", uuid4().hex)
        ts = obj.get("timestamp", first_ts)

        # ── User turn spans ───────────────────────────────────────────
        if msg_type == "user":
            # Skip meta/system injections
            if obj.get("isMeta"):
                continue
            content = obj.get("message", {}).get("content", "")
            # Only create turn spans for plain-text user messages
            if isinstance(content, str) and content.strip():
                spans.append(
                    {
                        "id": uuid4().hex,
                        "span_id": uuid,
                        "root_span_id": session_id,
                        "span_parents": [session_id],
                        "input": content[:5000],
                        "metadata": {"source": "claude-code-jsonl"},
                        "span_attributes": {"name": "User Turn", "type": "task"},
                        "created": ts,
                    }
                )

        # ── Assistant / LLM spans ─────────────────────────────────────
        elif msg_type == "assistant":
            msg = obj.get("message", {})
            usage = msg.get("usage") or {}
            content = msg.get("content", [])
            model = msg.get("model", "unknown")

            input_tokens = usage.get("input_tokens", 0)
            cache_creation = usage.get("cache_creation_input_tokens", 0)
            cache_read = usage.get("cache_read_input_tokens", 0)
            output_tokens = usage.get("output_tokens", 0)
            prompt_tokens = input_tokens + cache_creation + cache_read
            total_tokens = prompt_tokens + output_tokens

            # Only emit an LLM span when we have token accounting
            if total_tokens > 0:
                text_content = _extract_text(content, max_chars=500)
                spans.append(
                    {
                        "id": uuid4().hex,
                        "span_id": uuid,
                        "root_span_id": session_id,
                        "span_parents": [session_id],
                        "input": {"model": model},
                        "output": text_content if text_content else None,
                        "metadata": {"model": model, "source": "claude-code-jsonl"},
                        "metrics": {
                            "prompt_tokens": prompt_tokens,
                            "completion_tokens": output_tokens,
                            "tokens": total_tokens,
                        },
                        "span_attributes": {"name": "LLM Call", "type": "llm"},
                        "created": ts,
                    }
                )

            # ── Tool-use spans (children of their LLM span) ──────────
            if isinstance(content, list):
                for block in content:
                    if not isinstance(block, dict):
                        continue
                    if block.get("type") != "tool_use":
                        continue
                    tool_name = block.get("name", "unknown")
                    tool_id = block.get("id", uuid4().hex)
                    try:
                        tool_input = json.dumps(block.get("input", {}))[:2000]
                    except (TypeError, ValueError):
                        tool_input = str(block.get("input", ""))[:2000]
                    tool_output = tool_results.get(tool_id, "")

                    spans.append(
                        {
                            "id": uuid4().hex,
                            "span_id": tool_id,
                            "root_span_id": session_id,
                            "span_parents": [uuid],  # child of LLM span
                            "input": tool_input,
                            "output": tool_output[:2000] if tool_output else None,
                            "metadata": {
                                "tool_name": tool_name,
                                "source": "claude-code-jsonl",
                            },
                            "span_attributes": {
                                "name": f"Tool: {tool_name}",
                                "type": "tool",
                            },
                            "created": ts,
                        }
                    )

    return session_id, spans


def upload_spans(project_id, spans):
    """Upload spans to Braintrust in batches of BATCH_SIZE."""
    total = len(spans)
    uploaded = 0
    errors = 0

    for i in range(0, total, BATCH_SIZE):
        batch = spans[i : i + BATCH_SIZE]
        try:
            resp = requests.post(
                f"{API_URL}/v1/project_logs/{project_id}/insert",
                headers=HEADERS,
                json={"events": batch},
            )
            if resp.status_code == 200:
                uploaded += len(batch)
                print(f"  Uploaded {uploaded}/{total} spans")
            else:
                errors += len(batch)
                body = resp.text[:300] if resp.text else "(empty)"
                print(
                    f"  Error uploading batch {i // BATCH_SIZE}: "
                    f"HTTP {resp.status_code} — {body}"
                )
        except requests.RequestException as exc:
            errors += len(batch)
            print(f"  Network error on batch {i // BATCH_SIZE}: {exc}")

    return uploaded, errors


def main():
    if not API_KEY:
        print("Error: BRAINTRUST_API_KEY environment variable is required", file=sys.stderr)
        sys.exit(1)

    if not os.path.isdir(JSONL_DIR):
        print(f"Error: JSONL directory not found: {JSONL_DIR}", file=sys.stderr)
        sys.exit(1)

    print("=== Braintrust Upload ===")
    project_id = get_or_create_project()
    print(f"Project: {PROJECT_NAME} ({project_id})")

    jsonl_files = sorted(glob.glob(os.path.join(JSONL_DIR, "*.jsonl")))
    if not jsonl_files:
        print("No JSONL files found. Nothing to upload.")
        sys.exit(0)

    print(f"Found {len(jsonl_files)} JSONL file(s)\n")

    total_uploaded = 0
    total_errors = 0

    for filepath in jsonl_files:
        filename = os.path.basename(filepath)
        size_mb = os.path.getsize(filepath) / (1024 * 1024)
        print(f"Processing {filename} ({size_mb:.1f} MB)...")

        try:
            session_id, spans = parse_session_to_spans(filepath)
        except Exception as exc:
            print(f"  Failed to parse: {exc}")
            continue

        if not spans:
            print("  No spans found, skipping")
            continue

        label = session_id[:8] if session_id else "unknown"
        print(f"  Parsed {len(spans)} spans for session {label}...")

        uploaded, errors = upload_spans(project_id, spans)
        total_uploaded += uploaded
        total_errors += errors

    print(f"\n=== Done! Uploaded {total_uploaded} spans ({total_errors} errors) ===")
    if total_uploaded:
        print(
            f"View at: https://www.braintrust.dev/app/projects/{PROJECT_NAME}/logs"
        )


if __name__ == "__main__":
    main()
