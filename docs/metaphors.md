# Metaphors

Useful analogies for communication, design, and the hackathon talk. Each metaphor maps a biological/architectural concept to our system.

---

## Wound Healing → Software Fault Management (Baqar et al.)
| Phase | Biology | Our System |
|-------|---------|------------|
| Hemostasis | Blood clotting, stop bleeding | PostToolUseFailure hooks, circuit breakers, error isolation |
| Inflammation | Cleanup crew, temporarily worse | Diagnostic analysis, may slow system temporarily |
| Proliferation | New tissue growth | Generate fixes: new rules, skills, hook modifications |
| Remodeling | Scar maturation, optimization | Validate fixes, store patterns, prune ineffective rules |

**Key teaching**: "Temporary performance degradation is a feature, not a bug" - inflammation makes things temporarily worse but is essential.

## The Arch (Alan Kay via Scott Werner)
- A stone alone can only sit or fall
- Stones leaned against each other become an arch
- The arch holds a bridge that would crush any individual stone
- **"The bridge isn't in any of the stones. It's in the leaning."**
- Applied: individual components are simple. The arrangement produces healing.

## Cathedral vs. Pyramid (Alan Kay via Scott Werner)
- **Pyramid**: More material compensates for weak architecture. Retries, guardrails, orchestration layers. Mass grows faster than capability.
- **Cathedral**: Less material, better arrangement. Almost all air. Almost all glass. Everything cunningly organized. Our approach: simple components, powerful arrangement.

## Sleep as Active Healing (Tononi)
- Not rest. Active maintenance: memory consolidation, waste clearance, synaptic pruning, creative dreaming
- "Sleep is the price the brain pays for plasticity"
- Glymphatic system 10x more active during sleep
- Applied: agent idle time is healing time, not wasted time

## Immune System Layers
| Layer | Biology | Our System |
|-------|---------|------------|
| Innate immunity | Fast, non-specific pattern matching | PreToolUse hooks with pattern blockers |
| Adaptive immunity | Slow, specific, with memory | Episodic memory of past failures + learned recovery strategies |
| Immunological memory | Rapid re-response to known threats | Cached recovery strategies for known error patterns |
| Two-signal activation | Anomaly + harm evidence required | First signal pre-caches, second signal deploys |

## Trail Evaporation (Ant Colony Optimization)
- Pheromone trails evaporate over time: `t(t+1) = (1-p) * t(t)`
- Frequently traveled trails stay strong (reinforcement)
- Abandoned trails fade (natural pruning)
- Applied: memory entries, hooks, rules that aren't accessed decay and eventually get pruned

## Default-Safe + Override (Anthropic Bio)
- Default state is "can't answer" / "safe mode"
- Specific confidence signals required to override defaults
- Hallucinations = confidence signals misfiring
- Applied: healing system defaults to no-action, requires positive evidence to make changes

## Compounding Recovery vs. Compounding Failure (Werner)
- Standard chain: 80% * 80% * 80% = 51%. Failure compounds.
- Prompt object chain: each interaction is a recovery opportunity. Recovery compounds.
- Applied: design every interaction in our system as recovery, not another failure point

## Pace Layering (Stewart Brand)
- Fast layers learn, slow layers remember
- Applied: real-time hooks (fast) → session reflection (medium) → sleep cycles (slow) → periodic evolution (very slow)
- Each layer has different update frequency and stability requirement

## Degeneracy vs. Redundancy (Whitacre)
- Redundancy: identical copies (backup generators)
- Degeneracy: structurally different components achieving same function (multiple pathways to same goal)
- Biology uses degeneracy, not redundancy. It's more robust AND more evolvable.
- Applied: multiple different approaches to same healing task, not identical copies
