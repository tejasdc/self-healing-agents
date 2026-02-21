# VIGIL: A Reflective Runtime for Self-Healing Agents -- Deep Read

**Paper**: "VIGIL: A Reflective Runtime for Self-Healing LLM Agents"
**Author**: Christopher Cruz
**ArXiv**: [2512.07094](https://arxiv.org/abs/2512.07094) (December 8, 2025)
**Repository**: [github.com/cruz209/V.I.G.I.L](https://github.com/cruz209/V.I.G.I.L)
**Acronym**: Verifiable Inspection and Guarded Iterative Learning

---

## 1. Architecture in Detail

### The Core Idea

VIGIL is not an agent that does tasks. It is an agent that *watches another agent do tasks* and autonomously diagnoses and repairs that agent's behavioral degradation. The key insight is decoupling supervision from execution: VIGIL operates as a **sibling supervisor**, not an inner loop. It never touches the task agent's runtime directly. Instead, it reads logs, builds a persistent emotional model of the agent's behavioral health, diagnoses problems using a structured framework, and proposes fixes in two forms: prompt patches and code diffs.

### Five-Layer Architecture

The system is organized as five tightly coupled operational layers, each feeding the next in a strict pipeline:

```
                    +---------------------------+
                    |   ORCHESTRATION LAYER     |
                    |  (Stage-Gated Pipeline)   |
                    |                           |
                    |  start --> eb_updated     |
                    |    --> diagnosed           |
                    |    --> prompt_done         |
                    |    --> diff_done           |
                    +---------------------------+
                              |
            Controls execution order of:
                              |
     +------------+-----------+-----------+------------+
     |            |           |           |            |
     v            v           v           v            v
+---------+ +---------+ +---------+ +---------+ +---------+
| OBSERVE | | REFLECT | | DIAGNOSE| | ADAPT   | | ADAPT   |
| (Logs)  | | (Emo-   | | (RBT)  | | (Prompt)| | (Code)  |
|         | |  Bank)  | |         | |         | |         |
+---------+ +---------+ +---------+ +---------+ +---------+
     |            |           |           |            |
     v            v           v           v            v
  events.    EmoBank.     RBT        Prompt      Unified
  jsonl      jsonl      Report     .adaptive     .diff
                                    section      files
```

### Full System Diagram (Text)

```
+================================================================+
|                     TARGET AGENT (e.g., Robin-A)                |
|  Executes tasks, calls tools, emits structured event logs      |
|  via Universal Tool Call Protocol (UTCP)                       |
+================================================================+
         |
         | writes events to
         v
+------------------+
| logs/events.jsonl|   <-- Structured JSONL event stream
+------------------+
         |
         | read by (up to 500 events, 24-hour window)
         v
+================================================================+
|                        V.I.G.I.L RUNTIME                       |
|                                                                |
|  +----------------------------------------------------------+  |
|  | LAYER 1: OBSERVATION                                     |  |
|  |                                                          |  |
|  |  - Ingests JSONL event logs from target agent            |  |
|  |  - Filters by configurable time window (default 24h)    |  |
|  |  - Caps at 500 most recent events                       |  |
|  |  - Validates schema: ts, kind, status, payload          |  |
|  +----------------------------------------------------------+  |
|         |                                                       |
|         v                                                       |
|  +----------------------------------------------------------+  |
|  | LAYER 2: REFLECTION (Appraisal Engine + EmoBank)         |  |
|  |                                                          |  |
|  |  Appraisal Engine (DETERMINISTIC, no LLM):              |  |
|  |  - Maps each event to {emotion, valence, intensity,     |  |
|  |    cause} using rule-based heuristics                   |  |
|  |  - Emotions: frustration, pride, relief, curiosity,     |  |
|  |    anxiety, joy, gratitude, calm, determination         |  |
|  |  - Valence: {-1, 0, +1}                                |  |
|  |  - Intensity: float [0, 1]                             |  |
|  |                                                          |  |
|  |  EmoBank (Persistent Affective Memory):                 |  |
|  |  - Stores appraisals in JSONL with episode hashing      |  |
|  |  - Exponential decay: I_decayed = I * 0.5^((t'-t)/h)   |  |
|  |    where h = 12 hours (configurable half-life)          |  |
|  |  - Deposit policies: noise floor, coalescing, rebound   |  |
|  |  - Computes snapshots: dominant emotion, top-3,         |  |
|  |    composite signals (energy, stress, motivation, focus) |  |
|  +----------------------------------------------------------+  |
|         |                                                       |
|         v                                                       |
|  +----------------------------------------------------------+  |
|  | LAYER 3: DIAGNOSIS (RBT Engine)                          |  |
|  |                                                          |  |
|  |  Roses/Buds/Thorns classification:                      |  |
|  |  - Roses: pride, joy, gratitude, relief, calm           |  |
|  |    (intensity >= 0.5)                                   |  |
|  |  - Buds: positive valence >= 0.2 OR curiosity           |  |
|  |    (intensity >= 0.3)                                   |  |
|  |  - Thorns: frustration, anxiety                         |  |
|  |    (intensity >= 0.4)                                   |  |
|  |                                                          |  |
|  |  Output: structured diagnostic report with              |  |
|  |  categorized behavioral patterns                        |  |
|  +----------------------------------------------------------+  |
|         |                                                       |
|         v                                                       |
|  +----------------------------------------------------------+  |
|  | LAYER 4: ADAPTATION                                      |  |
|  |                                                          |  |
|  |  4a. Prompt Patch Generator:                            |  |
|  |  - Modifies BEGIN_ADAPTIVE_SECTION...END_ADAPTIVE_SECTION|  |
|  |  - CORE_IDENTITY block is byte-for-byte immutable       |  |
|  |  - Abort if core identity mutation detected             |  |
|  |                                                          |  |
|  |  4b. Code Proposal Engine (Strategy Engine):            |  |
|  |  - Scans target repo with regex-based hotspot detection |  |
|  |  - Strategy modules score candidate files               |  |
|  |  - Generates unified diffs + PR summaries               |  |
|  |  - Output: output/proposals/patch_<ts>.diff             |  |
|  |           output/proposals/PR_<ts>.md                   |  |
|  +----------------------------------------------------------+  |
|         |                                                       |
|         v                                                       |
|  +----------------------------------------------------------+  |
|  | LAYER 5: ORCHESTRATION (Stage Gate)                      |  |
|  |                                                          |  |
|  |  Enforces: start -> eb_updated -> diagnosed ->          |  |
|  |            prompt_done -> diff_done                     |  |
|  |                                                          |  |
|  |  - Each phase MUST complete before next begins          |  |
|  |  - Out-of-order tool calls raise explicit exceptions    |  |
|  |  - Prevents LLM from improvising invalid sequences     |  |
|  +----------------------------------------------------------+  |
|                                                                |
+================================================================+
         |
         v
+------------------+     +------------------+
| output/proposals/|     | Updated agent    |
| patch_*.diff     |     | prompt with new  |
| PR_*.md          |     | ADAPTIVE section |
+------------------+     +------------------+
```

### Crucially: What Is Deterministic vs. LLM-Driven

This is one of the most important design decisions in VIGIL. The majority of the pipeline is **deterministic code**, not LLM inference:

- **Deterministic (no LLM)**: Event ingestion, appraisal engine, EmoBank decay/coalescing/deposit policies, RBT threshold classification, strategy selection, stage-gate enforcement
- **LLM-driven**: The orchestrator that sequences tool calls, narrative generation in diagnostic reports, prompt patch composition, possibly strategy reasoning

This hybrid design means the system is auditable and reproducible in its core logic, while using the LLM only for the creative/compositional parts where flexibility is needed.

---

## 2. The Supervisory Pattern

### How the Supervisor Monitors the Worker

VIGIL implements a **decoupled, asynchronous supervisory pattern**:

1. **No direct observation of the agent's internal state**. VIGIL never intercepts the agent's reasoning, chain-of-thought, or tool calls in real-time. It only reads what the agent has already written to its event log.

2. **Log-mediated supervision**. The target agent (e.g., Robin-A) writes structured events to `logs/events.jsonl` following the Universal Tool Call Protocol (UTCP). Every interaction -- timestamps, tool inputs/outputs, system feedback -- gets logged. VIGIL reads this log file after the fact.

3. **Batch, not streaming**. VIGIL processes logs episodically, not in real-time. It is manually triggered rather than running as a continuous monitor. This is a stated limitation.

### What Signals It Observes

VIGIL does not look for crashes or exceptions in the traditional sense. Its core innovation is detecting **soft failures** -- behaviors that are syntactically correct but semantically wrong. The signals it tracks:

- **Event status fields**: `fail`, `delay`, `success`, `timeout` -- mapped to emotions
- **Timing data**: Latency between invocation and receipt (e.g., 97-second delay mapped to high-intensity frustration)
- **Temporal patterns**: Accumulation of negative events over time windows
- **Absence of positive signals**: No roses (positive emotions) appearing at all is itself a diagnostic signal
- **Sequence violations**: Events that happen in wrong order (e.g., success toast before backend receipt)

### How It Decides When to Intervene

VIGIL does not make a binary "intervene/don't intervene" decision. Instead, it runs its full pipeline every time it is invoked and produces artifacts (diagnostics, prompt patches, code diffs) that represent its recommendations. The key mechanisms:

- **Thorns threshold**: If frustration or anxiety accumulate at intensity >= 0.4, they become Thorns in the RBT diagnosis, signaling critical failures requiring remediation
- **Absence of Roses**: When the diagnostic report contains zero Roses, this signals systemic behavioral brittleness
- **Accumulation over time**: The EmoBank's exponential decay means that persistent problems (recurring frustration) maintain high decayed intensity, while transient blips fade. This creates a natural signal-to-noise filter

The system is currently batch-triggered by a human, so the "decision to intervene" is really "what to recommend when asked." The paper acknowledges that real-time streaming intervention is a future direction.

---

## 3. Behavioral Logs

### What Gets Logged

The target agent logs every interaction following the Universal Tool Call Protocol (UTCP). Each event captures:

- **Timestamp** (`ts`): ISO-8601 format (though the paper notes Robin-A had inconsistencies between naive localtime and UTC)
- **Event type** (`kind`): Describes what happened (e.g., `reminder.toast`, `reminder.set`, `tool.call`)
- **Status** (`status`): Outcome of the event (e.g., `success`, `fail`, `delay`, `timeout`)
- **Payload** (`payload`): Contextual data specific to the event type

### Exact Format

Events are stored in JSONL (one JSON object per line) at `logs/events.jsonl`:

```json
{
  "ts": "2025-10-31T23:59:59Z",
  "kind": "reminder.toast",
  "status": "delay",
  "payload": {
    "delayed_by_sec": 97,
    "scheduled_utc": "2025-10-31T23:58:22Z"
  }
}
```

### How Logs Are Processed

1. **Ingestion**: VIGIL reads the JSONL file and filters to the most recent 500 events within a configurable time window (default: 24 hours)
2. **Appraisal**: Each event is passed through the deterministic appraisal engine which maps `(kind, status, payload)` tuples to `(emotion, valence, intensity, cause)` tuples
3. **Example mapping**: An event with `status='fail'` and `delayed_by_sec=180` maps to `{emotion: "frustration", valence: -1, intensity: 0.9, cause: "reminder.toast:delay"}`
4. **Deposit to EmoBank**: Appraised emotions are deposited into persistent storage subject to deposit policies

### Gaps in the Log Specification

The paper does not provide:
- A complete enumeration of valid `kind` values
- A complete enumeration of valid `status` values
- Required vs. optional fields in `payload`
- How custom event types are added or validated

---

## 4. Persistent Data Bank (EmoBank)

### What Is Stored

EmoBank is a persistent affective memory stored as JSONL. Each entry contains:

```json
{
  "ts": "2025-10-31T23:59:59Z",
  "emotion": "frustration",
  "intensity": 0.9,
  "valence": -1,
  "cause": "reminder.toast:delay",
  "episode": "a3f8c2e1..."
}
```

Fields:
- **ts**: Timestamp of the appraisal
- **emotion**: Discrete emotion label (frustration, pride, relief, curiosity, anxiety, joy, gratitude, calm, determination)
- **intensity**: Float in [0, 1] representing strength of the emotion
- **valence**: Integer in {-1, 0, +1} representing emotional direction
- **cause**: Human-readable attribution string linking emotion to its source event
- **episode**: Hash enabling grouping of related entries for episodic indexing without log rewriting

### How It Is Structured

EmoBank uses append-only JSONL storage with three deposit policies that filter and shape what gets persisted:

#### 1. Noise Floor
Entries with intensity < 0.25 are **discarded** -- UNLESS they invert prior valence. This exception is important: a weak positive signal following persistent negatives is meaningful even at low intensity.

#### 2. Coalescing
If an entry has the **same emotion and cause** as a prior entry within a **5-minute window**, no new row is created. Instead, the prior entry's intensity is **amplified** (with a cap to prevent runaway). This prevents log spam from repeated failures while still strengthening the signal.

#### 3. Rebound Injection
When a **positive-valenced emotion** follows a **negative-valenced emotion** within **10 minutes**, a synthetic `"determination"` entry is injected with `valence: +0.4, intensity: 0.3-0.4`. This models emotional recovery -- the system recognizes that bouncing back from failure is itself a meaningful behavioral signal.

### Decay Mechanism

To prioritize recent signals over stale ones, EmoBank applies exponential decay:

```
I_decayed = I * 0.5^((t' - t) / h)
```

Where:
- `I` = original intensity
- `t'` = current time
- `t` = time of the original entry
- `h` = half-life in hours (default: 12 hours)

This means an emotion at intensity 0.9 becomes:
- 0.45 after 12 hours
- 0.225 after 24 hours
- 0.1125 after 36 hours

Old emotions fade but are never deleted -- complete provenance is preserved.

### How It Is Queried (Snapshots)

VIGIL computes **decayed snapshots** that aggregate the current state of the EmoBank:

- **Dominant emotion**: The single emotion with highest decayed intensity
- **Top-3 emotions**: Ranked by decayed intensity
- **Composite signals**: Derived from weighted subsets of emotions:
  - **Energy**: (formula not specified in paper)
  - **Stress**: (formula not specified in paper)
  - **Motivation**: (formula not specified in paper)
  - **Focus**: (formula not specified in paper)

The paper does not disclose the exact weights or formulas for composite signals -- this is a gap in the specification.

---

## 5. Diagnostics (RBT Classification)

### The Roses/Buds/Thorns Framework

RBT is borrowed from retrospective/feedback methodologies. VIGIL adapts it as a structured diagnostic classification:

- **Roses** (Strengths / What's working): Positive emotions indicating healthy behavior
- **Buds** (Opportunities / What's emerging): Weak positive signals or curiosity indicating potential
- **Thorns** (Failures / What's broken): Negative emotions indicating degradation

### Classification Mechanism

The classification uses **hardcoded thresholds** on the decayed EmoBank state:

| Category | Qualifying Emotions | Conditions |
|----------|-------------------|------------|
| **Roses** | pride, joy, gratitude, relief, calm | intensity >= 0.5 |
| **Buds** | Any with positive valence >= 0.2; curiosity | intensity >= 0.3 |
| **Thorns** | frustration, anxiety | intensity >= 0.4 |

### What the Diagnostic Output Looks Like

The RBT diagnosis produces a structured report that the adaptation layer uses as evidence for generating remediations. In the Robin-A case study:

- **Roses**: None (zero positive reinforcement detected -- a critical signal in itself)
- **Buds**: Weak signals near eventual receipt confirmations
- **Thorns**: Repeated high-intensity frustration (0.9) across all reminder emissions, anxiety about timestamp inconsistencies

### Key Insight: Absence Is a Signal

The diagnostic engine's power comes not just from what it finds but from what it **doesn't** find. Zero Roses across a 24-hour window is a stronger signal of systemic failure than any individual Thorn. This is a pattern worth adopting.

---

## 6. Guarded Prompt Updates

### How VIGIL Modifies Prompts

VIGIL generates prompt modifications constrained to a specific delimited section of the agent's system prompt:

```
## BEGIN_CORE_IDENTITY
[Original agent identity, purpose, behavioral constraints]
[This section is IMMUTABLE]
## END_CORE_IDENTITY

## BEGIN_ADAPTIVE_SECTION
[Auto-generated reflection and behavioral guidance]
[This section is modified by VIGIL]
## END_ADAPTIVE_SECTION
```

### The Guards

Three protective mechanisms prevent bad modifications:

#### 1. Core Identity Immutability
The `BEGIN_CORE_IDENTITY...END_CORE_IDENTITY` block must remain **byte-for-byte identical** before and after any prompt patch. If any mutation is detected, the entire patch operation is **aborted**. This prevents VIGIL from accidentally altering the agent's fundamental purpose, personality, or safety constraints.

#### 2. Delimited Scope
Only content between `BEGIN_ADAPTIVE_SECTION` and `END_ADAPTIVE_SECTION` markers can be modified. This creates a clear boundary between human-authored identity and machine-generated adaptations.

#### 3. Evidence Grounding
Prompt patches are generated from RBT diagnostic evidence, not from freeform LLM generation. The adaptive section reflects specific diagnosed issues with specific remediation instructions, traceable back to the EmoBank entries that motivated them.

### Example: Robin-A Prompt Patch

After diagnosing Robin-A's issues, VIGIL generated an adaptive section containing:

1. **Gate success toasts on backend acknowledgment** -- do not emit success confirmation until receipt is verified
2. **Log `receipt_lag_ms` for observability** -- instrument the latency between invocation and receipt
3. **Normalize all timestamps to UTC using ISO-8601** -- eliminate naive localtime inconsistencies
4. **Implement single retry with jittered exponential backoff** -- handle transient failures gracefully
5. **Emit structured error toasts with stable reason codes on repeated failure** -- provide meaningful feedback

### How Bad Modifications Are Prevented

- **Byte-for-byte check**: The core identity is checksummed or compared character-by-character; any deviation causes abort
- **Scope restriction**: Physical impossibility of modifying content outside the adaptive delimiters
- **Stage gating**: Prompt patches can only be generated after diagnosis is complete (state must be `diagnosed` before `prompt_done` transition)
- **Artifact persistence**: All prompt patches are versioned and stored, enabling rollback and audit

---

## 7. The 100% to 0% Result

### What Was the Failure?

**Premature success toasts**: Robin-A, a reminder agent, was emitting "success" confirmations to users **before** the backend had actually confirmed the reminder was set. Every single one of its 12 reminder operations exhibited this behavior -- 12/12, or **100% premature toast rate**.

This is a textbook **soft failure**: the agent's code didn't crash, no exceptions were thrown, the task technically "completed." But the user experience guarantee was violated. Users were told their reminder was set when it hadn't been confirmed yet.

### What VIGIL Detected

Through its appraisal engine, VIGIL identified:

- **100% premature success toasts** (12/12 operations)
- **97-second average latency** between initial invocation and actual backend receipt
- **Timestamp inconsistency**: Mixed naive localtime and UTC ISO formats across events
- **No crashes**: All failures were silent -- syntactically correct but semantically compromised

The EmoBank accumulated 8 high-intensity frustration events (intensity 0.9) and persistent anxiety. Zero Roses emerged. Only weak Buds appeared near eventual receipts.

### What VIGIL Proposed

Two categories of remediation:

**Prompt patch**: Modified the adaptive section to instruct the agent to gate success toasts on backend acknowledgment, normalize timestamps, implement retry logic, and emit structured error messages.

**Code patch**: Generated `utils/reliability.py` containing:
- `to_utc_iso()`: Converts naive timestamps to UTC-normalized ISO-8601
- `call_with_retry()`: Wraps tool calls with jittered exponential backoff
- `structured_toast()`: Emits metadata-rich messages with error codes
- `wait_for_receipt()`: Polls backend with configurable timeout
- `gate_success_on_receipt()`: Conditionally emits success only after verified receipt

### Before/After Metrics

| Metric | Before | After |
|--------|--------|-------|
| Premature toasts | 12/12 (100%) | 0/12 (0%) |
| Mean latency | 97 seconds | 8 seconds |
| Frustration events | 8 (high intensity) | 0 |
| Receipt gating | None | Enforced |
| UTC timestamping | Inconsistent | Standardized |

### How It Was Measured

- Re-execution of Robin-A with the applied modifications over the same task set
- EmoBank telemetry compared before/after: high-intensity frustration/anxiety replaced by low-to-moderate relief and curiosity
- Zero new Thorns in the post-remediation diagnostic pass

### The Meta-Level Self-Repair

During the diagnostic phase, VIGIL itself encountered a failure: its `diagnose_rbt()` tool hit a schema mismatch where `_fetch_recent_events()` received conflicting keyword arguments (`hours` parameter provided both explicitly and as default). Rather than failing silently, VIGIL:

1. Captured the complete Python traceback
2. Parsed the error line and recognized the fault signature
3. Constructed a diagnostic artifact describing the schema conflict
4. Proposed two concrete remediations (call-site omission or signature modification)
5. Continued via fallback logic using cached EmoBank state
6. After manual correction following VIGIL's own recommendation, re-execution succeeded

This demonstrated **meta-procedural self-repair**: the system diagnosing and fixing its own diagnostic tools.

---

## 8. What We Can Adopt for Claude Code

### Direct Mappings

| VIGIL Component | Claude Code Equivalent | Adaptation Needed |
|----------------|----------------------|-------------------|
| Event logs (JSONL) | Hooks output / session logs | Need structured event emission from hooks |
| EmoBank | Memory system (episodic-memory MCP) | Need decay mechanism, not just storage |
| RBT Diagnostics | Skills / CLAUDE.md analysis | Need automated diagnostic skill |
| Adaptive prompt section | CLAUDE.md sections | Already have CLAUDE.md; need delimited adaptive sections |
| Core identity immutability | Top-level CLAUDE.md directives | Already enforced by user authoring |
| Stage-gated pipeline | Skill sequencing | Need orchestration layer |
| Code proposals | Git diffs / PR creation | Already have `gh` and git tools |

### Specific Mechanisms to Adopt

#### 1. Structured Event Logging via Hooks
Implement hooks that emit JSONL events for every significant Claude Code operation:
- Tool calls (success/failure/timeout)
- File edits (accepted/rejected/reverted)
- Command execution (exit codes, timing)
- Session patterns (duration, task completion rate)

Map to: **Pre/post command hooks** that write to a persistent log file.

#### 2. Behavioral Health Tracking with Decay
Create a persistent data store (could be a JSONL file in `.claude/`) that tracks behavioral signals with exponential decay:
- Track patterns like "repeated failed tool calls to same endpoint"
- Track "user frequently reverts Claude's edits" (semantic failure)
- Apply 12-hour half-life so stale signals fade

Map to: **Episodic memory MCP** or a simple JSONL file managed by a skill.

#### 3. Diagnostic Skill (RBT Pattern)
Build a skill that reads behavioral logs and classifies patterns:
- **Roses**: Things Claude Code is doing well (fast completions, accepted edits, successful builds)
- **Buds**: Emerging patterns worth reinforcing (new tool usage, successful unfamiliar tasks)
- **Thorns**: Recurring failures (repeated linting errors, reverted changes, timeout patterns)

Map to: **A `/diagnose` skill** that reads logs and produces structured output.

#### 4. Guarded CLAUDE.md Updates
Implement the delimited section pattern in CLAUDE.md:
```
## BEGIN_CORE_IDENTITY
[User-authored, never auto-modified]
## END_CORE_IDENTITY

## BEGIN_ADAPTIVE_SECTION
[Auto-generated by diagnostic skill]
[Evidence-based behavioral guidance]
## END_ADAPTIVE_SECTION
```

Map to: **A skill that modifies only the adaptive section** of CLAUDE.md, with a byte-for-byte check on the core identity section before writing.

#### 5. Soft Failure Detection
The most valuable VIGIL concept: detecting behaviors that don't crash but violate intent. For Claude Code:
- Generating code that passes lint but fails tests
- Creating files the user immediately deletes
- Making edits that are correct but in the wrong file
- Completing a task but missing the user's actual intent

Map to: **Hook-based signal collection** that tracks user corrections and reversions.

#### 6. Coalescing and Noise Filtering
Adopt EmoBank's deposit policies:
- **Noise floor**: Don't log trivial signals (routine successful commands)
- **Coalescing**: Deduplicate repeated identical failures within 5-minute windows
- **Rebound injection**: Track recovery patterns (failure followed by success)

Map to: **Log processing logic** in the diagnostic skill.

### What Needs Significant Adaptation

1. **Real-time vs. batch**: VIGIL processes logs after the fact. For Claude Code, we'd want at least session-level analysis, if not real-time within a session. The hook system enables this.

2. **Emotion mapping**: The "emotional" framing is a useful metaphor but may need translation. For Claude Code, map to operational categories: reliability, accuracy, efficiency, alignment-with-intent.

3. **Code proposals**: VIGIL generates diffs for the target agent's codebase. For Claude Code, the equivalent is generating improvements to skills, hooks, and CLAUDE.md configurations -- a different kind of "code."

4. **Multi-session learning**: VIGIL operates on a single agent's logs. Claude Code operates across many sessions and projects. The diagnostic system needs to handle project-specific vs. global patterns.

---

## 9. Limitations

### Stated Limitations (from the paper)

1. **Batch processing only**: VIGIL processes logs episodically, not in real-time. It cannot intervene mid-task.

2. **Manual triggering**: Requires explicit invocation rather than continuous monitoring. There is no daemon mode.

3. **Deterministic appraisal**: The rule-based emotion mapping is fixed at design time. It cannot learn new appraisal patterns from user feedback or operational data.

4. **Single agent only**: Current design monitors one agent. No cross-agent causal inference or population-level supervision.

5. **Single case study**: The paper validates VIGIL on exactly one scenario (Robin-A reminder agent). No benchmarks against competing approaches, no multi-domain evaluation.

### Unstated Limitations (inferred from analysis)

6. **No formal specification**: The paper provides narrative descriptions but lacks formal tool API specifications, complete state transition tables, or algorithmic pseudocode. Building from the paper alone requires significant reverse-engineering.

7. **Threshold sensitivity**: The RBT classification uses hardcoded thresholds (0.5, 0.3, 0.4) with no justification for why these values were chosen. Different agents or domains might need entirely different thresholds.

8. **No adversarial robustness**: What happens if the target agent's logs are corrupted, intentionally misleading, or incomplete? No analysis of robustness to malformed inputs.

9. **No evaluation of prompt patch quality**: The paper shows that Robin-A improved after applying VIGIL's recommendations, but doesn't isolate whether the improvement came from the prompt patch, the code patch, or both. No ablation study.

10. **Emotion model is a metaphor**: The "emotional" representation is arguably just a weighted sentiment score with categories. Calling it "emotion" adds conceptual overhead without clear benefit over simpler representations (e.g., weighted tags with decay).

11. **No rollback mechanism**: If a prompt patch or code diff makes things worse, there's no automated rollback. The system can only detect the degradation on the next diagnostic pass.

12. **LLM model unspecified**: The paper never names which LLM powers the orchestrator. This matters for reproducibility and for understanding the system's capabilities and failure modes.

13. **Composite signal formulas missing**: The paper mentions energy, stress, motivation, and focus as composite signals but never provides the formulas or weights. These are essential for understanding the system's internal reasoning.

14. **No comparison to simpler approaches**: Would a simple threshold-based alert system on the raw logs achieve similar results? The paper doesn't compare against baselines.

---

## 10. Implementation Details

### Language and Framework

- **Language**: Python (100% of the repository)
- **Repository**: [github.com/cruz209/V.I.G.I.L](https://github.com/cruz209/V.I.G.I.L) (2 commits, 1 star as of this analysis)
- **Key files mentioned**: `main.py`, `EmoBank.py`, `run_robin_b.py`, `robin_b_project_scaffold/`
- **LLM model**: Not specified in the paper
- **Data format**: JSONL throughout (events, EmoBank, proposals)

### Architecture Complexity

The system is **moderately complex** in design but the implementation appears minimal:

- The **deterministic components** (appraisal engine, EmoBank with decay/coalescing, RBT thresholds, stage gate) are straightforward to implement -- likely a few hundred lines of Python each
- The **LLM-driven components** (orchestrator, prompt patch generation, code proposal reasoning) require tool-calling LLM integration but the tool interfaces are simple
- The **strategy engine** (hotspot scanning, strategy modules, diff generation) is the most complex component and the least well-documented

### Dependencies (inferred, not explicitly listed)

- Standard Python libraries (json, datetime, math, hashlib, re)
- An LLM API client (OpenAI, Anthropic, or similar -- unspecified)
- File system access for JSONL read/write
- Regex for hotspot scanning
- Unified diff generation (likely Python's `difflib` or similar)

### Reproducibility Assessment

**Low-to-moderate reproducibility** from the paper alone. The narrative provides enough to understand the architecture but not enough to reimplement without the source code. Key gaps:
- No complete tool API specifications
- No formal state machine definition
- No pseudocode for core algorithms
- No complete emotion mapping rules
- No composite signal formulas
- No LLM integration details

The GitHub repository exists but is minimal (2 commits) and may not contain a complete implementation.

---

## Summary: VIGIL's Core Contribution

VIGIL's most important contribution is not any single component but the **architectural pattern**: an external, persistent supervisor that watches behavioral logs, builds a decaying memory of behavioral health, diagnoses patterns using a structured framework, and proposes guarded modifications -- all while maintaining strict separation between what the LLM decides and what deterministic code enforces.

The three ideas most worth stealing:

1. **Soft failure detection through accumulated signals**: Don't wait for crashes. Track patterns of semantic violation (things that work but shouldn't) through persistent, decaying behavioral memory.

2. **Guarded prompt modification with core identity immutability**: Auto-modify only a delimited section of the system prompt. Byte-for-byte verify that the rest hasn't changed. Abort on violation.

3. **Stage-gated pipelines that prevent LLM improvisation**: When the LLM orchestrates a multi-step process, enforce a strict state machine. Don't let the LLM skip steps or invent sequences. Explicit errors on illegal transitions.

---

## Sources

- [VIGIL Paper (arXiv Abstract)](https://arxiv.org/abs/2512.07094)
- [VIGIL Paper (arXiv HTML Full Text)](https://arxiv.org/html/2512.07094v2)
- [VIGIL GitHub Repository](https://github.com/cruz209/V.I.G.I.L)
- [AI Models Review](https://www.aimodels.fyi/papers/arxiv/vigil-reflective-runtime-self-healing-agents)
- [Moonlight Literature Review](https://www.themoonlight.io/en/review/vigil-a-reflective-runtime-for-self-healing-agents)
- [Emergent Mind: Self-Reflective Repair Frameworks](https://www.emergentmind.com/topics/self-reflective-repair-frameworks)
- [ResearchGate: VIGIL Publication](https://www.researchgate.net/publication/398475345_VIGIL_A_Reflective_Runtime_for_Self-Healing_Agents)
