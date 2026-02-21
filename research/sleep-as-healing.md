# Sleep as a Healing System: From Biology to Agent Architecture

**Research Date:** 2026-02-20
**Purpose:** Deep investigation of sleep as biology's primary maintenance and healing cycle, existing computational parallels, and how these map to an AI agent "sleep" system. This is a key differentiating angle for the self-healing agents project -- sleep is not downtime, it is the healing.

---

## Table of Contents

1. [The Biology of Sleep as Healing](#1-the-biology-of-sleep-as-healing)
   - [1.1 Memory Consolidation: Hippocampal Replay](#11-memory-consolidation-hippocampal-replay)
   - [1.2 Synaptic Homeostasis: The Pruning Imperative](#12-synaptic-homeostasis-the-pruning-imperative)
   - [1.3 Glymphatic System: Brain Waste Clearance](#13-glymphatic-system-brain-waste-clearance)
   - [1.4 Immune System Repair During Sleep](#14-immune-system-repair-during-sleep)
   - [1.5 Tissue Repair and Growth Hormone Release](#15-tissue-repair-and-growth-hormone-release)
   - [1.6 Sleep Stages and Their Distinct Healing Functions](#16-sleep-stages-and-their-distinct-healing-functions)
   - [1.7 Dreaming as Problem-Solving and Creative Recombination](#17-dreaming-as-problem-solving-and-creative-recombination)
   - [1.8 Sleep Deprivation: What Breaks When Healing Stops](#18-sleep-deprivation-what-breaks-when-healing-stops)
2. [Existing Computing Parallels](#2-existing-computing-parallels)
   - [2.1 Classical System Maintenance: GC, Defrag, Maintenance Windows](#21-classical-system-maintenance-gc-defrag-maintenance-windows)
   - [2.2 Offline and Batch Learning in ML](#22-offline-and-batch-learning-in-ml)
   - [2.3 Self-Healing AI Systems and Agentic SRE](#23-self-healing-ai-systems-and-agentic-sre)
   - [2.4 Self-Evolving Agents: OpenAI's Retraining Loop](#24-self-evolving-agents-openais-retraining-loop)
3. [Cross-Domain Research: Sleep Meets Computing](#3-cross-domain-research-sleep-meets-computing)
   - [3.1 Sleep-Like Replay Prevents Catastrophic Forgetting](#31-sleep-like-replay-prevents-catastrophic-forgetting)
   - [3.2 NeuroDream: A Sleep-Inspired Consolidation Framework](#32-neurodream-a-sleep-inspired-consolidation-framework)
   - [3.3 "Dreaming is All You Need": SleepNet and DreamNet](#33-dreaming-is-all-you-need-sleepnet-and-dreamnet)
   - [3.4 Experience Replay as Computational Hippocampal Replay](#34-experience-replay-as-computational-hippocampal-replay)
   - [3.5 Brain-Inspired Replay for Continual Learning](#35-brain-inspired-replay-for-continual-learning)
4. [Synthesis: A Complete Agent Sleep Architecture](#4-synthesis-a-complete-agent-sleep-architecture)
   - [4.1 Mapping Biological Sleep to Agent Sleep Cycles](#41-mapping-biological-sleep-to-agent-sleep-cycles)
   - [4.2 The Agent Sleep Cycle: A Proposed Architecture](#42-the-agent-sleep-cycle-a-proposed-architecture)
   - [4.3 Specific Ideas for Claude Code Idle-Time Healing](#43-specific-ideas-for-claude-code-idle-time-healing)
   - [4.4 Why This Is a Key Differentiator](#44-why-this-is-a-key-differentiator)
5. [Sources](#5-sources)

---

## 1. The Biology of Sleep as Healing

### 1.1 Memory Consolidation: Hippocampal Replay

**Title:** Systems memory consolidation during sleep: oscillations, neuromodulators, and synaptic remodeling
**URL:** https://pmc.ncbi.nlm.nih.gov/articles/PMC12576410/
**Source:** PMC / BMB Reports (2025)

**Key Mechanisms:**
- During slow-wave sleep (SWS), newly encoded hippocampal memory representations are repeatedly **reactivated** (replayed), driving gradual redistribution of those representations to neocortical structures that serve as long-term stores.
- This replay is facilitated by a **triple nesting** of oscillations: hippocampal sharp-wave ripples nest into thalamo-cortical spindles, which nest into neocortical slow oscillations (the "up-state").
- REM sleep theta oscillations then contribute to memory **integration, abstraction, and emotional tagging**.
- Recent 2025 research (Swanson et al.) shows this is bidirectional: neocortical slow oscillations also influence hippocampal ripple timing, creating a coordinated dialogue.

**Agent Mapping:**
This maps directly to **offline log analysis and pattern extraction**. During agent "sleep," raw interaction logs (episodic memories in the hippocampus) could be replayed and distilled into durable patterns (neocortical long-term memory). The triple-nesting of oscillations suggests that consolidation works best with **multiple timescales of review** -- not a single pass, but repeated sweeps at different granularities.

---

**Title:** Sleep's contribution to memory formation
**URL:** https://journals.physiology.org/doi/full/10.1152/physrev.00054.2024
**Source:** Physiological Reviews (2024)

**Key Mechanisms:**
- The Active Systems Consolidation (ASC) model describes how the hippocampus acts as a **fast learner** (encoding specific episodes) while the neocortex is a **slow learner** (extracting generalizable schemas).
- Sleep is the period when the fast-learning system teaches the slow-learning system, transforming specific episodes into generalizable knowledge.

**Agent Mapping:**
An agent's session logs are its "hippocampal" fast-encoded episodes. During sleep, these should be distilled into **updated heuristics, rules, and patterns** that represent the agent's "neocortical" slow-learned wisdom. The key insight: the raw episodes can be discarded after consolidation, just as the hippocampus does not store memories permanently.

---

**Title:** Parallel processing of past and future memories through reactivation and synaptic plasticity mechanisms during sleep
**URL:** https://www.nature.com/articles/s41467-025-58860-w
**Source:** Nature Communications (2025)

**Key Mechanisms:**
- During sleep, the brain does not only replay **past** memories -- it also generates **new cell assemblies** that encode future-oriented patterns, using offline synaptic scaling.
- Sleep serves a dual role: preserving past memories while simultaneously preparing representations for anticipated future experiences.

**Agent Mapping:**
Agent sleep should not only review past interactions but also **pre-compute likely future scenarios**. An agent could use idle time to simulate anticipated tasks, pre-cache responses, or generate hypothetical failure scenarios and their mitigations. Sleep is not just backward-looking -- it is forward-facing preparation.

---

### 1.2 Synaptic Homeostasis: The Pruning Imperative

**Title:** Sleep and synaptic homeostasis: a hypothesis (Tononi & Cirelli)
**URL:** https://pubmed.ncbi.nlm.nih.gov/14638388/
**Source:** Sleep Medicine Reviews (2003/2006), updated in European Journal of Neuroscience (2020)

**Key Mechanisms:**
- The **Synaptic Homeostasis Hypothesis (SHY)** proposes that during wakefulness, learning causes a net increase in synaptic strength across many neural circuits (via long-term potentiation).
- Stronger synapses require more **energy**, more **cellular supplies**, and are prone to **saturation** -- the signal-to-noise ratio degrades.
- During sleep (particularly NREM slow-wave sleep), synapses undergo **systematic but selective downscaling** -- a global reduction in synaptic strength that:
  - Conserves energy
  - Improves signal-to-noise ratio
  - Prevents saturation
  - Prevents pathological excitation levels
- Critically, this is **not** random pruning. Slow-wave activity in NREM sleep enables activity-dependent renormalization: the strongest, most important connections are preserved proportionally, while weaker/noisy connections are pruned more aggressively. The result is a more efficient, higher-fidelity network.

**Agent Mapping:**
This is the most powerful analogy for agent healing. During active operation, an agent accumulates:
- Configuration bloat (accumulated overrides, special cases)
- Memory/context pollution (stale cached data, outdated heuristics)
- Tool/dependency sprawl (added capabilities that increase complexity)

Agent sleep should perform **selective pruning**: review accumulated state, identify what is strongly reinforced by actual use patterns (keep), and downscale or remove what is weakly connected or unused. This is not cleanup -- it is **optimization of the agent's internal representation** for better performance.

---

**Title:** Sleep and the Price of Plasticity: From Synaptic and Cellular Homeostasis to Memory Consolidation and Integration
**URL:** https://pmc.ncbi.nlm.nih.gov/articles/PMC3921176/
**Source:** PMC / Neuron (2014)

**Key Mechanisms:**
- "Sleep is the price the brain pays for plasticity." The ability to learn during the day necessitates a restorative offline period.
- Without sleep, plasticity itself becomes pathological: runaway potentiation leads to seizure-like activity, metabolic exhaustion, and loss of learning capacity.

**Agent Mapping:**
An agent that is always "on" -- always learning, always adapting -- will degrade. The accumulation of adaptations without periodic consolidation and pruning leads to the agent equivalent of "runaway potentiation": bloated context, contradictory rules, and decision paralysis. **Sleep is not a luxury; it is a structural requirement for any system that learns.**

---

### 1.3 Glymphatic System: Brain Waste Clearance

**Title:** Norepinephrine-mediated slow vasomotion drives glymphatic clearance during sleep
**URL:** https://www.cell.com/cell/abstract/S0092-8674(24)01343-6
**Source:** Cell (2024)

**Key Mechanisms:**
- The glymphatic system is a perivascular network that clears metabolic waste from the brain. During NREM sleep, it becomes **almost 10-fold more active** than during wakefulness.
- Cerebrospinal fluid (CSF) flows along channels surrounding blood vessels, mixing with interstitial fluid to sweep away metabolic refuse -- including amyloid-beta plaques linked to Alzheimer's disease.
- The mechanism is driven by **infraslow oscillations in norepinephrine** during sleep, which cause rhythmic constrictions and dilations of cerebral arteries. These vascular pulsations physically pump CSF through brain tissue.
- Aquaporin-4 (AQP4) water channels are essential: clearance drops **70%** without them.
- The interstitial space between brain cells **physically expands** during sleep, increasing by up to 60%, allowing greater fluid flow.

**Agent Mapping:**
This is the **garbage collection** analogy, but far more sophisticated than traditional GC. The glymphatic system teaches that waste clearance requires:
1. **Reduced activity** (the brain must be offline for the channels to open)
2. **Active pumping** (it is not passive -- there is a dedicated mechanism)
3. **Physical infrastructure** (the AQP4 channels and perivascular spaces exist specifically for this purpose)
4. **Expanded capacity** during clearance (the 60% expansion of interstitial space)

For agents, "waste" includes: stale cache entries, orphaned temporary files, accumulated error logs that no longer inform, deprecated tool configurations, and redundant context fragments. An agent sleep system should have **dedicated clearance pathways** -- not just "delete old files" but structured processes that identify, categorize, and remove specific classes of waste. And like the glymphatic system, this works best when the agent is not simultaneously processing requests.

---

**Title:** Scientists uncover how the brain washes itself during sleep
**URL:** https://www.science.org/content/article/scientists-uncover-how-brain-washes-itself-during-sleep
**Source:** Science / AAAS

**Key Mechanisms:**
- The glymphatic discovery (Maiken Nedergaard, University of Rochester, 2012-present) fundamentally changed our understanding of sleep: it is not just for the mind (memory), it is for the **physical substrate** (brain tissue health).
- Sleep aid drugs like zolpidem actually **suppress** the norepinephrine oscillations needed for glymphatic flow, meaning drug-induced sleep provides less waste clearance than natural sleep.

**Agent Mapping:**
This carries a profound design lesson: **not all "idle time" is equivalent**. An agent that is technically idle but still maintaining open connections, polling for events, or holding locks is like drug-induced sleep -- the "channels" for deep maintenance are still blocked. True agent sleep requires genuine disconnection from the active processing pipeline to allow deep maintenance processes to operate.

---

### 1.4 Immune System Repair During Sleep

**Title:** Sleep and Immune System Crosstalk: Implications for Inflammatory Homeostasis and Disease Pathogenesis
**URL:** https://journals.sagepub.com/doi/10.1177/09727531241275347
**Source:** SAGE Journals (2025)

**Key Mechanisms:**
- Sleep and immune function are **bidirectionally linked**: immune activation alters sleep patterns, and sleep modulates both innate and adaptive immunity.
- During sleep, the immune system shifts to a **pro-inflammatory state** that paradoxically supports healing: increased production of cytokines, enhanced natural killer cell activity, and amplified T-cell response.
- Deep slow-wave sleep (N3) is when immune recovery and improvements begin. This is when the body's immune surveillance is most active.

**Agent Mapping:**
The bidirectional link is key. An agent's error detection system (its "immune system") should influence when and how deeply the agent sleeps. More detected anomalies should trigger deeper/longer sleep cycles. And during sleep, the agent should run **active health checks** -- not just passive monitoring, but proactive scanning for vulnerabilities, configuration drift, and degraded components. The immune system does not just wait for pathogens; it actively patrols during sleep.

---

**Title:** The Night Gardeners -- Immune Cells Rewire, Repair Brain While We Sleep
**URL:** https://www.urmc.rochester.edu/news/story/the-night-gardeners----immune-cells-rewire-repair-brain-while-we-sleep
**Source:** University of Rochester Medical Center

**Key Mechanisms:**
- Microglia -- the brain's immune cells -- are primarily **active during sleep**, when they perform dual roles:
  1. Fighting infections and repairing damage (immune function)
  2. **Reorganizing connections between nerve cells** (structural maintenance)
- These "night gardeners" prune unnecessary synapses and strengthen useful ones, complementing the synaptic homeostasis process.

**Agent Mapping:**
This beautifully demonstrates that immune function and structural optimization are **the same process** during sleep. An agent's "night gardeners" would be maintenance routines that simultaneously:
- Scan for and remediate errors (immune function)
- Reorganize and optimize internal structures (pruning/consolidation)
These should not be separate systems. A single "maintenance agent" should handle both, because in biological systems, the cells that fight infection are the same cells that prune synapses.

---

### 1.5 Tissue Repair and Growth Hormone Release

**Title:** How Sleep Heals: The Science Behind Recovery and Repair
**URL:** https://sleep.me/post/sleep-is-your-secret-weapon-for-recovery
**Source:** Sleep.me

**Title:** What Happens During NREM Sleep?
**URL:** https://www.sleepfoundation.org/stages-of-sleep/nrem-sleep
**Source:** Sleep Foundation

**Key Mechanisms:**
- **Growth hormone (GH)** is released primarily during N3 (deep NREM) sleep, with 70-80% of daily GH secretion occurring during this stage.
- GH promotes protein synthesis, essential for tissue repair and growth. During N3 sleep, the body:
  - Replenishes energy reserves depleted during the day
  - Catalyzes muscle recovery through increased amino acid transport
  - Initiates hormone-driven cellular repair cascades
  - Increases blood supply to muscles
- Bone growth and repair accelerate during deep sleep.
- This is an **anabolic** state: the body shifts from energy expenditure to energy conservation and structural building.

**Agent Mapping:**
The shift from catabolic (active) to anabolic (repair/build) is fundamental. During active operation, an agent is consuming resources: making API calls, using tokens, generating responses. During sleep, the agent should shift to **building and strengthening**:
- Pre-computing and caching frequently needed resources
- Updating and optimizing internal indexes
- Generating improved prompt templates based on recent usage patterns
- Building new capabilities by analyzing patterns in past failures
This is the difference between degradation during use and **growth during rest**.

---

### 1.6 Sleep Stages and Their Distinct Healing Functions

**Title:** What Happens to the Body During Sleep? Brain Repair, REM Cycles, and Nightly Recovery
**URL:** https://www.sciencetimes.com/articles/61326/20260216/what-happens-body-during-sleep-brain-repair-rem-cycles-nightly-recovery.htm
**Source:** Science Times (2026)

**Title:** How NREM Sleep Supports Brain and Body Repair
**URL:** https://www.thesleepreset.com/blog/how-nrem-sleep-supports-brain-and-body-repair
**Source:** The Sleep Reset

**Key Mechanisms -- Stage by Stage:**

| Sleep Stage | Duration | Primary Healing Function |
|---|---|---|
| **N1 (Light NREM)** | 1-7 min | Transition state. Muscle relaxation begins. Brain slows from alpha to theta waves. |
| **N2 (Light NREM)** | 10-25 min | Sleep spindles and K-complexes appear. Body temperature drops. Heart rate slows. Initial memory processing begins. |
| **N3 (Deep NREM / SWS)** | 20-40 min | **Primary physical repair.** Growth hormone release. Tissue repair. Immune system activation. Glymphatic clearance peaks. Synaptic downscaling. Slow-wave hippocampal replay for declarative memory consolidation. |
| **REM Sleep** | 10-60 min | **Primary cognitive repair.** Emotional memory processing. Creative recombination. Procedural memory consolidation. Neural pathway strengthening. Dreaming and problem-solving. Brain detoxification continues. |

**The cycle repeats 4-6 times per night (~90 min each), with early cycles dominated by N3 (physical repair) and later cycles dominated by REM (cognitive repair).**

**Agent Mapping:**
This staged architecture is a design blueprint for agent sleep cycles:

| Agent Sleep Stage | Biological Parallel | Function |
|---|---|---|
| **Stage 1: Transition** (N1) | Light NREM | Graceful wind-down. Complete pending operations. Save state. Close non-essential connections. |
| **Stage 2: Light Maintenance** (N2) | Light NREM | Quick health checks. Surface-level log review. Update timestamps. Check for critical alerts. |
| **Stage 3: Deep Maintenance** (N3/SWS) | Deep NREM | **Heavy maintenance.** Garbage collection. Cache invalidation. Index rebuilding. Configuration audit. Dependency updates. Log compaction. This is the "growth hormone" phase -- building strength. |
| **Stage 4: Creative Optimization** (REM) | REM Sleep | **Pattern analysis.** Review interaction logs for recurring failures. Generate new heuristics. Test alternative approaches to past problems. Simulate anticipated scenarios. This is the "dreaming" phase -- creative recombination. |
| **Cycle** | 90-min cycles | Repeat stages, with early cycles emphasizing deep maintenance and later cycles emphasizing creative optimization. |

---

### 1.7 Dreaming as Problem-Solving and Creative Recombination

**Title:** Creative problem-solving after experimentally provoking dreams of unsolved puzzles during REM sleep
**URL:** https://academic.oup.com/nc/article/2026/1/niaf067/8456489
**Source:** Neuroscience of Consciousness / Oxford Academic (2026)

**Key Mechanisms:**
- Northwestern University researchers used **targeted memory reactivation (TMR)** during REM sleep: they played subtle sound cues associated with unsolved brain teasers while participants dreamed.
- Participants solved **42% of dream-cued puzzles** vs. only **17% of non-cued puzzles** -- more than doubling the success rate.
- The mechanism: during REM sleep, the brain enters a state of **reduced executive inhibition** combined with **heightened associative connectivity**. Distant or unfamiliar associations become more accessible.

**Agent Mapping:**
This is perhaps the most novel mapping. During the agent's "REM" phase:
- Re-present past failures to the agent in a **lower-constraint context** (reduced validation, broader search space)
- Allow the agent to generate **novel solution approaches** it would not attempt during normal operation
- Use stochastic/randomized recombination of past successful patterns to discover new strategies
- Test these novel approaches against historical data
The key insight: creativity comes from **relaxed constraints** applied to **replayed problems**. An agent's dreaming phase should intentionally lower its normal precision/safety thresholds to explore solution spaces it would not normally access.

---

**Title:** Targeted dream incubation at sleep onset increases post-sleep creative performance
**URL:** https://www.nature.com/articles/s41598-023-31361-w
**Source:** Scientific Reports / Nature (2023)

**Key Mechanisms:**
- Even at sleep **onset** (hypnagogia, the transition from wake to N1), creative problem-solving is enhanced.
- The semi-conscious state allows "loose associations" that waking cognition suppresses.
- Thomas Edison and Salvador Dali famously exploited this by holding objects that would wake them as they dozed, capturing hypnagogic insights.

**Agent Mapping:**
The "transition phase" of agent sleep (Stage 1) could include a brief **exploratory pass** before full maintenance begins -- a quick, loosely-constrained review of the day's hardest problems that might yield insights before the agent commits to structured maintenance work.

---

**Title:** Our dreams' weirdness might be why we have them (AI-inspired theory)
**URL:** https://www.sciencedaily.com/releases/2021/05/210514134208.htm
**Source:** ScienceDaily / Erik Hoel, Tufts University (2021)

**Key Mechanisms:**
- The **Overfitted Brain Hypothesis** proposes that dreams are weird *because* weirdness prevents overfitting. Just as data augmentation (adding noise, distortions) in ML prevents overfitting to training data, the strangeness of dreams adds "noise" to replayed memories, forcing the brain to extract generalizable patterns rather than memorizing specific episodes.
- Dreams are biological **data augmentation**.

**Agent Mapping:**
During the agent's creative optimization phase, deliberately inject **perturbations** into replayed scenarios:
- What if this API had returned a different error code?
- What if the user had phrased the request differently?
- What if a tool was unavailable?
These "weird dream" variations prevent the agent from overfitting to specific past interactions and build more robust, generalizable strategies.

---

### 1.8 Sleep Deprivation: What Breaks When Healing Stops

**Title:** Effects of sleep deprivation on wound healing
**URL:** https://pubmed.ncbi.nlm.nih.gov/16120095/
**Source:** PubMed / Journal of Sleep Research (2005)

**Title:** Two nights of recovery sleep restores hippocampal connectivity but not episodic memory after total sleep deprivation
**URL:** https://www.nature.com/articles/s41598-020-65086-x
**Source:** Scientific Reports / Nature (2020)

**Key Mechanisms of Sleep Deprivation Damage:**
1. **Wound healing delays**: Sleep restriction delays skin barrier recovery; immune responsiveness is degraded through HPA axis and sympathetic nervous system activation.
2. **Cognitive degradation**: Sleep deprivation impairs episodic memory, hippocampal function, and connectivity between hippocampus, prefrontal cortex, and default mode network. Even two nights of recovery sleep restore connectivity but **not** the lost episodic memories.
3. **Immune suppression**: Decreased natural killer cell activity, reduced interleukin-2 production, increased pro-inflammatory cytokines shift the immune system from repair mode to uncontrolled inflammation.
4. **Cumulative debt**: Sleep debt accumulates non-linearly. Modest daily deficits compound into severe impairment within days.

**Agent Mapping:**
An agent without sleep cycles will exhibit analogous degradation:
- **Config drift accumulates** (wound healing delays)
- **Context quality degrades** (cognitive impairment -- stale/irrelevant information persists)
- **Error handling becomes brittle** (immune suppression -- the agent stops catching subtle issues)
- **Performance debt compounds** (cumulative sleep debt -- each session without maintenance makes the next session worse)
- Some damage from extended sleeplessness **cannot be recovered** even with later maintenance (the lost episodic memories)

The critical lesson: **maintenance debt is not fully recoverable**. An agent that skips sleep cycles will permanently lose optimization opportunities, not just delay them.

---

## 2. Existing Computing Parallels

### 2.1 Classical System Maintenance: GC, Defrag, Maintenance Windows

**Title:** Is the Purpose of Sleep to Let Our Brains "Defragment," Like a Hard Drive?
**URL:** http://blogs.discovermagazine.com/crux/2012/05/14/is-the-purpose-of-sleep-to-let-our-brains-defragment-like-a-hard-drive/
**Source:** Discover Magazine (2012)

**Title:** Sleep is Garbage Collection (Hacker News discussion)
**URL:** https://news.ycombinator.com/item?id=547598
**Source:** Hacker News

**Key Concepts:**
The computing world has long had "sleep-like" maintenance:
- **Garbage Collection (GC)**: Reclaiming memory no longer in use. Like the glymphatic system clearing metabolic waste. GC pauses in Java/Go are infamous -- the system must briefly stop processing to clean up. This maps to NREM N3's waste clearance function.
- **Disk Defragmentation**: Reorganizing fragmented data for faster access. Like synaptic homeostasis -- reorganizing connections for better signal-to-noise. Less relevant in the SSD era, but the concept lives on in database compaction, index rebuilding, and log rotation.
- **Maintenance Windows**: Scheduled downtime for updates, backups, and optimization. The closest direct analog to biological sleep, but traditionally viewed as necessary evil rather than healing opportunity.

**Limitations of Current Computing "Sleep":**
- These are reactive (fixing problems) rather than proactive (building resilience)
- They are monolithic (one big maintenance window) rather than cyclic (multiple 90-minute cycles)
- They lack the staged architecture of biological sleep (no distinction between "physical repair" and "creative optimization")
- They do not include anything like dreaming (creative recombination)

---

### 2.2 Offline and Batch Learning in ML

**Title:** Batch (Offline) Learning vs Online Learning in Artificial Intelligence
**URL:** https://www.geeksforgeeks.org/artificial-intelligence/batch-offline-learning-vs-online-learning-in-artificial-intelligence/
**Source:** GeeksforGeeks

**Title:** Hybrid Offline-online Scheduling Method for Large Language Model Inference Optimization
**URL:** https://arxiv.org/html/2502.15763v1
**Source:** arXiv (2025)

**Key Concepts:**
- **Batch/Offline Learning**: The model trains on a complete, fixed dataset. Does not update until a new training cycle. This is analogous to sleep-based consolidation: accumulate experiences, then process them all at once offline.
- **Continuous Batching**: Dynamic batch processing that reduces idle time by adapting to workload fluctuations. More like the cyclic nature of biological sleep.
- **Hybrid Offline-Online Scheduling**: Recent (2025) research on scheduling LLM inference by combining online request handling with offline batch optimization. The system identifies idle periods and uses them for optimization -- a computational sleep cycle.

**Agent Mapping:**
Current ML batch processing is the closest existing analog to agent sleep, but it lacks:
- The multi-stage architecture (no NREM/REM distinction)
- The self-directed nature (batch jobs are externally scheduled, not self-initiated)
- The adaptive depth (biological sleep deepens in response to greater fatigue; batch jobs run the same regardless)
- The creative component (no "dreaming" in batch processing)

---

### 2.3 Self-Healing AI Systems and Agentic SRE

**Title:** Self-Healing AI Systems: How Autonomous AI Agents Detect, Prevent, and Fix Operational Failures
**URL:** https://aithority.com/machine-learning/self-healing-ai-systems-how-autonomous-ai-agents-detect-prevent-and-fix-operational-failures/
**Source:** AIThority (2024)

**Title:** Building Self-Healing Kubernetes Clusters that Learn
**URL:** https://dzone.com/articles/self-healing-kubernetes-clusters-agentic-ai
**Source:** DZone (2025)

**Title:** Agentic SRE: How Self-Healing Infrastructure Is Redefining Enterprise AIOps in 2026
**URL:** https://www.unite.ai/agentic-sre-how-self-healing-infrastructure-is-redefining-enterprise-aiops-in-2026/
**Source:** Unite.AI (2026)

**Key Concepts:**
- Self-healing AI systems operate through: **detection** -> **diagnosis** -> **remediation** -> **learning**.
- Agentic SRE (Site Reliability Engineering) combines telemetry, reasoning, and controlled automation into a closed-loop pipeline.
- Kubernetes self-healing: pods scan every 30 seconds for failures (CrashLoopBackOff, OOMKilled), collect diagnostics, and apply fixes. K8sGPT uses LLMs to diagnose cluster issues.
- **Progressive autonomy**: Organizations start with human-in-the-loop, then grant more autonomy as confidence builds.
- Salesforce's KubeCon 2025 approach: Agentic AI agents that can roll back upgrades, remediate node failures, and optimize resource allocation autonomously.

**Agent Mapping:**
Current self-healing systems are **always-on reactive** -- they detect and fix in real-time. What they lack is the **offline consolidation** aspect of sleep:
- They fix individual incidents but do not step back to find systemic patterns
- They remediate but do not reorganize
- They react but do not dream
Our agent sleep system should combine the reactive healing of Kubernetes-style self-healing with the offline consolidation and creative problem-solving of biological sleep.

---

### 2.4 Self-Evolving Agents: OpenAI's Retraining Loop

**Title:** Self-Evolving Agents - A Cookbook for Autonomous Agent Retraining
**URL:** https://cookbook.openai.com/examples/partners/self_evolving_agents/autonomous_agent_retraining
**Source:** OpenAI Cookbook (2025)

**Key Concepts:**
- Agentic systems plateau after proof-of-concept because they depend on humans to diagnose edge cases.
- The cookbook introduces a **repeatable retraining loop**: capture issues, learn from feedback, promote improvements.
- Three optimization strategies: manual iteration, semi-automated loops, fully automated prompt optimization.
- The self-healing workflow combines: human review + LLM-as-judge evals + iterative prompt refinement.

**Agent Mapping:**
OpenAI's retraining loop is the closest existing framework to what we are building, but it:
- Requires **external triggering** (not self-initiated)
- Focuses on **prompt optimization only** (not structural maintenance)
- Does not incorporate the staged, cyclic nature of biological sleep
- Lacks the "dreaming" creative recombination component
- Does not include waste clearance or pruning

Our agent sleep system extends this retraining loop with biological sleep's full architecture: staged cycles, waste clearance, pruning, creative recombination, and self-initiated scheduling based on detected "fatigue."

---

## 3. Cross-Domain Research: Sleep Meets Computing

### 3.1 Sleep-Like Replay Prevents Catastrophic Forgetting

**Title:** Sleep-like unsupervised replay reduces catastrophic forgetting in artificial neural networks
**URL:** https://www.nature.com/articles/s41467-022-34938-7
**Source:** Nature Communications (2022) -- Maxim Bazhenov's team, UC San Diego

**Key Mechanisms:**
- **The Problem**: Artificial neural networks suffer from catastrophic forgetting -- when learning new tasks sequentially, they lose performance on previously learned tasks.
- **The Solution**: Implementing a "sleep phase" with local unsupervised Hebbian plasticity rules and noisy input.
- **Results**: During the sleep phase, previously learned memories were **spontaneously replayed** (without access to original training data), forming unique representations for each class. Sleep was able to **recover old tasks that were otherwise forgotten**.
- **Mechanism**: Sleep replay uses Hebbian learning (neurons that fire together wire together) in an unsupervised mode, which naturally restores the synaptic patterns associated with older memories.

**Agent Mapping:**
This directly addresses a core challenge in agent development: **context window limitations and session-to-session memory loss**. An agent's "sleep replay" phase could:
1. Replay compressed representations of past interactions (without needing the full conversation logs)
2. Use unsupervised pattern matching to identify which historical patterns should be strengthened
3. Recover knowledge that was "forgotten" due to context window eviction
4. Generate compact memory representations that persist across sessions

---

**Title:** Sleep prevents catastrophic forgetting in spiking neural networks by forming a joint synaptic weight representation
**URL:** https://pmc.ncbi.nlm.nih.gov/articles/PMC9674146/
**Source:** PLOS Computational Biology (2022)

**Key Mechanisms:**
- Interleaving new task training with **sleep-like off-line reactivation** mitigated catastrophic forgetting.
- The mechanism: sleep constrains the network's synaptic weight state to a **joint manifold** that accommodates all learned tasks simultaneously.
- Critical detail: sleep achieves this **without explicit access to old task data** -- it works purely through spontaneous replay of internal representations.

**Agent Mapping:**
The "joint manifold" concept maps to maintaining a **coherent agent identity** across many tasks. An agent that handles coding, writing, analysis, and debugging needs a unified internal model that accommodates all these skills without one degrading another. Sleep-like consolidation maintains this coherence.

---

### 3.2 NeuroDream: A Sleep-Inspired Consolidation Framework

**Title:** NeuroDream: A Sleep-Inspired Memory Consolidation Framework for Artificial Neural Networks
**URL:** https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5377250
**Source:** SSRN (Tutuncuoglu, 2024)

**Title:** Dream-Augmented Neural Networks: Harnessing Synthetic Sleep for Continual Learning and Zero Forgetting
**URL:** https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5402490
**Source:** SSRN (Tutuncuoglu, 2025)

**Key Mechanisms:**
- NeuroDream introduces an explicit **dream phase** into neural training where the model:
  1. **Disconnects from input data** (goes offline)
  2. **Generates internal simulations** from stored latent embeddings and learned dynamics
  3. Uses these simulations to **rehearse, consolidate, and abstract** patterns from earlier experiences
  4. All without re-exposure to raw training data
- **Results**: Up to **38% reduction in forgetting**, **17.6% increase in zero-shot transfer**, and significant robustness to noise and domain drift.
- The framework includes a mechanism for **biologically inspired latent replay synthesis** -- generating "dream data" that captures the essence of past experiences.

**Agent Mapping:**
NeuroDream is the closest existing framework to what we want to build for agent sleep. The key architectural elements to borrow:
1. **Explicit disconnect** from input (no new user requests during sleep)
2. **Internal simulation** using compressed representations of past interactions
3. **Consolidation** that produces durable patterns, not just cached data
4. **Abstraction** that generalizes from specific episodes to transferable knowledge
5. **No raw data needed** -- the system works from its own internal representations

---

### 3.3 "Dreaming is All You Need": SleepNet and DreamNet

**Title:** Dreaming is All You Need
**URL:** https://arxiv.org/abs/2409.01633
**Source:** arXiv (2024)

**Key Mechanisms:**
- Introduces two architectures:
  - **SleepNet**: Integrates supervised learning with unsupervised "sleep" stages using pre-trained encoders. Dedicated "sleep neurons" are embedded within the network, forming intermittent sleep blocks that facilitate **exploratory learning**.
  - **DreamNet**: Uses full encoder-decoder frameworks to **reconstruct hidden states**, mimicking the human dreaming process. This enables further exploration and refinement of learned representations.
- Both architectures demonstrated **superior performance** compared to state-of-the-art models on diverse image and text datasets.
- The key insight: unsupervised "sleep blocks" interspersed with supervised learning create a **rhythm** that improves both exploration and precision.

**Agent Mapping:**
The SleepNet/DreamNet architecture suggests that agent sleep should not be a single monolithic phase but should involve **dedicated sleep components** embedded within the agent's architecture:
- "Sleep neurons" that are active only during maintenance (dedicated maintenance modules)
- A rhythm of active processing and sleep blocks (not just one big maintenance window)
- A "dreaming" reconstruction phase that regenerates and refines internal representations

---

### 3.4 Experience Replay as Computational Hippocampal Replay

**Title:** Replay in Deep Learning: Current Approaches and Missing Biological Elements
**URL:** https://pmc.ncbi.nlm.nih.gov/articles/PMC9074752/
**Source:** PMC / Neural Computation (2022)

**Title:** A model of hippocampal replay driven by experience and environmental structure facilitates spatial learning
**URL:** https://elifesciences.org/articles/82301
**Source:** eLife (2023)

**Key Mechanisms:**
- **Experience replay** in reinforcement learning (introduced by DeepMind for DQN in 2015) is directly inspired by hippocampal replay during sleep.
- Biological replay is **not random** -- it is prioritized. Mattar and Daw showed that the brain replays experiences with the highest "utility" from a reinforcement learning perspective: the experience that yields the highest behavioral improvement is reactivated first.
- Missing biological elements in current ML replay:
  1. **Generative replay** (the brain generates approximate replays, not exact copies)
  2. **Sequence replay** (temporal order matters)
  3. **Prioritized by utility** (not random sampling from a buffer)
  4. **Sleep-wake cycling** (replay happens during specific offline periods, not continuously)

**Agent Mapping:**
Agent sleep replay should incorporate these biological elements:
1. **Generate** compressed summaries of interactions, not replay full transcripts
2. **Preserve temporal sequences** -- the order of operations in a debugging session matters
3. **Prioritize by utility** -- replay failures and edge cases more than routine successes
4. **Confine to sleep** -- do not replay during active operation (it would interfere, like dreaming while awake)

---

### 3.5 Brain-Inspired Replay for Continual Learning

**Title:** Brain-inspired replay for continual learning with artificial neural networks
**URL:** https://www.nature.com/articles/s41467-020-17866-2
**Source:** Nature Communications (2020)

**Key Mechanisms:**
- Instead of storing and replaying actual past data, this approach uses a **generative model** to produce "pseudo-data" that captures the statistical essence of previous tasks.
- This is more biologically plausible (the hippocampus generates approximate replays, not exact recordings) and more memory-efficient.
- The generative replay approach enables continual learning without storing any past data at all.

**Agent Mapping:**
For agent sleep, this suggests:
- Do not store full interaction logs indefinitely. Instead, train a **generative summary model** that can produce representative examples of past interaction patterns.
- During sleep, generate these pseudo-interactions and use them to validate and refine the agent's current strategies.
- This dramatically reduces storage requirements while preserving the essential learning benefits of replay.

---

## 4. Synthesis: A Complete Agent Sleep Architecture

### 4.1 Mapping Biological Sleep to Agent Sleep Cycles

| Biological Sleep Function | Mechanism | Agent Sleep Equivalent | Implementation |
|---|---|---|---|
| **Hippocampal Replay** | Reactivation of day's memories during SWS | **Log Replay & Pattern Extraction** | Replay compressed interaction logs, extract recurring patterns, update heuristic library |
| **Synaptic Homeostasis** | Global downscaling of synaptic strength | **Configuration Pruning** | Review accumulated configs, remove unused/weak ones, strengthen frequently-used paths |
| **Glymphatic Clearance** | CSF flushes metabolic waste from brain | **Waste Collection** | Clear stale caches, orphaned temp files, deprecated configs, redundant context |
| **Immune Repair** | Cytokine production, NK cell activation | **Health Scanning** | Run integrity checks, vulnerability scans, dependency audits, configuration drift detection |
| **Growth Hormone Release** | Tissue repair and muscle building | **Capability Building** | Pre-compute resources, rebuild indexes, update embeddings, optimize hot paths |
| **REM Dreaming** | Creative recombination with relaxed constraints | **Creative Problem-Solving** | Re-attempt past failures with novel approaches, generate alternative strategies, test hypothetical scenarios |
| **Sleep Spindles** | Gating of sensory input | **Request Gating** | Queue incoming requests without processing during deep sleep phases |
| **Circadian Rhythm** | 24-hour sleep-wake cycle | **Scheduled Cycle** | Configurable sleep schedule based on usage patterns, time of day, and accumulated "fatigue" |

---

### 4.2 The Agent Sleep Cycle: A Proposed Architecture

```
AGENT SLEEP CYCLE (~90 minute biological equivalent)
====================================================

WAKE STATE (Active Operation)
  |
  | Accumulation of:
  |   - Interaction logs (episodic memories)
  |   - Configuration changes (synaptic potentiation)
  |   - Cached data (metabolic byproducts)
  |   - Error patterns (immune signals)
  |   - Performance metrics (fatigue indicators)
  |
  v

SLEEP TRIGGER
  Conditions (any of):
  - Scheduled interval (circadian)
  - Fatigue threshold exceeded (accumulated errors, degraded performance)
  - User inactivity detected (opportunistic)
  - Explicit user command ("/sleep")
  |
  v

STAGE 1: TRANSITION (N1 equivalent, ~2 min)
  - Complete pending operations
  - Save current state snapshot
  - Close non-essential connections
  - Quick "hypnagogic" pass: loosely scan today's hardest problems
  - Begin request gating (queue but don't process)
  |
  v

STAGE 2: LIGHT MAINTENANCE (N2 equivalent, ~5 min)
  - Surface-level health checks
  - Timestamp updates
  - Quick log review for critical issues
  - Check for urgent alerts that should interrupt sleep
  - Identify maintenance priorities for deep sleep
  |
  v

STAGE 3: DEEP MAINTENANCE (N3/SWS equivalent, ~15 min)
  - WASTE CLEARANCE (Glymphatic):
    - Clear stale cache entries
    - Remove orphaned temporary files
    - Compact and rotate logs
    - Purge deprecated configurations
  - MEMORY CONSOLIDATION (Hippocampal replay):
    - Replay compressed interaction logs
    - Extract recurring patterns -> update heuristic library
    - Distill specific episodes into general rules
    - Prioritize replay of failures and edge cases
  - SYNAPTIC PRUNING (SHY):
    - Review tool/config usage frequencies
    - Downscale or remove unused configurations
    - Strengthen frequently-used paths
    - Simplify decision trees
  - IMMUNE REPAIR:
    - Run integrity checks on all components
    - Scan for configuration drift
    - Audit dependency versions
    - Test critical paths
  - GROWTH (GH release):
    - Rebuild and optimize indexes
    - Pre-compute frequently needed resources
    - Update internal embeddings/representations
    - Cache anticipated next-session needs
  |
  v

STAGE 4: CREATIVE OPTIMIZATION (REM equivalent, ~10 min)
  - DREAMING (Problem-solving):
    - Re-present past failures with relaxed constraints
    - Generate novel solution approaches
    - Stochastic recombination of successful patterns
    - Test alternatives against historical data
  - DATA AUGMENTATION (Weird dreams):
    - Inject perturbations into replayed scenarios
    - "What if this API returned a different error?"
    - "What if the user phrased this differently?"
    - Build robustness through variation
  - FUTURE PREPARATION (Forward replay):
    - Simulate anticipated upcoming tasks
    - Pre-compute likely needed resources
    - Generate hypothetical failure scenarios and mitigations
  |
  v

CYCLE COMPLETE -> Return to STAGE 2 or WAKE
  - Early cycles: heavier STAGE 3 (deep maintenance)
  - Later cycles: heavier STAGE 4 (creative optimization)
  - Wake conditions:
    - User request received (interrupt)
    - All maintenance tasks complete
    - Scheduled wake time reached
    - Critical alert detected
```

---

### 4.3 Specific Ideas for Claude Code Idle-Time Healing

Based on the biological research, here are concrete implementations for Claude Code:

**1. Session Log Replay (Hippocampal Consolidation)**
- After each coding session, compress the interaction into a structured summary: what was attempted, what succeeded, what failed, what patterns emerged.
- During idle time, replay these summaries and extract cross-session patterns: "User X always struggles with async/await" or "Project Y's tests break most often in module Z."
- Store these as durable heuristics that inform future sessions.

**2. Context Pruning (Synaptic Homeostasis)**
- Claude Code accumulates context over a session. During idle time, review what context was actually referenced vs. what was loaded but unused.
- Build a "context relevance model" that predicts which context will be useful for a given task type.
- Prune the default context loading to be leaner and more targeted.

**3. Cache Warming (Growth Hormone / Anabolic State)**
- Analyze past sessions to identify frequently accessed files, commonly needed documentation, and repeated tool invocations.
- During idle time, pre-warm caches with these anticipated needs.
- Pre-index the codebase for faster search during active sessions.

**4. Error Pattern Analysis (Immune System)**
- Collect all errors encountered across sessions: tool failures, misunderstood instructions, incorrect code suggestions.
- During idle time, cluster these errors to identify systemic issues vs. one-off failures.
- Generate "antibodies": specific detection patterns for known failure modes, with pre-computed remediation strategies.

**5. Creative Problem Replay (REM Dreaming)**
- Identify interactions where Claude Code failed to solve a problem or where the user had to heavily correct the approach.
- During idle time, re-attempt these problems with:
  - Different decomposition strategies
  - Alternative tool selections
  - Varied prompt formulations
  - Broader search of solution space
- If a better approach is found, store it for future use.

**6. Dependency and Config Health Scan (Night Gardeners / Microglia)**
- During idle time, scan the project for:
  - Outdated dependencies with known vulnerabilities
  - Configuration drift from best practices
  - Dead code or unused imports
  - Stale lock files or caches
- Present findings to the user at next session start as a "morning health report."

**7. Workspace Defragmentation (Glymphatic Clearance)**
- Clean up temporary files created during sessions
- Consolidate scattered notes and TODO items
- Archive completed task artifacts
- Compact git history where appropriate (with user permission)

**8. Anticipatory Preparation (Forward Replay)**
- Based on recent session patterns and project state, predict what the user is likely to work on next.
- Pre-read and index relevant files
- Pre-fetch documentation for libraries in active use
- Generate a "morning brief" with project status and suggested next steps.

---

### 4.4 Why This Is a Key Differentiator

**Current State of the Art:**
- Most AI agent systems are purely reactive: they process requests and go idle.
- Existing "self-healing" systems (Kubernetes, Agentic SRE) are always-on reactive monitors.
- OpenAI's self-evolving agents require external triggering for improvement.
- No production agent system implements **staged, cyclic, self-initiated maintenance** inspired by biological sleep.

**What Biological Sleep Teaches That No One Has Implemented:**
1. **Sleep is not downtime -- it is a different mode of operation.** The brain is highly active during sleep, just differently active. Agent idle time should be similarly active.
2. **Maintenance must be staged.** Different types of healing happen in different phases. Mixing them is less effective than sequencing them (you do not dream and clear waste simultaneously).
3. **Pruning is as important as learning.** Without synaptic downscaling, learning becomes pathological. Agents need to actively simplify, not just accumulate.
4. **Creativity requires constraint relaxation.** REM sleep's problem-solving power comes from reduced executive inhibition. Agent improvement requires periods of exploration beyond normal operating parameters.
5. **Sleep depth should be adaptive.** A day of intense learning requires deeper sleep. An agent that handled many errors or novel situations should sleep more deeply.
6. **Sleep debt is real and partially unrecoverable.** Skipping maintenance has compound costs, and some opportunities for optimization are permanently lost.
7. **The immune system and the maintenance system are the same system.** In the brain, microglia both fight infections AND prune synapses. Agent security and optimization should be unified, not siloed.

**The Pitch:**
"Just as biological organisms heal during sleep -- consolidating memories, clearing waste, repairing tissue, and solving problems through dreams -- our agent architecture uses idle time as an active healing cycle. The agent is not just waiting for the next command; it is growing stronger."

---

## 5. Sources

### Biology of Sleep

- [Systems memory consolidation during sleep (PMC, 2025)](https://pmc.ncbi.nlm.nih.gov/articles/PMC12576410/)
- [Sleep's contribution to memory formation (Physiological Reviews, 2024)](https://journals.physiology.org/doi/full/10.1152/physrev.00054.2024)
- [Parallel processing of past and future memories during sleep (Nature Communications, 2025)](https://www.nature.com/articles/s41467-025-58860-w)
- [Sleep and synaptic homeostasis hypothesis (Tononi & Cirelli, PubMed)](https://pubmed.ncbi.nlm.nih.gov/14638388/)
- [Sleep and synaptic down-selection (Tononi, 2020)](https://onlinelibrary.wiley.com/doi/abs/10.1111/ejn.14335)
- [Sleep and the Price of Plasticity (PMC/Neuron, 2014)](https://pmc.ncbi.nlm.nih.gov/articles/PMC3921176/)
- [Norepinephrine-mediated vasomotion drives glymphatic clearance (Cell, 2024)](https://www.cell.com/cell/abstract/S0092-8674(24)01343-6)
- [Scientists uncover how the brain washes itself during sleep (Science/AAAS)](https://www.science.org/content/article/scientists-uncover-how-brain-washes-itself-during-sleep)
- [The Sleeping Brain: Harnessing the Glymphatic System (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC7698404/)
- [Sleep and Immune System Crosstalk (SAGE, 2025)](https://journals.sagepub.com/doi/10.1177/09727531241275347)
- [The Sleep-Immune Crosstalk in Health and Disease (Physiological Reviews)](https://journals.physiology.org/doi/full/10.1152/physrev.00010.2018)
- [The Night Gardeners: Immune Cells Rewire Brain During Sleep (URMC)](https://www.urmc.rochester.edu/news/story/the-night-gardeners----immune-cells-rewire-repair-brain-while-we-sleep)
- [Sleep and immune function (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC3256323/)
- [What Happens During NREM Sleep? (Sleep Foundation)](https://www.sleepfoundation.org/stages-of-sleep/nrem-sleep)
- [What Happens to the Body During Sleep? (Science Times, 2026)](https://www.sciencetimes.com/articles/61326/20260216/what-happens-body-during-sleep-brain-repair-rem-cycles-nightly-recovery.htm)
- [How NREM Sleep Supports Brain and Body Repair (The Sleep Reset)](https://www.thesleepreset.com/blog/how-nrem-sleep-supports-brain-and-body-repair)
- [Effects of sleep deprivation on wound healing (PubMed, 2005)](https://pubmed.ncbi.nlm.nih.gov/16120095/)
- [Two nights of recovery sleep restores connectivity but not memory (Nature, 2020)](https://www.nature.com/articles/s41598-020-65086-x)

### Dreaming and Creativity

- [Creative problem-solving after provoking dreams during REM sleep (Oxford Academic, 2026)](https://academic.oup.com/nc/article/2026/1/niaf067/8456489)
- [Targeted dream incubation increases post-sleep creative performance (Nature Scientific Reports, 2023)](https://www.nature.com/articles/s41598-023-31361-w)
- [Our dreams' weirdness might be why we have them -- Overfitted Brain Hypothesis (ScienceDaily, 2021)](https://www.sciencedaily.com/releases/2021/05/210514134208.htm)
- [Investigation on Neurobiological Mechanisms of Dreaming (PMC, 2021)](https://pmc.ncbi.nlm.nih.gov/articles/PMC7916906/)

### Computing Parallels

- [Is Sleep Brain Defragmentation? (Discover Magazine)](https://www.discovermagazine.com/mind/is-sleep-brain-defragmentation)
- [Sleep is Garbage Collection (Hacker News)](https://news.ycombinator.com/item?id=547598)
- [Batch (Offline) Learning vs Online Learning in AI (GeeksforGeeks)](https://www.geeksforgeeks.org/artificial-intelligence/batch-offline-learning-vs-online-learning-in-artificial-intelligence/)
- [Hybrid Offline-online Scheduling for LLM Inference (arXiv, 2025)](https://arxiv.org/html/2502.15763v1)
- [Self-Healing AI Systems (AIThority)](https://aithority.com/machine-learning/self-healing-ai-systems-how-autonomous-ai-agents-detect-prevent-and-fix-operational-failures/)
- [Building Self-Healing Kubernetes Clusters (DZone, 2025)](https://dzone.com/articles/self-healing-kubernetes-clusters-agentic-ai)
- [Agentic SRE: Self-Healing Infrastructure (Unite.AI, 2026)](https://www.unite.ai/agentic-sre-how-self-healing-infrastructure-is-redefining-enterprise-aiops-in-2026/)
- [Self-Evolving Agents Cookbook (OpenAI, 2025)](https://cookbook.openai.com/examples/partners/self_evolving_agents/autonomous_agent_retraining)
- [Adaptive: Building Self-Healing AI Agents (Medium, 2025)](https://medium.com/@madhur.prashant7/evolve-building-self-healing-ai-agents-a-multi-agent-system-for-continuous-optimization-0d711ead090c)

### Cross-Domain: Sleep Meets Computing

- [Sleep-like unsupervised replay reduces catastrophic forgetting (Nature Communications, 2022)](https://www.nature.com/articles/s41467-022-34938-7)
- [Sleep prevents catastrophic forgetting in spiking neural networks (PLOS Computational Biology, 2022)](https://journals.plos.org/ploscompbiol/article?id=10.1371/journal.pcbi.1010628)
- [NeuroDream: Sleep-Inspired Memory Consolidation Framework (SSRN, 2024)](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5377250)
- [Dream-Augmented Neural Networks (SSRN, 2025)](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5402490)
- [Dreaming is All You Need: SleepNet and DreamNet (arXiv, 2024)](https://arxiv.org/abs/2409.01633)
- [Brain-inspired replay for continual learning (Nature Communications, 2020)](https://www.nature.com/articles/s41467-020-17866-2)
- [Replay in Deep Learning: Current Approaches and Missing Biological Elements (PMC, 2022)](https://pmc.ncbi.nlm.nih.gov/articles/PMC9074752/)
- [A model of hippocampal replay for spatial learning (eLife, 2023)](https://elifesciences.org/articles/82301)
- [Biologically inspired sleep algorithm for artificial neural networks (arXiv, 2019)](https://arxiv.org/abs/1908.02240)
- [Neural Manifolds and Cognitive Consistency in Artificial Systems (arXiv, 2025)](https://arxiv.org/html/2503.01867v1)
- [When Agents Sleep: Dreaming, Hallucinating, and Imagining AI (Medium)](https://medium.com/@custom_aistudio/when-agents-sleep-dreaming-hallucinating-and-imagining-ai-9a1010e5edcb)
- [Sleeping Networks: A Computational Model for the Role of Sleep in Learning (eScholarship)](https://escholarship.org/uc/item/1500125r)
