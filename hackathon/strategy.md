# Hackathon Strategy

Built for the Continual Learning Hackathon — Feb 21, 2026.

---

## Judging Criteria

| Criterion | Weight | Our Angle |
|-----------|--------|-----------|
| **Autonomy** | High | Fully autonomous healing loop. No human intervention. |
| **Idea** | High | Bio-inspired self-healing agents. Novel, research-backed. |
| **Technical Implementation** | High | Multi-model, multi-tool, traced and measured. |
| **Tool Use (3+ sponsors)** | Required | Braintrust + Google Gemini + Flora |
| **Presentation (3 min)** | High | Before/after with Braintrust dashboard proof. Voice briefing via Gemini Live. |

---

## Sponsor Tool Assignments

### 1. Braintrust.dev — Scoring + Proving Improvement

**Role**: Score healing actions with LLM-as-judge. Prove improvement via before/after dashboard.

**NOT used for**: Redundant conversation storage. Local JSONL transcripts are sufficient for the sleep agent to read.

**Used for**:
- Tracing the sleep agent's healing actions (via CC plugin)
- Auto-scoring healing quality with custom LLM-as-judge scorers
- Dashboard showing improvement across sleep cycles (the demo visual)
- Importing seeded before/after demo data via API

#### Braintrust CC Plugin

First-party plugin that traces Claude Code sessions via hooks:
- `SessionStart` → root span
- `UserPromptSubmit` → turn-level span (captures FULL user prompt text)
- `PostToolUse` → tool call spans with full I/O
- `Stop` → parses JSONL transcript, creates LLM spans with full conversation history

**Installation**:
```bash
claude plugin marketplace add braintrustdata/braintrust-claude-plugin
claude plugin install trace-claude-code@braintrust-claude-plugin
```

**Config** (in `~/.claude/settings.json`):
```json
{
  "env": {
    "TRACE_TO_BRAINTRUST": "true",
    "BRAINTRUST_CC_PROJECT": "self-healing-sleep",
    "BRAINTRUST_API_KEY": "sk-EK0NKr0gqNx3y6vYESwPTbmvenxyYzY3kITqlAyG1sOS0Ke2"
  }
}
```

**Plugin scope**: Live sessions ONLY. Does NOT retroactively process past transcripts. But we can bulk-import historical data via the REST API.

#### How Scoring Works (Technical Details)

Braintrust scoring uses **LLM-as-a-judge with forced structured output**:

1. Trace arrives (e.g., a healing action)
2. Scoring rule fires (configured in dashboard or via SDK)
3. Scorer sends prompt to GPT-4o (configurable) with trace input + output
4. LLM is **forced to pick from predefined choices** via function calling
5. Each choice maps deterministically to a score 0-1

**All scores are 0 to 1.** The specific meaning depends on the scorer.

#### Custom Healing Action Scorer

```python
from autoevals import LLMClassifier

healing_scorer = LLMClassifier(
    name="HealingActionQuality",
    prompt_template="""Problem context: {{input}}
Proposed healing action: {{output}}

Rate this healing action:
(A) Excellent: addresses root cause, specific, measurable
(B) Good: reasonable but could be more specific
(C) Weak: too vague or only partially addresses the problem
(D) Harmful: could cause regressions or is wrong""",
    choice_scores={"A": 1.0, "B": 0.7, "C": 0.3, "D": 0.0},
    use_cot=True  # LLM explains reasoning before choosing
)
```

When we query "score < 0.5", it means the LLM judged the action as C (weak, 0.3) or D (harmful, 0.0).

#### How We Measure Healing Improvement

**Layer 1 — Immediate (score the action itself):**
LLM-as-judge evaluates: "Given this problem and this proposed rule, is this a good fix?"
Scored the moment it's created. No wait needed.

**Layer 2 — Longitudinal (before/after comparison):**
```python
before_after_scorer = LLMClassifier(
    name="SessionQualityDelta",
    prompt_template="""BEFORE session (before healing rule applied):
{{input}}
AFTER session (after healing rule applied):
{{output}}
The healing rule that was added:
{{expected}}

Did the AFTER session show improvement?
(A) Clear improvement - the problem did not recur
(B) Partial improvement - reduced but not eliminated
(C) No change
(D) Regression - new problems caused by the rule""",
    choice_scores={"A": 1.0, "B": 0.6, "C": 0.3, "D": 0.0},
    use_cot=True
)
```

#### How We Prove the Demo

Seed ~10 "before" traces (low scores) + ~10 "after" traces (high scores). The Braintrust dashboard shows a time series chart trending upward.

**The punchline BTQL query:**
```sql
dimensions: metadata.phase as phase
measures:
  avg(scores.HealingActionQuality) as avg_quality,
  count(1) as sessions
from: project_logs('self-healing-sleep')
filter: tags includes 'demo'
```

Returns:
| phase | avg_quality | sessions |
|-------|-------------|----------|
| before | 0.33 | 10 |
| after | 0.84 | 10 |

**Seeding demo data via API:**
```python
# POST /v1/project_logs/{project_id}/insert
requests.post(url, headers=headers, json={
    "events": [{
        "id": str(uuid.uuid4()),
        "input": {"prompt": "Fix config.py"},
        "output": "Error: Permission denied...",
        "scores": {"SessionQuality": 0.3},
        "metadata": {"phase": "before"},
        "tags": ["demo", "before"],
        "created": timestamp
    }]
})
```

Use `_is_merge: true` to add scores to existing traces retroactively.

---

### 2. Google — Gemini Degeneracy + Gemini Live Voice

**Two uses of Google as sponsor:**

#### 2a. Gemini API — Degeneracy Model

Structurally different model providing diagnosis. Biological degeneracy = multiple different pathways to the same goal (not redundancy = identical copies).

- When Claude fails, Gemini diagnoses WHY (fresh perspective)
- Cross-model validation: both agree = high confidence
- Free tier via Google AI Studio

#### 2b. Gemini CLI + Codex — Multi-Agent Degeneracy in Developer Workflow

The degeneracy principle applied to real developer workflow, not a synthetic benchmark. During normal coding, the user asks Claude Code to get second opinions from Gemini CLI and Codex. Claude evaluates those opinions and decides which to accept. Braintrust traces this entire flow.

**How it works naturally:**
```
User → Claude Code: "Fix the auth bug"
Claude: reads files, proposes approach
User → Claude: "Get Gemini's take on this"
Claude → Gemini CLI: sends the same question
Gemini: returns its opinion
Claude: evaluates — "Gemini's approach handles the edge case better, using it"
         → Gemini opinion ACCEPTED ✓

User → Claude: "What does Codex think?"
Claude → Codex: sends the question
Codex: returns its opinion
Claude: evaluates — "Codex missed the auth constraint, skipping"
         → Codex opinion REJECTED ✗
```

**What Braintrust captures (via CC plugin, zero extra code):**
- Full user prompts including "get Gemini's opinion"
- Tool calls where Claude invokes Gemini/Codex
- Claude's reasoning about WHY it accepted or rejected each opinion
- The final decision and implementation

**Over time, the data reveals:**
- Which agent's opinions are accepted most often
- What task types each agent excels at
- Agreement rate between agents (high agreement = high confidence signal)
- Whether accepted opinions led to better session outcomes

**Dashboard queries:**
```sql
-- Could score sessions where external opinions were sought vs not
-- Could track which agents' suggestions survived into final code
-- Could measure if multi-agent sessions had fewer corrections/errors
```

**Maps to research:**
- Degeneracy: structurally different agents (Claude, Gemini, Codex), same goal
- Two-signal activation: when multiple agents independently agree, confidence is high
- Biological immune system: multiple detection pathways, strongest signal wins

---

#### 2c. Gemini Live API — Voice Morning Briefing

Replaces Modulate. One tool handles BOTH STT and TTS via bidirectional WebSocket.

**How it works:**
- WebSocket to `wss://generativelanguage.googleapis.com/ws/...`
- Stream raw PCM mic audio in → model responds with audio out
- Built-in VAD (voice activity detection) — handles "when did user stop talking"
- Tool calling supported mid-session
- System instruction with JSON context (sleep report) at connection time
- Free during preview, no credit card needed
- 15 min session limit (plenty for briefing)

**Setup:**
```bash
brew install portaudio
pip install google-genai pyaudio
export GOOGLE_API_KEY=<key>
```

**Architecture:**
```python
config = types.LiveConnectConfig(
    response_modalities=["AUDIO"],
    system_instruction=f"""You are a morning briefing assistant.
    Sleep report from last night: {json.dumps(sleep_report)}
    Start by summarizing what the sleep agent did.""",
    speech_config=types.SpeechConfig(
        voice_config=types.VoiceConfig(
            prebuilt_voice_config=types.PrebuiltVoiceConfig(voice_name="Aoede")
        )
    ),
    tools=[{"function_declarations": [get_report_detail]}],
    input_audio_transcription=types.AudioTranscriptionConfig(),
    output_audio_transcription=types.AudioTranscriptionConfig(),
)

async with client.aio.live.connect(model=MODEL, config=config) as session:
    async with asyncio.TaskGroup() as tg:
        tg.create_task(send_mic_audio(session))      # mic → API
        tg.create_task(receive_and_play(session))     # API → speaker
```

**Audio formats:**
- Input: Raw PCM, 16kHz, 16-bit, mono
- Output: Raw PCM, 24kHz, 16-bit, mono
- Use headphones (no echo cancellation)

**Quickstart reference:** Google cookbook `Get_started_LiveAPI_NativeAudio.py`

#### Gemini CLI — Future Opportunity (Not for Hackathon)

Gemini CLI has a full hook system (11 events: `SessionStart`, `BeforeModel`, `AfterModel`, `BeforeTool`, `AfterTool`, etc.) similar to Claude Code. No Braintrust plugin exists yet. A `trace-gemini-cli` plugin could be built using Gemini's `AfterModel` hook to send spans to Braintrust — same pattern as `trace-claude-code`. Out of scope for the hackathon but a compelling future direction.

---

### 3. Flora.ai — Presentation Generation

**Role**: Generate hackathon presentation slides or demo video using AI. Third sponsor checkbox.

---

## Architecture: How It All Fits Together

```
DAYTIME (passive — CC plugin traces everything)
════════════════════════════════════════════════
User works with Claude Code normally
→ CC plugin sends traces to Braintrust (async, zero latency impact)
→ Every tool call, LLM call, user prompt, token count captured
→ Multi-agent opinions (Gemini/Codex) captured as tool spans
→ Local JSONL transcripts also saved by Claude Code

SLEEP TIME (active — staged cycles)
════════════════════════════════════
N1 — LIGHT SLEEP: Measure (Hippocampal Replay)
   → Scan Braintrust traces or local JSONL
   → Count utilization for all 6 artifact types:
     hooks, skills, memory, rules, CLAUDE.md, multi-agent opinions
   → Compute token usage per session
   → Detect patterns: recurring errors, corrections, frustrations
   → Output: utilization scorecard

N2 — MEDIUM SLEEP: Prune (Synaptic Homeostasis)
   → Apply trail evaporation to low-utilization artifacts
   → Prune: unused hooks, stale memory, redundant rules
   → Consolidate duplicates, resolve contradictions
   → Output: pruning actions (traced + scored in Braintrust)

N3 — DEEP SLEEP: Repair (Immune Patrol)
   → Health check existing artifacts (do hooks work? are skills valid?)
   → Workspace cleanup (orphaned temps, stale caches)
   → Negative trace consolidation (failures → anti-pattern entries)
   → Output: repair actions (traced + scored in Braintrust)

REM — DREAM: Create (Creative Recombination)
   → Generate new artifacts from detected patterns
   → Two-signal activation: only create if pattern persists across cycles
   → Tag each artifact: created_by, confidence, pattern_source
   → Output: new rules/hooks/memory/skills + dream report

MORNING (voice briefing)
════════════════════════
User wakes up, starts Gemini Live voice session
   → Sleep report JSON loaded as system instruction context
   → "Good morning! Here's what happened overnight..."
   → User asks follow-up questions by voice
   → Gemini responds with audio, can call tools for detail

PROOF (the demo)
════════════════
Before task: 45,000 tokens, 23 LLM calls
After task:  18,000 tokens, 9 LLM calls
→ "60% token reduction after one sleep cycle"
→ Braintrust dashboard shows the comparison
→ Artifact adoption rate: 4/5 created artifacts actually used
```

### 8 Trackable Signal Types

| # | Signal | Detection | Action |
|---|--------|-----------|--------|
| 1 | **Hooks** | Hook fires → tool span in Braintrust | Track invocation_count |
| 2 | **Skills** | Skill invoked → in transcript | Track invocation_count |
| 3 | **Memory** | Referenced in agent reasoning → LLM spans | Track reference_count |
| 4 | **Rules** | Loaded and followed → in context | Track reference_count |
| 5 | **CLAUDE.md** | Section influences behavior → in output | Track influence_count |
| 6 | **Multi-agent opinions** | Accept/reject Gemini/Codex | Track acceptance_rate |
| 7 | **User frustration** | Corrections, negations, rephrasing | Propose rules/hooks/memory |
| 8 | **Repeated commands** | Same bash command across 5+ sessions | Propose custom command/skill |
| 9 | **Token usage** | prompt_tokens, completion_tokens per LLM span | Track efficiency, before/after proof |

---

## What We Build (3-4 Hours)

### Hour 1: Core Sleep Agent + Braintrust
- Install Braintrust CC plugin (5 min)
- Sign up for Braintrust, configure API key (5 min)
- Set up a demo .claude/ folder with accumulated entropy (15 min)
- Write the sleep agent script: read local transcripts → detect patterns → propose fixes (30 min)
- Verify traces appear in Braintrust dashboard
- Set up custom healing scorer in Braintrust

### Hour 2: Multi-Agent Orchestrator + Scoring
- Get Google AI Studio API key (5 min)
- Install Gemini CLI: `npm install -g @google/gemini-cli` (5 min)
- Build Python orchestrator: sends same healing task to Claude Code CLI + Gemini CLI (30 min)
- Score both proposals with Braintrust custom scorer (10 min)
- Log with agent metadata, track winner, agreement rate
- Seed before/after demo data in Braintrust via API (10 min)

### Hour 3: Gemini Live Voice Briefing
- Install `portaudio` + `pyaudio` (5 min)
- Fork Google's `NativeAudio.py` cookbook example (10 min)
- Adapt: load sleep report as system instruction, add tool for report detail (25 min)
- Test end-to-end: speak → briefing → follow-up Q&A (20 min)

### Hour 4: Demo Prep + Polish
- Pre-run the full flow: sleep cycle → Braintrust dashboard → voice briefing
- Prepare 3-minute demo narrative
- Generate slides with Flora (optional)
- Record backup video in case live demo fails

---

## 3-Minute Demo Script

**0:00-0:30 — "The Problem"**
"AI agents accumulate entropy. Configuration bloats. Rules contradict. Nobody monitors agent health. We built a system inspired by biological healing."

**0:30-1:30 — "Watch It Heal" (pre-recorded or live)**
1. Show the .claude/ folder BEFORE — bloated CLAUDE.md, stale rules, contradictions
2. Trigger the sleep cycle — agent reads local transcripts, detects patterns
3. Show multi-agent workflow: Claude gets Gemini's opinion on a fix (sponsor: Google)
4. Show Braintrust tracing the full flow including agent opinion evaluation (sponsor: Braintrust)
5. Show the .claude/ folder AFTER — pruned, consolidated, improved

**1:30-2:30 — "Good Morning" (live voice demo)**
1. Start Gemini Live session — "Good morning, what happened last night?"
2. Gemini reads sleep report context, responds with audio briefing (sponsor: Google)
3. Follow-up: "Tell me more about the CLAUDE.md changes"
4. Agent responds with specifics

**2:30-2:50 — "The Proof"**
- Braintrust dashboard: time series chart showing improvement
- Before healing avg: 0.33 → After healing avg: 0.84
- "2.5x improvement in session quality, measured and verified"

**2:50-3:00 — "What Makes This Different"**
"Inspired by biology: sleep as active healing, degeneracy over redundancy. Three sponsor tools naturally integrated: Braintrust scores healing, Gemini provides multi-model diagnosis and voice briefing, Flora generated this presentation. The agent doesn't just recover — it gets stronger."

---

## Scope Cuts from Original Research

| Original | Hackathon |
|----------|-----------|
| Full N1/N2/N3/REM with model selection | Simplified scan → diagnose → repair cycle |
| LaunchD daemon scheduling | Manual trigger |
| Claude Code plugin distribution | Standalone script |
| 44 principles | Focus on 4: degeneracy, wound healing, trail evaporation, immune memory |
| Full EmoBank with decay | LLM-as-judge scoring via Braintrust |
| VIGIL 5-layer pipeline | Simple 3-step healing loop |
| Cross-project consolidation | Single project demo |
| Modulate voice + emotion | Gemini Live (STT + TTS in one) |

---

## Key Research References (for narrative)

- "Sleep is the price the brain pays for plasticity" (Tononi)
- Glymphatic system 10x more active during sleep
- Targeted dream incubation doubles puzzle-solving (42% vs 17%)
- VIGIL reduced failures 100% → 0% through behavioral monitoring
- Darwin Godel Machine: 20% → 50% via scaffold self-modification
- "The bridge isn't in any of the stones. It's in the leaning." (Kay via Werner)

---

## Resolved Questions

1. ~~Voice agent?~~ → **Gemini Live** (bidirectional audio, free preview, tool calling)
2. ~~Braintrust for conversation storage?~~ → **No.** Sleep agent reads local JSONL. Braintrust traces healing actions + scores them.
3. ~~Modulate?~~ → **Dropped.** STT-only, no TTS. Gemini Live handles both.
4. ~~Airia?~~ → **Skipped.** Not needed for 3-hour build.
5. ~~Third sponsor?~~ → **Flora** for presentation generation.

## Open Questions

1. Google AI Studio API key for Gemini? (free tier, sign up needed)
2. Can we run Claude Code CLI non-interactive reliably for the sleep cycle?
3. What's the minimum .claude/ entropy needed for a convincing demo?
4. Do we need to pre-record the demo as backup?
5. Flora access — is it the creative canvas (flora.ai) or data extraction (withflora.io)?
