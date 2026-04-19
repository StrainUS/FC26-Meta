#!/usr/bin/env node
/**
 * Télécharge le jeu de données public EAFC26-DataHub (Kaggle / SoFIFA align FC26),
 * le convertit au format « cartes » compact pour le créateur d’équipe local.
 *
 * Source : https://github.com/ismailoksuz/EAFC26-DataHub (fichier data/players.json.gz)
 * Licence : vérifier le dépôt upstream ; données dérivées des notes / attributs FC26.
 *
 * Usage :
 *   node scripts/build-fc26-cards-catalog.mjs
 *   node scripts/build-fc26-cards-catalog.mjs --verify-faces
 *
 * --verify-faces : requête HEAD sur chaque URL SofIFA ; si non 200, champ face vidé
 * (affiche les initiales dans l’app au lieu d’une image cassée). ~18k requêtes, ~2–4 min.
 *
 * Sortie : data/fc26-cards-catalog.json
 *
 * Compléments manuels (retraités, etc.) : éditer data/fc26-catalog-extra.json — fusionné
 * automatiquement par l’app au chargement (pas par ce script).
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

const VERIFY_FACES = process.argv.includes('--verify-faces');
const FACE_CHECK_CONCURRENCY = 24;
const UA = 'Mozilla/5.0 (compatible; FC26-Meta-catalog/1.0; +https://github.com/StrainUS/FC26-Meta)';

function fetchBuf(u) {
  return new Promise((resolve, reject) => {
    https
      .get(
        u,
        {
          headers: { 'User-Agent': UA },
        },
        (res) => {
          if (res.statusCode && res.statusCode >= 400) {
            reject(new Error(`HTTP ${res.statusCode}`));
            return;
          }
          const chunks = [];
          res.on('data', (c) => chunks.push(c));
          res.on('end', () => resolve(Buffer.concat(chunks)));
        },
      )
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

function headOk(imageUrl) {
  return new Promise((resolve) => {
    let u;
    try {
      u = new URL(imageUrl);
    } catch {
      resolve(false);
      return;
    }
    const opts = {
      protocol: u.protocol,
      hostname: u.hostname,
      port: u.port || undefined,
      path: u.pathname + u.search,
      method: 'HEAD',
      headers: { 'User-Agent': UA, Accept: '*/*' },
    };
    const req = https.request(opts, (res) => {
      res.resume();
      resolve(res.statusCode === 200);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(15000, () => {
      req.destroy();
      resolve(false);
    });
    req.end();
  });
}

async function verifyFacesOnCards(cards) {
  let next = 0;
  let removed = 0;
  let checked = 0;
  const total = cards.filter((c) => c.face && /^https?:\/\//i.test(c.face)).length;
  console.error('Vérification des portraits SofIFA…', total, 'URL');

  async function worker() {
    for (;;) {
      const i = next++;
      if (i >= cards.length) return;
      const c = cards[i];
      if (!c.face || !/^https?:\/\//i.test(c.face)) continue;
      checked += 1;
      const ok = await headOk(c.face);
      if (!ok) {
        c.face = '';
        removed += 1;
      }
      if (checked % 800 === 0) {
        console.error(' …', checked, '/', total, '· retirés', removed);
      }
    }
  }

  await Promise.all(Array.from({ length: FACE_CHECK_CONCURRENCY }, () => worker()));
  console.error('Portraits :', removed, 'URL invalides vidées sur', total, 'testées.');
  return removed;
}

function sofifaFaceUrlFromPlayerId(idRaw) {
  const id = String(idRaw != null ? idRaw : '').trim();
  if (!/^\d+$/.test(id)) return '';
  const p6 = id.padStart(6, '0');
  return `https://cdn.sofifa.net/players/${p6.slice(0, 3)}/${p6.slice(3)}/26_120.png`;
}

function mapPlayer(p) {
  const positions = String(p.player_positions || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const hubFace = p.player_face_url ? String(p.player_face_url).trim() : '';
  const face = /^https?:\/\//i.test(hubFace) ? hubFace : sofifaFaceUrlFromPlayerId(p.player_id);
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
    face,
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

  let facesRemoved = 0;
  if (VERIFY_FACES) {
    facesRemoved = await verifyFacesOnCards(cards);
  }

  const meta = {
    generatedAt: new Date().toISOString(),
    count: cards.length,
    upstream: url,
    noteFr:
      'Pool « notes FC26 » (carrière / base de données joueurs). Les cartes spéciales FUT (TOTY, événements) ne sont pas dans ce fichier — uniquement les joueurs et GES de base.',
    faceNoteFr:
      'Les portraits : URL DataHub (player_face_url) si valide, sinon URL SofIFA dérivée de l’id. Sans fichier sur le CDN (regens, etc.), l’app enchaîne FC26/25/24 et plusieurs tailles puis initiales. Rebuild avec --verify-faces pour vider les URL mortes renvoyées par le DataHub.',
    ...(VERIFY_FACES ? { facesVerifiedAt: new Date().toISOString(), facesRemovedCount: facesRemoved } : {}),
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
