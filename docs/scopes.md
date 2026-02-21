# Scopes

Potential MVP scopes for the hackathon demo. Each scope is a self-contained deliverable that demonstrates core principles.

---

## Scope 1: Claude Code Sleep Cycle (Primary Candidate)

### Name Ideas
- Claude Code Sleep
- Claude Code Rest
- Cloud Code Sleep (play on Cloud + Claude)
- (Open to brainstorming more)

### What It Is
A plugin that runs staged maintenance cycles during idle time (between sessions), inspired by biological sleep. The agent consolidates memory, prunes stale configuration, reviews past mistakes, and dreams up improvements - all while the user sleeps.

### Why This Scope
- **Demoable**: Can show a before/after of a .claude/ folder going through a sleep cycle
- **Novel**: No existing system implements staged idle-time maintenance for LLM agents
- **Self-contained**: Doesn't require real-time hooks or in-session intervention (simpler to build)
- **Compelling narrative**: "Your agents are healing while you sleep" - addresses token anxiety
- **Builds on existing research**: VIGIL's EmoBank decay, Darwin Godel Machine's scaffold modification, Episodic Memory's archival system, Reflect's learning ledger

### Core Mechanism
LaunchD daemon (Mac only) that invokes non-interactive Claude Code CLI on a schedule (e.g., 2am daily). The sleep agent runs through staged cycles:

**N1 - Light Sleep (Session Log Replay)**
- Replay recent session transcripts
- Surface-level pattern detection: recurring errors, repeated corrections, user frustration signals
- Quick scan of hook invocation counts, memory access patterns, skill usage
- Output: list of signals worth investigating deeper

**N2 - Medium Sleep (Context Pruning & Consolidation)**
- Memory deduplication: identify duplicate/near-duplicate entries
- CLAUDE.md review: check for contradictions, stale rules, bloat
- Trail evaporation: identify entries not accessed in N sessions
- Cross-project consolidation: learnings that repeat across projects get promoted
- Output: proposed pruning/consolidation changes

**N3 - Deep Sleep (Health Scans & Repair)**
- Dependency health scans
- Skill testing: do skills still work? Are any broken?
- Workspace cleanup: orphaned temp files, stale caches
- Negative trace consolidation: failed approaches → anti-pattern entries
- Output: proposed repairs

**REM - Dream (Creative Recombination)**
- Review Git commit history of recent solved problems
- Generate creative improvements for past solutions
- Review unresolved problems with fresh "diffuse mode" thinking
- Cross-project learning: connect patterns from different projects
- Propose new commits/suggestions for next morning
- Output: dream report with proposals

### What Gets Modified (with safety)
- **CLAUDE.md**: Using VIGIL's guarded sections pattern (CORE_IDENTITY immutable, ADAPTIVE_SECTION modifiable)
- **Memory entries**: Consolidation, pruning, negative traces
- **Rules files**: Path-specific knowledge updates
- **Skills**: Only through human-approved proposals (REM output)

### Safety Mechanisms
- CORE_IDENTITY immutability check (byte-for-byte)
- Backup-before-modify for all changes (rollback capability)
- Sleep report generated for human review in the morning
- High-confidence changes auto-applied, low-confidence queued for approval
- Rate limiting on modifications per cycle
- Gradual stop signals: CLAUDE.md over 500 lines → warning, over 800 → halt

### Biological Principles Demonstrated
1. Sleep as active healing (Tononi's SHY)
2. Trail evaporation (ACO mathematical pruning)
3. Hippocampal replay (session log consolidation)
4. Synaptic homeostasis (prune weak connections, preserve strong)
5. Glymphatic clearance (workspace cleanup)
6. REM dreaming (creative recombination)
7. Target morphology (CLAUDE.md as what "healthy" looks like)
8. Pace layering (different depths at different stages)
9. Anti-fragility (system improves from past failures)

### Model Selection
- N1: Haiku (fast, cheap - surface scanning)
- N2: Sonnet (deeper analysis for consolidation decisions)
- N3: Sonnet (health scans, repair proposals)
- REM: Opus (creative dreaming, complex reasoning)

### What the Demo Shows
1. A .claude/ folder with accumulated entropy (bloated CLAUDE.md, stale memories, unused skills)
2. Trigger a sleep cycle (either live or pre-recorded)
3. Walk through each stage showing what it found and what it proposed
4. Show the morning report
5. Show the before/after diff

### Key Stats for Demo
- "Sleep is the price the brain pays for plasticity" (Tononi)
- Glymphatic system 10x more active during sleep
- Targeted dream incubation doubles puzzle-solving rates (42% vs 17%)
- VIGIL reduced failures from 100% to 0% through behavioral monitoring
- Darwin Godel Machine: 20% → 50% through self-modification of scaffold

### Open Questions for This Scope
- Can we run non-interactive Claude Code CLI via launchd reliably?
- What's the API cost of a full sleep cycle? (Haiku → Sonnet → Sonnet → Opus)
- How do we handle the "first sleep" problem? (No history to consolidate yet)
- How do we validate that sleep cycle changes are actually improvements?
- What's the minimum .claude/ state needed for a meaningful demo?

---

## Scope 2: Orchestration Layer / Abstraction over Claude CLI (Future)

### What It Is
An abstraction layer over Claude Code CLI (non-interactive mode) that adds the self-modification, messaging, and object creation properties that prompt objects require. This layer bridges the 6 gaps identified in the Scott Werner deep read.

### Why It's Separate from Scope 1
Sleep cycle is about BETWEEN-session healing. This orchestration layer is about building a persistent runtime that can:
- Self-modify its own configuration (hooks, skills, rules)
- Pass messages between agents
- Create new objects/agents in response to failures
- Maintain persistent identity across sessions
- Perform actions autonomously on behalf of users

### What It Enables
- Prompt object architecture for Claude Code
- True runtime self-modification (not just between-session modification)
- Object creation as recovery (spawn specialized agents for novel failures)
- Inter-agent coordination beyond parent→child
- The "living system" that heals itself in real-time

### Open Questions
- How much of this does the Claude Code plugin system already provide?
- Is non-interactive Claude CLI stable enough as a substrate?
- What's the right interface between this layer and Claude Code?
- How does this relate to the Agent SDK?

---

## Scope 3: (Reserved - TBD)

Potential candidates:
- Real-time immune response (hooks-based, per tool call)
- Session-level reflection (Stop hook integration)
- Vital signs monitoring dashboard
- Two-signal activation system
- Sibling supervisor (VIGIL-like real-time watching, P1/P2 priority)

---

## Scope 3: (Reserved - TBD)

---

## Decisions Made
- **Platform**: Mac only (launchd, not cron)
- **Target**: Claude Code only (not other agent platforms)
- **Distribution**: Anthropic plugin marketplace
- **Healing target**: The .claude/ folder (hooks, skills, CLAUDE.md, memory, rules) - NOT user's codebase

## Name Brainstorming
- Claude Code Sleep
- Cloud Code Sleep
- Claude Code Rest
- Claude Rest
- (Need more options - sleep on it?)
