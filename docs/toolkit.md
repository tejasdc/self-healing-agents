# Toolkit

Patterns, mechanisms, and tools we can pick from during implementation. Each is a proven technique from our research that we may apply to our system. Not all will be used - this is the menu.

---

## Detection & Sensing Tools

### Observe → Reflect → Diagnose → Adapt Pipeline (VIGIL)
Five-layer pipeline with strict stage gating. Each phase must complete before next begins. Prevents the LLM from improvising invalid sequences.

### EmoBank: Affective Memory with Decay (VIGIL)
- Map events to emotions (frustration, pride, relief, etc.) with intensity scores [0, 1]
- Exponential decay: `I_decayed = I * 0.5^((t'-t)/h)` where h = half-life (configurable)
- Persistent: old emotions fade but are never deleted
- Snapshots: dominant emotion, top-3, composite signals (energy, stress, motivation, focus)
- **Properties**: emotion, valence {-1, 0, +1}, intensity [0, 1], cause, timestamp

### Deposit Policies (VIGIL)
Three policies that filter/shape what gets stored:
1. **Noise floor**: Discard intensity < 0.25 UNLESS it inverts prior valence (weak positive after persistent negatives is meaningful)
2. **Coalescing**: Same emotion + cause within 5 minutes → amplify existing entry (prevents spam while strengthening signal)
3. **Rebound injection**: Positive after negative within 10 minutes → inject synthetic "determination" entry (recovery IS a signal)

### Absence as a Signal (VIGIL)
Zero positive signals across a time window is a stronger signal of systemic failure than any individual negative signal. Track what's NOT happening, not just what is.

### Roses/Buds/Thorns Classification (VIGIL)
- **Roses**: What's working (positive emotions, intensity >= 0.5)
- **Buds**: What's emerging (weak positive or curiosity, intensity >= 0.3)
- **Thorns**: What's broken (frustration/anxiety, intensity >= 0.4)

### Semantic Signal Detection (Claude Reflect)
Use LLM calls to classify messages as corrections, approvals, or observations. Slower than regex but catches natural language corrections that regex misses. Preferred for sleep-time analysis where latency doesn't matter.

---

## Memory & Storage Tools

### SQLite + sqlite-vec as Memory Substrate (Episodic Memory)
- Local, fast, concurrent
- Supports structured queries AND semantic (vector) search
- WAL mode for concurrent read/write
- No external dependencies

### Cross-Repo Learning Ledger with Fingerprinting (Claude Reflect)
- SQLite DB tracking learnings across repos
- SHA256 fingerprint of normalized content (dedup across phrasings)
- Repo identification via git remote hash
- Promotion threshold: N repos → eligible for global scope
- **Properties**: fingerprint, content, learning_type, repo_ids[], count, confidence, status (pending/promoted)

### Haiku Subagent for Context Management (Episodic Memory)
Never load raw memories into main agent. Dispatch Haiku subagent to search and synthesize. Claims 50-100x context savings. Returns actionable insights, not raw data.

### Trail Evaporation Formula (ACO)
`t(t+1) = (1-p) * t(t)` - traces not reinforced decay over time. Combined with access counting for reinforcement.

---

## Modification & Healing Tools

### Core Identity + Adaptive Section (VIGIL)
Divide configuration into:
- `CORE_IDENTITY`: Byte-for-byte immutable. If mutation detected → abort entire operation
- `ADAPTIVE_SECTION`: Machine-modifiable zone. Delimited with markers. Evidence-grounded changes only.

### Confidence Tiering (Claude Reflect)
- **HIGH (0.85+)**: Auto-apply to "Critical Corrections" section
- **MEDIUM (0.65-0.84)**: Add to "Best Practices" section
- **LOW (0.45-0.64)**: Add to "Advanced Considerations" section
- Numeric scores enable threshold-based automation vs. human review

### Backup-Validate-Write-Rollback Pipeline (Claude Reflect)
1. Create timestamped backup
2. Parse and validate the target file
3. Apply modification
4. Validate output (YAML/markdown/JSON integrity)
5. Write (ideally atomic: temp file → rename)
6. On any failure: restore from backup
- Auto-cleanup backups after N days

### Staged Evaluation Pyramid (Darwin Godel Machine)
Test modifications at increasing cost:
- Stage 1 (cheap, 10 tasks): Does it compile? Does it retain core capability?
- Stage 2 (medium, 50 tasks): Expanded assessment
- Stage 3 (expensive, 200 tasks): Full evaluation for top performers
Most bad modifications caught cheaply at Stage 1.

### Population-Based Search with Stepping Stones (Darwin Godel Machine)
- Don't require every change to be an improvement
- Keep "worse" modifications that might be stepping stones to future breakthroughs
- Non-zero selection probability for all candidates
- Novelty bonus for underexplored paths

---

## Feedback Loop Tools

### Meta-Learning Feedback Loop (Claude Reflect)
Track user decisions on proposed changes:
- Accept → reinforce pattern (adjustment: +0.1)
- Modify → right direction, wrong implementation (neutral)
- Skip → weak negative signal (adjustment: -0.15)
- Quit → strong negative signal (adjustment: -0.3)
- Minimum 5 samples before adjustments kick in
- Computes acceptance rates per pattern type

### 6 Feedback Patterns (Jamie Davies)
1. **Negative feedback**: Stabilization - deviations from setpoint trigger corrections (homeostasis)
2. **Positive feedback**: Amplification/commitment - successful patterns get reinforced (trail reinforcement)
3. **Relay**: Signal cascade - one signal triggers a chain of responses (hook chains)
4. **Integration**: Combinatorial logic - multiple signals must combine for response (two-signal activation)
5. **Gradient interpretation**: Context-dependent response - same signal means different things in different contexts
6. **Temporal oscillation**: Rhythmic behavior - periodic cycles of activity (sleep cycles, daily retrospectives)

### File Edit Watching as Passive Feedback
Monitor diffs in files we modified. User removing our additions = negative signal. User editing = partial signal. No change = neutral. Passive meta-learning without explicit feedback.

### Agent Pickup Rate Tracking
How often agents reference information in CLAUDE.md/skills/memory. Frequently referenced = high-value (reinforce). Never referenced = dead weight (prune candidate).

---

## Architecture Tools

### Dual/Triple Model Architecture (Darwin Godel Machine)
Different models for different cognitive tasks:
- Haiku: Fast monitoring, vital signs, lightweight scanning
- Sonnet: Deeper analysis, pattern detection, consolidation
- Opus: Creative dreaming, complex reasoning, major decisions

### Degeneracy Strategy: Multiple Agents, Same Task
Run 2-3 agents with different approaches on same input. Synthesize results. Catches things any single agent might miss. Apply selectively to high-stakes decisions, not routine operations.

### Prompt Object Primitives (Scott Werner)
4 capabilities: receive messages, think, modify self, create other objects. Everything else emerges from arrangement. The bridge is in the leaning, not in the stones.

### Viable System Model Recursion (Werner / Beer)
Each component can contain the entire system structure recursively. Self-similar at every scale. Objects that are themselves systems of objects.

---

## Object Properties Reference

Capturing the object-oriented modeling of entities in our system. Each object has properties with ranges/spectrums.

| Object | Key Properties | Range/Type |
|--------|---------------|------------|
| Emotion/Signal | intensity | [0.0, 1.0] float |
| Emotion/Signal | valence | {-1, 0, +1} |
| Suggestion | confidence | [0.0, 1.0] float |
| Issue/Problem | severity | HIGH/MEDIUM/LOW or [0.0, 1.0] |
| Trace/Memory | strength | [0.0, 1.0] float (decays over time) |
| Trace/Memory | lastAccessed | timestamp |
| Hook | invocationCount | integer |
| Skill | usageRate | float (over time window) |
| Learning | fingerprint | SHA256 hash |
| Learning | repoCount | integer (cross-repo signal) |
| Learning | acceptanceRate | [0.0, 1.0] float |
| Rule | staleness | float (time since last triggered) |
