# Measurement System Design

Synthesized from all research docs, user requirements, hackathon strategy, Cleric.ai patterns, and Braintrust CC plugin analysis.

---

## Core Measurement Principle

**Adoption is the metric, not existence.** We don't prove value by showing "we created a rule." We prove value by showing "the agent used that rule and it reduced token usage." Inspired by Cleric.ai's 92% actionable findings rate — every suggestion must be trackable to actual usage.

---

## Signal Sources

### Source 1: Braintrust Traces (via CC Plugin — already captured for free)

The `trace-claude-code` plugin (all bash, async hooks) captures a structured trace hierarchy for every session:

```
Session Span (type: "task")
│  metadata: { session_id, workspace, hostname, username, os, source }
│
├── Turn Span (type: "task")
│   input = full user prompt text (untruncated)
│
│   ├── LLM Span (type: "llm")
│   │   input = [full conversation history array]
│   │   output = { role: "assistant", content, tool_calls }
│   │   metrics = { start, end, prompt_tokens, completion_tokens, tokens }
│   │   metadata = { model: "claude-sonnet-4-5-20251022" }
│   │
│   ├── Tool Span (type: "tool")
│   │   input = full tool input JSON
│   │   output = full tool response JSON
│   │   metadata = { tool_name: "Bash" }
│   │   span_attributes.name = "Terminal: git status" | "Read: config.py" | etc.
│   │
│   └── LLM Span (type: "llm") — after tool results
│       input = [conversation + tool results]
│       metrics = { prompt_tokens, completion_tokens, tokens }
```

**What this gives us for free:**
- Token usage per LLM call (prompt_tokens, completion_tokens, tokens)
- Every tool invocation with full I/O
- Full user prompts (correction patterns visible)
- Full assistant reasoning (adoption signals visible)
- Timestamps for duration analysis
- Model identifier per call

**Plugin config:** `~/.claude/settings.json`
```json
{
  "env": {
    "TRACE_TO_BRAINTRUST": "true",
    "BRAINTRUST_CC_PROJECT": "self-healing-sleep",
    "BRAINTRUST_API_KEY": "sk-..."
  }
}
```

### Source 2: Local JSONL Transcripts
**Location:** `~/.claude/projects/<project-hash>/<session-id>.jsonl`
**Same data as Braintrust traces** but local. Each line: `{ type: "user"|"assistant", timestamp, message: { content, model, usage } }`.
The sleep agent can read these directly without API calls. The Stop hook tracks `turn_last_line` so it processes incrementally.

### Source 3: .claude/ Folder State
CLAUDE.md, memory/, rules/, skills/, hooks/ — the artifacts we create and track.

---

## 6 Artifact Types We Track

Each artifact the sleep agent creates or modifies is tracked for **adoption** — was it actually used?

### 1. Hooks
**What:** PreToolUse/PostToolUse shell commands or prompt hooks.
**Creation:** Sleep agent writes hook scripts, registers in hooks.json.
**Adoption signal:** Hook fires → appears as a tool span or modifies tool behavior in Braintrust traces.
**Metric:** `hook_invocation_count` per hook per session. If a hook fires 0 times across 10 sessions, it's dead weight.

### 2. Skills
**What:** SKILL.md files loaded on demand by the agent.
**Creation:** Sleep agent creates skill files for recurring task patterns.
**Adoption signal:** Agent invokes the skill → visible in transcript as Skill tool call or in assistant reasoning.
**Metric:** `skill_invocation_count` per skill per session.

### 3. Memory
**What:** Auto-memory entries in `~/.claude/projects/.../memory/`.
**Creation:** Sleep agent adds/consolidates memory entries.
**Adoption signal:** Agent references memory content in its thinking → searchable in LLM span `input` arrays (conversation history).
**Metric:** `memory_reference_count` — how often each memory entry's content appears in agent reasoning.

### 4. Rules
**What:** Path-specific rules in `.claude/rules/`.
**Creation:** Sleep agent adds rules for specific directories/file patterns.
**Adoption signal:** Rules auto-load when agent works in matching paths → visible in LLM span input (injected context).
**Metric:** `rule_reference_count` — how often the rule's content appears in conversation context.

### 5. CLAUDE.md Sections
**What:** Behavioral specification sections added/edited.
**Creation:** Sleep agent adds rules like "Always use uv, not pip" to CLAUDE.md.
**Adoption signal:** Agent follows the rule in its reasoning → searchable in LLM span output (assistant messages).
**Metric:** `section_influence_count` — evidence the agent's behavior changed because of the section.

### 6. Multi-Agent Opinions
**What:** Second opinions from Gemini CLI / Codex during developer workflow.
**Captured by:** CC plugin traces tool calls to external agents (Bash calls to gemini-cli, MCP calls to Codex).
**Adoption signal:** Claude's subsequent reasoning says "using Gemini's approach" or "rejecting Codex's suggestion."
**Metric:** `acceptance_rate` per agent, `agreement_rate` when both consulted.

### 7. User Frustration Signals
**What:** User corrections, negations, rephrasing, explicit complaints.
**Detection patterns in transcripts:**
- Negation after assistant message: "no", "that's wrong", "not what I asked"
- Rephrasing: user repeats same intent with different wording within 2 turns
- Explicit frustration: "I already told you", "why did you...", "stop doing..."
- Correction followed by the same correction in a later session = recurring frustration

**What sleep agent does with this:**
- Cluster frustration signals by semantic similarity (LLM: "are these about the same issue?")
- Single frustration = log only (could be one-off)
- Same frustration class across 3+ sessions = propose a fix:
  - If it's about agent behavior → CLAUDE.md rule
  - If it's about tool misuse → PreToolUse hook
  - If it's about missing context → memory entry
- **Metric:** `frustration_frequency` per cluster, trending over time. Success = frequency drops to 0 after fix applied.

**Braintrust detection:** Search Turn span `input` fields (user prompts) for correction/frustration patterns. Can use pure Python scorer (regex for common negation patterns) or LLMClassifier for semantic detection.

### 8. Repeated Commands → Custom Command Proposals
**What:** User repeatedly types the same bash command sequences or workflow patterns across sessions.
**Detection:** Scan Bash tool spans across sessions. Cluster by command similarity.

**Examples:**
- User runs `docker compose up -d && sleep 3 && npm test` in 8/10 sessions → propose `/test` custom command
- User always does `git stash && git pull && git stash pop` → propose `/sync` command
- User runs `python manage.py migrate && python manage.py runserver` → propose `/dev` command

**What sleep agent does:**
- Extract all Bash tool span inputs across recent sessions
- Cluster by command text similarity (exact match or fuzzy with Levenshtein)
- Commands appearing in 5+ sessions = candidate for custom command/skill
- Sleep agent proposes a skill with the command sequence, names it based on intent
- **Metric:** `command_repetition_count` — how many times the same command appears. After skill creation, track if user adopts the skill instead.

**Braintrust detection:** Filter tool spans where `metadata.tool_name = "Bash"`, extract `input.command`, cluster and count.

### 9. Token Usage Metrics
**What:** Token consumption per session, per turn, per LLM call — the objective efficiency signal.
**Already captured:** CC plugin logs `prompt_tokens`, `completion_tokens`, `tokens` on every LLM span. Also `metrics.start` and `metrics.end` for duration.

**Trackable dimensions:**
| Metric | How Computed | What It Tells Us |
|--------|-------------|-----------------|
| Total tokens per session | `sum(metrics.tokens)` across all LLM spans in session | Overall efficiency |
| LLM calls per session | `count(*)` of LLM spans | How many round-trips needed |
| Tokens per turn | `sum(tokens)` grouped by parent turn span | Which turns are expensive |
| Prompt vs completion ratio | `prompt_tokens / completion_tokens` | Context bloat detection |
| Token trend over time | Session totals plotted chronologically | Is the agent getting more efficient? |

**What sleep agent does with this:**
- N1 computes token baselines per task type
- If a session burns >2x the baseline for its task type → flag as inefficient
- Correlate high-token sessions with: missing rules, missing memory, repeated file reads
- After healing (adding rules/memory), compare token usage on same task type
- **Metric:** `token_efficiency_ratio = tokens_after / tokens_before` for same task class

**BTQL queries:**
```sql
-- Token usage per session over time
dimensions: span_id as session
measures:
  sum(metrics.tokens) as total_tokens,
  count(1) as llm_calls
from: project_logs('self-healing-sleep')
filter: span_attributes.type = 'llm'

-- Before vs after comparison
dimensions: metadata.phase as phase
measures:
  sum(metrics.tokens) as total_tokens,
  sum(metrics.prompt_tokens) as prompt_tokens,
  count(1) as llm_calls
from: project_logs('self-healing-sleep')
filter: span_attributes.type = 'llm' AND tags includes 'demo-task'
```

---

## Sleep Cycle Mapping

### N1 — Light Sleep: MEASURE (Hippocampal Replay)

**Bio analog:** Brain replays the day's experiences to identify which synapses fired.

**What happens:**
1. Scan recent Braintrust traces OR local JSONL transcripts
2. For each of our 6 artifact types, count utilization:
   - Which hooks fired? How many times?
   - Which skills were invoked?
   - Which memory entries appeared in agent reasoning?
   - Which rules were loaded and referenced?
   - Which CLAUDE.md sections influenced behavior?
   - Which multi-agent opinions were requested? Accepted? Rejected?
3. Compute token usage per session (from LLM span metrics)
4. Detect patterns: recurring errors, repeated corrections, user frustration

**Output:** Utilization scorecard + pattern detection report.

**Model:** Haiku (fast, cheap — surface scanning).

### N2 — Medium Sleep: PRUNE (Synaptic Homeostasis)

**Bio analog:** Sleep selectively downscales weak synapses, preserves strong ones. Trail evaporation.

**What happens:**
1. Take N1's utilization scorecard
2. Apply trail evaporation:
   ```
   relevance(t+1) = (1 - 0.1) * relevance(t) + reinforcement
   Where reinforcement = 1.0 if used last cycle, 0.0 if not
   Prune when relevance < 0.2
   ```
3. Identify prune candidates:
   - Memory entries with 0 references across 20+ sessions → prune
   - CLAUDE.md sections never referenced → candidate for removal
   - Hooks that never fire → remove
   - Duplicate memories → consolidate
   - Contradictory rules → resolve
4. Execute pruning (with backup)

**Output:** Pruning actions (each traced + scored in Braintrust).

**Model:** Sonnet (deeper analysis for consolidation decisions).

### N3 — Deep Sleep: REPAIR (Immune Patrol + Glymphatic Clearance)

**Bio analog:** Microglia scan for broken things and clear metabolic waste.

**What happens:**
1. Health check existing artifacts:
   - Do hooks execute without errors? (Run in dry-run mode)
   - Do skills parse correctly? Reference real files?
   - Are memory entries still accurate vs current project state?
2. Workspace cleanup:
   - Orphaned temp files in ~/.claude/temp/
   - Stale caches
   - Deprecated configs
3. Negative trace consolidation:
   - Failed approaches from transcripts → create anti-pattern entries
   - "Never do X because Y" rules from repeated failures

**Output:** Repair actions (each traced + scored in Braintrust).

**Model:** Sonnet (health scans, repair proposals).

### REM — Dream: CREATE (Creative Recombination)

**Bio analog:** REM dreaming enables creative problem-solving through relaxed constraints.

**What happens:**
1. Based on patterns found in N1:
   - Recurring user correction → propose new CLAUDE.md rule
   - Recurring tool failure → propose new hook
   - Knowledge gap → propose new memory entry
   - Complex recurring task → propose new skill
2. Two-signal activation (Principle #15):
   - Signal 1 detected this cycle → log only
   - Same signal persists from PREVIOUS cycle → now create the artifact
   - Prevents over-reaction to one-off issues
3. Tag each new artifact with creation metadata:
   - `created_by: sleep-agent`
   - `sleep_cycle: N`
   - `confidence: 0.65|0.85|0.95`
   - `pattern_source: [session_ids]`

**Output:** New artifacts + dream report for morning briefing.

**Model:** Opus (creative reasoning, complex pattern synthesis).

---

## The Token Reduction Use Case (Primary Demo Proof)

The strongest demo metric. Completely objective — no LLM judging itself.

**How it works:**
1. Run a task BEFORE healing (baseline) — CC plugin logs token usage to Braintrust
2. Sleep agent runs, creates artifacts (rules, hooks, memory)
3. Run the SAME task AFTER healing — CC plugin logs token usage again
4. Compare: fewer tokens = agent got it right faster

**Why tokens are the right metric:**
- Hard number, not subjective
- Already captured by CC plugin (prompt_tokens, completion_tokens on every LLM span)
- Fewer tokens = fewer LLM calls = less fumbling = more efficient
- Directly maps to cost savings (tokens = money)

**BTQL query:**
```sql
dimensions: metadata.phase as phase
measures:
  sum(metrics.tokens) as total_tokens,
  sum(metrics.prompt_tokens) as prompt_tokens,
  sum(metrics.completion_tokens) as completion_tokens,
  count(1) as llm_calls
from: project_logs('self-healing-sleep')
filter: span_attributes.type = 'llm' AND tags includes 'demo-task'
```

**Expected result:**
| phase | total_tokens | llm_calls |
|-------|-------------|-----------|
| before | 45,000 | 23 |
| after | 18,000 | 9 |

**Headline:** "60% token reduction on the same task after one sleep cycle."

**Seeding for demo:** Run the same task twice (before/after), tag traces appropriately. Real data, not synthetic.

---

## Braintrust Integration Map

### What CC Plugin Gives Us (zero extra code)

| Signal | Where in Braintrust | Span Type |
|--------|-------------------|-----------|
| Token usage per LLM call | `metrics.prompt_tokens`, `metrics.completion_tokens`, `metrics.tokens` | `llm` |
| Tool invocations | `metadata.tool_name`, `input`, `output` | `tool` |
| Full user prompts | Turn span `input` field | `task` |
| Full assistant reasoning | LLM span `output.content` | `llm` |
| Conversation history | LLM span `input` array (all prior messages) | `llm` |
| Session metadata | Session span `metadata` (workspace, hostname, user) | `task` |
| Timestamps | `metrics.start`, `metrics.end`, `created` | all |

### What We Add

| What | How | Purpose |
|------|-----|---------|
| Adoption scores | Python scorers querying subsequent traces | Track if artifacts are used |
| Healing action scores | LLMClassifier via autoevals | Rate quality of sleep agent actions |
| Phase tags | `metadata.phase = "before"|"after"` on seeded traces | Before/after comparison |
| Artifact tags | `metadata.artifact_type = "hook"|"skill"|"memory"|"rule"|"claudemd"` | Filter by artifact type |
| Sleep cycle tags | `metadata.sleep_stage = "N1"|"N2"|"N3"|"REM"` | Track what happened in each stage |

### Scoring Approaches

**Pure Python scorers (no LLM, fast):**
- Hook invocation counter
- Skill invocation counter
- Token usage comparison (before vs after)
- Memory reference detector (string search in transcripts)

**LLM-as-judge scorers (via autoevals LLMClassifier):**
- Healing action quality (is this a good rule/hook/memory?)
- Multi-agent opinion value (was the external opinion useful?)

**Online scoring (configured in Braintrust UI):**
- Runs automatically when new traces arrive
- Async, zero latency impact on coding sessions
- Can retroactively score past traces

### Key API Operations

**Logging sleep agent actions:**
```python
import braintrust

logger = braintrust.init_logger(project="self-healing-sleep")

with logger.start_span(name="sleep-cycle-N2-prune") as span:
    span.log(
        input={"artifact": "memory-entry-X", "utilization": 0},
        output={"action": "pruned", "reason": "0 references in 25 sessions"},
        metadata={"sleep_stage": "N2", "artifact_type": "memory"},
        tags=["sleep-cycle", "prune"],
    )
    # Score the action
    score = healing_scorer(input=..., output=...)
    span.log(scores={"HealingActionQuality": score.score})
```

**Querying adoption data (Python SDK):**
```python
import braintrust

client = braintrust.init(project="self-healing-sleep")
# Fetch recent traces, filter by tool type, count invocations
# Use for N1 measurement phase
```

**Seeding demo data (REST API):**
```python
requests.post(
    f"{api_url}/v1/project_logs/{project_id}/insert",
    headers={"Authorization": f"Bearer {api_key}"},
    json={"events": [{
        "id": str(uuid.uuid4()),
        "input": {"task": "Fix auth bug"},
        "metrics": {"tokens": 45000, "prompt_tokens": 38000},
        "metadata": {"phase": "before"},
        "tags": ["demo-task", "before"],
    }]}
)
```

---

## Composite Metrics

### Actionable Findings Rate (Cleric-inspired)
```
actionable_rate = artifacts_adopted / artifacts_created

Where adopted = referenced in at least 1 subsequent session
Target: > 0.7 (70% of what we create gets used)
```

### Token Efficiency Ratio
```
token_efficiency = tokens_after / tokens_before

For the same task class. Target: < 0.5 (50%+ reduction)
```

### Healing Confidence Tiering (Cleric-inspired compound scoring)
Not just occurrence count — combine multiple signals:

| Factor | Weight | Signal |
|--------|--------|--------|
| Occurrence count | 0.3 | How many times pattern seen |
| Cross-session confirmation | 0.3 | Same pattern in different sessions |
| Error severity | 0.2 | Did it cause tool failure or just user correction? |
| Multi-agent agreement | 0.2 | Did Gemini/Codex independently flag same issue? |

Combined confidence determines action:
| Confidence | Action |
|-----------|--------|
| < 0.45 | Log only |
| 0.45 - 0.70 | Queue for morning briefing |
| > 0.70 | Auto-apply with backup |

### Trail Evaporation
```
relevance(t+1) = (1 - decay_rate) * relevance(t) + reinforcement

decay_rate = 0.1 per sleep cycle
reinforcement = 1.0 if artifact used in last session, 0.0 if not
Prune threshold: relevance < 0.2
```

---

## Hackathon Demo Plan

### What We Show

1. **Before task:** Run a coding task with CC plugin active. Braintrust captures traces. Note token count.
2. **Sleep cycle runs:** Visible in Braintrust — N1 measures, N2 prunes, N3 repairs, REM creates.
3. **After task:** Run same task again. CC plugin captures new traces. Note reduced token count.
4. **Dashboard:** Braintrust shows before/after — "60% token reduction."
5. **Voice briefing:** Gemini Live reads the sleep report — "Good morning, here's what healed overnight."
6. **Multi-agent:** Show opinion tracking — which agent's advice was adopted.

### Build Priority

| Component | Priority | Time | Proves |
|-----------|----------|------|--------|
| CC plugin setup + verify traces flow | P0 | 10 min | Infrastructure works |
| Sleep agent N1 (transcript scan + measurement) | P0 | 30 min | We can detect patterns |
| Sleep agent REM (create rules from patterns) | P0 | 20 min | We can heal |
| Before/after task run + token comparison | P0 | 20 min | Hard proof of improvement |
| Seed demo data if live run insufficient | P1 | 15 min | Dashboard visual |
| Multi-agent opinion tracking | P1 | 20 min | Google sponsor + degeneracy |
| Gemini Live voice briefing | P1 | 30 min | Google sponsor + experience |
| N2 pruning + N3 repair | P2 | 20 min | Full sleep cycle |
| Flora presentation | P2 | 15 min | Third sponsor |

### What Constitutes "Proof"

1. **Token reduction number** — the headline (objective, hard)
2. **Braintrust dashboard** — time series chart (visual)
3. **Before/after CLAUDE.md diff** — tangible (visible)
4. **Artifact adoption rate** — created 5 artifacts, 4 were used (trackable)
5. **Multi-agent acceptance rates** — which agent is useful for what (novel)
6. **Voice briefing** — experiential (memorable)
