## Inspiration

Every biological organism heals while it sleeps. During sleep, your brain consolidates memories (hippocampal replay), prunes unused synaptic connections (synaptic homeostasis), clears metabolic waste (glymphatic system 10x more active), and even creatively recombines ideas (REM dreaming). Sleep isn't rest — it's the most important maintenance cycle in nature.

We asked: what if AI agents did the same thing?

Claude Code accumulates entropy over time — stale memory entries, unused hooks, bloated CLAUDE.md files, repeated user frustrations that never get addressed. Today, this configuration rot is the user's problem. We were inspired by the idea that agents should heal *themselves* while users sleep, waking up measurably better than the night before.

Our research spanned 300+ sources across neuroscience, immunology, ecology, and distributed systems — from Tononi's synaptic homeostasis hypothesis to termite stigmergy to Alan Kay's cathedral architecture. The common thread: healing in nature always follows staged phases (detect → clean → repair → create), operates locally without central coordination, and gets *stronger* from damage (antifragility, not just resilience).

## What it does

**Sleep Like A Baby** is a bio-inspired maintenance system that runs staged healing cycles on Claude Code's `.claude/` configuration folder while the developer sleeps.

The system has two layers:

**Layer 1 (Daytime — automatic):** A Braintrust CC plugin captures every Claude Code session as traced spans — user prompts, tool invocations, token usage, full conversation history. Three online scorers run on every trace: a FrustrationDetector (Gemini 2.5 Flash as judge), TokenEfficiency scorer, and ToolUsageSummary.

**Layer 2 (Nighttime — the sleep cycle):** A 4-stage pipeline mirrors biological sleep:
- **N1 (Light Sleep / Measure)** — Haiku scans Braintrust metrics + local artifacts to detect frustration clusters, repeated commands, token anomalies, and artifact adoption rates
- **N2 (Medium Sleep / Prune)** — Sonnet applies trail evaporation to remove unused artifacts, consolidate duplicates, and flag bloat
- **N3 (Deep Sleep / Repair)** — Sonnet health-checks hooks, skills, and memory; fixes broken references; cleans orphaned files
- **REM (Dream / Create)** — Opus creates new artifacts (hooks, skills, memory, rules) from confirmed patterns, using two-signal activation to avoid hallucinated improvements

The headline metric: **token reduction on the same task before vs. after a sleep cycle**, visible in the Braintrust dashboard.

## How we built it

The entire system was built in a single hackathon day using Claude Code itself (meta!), with heavy parallelization via subagents.

**Architecture:**
- `sleep.sh` orchestrator — Bash script that chains `claude -p` calls with `--output-format json` and `--json-schema` for structured output at each stage
- 4 stage prompts (markdown) with escalating model tiers and tool permissions (Haiku read-only → Opus full write)
- 4 JSON schemas enforcing structured output per stage
- `query_braintrust.py` — BTQL queries that bridge Braintrust traces to the sleep agent
- `upload_to_braintrust.py` — parsed 7 JSONL conversation files (23MB) into 1,024 Braintrust spans
- `collect_artifacts.py` / `generate_report.py` — artifact snapshots and morning sleep reports
- 2 custom scorers pushed via `braintrust push` (TokenEfficiency, ToolUsageSummary)
- FrustrationDetector configured as Gemini-powered LLMClassifier in Braintrust UI

**Sponsor integration:**
- **Braintrust** — trace capture, online scoring, BTQL aggregation, dashboard visualization
- **Google Gemini** — FrustrationDetector uses Gemini 2.5 Flash as the scorer model via Braintrust's AI proxy
- **Claude Code** — the substrate being healed AND the tool used to build the system

**Research foundation:** 15,000+ lines of research across 42 files covering neuroscience, immunology, distributed systems, and bio-inspired computing.

## Challenges we ran into

**The plugin/sleep-agent boundary was the hardest design decision.** The Braintrust CC plugin already captures token metrics, tool usage, and user prompts per-trace. The sleep agent needs cross-session aggregation, persistent state, and file system writes. Getting the responsibilities cleanly separated — with `query_braintrust.py` as the explicit bridge — took multiple iterations.

**`braintrust push` had undocumented requirements.** The scorer function pattern (`project.scorers.create()` with Pydantic models) wasn't obvious from the docs. We went through several failed attempts before landing on the correct pattern.

**Claude Code's `claude -p` has a ~7KB stdin limit**, so we couldn't pipe intermediate results between stages. Everything had to go through files, which actually turned out cleaner — each stage reads explicit file paths and produces explicit JSON output.

**Two-signal activation creates a cold-start problem.** The first sleep cycle can't create any artifacts because no signals exist in `pending-signals.json` yet. We solved this for the demo by pre-seeding signals via `seed-entropy.sh`, but in production this means the system needs 2+ cycles before it starts creating value.

## Accomplishments that we're proud of

**The biological mapping is real, not just marketing.** Each stage (N1/N2/N3/REM) maps to actual sleep neuroscience — N1 is light sleep (pattern detection), N2 is medium sleep (synaptic downscaling / pruning), N3 is deep sleep (glymphatic waste clearance / repair), REM is dreaming (creative recombination / new artifact generation). Trail evaporation mirrors synaptic homeostasis. Two-signal activation mirrors the immune system's co-stimulation requirement.

**The entire system is traceable.** The sleep agent itself runs through `claude -p`, which means the Braintrust plugin traces the *healing process* too. You can see exactly what each stage measured, decided, and modified.

**It's a real product, not a toy.** The architecture handles Braintrust unavailability (falls back to local JSONL), backs up state files before modifications, enforces least-privilege tool access per stage, and uses structured JSON schemas to prevent runaway outputs.

**The research depth.** 300+ sources synthesized into 15 actionable principles. We didn't just build a maintenance script — we built a system grounded in decades of biological healing research.

## What we learned

**Sleep is the most undervalued mechanism in computing.** Every biological system has maintenance cycles. Computing systems have cron jobs and garbage collection, but AI agents have... nothing. The gap is enormous and the opportunity is clear.

**Staged processing with escalating capability is powerful.** Having Haiku do cheap measurement, Sonnet do focused repair, and Opus do creative synthesis mirrors how biology allocates energy — you don't send your most expensive immune cells to every paper cut.

**Two-signal activation prevents hallucinated improvements.** Without it, the system would create artifacts from single-session noise. Requiring a pattern to appear in two separate cycles before acting on it is the difference between a useful system and a harmful one.

**The best demo is a measurable one.** "Before: 150k tokens. After: 60k tokens. Same task." beats any amount of architectural explanation.

## What's next for Sleep Like A Baby

**Scheduled execution** — Run as a launchd/cron job that triggers automatically when the user's been idle for 30+ minutes. True "healing while you sleep."

**Multi-project learning** — Currently scoped to one project. The architecture supports cross-project pattern detection — if the user makes the same correction across 3 different repos, that's a strong signal.

**Continuous sleep cycles** — Instead of one-shot, run N1→N2→N3→REM in a loop with diminishing returns detection (stop when delta < threshold), like actual sleep cycles that repeat 4-5 times per night.

**Community healing patterns** — Anonymous, aggregated signals across users. If 1,000 developers are all frustrated by the same Claude Code behavior, that's a signal Anthropic should see.

**Deeper Gemini integration** — Gemini Live voice briefing: "Good morning. While you slept, I pruned 3 stale memory entries, fixed a broken hook, and created a new skill from your repeated git workflow. Token usage should drop ~40% on your usual tasks."
