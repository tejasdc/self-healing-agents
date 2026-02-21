# Deep Read: Two Claude Code Plugins

Research conducted 2026-02-21. Both plugins analyzed by reading actual source code.

---

## Table of Contents

1. [Claude Reflect System (Haddock Development)](#1-claude-reflect-system-haddock-development)
2. [Episodic Memory Plugin (obra / Jesse Vincent)](#2-episodic-memory-plugin-obra--jesse-vincent)
3. [Comparative Analysis](#3-comparative-analysis)
4. [Implications for Self-Healing Agents](#4-implications-for-self-healing-agents)

---

## 1. Claude Reflect System (Haddock Development)

**Repository**: [haddock-development/claude-reflect-system](https://github.com/haddock-development/claude-reflect-system)
**Language**: Python 3.8+
**License**: Not specified in repo root
**Philosophy**: "Correct once, never again"

### 1.1 Architecture Overview

The system is a Claude Code skill (not an MCP server or plugin in the modern sense). It installs into `~/.claude/skills/reflect/` and consists of:

**Core Scripts** (in `reflect/scripts/`):
- `reflect.py` -- Main orchestration engine
- `extract_signals.py` -- Regex + optional semantic signal detection
- `semantic_detector.py` -- AI-powered detection using `claude -p` CLI
- `update_skill.py` -- Safe YAML frontmatter manipulation with backups
- `present_review.py` -- Interactive terminal review UI (Accept/Modify/Skip/Quit)
- `hook-stop.sh` -- Shell hook for automatic reflection at session end
- `learning_ledger.py` -- SQLite cross-repo learning tracker
- `scope_analyzer.py` -- Determines project vs. global scope for learnings
- `meta_learning.py` -- Tracks pattern acceptance rates over time
- `promote_learning.py` -- Promotes skill-level learnings to global CLAUDE.md

**State** (in `reflect/.state/`):
- `auto-reflection.json` -- Enable/disable toggle
- `last-reflection.timestamp` -- Prevents duplicate runs

**Commands**: `/reflect`, `/reflect-on`, `/reflect-off`, `/reflect-status`, `/reflect-meta`, `/reflect-promote`, `/reflect-stats`

### 1.2 Signal Detection -- Deep Analysis

The system has TWO detection modes:

#### Phase 1: Regex Detection (default, fast)

Located in `extract_signals.py`. Three pattern categories:

**HIGH Confidence (score 0.85) -- Corrections**:
```python
CORRECTION_PATTERNS = [
    r"(?i)no,?\s+don't\s+(?:do|use)\s+(.+?)[,.]?\s+(?:do|use)\s+(.+)",
    r"(?i)actually,?\s+(.+?)\s+(?:is|should be)\s+(.+)",
    r"(?i)instead\s+of\s+(.+?),?\s+(?:you\s+should|use|do)\s+(.+)",
    r"(?i)never\s+(?:do|use)\s+(.+)",
    r"(?i)always\s+(?:do|use|check for)\s+(.+)",
    # Plus German equivalents: nein/immer/niemals
]
```
Triggers: Explicit negation ("No, don't..."), correction ("Actually..."), substitution ("Instead of..."), absolute directives ("Never/Always...").

**MEDIUM Confidence (score 0.65) -- Approvals**:
```python
APPROVAL_PATTERNS = [
    r"(?i)(?:yes,?\s+)?(?:that's\s+)?(?:perfect|great|exactly|correct)",
    r"(?i)works?\s+(?:perfectly|great|well)",
    r"(?i)(?:good|nice)\s+(?:job|work)",
]
```
Triggers: Positive affirmation of Claude's approach. Requires that the previous message was an assistant message (context check).

**LOW Confidence (score 0.45) -- Observations**:
```python
QUESTION_PATTERNS = [
    r"(?i)have\s+you\s+considered\s+(.+)",
    r"(?i)why\s+not\s+(?:try|use)\s+(.+)",
    r"(?i)what\s+about\s+(.+)",
]
```
Triggers: Suggestive questions that imply consideration without mandating change.

**Critical limitation**: These regexes are English-focused with minimal German support. They will miss most natural language corrections that don't follow these exact syntactic patterns. For example, "That's wrong, the function should return a Promise" would not match any HIGH pattern.

#### Phase 2: Semantic Detection (optional, via `--semantic` flag)

Located in `semantic_detector.py`. Uses `claude -p` (Claude CLI print mode) with Haiku model to analyze each user message.

The prompt template asks Claude to classify messages as:
- `correction` -- "User telling AI to do something differently"
- `positive` -- "User affirming good behavior"
- `explicit` -- "User explicitly asking to remember"

Returns structured JSON: `{is_learning, type, confidence, reasoning, extracted_learning}`.

**Merging logic**: When both regex and semantic run, the system takes the higher confidence score and combines metadata from both. Signals found by semantic only are added as new detections.

**Limitation**: The semantic detector shells out to `claude -p` via `subprocess.run()`, adding ~5-30 seconds per user message analyzed. This is why it is opt-in rather than default.

### 1.3 Pattern Analysis -- How It Works

From `extract_signals.py`, the analysis pipeline:

1. **Find latest transcript** -- Looks for `TRANSCRIPT_PATH` env var, falls back to `~/.claude/session-env/*/transcript.jsonl`
2. **Load JSONL messages** -- Standard Claude Code transcript format
3. **Find skill invocations** -- Scans for `Skill` tool calls and `/command` patterns to attribute learnings to specific skills
4. **Iterate user messages** -- For each user message, extracts a 5-message context window (the 5 preceding messages)
5. **Run regex patterns** -- Each matched pattern produces a signal dict with confidence, type, content, context, skills, and match groups
6. **Group by skill** -- Signals are bucketed by the skills they relate to

The context window of 5 messages is fixed. There is no sliding window, no weighting by recency, and no cross-session pattern detection at the regex level.

### 1.4 Skill Updates -- Mechanics

Located in `update_skill.py`. The update process:

1. **Parse SKILL.md** -- Splits YAML frontmatter (`---` delimiters) from markdown body using `yaml.safe_load()`
2. **Apply updates by confidence**:
   - HIGH: Adds to `## Critical Corrections` section with `Don't/Do` format
   - MEDIUM: Adds to `## Best Practices` section as bullet points
   - LOW: Adds to `## Advanced Considerations` section as "Consider:" bullets
3. **Reconstruct file** -- Merges frontmatter and body back together
4. **Validate YAML** -- Checks that `name` and `description` fields exist
5. **Write atomically** -- Direct file write (not actually atomic -- no temp-file-then-rename)

**Section insertion logic**: If the target section exists, content is appended before the next `## ` header. If the section does not exist, it is created (HIGH at the beginning, MEDIUM/LOW at the end).

### 1.5 Rollback Mechanism

From `update_skill.py`:

```python
def create_backup(skill_path: Path) -> Path:
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_dir = skill_path.parent / '.backups'
    backup_path = backup_dir / f'SKILL_{timestamp}.md'
    shutil.copy(skill_path, backup_path)
    cleanup_old_backups(backup_dir, days=30)
    return backup_path
```

- Backups stored in `~/.claude/skills/{skill}/.backups/SKILL_YYYYMMDD_HHMMSS.md`
- Auto-cleanup after 30 days
- On any exception during update, the backup is restored: `shutil.copy(backup_path, skill_path)`
- Git commit also provides version history (but requires manual `git init` in skills directory)

**Weakness**: The rollback is per-file only. If a multi-skill update partially succeeds, there is no transaction-level rollback. Each skill update is independent.

### 1.6 Manual vs. Automatic Modes

**Manual Mode** (`/reflect`):
- User triggers explicitly
- `reflect.py` runs synchronously
- `present_review()` shows interactive terminal UI with Accept/Modify/Skip/Quit
- User sees unified diff of proposed changes
- Human approval required for every change

**Automatic Mode** (`/reflect-on`):
- Enabled by writing `{"enabled": true}` to `.state/auto-reflection.json`
- `hook-stop.sh` runs as a Claude Code Stop hook
- Background process: spawns `reflect.py` via `( ... ) &` and immediately `exit 0`
- Uses file-based locking (`.state/reflection.lock`) with 10-minute stale lock timeout
- **Critical issue**: In auto mode, `present_review()` still requires interactive terminal input (stdin). The hook runs in background without a terminal. This means auto-mode with interactive review is broken unless the review is bypassed entirely. The code does not show a non-interactive path.

### 1.7 Learning Ledger -- Cross-Repo Tracking

Located in `learning_ledger.py`. Uses SQLite at `~/.claude/reflect/learnings.db`.

**Schema**:
```sql
CREATE TABLE learnings (
    id TEXT PRIMARY KEY,
    fingerprint TEXT UNIQUE NOT NULL,  -- SHA256 of normalized content
    content TEXT NOT NULL,
    learning_type TEXT,
    skill_name TEXT,
    repo_ids TEXT DEFAULT '[]',        -- JSON array of repo hashes
    count INTEGER DEFAULT 1,
    confidence REAL DEFAULT 0.5,
    status TEXT DEFAULT 'pending',     -- pending | promoted
    first_seen TEXT,
    last_seen TEXT,
    promoted_at TEXT
);

CREATE TABLE promotions (
    id TEXT PRIMARY KEY,
    fingerprint TEXT NOT NULL,
    from_scope TEXT,
    to_scope TEXT,
    reason TEXT,
    promoted_at TEXT
);
```

**Fingerprinting**: Content is lowercased, whitespace-normalized, then SHA256-hashed (first 16 chars). This means "Use uv instead of pip" and "use uv instead of pip" produce the same fingerprint.

**Repo identification**: Hashes `git remote get-url origin`, falling back to `os.getcwd()`.

**Promotion threshold**: Default 2 repos. When a learning appears in 2+ distinct repos, it becomes eligible for promotion to global `CLAUDE.md`.

### 1.8 Scope Analyzer

Located in `scope_analyzer.py`. Uses weighted keyword heuristics to decide project vs. global scope:

**Project indicators** (weighted 2-3): path patterns (`src/components/`, `docker-compose`), project-specific terms (`localhost:NNNN`, `internal`, `proprietary`), monorepo patterns (`pnpm -C packages/`).

**Global indicators** (weighted 2-3): universal engineering behaviors (`run tests`, `commit message`, `never commit secrets`), common tools (`git`, `docker`, `use uv/pip/npm`).

Decision rules:
1. Cross-repo threshold met --> promote to global
2. Global score > 1.5x project score AND >= 4 --> global
3. Project score > 1.5x global score AND >= 4 --> project
4. Default --> stay in skill scope

### 1.9 Meta-Learning

Located in `meta_learning.py`. Completely passive by default -- only records data, never changes behavior unless `--use-meta` flag is passed.

Tracks user decisions on proposed changes (accept/modify/skip/quit) as JSONL at `~/.claude/reflect/meta/feedback-log.jsonl`. Computes acceptance rates per pattern type.

**Scoring thresholds**:
- `< 20%` acceptance --> "deprecated" (adjustment: -0.3)
- `< 50%` acceptance --> "needs_review" (adjustment: -0.15)
- `>= 80%` acceptance --> "excellent" (adjustment: +0.1)
- Minimum 5 samples before any adjustment

This is a genuinely interesting feedback loop, but it requires opt-in activation and enough usage history to be useful.

### 1.10 Code Quality Assessment

**Strengths**:
- Well-structured modular design. Each script has a single responsibility
- Comprehensive signal pattern library with documentation
- The learning ledger + scope analyzer + promotion pipeline is a sophisticated multi-layer system
- Meta-learning feedback loop is a clever self-improving mechanism
- Safety mechanisms (backups, YAML validation, lock files) are present
- Multi-language support attempted (German patterns in regex, full multi-language in semantic mode)

**Weaknesses**:
- **Auto-mode appears broken**: The hook spawns a background process but `present_review.py` requires interactive stdin input. No non-interactive approval path exists
- **No tests**: No test files in the repository
- **Regex detection is brittle**: Only catches corrections that follow specific syntactic patterns. Natural corrections like "That's wrong -- use X" or "Actually I prefer Y" are partially covered but many phrasings will be missed
- **No embedding or vector search**: All detection is syntactic or requires live LLM calls
- **File writes are not atomic**: `open(file, 'w')` followed by `f.write()` can corrupt on crash
- **Skills-only target**: Can only modify `SKILL.md` files. Cannot update `CLAUDE.md`, hooks, or other configuration without the separate promote pipeline
- **No negative learning**: Cannot record "this correction was wrong" or "I reverted this learning"
- **No decay**: Learnings never expire or diminish in importance. Old corrections from 6 months ago have equal weight

### 1.11 What We Can Learn

1. **Confidence tiering** (HIGH/MEDIUM/LOW with numeric scores) is the right approach. The specific thresholds (0.85/0.65/0.45) and their mapping to skill sections is a clean pattern
2. **The backup-validate-write-rollback pipeline** is essential for any self-modifying system
3. **Meta-learning** (tracking acceptance rates of proposed changes) is a genuine innovation. Few systems close this feedback loop
4. **Cross-repo fingerprinting** for promotion is a useful pattern: learnings that survive across contexts are more likely to be universal truths
5. **The semantic detector pattern** (using a cheap LLM call to classify signals) is the right escape hatch from regex fragility

### 1.12 What We Can Improve

1. **Detection quality**: Replace regex-first with embedding-based semantic detection as the default. Regex should be a fast pre-filter, not the primary detector
2. **Non-interactive mode**: Auto-reflection needs a path that does not require stdin (e.g., auto-approve HIGH confidence, queue MEDIUM/LOW for next manual review)
3. **Negative signals**: Need to track when a user reverts a previously applied learning or explicitly says "that correction was wrong"
4. **Temporal decay**: Learnings should have a freshness weight. A correction from today matters more than one from 6 months ago
5. **Richer targets**: Should be able to modify CLAUDE.md, hooks, and MCP configurations, not just SKILL.md files
6. **Atomic writes**: Use temp-file-then-rename pattern for crash safety
7. **Test suite**: The system has no tests. Any self-modifying system absolutely must have tests
8. **Context quality**: 5-message fixed window is arbitrary. Should use semantic coherence to determine context boundaries
9. **Multi-turn pattern detection**: Cannot detect patterns that emerge across multiple exchanges (e.g., user corrects the same thing three times in a session)

---

## 2. Episodic Memory Plugin (obra / Jesse Vincent)

**Repository**: [obra/episodic-memory](https://github.com/obra/episodic-memory)
**Blog post**: [Fixing Claude Code's amnesia](https://blog.fsck.com/2025/10/23/episodic-memory/)
**Version installed**: 1.0.15
**Location**: `/Users/tejasdc/.claude/plugins/cache/superpowers-marketplace/episodic-memory/1.0.15/`
**Language**: TypeScript (ESM)
**License**: MIT
**Dependencies**: `@anthropic-ai/claude-agent-sdk`, `@modelcontextprotocol/sdk`, `@xenova/transformers`, `better-sqlite3`, `sqlite-vec`, `marked`, `zod`

### 2.1 Architecture -- The 6 Components

Based on both documentation and source code analysis:

#### Component 1: Core Library (`src/`)
TypeScript library providing indexing, parsing, embedding, and search functionality. This is the engine that everything else wraps.

Key files:
- `db.ts` -- SQLite schema, migrations, CRUD operations
- `embeddings.ts` -- Vector embedding generation
- `parser.ts` -- JSONL conversation file parser
- `indexer.ts` -- Orchestrates parse -> embed -> store pipeline
- `search.ts` -- Vector + text search with multi-concept AND logic
- `sync.ts` -- File sync from `~/.claude/projects` to archive
- `summarizer.ts` -- LLM-powered conversation summarization
- `show.ts` -- Markdown/HTML conversation renderer
- `verify.ts` -- Index health checks and repair
- `types.ts` -- TypeScript interfaces
- `paths.ts` -- XDG-compliant path resolution
- `constants.ts` -- Summarizer context markers

#### Component 2: CLI Tools
Unified command interface (`episodic-memory sync|search|show|stats|index`). Each command has a corresponding `*-cli.ts` file that wraps the core library.

#### Component 3: MCP Server (`src/mcp-server.ts`)
Exposes two MCP tools via stdio transport:
- `search` -- Semantic/text/both search with Zod-validated input
- `read` -- Display conversation with optional line-range pagination

Registered as `episodic-memory` MCP server in the plugin system.

#### Component 4: Claude Code Plugin Integration
- **hooks.json**: Registers a `SessionStart` hook that runs `episodic-memory sync --background` asynchronously on every session start/resume
- **skills/remembering-conversations/SKILL.md**: Teaches Claude when to search episodic memory
- **commands/search-conversations.md**: Provides `/search-conversations` command
- **agents/search-conversations.md**: Defines a Haiku subagent for conversation search

#### Component 5: Embedding System (`src/embeddings.ts`)
Uses `@xenova/transformers` with model `Xenova/all-MiniLM-L6-v2`:

```typescript
embeddingPipeline = await pipeline(
  'feature-extraction',
  'Xenova/all-MiniLM-L6-v2'
);
```

- **Model**: all-MiniLM-L6-v2 (384 dimensions, ~22M parameters)
- **Runs locally**: No API calls, uses ONNX runtime via Transformers.js
- **Truncation**: Input text truncated to 2000 characters (model has 512 token limit)
- **Pooling**: Mean pooling with L2 normalization
- **Embedding composition**: Combines `User: {message}\n\nAssistant: {response}\n\nTools: {tool_names}` into a single embedding per exchange

#### Component 6: Storage Layer (`src/db.ts`)

SQLite with two extensions:
- `better-sqlite3` -- Synchronous SQLite3 bindings for Node.js
- `sqlite-vec` -- Vector similarity search extension

**Full schema** (from source code, confirmed against `docs/SCHEMA.md`):

```sql
-- Core table: one row per user-assistant exchange pair
CREATE TABLE exchanges (
    id TEXT PRIMARY KEY,              -- MD5 hash of archivePath:lineStart-lineEnd
    project TEXT NOT NULL,            -- Project directory name
    timestamp TEXT NOT NULL,          -- ISO timestamp
    user_message TEXT NOT NULL,       -- Full user message text
    assistant_message TEXT NOT NULL,  -- Full assistant message text
    archive_path TEXT NOT NULL,       -- Path to archived JSONL file
    line_start INTEGER NOT NULL,     -- Start line in JSONL
    line_end INTEGER NOT NULL,       -- End line in JSONL
    embedding BLOB,                  -- Raw embedding (unused - vec_exchanges used instead)
    last_indexed INTEGER,            -- Unix timestamp of last indexing
    parent_uuid TEXT,                -- Links to parent exchange (conversation threading)
    is_sidechain BOOLEAN DEFAULT 0,  -- True if subagent conversation
    session_id TEXT,                  -- Claude Code session ID
    cwd TEXT,                        -- Working directory at time of exchange
    git_branch TEXT,                 -- Git branch at time of exchange
    claude_version TEXT,             -- Claude Code version
    thinking_level TEXT,             -- "none", "high", etc.
    thinking_disabled BOOLEAN,
    thinking_triggers TEXT           -- JSON array
);

-- Tool usage tracking
CREATE TABLE tool_calls (
    id TEXT PRIMARY KEY,
    exchange_id TEXT NOT NULL REFERENCES exchanges(id),
    tool_name TEXT NOT NULL,
    tool_input TEXT,      -- JSON
    tool_result TEXT,
    is_error BOOLEAN DEFAULT 0,
    timestamp TEXT NOT NULL
);

-- Vector index (sqlite-vec virtual table)
CREATE VIRTUAL TABLE vec_exchanges USING vec0(
    id TEXT PRIMARY KEY,
    embedding FLOAT[384]  -- 384 dimensions from MiniLM
);
```

**Indexes**: timestamp (DESC), session_id, project, is_sidechain, git_branch, tool_name, tool_exchange.

**WAL mode**: Enabled for better concurrent read/write performance.

**Migration system**: Checks `pragma_table_info()` for missing columns and adds them via `ALTER TABLE`. Migrations are idempotent.

### 2.2 Archival Hook -- How It Works

From `hooks/hooks.json`:
```json
{
  "hooks": {
    "SessionStart": [{
      "matcher": "startup|resume",
      "hooks": [{
        "type": "command",
        "command": "node ${CLAUDE_PLUGIN_ROOT}/cli/episodic-memory.js sync --background",
        "async": true
      }]
    }]
  }
}
```

The hook fires on **session start** (not session end), running sync asynchronously. This means:
- The current session's conversations are NOT indexed during that session (they don't exist yet at start time)
- Previous sessions' conversations ARE synced and indexed
- The `--background` flag and `async: true` prevent blocking the session startup

**Sync process** (from `sync.ts`):

1. Walk `~/.claude/projects/` directory tree
2. For each `.jsonl` file, compare mtime with archived copy
3. If newer or not yet copied: atomic copy (write to `.tmp.PID`, then `rename()`)
4. Check exclusion markers (`DO NOT INDEX THIS CHAT` or summarizer context marker)
5. Parse conversation, generate embeddings, insert into SQLite
6. Generate summaries for up to 10 conversations per sync (configurable limit)
7. Return result with counts of copied, skipped, indexed, summarized, and errors

**Archive location**: `~/.config/superpowers/conversation-archive/{project}/{uuid}.jsonl`

### 2.3 Semantic Search -- Implementation Details

From `search.ts`:

**Vector search** (cosine distance via sqlite-vec):
```typescript
const stmt = db.prepare(`
  SELECT e.*, vec.distance
  FROM vec_exchanges AS vec
  JOIN exchanges AS e ON vec.id = e.id
  WHERE vec.embedding MATCH ?
    AND k = ?
    ${timeClause}
  ORDER BY vec.distance ASC
`);
```

The query embedding is generated using the same MiniLM model, then passed as a `Float32Array` buffer. sqlite-vec performs approximate nearest neighbor search.

**Text search** (LIKE-based, NOT full-text search):
```typescript
const textStmt = db.prepare(`
  SELECT ... FROM exchanges AS e
  WHERE (e.user_message LIKE ? OR e.assistant_message LIKE ?)
  ORDER BY e.timestamp DESC
`);
```

Note: Despite the `MCP-TOOLS.md` documentation mentioning "FTS5 full-text index", the actual code uses plain `LIKE '%query%'`. There is no FTS5 virtual table in the schema.

**Combined mode** ("both"): Runs vector search first, then text search, deduplicates by ID, merges results.

**Multi-concept AND search** (`searchMultipleConcepts`):
1. Search each concept independently with 5x the limit (to get enough candidates)
2. Build a map of `archivePath -> results[]`
3. Filter to conversations where ALL concepts are represented
4. Score by average similarity across concepts
5. Sort by average similarity descending

**Similarity scoring**: `1 - distance` (sqlite-vec returns cosine distance, so similarity = 1 - distance).

### 2.4 Haiku Subagent -- What It Does

From `agents/search-conversations.md`:

```yaml
model: haiku
tools: Read, mcp__plugin_episodic-memory_episodic-memory__search, mcp__plugin_episodic-memory_episodic-memory__show
```

The Haiku subagent is a dedicated lightweight agent specifically for conversation search. Its job:

1. Receive a search query from the main agent
2. Execute `search` MCP tool to find relevant conversations
3. Read the top 2-5 results using the `read` MCP tool
4. Synthesize findings into 200-1000 words
5. Return synthesis + source pointers (project, date, file path, line range, match %)

**Why a subagent?** Context management. Reading raw conversations directly from the main agent would consume enormous context. The Haiku subagent acts as a summarization/filtering layer, returning only actionable insights. The documentation claims this saves "50-100x context compared to loading raw conversations directly."

**The subagent is instructed to**:
- Focus on decisions, solutions, alternatives considered, gotchas
- Include specific details (function names, error messages, line numbers)
- NOT include raw conversation excerpts
- NOT exceed 1000 words

### 2.5 Summarizer -- How Summaries Work

From `summarizer.ts`:

Uses `@anthropic-ai/claude-agent-sdk`'s `query()` function with Haiku model (configurable via env vars).

**Short conversations** (<=15 exchanges): Single LLM call with the full conversation text and a detailed prompt asking for 2-4 sentence factual summary in `<summary></summary>` tags.

**Long conversations** (>15 exchanges): Hierarchical summarization:
1. Split into chunks of 8 exchanges
2. Summarize each chunk independently (2-3 sentences)
3. Synthesize chunk summaries into a final coherent paragraph (max 200 words)

**Model fallback**: If Haiku hits a thinking budget error, retries with Sonnet.

**Self-exclusion**: The summarizer prompt includes `SUMMARIZER_CONTEXT_MARKER`, which is checked by the sync process to exclude summarizer conversations from being indexed (preventing recursive indexing).

**Summary storage**: Written as `{uuid}-summary.txt` alongside the `.jsonl` file in the archive.

### 2.6 Conversation Parser -- JSONL Processing

From `parser.ts`:

Parses Claude Code JSONL transcript format:
- Reads line by line, tracking line numbers
- Filters for `type: "user"` and `type: "assistant"` messages
- Accumulates assistant messages (multiple assistant messages per user turn are concatenated)
- Extracts text from both string and array content blocks
- Captures tool_use blocks from assistant messages (name, input)
- Generates exchange ID as MD5 hash of `archivePath:lineStart-lineEnd`
- Captures metadata: parentUuid, isSidechain, sessionId, cwd, gitBranch, claudeVersion, thinkingMetadata

**Sidechain handling**: The parser preserves `isSidechain` and `parentUuid` fields, allowing the system to distinguish main conversation from subagent interactions.

### 2.7 Index Verification and Repair

From `verify.ts`:

Checks for:
- **Missing**: Conversation files without summary files
- **Orphaned**: Database entries whose archive files no longer exist
- **Outdated**: Files modified after their `last_indexed` timestamp
- **Corrupted**: Files that fail to parse

Repair process:
1. Delete orphaned database entries
2. Re-index missing and outdated conversations (re-parse, re-embed, re-summarize)
3. Report corrupted files for manual review

### 2.8 Limitations -- Where It Falls Short

**Confirmed from source code analysis**:

1. **No memory decay or pruning**: Every conversation is indexed forever with equal weight. There is no temporal decay, no forgetting curve, no relevance scoring based on recency. A conversation from 6 months ago has the same retrieval weight as one from yesterday

2. **No negative traces**: The system cannot record "we tried X and it failed" or "this decision was reversed." Episodic memory is purely positive/neutral -- it remembers what happened but not what was wrong

3. **No sleep consolidation**: There is no periodic process that reviews memories, merges related ones, extracts patterns, or distills key learnings. Each exchange is stored independently without any higher-level synthesis beyond the per-conversation summary

4. **Truncation at 2000 characters**: The embedding model's input is truncated to 2000 characters. Long exchanges with critical details past the 2000-char mark will have incomplete semantic representation

5. **Text search is LIKE, not FTS**: Despite documentation suggesting FTS5, the actual implementation uses `LIKE '%query%'` which is O(n) scan and case-sensitive in SQLite by default (though the code does not explicitly set case sensitivity)

6. **No cross-project learning**: Each exchange is tagged with a project, but there is no mechanism to identify patterns across projects or promote frequently-seen approaches

7. **Summary quality depends on Haiku**: Using Haiku for summarization prioritizes speed/cost over quality. Important nuances may be lost in summary generation

8. **Session start hook, not session end**: Conversations are synced at the START of the next session, not at the END of the current one. This means the most recent session's conversations are never available during that session

9. **Single embedding per exchange**: Each user-assistant pair gets one embedding. If an exchange covers multiple topics (common in long turns), only the dominant semantic is captured

10. **No tool result content in embeddings**: Tool call names are included in embeddings, but tool results (which often contain the actual valuable information like code output or search results) are not

### 2.9 Code Quality Assessment

**Strengths**:
- **Production-grade TypeScript**: Clean module boundaries, proper TypeScript interfaces, Zod validation for MCP inputs
- **Well-thought-out schema**: Rich metadata capture (cwd, git_branch, thinking_level, tool_calls) enables sophisticated future queries
- **Atomic file operations**: The sync uses temp-file-then-rename for crash-safe copies
- **Idempotent operations**: Sync and index are safe to run concurrently and repeatedly
- **WAL mode**: Proper SQLite concurrency handling
- **Migration system**: Forward-compatible schema evolution via column checks
- **Test infrastructure**: vitest configured with test directory (though tests were not examined in this analysis)
- **Configurable summarization**: Env vars for model, endpoint, timeout, and fallback
- **Plugin structure**: Proper hooks, agents, skills, commands, and MCP server -- follows Claude Code plugin conventions

**Weaknesses**:
- Text search uses LIKE instead of FTS5 (performance issue at scale)
- Embedding truncation at 2000 chars may lose important context
- No error recovery for partial sync failures (errors are logged but processing continues)
- The `embedding BLOB` column in exchanges table appears unused (vec_exchanges is the actual vector store)
- Summary generation limit of 10 per sync may cause large backlogs

### 2.10 What We Can Build On

The episodic-memory system is a solid foundation for a "hippocampus" component:

1. **The SQLite + sqlite-vec architecture is reusable**. The schema design, WAL mode, migration system, and vector search integration are production-ready

2. **The MCP server pattern is correct**. Using `@modelcontextprotocol/sdk` with Zod validation and proper error handling is the right approach for tool exposure

3. **The subagent pattern for context management** is powerful. Dispatching a Haiku subagent to search and synthesize prevents context bloat in the main agent

4. **The JSONL parser is thorough**. It handles all Claude Code message types, tool calls, sidechains, and metadata

5. **The sync + archive pattern** preserves conversations that Claude Code would otherwise delete after 30 days

### 2.11 What We Need to Add

For self-healing agents, episodic memory needs:

1. **Temporal decay**: Implement a forgetting curve. Recent memories should have higher retrieval weight. Options:
   - Exponential decay factor on similarity scores based on age
   - Periodic "consolidation" that promotes repeatedly-accessed memories and demotes rarely-accessed ones
   - Access count tracking (memories accessed more frequently resist decay)

2. **Negative traces**: Record failures, reversions, and errors as first-class memories. Schema addition:
   ```sql
   ALTER TABLE exchanges ADD COLUMN valence TEXT DEFAULT 'neutral';
   -- values: 'positive', 'negative', 'neutral', 'corrected'
   ```

3. **Sleep consolidation**: A periodic background process that:
   - Clusters related memories
   - Extracts recurring patterns into explicit rules
   - Identifies contradictions between memories
   - Promotes frequently-validated approaches to CLAUDE.md or skills
   - Merges duplicate memories

4. **Pattern extraction**: Move from pure recall ("what happened") to generalization ("what pattern does this suggest"). This bridges episodic -> semantic memory

5. **Bidirectional linking with corrections**: When a learning from the reflect system modifies a skill, link that modification to the episodic memory that triggered it. Creates an audit trail

6. **Multi-exchange embeddings**: Instead of one embedding per exchange, generate topic-level embeddings that span multiple exchanges within a conversation

7. **Access tracking**: Record when and how often each memory is retrieved. High-access memories are valuable; never-accessed memories can be pruned

---

## 3. Comparative Analysis

| Dimension | Claude Reflect System | Episodic Memory |
|---|---|---|
| **Primary function** | Learn from corrections, update skills | Remember past conversations, enable recall |
| **Storage** | YAML in SKILL.md files + SQLite ledger | SQLite with vector search |
| **Detection** | Regex + optional LLM semantic detection | Local embedding model (MiniLM) |
| **Search** | No search -- operates on current session only | Vector similarity + text search |
| **Memory scope** | Single session (no cross-session recall) | All archived sessions |
| **Output target** | Modifies SKILL.md files (and optionally CLAUDE.md) | Returns search results via MCP |
| **Automation** | Hook on session stop | Hook on session start |
| **Human oversight** | Interactive review required (manual mode) | Fully automatic (no approval needed) |
| **Language** | Python | TypeScript |
| **LLM dependency** | Optional (semantic mode uses Claude CLI) | Required for summarization (Haiku) |
| **Local ML** | None | Transformers.js (MiniLM) |
| **Feedback loop** | Meta-learning tracks acceptance rates | None |
| **Cross-repo** | Learning ledger with fingerprinting | None |
| **Maturity** | Ambitious design, some implementation gaps | Production-ready, well-tested |

### Key Insight

These two plugins are complementary halves of a complete learning system:
- **Episodic Memory** = **recall** ("what happened before?")
- **Claude Reflect** = **adaptation** ("how should I change based on what happened?")

Neither alone is sufficient. Episodic memory remembers but does not learn. Reflect learns but does not remember. A self-healing agent needs both: the ability to recall past experiences AND the ability to extract patterns from those experiences and modify its own behavior.

---

## 4. Implications for Self-Healing Agents

### 4.1 Architecture Patterns to Adopt

1. **Tiered confidence with numeric scores** (from Reflect): HIGH/MEDIUM/LOW with 0.0-1.0 scores provides clean decision boundaries for automatic vs. human-reviewed changes

2. **SQLite + sqlite-vec as the memory substrate** (from Episodic): Local, fast, concurrent, and supports both structured queries and semantic search. No external dependencies

3. **Haiku subagent for context management** (from Episodic): Never load raw memories into the main agent. Always filter and synthesize through a dedicated subagent

4. **Meta-learning feedback loops** (from Reflect): Track which proposed changes are accepted/rejected. Use this to tune detection sensitivity over time

5. **Cross-repo fingerprinting for promotion** (from Reflect): Learnings that survive across contexts are more likely to be universal truths worthy of promotion to global configuration

6. **Atomic operations with rollback** (from both): Any self-modifying operation must create a backup, validate the output, and have a clear rollback path

### 4.2 Gaps Neither Plugin Addresses

1. **No decay/forgetting**: Both systems store everything forever. A self-healing agent needs to forget outdated learnings and reduce noise over time

2. **No consolidation**: Neither system periodically reviews and synthesizes its stored knowledge. There is no "sleep" phase

3. **No negative learning**: Neither system tracks failures, reversions, or explicitly-wrong corrections as first-class entities

4. **No causal modeling**: Neither system understands WHY a correction was made or WHY a decision was right. They store WHAT happened but not the causal structure

5. **No conflict resolution**: When two memories or two learnings contradict each other, neither system has a resolution strategy

6. **No proactive retrieval**: Episodic memory only searches when asked. A self-healing agent should proactively surface relevant memories based on the current task context

7. **No continuous evaluation**: Neither system measures whether its interventions actually improved outcomes. The feedback loop exists in Reflect's meta-learning but is passive and opt-in

### 4.3 What We Should Build

A unified system that combines:
- Episodic memory's **storage and retrieval** (SQLite + vectors + archival)
- Reflect's **signal detection and skill modification** (pattern extraction + safe updates)
- **NEW**: Temporal decay and consolidation ("sleep" cycles)
- **NEW**: Negative traces and failure memory
- **NEW**: Proactive retrieval (search automatically when context suggests relevance)
- **NEW**: Continuous evaluation (did this learning actually help?)
- **NEW**: Conflict resolution (when memories contradict, which wins?)

This would form the "hippocampus" of a self-healing agent -- encoding experiences, consolidating them into skills, and gradually forgetting what is no longer relevant.

---

## Sources

- [haddock-development/claude-reflect-system](https://github.com/haddock-development/claude-reflect-system) -- Full source code read via GitHub API
- [obra/episodic-memory](https://github.com/obra/episodic-memory) -- Full source code read from local installation at `/Users/tejasdc/.claude/plugins/cache/superpowers-marketplace/episodic-memory/1.0.15/`
- [Fixing Claude Code's amnesia](https://blog.fsck.com/2025/10/23/episodic-memory/) -- Jesse Vincent's design blog post
- [Episodic Memory on ClaudePluginHub](https://www.claudepluginhub.com/plugins/obra-episodic-memory)
- [Episodic Memory DeepWiki](https://deepwiki.com/obra/episodic-memory/1.1-getting-started)
