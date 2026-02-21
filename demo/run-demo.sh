#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SLEEP_DIR="$SCRIPT_DIR/../sleep-agent"
DEMO_DIR="$SCRIPT_DIR"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
RESULTS_DIR="$DEMO_DIR/results/$TIMESTAMP"

mkdir -p "$RESULTS_DIR"

echo "=========================================="
echo "  Self-Healing Agent Demo"
echo "  $(date)"
echo "=========================================="
echo ""

# Step 1: Seed entropy
echo "[Step 1/5] Seeding demo entropy..."
bash "$DEMO_DIR/seed-entropy.sh"
echo ""

# Step 2: Run demo task BEFORE sleep
echo "[Step 2/5] Running demo task BEFORE sleep cycle..."
echo "  (This captures baseline token usage)"
claude -p "$(cat "$DEMO_DIR/demo-task.md")" \
  --output-format json \
  --max-turns 5 \
  --dangerously-skip-permissions \
  > "$RESULTS_DIR/before-sleep.json" 2>"$RESULTS_DIR/before-sleep.stderr"
echo "  Saved to: $RESULTS_DIR/before-sleep.json"
echo ""

# Step 3: Run sleep cycle
echo "[Step 3/5] Running sleep cycle..."
bash "$SLEEP_DIR/sleep.sh"
echo ""

# Step 4: Run SAME demo task AFTER sleep
echo "[Step 4/5] Running demo task AFTER sleep cycle..."
echo "  (This captures post-sleep token usage)"
claude -p "$(cat "$DEMO_DIR/demo-task.md")" \
  --output-format json \
  --max-turns 5 \
  --dangerously-skip-permissions \
  > "$RESULTS_DIR/after-sleep.json" 2>"$RESULTS_DIR/after-sleep.stderr"
echo "  Saved to: $RESULTS_DIR/after-sleep.json"
echo ""

# Step 5: Compare
echo "[Step 5/5] Results comparison"
echo "=========================================="
echo "Before sleep: $RESULTS_DIR/before-sleep.json"
echo "After sleep:  $RESULTS_DIR/after-sleep.json"
echo ""
echo "Check Braintrust dashboard for token comparison:"
echo "  https://www.braintrust.dev"
echo ""
echo "Sleep report is in: $SLEEP_DIR/reports/"
LATEST_REPORT=$(ls -t "$SLEEP_DIR/reports/"*.md 2>/dev/null | head -1)
if [ -n "${LATEST_REPORT:-}" ]; then
  echo "Latest report: $LATEST_REPORT"
fi
echo "=========================================="
echo "Demo complete!"
