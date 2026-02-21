# Claude Code Architecture: A Comprehensive Analysis

**Research Date:** 2026-02-20
**Scope:** Architecture, extensibility mechanisms, platform potential, and self-healing relevance

---

## Table of Contents

1. [Core Architecture](#1-core-architecture)
2. [The Hook System](#2-the-hook-system)
3. [The Skill System](#3-the-skill-system)
4. [The Memory System](#4-the-memory-system)
5. [The Sub-Agent System](#5-the-sub-agent-system)
6. [The Plugin/Extension Ecosystem](#6-the-pluginextension-ecosystem)
7. [MCP Server Integration](#7-mcp-server-integration)
8. [Agent Teams (Swarms)](#8-agent-teams-swarms)
9. [Claude Code as Platform](#9-claude-code-as-platform)
10. [The Agentic Coding Movement](#10-the-agentic-coding-movement)
11. [Complete Extensibility Map](#11-complete-extensibility-map)
12. [Self-Healing Relevance](#12-self-healing-relevance)
13. [Limitations](#13-limitations)
14. [Sources](#14-sources)

---

## 1. Core Architecture

### What Claude Code Is

Claude Code is a **terminal-native AI agent** that reads codebases, plans multi-step tasks, and executes them autonomously. It is not a chatbot in a terminal -- it is a sovereign agent designed to act under explicit constraints. As of version 2.1+, it operates as a full agentic system with tool use, memory, sub-agents, and verification loops.

### Architectural Principles

The system is built on several foundational principles:

- **Tool-based agency**: Claude Code operates through a defined set of tools (Read, Write, Edit, Bash, Grep, Glob, etc.) that it invokes to interact with the filesystem, terminal, and external services.
- **Permission-gated execution**: Agents begin with read-only access, require explicit approval to modify files or execute commands, and are sandboxed to the active project directory.
- **Context management**: Uses progressive disclosure and compaction to manage the finite context window efficiently.
- **Composability**: Follows Unix philosophy -- pipeable, scriptable, chainable with other tools.

### The Agent Loop

The fundamental architecture is an **agentic loop**:

```
User Prompt -> Claude Reasoning -> Tool Selection -> Tool Execution ->
  -> Result Observation -> Further Reasoning -> ... -> Final Response
```

At each step, Claude:
1. Receives context (user prompt, system prompt, CLAUDE.md, tool results)
2. Reasons about the next action
3. Selects and invokes a tool with specific parameters
4. Observes the tool's output
5. Decides whether to continue the loop or respond

### Built-in Tools

Claude Code exposes the following internal tools:

| Tool | Purpose |
|------|---------|
| `Read` | Read files from the filesystem |
| `Write` | Write new files |
| `Edit` | Make targeted edits to existing files |
| `Bash` | Execute shell commands |
| `Grep` | Search file contents with regex |
| `Glob` | Find files by pattern |
| `Skill` | Invoke a loaded skill |
| `Task` | Spawn a sub-agent for isolated work |
| `AskUserQuestion` | Request clarification from the user |
| `WebSearch` | Search the web |
| `WebFetch` | Fetch and process web content |
| `NotebookEdit` | Edit Jupyter notebook cells |
| MCP tools | Any tools provided by connected MCP servers (prefixed `mcp__<server>__<tool>`) |

### Execution Environments

Claude Code runs across multiple surfaces, all connected to the same underlying engine:

- **Terminal CLI** (full-featured, primary interface)
- **VS Code / Cursor extension** (inline diffs, @-mentions)
- **JetBrains plugin** (interactive diffs)
- **Desktop app** (visual diff review, multiple sessions)
- **Web** (browser-based, no local setup)
- **Slack** (route bug reports to PRs)
- **CI/CD** (GitHub Actions, GitLab CI/CD via headless mode)

### Headless / SDK Mode

Claude Code can run programmatically via:

- **CLI `-p` flag**: Non-interactive mode -- reads prompt, executes, returns result to stdout
- **TypeScript SDK**: `@anthropic-ai/claude-code` npm package
- **Python SDK**: Full programmatic control
- **`--allowedTools` flag**: Pre-approve specific tools for unattended execution

This enables integration into CI/CD pipelines, custom automation systems, and third-party tools.

---

## 2. The Hook System

Hooks are **user-defined shell commands that execute at specific points in Claude Code's lifecycle**. They provide deterministic control over behavior, ensuring certain actions always happen rather than relying on the LLM to choose to run them.

### Hook Event Types

There are **16 hook events** covering the complete lifecycle:

| Event | When It Fires | Matcher Input |
|-------|--------------|---------------|
| `SessionStart` | When a session begins or resumes | How the session started (`startup`, `resume`, `clear`, `compact`) |
| `UserPromptSubmit` | When user submits a prompt, before Claude processes it | No matcher support |
| `PreToolUse` | Before a tool call executes (can block it) | Tool name |
| `PermissionRequest` | When a permission dialog appears | Tool name |
| `PostToolUse` | After a tool call succeeds | Tool name |
| `PostToolUseFailure` | After a tool call fails | Tool name |
| `Notification` | When Claude sends a notification | Notification type |
| `SubagentStart` | When a subagent is spawned | Agent type |
| `SubagentStop` | When a subagent finishes | Agent type |
| `Stop` | When Claude finishes responding | No matcher support |
| `TeammateIdle` | When an agent team teammate is about to go idle | No matcher support |
| `TaskCompleted` | When a task is marked as completed | No matcher support |
| `ConfigChange` | When a configuration file changes | Config type |
| `PreCompact` | Before context compaction | Trigger type (`manual`, `auto`) |
| `SessionEnd` | When a session terminates | Reason (`clear`, `logout`, etc.) |

### Hook Types

There are three types of hooks:

1. **Command hooks** (`"type": "command"`): Run a shell command. Most common type.
2. **Prompt hooks** (`"type": "prompt"`): Send a prompt to a Claude model (Haiku by default) for single-turn evaluation. Returns `{"ok": true/false, "reason": "..."}`.
3. **Agent hooks** (`"type": "agent"`): Spawn a subagent that can read files, search code, and use tools to verify conditions. Returns the same `ok/reason` format. Up to 50 tool-use turns, 60-second default timeout.

### Hook Communication Protocol

Hooks communicate through **stdin, stdout, stderr, and exit codes**:

**Input (stdin):** JSON with event-specific data:
```json
{
  "session_id": "abc123",
  "cwd": "/Users/sarah/myproject",
  "hook_event_name": "PreToolUse",
  "tool_name": "Bash",
  "tool_input": {
    "command": "npm test"
  }
}
```

**Output (exit codes):**
- **Exit 0**: Action proceeds. For `SessionStart` and `UserPromptSubmit`, stdout is added to Claude's context.
- **Exit 2**: Action is **blocked**. Stderr message is fed back to Claude as feedback.
- **Any other exit code**: Action proceeds. Stderr is logged but not shown to Claude.

**Structured JSON output** (via stdout with exit 0):
```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "Use rg instead of grep for better performance"
  }
}
```

PreToolUse supports three permission decisions: `"allow"`, `"deny"`, `"ask"`.

### Hook Configuration Locations

| Location | Scope | Shareable |
|----------|-------|-----------|
| `~/.claude/settings.json` | All your projects | No |
| `.claude/settings.json` | Single project | Yes (committable) |
| `.claude/settings.local.json` | Single project | No (gitignored) |
| Managed policy settings | Organization-wide | Admin-controlled |
| Plugin `hooks/hooks.json` | When plugin is enabled | Yes |
| Skill/agent frontmatter | While skill/agent is active | Yes |

### Matcher Syntax

Matchers use **regex patterns** to filter which tools/events trigger a hook:

- `"Bash"` -- exact match
- `"Edit|Write"` -- matches either tool
- `"mcp__github__.*"` -- matches all GitHub MCP tools
- `""` (empty string) -- matches everything

### Key Hook Patterns

**Auto-format after edits:**
```json
{
  "PostToolUse": [{
    "matcher": "Edit|Write",
    "hooks": [{
      "type": "command",
      "command": "jq -r '.tool_input.file_path' | xargs npx prettier --write"
    }]
  }]
}
```

**Block protected files:**
```json
{
  "PreToolUse": [{
    "matcher": "Edit|Write",
    "hooks": [{
      "type": "command",
      "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/protect-files.sh"
    }]
  }]
}
```

**Re-inject context after compaction:**
```json
{
  "SessionStart": [{
    "matcher": "compact",
    "hooks": [{
      "type": "command",
      "command": "echo 'Reminder: use Bun, not npm. Run bun test before committing.'"
    }]
  }]
}
```

**Verify task completion with agent hook:**
```json
{
  "Stop": [{
    "hooks": [{
      "type": "agent",
      "prompt": "Verify that all unit tests pass. Run the test suite and check the results. $ARGUMENTS",
      "timeout": 120
    }]
  }]
}
```

### Hook Limitations

- Communicate through stdout/stderr/exit codes only -- cannot trigger slash commands or tool calls directly
- Default timeout: 10 minutes (configurable per hook)
- `PostToolUse` hooks cannot undo actions (tool already executed)
- `PermissionRequest` hooks do not fire in headless mode (`-p`)
- `Stop` hooks fire whenever Claude finishes responding, not only at task completion; do not fire on user interrupts

---

## 3. The Skill System

Skills are **markdown files with optional YAML frontmatter** that inject domain-specific instructions into Claude's context. They represent the primary mechanism for teaching Claude new capabilities.

### How Skills Work: Progressive Disclosure

Skills use a three-level loading architecture to manage context efficiently:

1. **Metadata level** (~100 tokens per skill): Skill name and description loaded into system prompt at session start.
2. **Core instructions** (<5,000 tokens typically): Full SKILL.md content loaded when Claude determines the skill is relevant to the current task.
3. **Nested resources** (unbounded): Supporting files, scripts, templates -- loaded only when the core instructions reference them.

This means you can have dozens of skills available without bloating the context window.

### SKILL.md Format

```yaml
---
name: my-skill
description: What this skill does and when to use it
argument-hint: [issue-number]
disable-model-invocation: true/false
user-invocable: true/false
allowed-tools: Read, Grep, Glob
model: sonnet/opus/haiku
context: fork
agent: Explore
hooks:
  PostToolUse:
    - matcher: "Edit"
      hooks:
        - type: command
          command: "./validate.sh"
---

Your skill instructions in markdown...
```

### Frontmatter Fields

| Field | Required | Description |
|-------|----------|-------------|
| `name` | No | Display name and slash command. Defaults to directory name. |
| `description` | Recommended | What the skill does. Claude uses this for automatic invocation. |
| `argument-hint` | No | Hint shown during autocomplete (e.g., `[issue-number]`) |
| `disable-model-invocation` | No | If `true`, only user can invoke (not Claude). Default: `false`. |
| `user-invocable` | No | If `false`, hidden from `/` menu. Default: `true`. |
| `allowed-tools` | No | Tools Claude can use without permission when skill is active. |
| `model` | No | Model to use when this skill is active. |
| `context` | No | Set to `fork` to run in a forked subagent context. |
| `agent` | No | Which subagent type to use when `context: fork`. |
| `hooks` | No | Hooks scoped to this skill's lifecycle. |

### Invocation Control

| Frontmatter | User Can Invoke | Claude Can Invoke |
|-------------|----------------|-------------------|
| (default) | Yes | Yes |
| `disable-model-invocation: true` | Yes | No |
| `user-invocable: false` | No | Yes |

### String Substitutions

| Variable | Description |
|----------|-------------|
| `$ARGUMENTS` | All arguments passed when invoking |
| `$ARGUMENTS[N]` or `$N` | Specific argument by 0-based index |
| `${CLAUDE_SESSION_ID}` | Current session ID |

### Dynamic Context Injection

The `` !`command` `` syntax runs shell commands before skill content is sent to Claude:

```yaml
---
name: pr-summary
description: Summarize changes in a pull request
context: fork
---

## Pull request context
- PR diff: !`gh pr diff`
- PR comments: !`gh pr view --comments`
```

Commands execute immediately; output replaces the placeholder.

### Skill Storage Locations

| Location | Path | Applies To |
|----------|------|------------|
| Enterprise | Managed settings | All users in organization |
| Personal | `~/.claude/skills/<name>/SKILL.md` | All your projects |
| Project | `.claude/skills/<name>/SKILL.md` | Current project only |
| Plugin | `<plugin>/skills/<name>/SKILL.md` | Where plugin is enabled |

### Skills in Subagents

Skills can interact with subagents in two directions:

1. **Skill with `context: fork`**: Skill content becomes the prompt that drives a subagent (Explore, Plan, general-purpose, or custom).
2. **Subagent with `skills` field**: Skill content is injected into the subagent's context at startup as reference material.

---

## 4. The Memory System

Claude Code implements a **hierarchical memory architecture** with six distinct memory locations:

### Memory Hierarchy

| Memory Type | Location | Purpose | Shared With |
|------------|----------|---------|-------------|
| **Managed policy** | `/Library/Application Support/ClaudeCode/CLAUDE.md` (macOS) | Organization-wide instructions | All users |
| **Project memory** | `./CLAUDE.md` or `./.claude/CLAUDE.md` | Team-shared project instructions | Team via VCS |
| **Project rules** | `./.claude/rules/*.md` | Modular topic-specific rules | Team via VCS |
| **User memory** | `~/.claude/CLAUDE.md` | Personal preferences for all projects | Just you |
| **Local project memory** | `./CLAUDE.local.md` | Personal project-specific prefs | Just you |
| **Auto memory** | `~/.claude/projects/<project>/memory/` | Claude's automatic notes | Just you |

### Loading Behavior

- **Parent CLAUDE.md files**: Loaded in full at launch (recursive up from cwd to root)
- **Child CLAUDE.md files**: Loaded on-demand when Claude reads files in those directories
- **Auto memory**: First 200 lines of `MEMORY.md` loaded into system prompt at session start
- **Rules files**: All `.md` files in `.claude/rules/` loaded automatically
- **Path-specific rules**: Rules with `paths:` frontmatter only apply when Claude works with matching files

### Auto Memory Architecture

Auto memory is Claude's own note-taking system:

```
~/.claude/projects/<project>/memory/
  MEMORY.md          # Concise index (first 200 lines loaded)
  debugging.md       # Topic-specific detailed notes
  api-conventions.md # API design decisions
  ...
```

- The `<project>` path is derived from the git repository root
- All subdirectories within the same repo share one memory directory
- Git worktrees get separate memory directories
- Topic files are read on-demand, not at startup
- Claude reads and writes these files during sessions

### CLAUDE.md Imports

CLAUDE.md files support `@path/to/import` syntax for importing additional files:

```markdown
See @README for project overview.
@docs/git-instructions.md
@~/.claude/my-project-instructions.md
```

- Relative paths resolve relative to the file containing the import
- Recursive imports supported (max depth: 5)
- First-time imports require user approval

### Path-Specific Rules

Rules in `.claude/rules/` can be scoped using YAML frontmatter:

```yaml
---
paths:
  - "src/api/**/*.ts"
  - "tests/**/*.test.ts"
---

# API Development Rules
- All API endpoints must include input validation
```

Supports glob patterns and brace expansion (`*.{ts,tsx}`).

---

## 5. The Sub-Agent System

Subagents are **specialized AI assistants that handle specific types of tasks**, each running in its own context window with a custom system prompt, specific tool access, and independent permissions.

### Built-in Subagents

| Agent | Model | Tools | Purpose |
|-------|-------|-------|---------|
| **Explore** | Haiku (fast) | Read-only | File discovery, codebase exploration |
| **Plan** | Inherited | Read-only | Research for planning mode |
| **General-purpose** | Inherited | All | Complex multi-step tasks |
| **Bash** | Inherited | Bash | Running terminal commands |
| **Claude Code Guide** | Haiku | Limited | Answering questions about Claude Code |

### AGENT.md Format

```yaml
---
name: code-reviewer
description: Reviews code for quality and best practices
tools: Read, Glob, Grep, Bash
disallowedTools: Write, Edit
model: sonnet
permissionMode: default
maxTurns: 50
skills:
  - api-conventions
  - error-handling-patterns
memory: user
background: false
isolation: worktree
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "./scripts/validate-command.sh"
---

You are a senior code reviewer. When invoked, analyze the code and provide
specific, actionable feedback on quality, security, and best practices.
```

### Frontmatter Fields

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Unique identifier (lowercase, hyphens) |
| `description` | Yes | When Claude should delegate to this agent |
| `tools` | No | Tool allowlist. Inherits all if omitted. |
| `disallowedTools` | No | Tool denylist |
| `model` | No | `sonnet`, `opus`, `haiku`, or `inherit` |
| `permissionMode` | No | `default`, `acceptEdits`, `dontAsk`, `bypassPermissions`, `plan` |
| `maxTurns` | No | Maximum agentic turns |
| `skills` | No | Skills to preload into subagent context |
| `memory` | No | Persistent memory scope: `user`, `project`, `local` |
| `background` | No | Always run as background task |
| `isolation` | No | Set to `worktree` for git worktree isolation |
| `hooks` | No | Lifecycle hooks scoped to this subagent |
| `mcpServers` | No | MCP servers available to this subagent |

### Subagent Scope/Priority

| Location | Scope | Priority |
|----------|-------|----------|
| `--agents` CLI flag | Current session | 1 (highest) |
| `.claude/agents/` | Current project | 2 |
| `~/.claude/agents/` | All projects | 3 |
| Plugin `agents/` | Where plugin enabled | 4 (lowest) |

### Execution Modes

**Foreground**: Blocks main conversation. Permission prompts pass through to user.

**Background**: Runs concurrently while user continues working. Pre-approves needed permissions before launching. Auto-denies anything not pre-approved. Cannot use MCP tools.

### Persistent Memory for Subagents

Subagents can maintain their own memory across sessions:

| Scope | Location | Use When |
|-------|----------|----------|
| `user` | `~/.claude/agent-memory/<name>/` | Knowledge across all projects |
| `project` | `.claude/agent-memory/<name>/` | Project-specific, shareable via VCS |
| `local` | `.claude/agent-memory-local/<name>/` | Project-specific, not committed |

When enabled, the subagent gets instructions for reading/writing memory, and `MEMORY.md` (first 200 lines) is injected into its system prompt.

### Key Constraints

- **Subagents cannot spawn other subagents** (prevents infinite nesting)
- Up to **10 concurrent tasks** supported with intelligent queuing
- Results return to main conversation (can consume significant context)
- Subagent transcripts stored at `~/.claude/projects/{project}/{sessionId}/subagents/`
- Auto-compaction at ~95% capacity (configurable via `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE`)

### Tool Restriction for Spawning

Agents running as main thread with `claude --agent` can restrict which subagents they spawn:
```yaml
tools: Task(worker, researcher), Read, Bash  # Only these subagents
```

---

## 6. The Plugin/Extension Ecosystem

Plugins are **discrete, installable bundles** that package skills, agents, hooks, MCP servers, and settings into shareable units.

### Plugin Directory Structure

```
my-plugin/
  .claude-plugin/
    plugin.json         # Manifest (required)
  commands/             # Slash commands (Markdown files)
  agents/               # Custom agent definitions
  skills/               # Agent Skills with SKILL.md files
  hooks/
    hooks.json          # Event handlers
  .mcp.json             # MCP server configurations
  .lsp.json             # LSP server configurations
  settings.json         # Default settings when plugin enabled
```

### Plugin Manifest (`plugin.json`)

```json
{
  "name": "my-plugin",
  "description": "What this plugin does",
  "version": "1.0.0",
  "author": {
    "name": "Author Name"
  },
  "homepage": "https://...",
  "repository": "https://...",
  "license": "MIT"
}
```

### Namespacing

Plugin skills are namespaced to prevent conflicts: `/my-plugin:skill-name`. The `name` field in `plugin.json` determines the namespace prefix.

### Distribution

Plugins are distributed through:
- **Plugin marketplaces** (GitHub repositories)
- **`/plugin install`** command
- **`--plugin-dir` flag** for local development
- **Anthropic's official directory** at `plugins.claude.ai`

### Plugin Settings

Plugins can ship default settings, currently supporting the `agent` key to activate a custom agent as the main thread:

```json
{
  "agent": "security-reviewer"
}
```

### LSP Server Support

Plugins can include Language Server Protocol configurations for code intelligence:

```json
{
  "go": {
    "command": "gopls",
    "args": ["serve"],
    "extensionToLanguage": {
      ".go": "go"
    }
  }
}
```

---

## 7. MCP Server Integration

The **Model Context Protocol (MCP)** is an open standard for connecting AI agents to external tools and data sources.

### Core Capabilities

MCP servers give Claude Code access to:
- Databases (query, analyze)
- APIs (Slack, GitHub, Jira, Figma, Asana)
- File systems (Google Drive, Dropbox)
- Custom internal tooling
- Monitoring and observability systems

### Server Types

- **Local process servers**: Communicate via stdin/stdout (most common)
- **HTTP/SSE servers**: Connect over network
- **Inline servers**: Execute within the SDK application

### MCP Tool Naming

MCP tools use the convention: `mcp__<server>__<tool>`
- Example: `mcp__github__search_repositories`
- Example: `mcp__slack__post_message`

### Tool Search (Dynamic Loading)

When MCP tool descriptions would consume more than 10% of the context window, Claude Code automatically enables **Tool Search**:
- Claude initially sees only the Tool Search Tool plus high-priority tools
- Everything else loads on-demand when needed
- Tools marked `defer_loading: true` are discoverable on-demand

### MCP Resources

MCP servers can expose resources referenceable via `@` mentions:
- Type `@` in your prompt to see available resources
- Resources appear alongside files in autocomplete

### Configuration

MCP servers are configured in:
- `.claude/settings.json` (project-level)
- `~/.claude/settings.json` (user-level)
- Plugin `.mcp.json` files
- Subagent `mcpServers` frontmatter field

---

## 8. Agent Teams (Swarms)

Agent Teams (research preview) coordinate **multiple Claude Code sessions working together** on a shared project.

### Architecture

- **Team Lead**: Main Claude Code session that creates the team, assigns tasks, synthesizes results
- **Teammates**: Separate Claude Code instances with their own context windows
- **Shared Task List**: With dependency tracking; tasks auto-unblock when dependencies complete
- **Messaging System**: Direct communication between agents

### Best Use Cases

- Research and review (parallel investigation)
- New modules/features (each teammate owns a piece)
- Debugging with competing hypotheses (test theories in parallel)
- Cross-layer coordination (frontend, backend, tests)

### Configuration

Disabled by default. Enable with:
```bash
CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
```

### Considerations

- Significantly more token usage than single session
- Coordination overhead
- Best when teammates can operate independently
- Not suited for sequential tasks or same-file edits

---

## 9. Claude Code as Platform

### The Platform Thesis

Claude Code has evolved from a coding assistant into a **platform for building agentic systems**. The key insight from SemiAnalysis's analysis: just as TCP/IP became foundational infrastructure but applications built atop it created the real value, token APIs are infrastructure -- the real breakthrough is **orchestration** combining tools, memory, sub-agents, and verification loops to create outcomes, not responses.

### Platform Primitives

Claude Code provides a layered set of primitives that can be composed:

```
Layer 4: Agent Teams (multi-session coordination)
Layer 3: Plugins (packaged bundles of extensions)
Layer 2: Skills | Sub-Agents | Hooks (behavioral extensions)
Layer 1: MCP Servers | Memory | Tools (foundational capabilities)
Layer 0: Claude Model + Context Window (reasoning engine)
```

### How Primitives Interact

The power of Claude Code as a platform comes from how these primitives compose:

1. **Skills + Subagents**: A skill can fork into a subagent (`context: fork`), or a subagent can preload skills into its context.
2. **Hooks + Tools**: PreToolUse hooks can validate, modify, or block any tool call. PostToolUse hooks can trigger side effects after any tool executes.
3. **Memory + Skills**: Skills can reference CLAUDE.md content; auto memory persists learnings that skills can build on.
4. **MCP + Subagents**: Subagents can have their own MCP server connections via the `mcpServers` frontmatter field.
5. **Hooks + Subagents**: SubagentStart/SubagentStop hooks in settings.json run when subagents spawn/complete. Subagent frontmatter hooks run within the subagent.
6. **Plugins bundle everything**: A single plugin can include skills, agents, hooks, MCP configs, LSP configs, and default settings.
7. **Agent Teams + Subagents**: Team members can use subagents internally, creating multi-level delegation.

### Customization Patterns

Common patterns emerging in the community:

- **Spec-driven development**: CLAUDE.md defines architecture; skills define implementation patterns
- **Self-reviewing workflows**: Stop hooks verify task completion before allowing Claude to finish
- **Auto-formatting pipelines**: PostToolUse hooks run formatters/linters after every edit
- **Protected file guards**: PreToolUse hooks block edits to sensitive files
- **Context persistence**: SessionStart hooks re-inject critical context after compaction
- **Compliance auditing**: ConfigChange hooks log all configuration modifications
- **Domain-specific agents**: Custom subagents with tailored tools and permissions for specific workflows

### Enterprise Extensibility

Organizations can deploy:
- **Managed policy CLAUDE.md**: Organization-wide instructions on all developer machines
- **Enterprise skills**: Skill distribution via managed settings
- **Plugin marketplaces**: Team-level or org-level plugin repositories
- **CI/CD integration**: Headless mode for automated review, triage, and deployment

### Growth Trajectory

- Business subscriptions quadrupled since start of 2026
- Enterprise represents over half of all Claude Code revenue
- 30+ products and features launched in January 2026 alone
- 4% of GitHub public commits authored by Claude Code (projected 20%+ by end of 2026)

---

## 10. The Agentic Coding Movement

### The Fundamental Shift

The software development lifecycle is undergoing one of its most significant changes since the GUI. Engineers are shifting from **writing code** to **coordinating agents that write code**, focusing expertise on architecture, system design, and strategic decisions.

### Key Statistics (2026)

- Developers use AI in roughly 60% of their work but can only fully delegate 0-20% of tasks
- Rakuten: 12.5M-line codebase implementation completed in 7 hours with 99.9% accuracy
- TELUS: 13,000+ custom AI solutions, 500,000+ hours saved
- Zapier: 89% AI adoption, 800+ agents deployed internally
- Accenture: 30,000-professional Claude training (largest deployment to date)

### Democratization Beyond Engineering

Agentic coding extends beyond engineering teams:
- Marketing, operations, HR building their own automation
- "Cowork" brings Claude Code capabilities to non-engineering knowledge work
- 11 open-source plugins for role-specific specialization (sales, legal, finance)

### Task Horizon Expansion

Per METR data, agent task horizons are **doubling every 4-7 months**:
- 30 minutes: Code snippets, bug fixes
- 1-2 hours: Feature implementation, complex debugging
- Multi-day: Full audits, system migrations
- Anthropic indicates Claude Code will soon handle 30-60 minutes autonomous work; Sonnet 4.5 has coded for 30+ hours straight

### "Vibe Coding"

The term describes the emerging paradigm where developers describe objectives in natural language rather than writing syntax. This fundamentally alters skill requirements: architecture, specification, and review become more important than syntax knowledge.

---

## 11. Complete Extensibility Map

### All Extensibility Points

| Extensibility Point | What It Controls | Direction |
|---------------------|-----------------|-----------|
| **CLAUDE.md** | System-level instructions and context | Input to Claude |
| **Auto Memory** | Claude's persistent self-notes | Bidirectional |
| **Rules (`.claude/rules/`)** | Modular, conditional instructions | Input to Claude |
| **Skills (SKILL.md)** | Task-specific instructions and workflows | Input to Claude |
| **Sub-Agents (AGENT.md)** | Isolated specialized assistants | Spawned by Claude |
| **Hooks (16 event types)** | Lifecycle interception and control | Intercepting Claude |
| **MCP Servers** | External tool and data connections | Extending Claude's tools |
| **Plugins** | Bundled extension packages | All of the above |
| **Agent Teams** | Multi-session coordination | Parallel Claude instances |
| **CLI Flags** | Session-level configuration | Launch-time control |
| **Headless/SDK Mode** | Programmatic access | External orchestration |
| **LSP Servers** | Code intelligence | Tool enhancement |
| **Managed Policies** | Organization-wide constraints | Admin control |
| **Permission Rules** | Tool-level access control | Security boundary |
| **Environment Variables** | Runtime behavior toggles | Configuration |

### Self-Healing Relevant Extensibility Points

For building self-healing mechanisms, the most relevant extensibility points are:

1. **`PostToolUseFailure` hook**: Fires when a tool call fails. Can capture the failure, analyze it, and inject corrective context.

2. **`Stop` hook (prompt/agent type)**: Can verify whether the task was actually completed correctly before allowing Claude to stop. If verification fails (`"ok": false`), Claude continues working with the reason as its next instruction.

3. **`PreToolUse` hook**: Can intercept and **modify tool inputs** before execution (since v2.0.10). This enables input sanitization, correction, and validation.

4. **`SessionStart` hook with `compact` matcher**: Re-injects critical context after compaction, preventing knowledge loss.

5. **`PreCompact` hook**: Fires before compaction, allowing you to capture and preserve critical state.

6. **Auto Memory**: Claude can write debugging insights and error patterns to persistent memory, building a knowledge base of past failures and solutions.

7. **Subagent persistent memory**: Specialized debugging/healing agents can accumulate knowledge across sessions.

8. **Agent hooks (type: "agent")**: Can spawn a full subagent to verify conditions, inspect the codebase, run tests -- providing deep verification capability.

9. **ConfigChange hook**: Can detect and respond to configuration drift.

10. **`TaskCompleted` hook**: Can validate task completion with arbitrary logic.

11. **MCP servers**: Can provide custom tools for health checking, monitoring, and automated repair.

12. **Skills with `context: fork`**: Can isolate healing/diagnostic operations in their own context window.

---

## 12. Self-Healing Relevance

### How Claude Code's Architecture Enables Self-Healing

Claude Code's architecture is remarkably well-suited for self-healing systems:

**Observation Loop**: The agent loop naturally observes the results of every action. When a tool call fails, Claude receives the error and can reason about corrections.

**Hook-Based Interception**: The 16 hook events create comprehensive interception points across the entire lifecycle. PreToolUse can prevent bad actions; PostToolUse/PostToolUseFailure can detect and respond to failures; Stop can verify completion.

**Layered Verification**: The three hook types (command, prompt, agent) provide escalating levels of verification sophistication:
- Command hooks: Fast, deterministic checks (exit codes, regex matching)
- Prompt hooks: LLM-powered judgment on single-turn decisions
- Agent hooks: Full agentic verification with tool access

**Persistent Learning**: Auto memory and subagent memory enable accumulation of knowledge about past failures, error patterns, and successful resolutions across sessions.

**Context Recovery**: SessionStart hooks with `compact` matcher enable re-injection of critical context after compaction, addressing the "forgetting" problem.

**Isolation**: Subagents and `context: fork` skills enable healing operations to run in isolated contexts without polluting the main conversation.

### Existing Self-Healing Patterns in the Wild

- **Self-healing CI**: Projects like `remorses/self-healing-ci` use Claude to automatically open PRs when CI fails
- **Self-healing n8n workflows**: Claude Code automatically detects, diagnoses, and fixes workflow errors
- **Error recovery skills**: Community-built skills for structured error diagnosis and recovery
- **Automatic snapshot/restore**: Tools like mrq provide instant recovery to previous working states

### Architecture for a Self-Healing Agent System

Based on the extensibility points, a self-healing agent system could be constructed as:

```
SessionStart hook (startup) -> Inject health baseline + recovery protocols
   |
PreToolUse hooks -> Validate and sanitize inputs before execution
   |
PostToolUse hooks -> Verify expected outcomes after each action
PostToolUseFailure hooks -> Capture failures, update error knowledge base
   |
Stop hook (agent type) -> Full verification: run tests, check constraints
   |
   +-- If ok: false -> Claude continues with specific recovery instructions
   +-- If ok: true  -> Session completes
   |
Auto Memory -> Persist failure patterns and solutions across sessions
Subagent Memory -> Specialized diagnostic agents accumulate domain knowledge
   |
SessionStart hook (compact) -> Re-inject healing context after compaction
PreCompact hook -> Preserve critical state before compaction
```

---

## 13. Limitations

### Architectural Limitations

- **Context window is finite**: Even with compaction, there is a hard limit on what Claude can hold in context at once. Performance degrades in the last 20% of the window.
- **Subagents cannot spawn subagents**: No recursive delegation. Maximum one level of nesting from the main conversation.
- **No persistent state between sessions** (beyond memory files): Each session starts fresh. No running background processes survive session boundaries.
- **Hooks cannot trigger tool calls**: Hooks communicate only through stdin/stdout/stderr/exit codes. They cannot directly invoke Claude's tools.
- **No real-time monitoring**: Hooks are event-driven, not continuous. You cannot set up a persistent watcher within Claude Code itself.
- **MCP tools unavailable in background subagents**: Background subagents cannot use MCP tools.

### Rate and Usage Limits

- Five-hour rolling window caps burst usage
- Weekly cap on total compute hours (varies by plan: Pro ~40-80 Sonnet hours, Max up to 480 Sonnet or 40 Opus hours)
- Shared usage pool across all Claude surfaces (claude.ai, Claude Code, Desktop)
- No manual resets or support overrides when limits are reached

### Operational Limitations

- **No undo for PostToolUse**: Cannot reverse actions already taken
- **PermissionRequest hooks skip in headless mode**: Must use PreToolUse instead for automated permission decisions
- **Stop hooks fire on every response completion**: Not just task completion; can create infinite loops if not handled carefully (must check `stop_hook_active`)
- **Shell profile interference**: Unconditional `echo` statements in `.zshrc`/`.bashrc` corrupt hook JSON output
- **Hook timeout**: Default 10 minutes; long-running validations need explicit timeout configuration
- **Skill context budget**: 2% of context window (with 16K character fallback); many skills can exceed this

### What You Cannot Do (Currently)

1. **Persistent background agents**: No daemon-like agent that continuously monitors and heals. Sessions are finite.
2. **Cross-session orchestration**: Agent teams and subagents exist within a single session. No built-in way to coordinate agents across separate sessions over time.
3. **Direct tool invocation from hooks**: Hooks can only return data/decisions to Claude; they cannot call Read, Write, or Bash directly within Claude's context.
4. **Dynamic skill loading at runtime**: Skills are discovered at session start. New skills created mid-session require restart or `/agents` reload.
5. **Real-time event streaming**: No WebSocket or streaming interface for external systems to observe Claude's actions in real-time (beyond transcript files).
6. **Custom tool registration at runtime**: Cannot add new tools mid-session without MCP server configuration.
7. **Guaranteed deterministic behavior**: The LLM may not always invoke the "right" skill or subagent; descriptions and prompts are probabilistic guidance.

---

## 14. Sources

### Official Documentation
- [Claude Code Overview](https://code.claude.com/docs/en/overview)
- [Automate workflows with hooks](https://code.claude.com/docs/en/hooks-guide)
- [Hooks reference](https://code.claude.com/docs/en/hooks)
- [Extend Claude with skills](https://code.claude.com/docs/en/skills)
- [Create custom subagents](https://code.claude.com/docs/en/sub-agents)
- [Manage Claude's memory](https://code.claude.com/docs/en/memory)
- [Create plugins](https://code.claude.com/docs/en/plugins)
- [Connect Claude Code to tools via MCP](https://code.claude.com/docs/en/mcp)
- [Orchestrate teams of Claude Code sessions](https://code.claude.com/docs/en/agent-teams)
- [Run Claude Code programmatically](https://code.claude.com/docs/en/headless)
- [Agent SDK overview](https://platform.claude.com/docs/en/agent-sdk/overview)

### Analysis and Commentary
- [Claude Code is the Inflection Point - SemiAnalysis](https://newsletter.semianalysis.com/p/claude-code-is-the-inflection-point)
- [Eight trends defining how software gets built in 2026 - Anthropic](https://claude.com/blog/eight-trends-defining-how-software-gets-built-in-2026)
- [2026 Agentic Coding Trends Report - Anthropic](https://resources.anthropic.com/hubfs/2026%20Agentic%20Coding%20Trends%20Report.pdf)
- [Inside Claude Code Skills: Structure, prompts, invocation - Mikhail Shilkov](https://mikhail.io/2025/10/claude-code-skills/)
- [Claude Agent Skills: A First Principles Deep Dive](https://leehanchung.github.io/blogs/2025/10/26/claude-skills-deep-dive/)
- [Claude Code Plugin Ecosystem - The Context Layer](https://medium.com/the-context-layer/claude-code-plugin-ecosystem-what-developers-need-to-know-about-the-latest-anthropic-release-55fb7a2b5aae)
- [Beyond Function Calling: How Claude Code's Plugin Architecture Is Redefining AI Development Tools](https://thamizhelango.medium.com/beyond-function-calling-how-claude-codes-plugin-architecture-is-redefining-ai-development-tools-67ccec9b5954)
- [The Rise of Agentic Programming: Code Assistants as Co-Workers](https://ppalme.wordpress.com/2026/01/23/the-rise-of-agentic-programming-code-assistants-as-co-workers-claude-code-literature-review/)
- [Claude Code and the Architecture of Autonomous Software Engineering in 2026](https://catalaize.substack.com/p/claude-code-and-the-architecture)

### Community Resources
- [awesome-claude-code - Curated list of skills, hooks, and plugins](https://github.com/hesreallyhim/awesome-claude-code)
- [Claude Code Extensibility Guide](https://happysathya.github.io/claude-code-extensibility-guide.html)
- [Claude Code Hooks Mastery](https://github.com/disler/claude-code-hooks-mastery)
- [Claude Code Plugins Community Registry](https://claude-plugins.dev/)
- [Anthropic Skills Repository](https://github.com/anthropics/skills)
- [Self-Healing CI](https://github.com/remorses/self-healing-ci)
- [Error Recovery Skill](https://playbooks.com/skills/madappgang/claude-code/error-recovery)
- [Claude Code's Memory Evolution](https://yuanchang.org/en/posts/claude-code-auto-memory-and-hooks/)
- [Claude Code's Experimental Memory System](https://giuseppegurgone.com/claude-memory)
- [Introducing Agent Skills - Anthropic](https://claude.com/blog/skills)
- [Claude Code power user customization: How to configure hooks](https://claude.com/blog/how-to-configure-hooks)
