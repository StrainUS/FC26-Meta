#!/usr/bin/env node
/**
 * Télécharge le jeu de données public EAFC26-DataHub (Kaggle / SoFIFA align FC26),
 * le convertit au format « cartes » compact pour le créateur d’équipe local.
 *
 * Source : https://github.com/ismailoksuz/EAFC26-DataHub (fichier data/players.json.gz)
 * Licence : vérifier le dépôt upstream ; données dérivées des notes / attributs FC26.
 *
 * Usage : node scripts/build-fc26-cards-catalog.mjs
 * Sortie : data/fc26-cards-catalog.json
 */
import fs from 'node:fs';
import https from 'node:https';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import zlib from 'node:zlib';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const outPath = path.join(root, 'data', 'fc26-cards-catalog.json');
const url =
  'https://raw.githubusercontent.com/ismailoksuz/EAFC26-DataHub/main/data/players.json.gz';

function fetchBuf(u) {
  return new Promise((resolve, reject) => {
    https
      .get(u, (res) => {
        if (res.statusCode && res.statusCode >= 400) {
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => resolve(Buffer.concat(chunks)));
      })
      .on('error', reject);
  });
}

/** Le dépôt upstream peut contenir `NaN` / `Infinity` (non conformes JSON strict). */
function parseJsonLenient(buf) {
  const s = buf.toString('utf8');
  const fixed = s
    .replace(/:\s*NaN\b/g, ': null')
    .replace(/:\s*-Infinity\b/g, ': null')
    .replace(/:\s*Infinity\b/g, ': null');
  return JSON.parse(fixed);
}

function mapPlayer(p) {
  const positions = String(p.player_positions || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return {
    id: String(p.player_id),
    name: String(p.long_name || p.short_name || '').trim(),
    shortName: String(p.short_name || '').trim(),
    ovr: Math.round(Number(p.overall) || 0),
    pot: Math.round(Number(p.potential) || 0),
    age: Math.round(Number(p.age) || 0),
    pos: positions[0] || 'CM',
    positions,
    club: String(p.club_name || '').trim(),
    nation: String(p.nationality_name || '').trim(),
    league: String(p.league_name || '').trim(),
    face: p.player_face_url ? String(p.player_face_url) : '',
    pace: Math.round(Number(p.pace) || 0),
    sho: Math.round(Number(p.shooting) || 0),
    pas: Math.round(Number(p.passing) || 0),
    dri: Math.round(Number(p.dribbling) || 0),
    def: Math.round(Number(p.defending) || 0),
    phy: Math.round(Number(p.physic) || 0),
    sm: Math.round(Number(p.skill_moves) || 0),
    wf: Math.round(Number(p.weak_foot) || 0),
    /** Type carte : base roster FC26 (pas TOTY / événements FUT — ce fichier = pool notes FC26). */
    cardType: 'Base FC26',
    dataSource: 'EAFC26-DataHub',
  };
}

async function main() {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  console.error('Téléchargement…', url);
  const gz = await fetchBuf(url);
  console.error('Décompression…', gz.length, 'octets gzip');
  const jsonBuf = zlib.gunzipSync(gz);
  const arr = parseJsonLenient(jsonBuf);
  if (!Array.isArray(arr)) throw new Error('JSON attendu : tableau racine');
  const cards = arr.map(mapPlayer).filter((c) => c.id && c.name);
  const meta = {
    generatedAt: new Date().toISOString(),
    count: cards.length,
    upstream: url,
    noteFr:
      'Pool « notes FC26 » (carrière / base de données joueurs). Les cartes spéciales FUT (TOTY, événements) ne sont pas dans ce fichier — uniquement les joueurs et GES de base.',
  };
  const payload = { meta, cards };
  fs.writeFileSync(outPath, JSON.stringify(payload), 'utf8');
  const st = fs.statSync(outPath);
  console.error('Écrit', outPath, '·', cards.length, 'cartes ·', Math.round(st.size / 1024 / 1024), 'Mo');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
