# Deep Reads

Sources we need to read in depth. Not just skim - actually extract detailed insights.

---

## Priority 1 - Must Read Before Design

### VIGIL (Cruz, 2025)
- Need to understand exactly how it works: the supervisory pattern, behavioral logs, persistent data bank, diagnostics, guarded prompt updates
- How did it reduce failure notifications from 100% to 0%?
- What can we directly adopt vs. what needs adaptation for Claude Code?

### Darwin Godel Machine (2025)
- How does it self-modify? What substrate does it modify on?
- SWE-bench 20% → 50% - what's the mechanism?
- Direct inspiration for our self-modifying system (hooks, skills, memory, CLAUDE.md)
- How does it validate its own modifications?

### Scott Werner's message-passing / prompt objects article
- What exactly are prompt objects?
- How does message-passing architecture produce emergent self-healing?
- How do these concepts map to Claude Code's architecture?
- Found in Obsidian vault - need to read the full article

### Sakana AI self-adaptive LLMs
- How do they achieve self-adaptation?
- What mechanisms do they use?

### "On the Biology of a Large Language Model" (Anthropic)
- Anthropic's own biological analogies to LLM internals
- What parallels do they draw?
- Any insights for our bio-inspired agent architecture?

### "The Feedback Loop is a Better Symbol of Life Than the Helix" (Jamie Davies)
- Central pillar of our research
- Full argument for feedback over blueprint

### Baqar et al. 2025 - "Self-Healing Software Systems: Lessons from Nature, Powered by AI"
- This is literally what we're trying to do
- Need to understand their full mapping of wound healing to software
- arXiv 2504.20093

### Claude Reflect System (Haddock)
- Signal detection, pattern analysis, safe skill updates with ROLLBACK
- Learn from their implementation patterns
- Identify what we can improve on

### Episodic Memory Plugin (obra)
- Already in use on user's system
- Understand where it fails
- How to combine good ideas from it with our system

## Priority 2 - Should Read Before Design

### Hallmarks of Regeneration (2024, Cell Stem Cell)
- Four universal hallmarks - map to agent design requirements

### Reflexion (NeurIPS 2023)
- The Actor + Evaluator + Self-Reflector architecture
- How episodic memory of corrections works

### Synaptic Homeostasis Hypothesis (Tononi)
- Full scientific basis for why pruning is essential

### NeuroDream framework
- The closest computational framework to our sleep architecture
- 38% reduction in forgetting, 17.6% increase in zero-shot transfer

### Pace Layering (Stewart Brand)
- "Fast learns, slow remembers"

### Stigmergy article (Heylighen)
- Already in Obsidian vault
- Full theory of stigmergic coordination

### Emergent Collective Memory (arXiv 2512.10166)
- The phase transition between individual memory and environmental traces
- Density-dependent coordination strategy

### Cognitive Homeostatic Agents (Kelkar, 2021)
- Must understand their vital signs system
- How do they track and maintain internal signals?
- Direct mapping to our monitoring system

## Priority 3 - Read for Depth

### Degeneracy (Whitacre, 2010)
### Autonomous Regeneration Systems (Minh-Thai et al., 2021)
### "Failure Makes the Agent Stronger" (2025)
### AI Safety Must Embrace an Antifragile Perspective (ICML 2025)
### Addy Osmani's Self-Improving Coding Agents
