# Papers at the Intersection of Biological Self-Healing and Computing/Agent Systems

> Research compiled: 2026-02-20
> Focus: Computing systems that directly model biological healing mechanisms
> This is the most directly relevant research track for the self-healing agents project.

---

## Table of Contents

1. [Foundational Surveys and Frameworks](#1-foundational-surveys-and-frameworks)
2. [Artificial Immune Systems (AIS)](#2-artificial-immune-systems-ais)
3. [Bio-Inspired Self-Healing Architectures](#3-bio-inspired-self-healing-architectures)
4. [Homeostatic Computing and Agents](#4-homeostatic-computing-and-agents)
5. [Autopoiesis in Computing](#5-autopoiesis-in-computing)
6. [Organic Computing](#6-organic-computing)
7. [Swarm Intelligence for Self-Repair](#7-swarm-intelligence-for-self-repair)
8. [Brain-Inspired and Neuromorphic Self-Healing](#8-brain-inspired-and-neuromorphic-self-healing)
9. [Biological Degeneracy and Robustness Applied to Software](#9-biological-degeneracy-and-robustness-applied-to-software)
10. [Antifragile and Adversarial Resilience](#10-antifragile-and-adversarial-resilience)
11. [Embryonic Electronics (Embryonics)](#11-embryonic-electronics-embryonics)
12. [Regenerative Computing](#12-regenerative-computing)
13. [Nature-Inspired Agent Architectures](#13-nature-inspired-agent-architectures)
14. [Biologically-Inspired Autonomic Systems](#14-biologically-inspired-autonomic-systems)
15. [Self-Healing in Software-Defined Networks](#15-self-healing-in-software-defined-networks)
16. [Synthesis and Relevance Map](#16-synthesis-and-relevance-map)

---

## 1. Foundational Surveys and Frameworks

### 1.1 Self-Healing Software Systems: Lessons from Nature, Powered by AI

- **Authors:** Mohammad Baqar, Rajat Khanda, Saba Naqvi
- **URL:** https://arxiv.org/abs/2504.20093
- **Year:** 2025
- **Biological Mechanism:** Human wound healing (detect damage -> signal brain -> activate targeted recovery)
- **Computing Concept:** AI-driven self-healing software framework
- **Key Findings:** Proposes a framework that directly mimics the biological wound-healing model: system observability tools serve as sensory inputs, AI models function as the cognitive core for diagnosis and repair, and healing agents apply targeted code and test modifications. Combines log analysis, static code inspection, and AI-driven generation of patches or test updates.
- **Relevance to Project:** **CRITICAL** -- This is the most directly relevant paper. It provides a complete architectural blueprint mapping biological healing phases to software system components. The "healing agents" concept directly aligns with our project.

### 1.2 A Survey on Self-Healing Software Systems

- **Authors:** Zahra Yazdanparast
- **URL:** https://arxiv.org/abs/2403.00455
- **Year:** 2024
- **Biological Mechanism:** General biological self-healing analogy
- **Computing Concept:** Self-healing software systems (detection, diagnosis, recovery)
- **Key Findings:** Comprehensive survey covering the state of self-healing software. The main purpose of self-healing is to have an automatic system that can heal itself without human intervention, with predefined actions and procedures suitable for recovering from different failure modes.
- **Relevance to Project:** **HIGH** -- Provides landscape overview of existing approaches, taxonomy of self-healing techniques, and identifies research gaps.

### 1.3 Self-Healing Systems: Survey and Synthesis

- **Authors:** Debanjan Ghosh, Raj Sharman, H. Raghav Rao, Shambhu Upadhyaya
- **URL:** https://dl.acm.org/doi/10.1016/j.dss.2006.06.011
- **Year:** 2007
- **Biological Mechanism:** Biological wound healing analogy
- **Computing Concept:** Autonomic computing, self-healing systems
- **Key Findings:** Seminal survey establishing the self-healing systems field. Self-healing systems attempt to "heal" themselves in the sense of recovering from faults and regaining normative performance levels independently. Classifies approaches and identifies the concept as deriving from the manner in which a biological system heals a wound.
- **Relevance to Project:** **HIGH** -- Foundational reference for the field. Establishes the biological-to-computing mapping that our project extends.

### 1.4 A Survey on Self-Healing Systems: Approaches and Systems

- **URL:** https://link.springer.com/article/10.1007/s00607-010-0107-y
- **Year:** 2010 (Computing journal, Springer)
- **Biological Mechanism:** General biological self-healing
- **Computing Concept:** Self-healing approaches taxonomy
- **Key Findings:** Surveys approaches including model-based, architecture-based, and multi-agent-based self-healing. Covers both external and internal monitoring models.
- **Relevance to Project:** **HIGH** -- Provides comprehensive taxonomy of self-healing approaches useful for positioning our work.

### 1.5 Self-Healing Machine Learning: A Framework for Autonomous Adaptation in Real-World Environments

- **Authors:** Paulius Rauba, Nabeel Seedat, Krzysztof Kacprzyk, Mihaela van der Schaar
- **URL:** https://arxiv.org/abs/2411.00186
- **Year:** 2024 (NeurIPS 2024)
- **Biological Mechanism:** Self-healing/self-repair analogy
- **Computing Concept:** Self-healing ML systems, autonomous adaptation
- **Key Findings:** Proposes SHML (Self-Healing Machine Learning) which autonomously diagnoses the reason for model degradation and proposes diagnosis-based corrective actions. Introduces H-LLM, an agentic self-healing solution that uses large language models for self-diagnosis by reasoning about the structure underlying the data-generating process, and self-adaptation by proposing and evaluating corrective actions.
- **Relevance to Project:** **CRITICAL** -- Directly demonstrates LLM-based agentic self-healing. The H-LLM architecture is a state-of-the-art reference for our agent-based approach. Published at NeurIPS 2024.

### 1.6 Bio-inspired AI: Integrating Biological Complexity into Artificial Intelligence

- **Authors:** Nima Dehghani, Michael Levin
- **URL:** https://arxiv.org/abs/2411.15243
- **Year:** 2024
- **Biological Mechanism:** Context-dependent hierarchical information processing, trial-and-error heuristics, multi-scale organization
- **Computing Concept:** Bio-inspired AI design principles
- **Key Findings:** Provides a framework for designing more adaptable and robust AI systems inspired by biological computation. Argues that current AI approaches focused on mimicking "behavioral function" often overlook complex hierarchical architectures or adaptive environmental interactions. Emphasizes top-down causality and adaptive interaction with the environment.
- **Relevance to Project:** **HIGH** -- Provides theoretical grounding for why bio-inspired approaches produce more robust systems. Michael Levin is a leading figure in biological intelligence research.

---

## 2. Artificial Immune Systems (AIS)

### 2.1 Artificial Immune Systems: A Bio-Inspired Paradigm for Computational Intelligence

- **URL:** https://www.scipublications.com/journal/index.php/jaibd/article/view/1233
- **Year:** 2024
- **Biological Mechanism:** Adaptive immune system (self/non-self discrimination, clonal selection, immune memory)
- **Computing Concept:** Computational intelligence, optimization, anomaly detection
- **Key Findings:** Comprehensive review of AIS as bio-inspired computational frameworks that emulate adaptive mechanisms of the human immune system. Covers applications in cybersecurity, resource allocation, and autonomous systems. Discusses integration with ML, quantum computing, and bioinformatics to address scalability and efficiency challenges.
- **Relevance to Project:** **HIGH** -- AIS provides the most mature bio-inspired computing paradigm for self-healing. Self/non-self discrimination maps directly to anomaly detection in agent systems.

### 2.2 SAIS: A Novel Bio-Inspired Artificial Immune System Based on Symbiotic Paradigm

- **Authors:** Song, J., Yuan, Y., Pang, W.
- **URL:** https://arxiv.org/abs/2402.07244
- **Year:** 2024 (GECCO 2024)
- **Biological Mechanism:** Symbiotic relationships in biology (mutualism, commensalism, parasitism)
- **Computing Concept:** Optimization algorithms, artificial immune systems
- **Key Findings:** Proposes SAIS drawing inspiration from symbiotic relationships. Concurrently processes three symbiotic relationships corresponding to population update methods, achieving comparable performance to state-of-the-art while handling larger population sizes with fewer generations.
- **Relevance to Project:** **MEDIUM** -- Novel approach combining immune and symbiotic biological metaphors. Demonstrates how multiple biological principles can be composed in a single system.

### 2.3 The Dendritic Cell Algorithm (Danger Theory)

- **Authors:** Julie Greensmith, Uwe Aickelin, et al.
- **URL:** https://link.springer.com/chapter/10.1007/978-1-84800-261-6_5
- **Year:** 2008
- **Biological Mechanism:** Danger theory of immunology, dendritic cell signaling
- **Computing Concept:** Anomaly detection, intrusion detection
- **Key Findings:** The DCA is a population-based algorithm where each agent is an "artificial DC" that can combine multiple data streams and add context to data suspected as anomalous. Successfully applied to port scan detection, botnet detection, and robot security. Produces impressive results with low false positive rates.
- **Relevance to Project:** **HIGH** -- The danger theory paradigm is more nuanced than simple self/non-self discrimination. Agents that can detect "danger signals" (not just anomalies) provide a richer model for self-healing triggers.

### 2.4 Designing an Artificial Immune System Inspired Intrusion Detection System

- **URL:** https://arxiv.org/abs/2208.07801
- **Year:** 2022
- **Biological Mechanism:** Human immune system (self/non-self discrimination)
- **Computing Concept:** Intrusion detection systems
- **Key Findings:** Provides a practical framework for designing AIS-based IDS. Demonstrates how biological immune mechanisms translate to concrete computer security implementations.
- **Relevance to Project:** **MEDIUM** -- While focused on security, the detection mechanisms are transferable to any self-healing agent that needs to identify problems.

### 2.5 Artificial Immune Systems for Industrial Intrusion Detection: A Systematic Review

- **URL:** https://onlinelibrary.wiley.com/doi/full/10.1155/je/8408209
- **Year:** 2025 (Hosseini et al.)
- **Biological Mechanism:** Human immune system adaptive and self-regulating mechanisms
- **Computing Concept:** Industrial intrusion detection in dynamic networks
- **Key Findings:** Systematic review of AIS in industrial IDS. Provides a conceptual framework for applying immune-inspired approaches to industrial-scale systems.
- **Relevance to Project:** **MEDIUM** -- Demonstrates scalability of immune-inspired approaches to industrial environments.

### 2.6 Immune Network Theory and Computing

- **Authors:** Originally Niels Kaj Jerne (Nobel Prize 1984); computational implementations by Farmer, Packard, Perelson (1986) and Bersini, Varela (1990)
- **URL:** https://en.wikipedia.org/wiki/Immune_network_theory (overview); https://cleveralgorithms.com/nature-inspired/immune/immune_network_algorithm.html (algorithm)
- **Year:** 1974 (theory), 1986+ (computational)
- **Biological Mechanism:** Idiotypic immune network -- antibodies interact with each other even without foreign antigens, creating a self-regulating network
- **Computing Concept:** Network-based optimization, clustering, self-regulation
- **Key Findings:** The immune network is a self-regulated network of cells and molecules capable of interacting even in the absence of antigens. Computational implementations use graph structures where antibodies represent nodes and edges are grown/pruned based on affinity. Applications in clustering, data visualization, control, and optimization.
- **Relevance to Project:** **HIGH** -- The self-regulating network concept maps well to multi-agent systems where agents must maintain homeostasis without external orchestration. The idea that the "immune system" is always active (not just responding to threats) is crucial for proactive self-healing.

### 2.7 Negative Selection Algorithm

- **URL:** https://www.sciencedirect.com/science/article/abs/pii/S1574013723000242
- **Year:** 2023 (survey)
- **Biological Mechanism:** T-cell maturation in thymus (negative selection of self-reactive T-cells)
- **Computing Concept:** Anomaly detection, self/non-self discrimination
- **Key Findings:** Comprehensive survey of NSA in anomaly detection. NSA generates detectors that can distinguish between self (normal) and non-self (abnormal) patterns. The algorithm is based on the immune system's ability to recognize non-self antigens while tolerating self cells.
- **Relevance to Project:** **MEDIUM** -- The "self model" concept is relevant: agents need a model of what "healthy" looks like before they can detect deviations.

### 2.8 The Cyber Immune System: Harnessing Adversarial Forces for Security Resilience

- **URL:** https://arxiv.org/abs/2502.17698
- **Year:** 2025
- **Biological Mechanism:** Immune coevolutionary arms race, vaccination (controlled exposure)
- **Computing Concept:** Cybersecurity, adversarial resilience, Red Team/Blue Team
- **Key Findings:** Reframes adversarial agents as stress-testers of complex systems. Draws from environmental epidemiology to show that parasites and cyber exploiters serve as essential stress-testers that expose hidden vulnerabilities and push defensive innovations forward. Security is not about achieving perfect immunity but about fostering adaptive, responsive resilience.
- **Relevance to Project:** **HIGH** -- The "controlled exposure" concept (vaccination for software) is directly applicable. Self-healing agents could incorporate adversarial testing to strengthen themselves proactively.

### 2.9 Intrusion Detection and Self-Healing Model for Network Security

- **Authors:** Jain, Singh
- **URL:** https://ieeexplore.ieee.org/document/6088198
- **Year:** 2011
- **Biological Mechanism:** Immune system multi-layered defense
- **Computing Concept:** Multi-agent IDS with self-healing
- **Key Findings:** Features a multi-agent system comprising sense, analysis, adaptive, and self-healing agents for effective threat management. The IDS detects and analyzes malicious activities to trigger the self-healing system. The agent architecture directly couples detection with healing.
- **Relevance to Project:** **HIGH** -- The multi-agent architecture (sense/analysis/adaptive/healing) provides a concrete blueprint for agent role decomposition in our system.

---

## 3. Bio-Inspired Self-Healing Architectures

### 3.1 Multi-Tiered Bio-Inspired Self-Healing Architectural Paradigm for Software Systems

- **URL:** https://www.researchgate.net/publication/228807422_Multi-Tiered_Bio-Inspired_Self-Healing_Architectural_Paradigm_for_Software_Systems
- **Year:** ~2010
- **Biological Mechanism:** Wound healing process
- **Computing Concept:** Self-healing software architecture
- **Key Findings:** Proposes a two-layer architecture: a functional layer where components operate normally, and a healing layer that handles anomalous conditions. Inspired directly by the biological wound-healing process. Self-healing enables software systems to continuously and dynamically monitor, diagnose, and adapt themselves after component failure.
- **Relevance to Project:** **HIGH** -- The functional/healing layer separation is an important architectural pattern. Our agents could implement this dual-layer design.

### 3.2 BioSymPLe: Bio-Inspired Self-Healing Resilient Architecture

- **Authors:** Khairullah, Salamah et al.
- **URL:** https://www.tandfonline.com/doi/abs/10.1080/00295450.2018.1450014
- **Year:** 2018
- **Biological Mechanism:** Stem cells, immune system, DNA-to-protein pathway
- **Computing Concept:** Self-healing digital I&C systems (nuclear power plants)
- **Key Findings:** BioSymPLe is organized into three hierarchical levels: local function migration (cellular), critical service (tissue), and global function migration (organ). Uses B cells for executing functionality based on DNA genetic codes, T cells for coordination, and embryonic stem cells for differentiating to repair faulty T cells. Successfully demonstrated on Emergency Diesel Generator startup and Automotive Cruise Control.
- **Relevance to Project:** **HIGH** -- The multi-level biological hierarchy (cell/tissue/organ) mapped to computing layers is a powerful design pattern. The stem cell concept for replacing faulty agents is directly applicable.

### 3.3 A Self-Healing Hardware Architecture for Safety-Critical Digital Embedded Devices

- **Authors:** Khairullah, Salamah et al.
- **URL:** https://arxiv.org/abs/1910.00064
- **Year:** 2019
- **Biological Mechanism:** Stem cells, immune system
- **Computing Concept:** Safety-critical embedded systems, reconfigurable hardware
- **Key Findings:** Extension of BioSymPLe for safety-critical cyber-physical systems. Demonstrates that bio-inspired self-healing can achieve high reliability in systems where failure is not an option.
- **Relevance to Project:** **MEDIUM** -- While hardware-focused, the architectural patterns transfer to software agent systems. Safety-critical requirements align with enterprise deployment needs.

### 3.4 Towards Bioinspired Algorithms to Enhance Self-Healing and Fault Tolerance in Critical Software Systems

- **URL:** https://link.springer.com/chapter/10.1007/978-3-031-95127-5_21
- **Year:** 2025
- **Biological Mechanism:** Human immune system for autonomous self-repair
- **Computing Concept:** Critical software systems, probabilistic graph theory, anomaly detection, ML, redundancy
- **Key Findings:** Proposes a bioinspired approach using immune system principles for autonomous self-repair in software. Uses probabilistic graph theory, anomaly detection, machine learning, and redundancy mechanisms to enable computational systems to exhibit self-awareness, damage assessment, and proactive recovery.
- **Relevance to Project:** **HIGH** -- Very recent (2025) and directly proposes immune-inspired algorithms for software self-healing. The combination of graph theory with immune principles is novel.

### 3.5 Biological Immunity and Software Resilience: Two Faces of the Same Coin?

- **Authors:** Autili, Di Salle, Gallo, Perucci, Tivoli
- **URL:** https://link.springer.com/chapter/10.1007/978-3-319-23129-7_1
- **Year:** 2015 (SERENE 2015)
- **Biological Mechanism:** Immune system
- **Computing Concept:** Actor Model (Akka), resilient systems
- **Key Findings:** Studies immune systems to devise software abstractions that enable systematic modeling of resilient systems. Proposes a bio-inspired concept architecture based on the Actor Model, which supports scalable and resilient concurrent computation. Bridges biological immunity with software resilience through the Actor paradigm.
- **Relevance to Project:** **HIGH** -- Directly maps immune system concepts to the Actor Model, which is a multi-agent paradigm. This provides a concrete implementation strategy for bio-inspired self-healing agents.

---

## 4. Homeostatic Computing and Agents

### 4.1 Cognitive Homeostatic Agents

- **Authors:** Amol Kelkar
- **URL:** https://arxiv.org/abs/2103.03359
- **Year:** 2021 (AAMAS 2021, Blue Sky Ideas Track)
- **Biological Mechanism:** Physiological homeostasis -- regulation of internal variables to maintain stability
- **Computing Concept:** Agent architecture, cognitive systems
- **Key Findings:** Proposes that cognition can be interpreted as the regulation of "cognitive homeostatic variables," similar to physiological homeostasis. Cognitive Homeostatic Agents are organized as a hierarchy-like graph of homeostatic subsystems, each organized as sub-hierarchies. All subsystems are connected to orchestrate predictive processing. Argues homeostasis provides a good compromise between symbolic and connectionist approaches to AI.
- **Relevance to Project:** **CRITICAL** -- Directly proposes agent architecture based on homeostasis. The hierarchical homeostatic subsystem design maps perfectly to multi-agent self-healing. Agents maintain their own internal balance while contributing to system-level stability.

### 4.2 Need is All You Need: Homeostatic Neural Networks Adapt to Concept Shift

- **Authors:** Kingson Man, Antonio Damasio, Hartmut Neven
- **URL:** https://arxiv.org/abs/2205.08645
- **Year:** 2022 (NeurIPS 2024 presentation)
- **Biological Mechanism:** Homeostasis -- self-regulation through need and vulnerability
- **Computing Concept:** Neural networks, concept drift adaptation
- **Key Findings:** Introduces neural networks where the computing substrate is placed in a "needful and vulnerable" relation to the objects it computes. Counterintuitively, adding vulnerability to a learner does not impair performance -- homeostatic learners show superior abilities in environments with dynamically changing concept shift. The greatest advantages appear under the highest rates of shift.
- **Relevance to Project:** **HIGH** -- The insight that "needful" agents that are vulnerable to their environment actually perform better under change is profound. Self-healing agents that are somewhat vulnerable (rather than completely shielded) may be more adaptive. Co-authored by Antonio Damasio, a leading neuroscientist.

### 4.3 Homeostatic Agent for General Environment

- **URL:** https://ui.adsabs.harvard.edu/abs/2018JAGI....8....1Y/abstract
- **Year:** 2018
- **Biological Mechanism:** Homeostasis in organisms
- **Computing Concept:** General-purpose agent design
- **Key Findings:** Proposes homeostasis as a foundation for general-purpose agents that can maintain internal balance in diverse environments.
- **Relevance to Project:** **MEDIUM** -- Extends homeostatic principles to general agent environments.

### 4.4 Artificial Homeostatic System: A Novel Approach

- **URL:** https://link.springer.com/chapter/10.1007/11553090_76
- **Year:** 2005
- **Biological Mechanism:** Blood Glucose Homeostasis
- **Computing Concept:** Adaptive systems, decision making
- **Key Findings:** Research extends biologically inspired computing by proposing artificial endocrine systems for autonomous robot navigation with intrinsic self-organizing behavior applicable to decision making under changing environmental conditions.
- **Relevance to Project:** **MEDIUM** -- Demonstrates that homeostatic control (endocrine model) works for autonomous agents in dynamic environments.

### 4.5 Continuous Homeostatic Reinforcement Learning for Self-Regulated Autonomous Agents

- **URL:** https://www.researchgate.net/publication/354597646_Continuous_Homeostatic_Reinforcement_Learning_for_Self-Regulated_Autonomous_Agents
- **Year:** 2021
- **Biological Mechanism:** Homeostatic drive, internal regulation
- **Computing Concept:** Reinforcement learning, autonomous agents
- **Key Findings:** Combines homeostatic principles with reinforcement learning to create agents that are intrinsically motivated to maintain internal balance while pursuing external goals.
- **Relevance to Project:** **HIGH** -- RL-based homeostatic agents could serve as a training paradigm for self-healing agents.

---

## 5. Autopoiesis in Computing

### 5.1 Towards Autopoietic Computing

- **URL:** https://arxiv.org/abs/1009.0797
- **Year:** 2010
- **Biological Mechanism:** Autopoiesis -- self-creating/self-maintaining systems (Maturana & Varela, 1972)
- **Computing Concept:** Self-maintaining software systems
- **Key Findings:** Explores applying autopoiesis to computing. Addresses biological properties of self-organisation, self-replication, self-management, and scalability. The fundamental step centers on the notion of "Structural Coupling" -- the system's relation to its environment.
- **Relevance to Project:** **HIGH** -- Autopoiesis provides the theoretical foundation for truly self-maintaining systems. A self-healing agent system that is autopoietic doesn't just repair damage -- it continuously creates and maintains itself.

### 5.2 Computing with Autopoietic Systems

- **URL:** https://link.springer.com/chapter/10.1007/978-1-4471-0123-9_6
- **Year:** ~2001
- **Biological Mechanism:** Autopoiesis, structural coupling
- **Computing Concept:** Soft computing, autopoietic computation
- **Key Findings:** Uses autopoiesis as a possible foundation for soft-computing, with the fundamental step centered on the notion of Structural Coupling.
- **Relevance to Project:** **MEDIUM** -- Foundational work connecting autopoiesis theory to computation.

### 5.3 Multi-Agent Modeling of Dynamical Systems: A Self-organized, Emergent, Homeostatic and Autopoietic Approach

- **Authors:** Nelson Fernandez
- **URL:** https://arxiv.org/abs/1606.00799
- **Year:** 2016
- **Biological Mechanism:** Self-organization, homeostasis, autopoiesis
- **Computing Concept:** Multi-agent modeling, dynamical systems
- **Key Findings:** Presents theoretical, conceptual and methodological aspects for modeling dynamical systems using multiple agents. Defines, formalizes and measures properties associated with emergence, self-organization, complexity, homeostasis and autopoiesis. Uses graph theory and information theory for metrics to characterize inherent complexity.
- **Relevance to Project:** **HIGH** -- Directly addresses multi-agent systems with homeostatic and autopoietic properties. Provides formal metrics for measuring these biological properties in computational systems.

### 5.4 From Intelligence to Autopoiesis: Rethinking Artificial Intelligence Through Systems Theory

- **URL:** https://www.frontiersin.org/journals/communication/articles/10.3389/fcomm.2025.1585321/full
- **Year:** 2025
- **Biological Mechanism:** Autopoiesis, systems theory
- **Computing Concept:** Rethinking AI foundations
- **Key Findings:** Contemporary approaches like LLMs and recurrent neural nets are rich in computational complexity but lack the organizational complexity required for autopoiesis. Architecture is too flat to capture the hierarchical circularity required. Autopoiesis is the foundation of life, while non-autopoietic approaches form the basis for current cognitive systems.
- **Relevance to Project:** **MEDIUM** -- Important critical perspective. Identifies what current AI lacks compared to truly autopoietic biological systems, pointing toward what would need to change.

### 5.5 Autopoiesis of the Artificial: From Systems to Cognition

- **URL:** https://www.sciencedirect.com/science/article/pii/S0303264723001119
- **Year:** 2023
- **Biological Mechanism:** Autopoiesis
- **Computing Concept:** Artificial cognitive systems
- **Key Findings:** Examines whether artificial systems can achieve genuine autopoiesis and what that would require.
- **Relevance to Project:** **MEDIUM** -- Philosophical but important for understanding the limits of bio-inspired computing approaches.

### 5.6 Autonomic Autopoiesis (NASA Patent)

- **URL:** https://technology.nasa.gov/patent/GSC-TOPS-97
- **Year:** (NASA technology)
- **Biological Mechanism:** Autopoiesis
- **Computing Concept:** Autonomic computing systems
- **Key Findings:** NASA patent on autonomic autopoiesis for computing systems, demonstrating industrial/government interest in self-maintaining systems.
- **Relevance to Project:** **LOW** -- Patent reference; demonstrates real-world applicability.

---

## 6. Organic Computing

### 6.1 Self-Adaptive Systems in Organic Computing

- **URL:** https://arxiv.org/pdf/1808.03519
- **Year:** 2018
- **Biological Mechanism:** Living organisms' self-organization properties
- **Computing Concept:** Self-adaptive systems, organic computing
- **Key Findings:** Organic Computing (OC) makes technical systems more life-like by moving design-time decisions to runtime. Characterized by self-organization, self-configuration, self-optimization, self-healing, self-protection, self-explaining, and context awareness. Alternative to explicit total a priori specification.
- **Relevance to Project:** **HIGH** -- OC provides a comprehensive paradigm for "life-like" computing systems. The seven self-* properties provide a complete framework for what self-healing agents should achieve.

### 6.2 Organic Computing: Addressing Complexity by Controlled Self-Organization

- **Authors:** Hartmut Schmeck et al.
- **URL:** https://www.researchgate.net/profile/Hartmut-Schmeck/publication/221431031
- **Year:** ~2008
- **Biological Mechanism:** Self-organization in living systems
- **Computing Concept:** Controlled self-organization for complex systems
- **Key Findings:** Addresses fundamental challenges in designing complex computing systems with the objective of deeper understanding of emergent global behavior in self-organizing systems.
- **Relevance to Project:** **MEDIUM** -- Foundational OC reference. The concept of "controlled self-organization" (not chaos, not rigid control) is key for practical self-healing systems.

### 6.3 Adaptivity and Self-Organisation in Organic Computing Systems

- **URL:** https://www.researchgate.net/publication/234828694
- **Year:** ~2009
- **Biological Mechanism:** Biological adaptivity
- **Computing Concept:** Organic computing, observer/controller architecture
- **Key Findings:** Presents the observer/controller architecture for organic computing systems where the observer monitors system behavior and the controller adjusts parameters to achieve desired properties.
- **Relevance to Project:** **MEDIUM** -- The observer/controller pattern is relevant to agent architectures that need to monitor and adjust their own behavior.

---

## 7. Swarm Intelligence for Self-Repair

### 7.1 Self-Assembly and Self-Repair of Arbitrary Shapes by a Swarm of Reactive Robots

- **URL:** https://link.springer.com/article/10.1007/s10514-009-9162-7
- **Year:** 2009
- **Biological Mechanism:** Swarm behavior (ant colonies, bee hives), collective repair
- **Computing Concept:** Distributed self-repair algorithms
- **Key Findings:** Distributed algorithms allow a group of simple, physically identical, identically programmed and reactive agents to construct and repair polygonal approximations to arbitrary structures. The algorithms are tolerant of robot failures and externally-induced disturbances, and the structures are self-healing.
- **Relevance to Project:** **HIGH** -- Demonstrates that simple agents with local rules can achieve complex self-repair at the system level. Key insight: identical agents with position-dependent behavior can reconstruct damaged structures.

### 7.2 An Improved Ant Colony Optimization Algorithm with Fault Tolerance for Job Scheduling

- **URL:** https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0177567
- **Year:** 2017
- **Biological Mechanism:** Ant colony foraging behavior
- **Computing Concept:** Grid computing, fault-tolerant job scheduling
- **Key Findings:** Uses resource failure rate and checkpoint-based rollback recovery strategy combined with ACO for fault-tolerant scheduling. Ensures jobs are executed successfully even when resource failure occurs.
- **Relevance to Project:** **MEDIUM** -- Demonstrates practical ACO+fault tolerance combination. The checkpoint+rollback pattern is relevant for agent state recovery.

### 7.3 The Unbreakable Colony: Fault Tolerance and Self-Healing in Antetic AI Architectures

- **URL:** https://www.alphanome.ai/post/the-unbreakable-colony-fault-tolerance-and-self-healing-in-antetic-ai-architectures
- **Year:** 2024/2025
- **Biological Mechanism:** Ant colony organization, decentralized control
- **Computing Concept:** Multi-agent AI architecture
- **Key Findings:** Colonies' decentralized organization, redundant workforce, and adaptive communication provide resilience. No single ant controls the entire colony; tasks are distributed. Performance degrades gracefully rather than catastrophically. "Antetic AI" paradigm emphasizes decentralization and self-organization.
- **Relevance to Project:** **HIGH** -- Directly maps ant colony resilience to AI agent architecture. The graceful degradation property is exactly what self-healing agents need.

### 7.4 Programmable Self-Assembly in a Thousand-Robot Swarm

- **URL:** https://www.science.org/doi/10.1126/science.1254295
- **Year:** 2014 (Science)
- **Biological Mechanism:** Collective behavior of cells in morphogenesis
- **Computing Concept:** Large-scale swarm robotics
- **Key Findings:** Demonstrates programmable self-assembly with 1,024 robots. Each robot follows simple rules but the collective achieves complex shapes and structures.
- **Relevance to Project:** **MEDIUM** -- Demonstrates that bio-inspired self-organization scales to large numbers of agents. Proof that simple local rules produce complex global behavior.

### 7.5 Swarm Computing: The Emergence of Collective AI at the Edge

- **URL:** https://www.intechopen.com/chapters/86972
- **Year:** 2023
- **Biological Mechanism:** Swarm collective intelligence
- **Computing Concept:** Edge computing, IoT, collective AI
- **Key Findings:** Swarm computing as the emergence of a collective artificial intelligence out of a decentralized and organic network of cooperating devices. Increasingly applied in IoT systems due to ability to handle complex, distributed tasks through self-organizing algorithms.
- **Relevance to Project:** **MEDIUM** -- Extends swarm principles to modern edge computing contexts relevant to distributed agent deployment.

### 7.6 Collective Stigmergic Optimization for Multi-Agentic AI Systems

- **URL:** https://medium.com/@jsmith0475/collective-stigmergic-optimization-leveraging-ant-colony-emergent-properties-for-multi-agent-ai-55fa5e80456a (framework overview)
- **Year:** 2024/2025
- **Biological Mechanism:** Stigmergy (indirect coordination through environment modification, e.g., ant pheromones)
- **Computing Concept:** Multi-agent AI coordination, optimization
- **Key Findings:** CSO framework synthesizes ant colony behavior with multi-agent AI advances. Benefits include enhanced scalability, adaptability, robustness, and resource efficiency. ACO-based solutions account for ~45% of the swarm intelligence market share. Practical applications in traffic management and logistics.
- **Relevance to Project:** **HIGH** -- Stigmergy is a coordination mechanism where agents communicate by modifying the environment (like pheromone trails). This is a powerful pattern for self-healing agents that need to coordinate repairs without central control.

---

## 8. Brain-Inspired and Neuromorphic Self-Healing

### 8.1 A Brain-Inspired Agentic Architecture to Improve Planning with LLMs

- **Authors:** Webb, T., Mondal, S.S., Momennejad, I.
- **URL:** https://www.nature.com/articles/s41467-025-63804-5
- **Year:** 2025 (Nature Communications)
- **Biological Mechanism:** Brain's modular planning architecture (conflict monitoring, state prediction, state evaluation, task decomposition, task coordination)
- **Computing Concept:** LLM-based agent architecture, modular planning
- **Key Findings:** Proposes the Modular Agentic Planner (MAP) where planning is performed via interaction of specialized brain-inspired LLM modules, each corresponding to specific brain regions. MAP yields significant improvements over standard LLM methods and competitive agentic baselines. Demonstrates superior transfer across tasks.
- **Relevance to Project:** **CRITICAL** -- Published in Nature Communications 2025. Directly demonstrates that brain-inspired modular agent architecture outperforms monolithic approaches. Each "brain region module" could include self-healing capabilities. From Microsoft Research.

### 8.2 Design and Implementation of Self-Healing Neural Networks

- **URL:** https://www.researchgate.net/publication/392749096
- **Year:** 2025
- **Biological Mechanism:** Neural plasticity, self-repair in biological neural networks
- **Computing Concept:** Self-healing neural networks, dynamic reconfiguration
- **Key Findings:** Self-healing neural networks can identify internal faults, recover from them, and dynamically reconfigure for continuous operation. Mechanisms include real-time error detection, autonomous weight reconfiguration, and selective memory consolidation inspired by biological neural plasticity. Three techniques: Distributed ANN, Neuron Virtualization, and Dual-Layer Checkpointing.
- **Relevance to Project:** **HIGH** -- Neural self-healing mechanisms (detect, reconfigure, consolidate) parallel what agent systems need to do at a higher level of abstraction.

### 8.3 A Brain-Inspired Algorithm that Mitigates Catastrophic Forgetting

- **URL:** https://www.science.org/doi/10.1126/sciadv.adi2947
- **Year:** 2023 (Science Advances)
- **Biological Mechanism:** Brain's memory consolidation during sleep, synaptic homeostasis
- **Computing Concept:** Neural networks, continual learning
- **Key Findings:** Brain-inspired approach to preventing catastrophic forgetting in neural networks, mimicking how the brain consolidates and protects memories.
- **Relevance to Project:** **MEDIUM** -- Relevant to agents that need to maintain learned repair strategies while learning new ones. Catastrophic forgetting is a challenge for adaptive self-healing.

### 8.4 Enabling Physical AI through Biological Principles

- **Authors:** Wilkie Olin-Ammentorp
- **URL:** https://arxiv.org/abs/2509.24521
- **Year:** 2025
- **Biological Mechanism:** Biological computation across scales (substrates, signals, modulation)
- **Computing Concept:** Physical AI, neuromorphic computing
- **Key Findings:** Argues that further inspiration from biological systems (Natural Intelligence) is crucial for developing "physical AI" capable of thriving in real-world dynamic environments. Presents principles separated into three categories: physical substrates, the signals they express/process, and methods to modulate signals. Compares biological principles against relevant AI primitives.
- **Relevance to Project:** **MEDIUM** -- Provides systematic mapping of biological computation principles to AI primitives that can inform agent design.

---

## 9. Biological Degeneracy and Robustness Applied to Software

### 9.1 Degeneracy: A Link Between Evolvability, Robustness and Complexity in Biological Systems

- **Authors:** James M. Whitacre
- **URL:** https://arxiv.org/abs/0910.2586 / https://pmc.ncbi.nlm.nih.gov/articles/PMC2830971/
- **Year:** 2010
- **Biological Mechanism:** Degeneracy -- structurally different elements that can perform the same function
- **Computing Concept:** Robust systems design, fault tolerance
- **Key Findings:** Degeneracy (partial overlap in functioning of multi-functional components) plays a central role in robustness of complex biological systems. Unlike redundancy (identical backup copies), degeneracy involves structurally distinct components that can substitute for each other. Applicable to engineering more flexible and resilient systems, including manufacturing, swarm robotics, and optimization algorithms.
- **Relevance to Project:** **CRITICAL** -- Degeneracy is a fundamentally different approach to fault tolerance than traditional redundancy. Instead of identical backup agents, a degenerate system has diverse agents that can substitute for each other when one fails. This is more resource-efficient and more adaptive than simple replication.

### 9.2 Networked Buffering: A Basic Mechanism for Distributed Robustness

- **Authors:** James M. Whitacre
- **URL:** https://link.springer.com/article/10.1186/1742-4682-7-20
- **Year:** 2010
- **Biological Mechanism:** Distributed buffering in biological networks
- **Computing Concept:** Distributed robustness in complex adaptive systems
- **Key Findings:** Proposes "networked buffering" as a generic mechanism for generating robust traits. Requires agents to be versatile enough to perform more than one functional role AND to have partial overlap in functional capabilities. This allows degenerate systems to produce a distributed systemic response to local perturbations.
- **Relevance to Project:** **HIGH** -- Directly applicable design principle: agents should be versatile (multi-functional) with overlapping capabilities so the system can absorb failures through redistribution rather than simple replacement.

### 9.3 Biological Robustness: Paradigms, Mechanisms, and Systems Principles

- **URL:** https://pmc.ncbi.nlm.nih.gov/articles/PMC3350086/
- **Year:** 2012
- **Biological Mechanism:** Multiple robustness mechanisms (redundancy, degeneracy, modularity, decoupling)
- **Computing Concept:** Systems design principles
- **Key Findings:** Comprehensive review of biological robustness mechanisms. Distinguishes between redundancy (identical copies), degeneracy (functionally similar but structurally different), modularity (compartmentalization), and decoupling (buffering interactions). Each provides different resilience properties.
- **Relevance to Project:** **HIGH** -- Provides a complete toolkit of biological robustness mechanisms that can be individually or collectively applied to agent system design.

### 9.4 Technological and Biological Systems' Resilience: Observations and Learnings

- **URL:** https://link.springer.com/article/10.1007/s00267-025-02193-3
- **Year:** 2025
- **Biological Mechanism:** Biological resilience principles
- **Computing Concept:** Technological system resilience
- **Key Findings:** Reviews mechanisms of biological resilience and proposes how these can be applied to technological systems. Redundancy, plasticity, interconnectivity, and coordination of subunits are crucial for stability.
- **Relevance to Project:** **HIGH** -- Recent cross-disciplinary review directly bridging biological and technological resilience.

---

## 10. Antifragile and Adversarial Resilience

### 10.1 Position: AI Safety Must Embrace an Antifragile Perspective

- **Authors:** Ming Jin et al.
- **URL:** https://arxiv.org/abs/2509.13339
- **Year:** 2025 (ICML 2025)
- **Biological Mechanism:** Immune system strengthening through exposure; hormesis
- **Computing Concept:** AI safety, antifragility, adaptive resilience
- **Key Findings:** Modern AI must adopt an antifragile perspective where the system's capacity to handle rare or OOD events adapts and expands over repeated exposures. Conventional static benchmarks overlook that environments evolve and models can drift into maladaptation. Systems should continuously learn from failures and stress-test themselves.
- **Relevance to Project:** **CRITICAL** -- Antifragility goes beyond self-healing to systems that get STRONGER from stressors. Published at ICML 2025. Directly relevant to designing agents that improve their healing capabilities over time rather than just restoring to baseline.

---

## 11. Embryonic Electronics (Embryonics)

### 11.1 Embryonics: Artificial Cells Driven by Artificial DNA

- **Authors:** Mange, Sanchez, Stauffer, Tempesti, Marchal, Piguet, Sipper
- **URL:** https://link.springer.com/chapter/10.1007/3-540-45443-8_9
- **Year:** ~2000
- **Biological Mechanism:** Embryonic development (multicellular architecture, cell division, cell differentiation)
- **Computing Concept:** Self-repairing and self-replicating FPGA hardware
- **Key Findings:** Four hierarchical levels: molecule (multiplexer-based element), cell (with memory), organism (collection of cells), population (replicating organisms). Cells duplicate by copying their genome and specialize based on position. Implemented as the BioWatch on the BioWall (thousands of FPGAs, touch sensors, LEDs).
- **Relevance to Project:** **HIGH** -- Although hardware-focused, the four-level biological hierarchy (molecule/cell/organism/population) provides a powerful organizational metaphor for multi-agent systems. Agent "differentiation" based on context is directly applicable.

### 11.2 Bio-Inspired Computing Machines with Self-Repair Mechanisms

- **URL:** https://link.springer.com/chapter/10.1007/11613022_13
- **Year:** ~2006
- **Biological Mechanism:** Developmental biology (growth, self-replication, self-repair)
- **Computing Concept:** Reconfigurable computing, bio-inspired hardware
- **Key Findings:** Multicellular organization principles enable computing machines to grow, self-replicate, and self-repair. Based on three principles: multicellular architecture, cellular division, and cellular differentiation.
- **Relevance to Project:** **MEDIUM** -- Extends embryonic principles to general self-repairing systems.

### 11.3 Self-Healing Hardware Systems: A Review

- **URL:** https://www.sciencedirect.com/science/article/abs/pii/S0026269219302782
- **Year:** 2019
- **Biological Mechanism:** Various biological self-healing mechanisms
- **Computing Concept:** Reconfigurable hardware self-repair
- **Key Findings:** Comprehensive review of bio-inspired self-healing in hardware. Covers multiple biological metaphors and their hardware implementations.
- **Relevance to Project:** **MEDIUM** -- Good overview of the hardware dimension; concepts transfer to software agent architectures.

---

## 12. Regenerative Computing

### 12.1 A Comprehensive Conceptual and Computational Dynamics Framework for Autonomous Regeneration Systems

- **Authors:** Tran Nguyen Minh-Thai, Sandhya Samarasinghe, Michael Levin
- **URL:** https://direct.mit.edu/artl/article/27/2/80/106921
- **Year:** 2021 (Artificial Life, MIT Press)
- **Biological Mechanism:** Planarian regeneration, stem cell differentiation
- **Computing Concept:** Autonomous regeneration, neural network-based self-repair
- **Key Findings:** Framework inspired by planarian regeneration -- organisms that can regenerate from any fragment. Represents tissues as Auto-Associative Neural Networks (AANN) with local interactions and stem cells as self-repair networks with long-range interactions. Introduces an "Information Field" -- a mathematical abstraction keeping minimum pattern information accessible by stem cells in extreme damage cases. Achieves complete and accurate regeneration from any damage anywhere in the system.
- **Relevance to Project:** **CRITICAL** -- Planarians are the ultimate model for self-healing: cut them anywhere and they regenerate completely. The "Information Field" concept (distributed knowledge of what the healthy system should look like) is a powerful idea for agent systems. Co-authored by Michael Levin. Published in MIT's Artificial Life journal.

### 12.2 Self-Regenerative Software Components

- **URL:** https://dl.acm.org/doi/10.1145/1036921.1036935
- **Year:** 2003 (ACM Workshop on Survivable and Self-Regenerative Systems)
- **Biological Mechanism:** Biological regeneration
- **Computing Concept:** Self-healing software components, survivable systems
- **Key Findings:** Self-regeneration ensures that a system's vulnerabilities cannot be exploited to the extent that the mission objective is compromised, and that vulnerabilities are eventually removed and system functionality restored. Designed self-healing components that detect object anomalies and reconfigure inter-component interactions.
- **Relevance to Project:** **HIGH** -- Early but important work on self-regenerative software. The distinction between "self-healing" (fixing what broke) and "self-regeneration" (removing the underlying vulnerability) is important.

---

## 13. Nature-Inspired Agent Architectures

### 13.1 BiSNET: A Biologically-Inspired Middleware Architecture for Self-Managing Wireless Sensor Networks

- **Authors:** Boonma, Suzuki
- **URL:** https://www.sciencedirect.com/science/article/abs/pii/S1389128607001636
- **Year:** 2007
- **Biological Mechanism:** Bee colony behavior (food gathering, natural selection, pheromones)
- **Computing Concept:** Middleware, self-managing wireless sensor networks
- **Key Findings:** Each application consists of multiple software agents exploiting biologically-inspired mechanisms: energy exchange, pheromone emission, replication, migration, and death (analogous to a bee colony). The platform enables autonomous adaptation of sleep periods, adaptive data aggregation, and collective self-healing of false positive sensor data. Simple in design, lightweight in memory footprint.
- **Relevance to Project:** **HIGH** -- Complete bio-inspired agent middleware with explicit self-healing capabilities. The agent lifecycle (replication, migration, death) modeled on biological organisms is directly applicable to agent management in our system.

### 13.2 A Nature-Inspired Multi-Agent Framework for Autonomic Service Management

- **URL:** https://www.researchgate.net/publication/224642374
- **Year:** ~2010
- **Biological Mechanism:** Various nature-inspired mechanisms
- **Computing Concept:** Autonomic service management in ubiquitous computing
- **Key Findings:** Multi-agent framework for autonomic service management inspired by natural systems.
- **Relevance to Project:** **MEDIUM** -- Applies nature-inspired multi-agent design to service management.

### 13.3 Biologically-Inspired Concepts for Autonomic Self-Protection in Multiagent Systems

- **URL:** https://link.springer.com/chapter/10.1007/978-3-642-04879-1_22
- **Year:** ~2009
- **Biological Mechanism:** Biological self-protection mechanisms
- **Computing Concept:** Multi-agent system self-protection
- **Key Findings:** Applies biologically-inspired concepts specifically to the self-protection property of multiagent systems.
- **Relevance to Project:** **MEDIUM** -- Self-protection is the complement to self-healing. Agents need both.

### 13.4 A Nature-Inspired Colony of AI Systems with Fast, Detailed, and Organized Learner Agents

- **URL:** https://arxiv.org/html/2504.05365
- **Year:** 2025
- **Biological Mechanism:** Colony organization (ants, bees)
- **Computing Concept:** Multi-agent AI system with specialized learner agents
- **Key Findings:** Proposes a colony-like AI system where learner agents have different specializations (fast, detailed, organized), working together like a biological colony.
- **Relevance to Project:** **MEDIUM** -- Recent work on colony-based AI agent organization with role differentiation.

---

## 14. Biologically-Inspired Autonomic Systems

### 14.1 Bio-Inspired Framework for Autonomic Communication Systems

- **URL:** https://link.springer.com/chapter/10.1007/978-3-540-72693-7_1
- **Year:** ~2007
- **Biological Mechanism:** Multiple biological systems (autonomic nervous system, endocrine system, immune system)
- **Computing Concept:** Autonomic communication networks
- **Key Findings:** Framework integrating multiple biological metaphors for autonomic communication systems. Bio-inspired mechanisms based on Blood Glucose Homeostasis, Chemotaxis, Reaction-Diffusion and Hormone Signaling.
- **Relevance to Project:** **HIGH** -- The integration of MULTIPLE biological systems (not just one) is key. Real organisms use immune + nervous + endocrine systems together. A comprehensive self-healing agent system should likewise combine multiple bio-inspired mechanisms.

### 14.2 Biologically Inspired Self-Governance and Self-Organisation for Autonomic Networks

- **URL:** https://ieeexplore.ieee.org/document/4205332/
- **Year:** 2007
- **Biological Mechanism:** Human autonomic nervous system, insect colonies, flocking
- **Computing Concept:** Autonomic network management
- **Key Findings:** Autonomic network management provides the ability for network devices to cooperatively self-organise and self-govern. Combines multiple biological metaphors: autonomic nervous system for self-management, insect colonies for distributed coordination, flocking for collective behavior.
- **Relevance to Project:** **MEDIUM** -- Demonstrates multi-metaphor biological approach to autonomic systems.

### 14.3 A Biologically Inspired Policy Based Management System for Survivability in Autonomic Networks

- **URL:** https://ieeexplore.ieee.org/document/4550420/
- **Year:** 2008
- **Biological Mechanism:** Evolutionary systems, swarm behavior
- **Computing Concept:** Policy-based autonomic network management
- **Key Findings:** Combines biologically-inspired approaches with policy-based management for network survivability.
- **Relevance to Project:** **MEDIUM** -- Policy-based + bio-inspired is an interesting combination for governing agent behavior.

---

## 15. Self-Healing in Software-Defined Networks

### 15.1 Adaptive and Self-Healing SDNs: Bio-Inspired Intelligence for Resilient Networking

- **URL:** https://link.springer.com/article/10.1007/s41870-025-03027-5
- **Year:** 2025
- **Biological Mechanism:** Swarm intelligence, genetic algorithms, immune systems
- **Computing Concept:** Software-defined network resilience
- **Key Findings:** Integrates multiple bio-inspired AI mechanisms: swarm intelligence for anomaly detection, genetic algorithms for network reconfiguration, and reinforcement learning for adaptive traffic optimization. BISNet framework uses neuromorphic learning for dynamic adaptation and AIS for anomaly detection.
- **Relevance to Project:** **HIGH** -- Demonstrates practical integration of multiple bio-inspired techniques (swarm + genetic + immune + RL) in a single self-healing system. This "ensemble of biological metaphors" approach is valuable.

### 15.2 Bio-Inspired AI for Adaptive and Resilient SDNs: A Self-Healing Approach

- **URL:** https://link.springer.com/article/10.1007/s42044-025-00358-1
- **Year:** 2025
- **Biological Mechanism:** Multiple bio-inspired mechanisms
- **Computing Concept:** SDN self-healing, autonomous optimization, security
- **Key Findings:** Bio-inspired AI-driven self-healing approach for autonomous optimization and security in SDNs.
- **Relevance to Project:** **MEDIUM** -- Additional recent work on bio-inspired SDN self-healing.

---

## 16. Synthesis and Relevance Map

### Key Biological Mechanisms and Their Computing Applications

| Biological Mechanism | Computing Application | Key Papers | Relevance |
|---|---|---|---|
| **Wound Healing** (detect, signal, repair) | Self-healing software architecture | Baqar 2025 (1.1), Multi-Tiered (3.1) | CRITICAL |
| **Immune System** (self/non-self, clonal selection, memory) | Anomaly detection, adaptive defense | AIS Review (2.1), DCA (2.3), Cyber Immune (2.8) | CRITICAL |
| **Homeostasis** (internal balance regulation) | Adaptive agents, concept drift handling | Kelkar 2021 (4.1), Man 2022 (4.2) | CRITICAL |
| **Degeneracy** (diverse components with overlapping function) | Fault tolerance without simple redundancy | Whitacre 2010 (9.1, 9.2) | CRITICAL |
| **Planarian Regeneration** (regrow from any fragment) | Autonomous regeneration with distributed knowledge | Minh-Thai 2021 (12.1) | CRITICAL |
| **Brain Modularity** (specialized cooperating regions) | Modular agent architecture | Webb 2025 (8.1) | CRITICAL |
| **Antifragility/Hormesis** (stress makes stronger) | Adaptive AI safety | Jin 2025 (10.1), Cyber Immune (2.8) | CRITICAL |
| **Autopoiesis** (self-creating/maintaining) | Self-maintaining systems | Towards Autopoietic (5.1), Fernandez (5.3) | HIGH |
| **Swarm Intelligence** (collective, decentralized) | Distributed self-repair | Swarm Robots (7.1), Antetic AI (7.3) | HIGH |
| **Stem Cells** (undifferentiated, capable of becoming any type) | Reconfigurable spare components | BioSymPLe (3.2), Embryonics (11.1) | HIGH |
| **Embryonic Development** (cell division + differentiation) | Self-replicating hardware/software | Mange et al. (11.1) | HIGH |
| **Stigmergy** (indirect coordination via environment) | Agent coordination without central control | CSO (7.6) | HIGH |
| **Endocrine System** (hormone-based signaling) | Distributed adaptive control | Bio Framework (14.1) | MEDIUM |
| **Neural Plasticity** (rewiring after damage) | Self-healing neural networks | Self-Healing NN (8.2) | MEDIUM |

### Architecture Patterns Emerging from the Literature

1. **Multi-Layer Healing Architecture**: Functional layer + healing layer, inspired by wound healing (3.1)
2. **Hierarchical Bio-Levels**: Molecule -> Cell -> Tissue -> Organ -> Organism -> Population, each level with its own healing mechanisms (3.2, 11.1)
3. **Immune-Inspired Multi-Agent**: Sense agent -> Analysis agent -> Adaptive agent -> Healing agent (2.9)
4. **Homeostatic Control Loop**: Monitor internal variables -> Compare to setpoints -> Adjust to maintain balance (4.1)
5. **Degenerate Redundancy**: Diverse agents with overlapping capabilities rather than identical backups (9.1)
6. **Stigmergic Coordination**: Agents leave environmental traces (pheromones) to coordinate healing without central control (7.6, 13.1)
7. **Modular Brain-Inspired**: Specialized modules for conflict detection, state prediction, evaluation, and coordination (8.1)
8. **Information Field**: Distributed representation of "what healthy looks like" accessible for regeneration (12.1)
9. **Controlled Exposure/Vaccination**: Intentionally stress-testing to build stronger defenses (10.1, 2.8)
10. **Autopoietic Self-Maintenance**: Continuous self-creation rather than just repair-on-failure (5.1, 5.3)

### Recommended Reading Priority for the Project

**Tier 1 -- Must Read (directly applicable architecture and frameworks):**
1. Baqar et al. 2025 -- Self-Healing Software: Lessons from Nature (1.1)
2. Rauba et al. 2024 -- Self-Healing ML with H-LLM (1.5)
3. Webb et al. 2025 -- Brain-Inspired Agentic Architecture (8.1)
4. Kelkar 2021 -- Cognitive Homeostatic Agents (4.1)
5. Minh-Thai et al. 2021 -- Autonomous Regeneration Systems (12.1)
6. Whitacre 2010 -- Degeneracy and Robustness (9.1)
7. Jin et al. 2025 -- Antifragile AI Safety (10.1)

**Tier 2 -- Should Read (important patterns and mechanisms):**
8. Autili et al. 2015 -- Biological Immunity and Actor Model (3.5)
9. Greensmith & Aickelin -- Dendritic Cell Algorithm (2.3)
10. Multi-Tiered Bio-Inspired Architecture (3.1)
11. BioSymPLe (3.2)
12. Fernandez 2016 -- Multi-Agent Homeostatic/Autopoietic Modeling (5.3)
13. Man, Damasio, Neven 2022 -- Homeostatic Neural Networks (4.2)
14. BiSNET (13.1)
15. Cyber Immune System (2.8)
16. Dehghani & Levin 2024 -- Bio-inspired AI (1.6)

**Tier 3 -- Background Reading (context and foundations):**
17. Self-Healing Systems Survey (1.2, 1.3, 1.4)
18. Organic Computing (6.1, 6.2)
19. Embryonics (11.1)
20. Swarm Self-Repair (7.1, 7.3)
21. AIS Surveys (2.1, 2.5)
22. Immune Network Theory (2.6)
23. Networked Buffering (9.2)
24. Biological Robustness (9.3)

### Key Design Principles Extracted

1. **Healing is multi-phase**: Detection -> Diagnosis -> Planning -> Execution -> Verification (maps to wound healing stages: hemostasis -> inflammation -> proliferation -> remodeling)
2. **Diversity beats duplication**: Degeneracy (diverse agents with overlapping function) is more robust than simple redundancy (identical copies)
3. **Vulnerability enables adaptation**: Systems that are somewhat exposed to their environment adapt better than fully shielded ones (homeostatic networks)
4. **Local rules produce global healing**: Simple agents following local rules can produce sophisticated system-level self-repair (swarm intelligence)
5. **Stress strengthens**: Controlled exposure to failures improves future resilience (antifragility)
6. **The "healthy template" must be distributed**: A system needs a distributed representation of its desired state to guide regeneration (information field concept)
7. **Multiple biological metaphors are needed**: No single biological mechanism is sufficient; real organisms combine immune + nervous + endocrine + healing systems
8. **Self-healing is continuous, not reactive**: Autopoietic systems are always self-maintaining, not just repairing when broken
9. **Hierarchical organization enables multi-scale healing**: Cell-level, tissue-level, and organ-level healing address different types and scales of damage
10. **Communication can be indirect**: Stigmergy (environment-mediated communication) enables coordination without the overhead and fragility of direct messaging

---

*This document covers 50+ papers and resources at the intersection of biological self-healing and computing/agent systems. It represents the most directly relevant research track for the self-healing agents project.*
