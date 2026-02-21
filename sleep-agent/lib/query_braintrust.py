"""Query Braintrust for pre-computed metrics from CC plugin traces."""

import os, json, requests, sys
from datetime import datetime

API_URL = "https://api.braintrust.dev"
PROJECT_NAME = os.environ.get("BRAINTRUST_CC_PROJECT", "self-healing-sleep")


def btql(query: str, headers: dict) -> list[dict]:
    resp = requests.post(
        f"{API_URL}/btql",
        headers=headers,
        json={"query": query, "fmt": "json"},
    )
    resp.raise_for_status()
    return resp.json().get("data", [])


def resolve_project_id(headers: dict) -> str:
    """Resolve project name to UUID (BTQL requires UUID, not name)."""
    resp = requests.get(
        f"{API_URL}/v1/project",
        headers=headers,
        params={"project_name": PROJECT_NAME},
    )
    resp.raise_for_status()
    for p in resp.json().get("objects", []):
        if p["name"] == PROJECT_NAME:
            return p["id"]
    raise ValueError(f"Project '{PROJECT_NAME}' not found in Braintrust")


def main():
    api_key = os.environ.get("BRAINTRUST_API_KEY")
    if not api_key:
        print("Error: BRAINTRUST_API_KEY not set", file=sys.stderr)
        sys.exit(1)

    headers = {"Authorization": f"Bearer {api_key}"}
    project_id = resolve_project_id(headers)
    print(f"Resolved project '{PROJECT_NAME}' -> {project_id}", file=sys.stderr)

    token_usage = btql(f"""
        SELECT root_span_id AS session_id,
               sum(metrics.tokens) AS total_tokens,
               sum(metrics.prompt_tokens) AS prompt_tokens,
               sum(metrics.completion_tokens) AS completion_tokens,
               count(1) AS llm_calls
        FROM project_logs('{project_id}')
        WHERE span_attributes.type = 'llm'
          AND created > now() - interval 7 day
        GROUP BY root_span_id
        ORDER BY total_tokens DESC
    """, headers)

    tool_usage = btql(f"""
        SELECT metadata.tool_name AS tool_name,
               count(1) AS invocation_count
        FROM project_logs('{project_id}')
        WHERE span_attributes.type = 'tool'
          AND created > now() - interval 7 day
        GROUP BY metadata.tool_name
        ORDER BY invocation_count DESC
    """, headers)

    frustration_scores = btql(f"""
        SELECT root_span_id AS session_id,
               avg(scores.FrustrationDetector) AS avg_frustration,
               max(scores.FrustrationDetector) AS max_frustration
        FROM project_logs('{project_id}')
        WHERE scores.FrustrationDetector IS NOT NULL
          AND created > now() - interval 7 day
        GROUP BY root_span_id
        HAVING avg_frustration > 0.3
        ORDER BY avg_frustration DESC
    """, headers)

    bash_commands = btql(f"""
        SELECT input AS command_input, root_span_id AS session_id
        FROM project_logs('{project_id}')
        WHERE metadata.tool_name = 'Bash'
          AND created > now() - interval 7 day
        LIMIT 500
    """, headers)

    output = {
        "token_usage": token_usage,
        "tool_usage": tool_usage,
        "frustration_scores": frustration_scores,
        "bash_commands": bash_commands,
        "query_timestamp": datetime.now().isoformat(),
    }

    out_path = sys.argv[1] if len(sys.argv) > 1 else "/dev/stdout"
    with open(out_path, "w") as f:
        json.dump(output, f, indent=2)


if __name__ == "__main__":
    main()
