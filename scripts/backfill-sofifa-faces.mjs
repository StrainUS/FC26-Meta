#!/usr/bin/env node
/**
 * Remplit data/fc26-cards-catalog.json : pour chaque carte sans URL portrait
 * valide, définit l’URL canonique cdn.sofifa.net dérivée de l’id joueur (6 chiffres → aaa/bbb).
 * Les assets peuvent rester absents côté SofIFA (regens) : l’app enchaîne années / tailles puis initiales.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const catalogPath = path.join(root, 'data', 'fc26-cards-catalog.json');

function sofifaFaceUrlFromPlayerId(idRaw) {
  const id = String(idRaw != null ? idRaw : '').trim();
  if (!/^\d+$/.test(id)) return '';
  const p6 = id.padStart(6, '0');
  return `https://cdn.sofifa.net/players/${p6.slice(0, 3)}/${p6.slice(3)}/26_120.png`;
}

const raw = fs.readFileSync(catalogPath, 'utf8');
const data = JSON.parse(raw);
const cards = data.cards;
if (!Array.isArray(cards)) throw new Error('fc26-cards-catalog.json : tableau cards attendu');

let filled = 0;
for (const c of cards) {
  const f = c.face != null ? String(c.face).trim() : '';
  if (f && /^https?:\/\//i.test(f)) continue;
  const u = sofifaFaceUrlFromPlayerId(c.id);
  if (!u) continue;
  c.face = u;
  filled += 1;
}

if (filled) {
  if (data.meta && typeof data.meta === 'object') {
    data.meta.faceNoteFr =
      'Portrait : URL DataHub si présente, sinon URL SofIFA dérivée de l’id (aaa/bbb/26_120.png). Si le fichier n’existe pas (regens, etc.), l’app essaie FC25/FC24 et d’autres tailles puis affiche des initiales.';
  }
  fs.writeFileSync(catalogPath, JSON.stringify(data));
  console.error('SofIFA faces :', filled, 'carte(s) complétée(s) ·', catalogPath);
} else {
  console.error('SofIFA faces : rien à compléter (déjà renseigné).');
}
