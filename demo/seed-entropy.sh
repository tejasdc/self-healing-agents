#!/bin/bash
set -euo pipefail

# Seed entropy for sleep agent demo
# Creates intentional "mess" in .claude/ that the sleep agent will clean up

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SLEEP_DIR="$SCRIPT_DIR/../sleep-agent"
CLAUDE_DIR="$HOME/.claude"
PROJECT_MEMORY="$CLAUDE_DIR/projects/-Users-tejasdc-workspace-self-healing-agents/memory"

echo "=== Seeding Demo Entropy ==="

# 1. Create stale memory entries (N2 will prune these)
mkdir -p "$PROJECT_MEMORY"

cat > "$PROJECT_MEMORY/stale-api-endpoint.md" << 'MEMEOF'
# Old API Endpoint

The backend API is at http://localhost:3000/api/v1
This was the endpoint used during initial development.
MEMEOF

cat > "$PROJECT_MEMORY/outdated-db-schema.md" << 'MEMEOF'
# Database Schema Notes

The users table has columns: id, name, email, password_hash
The sessions table references users.id as foreign key
Note: This was before the migration to OAuth.
MEMEOF

cat > "$PROJECT_MEMORY/duplicate-paths.md" << 'MEMEOF'
# Important File Paths

- Config: /Users/tejasdc/workspace/self-healing-agents/config.json
- Tests: /Users/tejasdc/workspace/self-healing-agents/tests/
- Docs: /Users/tejasdc/workspace/self-healing-agents/docs/
MEMEOF

echo "  [+] Created 3 stale memory entries"

# 2. Create orphaned temp files (N3 will clean these)
mkdir -p "$CLAUDE_DIR/temp/scripts"
echo "# Temporary debug script from 2 weeks ago" > "$CLAUDE_DIR/temp/scripts/old_debug.py"
echo "# Another orphaned file" > "$CLAUDE_DIR/temp/scripts/scratch_notes.txt"
# Backdate them
touch -t 202602070000 "$CLAUDE_DIR/temp/scripts/old_debug.py"
touch -t 202602050000 "$CLAUDE_DIR/temp/scripts/scratch_notes.txt"

echo "  [+] Created 2 orphaned temp files (backdated)"

# 3. Pre-populate pending-signals.json for two-signal activation
# These signals will "match" what N1 finds, triggering REM to create artifacts
cat > "$SLEEP_DIR/state/pending-signals.json" << 'SIGEOF'
{
  "signals": [
    {
      "signal_id": "sig-frustration-heredoc",
      "type": "frustration",
      "description": "User repeatedly frustrated by heredoc permission prompts in Bash tool",
      "source": "frustration_cluster",
      "first_seen_cycle": "20260220_230000",
      "occurrences": 3,
      "example": "stop using heredocs, write to a temp file instead"
    },
    {
      "signal_id": "sig-repeated-git-status",
      "type": "repeated_command",
      "description": "git status run excessively across sessions (5+ per session average)",
      "source": "repeated_commands",
      "first_seen_cycle": "20260220_230000",
      "occurrences": 5,
      "example": "git status"
    },
    {
      "signal_id": "sig-token-waste-large-reads",
      "type": "token_waste",
      "description": "Large file reads without line limits causing token bloat",
      "source": "token_anomaly",
      "first_seen_cycle": "20260220_230000",
      "occurrences": 4,
      "example": "Reading entire 2000-line files when only needing specific sections"
    }
  ]
}
SIGEOF

echo "  [+] Seeded 3 pending signals for two-signal activation"

# 4. Ensure artifact registry is clean
cat > "$SLEEP_DIR/state/artifact-registry.json" << 'REGEOF'
{ "artifacts": [] }
REGEOF

cat > "$SLEEP_DIR/state/cycle-history.json" << 'HISTEOF'
{ "cycles": [] }
HISTEOF

echo "  [+] Reset state files"

echo ""
echo "=== Entropy seeded! ==="
echo "Now run the demo task (before sleep), then sleep.sh, then demo task again."
