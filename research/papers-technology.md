# Academic Papers: Self-Healing Software, Autonomous Agents, and Anti-Fragile Computing

> Research survey compiled 2026-02-20. Prioritizes recent papers (2022-2025) and well-cited surveys.

---

## Table of Contents

1. [Self-Healing Software Systems](#1-self-healing-software-systems)
2. [Autonomic Computing and MAPE-K](#2-autonomic-computing-and-mape-k)
3. [Self-Adaptive Systems](#3-self-adaptive-systems)
4. [Anti-Fragile Computing](#4-anti-fragile-computing)
5. [LLM Agent Architectures and Tool Use](#5-llm-agent-architectures-and-tool-use)
6. [Agent Self-Correction and Self-Reflection](#6-agent-self-correction-and-self-reflection)
7. [Self-Debugging and Autonomous Code Repair](#7-self-debugging-and-autonomous-code-repair)
8. [Multi-Agent Resilience and Fault Tolerance](#8-multi-agent-resilience-and-fault-tolerance)
9. [Agent Memory and Learning](#9-agent-memory-and-learning)
10. [Self-Improving and Self-Evolving AI Agents](#10-self-improving-and-self-evolving-ai-agents)
11. [Chaos Engineering](#11-chaos-engineering)
12. [Agent Failure Detection and Recovery](#12-agent-failure-detection-and-recovery)
13. [Key Themes and Synthesis](#13-key-themes-and-synthesis)

---

## 1. Self-Healing Software Systems

### 1.1 A Survey on Self-healing Software System

- **Authors:** Zahra Yazdanparast et al.
- **Year:** 2024
- **URL:** https://arxiv.org/abs/2403.00455
- **Key Findings:** Comprehensive survey on self-healing software systems. Self-healing aims to create automatic systems that can heal themselves without human intervention, using predefined actions and procedures for recovering from different failure modes. Covers detection, diagnosis, and repair taxonomies across the field.
- **Relevance:** Directly foundational. Provides the taxonomy and classification framework for understanding where our self-healing agent system fits within the broader landscape.

### 1.2 Self-Healing Software Systems: Lessons from Nature, Powered by AI

- **Authors:** (Not specified in search)
- **Year:** 2025
- **URL:** https://arxiv.org/abs/2504.20093
- **Key Findings:** Draws inspiration from biological healing -- the human body detects damage, signals the brain, and activates targeted recovery. Proposes that system observability tools serve as sensory inputs, AI models function as the cognitive core for diagnosis and repair, and healing agents apply targeted code and test modifications. Combines log analysis, static code inspection, and AI-driven generation of patches or test updates to reduce downtime and enhance software resilience.
- **Relevance:** Highly relevant. The biological healing metaphor maps directly to our architecture: monitoring as sensory input, LLM as cognitive core, and agent actions as healing responses.

### 1.3 A Survey on Self-Healing Systems: Approaches and Systems

- **Authors:** Harald Psaier, Schahram Dustdar
- **Year:** 2011 (foundational)
- **URL:** https://link.springer.com/article/10.1007/s00607-010-0107-y
- **Key Findings:** Early comprehensive survey establishing the foundational taxonomy of self-healing approaches, covering detection mechanisms, diagnosis techniques, and recovery strategies. Distinguishes between reactive and proactive self-healing.
- **Relevance:** Historical foundation. Establishes the vocabulary and conceptual framework that all subsequent self-healing work builds upon.

### 1.4 Characterizing Self-Healing Software Systems

- **Authors:** Angelos D. Keromytis
- **Year:** (Foundational work)
- **URL:** https://www.semanticscholar.org/paper/Characterizing-Self-Healing-Software-Systems-Keromytis/72583ee96c843a96071e431458f489584fc74839
- **Key Findings:** Establishes formal characteristics that define self-healing software, distinguishing it from fault-tolerant and self-adaptive systems. Provides criteria for evaluating whether a system genuinely exhibits self-healing behavior.
- **Relevance:** Useful for defining the boundaries and evaluation criteria of our system.

### 1.5 VIGIL: A Reflective Runtime for Self-Healing Agents

- **Authors:** Christopher Cruz
- **Year:** 2025
- **URL:** https://arxiv.org/abs/2512.07094
- **Key Findings:** Addresses how agentic LLM frameworks promise autonomous behavior but most deployed systems remain brittle, lacking runtime introspection and the ability to diagnose their own failure modes. VIGIL is a reflective runtime that supervises a sibling agent and performs autonomous maintenance by ingesting behavioral logs, appraising events into structured representations, maintaining a persistent data bank, and deriving diagnostics that categorize recent behavior into strengths, opportunities, and failures. Generates guarded prompt updates and code proposals. Reduced premature success notifications from 100% to 0% and cut mean latency from 97s to 8s.
- **Relevance:** Most directly relevant paper to our project. VIGIL is essentially a self-healing agent runtime -- it watches another agent, detects failures, and proposes fixes. Key architecture patterns: log ingestion, structured event appraisal, persistent memory bank, diagnostic categorization (strengths/opportunities/failures), and guarded prompt/code updates.

---

## 2. Autonomic Computing and MAPE-K

### 2.1 The Vision of Autonomic Computing

- **Authors:** Jeffrey O. Kephart, David M. Chess (IBM)
- **Year:** 2003 (seminal)
- **URL:** https://ieeexplore.ieee.org/document/1160055/
- **Key Findings:** The foundational paper that introduced the autonomic computing paradigm and the MAPE-K (Monitor, Analyze, Plan, Execute, Knowledge) feedback loop. Motivated by the growing complexity crisis in software systems management. Proposed that systems should self-manage given high-level objectives, exhibiting four self-* properties: self-configuration, self-healing, self-optimization, and self-protection.
- **Relevance:** The MAPE-K loop is the canonical architecture pattern for self-healing systems. Our agent architecture should map to this model: monitoring agent behavior, analyzing failures, planning corrections, and executing fixes, all informed by accumulated knowledge.

### 2.2 Breaking the Loop: AWARE is the New MAPE-K

- **Authors:** Brell Sanwouo et al.
- **Year:** 2024
- **URL:** https://dl.acm.org/doi/10.1145/3696630.3728512
- **Key Findings:** Exposes limitations of MAPE-K loops including lack of proactivity, scalability challenges, and difficulty integrating continuous learning or distributed decision-making. Introduces AWARE (Assess, Weigh, Act, Reflect, Enrich), a distributed, goal-driven framework employing autonomous AI agents capable of proactive adaptation, collaboration, and continuous learning.
- **Relevance:** Directly relevant evolution of MAPE-K. The AWARE model adds reflection and enrichment (learning) phases that align with self-improving agent architectures. The shift from reactive to proactive adaptation is a key design principle for our system.

### 2.3 Analysis of MAPE-K Loop in Self-adaptive Systems for Cloud, IoT and CPS

- **Authors:** (Multiple, Springer chapter)
- **Year:** 2023
- **URL:** https://link.springer.com/chapter/10.1007/978-3-031-26507-5_11
- **Key Findings:** Reviews practical applications of MAPE-K in modern distributed systems including cloud, IoT, and cyber-physical systems. Discusses the integration of Deep Learning into the Analyzer component for enhanced decision-making.
- **Relevance:** Demonstrates MAPE-K applied to modern architectures, validating its continued relevance for distributed self-healing systems.

---

## 3. Self-Adaptive Systems

### 3.1 Generative AI for Self-Adaptive Systems: State of the Art and Research Roadmap

- **Authors:** Jialong Li, Mingyue Zhang, Nianyu Li, Danny Weyns, Zhi Jin, Kenji Tei
- **Year:** 2024
- **URL:** https://dl.acm.org/doi/10.1145/3686803 / https://arxiv.org/abs/2512.04680
- **Key Findings:** Comprehensive study of how generative AI (especially LLMs) can enhance self-adaptive systems (SASs). Organizes findings into: (i) enhancements to the autonomy of SASs centered around MAPE-K feedback loop functions, and (ii) improvements in human-SAS interaction within human-on-the-loop settings. Identifies LLMs as planner and Diffusion models as planner as new categories. Provides a research roadmap highlighting integration challenges.
- **Relevance:** Directly maps the intersection of GenAI and self-adaptive systems. Provides the theoretical framework for using LLMs within MAPE-K loops, which is the core of our agent architecture.

### 3.2 Software Engineering for Self-Adaptive Systems: Research Roadmaps

- **Authors:** Various (Springer LNCS series)
- **Year:** 2009, 2013 (foundational roadmaps)
- **URL:** https://link.springer.com/chapter/10.1007/978-3-642-02161-9_1
- **Key Findings:** Two major research roadmaps establishing the field of software engineering for self-adaptive systems. Define key challenges: requirement specification for adaptive behavior, architectural patterns, verification and validation, and runtime assurance.
- **Relevance:** Establishes the engineering discipline. The challenges identified (runtime assurance, verification of adaptive behavior) remain open and directly apply to our system.

### 3.3 SEAMS Conference Series (Software Engineering for Adaptive and Self-Managing Systems)

- **Year:** Annual, ongoing (CORE-A ranked, co-located with ICSE since 2024)
- **URL:** https://conf.researchr.org/series/seams
- **Key Findings:** Premier venue for self-adaptive systems research, covering self-configuration, self-healing, self-optimization, and self-protection. Now a full conference (not just workshop) reflecting the maturity of the field.
- **Relevance:** Key venue to track for ongoing research in our domain.

---

## 4. Anti-Fragile Computing

### 4.1 Principles of Antifragile Software

- **Authors:** Martin Monperrus
- **Year:** 2017 (updated)
- **URL:** https://arxiv.org/abs/1404.3056
- **Key Findings:** Defines "antifragile software" based on Taleb's concept: systems that improve when stressed. Identifies automatic runtime bug fixing and fault injection in production as approaches that correspond to antifragility. Adaptive fault tolerance is antifragile because the system learns something when an error happens and always improves.
- **Relevance:** Core theoretical paper. The principle that systems should get better from failures (not just survive them) is the philosophical foundation of our project. Key insight: the distinction between robust (survives stress) and antifragile (improves from stress).

### 4.2 Towards Antifragile Software Architectures

- **Authors:** (ScienceDirect publication)
- **Year:** 2017
- **URL:** https://www.sciencedirect.com/science/article/pii/S1877050917311079
- **Key Findings:** Proposes architectural design for building antifragile systems that enhance their strength through experience and errors. Defines architectural patterns that support antifragility at the system design level.
- **Relevance:** Provides architectural guidance for designing systems that improve from errors, directly applicable to our agent framework design.

### 4.3 A Proposal for an Antifragile Software Manifesto

- **Authors:** (ScienceDirect publication)
- **Year:** 2016
- **URL:** https://www.sciencedirect.com/science/article/pii/S1877050916302290
- **Key Findings:** Proposes principles for building software systems that exploit faults and errors to become better and stronger. Frames antifragile software design as an emerging research issue in the software engineering community.
- **Relevance:** Provides design principles that can guide our agent framework's philosophy and approach.

### 4.4 Towards Antifragility of Cloud Systems: An Adaptive Chaos Driven Framework (UNFRAGILE)

- **Authors:** (Keele University repository)
- **Year:** 2024
- **URL:** https://www.sciencedirect.com/science/article/pii/S0950584924001241
- **Key Findings:** Introduces the UNFRAGILE framework for transforming existing systems into antifragile ones by employing chaos engineering to introduce failures incrementally and assess system response. Improves system quality by removing fragilities and introducing adaptive fault tolerance strategies. Validated on a cloud-native real-world architecture to enhance antifragility towards long outbound service latencies. Unlike static resilience configurations, allows the system to self-stabilise during chaos.
- **Relevance:** Highly relevant as a practical framework combining chaos engineering and antifragility. Demonstrates the pattern of: inject failure -> observe response -> adapt -> become stronger. This is the operational loop our self-healing agents should implement.

### 4.5 Tutorial on Systems with Antifragility to Downtime

- **Authors:** (Computing, Springer)
- **Year:** 2020
- **URL:** https://link.springer.com/article/10.1007/s00607-020-00895-6
- **Key Findings:** Studies four design principles and two operational principles for software systems with high uptime. Provides practical guidance on implementing antifragility.
- **Relevance:** Practical design and operational principles applicable to our system.

---

## 5. LLM Agent Architectures and Tool Use

### 5.1 A Survey on Large Language Model based Autonomous Agents

- **Authors:** Lei Wang et al.
- **Year:** 2023 (updated 2024)
- **URL:** https://arxiv.org/abs/2308.11432
- **Key Findings:** Comprehensive survey of LLM-based autonomous agent architectures. Covers agent construction (profiling, memory, planning, action modules), how to train and evaluate agents, and application domains. Establishes the canonical agent architecture with LLM as the core controller.
- **Relevance:** Provides the foundational taxonomy of LLM agent components that our self-healing system must work with: memory, planning, action, and tool use modules.

### 5.2 Large Language Model Agent: A Survey on Methodology, Applications and Challenges

- **Authors:** (CoLing 2025 / IJCAI 2024)
- **Year:** 2025
- **URL:** https://arxiv.org/abs/2503.21460
- **Key Findings:** Organizes LLM agents into four fundamental categories: (1) reasoning-enhanced agents leveraging chain-of-thought and tree-structured deliberation, (2) tool-augmented agents extending LLM capabilities through external APIs and knowledge bases, (3) multi-agent systems enabling collaborative problem-solving through inter-agent communication, and (4) memory-augmented agents maintaining persistent context across interactions.
- **Relevance:** The four-category taxonomy maps directly to capabilities our self-healing agents need: reasoning about failures, using diagnostic tools, collaborating across agents, and remembering past failures.

### 5.3 ReAct: Synergizing Reasoning and Acting in Language Models

- **Authors:** Shunyu Yao et al. (Google Research, Princeton)
- **Year:** 2023 (ICLR 2023)
- **URL:** https://arxiv.org/abs/2210.03629
- **Key Findings:** Foundational framework enabling LLMs to generate both reasoning traces and task-specific actions in an interleaved manner. Reasoning traces help the model induce, track, and update action plans as well as handle exceptions, while actions allow interfacing with external sources for additional information. The Thought-Action-Observation loop is the canonical agentic pattern.
- **Relevance:** ReAct is the baseline agent pattern. Our self-healing system extends this by adding failure detection and recovery within the Thought-Action-Observation loop. The "handle exceptions" capability is the seed of self-healing behavior.

### 5.4 Voyager: An Open-Ended Embodied Agent with Large Language Models

- **Authors:** Guanzhi Wang, Yuqi Xie et al. (NVIDIA, Caltech, UT Austin)
- **Year:** 2023
- **URL:** https://arxiv.org/abs/2305.16291
- **Key Findings:** First LLM-powered embodied lifelong learning agent in Minecraft. Three key components: (1) automatic curriculum for maximizing exploration, (2) ever-growing skill library of executable code for storing and retrieving complex behaviors, and (3) iterative prompting mechanism incorporating environment feedback, execution errors, and self-verification. Obtains 3.3x more unique items, 2.3x longer distances, and unlocks milestones up to 15.3x faster. Skills are temporally extended, interpretable, and compositional.
- **Relevance:** Demonstrates the core pattern of an agent that learns from errors and builds a persistent skill library. The iterative prompting with error feedback and self-verification is a prototype of self-healing behavior. The skill library concept maps to our agent's learned recovery strategies.

---

## 6. Agent Self-Correction and Self-Reflection

### 6.1 Reflexion: Language Agents with Verbal Reinforcement Learning

- **Authors:** Noah Shinn, Federico Cassano, Edward Berman, Ashwin Gopinath, Karthik Narasimhan, Shunyu Yao
- **Year:** 2023 (NeurIPS 2023)
- **URL:** https://arxiv.org/abs/2303.11366
- **Key Findings:** Foundational framework for reinforcing language agents through linguistic feedback rather than weight updates. Agents verbally reflect on task feedback signals, then maintain reflective text in an episodic memory buffer to induce better decision-making. Lightweight (no finetuning needed), allows nuanced feedback, and provides interpretable episodic memory. Achieves 91% pass@1 on HumanEval (vs 80% for GPT-4 baseline), +22% on AlfWorld, +20% on HotPotQA.
- **Relevance:** Foundational for our project. Reflexion demonstrates that agents can self-heal through verbal reflection and episodic memory. The pattern of: attempt -> fail -> reflect -> store reflection -> retry with reflection context is the core self-healing loop we need.

### 6.2 Self-Reflection in LLM Agents: Effects on Problem-Solving Performance

- **Authors:** Matthew Renze, Erhan Guven
- **Year:** 2024
- **URL:** https://arxiv.org/abs/2405.06682
- **Key Findings:** Tested 9 popular LLMs with 8 types of self-reflecting agents. Results show LLM agents significantly improve through self-reflection (p < 0.001). Self-reflections containing more information (Instructions, Explanation, Solution) outperform limited types (Retry, Keywords, Advice). Establishes that the quality/richness of reflection content matters.
- **Relevance:** Provides empirical evidence that self-reflection works, and crucially, that richer reflections produce better outcomes. Our self-healing system should generate detailed failure analyses, not just simple retry signals.

### 6.3 Large Language Models Cannot Self-Correct Reasoning Yet

- **Authors:** Jie Huang, Xinyun Chen, Swaroop Mishra, Huaixiu Steven Zheng, Adams Wei Yu, Xinying Song, Denny Zhou
- **Year:** 2024 (ICLR 2024)
- **URL:** https://arxiv.org/abs/2310.01798
- **Key Findings:** Critical counterpoint: LLMs struggle to self-correct responses without external feedback, and performance can even degrade after self-correction attempts. Introduces "intrinsic self-correction" (correcting without external feedback) vs correction with external signals. The bottleneck is in feedback generation -- LLMs cannot generate reliable feedback on their own responses through prompting alone.
- **Relevance:** Critical design constraint for our system. Pure intrinsic self-correction is unreliable. Our self-healing architecture MUST incorporate external feedback signals (execution results, test outcomes, error logs, monitoring data) rather than relying solely on the LLM's internal judgment.

### 6.4 When Can LLMs Actually Correct Their Own Mistakes? A Critical Survey of Self-Correction of LLMs

- **Authors:** Ryo Kamoi, Yusen Zhang, Nan Zhang, Jiawei Han, Rui Zhang
- **Year:** 2024 (TACL)
- **URL:** https://arxiv.org/abs/2406.01297
- **Key Findings:** Critical survey establishing three key conclusions: (1) No prior work demonstrates successful self-correction with feedback from prompted LLMs alone, except for tasks exceptionally suited for self-correction. (2) Self-correction works well in tasks that can use reliable external feedback. (3) Large-scale fine-tuning enables self-correction. Provides a checklist for designing self-correction experiments.
- **Relevance:** Refines the constraints from 6.3. Confirms that external feedback is the key enabler of successful self-correction. Our system design should maximize the quality and reliability of external feedback channels (test execution, monitoring, structured error reports).

### 6.5 Reflection-Reinforced Self-Training for Language Agents (Re-ReST)

- **Authors:** (EMNLP 2024)
- **Year:** 2024
- **URL:** https://aclanthology.org/2024.emnlp-main.861.pdf
- **Key Findings:** Introduces a reflector mechanism that adjusts agent output based on environmental feedback when a sample is incorrect. Corrected samples are incorporated into training data to improve the self-training process. Combines reflection with reinforcement learning for persistent improvement.
- **Relevance:** Demonstrates the integration of reflection-based correction into training loops, enabling agents to permanently learn from corrections rather than just applying them ephemerally.

---

## 7. Self-Debugging and Autonomous Code Repair

### 7.1 Teaching Large Language Models to Self-Debug

- **Authors:** (ICLR 2024)
- **Year:** 2024
- **URL:** https://arxiv.org/abs/2304.05128
- **Key Findings:** Proposes Self-Debugging, teaching LLMs to debug predicted programs via few-shot demonstrations. Key innovation: "rubber duck debugging" -- the model identifies mistakes by investigating execution results and explaining generated code in natural language. Works even without unit tests or error messages. Achieves SOTA on Spider (text-to-SQL), TransCoder (C++-to-Python), and MBPP (text-to-Python).
- **Relevance:** Directly applicable to our self-healing code generation agents. The rubber duck debugging technique (explain the code, find the error) is a concrete self-healing mechanism. The ability to work without explicit error messages is valuable for scenarios where failures are subtle.

### 7.2 SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering

- **Authors:** (NeurIPS 2024)
- **Year:** 2024
- **URL:** https://arxiv.org/abs/2405.15793
- **Key Findings:** Takes a GitHub issue and autonomously fixes it using LLMs. Custom agent-computer interface (ACI) enhances ability to create/edit code, navigate repositories, and execute tests. Achieved 12.5% pass@1 on SWE-bench and 87.7% on HumanEvalFix. Demonstrates that the interface design between agent and environment significantly impacts performance.
- **Relevance:** Key example of autonomous code repair. The ACI design insight is crucial: how the self-healing agent interfaces with the system it's healing matters as much as the agent's reasoning capability. Interface design is a first-class concern.

### 7.3 Agentless: Demystifying LLM-based Software Engineering Agents

- **Authors:** (2024)
- **Year:** 2024
- **URL:** https://arxiv.org/abs/2407.01489
- **Key Findings:** Achieves 32.00% on SWE-bench Lite (96 correct fixes) at low cost ($0.70 per fix) without complex agent architectures. Demonstrates that simpler approaches to autonomous bug fixing can be highly effective, challenging the assumption that complex agent architectures are always necessary.
- **Relevance:** Important counterpoint: sometimes simpler healing mechanisms are more effective and cost-efficient. Our architecture should support both simple and complex healing strategies, choosing the appropriate level of complexity for each failure type.

---

## 8. Multi-Agent Resilience and Fault Tolerance

### 8.1 On the Resilience of LLM-Based Multi-Agent Collaboration with Faulty Agents

- **Authors:** (OpenReview)
- **Year:** 2024
- **URL:** https://openreview.net/forum?id=bkiM54QftZ
- **Key Findings:** Examines the impact of clumsy or malicious agents in LLM multi-agent systems. Hierarchical structure shows superior resilience with the lowest performance drop of 5.5%. Introduces Challenger and Inspector mechanisms that recover up to 96.4% of errors made by faulty agents.
- **Relevance:** Directly applicable to multi-agent self-healing architectures. The Challenger (questions decisions) and Inspector (validates outputs) mechanisms are concrete patterns for building self-healing into multi-agent systems. The finding that hierarchical structures are more resilient informs our architecture choices.

### 8.2 Towards Fault Tolerance in Multi-Agent Reinforcement Learning

- **Authors:** (2024)
- **Year:** 2024
- **URL:** https://arxiv.org/abs/2412.00534
- **Key Findings:** Enhances fault tolerance in MARL by combining optimized model architecture with tailored training data sampling. Incorporates an attention mechanism into actor/critic networks to automatically detect faults and dynamically regulate attention given to faulty agents. Open-sourced code platform for fault-tolerant MARL.
- **Relevance:** The attention-based fault detection mechanism is an elegant approach: the system learns to automatically downweight faulty agents. This pattern could be adapted for our multi-agent self-healing system.

### 8.3 Who is Introducing the Failure? Automatically Attributing Failures in Multi-Agent Systems (FAMAS)

- **Authors:** (2025)
- **Year:** 2025
- **URL:** https://arxiv.org/pdf/2509.13782
- **Key Findings:** First spectrum-based failure attribution approach for multi-agent systems. Identifies root cause of failed trajectories by performing spectrum analysis on multiple trajectories collected through repeated execution. Novel suspiciousness formula captures both agent activation patterns and action activation patterns.
- **Relevance:** Root cause analysis is critical for effective self-healing. FAMAS provides a method to identify which agent caused a failure, enabling targeted healing rather than system-wide restarts.

### 8.4 Reliable Decision-Making for Multi-Agent LLM Systems

- **Authors:** (2025)
- **Year:** 2025
- **URL:** https://multiagents.org/2025_artifacts/reliable_decision_making_for_multi_agent_llm_systems.pdf
- **Key Findings:** Addresses reliability challenges in multi-agent LLM decision-making. Proposes mechanisms for ensuring consistent and reliable outputs from collaborative agent systems.
- **Relevance:** Reliability in multi-agent systems is a prerequisite for effective self-healing -- the healing agents themselves must be reliable.

---

## 9. Agent Memory and Learning

### 9.1 Memory in the Age of AI Agents: A Survey

- **Authors:** Shichun Liu et al.
- **Year:** 2024
- **URL:** https://arxiv.org/abs/2512.13564
- **Key Findings:** Comprehensive survey examining memory as a core capability of foundation model-based agents. Identifies three dominant memory realizations: token-level, parametric, and latent memory. Proposes a taxonomy distinguishing factual, experiential, and working memory. Covers structured, dynamic, and context-sensitive organization; principled update/retrieval; privacy/access control; and scalability.
- **Relevance:** Critical for our self-healing system. Experiential memory (learning from past failures) is the key mechanism for converting self-healing into antifragility. The taxonomy helps us design the right memory architecture for storing failure patterns, recovery strategies, and learned improvements.

### 9.2 Mem0: Building Production-Ready AI Agents with Scalable Long-Term Memory

- **Authors:** (2025)
- **Year:** 2025
- **URL:** https://arxiv.org/abs/2504.19413
- **Key Findings:** Addresses the challenge of fixed context windows in LLMs for multi-session consistency. Introduces Mem0, a scalable memory-centric architecture that dynamically extracts, consolidates, and retrieves salient information from ongoing conversations. Production-ready approach to persistent agent memory.
- **Relevance:** Provides a practical, production-ready pattern for implementing persistent memory in agents. The extract-consolidate-retrieve pattern is directly applicable to storing and recalling failure/recovery experiences.

### 9.3 A-MEM: Agentic Memory for LLM Agents

- **Authors:** (2025)
- **Year:** 2025
- **URL:** https://arxiv.org/html/2502.12110v1
- **Key Findings:** Improves structured memory organization by incorporating graph databases for storage and retrieval. Enables agents to build structured knowledge representations from experience.
- **Relevance:** Graph-based memory could enable our self-healing system to build rich models of failure causality -- connecting symptoms, root causes, and effective remedies.

### 9.4 Agentic Memory: Learning Unified Long-Term and Short-Term Memory

- **Authors:** (2025)
- **Year:** 2025 (early 2026)
- **URL:** https://arxiv.org/pdf/2601.01885
- **Key Findings:** Develops a unified reinforcement learning approach for managing both long-term and short-term memory in LLM agents. Addresses the challenge of balancing immediate working memory with persistent knowledge.
- **Relevance:** The dual memory model (short-term for current incident, long-term for historical patterns) maps directly to self-healing needs: immediate failure context + historical failure knowledge.

### 9.5 Human-Like Remembering and Forgetting in LLM Agents

- **Authors:** (HAI 2024)
- **Year:** 2024
- **URL:** https://dl.acm.org/doi/10.1145/3765766.3765803
- **Key Findings:** ACT-R-inspired memory architecture enabling human-like remembering and forgetting in LLM agents. Implements decay and reinforcement mechanisms for memories.
- **Relevance:** Forgetting may be as important as remembering for self-healing: old, no-longer-relevant failure patterns should decay to prevent the system from applying outdated fixes.

---

## 10. Self-Improving and Self-Evolving AI Agents

### 10.1 A Comprehensive Survey of Self-Evolving AI Agents

- **Authors:** Fang, Peng et al.
- **Year:** 2025
- **URL:** https://arxiv.org/abs/2508.07407
- **Key Findings:** Defines self-evolving AI agents as autonomous systems that continuously optimise their internal components through interaction with environments, adapting to changing tasks, contexts, and resources while preserving safety. Reviews evolution techniques targeting different agent components. Identifies three major directions: single-agent optimisation, multi-agent optimisation, and domain-specific optimisation.
- **Relevance:** Directly defines the aspirational goal of our system: agents that continuously self-evolve through environmental interaction. The taxonomy of what can be evolved (prompts, tools, strategies, architectures) provides a roadmap for our self-healing capabilities.

### 10.2 Godel Agent: A Self-Referential Agent Framework for Recursive Self-Improvement

- **Authors:** (2024)
- **Year:** 2024
- **URL:** https://arxiv.org/abs/2410.04444
- **Key Findings:** Framework enabling agents to recursively improve themselves without predefined routines or fixed optimization algorithms. Leverages LLMs to dynamically modify the agent's own logic and behavior. Named after Godel's self-referential theorems.
- **Relevance:** The self-referential approach (agents that modify their own code/logic) is the most ambitious form of self-healing: not just recovering from failures, but rewriting the system to prevent future failures. Important for our long-term architecture vision.

### 10.3 Darwin Godel Machine: Open-Ended Evolution of Self-Improving Agents

- **Authors:** (2025)
- **Year:** 2025
- **URL:** https://arxiv.org/abs/2505.22954
- **Key Findings:** Self-improving system that iteratively modifies its own code and empirically validates each change using coding benchmarks. Increased SWE-bench performance from 20.0% to 50.0% and Polyglot from 14.2% to 30.7%. Combines evolutionary search with self-modification.
- **Relevance:** Demonstrates that self-modification with empirical validation can produce dramatic performance improvements. The validate-before-deploy pattern is essential for safe self-healing.

### 10.4 Self-Improving AI Agents through Self-Play

- **Authors:** (2024)
- **Year:** 2024
- **URL:** https://arxiv.org/abs/2512.02731
- **Key Findings:** Formalizes agents as flows governed by a recursive Generator-Verifier-Updater (GVU) operator. Identifies the coefficient of self-improvement as the Lie derivative of the capability functional along this flow. Provides mathematical foundations for understanding when and how agents can self-improve.
- **Relevance:** Provides formal mathematical framework for reasoning about self-improvement. The GVU operator (Generate-Verify-Update) maps to a self-healing cycle: generate a fix, verify it works, update the system.

### 10.5 Self-Improving LLM Agents at Test-Time

- **Authors:** (2024)
- **Year:** 2024
- **URL:** https://arxiv.org/abs/2510.07841
- **Key Findings:** Explores test-time self-improvement where the same model generates additional training examples from its own uncertain cases (TT-SI) or learns from a stronger model's examples (TT-D).
- **Relevance:** Test-time improvement is analogous to self-healing at runtime: the system improves during deployment, not just during training.

### 10.6 Agent Q: Advanced Reasoning and Learning for Autonomous AI Agents

- **Authors:** MultiOn Research
- **Year:** 2024
- **URL:** https://arxiv.org/abs/2408.07199
- **Key Findings:** Self-supervised agent framework combining guided Monte Carlo Tree Search (MCTS) with self-critique mechanism and iterative fine-tuning using Direct Preference Optimization (DPO). Learns from both successful and unsuccessful trajectories. Boosted Llama-3 70B from 18.6% to 81.7% success rate (340% increase) in one day, reaching 95.4% with online search.
- **Relevance:** Demonstrates learning from both success and failure trajectories. The self-critique mechanism is a form of self-healing: identifying what went wrong and using that information to improve future behavior. The dramatic improvement speed suggests rapid self-healing is achievable.

---

## 11. Chaos Engineering

### 11.1 Chaos Engineering (Original Netflix Paper)

- **Authors:** Ali Basiri, Niosha Behnam et al. (Netflix)
- **Year:** 2016
- **URL:** https://arxiv.org/pdf/1702.05843
- **Key Findings:** Foundational paper defining chaos engineering principles: build a hypothesis around steady-state behavior, vary real-world events, run experiments in production, automate experiments to run continuously. Established the discipline of deliberately injecting failures to discover system weaknesses.
- **Relevance:** Provides the operational methodology for testing self-healing systems: deliberately inject failures and verify that the self-healing mechanisms respond correctly. Chaos engineering is the testing framework for antifragile systems.

### 11.2 Chaos Engineering: A Multi-Vocal Literature Review

- **Authors:** (2024)
- **Year:** 2024
- **URL:** https://arxiv.org/html/2412.01416v1
- **Key Findings:** Comprehensive literature review systematically analyzing 88 academic and grey literature sources from January 2019 to April 2024. Identifies five key features defining effective chaos engineering: experimentation hub, collaborative workflow management, observability suite, security and governance, and integration and automation.
- **Relevance:** Provides the most up-to-date overview of chaos engineering practices and tools. The five key features are requirements for our self-healing system's testing infrastructure.

### 11.3 Chaos Engineering in the Wild: Findings from GitHub

- **Authors:** (2025)
- **Year:** 2025
- **URL:** https://arxiv.org/html/2505.13654v1
- **Key Findings:** Analyzed 971 GitHub repositories using chaos engineering tools. Found sharp increase in adoption between 2019-2024. Toxiproxy, Chaos Mesh, and Chaos Monkey are the most widely adopted (64.57% collectively). Provides empirical data on real-world chaos engineering practices.
- **Relevance:** Identifies the practical tools and practices in use, helping us choose appropriate chaos engineering tools for testing our self-healing agents.

---

## 12. Agent Failure Detection and Recovery

### 12.1 Where LLM Agents Fail and How They Can Learn From Failures (AgentDebug)

- **Authors:** (2025)
- **Year:** 2025
- **URL:** https://arxiv.org/abs/2509.25370
- **Key Findings:** Introduces AgentErrorTaxonomy: a modular classification of failure modes spanning memory, reflection, planning, action, and system-level operations. Constructs AgentErrorBench: a dataset of annotated failure trajectories from ALFWorld, GAIA, and WebShop. Proposes AgentDebug: a debugging framework that isolates root-cause failures and provides corrective feedback, enabling up to 26% relative improvement in task success.
- **Relevance:** Highly relevant. Provides a concrete failure taxonomy and debugging framework for LLM agents. The failure classification (memory, reflection, planning, action, system-level) maps to different self-healing strategies for each failure type.

### 12.2 Exploring Autonomous Agents: A Closer Look at Why They Fail When Completing Tasks

- **Authors:** (2025)
- **Year:** 2025
- **URL:** https://arxiv.org/html/2508.13143v1
- **Key Findings:** Reveals approximately 50% task completion rate for autonomous agents. Categorizes failures into a three-level taxonomy based on task phases. Investigates collaboration mechanisms and failure reasons.
- **Relevance:** The 50% failure rate underscores the urgency of self-healing capabilities. The phase-based failure taxonomy helps identify when in the task lifecycle self-healing should intervene.

### 12.3 Recover: A Neuro-Symbolic Framework for Failure Detection and Recovery

- **Authors:** (2024)
- **Year:** 2024
- **URL:** https://arxiv.org/html/2404.00756v1
- **Key Findings:** Combines neural and symbolic approaches for detecting and recovering from agent failures. Uses symbolic reasoning for interpretable failure diagnosis and neural methods for flexible pattern recognition.
- **Relevance:** The neuro-symbolic approach offers a middle ground: LLM-based pattern recognition for novel failures combined with symbolic rules for known failure modes. Our system could benefit from this hybrid approach.

### 12.4 Towards a Science of AI Agent Reliability

- **Authors:** (2026)
- **Year:** 2026
- **URL:** https://arxiv.org/html/2602.16666
- **Key Findings:** Proposes establishing a formal science of AI agent reliability, drawing from reliability engineering. Addresses systematic approaches to understanding, measuring, and improving agent reliability.
- **Relevance:** Provides the theoretical foundation for measuring whether our self-healing system actually improves reliability, and how to reason about reliability guarantees.

---

## 13. Key Themes and Synthesis

### Critical Design Principles Emerging from the Literature

1. **External feedback is essential for self-correction.** Papers [6.3] and [6.4] conclusively show that intrinsic self-correction (without external signals) is unreliable. Self-healing systems MUST incorporate external feedback: execution results, test outcomes, monitoring data, error logs. The richer the feedback, the better the correction [6.2].

2. **The MAPE-K pattern remains the canonical architecture.** From the original IBM vision [2.1] through modern GenAI integration [3.1], the Monitor-Analyze-Plan-Execute-Knowledge loop is the fundamental pattern for self-healing. The AWARE extension [2.2] adds reflection and learning, which aligns with LLM agent capabilities.

3. **Antifragility > Resilience > Robustness.** The goal is not just surviving failures (robustness) or recovering from them (resilience), but improving from them (antifragility) [4.1, 4.4]. This requires persistent memory [9.1, 9.2] to accumulate learned improvements.

4. **Reflection with episodic memory is the core self-healing mechanism for LLM agents.** Reflexion [6.1] demonstrated that verbal reflection stored in episodic memory produces significant improvement. VIGIL [1.5] operationalized this into a runtime system. The pattern: attempt -> fail -> reflect -> store -> retry with context.

5. **Hierarchical and inspector-based multi-agent architectures are more resilient.** Hierarchical structures with Challenger/Inspector mechanisms recover up to 96.4% of errors [8.1]. Self-healing should be architected as a supervisory layer, not embedded in the task agent itself.

6. **Root cause attribution is critical for targeted healing.** FAMAS [8.3] and AgentDebug [12.1] show that identifying which component failed enables targeted fixes rather than expensive full-system restarts.

7. **Self-modification with empirical validation produces dramatic improvements.** Darwin Godel Machine [10.3] improved from 20% to 50% on SWE-bench through validated self-modification. The key safety constraint: every modification must be empirically validated before deployment.

8. **Agent interface design matters as much as agent intelligence.** SWE-agent [7.2] showed that the agent-computer interface (ACI) significantly impacts performance. How the healing agent observes and interacts with the target system is a first-class design concern.

### Recommended Architecture Pattern for Self-Healing Agents

Based on the literature synthesis, the recommended architecture combines:

```
                    MAPE-K / AWARE Loop
                    ====================

    [Monitor] --- Behavioral logs, metrics, error signals
         |
    [Analyze] --- LLM-based root cause analysis with external feedback
         |            (NOT intrinsic self-correction)
         |
    [Plan]    --- LLM generates healing strategy
         |            (drawing from experiential memory)
         |
    [Execute] --- Apply fix (prompt update, code patch, config change)
         |            (with empirical validation before commit)
         |
    [Knowledge] - Episodic memory of failures and successful recoveries
                      (persistent, with decay for outdated patterns)
```

### Key Open Problems

- **Safety of self-modification**: How to ensure self-healing changes don't introduce new failures
- **Scalability of reflection**: Reflection costs compute; how to balance healing overhead with task throughput
- **Evaluation methodology**: No standard benchmarks for measuring self-healing capability
- **Composability**: How do self-healing mechanisms compose in multi-agent systems?
- **Formal guarantees**: Can we prove convergence properties of self-healing loops?

---

## Paper Index by Relevance (High to Low)

| Priority | Paper | Section | Why |
|----------|-------|---------|-----|
| **Critical** | VIGIL: Reflective Runtime for Self-Healing Agents | 1.5 | Most directly related; operational self-healing agent runtime |
| **Critical** | Reflexion: Verbal Reinforcement Learning | 6.1 | Core mechanism: reflection + episodic memory |
| **Critical** | LLMs Cannot Self-Correct Reasoning Yet | 6.3 | Key design constraint: need external feedback |
| **Critical** | When Can LLMs Correct Their Own Mistakes? | 6.4 | Conditions for successful self-correction |
| **Critical** | Generative AI for Self-Adaptive Systems | 3.1 | GenAI + MAPE-K roadmap |
| **Critical** | Survey of Self-Evolving AI Agents | 10.1 | Comprehensive taxonomy of agent evolution |
| **High** | Self-Healing Software: Lessons from Nature | 1.2 | Bio-inspired self-healing architecture |
| **High** | Principles of Antifragile Software | 4.1 | Theoretical foundation for antifragility |
| **High** | UNFRAGILE: Adaptive Chaos Driven Framework | 4.4 | Practical antifragility through chaos engineering |
| **High** | Where LLM Agents Fail (AgentDebug) | 12.1 | Failure taxonomy and debugging framework |
| **High** | Resilience of LLM Multi-Agent with Faulty Agents | 8.1 | Challenger/Inspector patterns for resilience |
| **High** | Memory in the Age of AI Agents | 9.1 | Memory taxonomy for experiential learning |
| **High** | Darwin Godel Machine | 10.3 | Self-modification with empirical validation |
| **High** | The Vision of Autonomic Computing (MAPE-K) | 2.1 | Foundational architecture pattern |
| **Medium** | Self-Reflection in LLM Agents | 6.2 | Empirical evidence for reflection effectiveness |
| **Medium** | Teaching LLMs to Self-Debug | 7.1 | Rubber duck debugging for code repair |
| **Medium** | SWE-agent | 7.2 | Interface design for autonomous code repair |
| **Medium** | Agent Q | 10.6 | Learning from success and failure trajectories |
| **Medium** | Voyager | 5.4 | Skill library + iterative error correction |
| **Medium** | Breaking the Loop: AWARE | 2.2 | Evolution beyond MAPE-K |
| **Medium** | Chaos Engineering Literature Review | 11.2 | Testing framework for self-healing |
| **Medium** | FAMAS: Failure Attribution in Multi-Agent | 8.3 | Root cause analysis for multi-agent systems |
| **Medium** | Mem0: Production-Ready Long-Term Memory | 9.2 | Practical persistent memory implementation |
| **Medium** | Godel Agent | 10.2 | Recursive self-improvement framework |
| **Lower** | Fault Tolerance in MARL | 8.2 | Attention-based fault detection |
| **Lower** | Chaos Engineering (Netflix) | 11.1 | Foundational chaos engineering principles |
| **Lower** | LLM Agent Comprehensive Surveys | 5.1, 5.2 | General agent architecture context |
| **Lower** | Antifragile Software Manifesto | 4.3 | Design principles |
| **Lower** | Survey on Self-healing Software | 1.1 | Broad field overview |
