# Compound Engineering Plugin Analysis

## Research Date: 2026-02-20

## Source & Attribution

- **Plugin**: compound-engineering v2.28.0
- **Author**: Kieran Klaassen (kieran@every.to) at Every, Inc.
- **Repository**: [EveryInc/compound-engineering-plugin](https://github.com/EveryInc/compound-engineering-plugin)
- **License**: MIT
- **Installation Status**: Installed locally at `~/.claude/plugins/marketplaces/every-marketplace/plugins/compound-engineering/`
- **Key Articles**:
  - [My AI Had Already Fixed the Code Before I Saw It](https://every.to/source-code/my-ai-had-already-fixed-the-code-before-i-saw-it)
  - [Compound Engineering: How Every Codes With Agents](https://every.to/chain-of-thought/compound-engineering-how-every-codes-with-agents)
  - [Compound Engineering Guide](https://every.to/guides/compound-engineering)
  - [How to Make Claude Code Better Every Time You Use It](https://creatoreconomy.so/p/how-to-make-claude-code-better-every-time-kieran-klaassen)
  - [Will Larson's Analysis](https://lethain.com/everyinc-compound-engineering/)

---

## 1. Overview & Philosophy

Compound engineering is a methodology built on one core principle: **"Each unit of engineering work should make subsequent units easier, not harder."** This inverts the typical trajectory of software development where accumulated code introduces technical debt, edge cases, and interdependencies that slow future work.

The system creates a learning loop where bugs, performance issues, and problem-solving insights are systematically documented and fed back into the AI agent's context for future work. The plugin implements this through a structured Plan -> Work -> Review -> Compound cycle.

### Scale of the Plugin

| Component    | Count |
|------------- |-------|
| Agents       | 27    |
| Commands     | 24    |
| Skills       | 15    |
| MCP Servers  | 1     |

---

## 2. The Plan-Work-Review-Compound Loop

### Phase 1: Plan (`/workflows:plan`)

Research requirements before writing code. The plan phase:

1. **Checks for prior brainstorms** in `docs/brainstorms/` that match the feature
2. **Runs local research agents in parallel**:
   - `repo-research-analyst` -- scans existing codebase patterns
   - `learnings-researcher` -- searches `docs/solutions/` for prior learnings
3. **Makes a smart research decision**: high-risk topics (security, payments, APIs) always get external research; strong local context may skip external research entirely
4. **Conditionally runs external research** via `best-practices-researcher` and `framework-docs-researcher`
5. **Runs SpecFlow analysis** to validate and find gaps in the specification
6. **Produces a structured plan file** at `docs/plans/YYYY-MM-DD-<type>-<name>-plan.md`
7. **Offers post-generation options**: deepen with research, get multi-agent review, start work, create issue

### Phase 2: Work (`/workflows:work`)

Execute the plan. Key features:
- Incremental commits after each completed task (not batched at end)
- Branch protection checks before starting
- Plan file used as living document -- checkboxes marked off as tasks complete
- Per-task progress tracking

### Phase 3: Review (`/workflows:review`)

Multi-agent parallel code review. Launches 10-15+ specialized agents simultaneously:

- `kieran-rails-reviewer`, `dhh-rails-reviewer` -- style conformance
- `security-sentinel` -- vulnerability assessment
- `performance-oracle` -- performance analysis
- `architecture-strategist` -- architectural compliance
- `pattern-recognition-specialist` -- anti-pattern detection
- `data-integrity-guardian` -- database/migration safety
- `code-simplicity-reviewer` -- minimalism pass
- `agent-native-reviewer` -- verify agent-native parity
- Conditional: `data-migration-expert`, `deployment-verification-agent`

Findings are triaged into P1 (critical, blocks merge), P2 (important), P3 (nice-to-have) and automatically written as file-based todos in `todos/` directory.

### Phase 4: Compound (`/workflows:compound`)

The learning capture phase. When a problem is solved:

1. **Six parallel sub-agents** analyze and document the solution:
   - Context Analyzer -- extracts YAML frontmatter skeleton
   - Solution Extractor -- captures root cause and fix with code examples
   - Related Docs Finder -- cross-references existing documentation
   - Prevention Strategist -- develops prevention approaches and test cases
   - Category Classifier -- determines optimal filing location
   - Documentation Writer -- assembles the complete markdown file
2. **Auto-triggers specialized agents** based on problem type (e.g., `performance-oracle` for performance issues)
3. **Creates structured documentation** in `docs/solutions/<category>/<filename>.md` with YAML frontmatter
4. **Auto-invokes** when it detects phrases like "that worked", "it's fixed", "problem solved"

---

## 3. Self-Improvement Mechanisms

### 3.1 Knowledge Compounding Through Documentation

The primary self-improvement mechanism is **documentation as institutional memory**:

- **`docs/solutions/`** -- Categorized solved problems with YAML frontmatter (module, date, problem_type, component, symptoms, root_cause, resolution_type, severity, tags)
- **`CLAUDE.md`** -- Accumulates preferences, patterns, and project context read every session
- **`docs/brainstorms/`** -- Preserved brainstorm outputs for future planning
- **`docs/plans/`** -- Structured plans that persist decisions
- **`todos/`** -- File-based work tracking with status, priority, dependencies

The YAML schema for solutions (`compound-docs/schema.yaml`) is remarkably detailed, covering 13 problem types, 17 component types, 16 root cause categories, and 10 resolution types. This structured metadata enables future agents to discover relevant solutions through targeted search.

### 3.2 The `/heal-skill` Command (Self-Healing for Skills)

This is the closest the plugin comes to explicit self-healing. When a skill's documentation is incorrect or outdated:

1. **Detect** which skill is malfunctioning from conversation context
2. **Reflect** on what went wrong and how the fix was discovered
3. **Present** proposed changes with before/after diffs
4. **Get approval** before making edits
5. **Apply** changes and optionally commit

This is a **human-in-the-loop self-repair** mechanism -- the agent identifies that its own instructions are wrong and proposes corrections, but requires human approval before applying them.

### 3.3 Self-Modification Reference (Theoretical Framework)

The `agent-native-architecture` skill includes a detailed reference on self-modification (`self-modification.md`) that describes:

- **Code modification**: agents reading, understanding, fixing, and committing their own source code
- **Prompt evolution**: agents editing their own system prompts based on feedback, adding notes to themselves, refining judgment criteria
- **Infrastructure control**: pulling updates, merging branches, restarting after changes, rolling back failures
- **Multi-instance architecture**: each agent instance on its own Git branch, sharing improvements via PRs to main
- **Required guardrails**: approval gates for code changes, auto-commit before changes, build verification before restart, health checks after restart, rollback mechanisms

Key code patterns from the reference:

```typescript
// Approval gates for code changes
tool("write_file", async ({ path, content }) => {
  if (isCodeFile(path)) {
    pendingChanges.set(path, content);
    const diff = generateDiff(path, content);
    return { text: `Requires approval:\n\n${diff}\n\nReply "yes" to apply.` };
  }
  writeFileSync(path, content);
  return { text: `Wrote ${path}` };
});

// Health check after restart
tool("health_check", async () => {
  const uptime = process.uptime();
  const buildValid = existsSync("dist/index.js");
  const gitClean = !runGit("status --porcelain");
  return { text: JSON.stringify({ status: "healthy", uptime, build: buildValid, git: gitClean }) };
});
```

**Important distinction**: This self-modification content is a **reference document for building agent-native applications**, not something the plugin itself implements. The plugin does not self-modify its own code autonomously.

### 3.4 Context Injection Pattern

The `dynamic-context-injection.md` reference describes how agents should receive runtime state:

- **Available resources** -- what data/files exist
- **Current state** -- recent activity, user context
- **Capabilities mapping** -- tool names mapped to user vocabulary
- **Domain vocabulary** -- explaining app-specific terms

This is injected into the system prompt at agent initialization and optionally refreshed during long sessions via a `refresh_context` tool.

---

## 4. Error Handling & Recovery

### 4.1 Explicit Error Handling Patterns

The plugin's approach to errors centers on:

1. **Structured findings from review**: Errors found during code review are automatically triaged, prioritized, and written as file-based todos
2. **Parallel resolution**: `/resolve_parallel`, `/resolve_pr_parallel`, `/resolve_todo_parallel` commands fix issues in parallel
3. **Bug reproduction**: `/reproduce-bug` command systematically reproduces bugs using logs, console, and browser automation
4. **Triage workflow**: `/triage` presents findings one-by-one for human decision (approve, skip, customize)

### 4.2 Recovery Mechanisms

- **Git as primary rollback**: `git reset --hard HEAD~1` for immediate reversal
- **Worktree isolation**: Changes happen in isolated Git worktrees to prevent contamination
- **Incremental commits**: Each task committed separately so individual changes can be reverted
- **Branch protection checks**: Before starting work, verifying the branch is safe

### 4.3 The ToolResult Pattern

The execution pattern separates success from continuation:

```typescript
// Tool can succeed AND stop (task complete)
// Tool can fail AND continue (recoverable error, try something else)
complete_task("summary") // → { success: true, shouldContinue: false }
read_file("/missing.txt") // → { success: false, shouldContinue: true }
```

### 4.4 Partial Completion & Checkpoint/Resume

For multi-step tasks:
- Tasks tracked with status: pending, inProgress, completed, failed, skipped
- Checkpoints saved with full conversation history, task state, and custom state
- Resume continues from where agent left off, not from the beginning
- Checkpoints expire after 1 hour by default

---

## 5. Agents, Skills, and Hooks

### 5.1 Agent Categories

**Review Agents (14)**: agent-native-reviewer, architecture-strategist, code-simplicity-reviewer, data-integrity-guardian, data-migration-expert, deployment-verification-agent, dhh-rails-reviewer, julik-frontend-races-reviewer, kieran-python-reviewer, kieran-rails-reviewer, kieran-typescript-reviewer, pattern-recognition-specialist, performance-oracle, security-sentinel

**Research Agents (4)**: best-practices-researcher, framework-docs-researcher, git-history-analyzer, repo-research-analyst

**Design Agents (3)**: design-implementation-reviewer, design-iterator, figma-design-sync

**Workflow Agents (5)**: bug-reproduction-validator, every-style-editor, lint, pr-comment-resolver, spec-flow-analyzer

**Docs Agents (1)**: ankane-readme-writer

### 5.2 Key Skills

| Skill | Relevance to Self-Healing |
|-------|---------------------------|
| `agent-native-architecture` | Core framework for building self-modifying agents. 13 reference documents covering architecture patterns, self-modification, context injection, action parity, testing, mobile patterns |
| `compound-docs` | Structured knowledge capture with YAML schema -- the "memory" system |
| `file-todos` | File-based work tracking with status lifecycle and dependency management |
| `create-agent-skills` | Meta-skill for creating new skills -- enables the system to extend itself |
| `brainstorming` | Structured ideation before planning |
| `git-worktree` | Isolated execution environments for parallel development |
| `skill-creator` | Guide for writing effective Claude Code skills |

### 5.3 The `/lfg` (Full Autonomous) Command

The most ambitious command chains the entire workflow autonomously:

```
1. /ralph-wiggum:ralph-loop "finish all slash commands" --completion-promise "DONE"
2. /workflows:plan $ARGUMENTS
3. /compound-engineering:deepen-plan
4. /workflows:work
5. /workflows:review
6. /compound-engineering:resolve_todo_parallel
7. /compound-engineering:test-browser
8. /compound-engineering:feature-video
9. Output DONE when video is in PR
```

This represents the highest level of autonomy: from idea to merged PR with video walkthrough, with minimal human intervention.

---

## 6. Patterns Worth Learning From

### 6.1 Parallel Multi-Agent Architecture

The plugin's most powerful pattern is **parallel specialized agents**. Rather than one monolithic review, 14+ agents run simultaneously, each with deep domain expertise. This is a form of ensemble intelligence -- combining diverse perspectives produces better results than any single perspective.

### 6.2 Structured Knowledge Capture

The YAML frontmatter schema for solutions is exceptionally well-designed. It balances structure (for machine searchability) with flexibility (for human-readable content). The schema covers:
- 13 problem types (build_error, test_failure, runtime_error, performance_issue, etc.)
- 17 component types (rails_model, frontend_stimulus, email_processing, etc.)
- 16 root cause categories (missing_association, missing_include, thread_violation, etc.)

### 6.3 Progressive Research Decision

The planning phase's "smart research decision" is elegant: always research high-risk topics, skip research when local context is strong, research when in unfamiliar territory. This prevents wasted effort while ensuring safety-critical areas get thorough investigation.

### 6.4 File-Based State Management

The `todos/` system uses the filesystem itself as a state machine:
- Filename encodes status: `001-pending-p1-fix.md` -> `001-ready-p1-fix.md` -> `001-complete-p1-fix.md`
- YAML frontmatter for metadata
- Dependencies tracked by issue ID
- Work logs for chronological history

### 6.5 Self-Healing Documentation Loop

The auto-invoke mechanism on `/workflows:compound` (triggered by "that worked", "it's fixed") creates a natural feedback loop where solutions are captured at the moment of highest context. The Prevention Strategist sub-agent then generates test cases and prevention strategies, turning each failure into a permanent defense.

### 6.6 Agent-Native Architecture Principles

The five core principles form a powerful design framework:
1. **Parity** -- agents can do anything users can
2. **Granularity** -- atomic tools, not workflow tools
3. **Composability** -- new features through new prompts
4. **Emergent Capability** -- agent handles unanticipated requests
5. **Improvement Over Time** -- accumulated context and prompt refinement

---

## 7. Identified Gaps & Opportunities for Bio-Inspired Approach

### 7.1 No Autonomous Healing (Human-in-the-Loop Required)

The `/heal-skill` command requires human approval before applying fixes. There is no mechanism for the agent to autonomously detect that something is wrong, diagnose the issue, apply a fix, verify the fix works, and continue -- all without human intervention.

**Bio-inspired opportunity**: Biological immune systems do not require conscious approval to respond to threats. An autonomous self-healing layer could detect anomalies (failed tests, error patterns, performance degradation), apply known fixes from `docs/solutions/`, verify the fix, and only escalate to human attention when the fix fails or the anomaly is novel.

### 7.2 No Continuous Health Monitoring

The plugin reacts to problems when they are encountered during work or review. There is no proactive monitoring that detects issues between sessions -- no heartbeat, no continuous scanning, no early warning system.

**Bio-inspired opportunity**: Biological organisms maintain homeostasis through continuous monitoring (body temperature, blood pressure, hormone levels). An agent could continuously monitor build status, test health, dependency vulnerabilities, log patterns, and performance metrics -- triggering healing responses before problems become critical.

### 7.3 Knowledge Decay and Staleness

`docs/solutions/` grows without bound. Old solutions may become irrelevant as the codebase evolves. There is no mechanism to age out, archive, or update stale documentation. CLAUDE.md can become bloated and contradictory over time.

**Bio-inspired opportunity**: Biological memory has both consolidation (strengthening useful memories) and forgetting (pruning irrelevant ones). A memory management system could track how often each solution is referenced, consolidate frequently-used patterns into more prominent positions, archive rarely-accessed solutions, and detect contradictions between old and new guidance.

### 7.4 No Adaptive Immune Response (Pattern Learning from Failures)

When a new type of failure occurs, the system documents it but does not create automated defenses. The next time a similar failure occurs, an agent must manually search `docs/solutions/` and apply the fix. There is no automated "antibody" that recognizes the pattern and prevents it.

**Bio-inspired opportunity**: The adaptive immune system creates antibodies after first exposure that respond automatically to subsequent encounters. The agent system could create automated detection rules or test cases from solved problems that actively prevent recurrence -- not just document the solution but install automated guards.

### 7.5 No Fitness Landscape or Selection Pressure

When multiple approaches exist for solving a problem, there is no mechanism to evaluate which approach is actually better over time. The system documents what was chosen but does not track outcomes or learn from the relative success of different approaches.

**Bio-inspired opportunity**: Natural selection operates on fitness. An agent system could track the outcomes of different approaches (bug recurrence rate, performance metrics, developer satisfaction) and use this data to evolve better default approaches over time.

### 7.6 No Homeostatic Regulation

The system has no concept of "normal ranges" or "healthy baselines" for codebase metrics. There is no mechanism that says "test coverage dropped below 80%, triggering regenerative action" or "build time increased by 40%, triggering optimization".

**Bio-inspired opportunity**: Homeostasis maintains biological systems within healthy ranges. An agent system could define healthy ranges for key metrics (test coverage, build time, error rates, dependency freshness, documentation coverage) and trigger corrective actions when metrics drift outside those ranges.

### 7.7 No Symbiotic Agent Relationships

Agents in the plugin are independent specialists that run in parallel but do not communicate with each other during execution. Agent A's findings do not influence Agent B's analysis in real-time.

**Bio-inspired opportunity**: Biological systems feature extensive inter-cellular communication (neurotransmitters, hormones, cytokines). Agents could share intermediate findings during parallel execution, allowing security findings to influence architecture analysis and vice versa. This would create emergent collective intelligence beyond what parallel independent analysis provides.

### 7.8 No Self-Replication or Spawning Based on Load

The system has a fixed set of agents. When the workload exceeds capacity (e.g., massive PR with 100+ files), the system does not dynamically spawn additional agents or decompose the work further.

**Bio-inspired opportunity**: Cell division responds to demand. An agent system could dynamically decompose work based on complexity, spawning specialized sub-agents for particularly complex subsystems and consolidating results.

### 7.9 No Metabolic Cost Awareness

While the plugin mentions model tier selection (Haiku/Sonnet/Opus), there is no dynamic optimization based on actual costs or budgets. There is no mechanism to say "we've spent $X this session, switching to more efficient models for remaining work."

**Bio-inspired opportunity**: Biological organisms carefully manage energy expenditure. An agent system could track token costs in real-time, dynamically adjust model tiers based on remaining budget, and make efficiency vs. quality tradeoffs based on task importance.

### 7.10 No Epigenetic Memory (Context-Dependent Behavior)

The system treats all projects the same. CLAUDE.md provides project-specific context, but there is no mechanism for the agent to develop project-specific behaviors that are more nuanced than what is explicitly documented -- behaviors that emerge from accumulated experience with a specific codebase.

**Bio-inspired opportunity**: Epigenetics allows organisms to express different genes based on environmental context. An agent could develop codebase-specific behavioral patterns (e.g., "in this codebase, SQL queries in this module tend to have N+1 problems") that are more granular than explicit documentation.

---

## 8. Summary: What Compound Engineering Gets Right

1. **The compounding loop is genuinely powerful** -- documenting solutions while context is fresh creates a virtuous cycle
2. **Parallel multi-agent review** catches more issues than any single review approach
3. **Structured metadata** (YAML frontmatter) makes knowledge searchable and actionable
4. **Progressive autonomy** -- from `/workflows:plan` (guided) to `/lfg` (fully autonomous)
5. **File-as-state-machine** pattern is elegant and agent-friendly
6. **Agent-native architecture principles** provide a strong theoretical foundation
7. **Smart research decisions** balance thoroughness with efficiency

## 9. Summary: Where Bio-Inspired Self-Healing Could Add Value

| Gap | Compound Engineering | Bio-Inspired Approach |
|-----|---------------------|----------------------|
| Healing autonomy | Human approval required | Autonomous immune response with escalation |
| Monitoring | Reactive (during sessions) | Continuous homeostatic monitoring |
| Knowledge management | Append-only documentation | Active consolidation, forgetting, contradiction detection |
| Pattern defense | Document solutions | Automated antibody-like guards |
| Approach evolution | Document choices | Fitness-based selection pressure |
| Metric regulation | No baselines | Homeostatic range maintenance |
| Agent communication | Independent parallel | Symbiotic inter-agent signaling |
| Resource management | Static model selection | Dynamic metabolic cost optimization |
| Behavioral adaptation | Explicit CLAUDE.md | Emergent epigenetic patterns |

The compound engineering plugin represents the current state-of-the-art in agent-assisted development workflow automation. Our bio-inspired approach should build on its strengths (structured knowledge capture, parallel multi-agent architecture, the compounding loop) while addressing the gaps where biological systems offer superior patterns for autonomy, adaptation, and resilience.
