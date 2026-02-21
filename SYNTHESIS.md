# Self-Healing Agents: Master Research Synthesis

**Compiled:** 2026-02-20
**Sources:** 11 research files + 1 project document, covering 300+ individual sources across academic papers, blog posts, Readwise articles, Obsidian vault notes, plugin analyses, and web research.

---

## 1. Unified Biological Patterns

Cross-referenced across all research files. Each pattern below has been identified in multiple independent sources across biological scales and validated against computing/agent equivalents.

---

### Pattern 1: Multi-Phase Healing Pipeline (Detect-Contain-Clean-Rebuild-Optimize)

**Biological description:** Every healing process in biology, from DNA repair to ecosystem succession, proceeds through overlapping phases: first detect and contain damage, then clean the wound environment, then rebuild structure, then optimize/remodel the rebuilt structure.

**Scale(s):** All scales -- cellular (wound healing), organ (bone fracture: hematoma -> soft callus -> hard callus -> remodeling), organism (axolotl limb regeneration: wound epithelium -> blastema -> redifferentiation), colony (termite mound repair), ecosystem (forest fire succession: pioneer species -> shrubs -> canopy -> climax community).

**Agent/computing equivalent:** The MAPE-K loop (Monitor-Analyze-Plan-Execute-Knowledge) and the DDRV loop (Detect-Diagnose-Remediate-Verify). In agent systems: monitoring -> alerting -> isolation -> recovery -> reintegration -> optimization.

**Claude Code mechanism:** Hook lifecycle events map directly: PreToolUse (detect/prevent), PostToolUseFailure (contain/diagnose), Stop hooks with agent type (verify recovery), SessionStart (reintegrate learnings from prior sessions).

**Sources:** web-nature-healing (patterns 1-3), papers-biology (Hallmarks of Regeneration, wound healing papers), papers-technology (MAPE-K, VIGIL), web-agent-systems (DDRV pattern), readwise-filesystem-search (feedback loop articles).

---

### Pattern 2: Controlled Destruction as Healing (Apoptosis / Social Apoptosis)

**Biological description:** At every biological scale, deliberate destruction is a core healing mechanism. Cells undergo programmed death (apoptosis) to maintain tissue homeostasis. Osteoclasts break down damaged bone. Bee colonies sacrifice infected larvae (social apoptosis). Fire clears old-growth forest for succession.

**Scale(s):** Cellular (apoptosis: ~10 billion cells die daily), organ (osteoclast bone resorption), colony (honeybee altruistic suicide, ant self-isolation), ecosystem (fire clearing, decomposition).

**Agent/computing equivalent:** Graceful process termination, circuit breakers, garbage collection, agent replacement rather than repair. The principle that killing a failing component IS the healing strategy, not a failure of healing.

**Claude Code mechanism:** PostToolUseFailure hooks that terminate failing tool chains. Stop hooks that kill runaway sessions. Subagent lifecycle management (SubagentStart/Stop hooks). Context compaction as a form of "pruning dead context."

**Sources:** web-nature-healing (social apoptosis in bees, apoptosis review), papers-biology (programmed cell death review, apoptosis papers), papers-intersection (BioSymPLe architecture), obsidian-mcp-search (mitochondria as motherboard).

---

### Pattern 3: Feedback Loops as the Fundamental Mechanism (Homeostasis)

**Biological description:** Life is maintained by negative feedback loops that sense deviation from a setpoint and trigger corrective action. Body temperature, blood glucose, hormone levels -- all are regulated by continuous feedback, not by following a blueprint.

**Scale(s):** All scales -- molecular (enzyme regulation), cellular (gene expression feedback), organ (liver size regulation via Hippo/Yap pathway), organism (thermoregulation, blood pressure), colony (bee hive temperature regulation at 34-36C), ecosystem (predator-prey cycles).

**Agent/computing equivalent:** Continuous monitoring with threshold-triggered responses. Negative feedback for stability (error correction), positive feedback for adaptation (amplifying successful strategies). The thermostat analogy extended to agent behavior.

**Claude Code mechanism:** Hooks as feedback sensors (PreToolUse/PostToolUse). /insights as a retrospective feedback report. CLAUDE.md as the "setpoint" specification that the agent continuously reconciles toward. Auto-memory as the feedback recording mechanism.

**Sources:** readwise-filesystem-search (feedback loop articles by Jamie Davies, Farnam Street, Donella Meadows), obsidian-mcp-search (homeostasis theme), papers-biology (liver regeneration termination signals), papers-intersection (homeostatic computing papers by Kelkar), anthropic-insights-analysis (satisfaction inference as health signal).

---

### Pattern 4: Decentralized, Local-First Response (Stigmergy)

**Biological description:** Healing consistently operates through local agents responding to local conditions without central coordination. Termites repair mound damage by responding to local humidity gradients. Ant colonies recover through individual ants responding to local pheromone signals. DNA repair enzymes patrol locally.

**Scale(s):** Cellular (DNA repair enzyme patrol), organ (hepatocytes dividing based on local signals), colony (termite stigmergy, ant pheromone trails), ecosystem (pioneer species colonizing based on local conditions).

**Agent/computing equivalent:** Agents coordinating through shared environment state rather than direct messaging. File-based state machines. Git as shared coordination medium. No central orchestrator required.

**Claude Code mechanism:** File-based coordination (CLAUDE.md, AGENTS.md, docs/solutions/ as shared environment). Git commit history as pheromone trail. Compound engineering's file-todos pattern (filesystem as state machine). Hooks that respond to local conditions (tool name, input patterns) without global knowledge.

**Sources:** readwise-filesystem-search (stigmergy article by Heylighen, ant colony articles), obsidian-mcp-search (stigmergy theme), papers-biology (termite mound morphogenesis), papers-intersection (CSO framework, stigmergic multi-agent coordination), web-nature-healing (termite mound repair).

---

### Pattern 5: Target Morphology / Desired State Specification

**Biological description:** Living systems heal toward an encoded "target morphology" -- a specification of what the system SHOULD look like. Planaria regenerate "no more or less" than what is missing. Bioelectric patterns encode the target shape. The liver precisely maintains a liver-to-bodyweight ratio of 100%.

**Scale(s):** Cellular (bioelectric pattern memory), organ (liver size regulation), organism (planarian target morphology, axolotl limb patterning via Hox genes).

**Agent/computing equivalent:** Declarative desired-state specification that reconciliation loops continuously work toward. Kubernetes desired state. Infrastructure as code. The "information field" concept from regenerative computing (Minh-Thai et al.).

**Claude Code mechanism:** CLAUDE.md as the "target morphology" -- the specification of how the agent should behave. Project-level CLAUDE.md files as per-project target state. The gap between current behavior and CLAUDE.md specification is the "wound" that needs healing.

**Sources:** obsidian-mcp-search (bioelectricity article), papers-biology (planarian target morphology, liver size regulation), papers-intersection (regenerative computing "information field"), web-nature-healing (planarian regeneration).

---

### Pattern 6: Immune Memory and Adaptive Learning

**Biological description:** The immune system remembers past threats and mounts faster, stronger responses on re-exposure. B-cells undergo affinity maturation (a somatic evolutionary algorithm) that improves binding affinity up to 10,000-fold. Even innate immunity has a form of memory (trained immunity via epigenetic reprogramming).

**Scale(s):** Immune system (adaptive immunity, immunological memory, trained innate immunity), colony (behavioral adaptation to repeated threats), ecosystem (disturbance legacies increasing future resilience).

**Agent/computing equivalent:** Episodic memory of past failures with indexed recovery strategies. The Reflexion pattern (attempt -> fail -> reflect -> store -> retry with context). Case-based reasoning for recovery. Evolutionary strategies for repair optimization.

**Claude Code mechanism:** Episodic Memory plugin (vectorized SQLite store of past conversations). CLAUDE.md accumulation of learned rules. Compound engineering's docs/solutions/ library. Claude Reflect's correction-to-learning pipeline. /insights friction taxonomy as "antigen catalog."

**Sources:** web-nature-healing (adaptive immunity, affinity maturation, trained immunity), papers-biology (immune system as RL, Bayesian memory, clonal selection), papers-technology (Reflexion paper, VIGIL persistent data bank), web-agent-systems (PALADIN, AgentDebug), claude-code-plugins-ecosystem (Claude Reflect, Episodic Memory).

---

### Pattern 7: Degeneracy Over Redundancy

**Biological description:** Purely redundant systems (identical backup copies) have remarkably low evolvability. Degenerate systems -- where structurally different components can perform the same function -- are orders of magnitude more robust AND more evolvable. Degeneracy enables "networked buffering" where diverse agents can compensate for each other's failures.

**Scale(s):** Molecular (degenerate genetic code), neural (degenerate neural pathways), immune (diverse antibody repertoire), organism (multiple viable regeneration strategies across species).

**Agent/computing equivalent:** Diverse agents with overlapping capabilities rather than identical replicas. Multiple solution pathways for critical operations. Fallback chains with different provider/model types rather than retry-with-same.

**Claude Code mechanism:** Model fallback (Opus -> Sonnet -> Haiku). Diverse review agents in Compound Engineering (14 specialists with overlapping coverage). Multiple memory systems (CLAUDE.md + auto-memory + episodic memory). Multiple tool paths to the same outcome (Bash vs. Edit, Read vs. Grep).

**Sources:** papers-biology (Whitacre 2010 degeneracy papers, networked buffering, biological robustness review), papers-intersection (degeneracy applied to software section), web-agent-systems (anti-fragile design: diversity principle).

---

### Pattern 8: Pace Layering / Hierarchical Scale Separation (Panarchy)

**Biological description:** Durable systems use multiple layers operating at different speeds. Fast layers experiment and respond; slow layers stabilize and conserve. In ecosystems, small/fast subsystems (grass, insects) experiment while large/slow systems (forests, apex predators) provide stability. The adaptive cycle has four phases: growth -> conservation -> release -> reorganization.

**Scale(s):** Ecosystem (panarchy theory), organism (fast neural reflexes vs. slow hormonal regulation), immune (fast innate response vs. slow adaptive response), colony (fast individual response vs. slow colony-level adaptation).

**Agent/computing equivalent:** Real-time error handling (fast) + session-level strategy adjustment (medium) + cross-session learning (slow) + periodic architectural review (slowest). Stewart Brand's "fast learns, slow remembers."

**Claude Code mechanism:** Four pace layers map directly: (1) Real-time: PreToolUse hooks, retry logic, circuit breakers. (2) Session: Stop hooks that verify task completion, within-session reflection. (3) Sleep/idle: Log replay, pattern extraction, memory consolidation, context pruning. (4) Periodic: /insights analysis, CLAUDE.md evolution, skill updates, architectural changes.

**Sources:** readwise-filesystem-search (Pace Layering by Stewart Brand, panarchy references), papers-biology (panarchy and adaptive cycles, ecological resilience), papers-intersection (organic computing, hierarchical bio-levels), sleep-as-healing (staged sleep architecture).

---

### Pattern 9: Pre-Positioned Repair Resources (mRNA Stockpiling)

**Biological description:** Effective self-healing systems pre-position repair capacity before damage occurs. Axolotl cells stockpile mRNA molecules that are rapidly translated on injury via an ultra-sensitive mTOR switch. Stem cells are distributed throughout tissue ready to activate. Seed banks persist in soil after fire.

**Scale(s):** Cellular (pre-cached mRNAs), organ (distributed stem cells), organism (satellite cells in muscle), colony (role-flexible workers), ecosystem (seed banks, dormant root systems).

**Agent/computing equivalent:** Pre-loaded recovery procedures, fallback configurations, cached repair scripts, pre-computed alternative strategies. Circuit breaker with pre-configured fallback models.

**Claude Code mechanism:** Skills as pre-positioned repair instructions (SKILL.md files loaded on demand). Pre-configured hooks for known failure patterns. Compound engineering's docs/solutions/ as pre-computed repair knowledge. Sleep-phase cache warming for anticipated needs. Git worktrees as pre-positioned clean environments.

**Sources:** web-nature-healing (axolotl mTOR mechanism), papers-biology (axolotl mRNA stockpiling), compound-engineering-analysis (docs/solutions/ library), claude-code-plugins-ecosystem (self-improving agent skill).

---

### Pattern 10: Sleep as Active Healing (Not Downtime)

**Biological description:** Sleep is not passive rest -- it is a fundamentally different mode of operation where the brain is highly active. During sleep: hippocampal replay consolidates memories, synaptic homeostasis prunes weak connections, the glymphatic system clears metabolic waste (10x more active than waking), immune cells patrol and reorganize connections ("night gardeners"), growth hormone drives tissue repair, and REM dreaming enables creative problem-solving through relaxed constraints.

**Scale(s):** Organism (sleep physiology), cellular (growth hormone driven repair), neural (memory consolidation, synaptic pruning, glymphatic clearance).

**Agent/computing equivalent:** Idle-time active maintenance with staged cycles: (1) Transition/wind-down, (2) Light maintenance/health checks, (3) Deep maintenance (waste clearance, memory consolidation, pruning, immune scanning, capability building), (4) Creative optimization (replay failures with relaxed constraints, data augmentation, future preparation).

**Claude Code mechanism:** SessionStart hooks to inject "morning brief" from overnight analysis. Background scheduled jobs during user inactivity. Log replay and pattern extraction from ~/.claude/projects/ session archives. Context pruning of CLAUDE.md. Stale cache/temp file clearance. Re-attempting past failures with alternative approaches. Pre-computing likely needed resources for next session.

**Sources:** sleep-as-healing (entire document -- hippocampal replay, synaptic homeostasis, glymphatic system, immune repair, growth hormone, REM dreaming, sleep deprivation effects, NeuroDream, SleepNet/DreamNet, experience replay).

---

### Pattern 11: Two-Signal Activation (Danger Model)

**Biological description:** The immune system requires TWO signals before triggering an expensive response: (1) antigen detection (something unusual) AND (2) a danger/damage signal (evidence of actual harm). This prevents false-positive responses -- the immune system does not attack every foreign substance, only those accompanied by danger signals.

**Scale(s):** Immune system (danger theory), cellular (DNA damage checkpoint requiring both damage detection AND checkpoint kinase activation).

**Agent/computing equivalent:** Requiring confirmation from multiple independent signals before triggering expensive recovery operations. Not every anomaly deserves a full healing response -- only anomalies accompanied by evidence of actual impact.

**Claude Code mechanism:** Combining multiple hook signals: e.g., PostToolUseFailure (Signal 1: something failed) + pattern matching against known error taxonomy (Signal 2: this type of failure has caused problems before). Avoiding aggressive self-healing on transient, low-impact errors.

**Sources:** papers-biology (danger model / immune recognition theories), papers-intersection (dendritic cell algorithm), web-nature-healing (immune system overview).

---

### Pattern 12: Modularity for Failure Containment

**Biological description:** Modular biological networks limit perturbation propagation and allow independent evolution of subsystems. Modularity is a fundamental organizing principle across all biological scales, enhancing robustness, facilitating evolvability, and improving information flow.

**Scale(s):** Molecular (modular protein domains), cellular (organelle compartmentalization), organ (tissue compartments), organism (organ systems), neural (brain region modularity).

**Agent/computing equivalent:** Modular agent architectures where failures in one module do not cascade to others. Independent update cycles per module. Graceful degradation when a module fails.

**Claude Code mechanism:** Plugin architecture (each plugin is an independent module). Subagent isolation (each subagent runs in its own context). Skill modularity (independent SKILL.md files). Hook isolation (each hook is a separate script/process). Git worktree isolation for parallel development.

**Sources:** papers-biology (modularity papers -- Royal Society Interface, emergence of modularity), papers-intersection (organic computing, BioSymPLe hierarchical levels), web-agent-systems (anti-fragile software properties: modularity).

---

### Pattern 13: Antifragility (Strengthening from Stress)

**Biological description:** Biological systems do not merely survive stress -- they strengthen from it. Bones become denser under load. Muscles grow by repairing micro-tears. The immune system improves through pathogen exposure. Evolution itself is antifragility at the species level. The key mechanism is molecular flexibility and the ability to reconfigure rather than break.

**Scale(s):** Molecular (protein flexibility), cellular (hormesis), organ (bone loading, muscle hypertrophy), immune (vaccination principle), ecosystem (disturbance legacies), evolutionary (natural selection).

**Agent/computing equivalent:** Systems that mine failures for insights and permanently improve recovery strategies. Chaos engineering as deliberate stress-testing. The principle that every error should make the system more resistant to that class of error.

**Claude Code mechanism:** Compound engineering's compound cycle (solve problem -> document solution -> future agents avoid the problem). Chaos testing of agent configurations. Claude Reflect's correction-to-learning pipeline. /insights friction-to-CLAUDE.md-rule pipeline. Sleep-phase "dreaming" that replays failures with perturbations to build robustness.

**Sources:** readwise-filesystem-search (Bitcoin antifragility articles, Boz antifragile, Taleb references), web-nature-healing (antifragility in biology papers), papers-technology (Monperrus antifragile software, UNFRAGILE framework), papers-intersection (antifragile AI safety at ICML 2025, cyber immune system), web-agent-systems (Cloud Geometry anti-fragile AI principles).

---

### Pattern 14: Continuous Maintenance vs. Emergency Repair

**Biological description:** The most robust organisms do not just repair damage -- they continuously maintain. Hydra completely renews its body every 20 days. DNA is continuously proofread during replication. Bees continuously groom, clean, and apply propolis. The distinction between "always maintaining" and "repairing when broken" is fundamental.

**Scale(s):** Cellular (continuous DNA proofreading, ongoing autophagy), organism (Hydra body renewal), colony (constant grooming and cleaning), ecosystem (ongoing nutrient cycling, decomposition).

**Agent/computing equivalent:** Continuous integration and continuous monitoring. Proactive maintenance windows. The autopoietic principle -- systems that continuously create and maintain themselves, not just repair on failure.

**Claude Code mechanism:** SessionStart hooks that run health checks every session. Auto-memory that continuously records learnings. Sleep cycles that run maintenance even without detected failures. Compound engineering's incremental commits (continuous small repairs rather than large batch fixes).

**Sources:** web-nature-healing (Hydra immortality, continuous maintenance pattern), papers-biology (autopoiesis papers), papers-intersection (autopoietic computing, organic computing self-* properties), compound-engineering-analysis (compounding loop philosophy).

---

## 2. Priority Reading List (Top 20)

Ranked by: (a) direct relevance to Claude Code self-healing, (b) novelty of insights, (c) actionability.

---

### 1. VIGIL: A Reflective Runtime for Self-Healing Agents
**Author:** Christopher Cruz | **Year:** 2025 | **URL:** https://arxiv.org/abs/2512.07094
**Why critical:** The single most directly relevant paper. VIGIL is a working self-healing agent runtime that supervises a sibling agent, ingests behavioral logs, maintains a persistent data bank, derives diagnostics categorized into strengths/opportunities/failures, and generates guarded prompt updates. Reduced premature success notifications from 100% to 0%. Provides a concrete architectural blueprint.
**Informs:** Core architecture -- the supervisory self-healing pattern.

### 2. "Hallmarks of Regeneration" (Sanchez Alvarado et al.)
**Author:** Sanchez Alvarado et al. | **Year:** 2024 | **Journal:** Cell Stem Cell | **URL:** https://www.cell.com/cell-stem-cell/fulltext/S1934-5909(24)00257-1
**Why critical:** Identifies four universal hallmarks of biological regeneration that map directly to agent self-healing: (1) activate cell source = detect failure and activate repair, (2) initiate regenerative programs = start recovery, (3) interplay with supporting cells = coordinate with other agents, (4) control tissue size = reintegrate and restore function. The definitive biological framework.
**Informs:** Biological pattern mapping -- the four hallmarks become design requirements.

### 3. Reflexion: Language Agents with Verbal Reinforcement Learning
**Author:** Noah Shinn et al. | **Year:** 2023 (NeurIPS) | **URL:** https://arxiv.org/abs/2303.11366
**Why critical:** Foundational paper proving that agents can self-heal through verbal reflection stored in episodic memory. The three-component architecture (Actor, Evaluator, Self-Reflector) achieved 91% pass@1 on HumanEval. Demonstrates the core loop: attempt -> fail -> reflect -> store -> retry with context. Lightweight and applicable without finetuning.
**Informs:** Core mechanism -- the reflect-and-improve pattern for Claude Code.

### 4. Self-Improving Coding Agents (Addy Osmani)
**Author:** Addy Osmani | **URL:** https://addyosmani.com/blog/self-improving-agents/
**Why critical:** The most directly applicable practitioner guide. Describes the four-channel memory system (git history, progress log, task state, AGENTS.md) and the continuous coding loop with quality assurance as first-class citizen. Agents that run tests after each task and fix rather than proceed on failure. Demonstrates measurable improvement over dozens of iterations.
**Informs:** Implementation patterns -- memory channels, loop structure, quality gates.

### 5. Sleep-Like Unsupervised Replay Reduces Catastrophic Forgetting
**Author:** Bazhenov et al. (UC San Diego) | **Year:** 2022 | **Journal:** Nature Communications | **URL:** https://www.nature.com/articles/s41467-022-34938-7
**Why critical:** Proves that implementing a "sleep phase" with local unsupervised replay can recover forgotten memories without access to original training data. Directly validates the agent sleep architecture -- the idea that idle-time replay can consolidate and restore knowledge that would otherwise be lost between sessions.
**Informs:** Sleep architecture -- the scientific basis for agent sleep cycles.

### 6. Degeneracy: A Link Between Evolvability, Robustness and Complexity
**Author:** James M. Whitacre | **Year:** 2010 | **URL:** https://pmc.ncbi.nlm.nih.gov/articles/PMC2830971/
**Why critical:** Proves that degenerate systems (diverse components with overlapping function) are orders of magnitude more evolvable and robust than purely redundant systems (identical copies). This fundamentally changes how we think about agent fault tolerance -- we should design for diversity with overlap, not identical backup copies.
**Informs:** Architecture -- degeneracy as the foundation for multi-agent resilience.

### 7. Automate Workflows with Hooks (Official Claude Code Docs)
**Author:** Anthropic | **URL:** https://code.claude.com/docs/en/hooks-guide
**Why critical:** The primary extensibility mechanism for building self-healing into Claude Code. Three hook types (command, prompt, agent) at eight lifecycle events. PreToolUse hooks can modify inputs; Stop hooks can force continuation. Agent-based hooks enable multi-turn verification. This is the substrate our entire system builds on.
**Informs:** Implementation platform -- the specific API surface for self-healing behaviors.

### 8. Cognitive Homeostatic Agents
**Author:** Amol Kelkar | **Year:** 2021 (AAMAS Blue Sky) | **URL:** https://arxiv.org/abs/2103.03359
**Why critical:** Directly proposes agent architecture based on homeostasis. Agents organized as hierarchy-like graphs of homeostatic subsystems, each maintaining internal balance while contributing to system-level stability. Provides the theoretical bridge from biological homeostasis to multi-agent design.
**Informs:** Architecture -- the homeostatic agent pattern for self-regulation.

### 9. Large Language Models Cannot Self-Correct Reasoning Yet
**Author:** Huang et al. | **Year:** 2024 (ICLR) | **URL:** https://arxiv.org/abs/2310.01798
**Why critical:** Critical design constraint. Proves that intrinsic self-correction (without external feedback) is unreliable and can degrade performance. Our system MUST incorporate external feedback signals (test results, error logs, monitoring data) rather than relying on the LLM to judge its own output. The most important "what NOT to do" paper.
**Informs:** Design constraints -- the requirement for external feedback in all healing loops.

### 10. Compound Engineering Plugin (Kieran Klaassen / Every Inc.)
**Author:** Kieran Klaassen | **URL:** https://github.com/EveryInc/compound-engineering-plugin
**Why critical:** The current state-of-the-art in agent-assisted workflow with 27 agents, 24 commands, and 15 skills. The Plan-Work-Review-Compound cycle, the /heal-skill command, the structured YAML solution library, and the parallel multi-agent review pattern are all directly relevant. The gap analysis reveals exactly where biological self-healing adds value: autonomous healing, continuous monitoring, knowledge decay management, adaptive immune response.
**Informs:** Existing landscape + gap analysis -- what exists and what is missing.

### 11. A Comprehensive Conceptual Framework for Autonomous Regeneration Systems
**Author:** Minh-Thai, Samarasinghe, Levin | **Year:** 2021 | **Journal:** Artificial Life (MIT Press) | **URL:** https://direct.mit.edu/artl/article/27/2/80/106921
**Why critical:** Framework inspired by planarian regeneration using Auto-Associative Neural Networks. Introduces the "Information Field" -- a distributed knowledge representation of what the healthy system should look like, accessible for regeneration from any damage point. Co-authored by Michael Levin. Achieves complete regeneration from any damage.
**Informs:** Architecture -- the "information field" concept for distributed desired-state.

### 12. Claude Reflect System (Haddock Development)
**Author:** Haddock Development | **URL:** https://github.com/haddock-development/claude-reflect-system
**Why critical:** The most complete existing self-learning plugin for Claude Code. Three-phase learning pipeline (signal detection -> pattern analysis -> safe skill updates) with three confidence levels (HIGH/MEDIUM/LOW), both manual and automatic modes, and robust safety mechanisms (backups, rollback, approval workflow). The closest existing work to what we are building.
**Informs:** Existing implementation -- what works and what gaps remain (no self-detected errors, no validation of learned rules).

### 13. "Failure Makes the Agent Stronger"
**Authors:** (arXiv) | **Year:** 2025 | **URL:** https://arxiv.org/html/2509.18847v2
**Why critical:** Proves that failure recovery is a trainable, optimizable skill. Constructs Tool-Reflection-Bench with ~5,000 perturbation-reflection pairs. Shows 95% improvement in Llama-3.1-8B accuracy and 28-39% improvements in multi-turn success through structured reflection. The perturbation injection methodology is directly applicable for testing our self-healing agents.
**Informs:** Testing methodology + evidence that structured reflection works.

### 14. Pace Layering: How Complex Systems Learn and Keep Learning
**Author:** Stewart Brand | **Journal:** MIT Press JODS | **URL:** https://jods.mitpress.mit.edu/pub/issue3-brand
**Why critical:** The foundational theory for multi-speed healing layers. "Fast learns, slow remembers. Fast proposes, slow disposes." Directly structures our four-layer architecture: real-time hooks (fast), session-level reflection (medium), sleep cycles (slow), periodic evolution (slowest).
**Informs:** Architecture -- the pace-layering principle for multi-timescale healing.

### 15. Episodic Memory Plugin (Jesse Vincent / obra)
**Author:** Jesse Vincent | **URL:** https://github.com/obra/episodic-memory
**Why critical:** The most architecturally complete memory solution for Claude Code. Six components (automatic archival hook + SQLite vector search + CLI + MCP tool + skill + Haiku subagent). Provides semantic search across past conversations. The reference architecture for how to build persistent, searchable agent memory.
**Informs:** Implementation -- memory system architecture for Claude Code.

### 16. The Synaptic Homeostasis Hypothesis (Tononi & Cirelli)
**Author:** Tononi & Cirelli | **Year:** 2003-2020 | **URL:** https://pubmed.ncbi.nlm.nih.gov/14638388/
**Why critical:** "Sleep is the price the brain pays for plasticity." During waking, learning causes net synaptic strengthening that degrades signal-to-noise. During sleep, selective downscaling prunes weak connections while preserving strong ones. Without this, learning itself becomes pathological. The most powerful argument for why agents need pruning/sleep cycles -- accumulation without pruning leads to degradation.
**Informs:** Sleep architecture -- the scientific basis for context/memory pruning.

### 17. A Brain-Inspired Agentic Architecture (Modular Agentic Planner)
**Author:** Webb, Mondal, Momennejad (Microsoft Research) | **Year:** 2025 | **Journal:** Nature Communications | **URL:** https://www.nature.com/articles/s41467-025-63804-5
**Why critical:** Demonstrates that brain-inspired modular agent architecture outperforms monolithic approaches. Planning via interaction of specialized modules (conflict monitoring, state prediction, evaluation, task decomposition, coordination). Published in Nature Communications. Each module could include self-healing capabilities.
**Informs:** Architecture -- brain-inspired modularity for agent design.

### 18. NeuroDream: A Sleep-Inspired Memory Consolidation Framework
**Author:** Tutuncuoglu | **Year:** 2024-2025 | **URL:** https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5377250
**Why critical:** The closest existing computational framework to our agent sleep architecture. Explicit dream phase where the model disconnects from input, generates internal simulations from stored representations, and uses them to rehearse, consolidate, and abstract. 38% reduction in forgetting, 17.6% increase in zero-shot transfer. The template for implementing agent dreaming.
**Informs:** Sleep architecture -- computational sleep implementation.

### 19. Anthropic's Insights Report Analysis
**Source:** anthropic-insights-analysis.md (analysis of /insights command)
**Why critical:** Demonstrates that Claude Code already captures rich telemetry (friction types, satisfaction inference, response time, tool errors) and generates actionable recommendations. The gaps identified (post-hoc vs. real-time, no causal model, no cross-session learning, no severity weighting, no recovery mechanism) define exactly what a self-healing system needs to add. The friction taxonomy (Wrong Approach, Misunderstood Request, Buggy Code, Excessive Changes) maps directly to healing strategies.
**Informs:** Gap analysis -- what /insights provides and what self-healing must add.

### 20. Position: AI Safety Must Embrace an Antifragile Perspective
**Author:** Ming Jin et al. | **Year:** 2025 (ICML) | **URL:** https://arxiv.org/abs/2509.13339
**Why critical:** Makes the case that static resilience is insufficient -- AI systems must adopt antifragility where the capacity to handle rare events adapts and expands over repeated exposures. Conventional benchmarks overlook environmental evolution and model drift. Published at ICML 2025. Provides the philosophical foundation for our project's antifragile aspiration.
**Informs:** Philosophy -- antifragility as the north star beyond self-healing.

---

## 3. Existing Landscape Map

### What Anthropic Has Built

| Component | What It Does | Self-Healing Relevance |
|-----------|-------------|----------------------|
| **CLAUDE.md** | User-authored behavioral specification loaded every session | Target morphology / desired state. The "blueprint" the agent heals toward. |
| **Auto Memory** | Persistent directory (~/.claude/projects/.../memory/) where Claude records learnings | Basic learning mechanism. Passive -- requires explicit prompting or opportunistic recording. |
| **Hooks System** | Shell commands at 8 lifecycle points (PreToolUse, PostToolUse, PostToolUseFailure, SessionStart, Stop, Notification, SubagentStart/Stop, ConfigChange) | **Primary substrate for self-healing.** Three types: command (deterministic), prompt (LLM-judged), agent (multi-turn verification). PreToolUse can modify inputs. Stop can force continuation. |
| **/insights** | Retrospective HTML report analyzing 30 days of usage. 6-stage pipeline: filter -> summarize -> extract facets -> aggregate -> synthesize -> render. Detects 12 friction types. | Diagnostic layer only. Post-hoc, not real-time. Recommends but does not execute. No cross-session learning. No causal model. |
| **Subagents** | Specialized autonomous agents in isolated contexts with custom prompts, tool restrictions, and hooks | Enables supervisor/worker pattern. Each subagent can have its own self-healing hooks. |
| **Skills** | Modular directories with SKILL.md files. Agent pre-loads name + description. LLM decides when to invoke. | Natural packaging format for self-healing capabilities. |
| **Plugins** | Bundles of commands, subagents, skills, hooks, and MCP servers | Distribution format for self-healing extensions. |
| **Ralph Wiggum** | Official plugin. Stop hook that re-feeds prompt with accumulated state. Creates autonomous loops. | Foundational self-healing pattern: iterative self-correction through state accumulation. |
| **Hookify** | Official plugin. Pattern-matching behavior modification via markdown config files. Block or warn. | Guardrail mechanism. Prevents known-bad behaviors. Rules take effect immediately. |
| **Learning Output Style** | Official plugin. SessionStart hook that injects teaching-mode instructions. | Demonstrates the pattern of modifying behavior via hook injection at session start. |

### What Community Plugins Exist

| Plugin | Author | What It Does | Self-Healing Contribution |
|--------|--------|-------------|--------------------------|
| **Episodic Memory** | Jesse Vincent (obra) | Vectorized SQLite store of past conversations. Semantic search. 6-component architecture. | The most complete memory solution. Recall mechanism for past experiences. |
| **Claude Reflect System** | Haddock Dev | Three-phase learning: signal detection -> pattern analysis -> safe skill updates. HIGH/MEDIUM/LOW confidence. | Most directly relevant self-improvement plugin. Correction-to-learning pipeline. |
| **Claude-Meta** | aviadr1 | Meta-rules for self-improving CLAUDE.md. "Reflect, Abstract, Generalize, Document." | Elegant simplicity. Single prompt creates a self-improving loop. |
| **Claude Diary** | Lance Martin | Diary entries + reflection. Separates experience capture from learning synthesis. | Two-stage learning: capture then reflect. Inspired by Anthropic employee practices. |
| **Compound Engineering** | Kieran Klaassen / Every | 27 agents, 24 commands, 15 skills. Plan-Work-Review-Compound cycle. /heal-skill command. YAML solution library. | Current SOTA in agent-assisted workflow. Structured knowledge capture. Parallel multi-agent review. |
| **Claude-Mem** | thedotmack | AI-compressed session summaries injected into future sessions. | Compression as learning. Higher-quality memories than raw archives. |
| **Claude Supermemory** | Supermemory AI | Cloud-based persistent memory. Signal-based capture (keywords: "bug", "fix"). Team memory. | Cross-developer collective learning. |
| **Self-Improving Agent Skill** | mcpmarket | .learnings/ directory with LEARNINGS.md, ERRORS.md, FEATURE_REQUESTS.md. Promotion paths. | Structured error recording. Knowledge graduation system. |
| **Pro-Workflow** | rohitg00 | Self-correcting memory, parallel worktrees, wrap-up rituals, 80/20 review. | Disciplined learning process with end-of-session capture. |
| **Context7** | compound-engineering | Up-to-date documentation for 100+ frameworks via MCP. | Prevents errors at source by providing accurate API knowledge. |

### What Academic Work Has Been Done

| System/Paper | Key Contribution | Maturity |
|-------------|-----------------|----------|
| **VIGIL** (Cruz, 2025) | Reflective runtime that supervises agents. Log ingestion -> structured appraisal -> persistent data bank -> diagnostic categorization -> guarded prompt/code updates. | Research prototype. Most directly relevant. |
| **Reflexion** (Shinn et al., 2023) | Verbal reinforcement learning. Actor-Evaluator-Reflector architecture. Episodic memory buffer. | Influential. Widely cited. No production implementation for Claude Code. |
| **MAPE-K** (Kephart & Chess, 2003) | Monitor-Analyze-Plan-Execute-Knowledge loop. The canonical self-healing architecture. | Mature field (20+ years). IBM autonomic computing. |
| **AWARE** (Sanwouo et al., 2024) | Assess-Weigh-Act-Reflect-Enrich. Evolution of MAPE-K with proactive adaptation and continuous learning. | Recent. Adds reflection and enrichment phases. |
| **PALADIN** (2025) | Self-correcting agents via trajectory-level supervision. 50K+ failure-recovery trajectories. | Research. Novel metrics: Recovery Rate, Catastrophe Success Rate. |
| **AgentDebug** (2025) | AgentErrorTaxonomy + AgentErrorBench. Cascading failure analysis. Up to 26% relative improvement. | Research. Provides error classification system. |
| **RepairAgent** (2025, ICSE) | Autonomous LLM-based program repair. 164 bugs fixed on Defects4J. | Research. Demonstrates autonomous code repair viability. |
| **ADAS** (ICLR 2025) | Meta-agent that designs better agents. Turing-complete search over agent designs. | Research. The "meta-healing" concept. |
| **Voyager** (NVIDIA, 2023) | Skill library of executable code indexed by semantic description. Iterative error correction. | Research + demo. Skill library pattern applicable to healing recipes. |
| **Artificial Immune Systems** | 20+ years of bio-inspired anomaly detection. Negative selection, clonal selection, danger theory. | Mature field. Well-validated in cybersecurity. |
| **UNFRAGILE** (2024) | Adaptive chaos-driven antifragility framework for cloud systems. | Research. Practical chaos + antifragility combination. |
| **Overstory** | Swarm system for Claude Code. Tiered health monitoring: Tier 0 (mechanical liveness), Tier 1 (AI triage), Tier 2 (continuous patrol). | Open source. Directly applicable to Claude Code. |

### What Is in the User's Obsidian Vault

The vault contains 85+ relevant articles across 11 tiers of relevance, including:
- **Tier 1 (directly relevant):** "As Complexity Grows, Architecture Dominates Material" (self-healing as emergent property of message-passing), "On the Biology of a Large Language Model" (Anthropic's interpretability as biology), "Signals: Toward a Self-Improving Agent" (Factory.ai's production self-healing), "The Feedback Loop is a Better Symbol of Life Than the Helix" (feedback as life's fundamental mechanism).
- **Personal notes:** "Artificial Intelligence or Intelligence Augmentation" -- user's own thinking on self-healing as prerequisite for AI-managed operations. "Agents" literature note distinguishing true agents (dynamic flow) from workflows.
- **Books:** The Systems View of Life, Scale, The Selfish Gene, The Red Queen, Designing Data-Intensive Applications.

---

## 4. Gap Analysis

### Gaps in the Plugin Ecosystem

1. **No Automatic Error Detection Without Human Intervention.** Every existing self-improvement plugin requires the user to either explicitly correct Claude, run /reflect, or provide feedback. No plugin monitors tool call results, test outcomes, and command exit codes to automatically detect patterns and trigger learning pipelines. This is the "innate immune system" gap.

2. **No Closed-Loop Validation of Learned Rules.** Plugins add rules to CLAUDE.md but never verify those rules actually prevent error recurrence. A rule like "always use uv instead of pip" is recorded but never tested. This is the "affinity maturation" gap -- the immune system validates antibody effectiveness; current systems do not.

3. **No Biological Self-Healing Patterns.** All existing approaches use software engineering patterns (logging, config files, feedback loops). None implement immune memory (rapid response to previously-seen errors), inflammation cascading (escalating response by severity), redundancy with degeneracy (diverse not identical backups), or adaptation thresholds.

4. **No Sleep/Idle-Time Healing.** No plugin uses agent idle time for active maintenance, consolidation, pruning, or creative problem-solving. Idle agents are truly idle. The entire sleep-as-healing paradigm is unaddressed.

5. **No Multi-Agent Healing Coordination.** Plugins are single-agent focused. No system enables agents to share healing state, collectively learn from mistakes, or coordinate recovery across agent boundaries. The "social immunity" pattern from biology is absent.

6. **No Proactive/Predictive Self-Healing.** All systems are reactive. None predict conditions likely to cause errors (low confidence, unfamiliar patterns, missing documentation) and take preventive action. The "trained immunity" gap.

7. **No Self-Healing Observability.** No dashboard shows what rules are active, how often triggered, their success rate, or candidates for revision. The healing system itself is a black box.

8. **No Error Taxonomy or Standardized Healing Strategies.** Errors are recorded as freeform text with no shared ontology mapping error types to healing strategies.

### Gaps in Academic Research

1. **No LLM Agent Sleep Architecture.** While NeuroDream, SleepNet, and brain-inspired replay exist for neural networks, no one has implemented a staged sleep cycle (N1-N2-N3-REM equivalent) for an LLM-based agent system. The sleep-as-healing research maps are all at the neural network level, not the agent orchestration level.

2. **No Integration of Multiple Biological Metaphors.** Most papers use ONE biological metaphor (immune OR homeostasis OR swarm OR wound healing). Real organisms use immune + nervous + endocrine + healing systems simultaneously. No paper integrates multiple bio-inspired mechanisms into a single agent architecture.

3. **No Benchmarks for Self-Healing Capability.** There are no standard benchmarks for measuring whether an agent system genuinely self-heals, how fast it recovers, or whether it improves from failures. PALADIN's metrics (Recovery Rate, Catastrophe Success Rate, Efficiency Score) are a start but limited.

4. **No Formal Model of Healing Termination.** Biology has explicit STOP signals (TGF-beta1, Wnt5a) for healing. No paper addresses how to prevent over-healing in agent systems -- the "autoimmune" problem.

5. **No Study of Self-Healing in Claude Code Specifically.** VIGIL is model-agnostic. No academic work targets Claude Code's specific architecture (hooks, skills, CLAUDE.md, subagents, auto-memory) as the substrate for self-healing.

### Gaps in Biological-to-Computing Translation

1. **Glymphatic Clearance Has No Agent Equivalent.** The brain's dedicated waste-clearance infrastructure (perivascular channels, aquaporin-4, cerebrospinal fluid pumping) has no parallel in agent systems. Current "garbage collection" is crude compared to the specialized, dedicated, physically-distinct clearance pathways in biology.

2. **Epigenetic Memory Is Unaddressed.** Organisms express different genes based on environmental context without changing DNA. The equivalent for agents -- context-dependent behavioral patterns that emerge from accumulated experience but are more granular than explicit documentation -- does not exist.

3. **Paracrine Signaling Is Missing.** Stem cells do not just replace lost cells; they secrete growth factors that coordinate the entire repair environment. Current repair agents silently fix things without broadcasting coordination signals to their environment.

4. **The Blastema Concept Has No Computing Analog.** In regeneration, a blastema forms -- a mass of dedifferentiated cells that can be reprogrammed into whatever is needed. There is no computing equivalent of a "dedifferentiated pool of general-purpose repair resources" that can be specialized on demand.

5. **Circadian Rhythm / Ultradian Cycling.** Biology does not do maintenance in one big window. It cycles through 90-minute sleep cycles with different phases. No computing system implements true cycling maintenance with distinct phase functions.

### Unique Opportunities for This Project

1. **First Bio-Inspired Self-Healing Plugin for Claude Code.** No one has applied biological healing patterns to Claude Code's specific extensibility surface (hooks, skills, subagents, CLAUDE.md, auto-memory, plugins).

2. **First Agent Sleep Architecture.** The staged sleep cycle (transition -> light maintenance -> deep maintenance -> creative optimization) has not been implemented for any LLM agent system. This is the most novel contribution.

3. **First Integration of Multiple Biological Metaphors.** Combining immune system (error detection and memory), homeostasis (continuous regulation), wound healing (phased repair), sleep (offline consolidation and pruning), and antifragility (strengthening from stress) in a single coherent architecture.

4. **Bridging /insights to Self-Healing.** Taking Anthropic's existing diagnostic capability and closing the loop -- from retrospective analysis to real-time detection and automatic correction.

5. **"Your Agents Are Growing" Narrative.** Reframing idle time from anxiety-producing "nothing is happening" to confidence-building "the system is healing and growing." This narrative angle is completely unaddressed.

---

## 5. Emerging Architecture

### The Pace-Layering Model

Based on all research, the architecture naturally organizes into four temporal layers, directly inspired by Stewart Brand's pace layering and biological multi-scale healing:

```
LAYER 4: PERIODIC EVOLUTION (weeks-months)
  Biological analog: Evolution, ecological succession
  Functions: /insights-driven CLAUDE.md rewriting, skill architecture changes,
             plugin updates, strategy overhauls
  Mechanism: Scheduled deep analysis + human-in-the-loop review
  Trigger: Accumulated session data, detected systemic patterns

LAYER 3: SLEEP CYCLES (between sessions, overnight)
  Biological analog: Sleep -- hippocampal replay, synaptic homeostasis,
                     glymphatic clearance, immune patrol, REM dreaming
  Functions: Memory consolidation, context pruning, waste clearance,
             health scanning, capability building, creative problem-solving
  Mechanism: Scheduled or fatigue-triggered staged cycles (N1-N2-N3-REM)
  Trigger: User inactivity, scheduled interval, fatigue threshold

LAYER 2: SESSION-LEVEL REFLECTION (within/between tasks)
  Biological analog: Wound healing phases, organ-level regeneration
  Functions: Stop-hook task verification, reflect-and-improve loops,
             strategy adjustment, scope monitoring, checkpoint/backtrack
  Mechanism: Stop hooks (prompt/agent type), within-session reflection,
             CLAUDE.md rule application
  Trigger: Task completion, error accumulation, satisfaction signal drop

LAYER 1: REAL-TIME IMMUNE RESPONSE (per tool call)
  Biological analog: Innate immunity, blood clotting, DNA mismatch repair
  Functions: PreToolUse validation/modification, PostToolUse output checking,
             PostToolUseFailure recovery, retry/fallback/circuit-breaker,
             dangerous operation blocking
  Mechanism: Command hooks (fast, deterministic), prompt hooks (LLM-judged)
  Trigger: Every tool call, every error, every output
```

### Biological Primitives Mapped to Claude Code Primitives

| Biological Primitive | Claude Code Primitive | Implementation |
|---------------------|----------------------|----------------|
| **Innate immune response** | PreToolUse command hooks | Pattern-matching blockers and input modifiers for known threats |
| **Adaptive immune memory** | docs/solutions/ + episodic memory | Searchable library of past failures with indexed recovery strategies |
| **Antibodies** | PostToolUse validation hooks | Specific detection patterns for known failure modes with pre-computed remediation |
| **T-cell surveillance** | Stop hooks (agent type) | Multi-turn verification agents that patrol completed work |
| **Inflammation** | Error escalation cascade | Increasing response intensity based on error severity (retry -> fallback -> circuit break -> human escalation) |
| **Homeostatic setpoint** | CLAUDE.md specification | Declarative behavioral specification the agent continuously reconciles toward |
| **Synaptic pruning** | Memory/context pruning during sleep | Review usage patterns, remove unused rules, simplify decision trees |
| **Hippocampal replay** | Log replay during sleep | Compress and replay session logs to extract cross-session patterns |
| **Glymphatic clearance** | Waste collection during sleep | Clear stale caches, orphaned temps, deprecated configs, redundant context |
| **REM dreaming** | Creative problem replay during sleep | Re-attempt past failures with relaxed constraints and perturbations |
| **Growth hormone** | Capability building during sleep | Pre-compute caches, rebuild indexes, generate improved templates |
| **Apoptosis** | Graceful process termination | Kill and replace failing agents/subagents rather than patching |
| **Stem cells** | Generic subagent templates | Undifferentiated agents that can be specialized for any repair task |
| **Target morphology** | CLAUDE.md + project config | The "desired state" that repair processes work toward |
| **Stigmergy** | File-based state (filesystem as coordination medium) | Agents coordinate through shared files rather than direct messaging |
| **Affinity maturation** | Rule validation and refinement | Test learned rules against scenarios, strengthen effective ones, prune ineffective |
| **Danger signals** | Two-signal activation | Require both error detection AND impact confirmation before expensive repair |
| **Circadian rhythm** | Sleep cycle scheduling | Configurable maintenance schedule adapted to usage patterns |

### Key Design Principles (Consolidated from All Sources)

1. **External feedback is non-negotiable.** Self-correction without external signals (test results, error logs, monitoring data) is unreliable and can degrade performance (Huang et al., ICLR 2024). Every healing loop must be grounded in observable evidence.

2. **Healing is multi-phase, not monolithic.** All biological healing proceeds through overlapping stages. Agent healing should similarly progress: detect -> contain -> diagnose -> plan -> execute -> verify -> consolidate. Do not try to do everything at once.

3. **Diversity beats duplication.** Degenerate systems (diverse agents with overlapping capabilities) are orders of magnitude more robust than redundant systems (identical copies). Design for diversity with overlap, not for identical backup.

4. **Pruning is as important as learning.** Without periodic pruning, learning becomes pathological (Tononi & Cirelli). Accumulated rules, configs, and context must be actively simplified. "Sleep is the price the brain pays for plasticity."

5. **Vulnerability enables adaptation.** Homeostatic agents that are somewhat exposed to their environment adapt better than fully shielded ones (Man, Damasio, Neven, 2022). Do not over-protect agents from failures -- let them experience and learn from controlled stress.

6. **Local rules produce global healing.** Simple agents following local rules can produce sophisticated system-level self-repair (termite stigmergy, ant colony repair). The global healing behavior should emerge from well-designed local behaviors, not from centralized orchestration.

7. **Healing must know when to stop.** Biology has explicit termination signals for repair. Agent healing needs explicit termination conditions to prevent over-healing (runaway auto-scaling, infinite retry loops, rule proliferation, config bloat).

8. **Failures contain value.** Failures are not just negative examples -- they contain partial solutions and reveal hidden system relationships (EEF paper). Mine failures for insights, do not just fix and forget them.

9. **Sleep is not downtime.** Idle time should be used for active staged maintenance: waste clearance, memory consolidation, pruning, immune scanning, capability building, and creative problem-solving. The agent should be growing when it is not serving.

10. **The healing system must heal itself.** Self-healing observability is essential. The healing mechanisms need their own monitoring, validation, and evolution. Rules that are never triggered should be pruned. Recovery strategies that do not work should be updated.

### How Sleep, Immune Response, and Homeostasis Work Together

The three major biological healing systems are not separate -- they are deeply integrated:

```
                    HOMEOSTASIS (Continuous)
                    ========================
                    Monitors all vital signs continuously.
                    Triggers immune response when deviation detected.
                    Triggers sleep deepening when fatigue accumulates.
                    Adjusts all setpoints based on environmental context.
                          |
          +--------------+--------------+
          |                             |
    IMMUNE SYSTEM                 SLEEP SYSTEM
    (Reactive + Proactive)        (Cyclic Maintenance)
    ====================          ==================
    Layer 1: Innate               Stage 3 (N3/SWS):
      - Pattern recognition         - Glymphatic clearance
      - Immediate response           - Memory consolidation
      - Inflammation cascade         - Synaptic pruning
    Layer 2: Adaptive                - Immune patrol
      - Antigen-specific             - Growth/building
      - Memory B/T cells           Stage 4 (REM):
      - Affinity maturation          - Creative recombination
      - Clonal expansion             - Data augmentation
                                     - Forward preparation
          |                             |
          +-------------+---------------+
                        |
              INTEGRATION POINTS
              ===================
              1. Immune activation deepens sleep
                 (more errors -> deeper maintenance)
              2. Sleep strengthens immunity
                 (consolidated patterns -> better detection)
              3. Homeostasis regulates both
                 (setpoint drift -> trigger healing cycles)
              4. Night gardeners: microglia do BOTH
                 immune patrol AND synaptic pruning
                 (maintenance and security are the same system)
```

In the agent architecture, this integration means:
- **Error detection (immune)** informs **sleep depth** -- more errors detected during active operation should trigger deeper sleep cycles.
- **Sleep consolidation** improves **immune effectiveness** -- patterns extracted during sleep become better detection rules for the next active period.
- **Homeostatic monitoring** regulates **both** -- tracking key metrics (error rate, response quality, context freshness) and triggering either immediate immune responses or scheduled sleep cycles depending on the nature and severity of the deviation.
- **The maintenance agent and the security agent should be the same agent** -- like microglia, a single system that both fights threats and optimizes structure.

---

## 6. Key Tensions and Open Questions

### Tension 1: Autonomy vs. Human Approval

**The problem:** Biological immune systems do not require conscious approval to respond to threats. But autonomous self-modification of an AI agent's behavior raises legitimate safety concerns. The Compound Engineering /heal-skill command requires human approval. Claude Reflect requires manual /reflect invocation.

**The spectrum:**
- Conservative: All changes require human approval (current state of most plugins)
- Progressive: Low-risk changes are automatic, high-risk require approval (Compound Engineering's direction)
- Aggressive: All changes are automatic with rollback on failure (no existing implementation)

**Biological answer:** The immune system has autonomous authority for routine defense but escalates to conscious attention for novel/severe threats (fever, pain, fatigue = "get the human involved"). The key is a severity-based escalation model.

**Open question:** Where on the spectrum should each healing layer operate? Proposed: Layer 1 (real-time) should be fully autonomous. Layer 2 (session) should be autonomous with notification. Layer 3 (sleep) should be autonomous with next-session reporting. Layer 4 (periodic) should require human review.

### Tension 2: Memory Growth vs. Pruning

**The problem:** Self-healing systems accumulate knowledge: CLAUDE.md rules, docs/solutions/ entries, episodic memories, learned patterns. Without pruning, this knowledge becomes counterproductive -- contradictory rules, stale patterns, bloated context that degrades performance.

**Biological answer:** Synaptic homeostasis hypothesis -- sleep selectively downscales weak connections while preserving strong ones. The immune system forgets irrelevant antigens over time. The planarian continuously turns over its entire body.

**Open question:** What is the right pruning strategy? The Eugene Oleinik pattern (max 30 items in CLAUDE.md, monthly review) is a start, but it is manual. How do you automatically identify which rules are still effective and which have become stale? How do you measure "rule freshness"? When does a learned pattern expire?

### Tension 3: Over-Healing / Autoimmune Risk

**The problem:** In biology, over-active healing is pathological: autoimmune diseases (immune system attacking self), fibrosis (excessive scar tissue), cancer (uncontrolled cell proliferation). In agents: over-eager self-correction could create a system that is constantly changing its own behavior, never achieving stability. Rules that are too aggressive could prevent the agent from functioning normally.

**Biological answer:** Two-signal activation prevents false positives. Regulatory T-cells suppress excessive immune responses. Homeostatic setpoints define "normal" ranges. Explicit STOP signals terminate repair.

**Open question:** How do we implement the "regulatory T-cell" equivalent? What prevents the self-healing system from over-correcting? Need explicit termination conditions for all healing loops, rate limits on self-modification, and "immune tolerance" for normal behavioral variation.

### Tension 4: Complexity Budget

**The problem:** Each biological mechanism we model adds complexity. A system with immune detection + homeostatic monitoring + sleep cycles + four pace layers + stigmergic coordination + degeneracy + target morphology + two-signal activation would be extraordinarily complex. Complexity itself is a source of fragility.

**Biological answer:** Biological systems are enormously complex but achieve this through extreme modularity and local simplicity. Individual cells follow simple rules; complexity emerges from composition.

**Open question:** What is the minimum viable set of biological patterns that delivers maximum value? Proposed priority: (1) Sleep cycles (highest novelty, biggest gap), (2) Immune memory (highest practical value), (3) Homeostatic monitoring (continuous health regulation), (4) Multi-phase healing pipeline (structural foundation). Start with these four and add others incrementally.

### Tension 5: Feasibility with Current Claude Code Architecture

**The problem:** Claude Code's extensibility surface (hooks, skills, subagents, CLAUDE.md, plugins) is powerful but has constraints:
- Hooks execute synchronously, blocking the main agent. Long-running maintenance is problematic.
- Context windows are finite. Accumulated memory competes with task context.
- Claude has no persistent process -- each session starts fresh (only CLAUDE.md and auto-memory persist).
- No built-in scheduling mechanism for sleep cycles.
- No native idle-time detection or background processing capability.

**Specific feasibility concerns:**
- **Sleep cycles:** Require a daemon or scheduled job outside Claude Code itself (cron, launchd, or a separate process). The sleep system cannot run inside Claude Code because Claude Code does not persist between sessions.
- **Real-time immune response:** PreToolUse hooks run synchronously. Complex analysis in a hook would slow every tool call. Must be fast (command hooks with simple pattern matching) or asynchronous.
- **Memory consolidation:** Requires processing session archives in ~/.claude/projects/ outside of active sessions. Feasible with external scripts triggered by cron or session-end hooks.
- **Creative dreaming:** Requires running Claude on past problems during idle time. This costs API credits with no user-visible output. User willingness to pay for "sleep" is uncertain.

**Open question:** What can be built entirely within Claude Code's native extensibility (hooks, skills, plugins) vs. what requires external infrastructure (daemons, cron jobs, separate processes)? The proposed split: Layers 1-2 (real-time + session) are fully native. Layer 3 (sleep) requires a lightweight external daemon. Layer 4 (periodic) can use /insights + manual review initially.

### Tension 6: Measuring Success

**The problem:** How do we know the self-healing system is working? What metrics demonstrate that the agent is genuinely improving?

**Proposed metrics (from across the research):**
- **Recovery Rate:** % of failures automatically recovered without human intervention
- **MTTR (Mean Time to Recovery):** Time from error detection to verified fix
- **Friction Rate Trend:** Are /insights friction types decreasing over time?
- **Recurrence Rate:** When a class of error is "learned," does it actually stop recurring?
- **Rule Effectiveness:** % of CLAUDE.md rules that demonstrably change behavior
- **Sleep Efficiency:** Ratio of useful maintenance actions to total sleep time
- **Compounding Index:** Measurable improvement per session (task completion rate, error rate, user satisfaction)

**Open question:** Which metrics are actually measurable with current tooling? Recovery rate and friction rate trend seem feasible. Recurrence rate requires longitudinal tracking. Rule effectiveness requires A/B testing or synthetic scenario testing. Some metrics may need to remain aspirational initially.

### Tension 7: Single-Agent vs. Multi-Agent Healing

**The problem:** The research supports both single-agent self-healing (VIGIL supervising one agent) and multi-agent collective healing (ant colony, bee social immunity). Claude Code's subagent system enables multi-agent patterns, but coordination adds complexity.

**Open question:** Should the minimum viable system focus on single-agent self-healing (one Claude Code instance improving itself) or multi-agent (multiple instances sharing healing intelligence)? The biological evidence suggests starting with single-agent (every organism heals itself first) and adding multi-agent coordination later (social immunity, herd immunity emerge at the colony level).

---

*This synthesis document draws from 300+ sources across 11 research files and 1 project document. It represents the complete landscape analysis, biological pattern mapping, and architectural direction for the self-healing agents project.*
