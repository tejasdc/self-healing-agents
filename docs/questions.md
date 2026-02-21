# Open Questions

To be resolved through further research and brainstorming.

---

## Architecture Questions
- How do Scott Werner's prompt objects map to Claude Code concepts? Are there gaps?
- How to improve stigmergy in Ralph Wiggum loops specifically?
- Bottom-up stigmergy vs. top-down Engelbart bootstrapping - how do they interplay?
- What failure modes exist when code IS the stigmergic environment?

## Measurement Questions
- How do we track whether hooks are being invoked?
- How do we track whether memory entries are being accessed?
- How do we track whether skills are being used?
- What are the "vital signs" of a healthy agent system?
- How do we measure that the system is actually improving? (Compounding Index)
- How do we measure stop signals / know when to stop healing?

## Design Questions
- What does "target morphology" look like concretely for a .claude/ folder?
- What's the minimum viable set of biological patterns for v1?
- How much can be built within Claude Code's native extensibility vs. external infrastructure?
- How do we handle the autonomy spectrum? (What's automatic vs. human-approved?)
- How do we prevent autoimmune problems (over-healing)?
- What's the right evaporation rate (ρ) for trail decay?
- How do we handle the paradox of the active user (they won't read docs)?

## Feasibility Questions
- Can sleep cycles work via periodic sandbox instantiation (Claude in a Box pattern)?
- What's the API cost of "sleep" activities? Will users pay for invisible improvement?
- Can hooks be fast enough for real-time immune response without slowing every tool call?
- How do we handle the context window constraint for accumulated healing state?

## Scope Questions
- HLAMT scope: are we healing the whole human-agent system or starting with agent-only?
- Plugin scope: what's the MVP for hackathon vs. full vision?
- Do we need the spaced repetition / user upskilling for v1 or is that v2?

---

### New Questions from Reading Session
- How do prompt objects (Scott Werner) map to Claude Code concepts exactly?
- Where does stigmergy shine vs agent-to-agent communication? What are the precise use cases for each?
- How do microglia fight infection AND reorganize connections without specific instructions? What's the computational analog?
- How to detect that a user has "forgotten" a skill without requiring explicit recollection?
- How does the Agent Teams feature (inter-agent messaging) relate to stigmergy (environmental traces)?
- What's the difference between what each degenerate skill "sees" that makes one work better than another?
- How do we dream about solved problems productively? What's the evaluation criteria for "improvement"?
- Can we build an object-oriented model of our framework? What are the key objects, properties, methods?
- How does CODIAK (Comprehend→Observe→Discuss→Improve→Act→Know) map to our healing loop?

### Questions from Deep Read Review
- Where specifically is runtime self-modification useful in our system? Concrete use cases?
- Where specifically is inter-object messaging useful? When do objects need to talk to each other?
- Where specifically is semantic late binding between agents useful?
- What does "object creation as recovery" mean concretely for us? When would we spawn a new object to handle a failure?
- How does persistent object identity across sessions work? Named agent profiles with evolving state?
- How do we make EVERY interaction in our system an opportunity for recovery, not failure? (Compounding recovery)
- Where do we apply the degeneracy strategy (multiple agents, same task)? What's worth the cost?
- Darwin Godel Machine: where did they go with self-improvement? What were the limits?
- How do we implement frictionless insight capture without interrupting current agent? (`!capture` pattern viable?)
- How do we detect that a user has edited/removed our modifications? (File watching as feedback)
- How do we track agent pickup rate of CLAUDE.md rules and memory entries?
