#!/usr/bin/env bash
# Exécuter dans le Terminal macOS (pas uniquement via l’agent Cursor si git échoue).
set -euo pipefail
cd "$(dirname "$0")"

if [[ ! -f fc26-meta-command-center.html || ! -f fc26-meta-data.js ]]; then
  echo "Fichiers manquants dans $(pwd)" >&2
  exit 1
fi

if [[ ! -d .git ]]; then
  git init
fi

git add .gitignore fc26-meta-command-center.html fc26-meta-data.js push.sh 2>/dev/null || git add .gitignore fc26-meta-command-center.html fc26-meta-data.js

if git diff --staged --quiet; then
  echo "Rien de nouveau à committer."
else
  git commit -m "FC26 Meta Command Center: static UI + data bundle (post-patch editable)"
fi

git branch -M main 2>/dev/null || true

if ! git remote get-url origin &>/dev/null; then
  git remote add origin https://github.com/StrainUS/FC26-Meta.git
fi

echo "→ git push vers https://github.com/StrainUS/FC26-Meta"
echo "  Si auth échoue : gh auth login -h github.com"
git push -u origin main
