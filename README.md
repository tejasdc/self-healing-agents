# Do Agents Dream of Electric Sleep?

A bio-inspired maintenance cycle for Claude Code's accumulated `.claude/` configuration.

[**Open the interactive nighttime storybook →**](https://do-agents-dream.pages.dev/)

> [!WARNING]
> This is a research prototype that edits real Claude Code configuration.
> Read [Run a cycle](#run-a-cycle) and [Safety](#safety) before using it.

## The premise

Long-running agents accumulate environmental entropy. Instructions become stale. Hooks break.
Memory grows noisy. Useful workflows remain buried in yesterday's transcripts.

Biological sleep solves a similar maintenance problem through distinct stages. Brains detect
patterns, downscale weak connections, clear waste, repair damage, and recombine memories.

This project applies that sequence to Claude Code. It does not retrain the model.
It improves the configuration the model wakes up with: rules, hooks, skills, and memory.

## One sleep cycle

Daytime Claude Code sessions provide evidence. Braintrust traces supply token usage, tool calls,
and frustration scores. Local JSONL transcripts provide a fallback when Braintrust is unavailable.

```text
daytime traces and local artifacts
                │
                ▼
N1 MEASURE → N2 PRUNE → N3 REPAIR → REM CREATE
                │
                ▼
     updated .claude/ + morning report
```

| Stage | Biological analogy | Agent action |
| --- | --- | --- |
| **N1 · Measure** | Light-sleep pattern detection | Find recurring frustration, repeated commands, errors, token anomalies, and unused artifacts. |
| **N2 · Prune** | Synaptic downscaling | Decay unused artifacts, consolidate duplicates, and prune low-relevance configuration. |
| **N3 · Repair** | Waste clearance and tissue repair | Check hooks, skills, memory references, and temporary files. Repair confirmed faults. |
| **REM · Create** | Memory integration and dreaming | Turn recurring evidence into new rules, hooks, skills, or memory. |

The stages receive escalating capabilities. N1 is read-only. N2 and N3 can modify files.
REM can create new artifacts.

Two mechanisms keep the cycle from overreacting:

- **Two-signal activation:** REM requires the same pattern across two cycles.
- **Trail evaporation:** unused artifacts lose relevance by 10% per cycle.

New artifacts start at `1.0` relevance. Used artifacts receive reinforcement.
Artifacts become prune candidates below `0.2`, after a three-cycle minimum age.

## What it does to `.claude/`

The collector inventories the active Claude Code environment under `~/.claude/`.

| Surface | What the cycle inspects or changes |
| --- | --- |
| `settings.json` | Finds hooks, verifies their commands, and repairs broken paths or permissions. |
| `**/SKILL.md` | Checks skill references and can create a skill from repeated workflows. |
| `projects/*/memory/*.md` and `MEMORY.md` | Finds stale, duplicated, or missing context. |
| `**/CLAUDE.md` | Flags bloat and contradictions, then adds evidence-backed rules. |
| `temp/` | Removes orphaned files older than seven days. |

The cycle stores decisions under `sleep-agent/state/`. Each run also produces:

- structured results in `sleep-agent/state/cycles/<timestamp>/`;
- backups in `sleep-agent/state/backups/<timestamp>/`;
- a morning report in `sleep-agent/reports/`.

## Why this is interesting

Most agent improvement systems change prompts centrally or retrain model weights.
This project treats the agent's working environment as the adaptive layer.

The adaptive layer stays file-based, inspectable, and designed for rollback.
Future sessions inherit its changes through Claude Code's existing extension points.

It also measures adoption instead of creation. A generated skill has no value when unused.
The next cycle checks whether prior artifacts changed actual behavior, then reinforces or prunes them.

## Run a cycle

You need macOS or Linux, Python 3, and an authenticated Claude Code CLI.
The query helper also needs `requests`.

```bash
git clone https://github.com/tejasdc/self-healing-agents.git
cd self-healing-agents

python3 -m venv .venv
source .venv/bin/activate
python -m pip install requests
```

Back up your Claude Code configuration before the first run.

```bash
tar -czf claude-config-before-sleep-agent.tgz -C "$HOME" .claude
```

Run the cycle from the repository root.

```bash
bash sleep-agent/sleep.sh
```

Without Braintrust credentials, N1 falls back to local transcripts in `~/.claude/projects/`.
Set these variables when the `self-healing-sleep` Braintrust project already contains traces:

```bash
export BRAINTRUST_API_KEY="your-key"
export BRAINTRUST_CC_PROJECT="self-healing-sleep"
bash sleep-agent/sleep.sh
```

For new traces, configure Braintrust's current Claude Code tracer first:

```bash
bt login
bt trace setup claude --project self-healing-sleep
```

See the [Braintrust Claude Code marketplace](https://github.com/braintrustdata/braintrust-claude-plugin#trace-claude-code)
for current tracer prerequisites and setup.

### Safety

`sleep.sh` launches its write-capable stages with Claude Code permission checks bypassed.
Run it only from a trusted clone after reviewing the prompts in `sleep-agent/stages/`.

The stage prompts require backups before changes. The orchestrator also backs up its state.
Neither replaces your own full `.claude/` backup.

Do not run `demo/seed-entropy.sh` against a valuable profile. It intentionally inserts stale
memory and temporary files into the active `~/.claude/` directory.

## Measured result

The hackathon demonstration ran the same project-analysis task before and after one cycle.
Braintrust recorded **150,000 tokens before and 60,000 after: a 60% reduction**.

The sleep cycle created targeted memory, pruned stale context, and removed rediscovery work.
The measurement sums the captured LLM token counts for each tagged task run.

The repository does not contain the raw Braintrust trace export. Treat this as the recorded
demonstration result, not an independently reproduced benchmark.

## Explore the project

- [`presentation/index.html`](presentation/index.html) is the interactive nighttime storybook.
- [`sleep-agent/sleep.sh`](sleep-agent/sleep.sh) orchestrates the four stages.
- [`sleep-agent/stages/`](sleep-agent/stages/) contains each stage's operating prompt.
- [`hackathon/measurement-system.md`](hackathon/measurement-system.md) defines the evaluation design.
- [`SYNTHESIS.md`](SYNTHESIS.md) connects the system to 300+ biological and technical sources.
- [`demo/gemini-live-demo/`](demo/gemini-live-demo/) contains the voice-driven morning report.

The project began at the February 2026 Continual Learning Hackathon.
It remains a prototype, but the central idea extends beyond the event:
agents should maintain the environments that shape their future behavior.
