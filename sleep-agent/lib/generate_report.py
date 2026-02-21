"""Generate morning sleep report from cycle results."""

import json, sys, os
from datetime import datetime


def read_json(path):
    try:
        with open(path) as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return {}


def generate(work_dir, output_path):
    n1 = read_json(os.path.join(work_dir, "n1-result.json"))
    n2 = read_json(os.path.join(work_dir, "n2-result.json"))
    n3 = read_json(os.path.join(work_dir, "n3-result.json"))
    rem = read_json(os.path.join(work_dir, "rem-result.json"))
    bt = read_json(os.path.join(work_dir, "bt-metrics.json"))

    timestamp = os.path.basename(work_dir)
    lines = []
    lines.append(f"# Sleep Report — {timestamp}")
    lines.append(f"Generated: {datetime.now().isoformat()}\n")

    # Summary
    lines.append("## Summary")
    lines.append(f"- Sessions scanned: {n1.get('sessions_scanned', 'N/A')}")
    bt_avail = bt.get("error") != "braintrust_unavailable" if bt else False
    lines.append(f"- Braintrust available: {bt_avail}")
    lines.append(f"- Artifacts evaluated: {n2.get('artifacts_evaluated', 'N/A')}")
    lines.append(f"- Artifacts pruned: {len(n2.get('artifacts_pruned', []))}")
    lines.append(f"- Repairs made: {len(n3.get('repairs_made', []))}")
    lines.append(f"- New artifacts created: {len(rem.get('artifacts_created', []))}")
    lines.append("")

    # Token Health
    lines.append("## Token Health")
    token_usage = n1.get("token_usage", [])
    if token_usage:
        totals = [t.get("total_tokens", 0) for t in token_usage]
        lines.append(f"- Sessions tracked: {len(totals)}")
        lines.append(f"- Total tokens (all sessions): {sum(totals):,}")
        lines.append(f"- Avg tokens/session: {sum(totals) // max(len(totals), 1):,}")
        anomalies = [t for t in token_usage if t.get("anomaly")]
        if anomalies:
            lines.append(f"- Token anomalies: {len(anomalies)}")
            for a in anomalies[:3]:
                lines.append(f"  - Session {a['session_id'][:8]}...: {a['total_tokens']:,} tokens")
    else:
        lines.append("- No token data available")
    lines.append("")

    # Frustration Patterns
    lines.append("## Frustration Patterns")
    clusters = n1.get("frustration_clusters", [])
    if clusters:
        for c in clusters:
            severity = c.get("severity", "unknown")
            lines.append(f"- **{c.get('topic', 'Unknown')}** ({severity}, {c.get('occurrences', 0)} occurrences)")
            for q in c.get("example_quotes", [])[:2]:
                lines.append(f"  > {q}")
    else:
        lines.append("- No frustration patterns detected")
    lines.append("")

    # Artifacts Pruned
    lines.append("## Artifacts Pruned (N2)")
    pruned = n2.get("artifacts_pruned", [])
    if pruned:
        for p in pruned:
            lines.append(f"- **{p.get('name', p.get('artifact_id', 'unknown'))}**: {p.get('reason', 'N/A')} ({p.get('action', 'N/A')})")
    else:
        lines.append("- No artifacts pruned")
    lines.append("")

    # Repairs Made
    lines.append("## Repairs Made (N3)")
    repairs = n3.get("repairs_made", [])
    if repairs:
        for r in repairs:
            verified = "verified" if r.get("verified") else "unverified"
            lines.append(f"- **{r.get('target', 'unknown')}**: {r.get('issue', 'N/A')} → {r.get('fix', 'N/A')} ({verified})")
    else:
        lines.append("- No repairs needed")
    health = n3.get("health_checks", {})
    if health:
        hooks = health.get("hooks", {})
        lines.append(f"\nHook health: {hooks.get('healthy', 0)}/{hooks.get('total', 0)} healthy, {hooks.get('broken', 0)} broken")
    lines.append("")

    # New Artifacts
    lines.append("## New Artifacts Created (REM)")
    created = rem.get("artifacts_created", [])
    if created:
        for a in created:
            lines.append(f"- **{a.get('name', 'unknown')}** ({a.get('type', 'unknown')}): {a.get('description', 'N/A')}")
            lines.append(f"  - Path: `{a.get('file_path', 'N/A')}`")
            lines.append(f"  - Confidence: {a.get('confidence', 'N/A')}")
    else:
        lines.append("- No new artifacts created")
    lines.append("")

    # Deferred Signals
    deferred = rem.get("signals_deferred", [])
    if deferred:
        lines.append("## Signals Deferred (pending two-signal confirmation)")
        for s in deferred:
            lines.append(f"- {s.get('description', 'unknown')} (source: {s.get('source', 'N/A')})")
        lines.append("")

    report = "\n".join(lines)
    with open(output_path, "w") as f:
        f.write(report)
    print(f"Report written to {output_path}")


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: generate_report.py <work_dir> <output_path>", file=sys.stderr)
        sys.exit(1)
    generate(sys.argv[1], sys.argv[2])
