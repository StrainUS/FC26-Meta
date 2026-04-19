#!/usr/bin/env bash
# Déploiement : synchronise le cache-busting du bundle, vérifie les données, commit, push.
set -euo pipefail
cd "$(dirname "$0")"

if [[ ! -f fc26-meta-command-center.html || ! -f fc26-meta-data.js ]]; then
  echo "Fichiers manquants dans $(pwd)" >&2
  exit 1
fi

if [[ ! -f scripts/verify-fc26.mjs ]]; then
  echo "scripts/verify-fc26.mjs manquant" >&2
  exit 1
fi

BUNDLE_VER="$(grep -oE "bundleVersion:[[:space:]]*'[^']+'" fc26-meta-data.js | head -1 | sed -E "s/bundleVersion:[[:space:]]*'([^']+)'.*/\1/" || true)"
if [[ -z "${BUNDLE_VER}" ]]; then
  echo "Impossible de lire bundleVersion dans fc26-meta-data.js" >&2
  exit 1
fi

echo "→ Sync cache-bust fc26-meta-data.js → ?v=${BUNDLE_VER}"
if [[ "$(uname -s)" == "Darwin" ]]; then
  sed -i '' "s|src=\"fc26-meta-data.js[^\"]*\"|src=\"fc26-meta-data.js?v=${BUNDLE_VER}\"|" fc26-meta-command-center.html
else
  sed -i "s|src=\"fc26-meta-data.js[^\"]*\"|src=\"fc26-meta-data.js?v=${BUNDLE_VER}\"|" fc26-meta-command-center.html
fi

echo "→ Vérifications Node (données + HTML)"
node scripts/verify-fc26.mjs

if [[ ! -d .git ]]; then
  git init
fi

git add .gitignore index.html fc26-meta-command-center.html fc26-meta-data.js push.sh scripts/verify-fc26.mjs scripts/build-fc26-cards-catalog.mjs data/fc26-cards-catalog.json 2>/dev/null \
  || git add .gitignore index.html fc26-meta-command-center.html fc26-meta-data.js scripts/verify-fc26.mjs scripts/build-fc26-cards-catalog.mjs data/fc26-cards-catalog.json

if git diff --staged --quiet; then
  echo "Rien de nouveau à committer."
else
  git commit -m "$(cat <<'EOF'
perf: optimiser rendu, thème persistant et cache-busting

Échappement HTML/JS sur les vues dynamiques, piège au focus du drawer,
CTA patch aligné sur CONFIG/PATCHES, garde-fous réglages et patch notes.
push.sh synchronise ?v= avec bundleVersion puis exécute scripts/verify-fc26.mjs.
EOF
)"
fi

git branch -M main 2>/dev/null || true

if ! git remote get-url origin &>/dev/null; then
  git remote add origin https://github.com/StrainUS/FC26-Meta.git
fi

echo "→ git push vers https://github.com/StrainUS/FC26-Meta"
echo "  Si auth échoue : gh auth login -h github.com"
git push -u origin main
