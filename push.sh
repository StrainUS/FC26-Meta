#!/usr/bin/env bash
# Déploiement : synchronise ?v= avec bundleVersion, vérifie les données, commit, push.
set -euo pipefail
cd "$(dirname "$0")"

if [[ ! -f fc26-meta-command-center.html || ! -f assets/fc26-meta-data.js ]]; then
  echo "Fichiers manquants dans $(pwd) (attendu : HTML racine + assets/fc26-meta-data.js)" >&2
  exit 1
fi

if [[ ! -f scripts/verify-fc26.mjs ]]; then
  echo "scripts/verify-fc26.mjs manquant" >&2
  exit 1
fi

BUNDLE_VER="$(grep -oE "bundleVersion:[[:space:]]*'[^']+'" assets/fc26-meta-data.js | head -1 | sed -E "s/bundleVersion:[[:space:]]*'([^']+)'.*/\1/" || true)"
if [[ -z "${BUNDLE_VER}" ]]; then
  echo "Impossible de lire bundleVersion dans assets/fc26-meta-data.js" >&2
  exit 1
fi

echo "→ Sync cache-bust assets → ?v=${BUNDLE_VER}"
if [[ "$(uname -s)" == "Darwin" ]]; then
  sed -i '' \
    -e "s|\\(assets/fc26-meta-data\\.js\\)?v=[^\"]*|\\1?v=${BUNDLE_VER}|g" \
    -e "s|\\(assets/fc26-command-center\\.js\\)?v=[^\"]*|\\1?v=${BUNDLE_VER}|g" \
    -e "s|\\(assets/fc26-command-center\\.css\\)?v=[^\"]*|\\1?v=${BUNDLE_VER}|g" \
    fc26-meta-command-center.html
else
  sed -i \
    -e "s|\\(assets/fc26-meta-data\\.js\\)?v=[^\"]*|\\1?v=${BUNDLE_VER}|g" \
    -e "s|\\(assets/fc26-command-center\\.js\\)?v=[^\"]*|\\1?v=${BUNDLE_VER}|g" \
    -e "s|\\(assets/fc26-command-center\\.css\\)?v=[^\"]*|\\1?v=${BUNDLE_VER}|g" \
    fc26-meta-command-center.html
fi

echo "→ Vérifications Node (données + HTML)"
node scripts/verify-fc26.mjs

if [[ ! -d .git ]]; then
  git init
fi

git add -A .

if git diff --staged --quiet; then
  echo "Rien de nouveau à committer."
else
  git commit -m "$(cat <<'EOF'
chore: hub onglets, charte méta app, célébrations et dépôt assets

Synchronise ?v= avec CONFIG.bundleVersion. Hub Méta en onglets (scroll interne), META_APP_CHARTER (ligne FC26-Meta vs cadre EA), LIVE_META, CELEBRATIONS PS/Xbox/PC, scripts/verify-fc26.mjs. Données et JS/CSS sous assets/ ; suppression de l’ancien fc26-meta-data.js à la racine.
EOF
)"
fi

git branch -M main 2>/dev/null || true

if ! git remote get-url origin &>/dev/null; then
  git remote add origin https://github.com/StrainUS/FC26-Meta.git
fi

echo "→ git push vers origin (main)"
echo "  Si auth échoue : gh auth login -h github.com"
git push -u origin main
