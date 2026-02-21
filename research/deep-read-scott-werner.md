# Deep Read: Scott Werner on Prompt Objects and Message-Passing Architecture

**Research Date:** 2026-02-21
**Primary Sources:** Three articles from the "Works on My Machine" newsletter (worksonmymachine.ai), supplemented by web research on Werner's broader body of work.
**Analyst:** Deep read for self-healing agents project

---

## Source Material

### Articles Read In Full (from Obsidian Vault / Readwise)

1. **"What If We Took Message-Passing Seriously?"** -- The foundational article introducing prompt objects.
   - Path: `/Users/tejasdc/Obsidian Vault/obsidian/Readwise/Full Document Contents/Articles/What If We Took Message-Passing Seriously.md`
   - URL: https://worksonmymachine.ai/p/what-if-we-took-message-passing-seriously

2. **"As Complexity Grows, Architecture Dominates Material"** -- The article on compounding recovery vs. compounding failure, with the ARC-AGI demonstration.
   - Path: `/Users/tejasdc/Obsidian Vault/obsidian/Readwise/Full Document Contents/Articles/As Complexity Grows, Architecture Dominates Material.md`
   - URL: https://worksonmymachine.ai/p/as-complexity-grows-architecture

3. **"The Different Shapes of Think Before You Build Prompting"** -- Taxonomy of prompting strategies (deductive, inductive, abductive, contrapositive, DSL scaffolding).
   - Path: `/Users/tejasdc/Obsidian Vault/obsidian/Readwise/Full Document Contents/Articles/The Different Shapes of Think Before You Build Prompting.md`
   - URL: https://worksonmymachine.ai/p/the-different-shapes-of-think-before

### Additional Sources (Web Research)

4. **"The System Inside the System"** -- Viable System Model applied to AI agents.
   - URL: https://worksonmymachine.ai/p/the-system-inside-the-system

5. **"Safe Is What We Call Things Later"** -- The formalism/informalism pendulum.
   - URL: https://worksonmymachine.ai/p/safe-is-what-we-call-things-later

6. **"Polymorphism Is a Force Multiplier for AI"** -- Code structure as the prompt.
   - URL: https://worksonmymachine.ai/p/polymorphism-is-a-force-multiplier

7. **"The Discovery Phase Is All There Is"** -- On continuous discovery vs. static specification.
   - URL: https://worksonmymachine.ai/p/the-discovery-phase-is-all-there

8. **prompt_objects Ruby gem** -- GitHub: https://github.com/works-on-your-machine/prompt_objects

---

## 1. What Are Prompt Objects?

### Definition

A **prompt object** is a self-contained computing entity -- modeled after Smalltalk objects -- that can:

1. **Receive messages** (in natural language)
2. **Think** (reason about what it received)
3. **Modify itself** (add capabilities it discovers it needs)
4. **Create other objects** (spawn new prompt objects to handle sub-problems)

That is the complete primitive set. Four capabilities. Everything else emerges from the arrangement.

### How They Differ From Regular Prompts

| Dimension | Regular Prompt | Prompt Object |
|-----------|---------------|---------------|
| **Identity** | Stateless text sent to an LLM | A persistent entity with capabilities, state, and behavior |
| **Communication** | One-shot or linear conversation | Bidirectional message-passing with other objects |
| **Interpretation** | Meaning determined by the prompt author | Meaning determined by the *receiver* at runtime |
| **Modification** | Fixed once written | Can modify itself and be modified by other objects while running |
| **Composition** | Chained sequentially (pipeline) | Networked -- objects discover and negotiate with each other |
| **Binding time** | Early (structure determined at design time) | Late -- *semantic* late binding where even the meaning of a message is resolved at runtime |
| **Metaphor** | A command or instruction | A living entity that interprets, negotiates, and adapts |

### The Naming Matters

Werner is explicit that the *word* matters. Citing the Sapir-Whorf hypothesis for programmers:

> "Agent" primes you toward autonomy, tasks, guardrails, going rogue. "Prompt object" primes you toward thinking about composition, interfaces, inheritance, message protocols.

The name "prompt object" activates different cognitive frames:
- **"Agent"** -> "How do I control it? Where are the guardrails? What if it goes rogue?"
- **"Prompt object"** -> "How do I compose it? What's its interface? What messages does it understand? How does it inherit behavior?"

This is not just branding. The frame determines what you can imagine building.

### Intellectual Lineage

Werner traces the concept through a specific lineage:

1. **Alan Kay / Smalltalk (1970s-80s)**: Objects as little computers. Messages passed between them, interpreted by the receiver. Late binding. A whole system as a living thing you could reshape while it ran.
2. **_why the lucky stiff / Ruby culture**: Programming as a medium for discovery, not just a tool for production. Code as a place to think.
3. **LLMs as the missing interpreter**: Smalltalk objects couldn't actually *interpret* messages semantically. They matched method signatures. LLMs can genuinely interpret natural language messages, making Kay's vision realizable for the first time.

Werner's claim: **"We accidentally built the runtime that Smalltalk always wanted."**

---

## 2. Message-Passing Architecture: How It Works

### The Mechanism

In Werner's system, communication between prompt objects is **actual natural language message passing**, not function calls, not structured APIs, not tool invocations. The process:

1. **Object A** formulates a message in natural language and sends it to **Object B**
2. **Object B** receives the message and *interprets* it -- deciding what the message means, what action to take, whether it even makes sense
3. **Object B** may respond, ask for clarification, modify itself, create new objects, or send messages to other objects
4. The receiver always decides what the message means. This is **semantic late binding** -- not just late binding of method dispatch, but late binding of *meaning itself*

### What Messages Are Sent

Messages are natural language. Werner gives examples:
- "Read a file" (sent to an object that doesn't yet know how to read files)
- Clarification requests: "This doesn't make sense, can you rephrase?"
- Capability queries: An object can ask another object what it's capable of, and get an answer "in prose"
- Error reports with context: An object can "look at an error and modify itself to handle it"

### How Objects Receive and Process Messages

The bootstrapping sequence Werner describes:

1. Object receives a message to do something (e.g., "read a file")
2. Object *thinks* about what it needs
3. Object *realizes* it doesn't have that capability
4. Object *queries its environment* to discover available primitives (the "standard library" equivalent)
5. Object *adds the capability to itself*
6. Object *uses* the new capability
7. This is "the object bootstrapping itself into competence"

### The Softening of Boundaries

When objects interpret messages in natural language at runtime:

> "Something shifts. The boundaries between objects become softer. The interfaces become negotiable. An object can ask another object what it's capable of, and get an answer in prose, and figure out how to work together on the fly."

This is fundamentally different from traditional APIs where interfaces are rigid contracts. Here, interfaces are **conversations** -- negotiable, context-dependent, adaptive.

---

## 3. Emergent Self-Healing: The Mechanism

### The Multiplication Problem (Why Chains Break)

Werner starts with the cold math of chained systems:

```
3 agents at 80% reliability: 0.80 x 0.80 x 0.80 = 0.512 (coin flip)
5 agents: 33%
7 agents: 21%
```

Every link in a chain is an opportunity for the whole system to collapse. The standard response is the **Pyramid Approach**: more retries, more guardrails, more fallback logic, more orchestration frameworks. More material. A bigger pyramid.

Werner calls this "looking at the rubble and plastering it with limestone."

### The Inversion

The prompt object architecture inverts the math. Instead of each interaction being an opportunity for *failure*, each interaction becomes an opportunity for *recovery*. The mechanism:

1. **Each object can reflect on what it received** -- it doesn't blindly process; it interprets
2. **Objects can ask clarifying questions** -- "this doesn't make sense, can you rephrase?"
3. **Objects can send error messages back** -- the conversation routes around misunderstandings
4. **Objects can modify themselves** -- look at an error and add a capability to handle it
5. **Objects can modify the sender** -- fix the source of the problem, not just the symptom
6. **Objects can create new objects** -- spawn novel entities to deal with unanticipated problems

### Why This Is Emergent (Not Designed)

This is the critical claim. Werner is explicit:

> "I didn't have to *build* any of that. No retry logic. No error recovery. No coordination layer or orchestration framework or a verification harness. Just objects that can receive messages and interpret them. The recovery, the coordination, the self-correction, that's what falls out of the arrangement."

He repeats this in several forms:

> "I didn't design this. I didn't set out to build a self-healing architecture. I set out to take the ideas around message-passing seriously and see what happened."

And from the ARC-AGI section:

> "I didn't engineer exploration as a feature. It just showed up because the stones were arranged that way."

### The Arch Metaphor

Werner uses the arch as his central metaphor, drawn from Alan Kay's 1997 talk:

- A stone alone can only sit or fall.
- Stones leaned against each other in a specific shape become an arch.
- The arch holds up a bridge. The bridge carries loads that would crush any individual stone.
- **"The bridge isn't in any of the stones. It's in the leaning."**

Applied to prompt objects:
- Individual objects are simple (four capabilities).
- The message-passing arrangement between them produces properties no individual object has: recovery, coordination, self-correction, exploration, hypothesis testing.
- **"It's emergent. It's the bridge that lives in the leaning, not in any individual stone."**

### Compounding Recovery vs. Compounding Failure

Werner's key diagram (described, not reproduced here) contrasts:

- **Standard chain**: Failure compounds multiplicatively. Longer chains are weaker.
- **Prompt object chain**: Recovery compounds. Longer chains are *more antifragile*.

> "The prompt object architecture says that each interaction is an opportunity for *recovery*, because the objects interpret, negotiate, and adapt. The error correction isn't a layer you add on top. It's a property of how the stones are arranged."

### The Cathedral vs. The Pyramid

Drawing again from Kay:
- **Pyramid approach**: More material compensates for weak architecture. Retries, guardrails, orchestration layers. Works, but the mass grows faster than the capability.
- **Cathedral approach**: Less material, better arrangement. "Almost all air. Almost all glass. Everything cunningly organized in a beautiful structure to make the whole have much more integrity than any of its parts."

Werner's prompt object ARC-AGI solver: "absurdly simple to read. You can trace through an execution and understand it in minutes." Compared to competitive approaches requiring "multi-model ensembles, evolutionary search, custom training pipelines."

---

## 4. "Components Can Pick Up Where Others Left Off Without Centralized Coordination"

### How This Works In Detail

This property emerges from several interacting features of the architecture:

**1. Semantic interpretation at the receiver.**
Each object decides what a message means. If Object A fails mid-task and Object B receives a partial result, Object B doesn't crash because it expected a specific structured input. It *reads* the partial result, *interprets* what happened, and *decides* how to proceed. This is fundamentally different from a pipeline where Step 3 expects the exact output format of Step 2.

**2. Self-modification.**
When an object encounters something unexpected, it doesn't fail -- it adapts. It can query its environment, discover new primitives, and add capabilities to itself. If the thing it encounters is a partial result from a failed predecessor, it can figure out what the predecessor was trying to do and complete it.

**3. No hardcoded handoff protocol.**
In traditional agent chains, the handoff protocol is rigid: Agent A produces X, Agent B expects X. If A produces something else, the chain breaks. In prompt objects, the handoff is a *conversation*. B interprets whatever A sends. If it's incomplete, B asks questions, or figures out the intent, or adapts its own behavior.

**4. Shared environment awareness.**
Objects can query their environment. If Object A wrote partial results to the environment before failing, Object C (which may never have talked to Object A) can discover those results, interpret them, and continue the work. This is coordination through shared state, not through direct messaging chains.

**5. Object creation as recovery.**
An object that recognizes a problem it can't solve can *create a new object* specifically to handle it. This means the system can grow new capabilities in response to failures, without any central coordinator deciding what capability is needed.

### The Conversation Analogy

Werner offers the most intuitive explanation:

> "The system routes around damage the way... a conversation routes around a misunderstanding. You say a thing. The other person squints. You say it differently. You get there."

No centralized coordinator orchestrates human conversation repair. The participants themselves negotiate meaning, recover from misunderstandings, and adapt their communication strategies -- all locally, all in real time.

### Connection to Stafford Beer's Viable System Model

In "The System Inside the System," Werner connects this to cybernetics. Beer's VSM defines five subsystems (Operations, Coordination, Control, Intelligence, Identity), each capable of containing the entire structure recursively. The key insight: viable systems regulate themselves through feedback loops. No central brain. Each subsystem maintains context awareness and responds to local conditions.

Werner's prompt objects implement this: each object is a viable system (it can receive, think, modify itself, create others). The system of objects is also a viable system. Recursion all the way down.

---

## 5. Practical Examples

### Example 1: File Reading Bootstrap (from "What If We Took Message-Passing Seriously?")

A prompt object receives the message "read a file." It:
1. Thinks about what it needs
2. Realizes it doesn't have file-reading capability
3. Queries its environment for available primitives
4. Finds a file-reading primitive in the standard library
5. Adds that capability to itself
6. Reads the file

The object went from zero capability to competent, *without anyone programming that specific capability in advance*. Self-modification as the default state.

### Example 2: ARC-AGI Solver (from "As Complexity Grows, Architecture Dominates Material")

Werner built an ARC-AGI solver using prompt objects on Haiku 4.5 (the small, cheap model). The architecture:

- A **hypothesis object** proposes a rule for the grid puzzle
- A **tester object** checks the hypothesis against examples and explains *why* it failed, not just *that* it failed
- Objects can realize they need help and **create new objects**
- "The reasoning *is* the conversation"

Results: solving ARC-AGI-1 challenges at under $1/task (compared to GPT-5.2 at $11.64/task). The solver is "absurdly simple to read" compared to competitive approaches requiring hundreds of lines of orchestration, retry logic, and fallback chains.

The key observation: as Werner solved challenges and updated objects, "the next one goes better. The objects learn from their own conversations. I learn from watching the objects. The objects change because I changed them because they taught me to." This creates a strange loop -- the system moves through its own levels and comes back changed.

### Example 3: Error Recovery (from "As Complexity Grows, Architecture Dominates Material")

An object encounters an error. Rather than crashing or triggering a retry mechanism:
- It can "look at an error and modify itself to handle it"
- It can "modify the sender" (fix the source of the problem)
- It can "create new objects to deal with problems nobody anticipated"
- None of this was programmed as error-handling code. It emerges from message-passing + interpretation + self-modification.

### Example 4: Capability Discovery (from "The System Inside the System" / VSM)

In Werner's earlier work with the Viable System Model:
- An agent tool can be itself structured as a sub-agent with the same five subsystems
- "Tools themselves become agents with identical internal structure -- recursion all the way down"
- An AI agent can "literally write its own capabilities while running" using Ruby's metaprogramming

---

## 6. Mapping to Claude Code

### Are Skills Prompt Objects?

**Partially yes, with significant gaps.**

Skills in Claude Code are loaded instructions that modify agent behavior -- they have identity (a name and description), they carry context (markdown content), and they respond to invocation (the `/skill-name` trigger). In this sense, a skill is a lightweight prompt object: it receives a message (the invocation), and it modifies the agent's behavior (by injecting instructions into context).

However, skills lack the full prompt object model:
- **No self-modification**: A skill cannot modify itself at runtime. It's static markdown loaded into context.
- **No message-passing between skills**: Skills don't communicate with each other. They're loaded independently.
- **No object creation**: A skill cannot spawn new skills in response to what it encounters.
- **No semantic interpretation**: Skills don't interpret messages; they're just text that shapes the LLM's behavior.

**To make skills into true prompt objects:** Skills would need to be dynamic entities that can receive messages from other skills, modify their own content based on what they encounter, query their environment for available capabilities, and create new skills at runtime.

### Are Hooks Message Handlers?

**Yes, and this is the closest mapping.**

Hooks fire at specific lifecycle events (PreToolUse, PostToolUse, PostToolUseFailure, SessionStart, etc.) and execute deterministic shell commands. This is message-passing: the system broadcasts a message ("tool X is about to execute"), and hooks that match the pattern receive and process it.

Key similarities:
- Hooks respond to messages (lifecycle events) with local interpretation
- Hooks can modify system behavior (block tool calls, inject context, alter prompts)
- Hooks operate without centralized coordination (each hook is independent)
- Hooks are composable (multiple hooks can fire on the same event)

Key gaps:
- **Hooks are not semantic**: They match on tool names and event types, not on natural language interpretation of what's happening
- **Hooks cannot modify themselves**: A hook's behavior is fixed in its shell command
- **Hooks cannot create new hooks**: No runtime self-modification of the hook system
- **Hooks are deterministic**: They execute shell commands, not LLM-interpreted natural language. This is by design (reliability), but it means they lack the adaptive interpretation that makes prompt objects self-healing.

### Is CLAUDE.md the Target Morphology?

**Yes, and this is perhaps the deepest mapping.**

In our existing synthesis, we identified CLAUDE.md as the "target morphology" -- the bioelectric pattern that encodes the desired state of the system. Werner's prompt objects have an analogous concept: the object's system prompt defines its identity and initial behavior, but the object can modify itself at runtime.

CLAUDE.md maps to the *initial* state of a prompt object -- its starting configuration. But in current Claude Code:
- CLAUDE.md is static (modified between sessions, not during them)
- CLAUDE.md is not self-modifying
- CLAUDE.md doesn't interpret messages -- the LLM interprets CLAUDE.md

**To complete the mapping:** CLAUDE.md would need to be a living document that the agent can modify during a session based on what it learns. Some of this already happens through the memory system (which appends learned facts), but CLAUDE.md itself remains manually curated.

### Are Sub-Agents Independent Prompt Objects?

**This is the most natural mapping.**

Sub-agents in Claude Code (spawned via the `Task` tool) are:
- Self-contained (they have their own context, tools, and reasoning)
- Message-receiving (they get a task description)
- Independent (they execute without the parent's direct oversight)
- Result-producing (they return output to the parent)

This maps well to prompt objects. However, sub-agents lack:
- **Self-modification**: A sub-agent can't change its own tools or capabilities mid-task
- **Peer communication**: Sub-agents can't message each other directly; communication goes through the parent
- **Persistence**: Sub-agents are ephemeral; they don't persist between invocations
- **Object creation**: Sub-agents can spawn further sub-agents (Task within Task), but this is limited in practice

### Is Memory the Shared State That Messages Reference?

**Yes, and this connects directly to stigmergy.**

The memory system (CLAUDE.md, episodic memory, file-based state) serves as the shared environment through which prompt objects coordinate:

- **CLAUDE.md**: Persistent identity/behavior state, readable by all sessions
- **Episodic memory**: Vectorized store of past interactions, searchable
- **Filesystem artifacts**: Files, docs, solutions libraries, git history -- all readable by any future agent session
- **Git commit history**: A pheromone trail of past actions

In Werner's architecture, objects can query their environment. In Claude Code, agents read CLAUDE.md, search memory, and inspect the filesystem. The mechanism is the same: coordination through shared environment state rather than direct inter-agent messaging.

---

## 7. What's Missing in Claude Code to Fully Implement Prompt-Object Architecture

### Gap 1: Runtime Self-Modification

**Current state:** Claude Code's capabilities are fixed at session start. Tools are predefined. Skills are loaded as static text. Hooks are deterministic shell commands.

**What prompt objects require:** An agent that can discover it lacks a capability, query available primitives, and *add the capability to itself* -- all at runtime, within a single session.

**Possible implementation:** A hook or skill system where Claude Code can write new hooks, register new MCP tools, or modify its own skill definitions during execution. Ruby's metaprogramming makes this natural; Claude Code's TypeScript/shell architecture would need an equivalent mechanism.

### Gap 2: Inter-Object Message Passing

**Current state:** Sub-agents receive tasks from parents and return results. There is no peer-to-peer messaging between concurrent sub-agents. Skills don't talk to each other. Hooks don't trigger other hooks.

**What prompt objects require:** Objects that can send natural language messages to each other, negotiate interfaces on the fly, ask clarifying questions, and co-evolve their behavior through conversation.

**Possible implementation:** A message bus or shared mailbox system where sub-agents can post messages for other sub-agents. Or a shared file-based protocol where agents write messages to designated locations (this would be stigmergic message-passing).

### Gap 3: Semantic Late Binding

**Current state:** Tool dispatch is early-bound (tool names match exactly). Hook matchers are pattern-based. Skill invocation is name-based.

**What prompt objects require:** The receiver decides what a message means. If you send "read a file" to an object, the object interprets this however it sees fit -- maybe it reads, maybe it asks which file, maybe it decides reading isn't the right approach and does something else.

**Possible implementation:** This actually exists partially in Claude Code's core loop -- the LLM interprets user prompts semantically and decides which tools to use. But the *inter-agent* communication (Task tool) still requires structured task descriptions and returns structured results. Making inter-agent communication fully semantic would mean sub-agents receive natural language tasks and interpret them with full LLM reasoning, which is closer to how `Task` already works. The gap is more about *bidirectional* semantic communication between peers.

### Gap 4: Object Creation as Recovery

**Current state:** Claude Code can spawn sub-agents, but this is a deliberate architectural choice by the parent, not an emergent recovery mechanism.

**What prompt objects require:** An object that encounters an error it can't handle should be able to create a *new object specifically designed to handle that class of error*, without anyone having anticipated the need for that object.

**Possible implementation:** A PostToolUseFailure hook that spawns a specialized sub-agent to diagnose and recover from the specific failure. Or: Claude Code already does something like this informally -- when it encounters an error, it reasons about it and tries a different approach. The gap is that this reasoning happens within a single agent rather than through the creation of specialized recovery objects.

### Gap 5: Persistent Object Identity Across Sessions

**Current state:** Each Claude Code session is a fresh agent. Memory carries over through CLAUDE.md and episodic memory, but the agent itself has no persistent identity that evolves.

**What prompt objects require:** Objects that persist, accumulate experience, and evolve their capabilities over time. The same object handles related requests across sessions, getting better at its specific domain.

**Possible implementation:** Named agent profiles with persistent state, accumulated capabilities, and evolving system prompts. Something like: "The Code Review Object" that has its own modified CLAUDE.md, its own hooks, its own memory partition, and that gets invoked whenever code review is needed.

### Gap 6: Mutual Modification (Objects Modifying Other Objects)

**Current state:** Hooks can modify Claude's behavior, but Claude can't modify hooks at runtime. Sub-agents can't modify the parent. Skills can't modify each other.

**What prompt objects require:** Object A should be able to modify Object B -- change its behavior, add capabilities, fix bugs in its interpretation. Werner describes objects that "modify the sender" when they detect the sender is producing problematic messages.

**Possible implementation:** A governance layer where agents can propose modifications to CLAUDE.md, hooks, or skill definitions, subject to approval. This is the most architecturally radical gap -- it's also where the most powerful self-healing properties emerge.

---

## 8. Connection to Stigmergy

### Does Message-Passing Via Environment Equal Stigmergy?

**Not exactly, but they are deeply complementary and partially overlapping.**

Werner's prompt objects use **direct message-passing**: Object A sends a message to Object B. This is different from stigmergy, where agents communicate *indirectly* through traces left in a shared environment.

However, several aspects of Werner's architecture are stigmergic:

1. **Environment querying**: Objects query their environment to discover available primitives. The environment is a shared medium that contains traces of what's available -- this is stigmergic.

2. **Self-modification artifacts**: When an object modifies itself, those modifications persist in the object's state, which other objects can discover. This is like a pheromone trail -- the modification is a trace in the shared system state that influences future behavior.

3. **The ARC-AGI learning loop**: Werner describes a loop where "the objects learn from their own conversations. I learn from watching the objects. The objects change because I changed them because they taught me to." The execution traces become environmental signals that guide future modifications. That is stigmergy.

4. **Object creation**: When an object creates a new object, the new object *exists in the shared environment*. Other objects can discover it, send it messages, learn from it. The act of creation is a stigmergic trace.

### The Hybrid Model

What Werner actually describes is a **hybrid of direct message-passing and stigmergic coordination**:

- **Direct messages** for real-time collaboration (Object A tells Object B to do something)
- **Environmental traces** for cross-session/cross-context coordination (objects modify themselves and their environment, leaving traces that guide future behavior)

This maps precisely to how Claude Code already works:
- **Direct**: User prompt -> Claude reasoning -> tool use -> sub-agent task
- **Stigmergic**: CLAUDE.md accumulation, memory entries, filesystem artifacts, git history, docs/solutions libraries

### What Grasse Would Recognize

Pierre-Paul Grasse identified two types of stigmergy:

1. **Qualitative stigmergy**: The *nature* of a stimulus dictates the specific action (the shape of the structure guides the next building step)
2. **Quantitative stigmergy**: The *intensity* of a stimulus influences the probability of action (pheromone concentration affecting trail-following)

In Claude Code:
- **Qualitative**: CLAUDE.md content dictates *specific* behaviors ("always use X pattern for Y"). The nature of the instruction determines the action.
- **Quantitative**: Memory relevance scores, frequency of similar past failures, /insights satisfaction ratings -- these are intensity signals that influence the probability of specific behaviors.

Werner's prompt objects add a third modality: **semantic stigmergy** -- where the trace left in the environment is natural language that gets *interpreted* by the discoverer, not just followed mechanically. This is a genuinely novel contribution to the stigmergy concept.

---

## 9. Key Theoretical Insights

### Insight 1: Architecture > Material (Kay's Law)

Werner's central claim, borrowed from Kay's 1997 talk: "As complexity grows, architecture dominates material." A system's power comes from the arrangement of its components, not from the sophistication of individual components.

Evidence: A prompt object system running on Haiku 4.5 (the cheapest, smallest model) can solve ARC-AGI challenges that typically require expensive multi-model ensembles. The architecture compensates for the weakness of the material.

**Implication for self-healing agents:** Don't build more sophisticated individual healing mechanisms. Build better *arrangements* of simple healing components. The healing should emerge from the architecture, not be engineered as a feature.

### Insight 2: The Formalism/Informalism Pendulum

Werner identifies a recurring pattern: informalists discover what's possible, formalists make it reliable. Smalltalk (informalist) -> Java (formalist) -> Ruby (informalist) -> TypeScript/Rust (formalist) -> Vibe Coding (informalist).

> "You can't formalize a thing you haven't found yet. You don't even know what the right constraints are until you've watched the system do something you didn't expect."

**Implication for self-healing agents:** We are in the informalist discovery phase. The priority is finding what shapes are possible, not proving they're safe. "I'd rather have an untyped cathedral, for now."

### Insight 3: Self-Modification as Default State

In Werner's architecture, self-modification isn't an exceptional capability -- it's the *default*. Objects are expected to change while running. The system is designed to be reshaped during execution.

This inverts the traditional assumption that code should be stable and changes should be controlled. For self-healing systems, this is critical: healing *requires* self-modification. If the system can't change itself, it can't heal.

### Insight 4: The Discovery Phase Is All There Is

Werner argues there is no "post-discovery production phase." The system is always discovering, always adapting. The discovery phase *is* the actual work.

**Implication for self-healing agents:** Self-healing is not a feature you add after building the agent. Self-healing IS the agent's mode of operation. Every session is a discovery. Every interaction is an opportunity for adaptation.

### Insight 5: The Strange Loop

Werner's ARC-AGI learning loop: "The objects learn from their own conversations. I learn from watching the objects. The objects change because I changed them because they taught me to."

This is a [Hofstadterian strange loop](https://en.wikipedia.org/wiki/Strange_loop) -- the system moves through its own levels and comes back changed. The observer modifies the system based on the system's self-generated behavior, and the system's future behavior reflects the observer's modifications.

**Implication for self-healing agents:** The human operator is part of the healing loop. The system heals, the human observes the healing, the human modifies the system to heal better, the system heals differently. This is not a bug in the architecture -- it's the architecture working as intended.

---

## 10. Critical Assessment

### What Werner Gets Right

1. **The arch metaphor is precise and powerful.** Emergent properties from arrangement is a well-established phenomenon in complexity science. Werner is correct that self-healing can emerge from message-passing without being designed.

2. **The multiplication problem is real.** Chained reliability degradation is a genuine architectural problem. His proposed solution (compounding recovery through interpretation) is theoretically sound.

3. **Semantic late binding is genuinely new.** Traditional late binding resolves *which method to call* at runtime. Werner's semantic late binding resolves *what the message means* at runtime. This is a real conceptual advance enabled by LLMs.

4. **The naming insight is underrated.** "Prompt object" vs. "agent" genuinely activates different design thinking. Werner is doing real intellectual work by reframing.

### What Needs More Evidence

1. **"Compounding recovery" needs rigorous measurement.** Werner shows the concept with small examples. Does it actually hold at scale? Does the recovery really compound, or does it plateau? What are the failure modes of message-passing systems? (Infinite loops of clarification? Semantic drift? Objects that modify each other into incoherence?)

2. **The ARC-AGI results are preliminary.** Five test challenges on ARC-AGI-1 (2019 version, likely contaminated in training data). Werner acknowledges this. The real test will be ARC-AGI-3.

3. **Self-modification at scale is unexplored territory.** Werner admits: "What if an object modifies another object in a way you didn't intend? What if the whole system just... wanders off?" These are real concerns that remain unanswered.

4. **The cost comparison is incomplete.** Under $1/task vs. $11.64/task is compelling, but what's the accuracy comparison? Speed? Reliability across many tasks?

### Where It Connects to Our Project

Werner's prompt objects are **the most direct implementation of the self-healing architecture our project theorizes**. Our SYNTHESIS.md identifies these biological patterns:

| Our Pattern | Werner's Implementation |
|-------------|----------------------|
| Multi-Phase Healing Pipeline | Objects that detect, interpret, adapt, recover |
| Controlled Destruction (Apoptosis) | Objects that recognize they can't solve a problem and create replacement objects |
| Feedback Loops (Homeostasis) | Message-passing as continuous bidirectional feedback |
| Decentralized Local-First Response (Stigmergy) | Objects responding to local messages + environmental traces |
| Target Morphology | Object system prompt as desired state specification |
| Immune Memory | Objects learning from their own conversations across iterations |
| Degeneracy Over Redundancy | Different objects can handle the same class of problem in different ways |

Werner has, perhaps without fully realizing it, built a system that implements most of the biological healing patterns we identified. The gap is that his system operates within a single runtime session, while our project targets cross-session healing in Claude Code.

---

## 11. Synthesis: What This Means for Self-Healing Agents

### The Core Takeaway

Werner's work demonstrates that **self-healing is not a feature you engineer -- it is an emergent property of the right architecture**. Specifically, an architecture where:

1. Components interpret messages semantically (not just pattern-match)
2. Components can modify themselves in response to what they encounter
3. Components can create new components to handle unanticipated problems
4. Communication happens through natural language, allowing negotiation and adaptation
5. The environment stores traces that guide future behavior

### Design Principle for Our Project

**Don't build a self-healing system. Build a message-passing system with semantic interpretation, and self-healing will emerge.**

This means:
- CLAUDE.md should be treated as a living prompt object, not a static config file
- Hooks should be able to communicate with each other through shared state
- Sub-agents should be able to message peers, not just report to parents
- The memory system should be a shared environment where agents leave traces that guide other agents
- The system should be able to create new hooks, skills, or sub-agents at runtime in response to failures

### The Untyped Cathedral

We are building an untyped cathedral. The formalization will come later, once we understand what shapes are possible. Werner's prompt objects show us that the right arrangement of simple components can produce sophisticated self-healing behavior. Our job is to find the right arrangement for Claude Code's specific architecture.

Less stuff. Better arrangement. Bigger result.

Almost all air. Almost all glass.

---

## Sources

- [What If We Took Message-Passing Seriously?](https://worksonmymachine.ai/p/what-if-we-took-message-passing-seriously) -- Scott Werner, Works on My Machine
- [As Complexity Grows, Architecture Dominates Material](https://worksonmymachine.ai/p/as-complexity-grows-architecture) -- Scott Werner, Works on My Machine
- [The Different Shapes of "Think Before You Build" Prompting](https://worksonmymachine.ai/p/the-different-shapes-of-think-before) -- Scott Werner, Works on My Machine
- [The System Inside the System](https://worksonmymachine.ai/p/the-system-inside-the-system) -- Scott Werner, Works on My Machine
- [Safe Is What We Call Things Later](https://worksonmymachine.ai/p/safe-is-what-we-call-things-later) -- Scott Werner, Works on My Machine
- [Polymorphism Is a Force Multiplier for AI](https://worksonmymachine.ai/p/polymorphism-is-a-force-multiplier) -- Scott Werner, Works on My Machine
- [The Discovery Phase Is All There Is](https://worksonmymachine.ai/p/the-discovery-phase-is-all-there) -- Scott Werner, Works on My Machine
- [prompt_objects Ruby gem](https://github.com/works-on-your-machine/prompt_objects) -- GitHub
- [Sublayer and Artificial Ruby with Scott Werner](https://www.therubyaipodcast.com/2388930/episodes/17266773-sublayer-and-artificial-ruby-with-scott-werner) -- The Ruby AI Podcast
- [Alan Kay: "The Computer Revolution Hasn't Happened Yet" (1997)](https://www.youtube.com/watch?v=oKg1hTOQXoY) -- OOPSLA keynote
