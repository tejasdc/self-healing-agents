# Sleep Report Dashboard — Design Doc

## Feature Overview

A single-page frontend that serves as the hackathon demo experience for the Self-Healing Agents project. The Gemini Live voice agent narrates a sleep cycle report while improvement cards appear one-by-one in a stepped/conversational flow. The user can approve or dismiss each improvement via card UI. The page tells the story: "Your agent healed overnight. Here's what it found."

## Background

The self-healing-agents system runs "sleep cycles" (N1-measure, N2-prune, N3-repair, REM-create) that analyze Claude Code usage patterns and produce improvements. The system outputs a markdown report + JSON intermediates. For the hackathon demo, we need a visual frontend that makes this tangible.

## Requirements

1. **Single page** — voice briefing + improvement cards + visual report all on one page
2. **Stepped reveal** — improvements appear one at a time, synced conceptually with the voice narration (not literally synced — the presenter controls pacing by speaking)
3. **Approval interaction** — each improvement card has approve/dismiss actions
4. **Static data** — hardcoded example report, no backend needed
5. **Biological/organic aesthetic** — dark theme, bioluminescent glows, organic shapes
6. **Built into existing project** — same Vite/React/Tailwind app as the Gemini Live demo
7. **Presentation-grade** — this IS the demo, needs to be visually impressive

## Assumptions

1. The report data is static/hardcoded for the demo — no file loading or API calls needed
2. The Gemini Live voice briefing is the existing component, reused on this page
3. The presenter manually controls pacing (the voice talks, cards appear via user action or auto-timed)
4. We're in the same gemini-live-demo Vite project at `/Users/tejasdc/workspace/hackathon-feb-21/hackathon_docs/gemini-live-demo/`
5. Dependencies already available: React 19, Tailwind 4, framer-motion, lucide-react
6. No routing library — we'll handle the two "views" (landing vs dashboard) with React state

## Brainstorming & Investigation Findings

### Existing Project Structure
- `App.tsx` — currently just renders `<GeminiLive />`
- `GeminiLive.tsx` — full voice component with connect/disconnect/mic/playback
- `live-client.ts` — WebSocket client for Gemini BidiGenerateContent
- `audio.ts` — PCM encoding/decoding utils
- Tailwind 4 via `@tailwindcss/vite`, dark theme (`bg-[#050505]`)
- framer-motion already installed for animations

### Key Design Decision: Page Layout

**Decision: Two-zone single page**
- **Left zone (~40%):** Gemini Live voice interface (compact version of existing component) + session status
- **Right zone (~60%):** Improvement cards that stack vertically as they're revealed

Rationale: The audience sees the voice interaction AND the visual cards simultaneously. The presenter talks through each improvement, the card appears, they approve/dismiss, and move to the next.

### Key Design Decision: Card Reveal Mechanism

**Decision: Manual stepped reveal with auto-advance option**

Cards exist in the data but are hidden. They appear via:
- A "Next Finding" button the presenter can click (primary)
- Or auto-reveal after a timer (secondary, for smooth flow)

Each card animates in with a biological "growing" effect (scale from 0 + fade + slight blur clearing).

States per card: `hidden` → `revealed` → `approved` | `dismissed`

### Key Design Decision: How GeminiLive integrates

**Decision: Reuse the existing GeminiLive component but refactor into a compact mode**

The current GeminiLive has the full connect UI, API key input, etc. For the dashboard page, we need:
- A compact voice widget (mic button + speaking indicator + status)
- The system instruction pre-loaded with the sleep report data
- The connection flow triggered by a single button

We'll extract the voice controls into a reusable piece rather than duplicating the whole component.

### Example Report Data (hardcoded)

```
Summary:
- 12 sessions scanned over last 7 days
- 42 artifacts evaluated
- 3 improvements found
- 1 artifact pruned
- 1 repair made
- Token usage: 245,000 total → projected 98,000 after improvements (60% reduction)

Improvement 1: New Skill — Database Debugging Toolkit
- Type: skill (REM creation)
- Confidence: 0.95
- Story: "Across 8 sessions, your agent ran psql, \dt, SELECT *, and \d table_name
  repeatedly when debugging database issues. We've consolidated these into a
  /db-debug skill that connects, inspects schema, and queries in one step."
- Impact: ~40% fewer tool calls for DB tasks
- Pattern sources: repeated_commands (8 sessions), token_anomaly

Improvement 2: New Rule — Temp files instead of heredocs
- Type: rule (REM creation)
- Confidence: 0.85
- Story: "You corrected the agent 4 times about heredoc permission prompts causing
  interruptions. Added a rule to CLAUDE.md: always write scripts to
  ~/.claude/temp/scripts/ instead of using inline heredocs."
- Impact: Eliminates permission prompt interruptions
- Pattern sources: frustration_cluster (4 occurrences, high severity)

Improvement 3: New Memory — Project test commands
- Type: memory
- Confidence: 0.75
- Story: "The agent searched for test commands in 6 sessions, reading package.json
  and Makefile each time. Added a memory entry with the project's test commands:
  'npm test' for unit, 'npm run e2e' for integration."
- Impact: ~15% token reduction for test-related tasks
- Pattern sources: repeated_commands (6 sessions), token_anomaly

Pruned: Stale API endpoint memory
- "Memory entry 'old-staging-api-url' hasn't been referenced in 25 sessions. Archived."

Repaired: Broken pre-commit hook
- "The lint-on-save hook was missing execute permissions. Fixed and verified."
```

## Options Explored

### Option A: Parse the actual markdown report at runtime
- Pro: More realistic, works with real reports
- Con: Adds complexity (markdown parser), report format may not have all the fields we want for cards
- **Rejected for now** — hackathon priority is visual polish, not data plumbing

### Option B: Hardcoded TypeScript data structure
- Pro: Full control over what we display, type-safe, fast to iterate
- Con: Not connected to real system
- **Selected** — fits "make it look like it's working" goal perfectly

### Option C: Load JSON intermediate files
- Pro: Uses real system output
- Con: Needs file serving, schema coupling, overkill for demo
- **Rejected** — unnecessary complexity

## Trade-offs Made

| Decision | What we gain | What we give up |
|----------|-------------|-----------------|
| Hardcoded data over real parsing | Speed, full visual control | Real data integration |
| Same project as Gemini Live | Reuse voice component, shared styles | Slightly larger bundle |
| Stepped reveal over all-at-once | Demo pacing control, more theatrical | Less realistic as a product |
| Manual advance over voice-sync | Reliability (no timing bugs) | Slightly less magical |
| State-based views over router | Zero new dependencies | No URL-based navigation |

### Key Design Decision: Voice-Driven UI via Tool Calling

**Decision: Real tool calling + manual button fallback**

The Gemini Live API supports tool calling mid-session. We define tools:
- `show_next_finding` — reveals the next improvement card
- `approve_improvement(id)` — approves a specific card
- `dismiss_improvement(id)` — dismisses a specific card

When the user says "yes, install that" or "show me the next one," Gemini calls
the tool, our client fires a callback, and the UI animates.

Manual buttons are always visible as fallback — if the model doesn't call the
tool, the presenter clicks. The audience can't tell the difference.

**LiveClient changes needed:**
- Add `tools` array to setup message with function_declarations
- Detect `functionCall` in message parts
- Expose `onToolCall(name, args)` callback
- Add `sendToolResponse(callId, result)` method
- Handle `functionResponse` in the protocol

**System instruction updated to include:**
- The sleep report data as context
- Instructions to call tools when user approves/dismisses/asks for next
- The list of available improvements with IDs

### Key Design Decision: Layout — Horizontal split

**Decision: Top bar for voice, below for cards**

Changed from left/right to top/bottom after discussion. Better for projected
presentation visibility. Voice widget is a compact horizontal bar at the top.
Cards fill the main content area below.

```
+--------------------------------------------------+
| Voice Bar: [Mic] Status  Speaking indicator       |
+--------------------------------------------------+
| Header: "Sleep Cycle Complete" + stats            |
+--------------------------------------------------+
|                                                   |
|  [Improvement Card 1]  [approve] [dismiss]        |
|                                                   |
|  [Improvement Card 2]  (revealed on advance)      |
|                                                   |
|  [Improvement Card 3]  (revealed on advance)      |
|                                                   |
+--------------------------------------------------+
| Footer: Pruned + Repairs + Token reduction stat   |
+--------------------------------------------------+
```

## Implementation Plan

### Phase 1: Data & Types
- Define TypeScript interfaces for Improvement, SleepReport, etc.
- Create a static data file with the example report
- Types should be generic enough that swapping in real data later is straightforward

### Phase 2: Compact Voice Widget
- Extract the essential voice UI from GeminiLive into a smaller component
- Mic button, speaking indicator, status text
- Accepts the sleep report as system instruction context
- Connect/disconnect control

### Phase 3: Dashboard Layout
- Single page with two zones (voice left, cards right)
- Header with "Sleep Cycle Report" branding + summary stats
- Biological/organic aesthetic: dark bg, bioluminescent accent colors,
  organic shapes (blurred radial gradients, cell-like borders)

### Phase 4: Improvement Cards
- Card component with: icon, type badge, title, description, impact stat, confidence
- States: hidden → revealed (animate in) → approved/dismissed (visual feedback)
- Approve/dismiss buttons with appropriate styling
- "Next Finding" control to advance through cards

### Phase 5: Summary Footer
- Pruned items + repairs as smaller, less prominent entries
- Overall stats: token reduction headline, artifacts evaluated

### Phase 6: Polish
- Entry animations (staggered, organic feel)
- Micro-interactions on approve/dismiss
- Background atmospheric effects (subtle particle/cell animation or gradient shifts)
- Typography: distinctive display font for headings
