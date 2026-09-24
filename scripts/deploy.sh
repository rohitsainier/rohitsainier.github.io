#!/usr/bin/env bash
# Builds the site and publishes it to the GitHub Pages user site (rohitsainier.github.io → branch main).
# Usage: bash scripts/deploy.sh          (expects a clone of rohitsainier.github.io next to this folder)
#        SITE_REPO=/path/to/clone bash scripts/deploy.sh
set -euo pipefail
cd "$(dirname "$0")/.."
SITE_REPO="${SITE_REPO:-../rohitsainier.github.io}"
[ -d "$SITE_REPO/.git" ] || { echo "No git clone of the Pages repo at $SITE_REPO" >&2; exit 1; }

git -C "$SITE_REPO" pull --ff-only origin main
npm run build

# Mirror dist/ into the Pages repo. Keep git metadata, repo files and the legacy /assets media.
rsync -a --delete \
  --exclude '/.git' --exclude '/.gitignore' --exclude '/.nojekyll' --exclude '/assets/' \
  dist/ "$SITE_REPO"/
touch "$SITE_REPO/.nojekyll"   # without it Jekyll drops the _astro/ folder

cd "$SITE_REPO"
git add -A
if git diff --cached --quiet; then echo "Nothing to deploy."; exit 0; fi
git commit -m "Deploy portfolio ($(date +%Y-%m-%d))"
git push origin main
echo "Pushed — GitHub Pages usually updates within a minute: https://rohitsainier.github.io/"
