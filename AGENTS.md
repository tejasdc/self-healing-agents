# self-healing-agents

Research prototype for bio-inspired maintenance of Claude Code's `.claude/` environment.
The runtime is intentionally file-based: inspect prompts, state, and generated artifacts directly.

## Project boundaries

- `sleep-agent/` owns the staged N1, N2, N3, and REM maintenance cycle.
- `presentation/` owns the standalone interactive storybook.
- `demo/` contains destructive fixtures. Never seed entropy into a valuable `.claude/` profile.
- `hackathon/` is a historical record. Preserve its original submission name and claims.

## Presentation hosting

The presentation is a standalone Cloudflare Pages project. It is not part of `chann-app`,
the `tejas.nyc` artifact registry, or any other site's build.

- Source of truth: `presentation/`
- Cloudflare Pages project: `do-agents-dream`
- Production URL: `https://do-agents-dream.pages.dev/`
- Deploy entrypoint: `scripts/deploy-presentation.sh`
- Credential source: the shared `CLOUDFLARE_API_TOKEN` and
  `CLOUDFLARE_ACCOUNT_ID` environment variables

Never store Cloudflare credentials in this repository. The deploy script requires committed
tracked changes, attaches the commit SHA, and verifies the deployed HTML byte-for-byte.

Render deployment ownership was retired in August 2026. Do not restore `render.yaml`.

## Verification

For documentation-only changes, run `git diff --check` and validate every local link.
For presentation changes, deploy through `scripts/deploy-presentation.sh`; its live-content
comparison is the production gate.
