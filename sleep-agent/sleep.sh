#!/bin/bash
set -euo pipefail

SLEEP_DIR="$(cd "$(dirname "$0")" && pwd)"
STATE_DIR="$SLEEP_DIR/state"
REPORTS_DIR="$SLEEP_DIR/reports"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
WORK_DIR="$STATE_DIR/cycles/$TIMESTAMP"

mkdir -p "$WORK_DIR" "$REPORTS_DIR" "$STATE_DIR/backups/$TIMESTAMP"

echo "=== Sleep Cycle $TIMESTAMP ==="

# Back up state files before any modifications
cp "$STATE_DIR/artifact-registry.json" "$STATE_DIR/backups/$TIMESTAMP/artifact-registry.json" 2>/dev/null || true
cp "$STATE_DIR/pending-signals.json" "$STATE_DIR/backups/$TIMESTAMP/pending-signals.json" 2>/dev/null || true
cp "$STATE_DIR/cycle-history.json" "$STATE_DIR/backups/$TIMESTAMP/cycle-history.json" 2>/dev/null || true

# Step 0: Query Braintrust for aggregated metrics
echo "[Step 0] Querying Braintrust for pre-computed metrics..."
python3 "$SLEEP_DIR/lib/query_braintrust.py" "$WORK_DIR/bt-metrics.json" || {
    echo "[Step 0] Braintrust query failed, N1 will fall back to local JSONL"
    echo '{"error": "braintrust_unavailable"}' > "$WORK_DIR/bt-metrics.json"
}

# Step 0b: Collect current artifact state
python3 "$SLEEP_DIR/lib/collect_artifacts.py" > "$WORK_DIR/artifacts.json"

# Step 1: N1 — MEASURE (Haiku)
echo "[Step 1] N1: Measuring..."
claude -p "$(cat "$SLEEP_DIR/stages/n1-measure.md")

## File Paths — use the Read tool to load each of these files before proceeding:
- Braintrust metrics: $WORK_DIR/bt-metrics.json
- Current artifacts: $WORK_DIR/artifacts.json
- Pending signals: $STATE_DIR/pending-signals.json
- Artifact registry: $STATE_DIR/artifact-registry.json" \
  --model claude-haiku-4-5-20251001 \
  --output-format json \
  --json-schema "$SLEEP_DIR/schemas/n1-output.json" \
  --max-turns 3 \
  --allowedTools Read,Glob,Grep \
  --dangerously-skip-permissions \
  > "$WORK_DIR/n1-result.json"

# Step 2: N2 — PRUNE (Sonnet)
echo "[Step 2] N2: Pruning..."
claude -p "$(cat "$SLEEP_DIR/stages/n2-prune.md")

## File Paths — use the Read tool to load each of these files before proceeding:
- N1 results: $WORK_DIR/n1-result.json
- Artifact registry: $STATE_DIR/artifact-registry.json
- Cycle history: $STATE_DIR/cycle-history.json

Backup directory for pruned files: $STATE_DIR/backups/$TIMESTAMP/" \
  --model claude-sonnet-4-5-20251022 \
  --output-format json \
  --json-schema "$SLEEP_DIR/schemas/n2-output.json" \
  --max-turns 3 \
  --allowedTools Read,Glob,Grep,Edit,Write,Bash \
  --dangerously-skip-permissions \
  > "$WORK_DIR/n2-result.json"

# Step 3: N3 — REPAIR (Sonnet)
echo "[Step 3] N3: Repairing..."
claude -p "$(cat "$SLEEP_DIR/stages/n3-repair.md")

## File Paths — use the Read tool to load each of these files before proceeding:
- N1 results: $WORK_DIR/n1-result.json
- N2 results: $WORK_DIR/n2-result.json
- Artifact registry: $STATE_DIR/artifact-registry.json

Backup directory: $STATE_DIR/backups/$TIMESTAMP/" \
  --model claude-sonnet-4-5-20251022 \
  --output-format json \
  --json-schema "$SLEEP_DIR/schemas/n3-output.json" \
  --max-turns 3 \
  --allowedTools Read,Glob,Grep,Edit,Write,Bash \
  --dangerously-skip-permissions \
  > "$WORK_DIR/n3-result.json"

# Step 4: REM — CREATE (Opus)
echo "[Step 4] REM: Dreaming..."
claude -p "$(cat "$SLEEP_DIR/stages/rem-create.md")

## File Paths — use the Read tool to load each of these files before proceeding:
- N1 results: $WORK_DIR/n1-result.json
- N2 results: $WORK_DIR/n2-result.json
- N3 results: $WORK_DIR/n3-result.json
- Pending signals: $STATE_DIR/pending-signals.json
- Artifact registry: $STATE_DIR/artifact-registry.json

Sleep cycle timestamp: $TIMESTAMP" \
  --model claude-opus-4-6 \
  --output-format json \
  --json-schema "$SLEEP_DIR/schemas/rem-output.json" \
  --max-turns 5 \
  --allowedTools Read,Glob,Grep,Edit,Write,Bash \
  --dangerously-skip-permissions \
  > "$WORK_DIR/rem-result.json"

# Step 5: Generate report
echo "[Step 5] Generating sleep report..."
python3 "$SLEEP_DIR/lib/generate_report.py" \
  "$WORK_DIR" "$REPORTS_DIR/sleep-report-$TIMESTAMP.md"

echo "=== Sleep cycle complete ==="
echo "Report: $REPORTS_DIR/sleep-report-$TIMESTAMP.md"
