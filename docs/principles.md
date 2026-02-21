# Principles

Generously captured from brainstorming. To be filtered and synthesized later.

---

## Core Architectural Principles

### 1. Anti-fragile, not just resilient
Systems that get stronger from stress. Not every part needs to be anti-fragile; a mix is already huge.

### 2. Growing, not just healing
Recovery should leave the system better than before.

### 3. Recovery over prevention
"Error recovery matters more than error prevention." Don't try to prevent all failures - get really good at recovering from them.

### 4. Feedback loops over blueprints
Living systems don't follow static plans. Feedback is more fundamental to life than DNA. Close the loop as much as possible - give agents tools to test, verify, observe. The more loops closed, the better they get.

### 5. Feedback as fundamental mechanism
Every signal matters. User frustration = pain signal. User praise = positive reinforcement. User repetition = pattern detection signal. Conversation history IS rich external feedback.

### 6. As complexity grows, architecture dominates material
Alan Kay's cathedral insight. The arrangement of components matters more than the components themselves. We want agents to operate in complex systems and codebases - architecture is what elevates the problems.

### 7. Pace layering - what gets updated when
Different components change at different rates. Memory changes slowly, hooks occasionally, skills frequently, agent actions per-turn. Understanding WHEN to update WHAT is critical.

### 8. Environmental traces as coordination (Stigmergy)
Intelligence emerges from traces left in the environment. Code IS the environment. Agents leave traces (files, hooks, memory entries) that guide future agents. No central coordinator needed.

### 9. Entropy as default - healing as continuous fight against decay
"Healing is not a special event. It's the continuous fight against decay." Great slide heading.

### 10. Controlled destruction as healing
Kill something and start fresh rather than endlessly patching. Agents recognizing when to abandon a strategy is proven to work - fresh sessions with lessons learned outperform patched broken sessions.

### 11. Memory and learning from damage
Every failure is a learning opportunity. Persist the lesson so it never happens again.

### 12. Stop signals are crucial
Avoid overgrowth. Sleep is not just about adding things - it's about synthesizing, subtracting, removing dead code, removing unused hooks, removing stale memory. Track what's being used and eliminate what isn't.

### 13. Temporary performance degradation is a feature, not a bug
Inflammation is functional. The system in healing mode may ask more questions, run more tests, be more verbose. Prepare users for this. Great slide title.

### 14. Degeneracy over redundancy
Multiple DIFFERENT approaches to the same goal, not identical copies. Browser testing: Chrome extension fails? Use Playwright. File search: MCP tool gets fewer results? File system search gets more. Don't outcompete existing tools - be another degenerate layer that synthesizes them all.

### 15. Two-signal activation
Don't trigger healing on a single error. Require two independent signals. First signal = user frustration detected (pre-cache a suggestion). Second signal = same pattern recurs → now deploy the fix. Prevents over-sensitivity.

### 16. Target morphology - define what healthy looks like
If you can define what "healthy" looks like, convergence can happen. CLAUDE.md as the target morphology specification.

### 17. Pre-cached repair instructions
Have suggestions ready to go before they're needed. When the moment arrives, be prepared: "We saw this before. Do you want to heal this right now?"

### 18. ABC Framework (Engelbart)
- A-level: Business as usual (agent doing tasks)
- B-level: Improving how we work (self-healing)
- C-level: Improving how we improve (self-improving the healing system)

### 19. The whole system, not just the tool (HLAMT)
Human + Language + Artifacts + Methodologies + Training. Can't just improve the tool. Must also upskill the user. Engelbart's warning about imbalanced augmentation.

### 20. Sleep as healing
Not just rest. Memory consolidation, waste clearance, synaptic homeostasis, tissue repair. Cloud Code Sleep as a tagline/project name.

### 21. Technology retains information for mastery (Alan Kay)
A good tool is scaffolding that eventually transforms the thinker. The system should hold new ideas long enough for the human to internalize them.

### 22. Messaging over objects (Alan Kay)
What matters is how components communicate, not the components themselves. The feedback loops between human and agent matter more than either individually.

### 23. Curing token anxiety
"Your agents are healing. Your agents are growing." Reframe idle time from anxiety to confidence.

### 24. Compounding over time
Every session leaves the agent better. Measurably improving with use.

### 25. Cross-project consolidation
During sleep, identify learnings from individual projects that should be promoted to global CLAUDE.md. Where there's overlap, where there's repeated occurrence.

### 26. Bitcoin principle - combining existing ideas
Not one genius idea, but putting together existing ideas in a novel, purely functional way. Like Bitcoin combined pre-existing ideas into something that worked and survived. Our system combines ideas from biology, Engelbart, Kay, stigmergy, etc. into something emergent.

### 27. The intelligence is in the hierarchical composition
Not in any single skill - it's in how they compose. Capabilities structured as processes that compound into higher-order intelligence (Engelbart's capability repertoire hierarchy).

### 28. Embed learning into the workflow
Don't build a help system and expect users to use it (paradox of the active user). Learning must happen WITHIN the workflow, at the moment it's useful.

### 29. Desire paths are the signal
When users repeatedly do something the hard way, that's the detection trigger. Like the immune system detecting a repeated pathogen.

### 30. Focus mode vs diffuse mode
Cal Newport: snap out of work mode to let your brain work in diffuse mode. Apply to agents: focused sessions for tasks, diffuse "dream" sessions for creative recombination. Users also need to step back, reflect, do retrospectives.

### 31. Complex things emerge naturally from simple biological principles
Don't over-engineer. Simple local rules produce sophisticated global behavior (termite stigmergy, ant colony repair).

### 32. Gradual signals, not binary triggers
Stop signals should be gradual, not all-or-nothing. Like pain that escalates: warning at 500 lines, louder at 600, 700, system halt at 800. Severity weighting with confidence levels.

### 33. What feedback loops to establish between existing components
The framing should be "what feedback loops do we create" not "what do we build." The primitives exist - we wire them together.

### 34. Sessions as traces
Each Claude Code session IS a trace in the stigmergic sense. Multiple sessions on a project create a trail. Multiple users create multiple trails. Sessions are the natural unit of tracing.

### 35. Rules over docs for consolidated knowledge
Claude Code's Rules feature (path-specific invocation) is better than docs/solutions/ because rules get auto-read when modifying relevant folders. Docs require explicit mention. Rules have the retrieval capability that docs lack.

### 36. Dream about solved problems too
Don't just dream about unresolved problems. Review Git history of solved problems - identify bugs, improvements, better approaches. Generate creative new ideas for problems users already solved. Propose fresh insights next morning.

### 37. Don't limit to existing primitives
If we can invent a new primitive for Claude Code, that's a huge win. Map to existing primitives first, but don't limit ourselves to what exists today.

### 38. Convergence across sources = high signal
When different systems across different dimensions converge on a pattern, that's high signal. Focus resources on those recurring patterns. Immune system, sleep, feedback loops - these keep surfacing everywhere.

### 39. Sufficiently structured process hierarchies are indistinguishable from AGI
Heavy emphasis on hierarchies, processes, workflows. The right workflow increases overall smartness and intelligence of the system more than smarter reasoning. Better tooling and workflow > smarter model. Engelbart + Werner + Kay combined.

### 40. Default-safe + override on positive confidence
The hallucination circuit works via default "can't answer" features suppressed by "known entity" signals. Our healing system should default to safe/degraded behavior, requiring positive confidence signals to enable full operation. Misfiring confidence signals are the primary failure mode.

### 41. Define the system by its feedback loops, not its configuration files
A configuration file by itself means nothing. Think everything through the lens of feedback loops. The healing system IS its feedback loops. Not the CLAUDE.md, not the skills, not the hooks - it's the loops between them.

### 42. Each interaction is an opportunity for recovery, not failure
Scott Werner's inversion: standard chains compound failure multiplicatively (80%^3 = 51%). Prompt object chains compound recovery - each node can interpret, negotiate, self-modify. Longer chains become MORE antifragile. How do we design every interaction in our system as a recovery opportunity?

### 43. Semantic detection over regex for sleep-time analysis
When detection happens during sleep (no latency pressure), use semantic/LLM-based analysis over regex. Regex is brittle and misses natural language corrections. Semantic detection is slower but dramatically more accurate. Reserve regex for real-time hooks where speed matters.

### 44. Better tooling and workflow > smarter reasoning
From Darwin Godel Machine: the most impactful self-modifications were NOT making the FM smarter. They were better tools and workflow orchestration. Node 24 (string replacement tool) had more impact than any prompt improvement. Apply to our system: focus on process/workflow improvements over trying to make individual agents smarter.
