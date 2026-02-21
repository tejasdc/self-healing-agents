# Ideas

Generously captured. To be filtered later.

---

## System Design Ideas

### Conversation history IS external feedback
Pushback on Huang/Kamoi: our system is NOT self-correcting in isolation. Conversation history contains rich feedback signals:
- User frustration = pain signal
- User praise = positive reinforcement
- User repetition = stuckness signal
- User says "no" = direction correction
- User says "great job" = reinforcement
- User says "we've been doing the same thing" = loop detection
We reflect on conversation history, not just the agent's own output. This is external feedback.

### Prompt objects and message passing (Scott Werner)
Need to deeply understand Scott Werner's prompt object oriented model. How do prompt objects map to Claude Code concepts (skills, hooks, memory)? How does message passing architecture produce emergent self-healing? Can Claude Code's existing primitives implement this or do we need to guide Anthropic to add more?

### Stigmergy in Ralph Wiggum loops
Ralph Wiggum = bash script that invokes agent in a loop. This is already stigmergic - each iteration leaves environmental traces for the next. Opportunity to improve: can we make the traces more structured? Can each loop iteration leave better breadcrumbs?

### Bottom-up stigmergy vs. top-down bootstrapping
Two complementary improvement vectors:
- Stigmergy: ground-up, emergent, self-organizing improvement from environmental traces
- Engelbart's ABC: top-down, deliberate, structured improvement of improvement systems
Both are needed. The interplay between them is interesting.

### Code IS the environment
For coding agents, the codebase IS the stigmergic medium. Agents already leave massive traces (code changes, commits, PRs). We haven't been tracking this as coordination data. Failure modes here could be interesting to explore.

### Degenerate layer, not competitor
Don't need to outcompete Compound Engineering or Anthropic's /insights. Be another degenerate layer that ALSO uses their output. Synthesize all sources. The more diverse the approaches, the more robust the system (degeneracy principle).

### Confidence system with two-signal activation
1. First signal: detect user frustration → pre-cache a suggestion
2. Second signal: same pattern recurs → offer the fix
3. Don't be oversensitive about adding improvements unless necessary
4. Have them ready but deploy at the right time

### Automatic repair during sleep
Things break during active sessions that users don't have time to fix. They're building a feature and something else breaks. They don't want to go down that rabbit hole. If the sleep system can identify and repair these automatically - "a fucking big win."

### Monitoring, measuring, tracking as infrastructure
Critical to know:
- What is broken?
- What is being used?
- What is NOT being used?
- Are hooks being invoked?
- Is memory being accessed?
- Are skills being called?
Track metrics on all information added to the system. This is the "vital signs" for homeostatic monitoring.

### Cross-project memory consolidation
During sleep, analyze individual project learnings and identify what should be promoted to global CLAUDE.md. Where overlap exists across projects, that's a strong signal for global rules.

### Closing feedback loops makes agents dramatically better
Example: giving agents browser testing tools means they don't need human-in-the-loop testing. They test, see what's broken, fix it. Every closed loop is a capability multiplier.

---

## Biological Mechanism Ideas

### Healing cycles and phases
Keep capturing all the phase-based healing patterns:
- Detect → Contain → Clean → Rebuild → Optimize
- The three-phase cycle from nature
- Map each phase to Claude Code mechanisms

### Sleep stages mapped to maintenance
- N1 (light): Session log replay, surface pattern detection
- N2 (medium): Context pruning, memory deduplication
- N3 (deep): Dependency health scans, skill testing, workspace cleanup
- REM (dream): Creative recombination, cross-project learning

### 5% explorer principle
Some fraction of sessions should deliberately deviate from established patterns. Prevents local optima lock-in.

### Negative traces
Records of what NOT to do. Failed approaches, anti-patterns. Currently missing from Claude Code's trace system.

### Trail evaporation as mathematical pruning
τ(t+1) = (1-ρ)·τ(t) - traces that aren't reinforced decay over time. Principled framework for memory pruning.

---

## New Ideas from Reading Session

### Degeneracy as A/B testing in production
Create multiple skills for the same task with different prompts/instructions. Track which gets picked up through measurement. Double down on winners via stigmergy reinforcement. Introduces randomness similar to temperature. Natural selection in action.

### Gradual stop signals
CLAUDE.md over 500 lines → gentle warning. Over 600 → louder warning. Over 700 → strong warning. Over 800 → system halt, force reduction. Gradual escalation, not binary.

### Episodic memory of (original, corrected) action pairs
From Reflexion framework. Prevent repetition of known errors. Map to existing episodic memory plugin and improve on it.

### Object-oriented framework for the system
Define objects with properties: Suggestion.confidence, Issue.severity, Trace.strength, Memory.lastAccessed, Hook.invocationCount. Use object-oriented principles to map all entities, interfaces, abstractions, and layers.

### Dream about solved problems
Review Git commit history during REM sleep. Generate creative improvements for past solutions. Identify bugs in existing solutions. Propose fresh commits the next day. Not just fixing broken things - improving working things.

### Focus mode vs diffuse mode
Focused sessions = concentrated task work. Diffuse sessions (sleep/dream) = broad creative recombination, connecting different ideas, broadening search scope. Like Cal Newport's deep work vs. rest.

### Use Rules feature instead of docs/solutions
Rules have path-specific triggers: "if modifying this folder, read this file." Better retrieval than docs which need explicit mention. Consolidated knowledge should go into Rules.

### Different models for different healing activities
Haiku for lightweight monitoring and vital signs. Sonnet for deeper analysis. Opus for creative dreaming and complex healing. Match model to activity level.

### LaunchD for sleep daemon on Mac
Focus on Mac users. Use launchd to run non-interactive Claude Code CLI for sleep processes. Scope cut: Mac only, Claude Code only.

### Agent-to-agent communication vs stigmergy
User's workflow: always invokes multiple subagents, gets code reviewed by another agent, iterates. Even invokes Codex CLI for second opinions. Agent-to-agent shines for: code review, iterating on feedback, second opinions. Stigmergy shines for: cross-session coordination, long-term pattern accumulation, no direct interaction needed. Need to identify where each technique applies.

### Contribute improvements back to Compound Engineering
Don't just build our own thing - also contribute improvements to Compound Engineering plugin. Be a good degenerate layer that improves the ecosystem.

### Signals that user has "forgotten" a skill
We introduced a command. Agents use it for a few sessions. Then they stop using it - the model isn't picking it up anymore. That's the "forgetting" signal. Can be detected without requiring user to explicitly recollect. Track command usage over time.

### Multi-level stigmergy tracing
Multiple Claude sessions on same project. Same user, different sessions = single-user traces. Multiple users on same project = multi-user traces. Sessions are the natural trace unit. Simplify stigmergy model by treating sessions as atomic traces.

### Rollbacks and user control
From Claude Reflect System: safe skill updates with ROLLBACK capability. If healing system modifies user's system, they must be able to undo. Critical for trust.

### Human-in-the-loop for high-severity decisions
Keep humans in the loop for: confirming failure modes are important, approving fixes for severe issues, choosing between degenerate strategies. Not for routine healing.

### Cal Newport daily/weekly/monthly retrospectives
Stop, reflect, consolidate. Could be daily quick reflection, weekly deeper review, monthly major reconfiguration. Maps to pace layering.

### Frictionless insight capture via `!` bash commands
Key struggle: when working with agents on a task and having an insight about system improvement, there's no frictionless way to capture it. Can't interrupt the current agent. Opening a new tab and Claude instance is too much friction. Idea: define bash commands (e.g., `!capture "this idea"`) that run in the background without affecting current agent context window or execution. The `!` prefix in Claude Code runs bash commands. If we have a `capture` script that appends to a file, it's zero-friction insight capture. Extends to `!todo`, `!improve`, etc. Part of the HLAMT system - reducing friction for the human in the loop.

### Abstraction layer over Claude CLI for self-modification
An abstraction layer that wraps Claude Code CLI (non-interactive mode) and adds the self-modification, messaging, and object creation properties that prompt objects require. The layer uses Claude CLI to get work done, then has data about what happened inside and the ability to interpret and self-modify for the next turn. Bridges the 6 gaps in Claude Code's prompt-object mapping.

### Session-start review of pending suggestions
During session start, present pending suggestions from sleep cycle: "Hey, there are a few things to review." User can accept changes to CLAUDE.md, accept new skills, or reject. Rejection is a signal. Could also watch the actual file for user edits (removing information we added = negative signal).

### File edit watching as meta-learning signal
If the user edits or removes information that we added to CLAUDE.md, skills, or hooks, that's a strong negative signal. We should watch for diffs in our modifications. User removing a rule = "that rule was wrong." User editing a rule = "right direction, wrong implementation." File watching provides passive meta-learning without requiring explicit feedback.

### Track agent pickup rate as feedback signal
How often agents actually pick up on information in CLAUDE.md/skills/memory and use it in their thinking process. If we add a rule and agents never reference it, it's dead weight to prune. If agents reference it frequently, it's high-value to reinforce. This is the usage-based reinforcement signal for trail evaporation.

### Sibling supervisor watching agent work (P1/P2 scope)
Not for sleep cycle MVP, but interesting future scope: a VIGIL-like supervisor that watches every action an agent takes in real-time. Implementation via hook system (PostToolUse, PostToolUseFailure) watching certain commands. Don't watch everything (too noisy) - selective observation of high-value or high-risk actions.

### Multiple agents doing same task for degeneracy
For critical analysis tasks, run 2-3 agents with different approaches on the same input. Synthesize results - if one agent misses something, others catch it. Need to identify WHERE this strategy applies (not everywhere - cost matters). Best candidates: high-stakes healing decisions, cross-project consolidation, diagnosis of complex failures.
