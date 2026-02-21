# Spaced Repetition, User Mastery, and Self-Healing Agent Education

> Research compiled 2026-02-20 for the self-healing agents project.
> Focus: How can a system that heals itself also help its user get better at using it?

---

## Table of Contents

1. [The Science of Spaced Repetition](#1-the-science-of-spaced-repetition)
2. [Modern Spaced Repetition Algorithms](#2-modern-spaced-repetition-algorithms)
3. [Andy Matuschak and the Mnemonic Medium](#3-andy-matuschak-and-the-mnemonic-medium)
4. [Active Recall vs. Passive Review](#4-active-recall-vs-passive-review)
5. [How Users Develop Expertise with Software Tools](#5-how-users-develop-expertise-with-software-tools)
6. [The Paradox of the Active User](#6-the-paradox-of-the-active-user)
7. [Progressive Disclosure in UX Design](#7-progressive-disclosure-in-ux-design)
8. [Desire Paths in Software](#8-desire-paths-in-software)
9. [Detecting What Users Are NOT Using](#9-detecting-what-users-are-not-using)
10. [Nudge Theory Applied to Software Feature Discovery](#10-nudge-theory-applied-to-software-feature-discovery)
11. [Contextual Help vs. Intrusive Tutorials](#11-contextual-help-vs-intrusive-tutorials)
12. [Spaced Repetition Integrated into Tools](#12-spaced-repetition-integrated-into-tools)
13. [How an AI Agent Could Teach Users](#13-how-an-ai-agent-could-teach-users)
14. [Human-AI Collaboration Research](#14-human-ai-collaboration-research)
15. [The Capability-Utilization Gap](#15-the-capability-utilization-gap)
16. [Synthesis: Design Principles for a Teaching Agent](#16-synthesis-design-principles-for-a-teaching-agent)

---

## 1. The Science of Spaced Repetition

### The Forgetting Curve (Ebbinghaus, 1885)

Hermann Ebbinghaus plotted the first forgetting curve in 1885, demonstrating a fundamental property of human memory: in the absence of active review, memory decay is initially rapid and then slows over time. Within one hour, roughly 50% of newly learned information is forgotten. Within 24 hours, about 70% is lost. Within a week, up to 90% can vanish.

The critical insight is that **periodically reviewing material flattens the forgetting curve**, decreasing the rate at which we forget. Each successive review makes the memory more durable, requiring less frequent reinforcement over time.

### The Spacing Effect

The spacing effect is the finding that learning is greater when study sessions are spread out over time rather than massed together. This is one of the most robust findings in cognitive psychology, replicated across hundreds of studies.

A 2025 meta-analysis confirmed spaced practice benefits mathematics learning (effect size g > 0.40), while a 2024 systematic review of spaced digital education in health professions reported improvements in knowledge and clinical skills.

### Core Mechanism

Spaced repetition leverages two cognitive phenomena:
- **The spacing effect**: Distributed practice leads to better long-term retention than massed practice
- **The testing effect**: The act of retrieving information strengthens the memory trace more than passive re-exposure

Sources:
- [Abridged History of Spaced Repetition (Expertium)](https://expertium.github.io/History.html)
- [Spaced Repetition Calculator](https://whentoreview.com/en/spaced-repetition-calculator/)
- [SM-2 Algorithm Explained (Tegaru)](https://tegaru.app/en/blog/sm2-algorithm-explained)
- [Anki Use and Academic Performance in Medical Education](https://link.springer.com/article/10.1007/s40670-026-02643-5)

---

## 2. Modern Spaced Repetition Algorithms

### The Leitner System (1972)

Sebastian Leitner, a German science journalist, proposed a box-based flashcard system in 1972. Cards are organized into boxes by proficiency level:
- **Box 1**: Cards the learner frequently gets wrong (studied daily)
- **Box 2**: Cards rarely missed (studied every 3 days)
- **Box 3**: Well-known cards (studied every 5 days)

Correct answers promote cards to higher boxes; mistakes demote them to Box 1. The system concentrates study time on the most difficult material while spacing easy material further apart.

### SM-2 (SuperMemo Algorithm, 1987)

SM-2 was developed by Piotr Wozniak in 1987 and remains the basis for Anki and other popular tools. It uses:

**Ease Factor (EF)**: A per-card multiplier that adjusts based on recall quality:
```
EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
```
where `q` is quality of recall (0-5 scale).

**Limitations of SM-2:**
- Fixed formulas that don't adapt to individual learning patterns
- Quality ratings are subjective and noisy
- Handles delayed reviews poorly
- No concept of retrievability as a continuous probability

### FSRS (Free Spaced Repetition Scheduler, 2022-present)

FSRS represents a major leap forward, using machine learning rather than fixed formulas. Developed by the open-spaced-repetition community, it was integrated natively into Anki in 2023---the first time since SM-2's development that a new algorithm was widely adopted.

**The DSR Memory Model:**

FSRS models memory using three interconnected variables:

1. **Difficulty (D)**: The inherent complexity of information that determines how quickly stability grows after reviews.

2. **Stability (S)**: Storage strength of memory. Defined as "the time, in days, required for Retrievability to decrease from 100% to 90%." A card with S=365 takes a full year for recall probability to drop to 90%.

3. **Retrievability (R)**: The probability that a person can successfully recall information at a given moment. Fluctuates daily based on time elapsed and stability.

**Key Advantages over SM-2:**
- Uses machine learning to analyze individual review history
- FSRS-6 uses 21 parameters (vs. SM-2's fixed formula)
- Users need **20-30% fewer reviews** to achieve equivalent retention
- Handles delayed reviews significantly better
- Default parameters trained on hundreds of millions of reviews from ~10,000 users
- Users can optimize parameters based on their own review history

### SuperMemo (SM-17, SM-18)

Piotr Wozniak continued developing algorithms beyond SM-2. Modern SuperMemo versions use sophisticated models but remain proprietary. SuperMemo also pioneered **incremental reading** (1999), which applies spaced repetition principles to reading and knowledge management---not just flashcards.

Sources:
- [FSRS GitHub Repository](https://github.com/open-spaced-repetition/free-spaced-repetition-scheduler)
- [ABC of FSRS](https://github.com/open-spaced-repetition/fsrs4anki/wiki/abc-of-fsrs)
- [The Algorithm (FSRS Wiki)](https://github.com/open-spaced-repetition/fsrs4anki/wiki/The-Algorithm)
- [Leitner System (Wikipedia)](https://en.wikipedia.org/wiki/Leitner_system)
- [SuperMemo History](https://www.supermemo.com/en/blog/the-true-history-of-spaced-repetition)

---

## 3. Andy Matuschak and the Mnemonic Medium

### The Core Idea: Programmable Attention

Andy Matuschak's central insight is that spaced repetition systems are fundamentally tools for **programming your attention**. He describes them as "cron for your mind"---they automatically arrange and present tasks according to expanding schedules, orchestrating repeated attention over time across hundreds of tiny tasks that are too many to manage by hand.

This framing goes far beyond flashcards. The SRS mechanism can be abstracted into three components:
1. A **priority queue of microtasks** (in memory systems: due dates)
2. An **interactive presentation environment** (the review interface)
3. **Feedback mechanisms** that modify task priority (remembering/forgetting adjusts intervals)

### The Mnemonic Medium

The mnemonic medium, first implemented in [Quantum Country](https://quantum.country/) (a primer on quantum computing co-authored with Michael Nielsen), integrates spaced repetition prompts directly into narrative prose.

**Key principles:**
- **Context integration**: Unlike traditional SRS where prompts are decontextualized, the mnemonic medium maintains narrative anchoring---readers recall details within the framework of the original text
- **Expert-authored prompts**: Rather than expecting readers to generate effective prompts themselves (a documented difficulty), expert authors craft targeted questions aligned with pedagogical intent
- **Emotional connection**: The system prioritizes emotional engagement and safety---readers feel supported knowing review sessions will reinforce understanding already begun during reading
- **Lightweight interactions**: Quick prompts designed for minimal friction rather than elaborate testing
- **Simple application prompts**: The medium can help readers apply what they've learned, not just recall facts, pushing spaced repetition up the cognitive ladder from rote memorization toward genuine understanding

### Beyond Memorization: Application, Synthesis, and Creation

Matuschak argues that spaced repetition can prompt higher-order thinking:
- **Application**: "Apply utilitarianism to a recent decision" rather than "Define utilitarianism"
- **Synthesis**: Connecting ideas across domains
- **Creation**: Generating novel ideas and solutions

The challenge is authorial bias: when you write your own prompts, you've already worked through the reasoning. The mnemonic medium solves this by having expert authors craft prompts that remain genuinely challenging for readers.

### "Spaced Everything"

Matuschak's broader vision, termed **"Spaced Everything"**, extends the SRS mechanism to:
- Habit development and behavioral change
- Incremental reading and thoughtful text engagement
- Inbox management (email, to-do lists, reading queues)
- Practice routine optimization
- Developing half-formed ideas ("inklings") over time

### Orbit Platform

[Orbit](https://github.com/andymatuschak/orbit) is Matuschak's experimental platform for exploring memory augmentation and programmable attention. It is a research vehicle for expanding the mnemonic medium beyond Quantum Country, allowing any author to embed spaced repetition prompts in web content.

Sources:
- [Mnemonic Medium (Matuschak Notes)](https://notes.andymatuschak.org/Mnemonic_medium)
- [Programmable Attention (Matuschak Notes)](https://notes.andymatuschak.org/Programmable_attention)
- [SRS Can Be Used to Program Attention](https://notes.andymatuschak.org/Spaced_repetition_systems_can_be_used_to_program_attention)
- [SRS Can Prompt Application, Synthesis, and Creation](https://notes.andymatuschak.org/Spaced_repetition_memory_systems_can_be_used_to_prompt_application,_synthesis,_and_creation)
- [How to Write Good Prompts (Matuschak)](https://andymatuschak.org/prompts/)
- [Orbit GitHub](https://github.com/andymatuschak/orbit)
- [Quantum Country](https://quantum.country/)

---

## 4. Active Recall vs. Passive Review

### The Fundamental Distinction

- **Passive review**: Re-reading notes, highlighting textbooks, watching lectures again. Creates a "fluency illusion"---material feels familiar but hasn't been encoded for retrieval.
- **Active recall (retrieval practice)**: Deliberately trying to remember information without looking at it. Forces the brain to reconstruct knowledge, strengthening neural pathways.

### The Evidence

The evidence strongly favors active recall:

- **Roediger and Karpicke (2006)**: Students who practiced retrieval retained **80%** of material after a week, compared to **34%** for passive study.
- **2024 Cognitive Science study**: Students using active recall scored an **average 23% higher** on final exams compared to those relying primarily on re-reading.
- **Testing effect**: The act of retrieving information from memory strengthens the memory trace more than re-exposure, even when retrieval is unsuccessful.

### Why Passive Review Fails

Passive review creates **recognition** (feeling of familiarity when re-encountering material) rather than **recall** (ability to generate the answer independently). Recognition is easier but far less useful in practice. Students frequently overestimate their knowledge because recognition feels like mastery.

### Combining Active Recall with Spaced Repetition

The combination is synergistic: testing yourself repeatedly over increasing intervals (1 day, 3 days, 1 week, 2 weeks) produces retention rates **above 80% even months later**. Neuroscience research confirms that spaced active retrieval produces stronger and more durable memory traces than any other study strategy.

**Relevance to our project**: If we want users to actually learn commands and workflows, we cannot rely on showing them documentation (passive). We need to create situations where they actively retrieve and apply knowledge.

Sources:
- [Spaced Repetition and Active Recall Improves Academic Performance (ScienceDirect)](https://www.sciencedirect.com/science/article/abs/pii/S187712972500231X)
- [Active Recall vs Passive Learning (Memgrain)](https://medium.com/@memgrain/active-recall-vs-passive-learning-why-rereading-is-a-waste-of-time-7c91b109b6d2)
- [Memory Strategies for Academic Success (Gwenin)](https://gwenin.com/2025/12/08/active-recall-and-spaced-revision/)

---

## 5. How Users Develop Expertise with Software Tools

### The Dreyfus Model of Skill Acquisition (1980)

Stuart and Hubert Dreyfus identified five stages of skill development:

| Stage | Characteristics | Decision Making |
|-------|----------------|-----------------|
| **Novice** | Relies on context-free rules, step-by-step instructions. Slow, deliberate. | Rule-following |
| **Advanced Beginner** | Recognizes situational patterns from experience. Still needs guidelines. | Situational recognition |
| **Competent** | Can plan and prioritize. Sees actions in terms of goals. Feels responsible for outcomes. | Conscious deliberation |
| **Proficient** | Sees situations holistically. Knows what's important intuitively. Analytical in deciding what to do. | Intuitive assessment, analytical decision |
| **Expert** | Acts intuitively without conscious deliberation. "Does what normally works." | Intuitive |

**Key insight**: Experience is required to move up the scale. Formal education and training provide the foundation, but it is through **practice, reflection, and exposure to diverse situations** that learners progress toward expertise.

**Expert performance**: "When things are proceeding normally, experts don't solve problems and don't make decisions; they do what normally works." ---Dreyfus & Dreyfus

### Carroll's Training Wheels (1984)

John M. Carroll's "training wheels" research demonstrated that **limiting initial feature exposure improves learning**:
- Users given access to a restricted set of core features learned faster
- When advanced features were later unlocked, these users performed better than those who had full access from the start
- The training wheels approach focused users' attention and helped them build more complete mental models
- A training interface that made typical error states "unreachable" eliminated common new-user learning problems

**Relevance to our project**: A self-healing agent should behave like training wheels---restricting complexity initially, then progressively revealing capabilities as the user demonstrates competence.

### The Power Law of Practice

User expertise with software tools follows a power law: initial learning is rapid, then improvement becomes increasingly incremental. This matches the forgetting curve in reverse---the first few uses are critical for establishing whether a feature becomes part of the user's repertoire.

Sources:
- [Dreyfus Model (CABEM)](https://www.cabem.com/dreyfus-model-of-skill-acquisition/)
- [Dreyfus Model (Wikipedia)](https://en.wikipedia.org/wiki/Dreyfus_model_of_skill_acquisition)
- [Training Wheels Interface (IxDF)](https://www.interaction-design.org/literature/book/the-glossary-of-human-computer-interaction/training-wheels-interface)
- [Training Wheels in a User Interface (Carroll, ACM)](https://dl.acm.org/citation.cfm?id=358218)
- [Training Wheels User Interface (NNGroup)](https://www.nngroup.com/articles/training-wheels-user-interface/)

---

## 6. The Paradox of the Active User

### The Core Observation (Carroll & Rosson, 1987)

The "paradox of the active user" was identified by John M. Carroll and Mary Beth Rosson at IBM's User Interface Institute in the early 1980s:

> **Users never read manuals. They start using the software immediately.** They are motivated to get started and get their immediate task done. They don't care about the system as such and don't want to spend time up front on getting established, set up, or going through learning packages.

### Why It's a Paradox

Users **would save time in the long term** by taking initial time to learn the system and optimize their setup. But **people never behave that way in the real world**. This creates a persistent gap between tool capability and user utilization.

### Two Sub-Paradoxes

1. **Production Paradox**: Users want to produce output immediately. Every moment spent learning feels like wasted time, even when learning would make future production faster.

2. **Assimilation Paradox**: Users try to assimilate new tools to their existing knowledge and workflows. They interpret new features through the lens of what they already know, which limits their ability to discover genuinely novel capabilities.

### Design Implications

Carroll and Rosson concluded that we "cannot allow engineers to build products for an idealized rational user." Systems must accommodate users' preference for immediate engagement. This led to:

- **Minimalist instruction**: Instead of comprehensive manuals, provide the minimum needed to start
- **Training wheels interfaces**: Block error-prone operations during early usage
- **Error recovery**: Make it easy to undo mistakes rather than preventing them

### Relevance to Self-Healing Agents

This is perhaps the single most important finding for our project. **Users will not read our documentation. They will not explore our commands. They will not watch tutorials.** They will use the first approach that works and repeat it indefinitely, even if better approaches exist. Any teaching mechanism we build must work *within* this reality, not against it.

Sources:
- [Paradox of the Active User (NNGroup)](https://www.nngroup.com/articles/paradox-of-the-active-user/)
- [Paradox of the Active User (ResearchGate PDF)](https://www.researchgate.net/publication/262322669_Paradox_of_the_active_user)
- [Paradox of the Active User (Laws of UX)](https://lawsofux.com/paradox-of-the-active-user/)
- [Onboarding and the Active User Paradox (Krystal Higgins)](https://www.kryshiggins.com/active-user-paradox/)

---

## 7. Progressive Disclosure in UX Design

### Definition

Progressive disclosure is a UX technique that **defers advanced features and information to secondary interface components**, keeping essential content in the primary UI while making advanced content available upon request.

### Benefits

Progressive disclosure improves three of usability's five components:
1. **Learnability**: Novice users see fewer options, reducing initial cognitive load
2. **Efficiency of use**: Smaller initial displays save time by avoiding scans past rarely-used features
3. **Error rate**: Fewer exposed options means fewer opportunities for mistakes

### Implementation Strategies

- **Staged onboarding**: Limit options during initial use, reveal features over time
- **Multiple screens over one screen**: Reduce cognitive load per interaction
- **Contextual revelation**: Show features when context suggests they'd be useful
- **User-initiated disclosure**: Let users expand into advanced features when ready

### Critical Design Consideration

The split between initial and secondary features must be carefully calibrated:
- Disclose everything users **frequently need** upfront
- But avoid putting **too many options** in the primary view
- The wrong split either overwhelms novices or frustrates experts

### Application to AI Agents

An AI agent could implement progressive disclosure by:
- Initially responding with simple, direct answers
- Mentioning the existence of shortcuts/commands only when relevant
- Gradually introducing advanced features as the user demonstrates basic competence
- Allowing users to "pull" more capability when they're ready

Sources:
- [Progressive Disclosure (IxDF)](https://www.interaction-design.org/literature/topics/progressive-disclosure)
- [Progressive Disclosure (NNGroup)](https://www.nngroup.com/articles/progressive-disclosure/)
- [Progressive Disclosure Examples (Userpilot)](https://userpilot.com/blog/progressive-disclosure-examples/)

---

## 8. Desire Paths in Software

### The Concept

In physical spaces, desire paths are worn trails that appear where people actually walk, regardless of where sidewalks were built. In software, desire paths represent **user behaviors that deviate from the intended flow**, reflecting users' actual preferences and goals.

### How Desire Paths Manifest in Software

- Users creating spreadsheets to track things the software should track
- Copy-pasting between applications instead of using integrations
- Using search instead of navigating menus
- Creating personal naming conventions or folder structures
- Writing scripts or macros to automate repetitive tasks
- Using features in unintended ways (e.g., using a comments field for notes)

### Detection Methods

- **Behavioral analytics**: Track actual user flows vs. designed flows
- **Support tickets**: Patterns in what users ask for reveal unmet needs
- **Session recordings**: Watch how users actually navigate
- **Custom workarounds**: Any manual process a user creates to compensate for missing features

### Application to Self-Healing Agents

Desire paths are **the signal our system should detect**. When a user:
- Repeats a multi-step manual process
- Asks the same question in different ways
- Creates workarounds for missing functionality
- Uses a verbose approach when a shortcut exists

...the system should recognize this as a desire path and respond by either:
1. Creating the shortcut (self-healing)
2. Teaching the user the existing shortcut (user education)
3. Both

Sources:
- [Desire Paths in Software (Command.ai)](https://www.command.ai/blog/desire-paths/)
- [What Desire Paths Teach Us About UX (Medium)](https://medium.com/design-bootcamp/what-desire-paths-teach-us-about-ux-design-3aa6eeb56dff)
- [Desire Paths in Digital Experience (FullStory)](https://www.fullstory.com/blog/desire-paths-digital-experience/)

---

## 9. Detecting What Users Are NOT Using

### The Scale of the Problem

- **80% of features** in the average software product are rarely or never used
- **78% of employees** admit they lack necessary expertise to utilize their daily tools effectively
- **70% of software features** remain unused by customers
- Paying for unused features lowers perceived value and affects renewal willingness

### Detection Approaches

**Feature Adoption Rate**: Tracks the percentage of users engaging with a specific feature post-release. Measure both:
- **Breadth of adoption**: How widely a feature has been adopted across the user base
- **Depth of adoption**: How often key user types actually use the feature

**Usage Analytics**: Tag features and key events users are expected to perform, then collect engagement data to identify gaps between available and used functionality.

**Feature Utilization Analysis**: Discover which capabilities are sitting idle, providing data for both right-sizing (reducing unnecessary features) and training (teaching users about valuable unused features).

### Addressing the Gap

- **Coordinate announcements**: Surface features at the right moment with in-app guidance
- **Track usage data**: Continuously optimize which features get highlighted
- **Contextual nudges**: Introduce unused features when they would solve the user's current problem
- **Measure impact**: Track whether nudges actually change behavior

### Relevance to Our Project

An AI agent has a unique advantage here: it can observe every interaction and detect not just what the user does, but **what they don't do**. If a user consistently types out long commands when a shortcut exists, or manually performs tasks that could be automated, the agent can identify this gap and act on it.

Sources:
- [Product & User Adoption Metrics (Whatfix)](https://whatfix.com/blog/product-adoption-metrics/)
- [Feature Adoption (Pendo)](https://www.pendo.io/glossary/feature-adoption/)
- [Product Feature Analysis (Userpilot)](https://userpilot.com/blog/product-feature-analysis/)

---

## 10. Nudge Theory Applied to Software Feature Discovery

### What is Nudge Theory?

Nudge theory (Thaler & Sunstein, 2008) proposes that people's decisions and behaviors can be influenced in predictable ways by **small changes in how choices are presented**. A nudge preserves freedom of choice while making the desired behavior easier or more salient.

### 23 Mechanisms of Nudging (Caraban et al., CHI 2019)

Research identified 23 distinct mechanisms of nudging in HCI, grouped into 6 categories, leveraging 15 different cognitive biases. Key mechanisms include:

- **Default options**: Pre-selecting the recommended action
- **Framing**: Presenting the same information in a more compelling way
- **Social proof**: "87% of users who do X also do Y"
- **Anchoring**: Providing a reference point that influences subsequent judgment
- **Salience**: Making important features more visually prominent
- **Simplification**: Reducing friction for desired behaviors

### Hallmarks of a Well-Crafted Nudge

1. **Simplicity**: Reduce friction by presenting the easiest path for desired behavior
2. **Visibility**: Position reminders or cues where people will see them naturally
3. **Alignment**: Match the nudge with organizational/user priorities
4. **Non-coerciveness**: Preserve user autonomy---nudges suggest, not force

### Application to AI Agents

An AI agent can implement nudges as:
- "I noticed you've typed this command 5 times. Did you know you can save it as `/shortcut`?"
- Offering the optimized version alongside the user's current approach
- Gradually making the efficient path more visible without blocking the familiar one
- Using social proof: "Most users who work with X find the `/batch` command helpful"

### Limitations

Nudges alone cannot replace training and consistent communication. Nudge-based behavioral shifts may not last if they aren't backed by deeper understanding. This is where spaced repetition comes in---the nudge creates the initial exposure, and spaced reinforcement ensures retention.

Sources:
- [23 Ways to Nudge (ACM CHI)](https://dl.acm.org/doi/fullHtml/10.1145/3290605.3300733)
- [Nudge Goes to Silicon Valley (Taylor & Francis)](https://www.tandfonline.com/doi/full/10.1080/17530350.2023.2261485)
- [Smart Nudges to Enhance UX (Apxor)](https://www.apxor.com/blog/a-guide-to-using-smart-nudges-to-enhance-user-experience)
- [Nudge Theory (Whatfix)](https://whatfix.com/blog/nudge-theory/)

---

## 11. Contextual Help vs. Intrusive Tutorials

### The Research Verdict

**Contextual help (pull revelations) significantly outperforms tutorials (push revelations).**

### Why Tutorials Fail

Three mechanisms undermine tutorial effectiveness:

1. **Unwanted interruption**: Users experience the paradox of the active user---they want immediate productivity, not preparation. Most skip tutorials entirely.
2. **Memory limitations**: Information presented out of context is quickly forgotten. Users cannot retain multi-step procedures without practice, and tutorials rarely require application.
3. **Friction**: Dismissing tutorials requires effort, and users often cannot relocate them when memory fails later.

**Tutorials don't result in better task performance** and fail to achieve their intended purpose.

### Why Contextual Help Works

Contextual help is triggered by **signals that the user would benefit from information at that moment**. This aligns with just-in-time learning principles:
- People forget 50% of what they learn within an hour
- JIT learning combats this through small, frequent reinforcements
- 49% of professionals seek just-in-time learning (LinkedIn)
- Contextual learning enables immediate application, which strengthens retention

### Five Design Recommendations (NNGroup)

1. **Enable easy dismissal AND recall**: Users need to hide irrelevant help but find it again later
2. **Implement progressive disclosure**: Signal help availability without overwhelming
3. **Eliminate memorization requirements**: Display help alongside each workflow step
4. **Avoid redundant explanations**: Skip conventions; focus on genuinely complex features
5. **Research user journeys**: Conduct task analysis to identify optimal help-triggering moments

### Application to Self-Healing Agents

The agent should never:
- Show a long tutorial on first use
- Interrupt the user's workflow with feature tours
- Dump all available commands at once

The agent should:
- Detect when a user is struggling and offer relevant help
- Surface capabilities at the moment they would save the user time
- Make help dismissible but easily re-discoverable
- Use the user's current context to provide targeted assistance

Sources:
- [Onboarding Tutorials vs. Contextual Help (NNGroup)](https://www.nngroup.com/articles/onboarding-tutorials/)
- [Contextual Help UX (Chameleon)](https://www.chameleon.io/blog/contextual-help-ux)
- [Just-in-Time Learning (Spekit)](https://www.spekit.com/blog/just-in-time-learning)
- [Building a Contextual Help System (Command.ai)](https://www.command.ai/blog/contextual-help/)

---

## 12. Spaced Repetition Integrated into Tools

### Beyond Flashcard Apps

The traditional model of spaced repetition (dedicated flashcard apps like Anki) requires users to maintain a separate practice habit. This creates a significant adoption barrier. Modern approaches embed spaced repetition directly into workflows.

### SuperMemo's Incremental Reading (1999)

Piotr Wozniak's incremental reading was the first major attempt to integrate spaced repetition into a broader knowledge workflow:
- Users import texts they want to learn from
- Tools bookmark reading positions and automatically schedule revisits
- Key points are extracted and converted to flashcards over time
- The spaced repetition algorithm manages both the reading queue and the review queue

### Digital Adoption Platforms (DAPs)

Platforms like Whatfix embed reinforcement directly into the applications employees use every day:
- Walking new hires through an HR workflow on day one
- Resurfacing that same process a week later to reinforce recall
- Triggered contextually rather than on a fixed schedule
- Step-by-step walkthroughs that can be repeated at scheduled intervals

### AI-Enhanced Spaced Repetition

Recent systems like LECTOR incorporate concept-based prioritization and adaptive difficulty estimation, using LLMs to:
- Generate review prompts from learning material
- Assess the quality of user responses
- Adjust difficulty based on demonstrated understanding
- Prioritize concepts based on their importance and interconnections

### Obsidian Spaced Repetition Plugins

The note-taking tool Obsidian has popular plugins that turn notes into spaced repetition items, allowing users to review their own knowledge base on a schedule. This represents a middle ground between dedicated flashcard apps and fully embedded learning.

Sources:
- [Incremental Reading (Wikipedia)](https://en.wikipedia.org/wiki/Incremental_reading)
- [SuperMemo Method](https://www.supermemo.com/en/supermemo-method)
- [Spaced Learning (Whatfix)](https://whatfix.com/blog/spaced-learning/)
- [AI-Enhanced Spaced Repetition (Academia)](https://www.academia.edu/143846432/AI_Enhanced_Spaced_Repetition_Integrating_the_Ebbinghaus_Forgetting_Curve_and_SM_2_Scheduling_for_English_Vocabulary_Learning)
- [Obsidian Spaced Repetition Plugins](https://www.obsidianstats.com/posts/2025-05-01-spaced-repetition-plugins)

---

## 13. How an AI Agent Could Teach Users

### The Unique Advantage of AI Agents

AI agents have capabilities that traditional software education approaches lack:
- **Observation**: They can monitor every interaction pattern
- **Context awareness**: They know what the user is trying to do
- **Natural language**: They can explain things conversationally
- **Personalization**: They can adapt to individual users
- **Timing**: They can choose when to teach based on user state

### The Teaching Cycle for Detected Patterns

When the agent detects a user repeating a manual process:

1. **Observe**: Track the pattern silently. Don't intervene on first occurrence.
2. **Confirm**: On second/third occurrence, note the pattern with high confidence.
3. **Create**: Generate the automation (self-healing) and/or identify the existing shortcut.
4. **Introduce**: At the right moment (not mid-task), suggest the better approach.
5. **Reinforce**: Use spaced repetition principles to remind the user:
   - First reminder: Same session or next day
   - Second reminder: 3 days later
   - Third reminder: 1 week later
   - Fourth reminder: 2 weeks later (if still not adopted)
6. **Verify**: Track whether the user adopts the new approach. If yes, stop reminding. If no, try a different framing.

### Teaching Strategies by User Stage (Dreyfus-Aligned)

| User Stage | Agent Behavior |
|------------|---------------|
| **Novice** | Provide explicit rules and step-by-step guidance. Use training wheels---limit exposed commands. |
| **Advanced Beginner** | Introduce contextual tips based on observed patterns. Show shortcuts when relevant. |
| **Competent** | Suggest workflow optimizations. Introduce automation capabilities. |
| **Proficient** | Offer advanced customization. Suggest combinations of features. |
| **Expert** | Get out of the way. Respond to questions but don't proactively teach. |

### The "Teaching Moment" Framework

A teaching moment occurs when:
- The user just completed a task that could have been done faster
- The user is about to do something the agent knows they'll need to repeat
- The user explicitly asks "how do I..."
- The user makes an error that reveals a misunderstanding
- The user pauses (suggesting they're thinking about what to do next)

### GitHub Copilot's Agent Skills (December 2025)

GitHub introduced "Agent Skills"---folders containing instructions, scripts, and resources that Copilot automatically loads when relevant to a prompt. This represents a pattern where the tool teaches itself about the user's specific context, which is complementary to teaching the user about the tool.

Sources:
- [AI in User Onboarding (Whatfix)](https://whatfix.com/blog/ai-user-onboarding/)
- [AI Agents in Corporate Training (Naitive)](https://blog.naitive.cloud/ai-agents-corporate-training-trends-2025/)
- [Using AI Agents in Organizations (WEF)](https://www.weforum.org/stories/2025/12/ai-agents-onboarding-governance/)
- [DAPs for AI Agent Training (Usetiful)](https://blog.usetiful.com/2025/02/how-daps-can-help-you-train-and-implement-ai-agents.html)

---

## 14. Human-AI Collaboration Research

### When Human-AI Collaboration Works Best

Research from MIT Sloan and Carnegie Mellon shows:
- Human-AI combinations succeed most with tasks where **humans outperform AI alone**
- **Content creation tasks** with generative AI show the strongest collaborative gains
- Example: In bird classification, humans achieved 81% accuracy, AI alone 73%, but the **combination hit 90%**

### Critical Success Factors

Human-AI collaboration effectiveness depends on:
- **Antecedents**: Trust, AI capabilities, organizational context, user expertise
- **Mediators**: Cognitive alignment, explanation quality, emotional engagement
- **Moderators**: User attitudes, task complexity, transparency, ethics

### User Expertise Matters Enormously

People who struggle with decision-making improve their outcomes more when using **transparent AI models** that show moderate complexity. They can learn from AI decision-making rules to improve their own independent decision-making.

This means: **the way an AI explains its reasoning teaches the user to think better**, not just to get better answers.

### The Collaboration Gap

A 2024 systematic review found that most common interaction patterns show **limited human roles** (merely supervising AI predictions). More dynamic interactions exist but are rare. The frontier is "co-creation"---humans and AI blending intuition and computation.

### Collaborative AI Literacy

A 2025 study validated scales for "Collaborative AI Literacy" and "Collaborative AI Metacognition"---the skills needed to effectively collaborate with AI. This suggests that **learning to use AI well is itself a skill** that can be developed through practice and feedback.

Sources:
- [When Humans and AI Work Best Together (MIT Sloan)](https://mitsloan.mit.edu/ideas-made-to-matter/when-humans-and-ai-work-best-together-and-when-each-better-alone)
- [AI Can Strengthen Human Collaboration (CMU)](https://www.cmu.edu/news/stories/archives/2025/october/researchers-explore-how-ai-can-strengthen-not-replace-human-collaboration)
- [Complementarity in Human-AI Collaboration (Taylor & Francis)](https://www.tandfonline.com/doi/full/10.1080/0960085X.2025.2475962)
- [Collaborative AI Literacy Scales (Taylor & Francis)](https://www.tandfonline.com/doi/full/10.1080/10447318.2025.2543997)
- [Human-AI Collaboration Taxonomy (Frontiers)](https://www.frontiersin.org/journals/computer-science/articles/10.3389/fcomp.2024.1521066/full)

---

## 15. The Capability-Utilization Gap

### The Problem

There is a persistent and well-documented gap between what AI tools can do and what users actually use them for:

- **92% of companies** plan to grow AI budgets, but **only 1% consider themselves mature** in AI adoption
- Capability building is **falling short of ambition**: nearly half of organizations report technical skill gaps
- Investment in training has **softened** while confidence in training as the primary path to fluency is **down**
- **Less than half** of US students and global educators say they know a lot about AI
- **78% of employees** lack expertise to utilize their daily tools effectively

### Root Causes

1. **The Active User Paradox**: Users optimize for immediate production, not long-term learning
2. **Prompt Engineering Gap**: Users input poorly structured prompts and get poor results, leading them to underestimate the tool's capabilities
3. **Mental Model Mismatch**: Users bring mental models from previous tools that don't apply to AI
4. **Feature Overload**: Too many capabilities overwhelm users into using only the basics
5. **Training Approaches Don't Stick**: Traditional training methods don't help employees retain or apply complex skills

### What Works

- **Task-level intelligence mapping**: Identifying which tasks need human judgment vs. AI augmentation
- **Human-in-the-loop processes**: 71% of employees prefer AI-generated content to be reviewed by a human
- **Contextual, embedded learning**: Training within the workflow rather than separate courses
- **Spaced reinforcement**: Revisiting skills over expanding intervals

### SaaS Onboarding Research

The SaaS industry has extensive data on the capability-utilization gap:
- **90% of users churn** if they don't understand a product's value within the first week
- Products with **interactive onboarding** see 50% higher activation rates than static tutorials
- **92% of top SaaS apps** use some form of in-app guidance during onboarding
- Interactive product tours increase **feature adoption by 42%**
- The key metric is **Time-to-First-Value (TTFV)**: how quickly users reach their first success

Sources:
- [Gen AI Enterprise Adoption Report (Wharton)](https://ai.wharton.upenn.edu/wp-content/uploads/2025/10/2025-Wharton-GBK-AI-Adoption-Report_Full-Report.pdf)
- [New Tools for Workforce Training (HBR)](https://hbr.org/2025/12/the-new-tools-that-can-improve-workforce-training)
- [SaaS Onboarding Best Practices (Candu)](https://www.candu.ai/blog/best-saas-onboarding-examples-checklist-practices-for-2025)
- [Feature Adoption Best Practices (Whatfix)](https://whatfix.com/blog/feature-adoption/)

---

## 16. Synthesis: Design Principles for a Teaching Agent

Drawing from all research above, here are the design principles for a self-healing agent that also teaches its user.

### Principle 1: Respect the Active User Paradox

Users will not read documentation. They will not explore features. They will not watch tutorials. **Design for this reality.**

- Never present upfront tutorials or feature tours
- Never interrupt the user's workflow to teach
- Accept that users will discover features through need, not curiosity

### Principle 2: Use Programmable Attention (Matuschak)

Treat the agent's teaching capacity as a spaced repetition system for user attention:

```
Priority Queue: [skill gaps ordered by impact]
Presentation: [contextual nudges at the right moment]
Feedback Loop: [did the user adopt the suggestion?]
```

The agent maintains a mental model of what the user knows and doesn't know, scheduling "teaching moments" with expanding intervals.

### Principle 3: Detect Desire Paths, Then Pave Them

When users create workarounds:
1. **Detect** the pattern (repeated manual process, verbose command, copy-paste workflows)
2. **Create** the shortcut (self-healing: generate the automation)
3. **Introduce** the shortcut (user education: teach the better approach)
4. **Reinforce** with spaced repetition (remind them at expanding intervals)

### Principle 4: Contextual Help, Never Tutorials

All teaching must be:
- **Triggered by context**: User just did something that reveals a learning opportunity
- **Immediately dismissible**: Never block the workflow
- **Re-discoverable**: User can find the tip again when they need it
- **Actionable**: Show the exact command or workflow, not abstract concepts

### Principle 5: Active Recall Over Passive Display

Don't just show users the answer. Create opportunities for them to retrieve it:
- After teaching a shortcut, the next time the user starts the manual process, **prompt them** to recall the shortcut instead of just doing it for them
- "Last time you used `/batch` for this---want to try that again, or would you prefer the manual approach?"
- This active retrieval strengthens the memory trace far more than passively seeing the shortcut executed

### Principle 6: Progressive Disclosure Aligned with Dreyfus

Match teaching complexity to user expertise:
- **Week 1**: Only show basic commands. Training wheels mode.
- **Week 2-4**: Introduce shortcuts when the user demonstrates familiarity with basics.
- **Month 2+**: Suggest advanced workflows, customization, automation.
- **Expert users**: Minimize proactive teaching. Respond to questions.

### Principle 7: The FSRS-Inspired Reinforcement Schedule

Adapt spaced repetition parameters to user education:

| Variable | Meaning in Our Context |
|----------|----------------------|
| **Stability** | How well the user has internalized a command/workflow |
| **Retrievability** | Probability the user will use the optimal approach unprompted |
| **Difficulty** | Complexity of the command/workflow relative to the user's current level |

Schedule reminders using expanding intervals:
- **First reminder**: Same session (if applicable) or next interaction
- **Second reminder**: 2-3 interactions later
- **Third reminder**: ~1 week later
- **Graduation**: User has demonstrated the skill 3+ times unprompted

If the user fails to use the skill (equivalent to forgetting), reset the interval to a shorter period.

### Principle 8: Measure What Matters

Track these metrics per user:
- **Feature Discovery Rate**: How many available features has the user been exposed to?
- **Feature Adoption Rate**: Of exposed features, how many are actually being used?
- **Time-to-Adoption**: How long between first exposure and regular use?
- **Skill Stability**: How long does adoption persist? (Do users revert to old patterns?)
- **Teaching Effectiveness**: Which teaching approaches lead to adoption vs. dismissal?

### Principle 9: The Agent Teaches Through Its Own Behavior

The most powerful teaching mechanism is the agent **demonstrating** better approaches:
- When the agent solves a problem, it can show the user what it did and why
- Transparent AI reasoning teaches users to think better, not just get better answers
- "I used `/batch` to process these 15 files---this saved about 3 minutes compared to processing them individually"

### Principle 10: Close the Loop Between Self-Healing and User Growth

The ultimate goal is not just a system that fixes itself, but a system where:

```
User struggles with X
  --> Agent detects the struggle
  --> Agent creates a better approach (self-healing)
  --> Agent teaches user the better approach (education)
  --> User internalizes the approach (spaced repetition)
  --> User stops struggling with X
  --> Agent detects new struggle Y
  --> Cycle repeats
```

Over time, the user becomes more capable, the agent becomes more efficient, and the system as a whole becomes more than the sum of its parts.

---

## Appendix A: Key Researchers and Their Contributions

| Researcher | Contribution | Year |
|-----------|-------------|------|
| Hermann Ebbinghaus | The forgetting curve | 1885 |
| Sebastian Leitner | The Leitner box system | 1972 |
| Stuart & Hubert Dreyfus | Model of skill acquisition | 1980 |
| John M. Carroll & Mary Beth Rosson | Paradox of the active user | 1987 |
| John M. Carroll | Training wheels interface | 1984 |
| Piotr Wozniak | SM-2 algorithm, SuperMemo, incremental reading | 1987-present |
| Richard Thaler & Cass Sunstein | Nudge theory | 2008 |
| Henry Roediger & Jeffrey Karpicke | Testing effect research | 2006 |
| Andy Matuschak & Michael Nielsen | Mnemonic medium, Quantum Country | 2019 |
| Andy Matuschak | Programmable attention, Orbit | 2020-present |
| Open Spaced Repetition community | FSRS algorithm | 2022-present |

## Appendix B: Tools and Platforms Referenced

| Tool | What It Does | Relevance |
|------|-------------|-----------|
| **Anki** | Open-source flashcard app using SM-2/FSRS | Most popular SRS tool |
| **SuperMemo** | Wozniak's proprietary SRS with incremental reading | Pioneer of the field |
| **Orbit** | Matuschak's embeddable SRS for web content | Mnemonic medium platform |
| **Quantum Country** | First mnemonic medium implementation | Proof of concept |
| **FSRS** | Open-source ML-based scheduling algorithm | State of the art algorithm |
| **Whatfix** | Digital Adoption Platform with embedded learning | Workflow-integrated SRS |
| **Pendo** | Feature adoption analytics | Detecting unused features |
| **Userpilot** | Product analytics and in-app guidance | Progressive disclosure |

## Appendix C: Open Questions for Our Project

1. **What is the right granularity for tracking user knowledge?** Per-command? Per-workflow? Per-concept?

2. **How do we avoid being annoying?** The line between helpful nudge and irritating interruption is thin. What signals indicate the user wants to be left alone?

3. **Should the agent explain WHY a command exists?** Research on transparent AI suggests that showing reasoning helps users develop independent judgment. But the active user paradox suggests users don't want explanations.

4. **How do we handle users who explicitly reject a suggestion?** If a user dismisses a nudge, should we never bring it up again? Or try a different framing later?

5. **Can we use the FSRS algorithm directly?** The 21-parameter model is designed for flashcard-style items. Can we adapt its DSR framework to model user knowledge of software commands?

6. **What does "graduation" look like?** When should the agent stop teaching a particular skill? After 3 unprompted uses? After 1 week of consistent use?

7. **How do we bootstrap?** New users have no interaction history. Should we use default parameters (like FSRS does) trained on aggregate user data?

8. **Should the agent teach meta-skills?** Not just "use /batch" but "when you notice yourself repeating a task, look for automation." Teaching the user to fish rather than giving them fish.

---

*This research forms the theoretical foundation for the user education component of the self-healing agents system. The next step is to design concrete mechanisms that implement these principles.*
