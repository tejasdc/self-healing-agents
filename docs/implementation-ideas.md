# Implementation Ideas

Concrete implementation concepts. Not design yet - just captured ideas.

---

## Distribution
- **Anthropic plugin marketplace** - package as a plugin everyone can install and run
- Some features give immediate benefits, some compound over time

## Architecture Layers (from research)
- **Layer 1: Real-time immune response** (per tool call) - PreToolUse/PostToolUse hooks
- **Layer 2: Session-level reflection** (within/between tasks) - Stop hooks, reflection
- **Layer 3: Sleep cycles** (between sessions) - cron/launchd or periodic sandbox instantiation
- **Layer 4: Periodic evolution** (weeks) - /insights-style deep review + human approval

## Sleep Implementation Options
1. **cron/launchd daemon** - scheduled process that runs between sessions
2. **Periodic sandbox instantiation** (from Claude in a Box) - spin up a "sleep agent" with healing-specific .claude/ config, let it run N1→N2→N3→REM, terminate
3. **SessionEnd hook** - trigger sleep initiation when session ends

## Monitoring / Vital Signs System
- Track hook invocation counts (is this hook actually firing?)
- Track memory access patterns (which memories are being read?)
- Track skill usage (which skills are called, which are never used?)
- Track error patterns (recurring errors → immune memory candidates)
- Track user friction signals from conversation history
- Dashboard showing system health

## Two-Signal Activation Flow
1. First signal detected (e.g., user frustration) → pre-cache suggestion silently
2. Second signal detected (same pattern recurs) → offer the fix: "We saw this before. Want to heal this?"
3. If accepted → deploy the hook/skill/memory update
4. If rejected → note rejection, increase threshold for this pattern

## Degenerate Integration
- Use Compound Engineering's analysis as one input
- Use /insights report as another input
- Use our own analysis as a third input
- Synthesize across all sources for richer picture
- Be an additive layer, not a replacement

## Pre-cached Repair System
- During sleep or session analysis, identify potential improvements
- Store them as "ready-to-deploy" patches
- When the right moment occurs (two-signal activation), offer them
- Track acceptance rate to improve suggestion quality

## Cross-Project Consolidation
- During sleep, compare learnings across projects
- Where patterns repeat across projects → promote to global CLAUDE.md
- Where project-specific patterns exist → keep in project CLAUDE.md

## Negative Trace System
- Log failed approaches with context
- During sleep, consolidate into "anti-pattern" entries
- Surface negative traces when similar approaches are attempted

## Trail Evaporation
- Every memory/hook/skill entry gets a "last accessed" timestamp
- Entries not accessed within N sessions get decay score
- Sleep cycle reviews decay scores and prunes/archives stale entries
- Frequently accessed entries get reinforced (stronger traces)

---

## New Implementation Ideas from Reading Session

### Scope Decisions
- **Mac only** (focus on launchd, not cron)
- **Claude Code only** (not other agent platforms)
- **Plugin marketplace distribution** via Anthropic's system

### Model Selection Strategy
- Haiku: lightweight monitoring, vital signs, quick checks
- Sonnet: deeper analysis, pattern detection
- Opus: creative dreaming, complex healing, major decisions

### Rules Feature for Knowledge
Use Claude Code's Rules feature (path-specific) instead of docs/solutions/:
- "If modifying /src/auth/, read rules/auth-patterns.md"
- Auto-retrieval beats manual docs
- Better than CLAUDE.md for domain-specific knowledge (keeps CLAUDE.md lean)

### Degeneracy A/B Testing
- Create 2-3 skills for same task with different approaches
- Track via measurement which gets picked up
- Reinforce winners, deprecate losers
- Natural selection for skills

### Dream Pipeline
1. Review Git commit history of recent changes
2. Identify solved problems worth revisiting
3. Generate creative improvements / find bugs
4. Review unresolved problems with fresh "diffuse mode" thinking
5. Propose new commits/suggestions for next morning

### LaunchD Sleep Daemon
- Run non-interactive Claude Code CLI via launchd
- Scheduled sleep cycles (e.g., 2am daily)
- N1→N2→N3→REM staged cycle
- Output report for user to review on wake
