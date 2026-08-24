#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PRESENTATION_DIR="$PROJECT_ROOT/presentation"
PAGES_PROJECT="do-agents-dream"
PRODUCTION_URL="https://do-agents-dream.pages.dev/"

if ! command -v wrangler >/dev/null 2>&1; then
  echo "wrangler is required: https://developers.cloudflare.com/workers/wrangler/install-and-update/" >&2
  exit 1
fi

if [[ -z "${CLOUDFLARE_API_TOKEN:-}" || -z "${CLOUDFLARE_ACCOUNT_ID:-}" ]]; then
  echo "Cloudflare deploy credentials are not loaded." >&2
  echo "Source ~/.config/cloudflare/deploy.env and retry." >&2
  exit 1
fi

CURRENT_BRANCH="$(git -C "$PROJECT_ROOT" branch --show-current)"
if [[ "$CURRENT_BRANCH" != "main" ]]; then
  echo "Production deploys must come from main, not $CURRENT_BRANCH." >&2
  exit 1
fi

if ! git -C "$PROJECT_ROOT" diff --quiet || ! git -C "$PROJECT_ROOT" diff --cached --quiet; then
  echo "Commit tracked changes before deploying so production has clear provenance." >&2
  exit 1
fi

PRESENTATION_STATUS="$(git -C "$PROJECT_ROOT" status --porcelain=v1 --untracked-files=all --ignored -- presentation)"
if [[ -n "$PRESENTATION_STATUS" ]]; then
  echo "Commit or remove every changed, untracked, or ignored file under presentation/." >&2
  printf '%s\n' "$PRESENTATION_STATUS" >&2
  exit 1
fi

COMMIT_HASH="$(git -C "$PROJECT_ROOT" rev-parse HEAD)"
COMMIT_MESSAGE="$(git -C "$PROJECT_ROOT" log -1 --pretty=%s)"

wrangler pages deploy "$PRESENTATION_DIR" \
  --project-name "$PAGES_PROJECT" \
  --branch main \
  --commit-hash "$COMMIT_HASH" \
  --commit-message "$COMMIT_MESSAGE" \
  --commit-dirty=false

DEPLOYED_INDEX="$(mktemp)"
trap 'rm -f "$DEPLOYED_INDEX"' EXIT

curl --fail --silent --show-error --location "$PRODUCTION_URL" --output "$DEPLOYED_INDEX"

if ! cmp -s "$PRESENTATION_DIR/index.html" "$DEPLOYED_INDEX"; then
  echo "Deployment completed, but production index.html differs from the committed source." >&2
  exit 1
fi

echo "Verified $PRODUCTION_URL matches presentation/index.html"
