# Architecture FC26 Méta Lab

Application **statique** (HTML + JS + CSS + JSON) servie en HTTP local ou hébergement pages.

## Dossiers

| Chemin | Rôle |
|--------|------|
| `fc26-meta-command-center.html` | Shell SPA : navigation, pages, chargement des scripts |
| `assets/fc26-meta-data.js` | Données EA + stratégies + profils esport (`window.FC26_META_DATA`) |
| `assets/fc26-command-center.js` | Logique UI principale (catalogue, équipe, formations, recherche) |
| `assets/js/fc26-meta-lab.js` | **Méta Lab** : presets tactiques (`localStorage`), raccourcis |
| `assets/fc26-command-center.css` | Styles |
| `data/fc26-cards-catalog.json` | Pool joueurs (build script) |
| `data/fc26-catalog-extra.json` | Cartes complémentaires optionnelles |
| `scripts/verify-fc26.mjs` | Contrôles avant push (`node scripts/verify-fc26.mjs`) |
| `push.sh` | Sync `?v=` avec `CONFIG.bundleVersion`, verify, commit, push |

## Modes (`CONFIG.appMode`)

- **`meta_lab`** (défaut) : filtres formations étendus, consignes depuis le fichier `FORMATION_DETAILS`, **presets** stockés dans le navigateur, badges analytiques possibles sur certains écrans.
- **`official_only`** : lecture « EA seule » stricte (consignes remplacées par le rappel `CONFIG.officialSlotConsigne` sur les fiches 11 postes, filtres S/A masqués).

## Méta Lab (presets)

- Clé `localStorage` : `fc26-meta-lab-presets-v1`.
- Aucun envoi serveur : codes tactiques et notes restent sur la machine.
- Les **prix FUT**, **cartes promo** et **validation post-patch** se font dans le client EA.

## Cache-busting

Tous les assets référencés dans le HTML doivent partager `?v=` = `CONFIG.bundleVersion` (`push.sh` synchronise).
