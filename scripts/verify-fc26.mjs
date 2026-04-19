#!/usr/bin/env node
/**
 * Vérifications pré-push : syntaxe data, exécution VM, cohérence HTML.
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

function fail(msg) {
  console.error('VERIFY FAIL:', msg);
  process.exit(1);
}

const dataPath = path.join(root, 'fc26-meta-data.js');
const htmlPath = path.join(root, 'fc26-meta-command-center.html');

if (!fs.existsSync(dataPath)) fail(`Fichier manquant : ${dataPath}`);
if (!fs.existsSync(htmlPath)) fail(`Fichier manquant : ${htmlPath}`);

const chk = spawnSync(process.execPath, ['--check', dataPath], { encoding: 'utf8' });
if (chk.status !== 0) fail(`Syntaxe fc26-meta-data.js : ${chk.stderr || chk.stdout || 'erreur'}`);

const code = fs.readFileSync(dataPath, 'utf8');
const ctx = { window: {} };
vm.createContext(ctx);
try {
  vm.runInContext(code, ctx, { filename: 'fc26-meta-data.js', timeout: 5000 });
} catch (e) {
  fail(`Exécution fc26-meta-data.js : ${e.message}`);
}

const D = ctx.window.FC26_META_DATA;
if (!D || typeof D !== 'object') fail('window.FC26_META_DATA absent ou invalide');

const {
  CONFIG,
  PLAYERS,
  FORMATIONS,
  FC26_TACTICS_CANON,
  FORMATION_DETAILS,
  TECHNIQUES,
  PATCHES,
  SBC_DATA,
  BEHAVIORS,
  SETTINGS,
  SETTINGS_META_GUIDE,
  META_SETUP_EXPRESS,
} = D;

if (!CONFIG || typeof CONFIG.bundleVersion !== 'string' || !CONFIG.bundleVersion.trim()) {
  fail('CONFIG.bundleVersion requis');
}
if (!CONFIG.lastOfficialPatchId) fail('CONFIG.lastOfficialPatchId requis');

for (const [name, arr] of [
  ['PLAYERS', PLAYERS],
  ['FORMATIONS', FORMATIONS],
  ['TECHNIQUES', TECHNIQUES],
  ['PATCHES', PATCHES],
  ['SBC_DATA', SBC_DATA],
  ['BEHAVIORS', BEHAVIORS],
]) {
  if (!Array.isArray(arr) || arr.length === 0) fail(`${name} doit être un tableau non vide`);
}

for (const p of PLAYERS) {
  if (!p.id || !p.name) fail(`Joueur invalide : ${JSON.stringify(p)}`);
}
for (const f of FORMATIONS) {
  if (!f.name || typeof f.score !== 'number') fail(`Formation invalide : ${JSON.stringify(f)}`);
}
if (!FORMATION_DETAILS || typeof FORMATION_DETAILS !== 'object') fail('FORMATION_DETAILS manquant');
if (!FC26_TACTICS_CANON || typeof FC26_TACTICS_CANON !== 'object') fail('FC26_TACTICS_CANON manquant');
const defOpts = FC26_TACTICS_CANON.optionsApprocheDefensive;
const buildOpts = FC26_TACTICS_CANON.optionsStyleConstruction;
if (!Array.isArray(defOpts) || defOpts.length !== 4) {
  fail('FC26_TACTICS_CANON.optionsApprocheDefensive doit être un tableau de 4 entrées');
}
if (!Array.isArray(buildOpts) || buildOpts.length !== 3) {
  fail('FC26_TACTICS_CANON.optionsStyleConstruction doit être un tableau de 3 entrées');
}
if (!Array.isArray(FC26_TACTICS_CANON.citationsEa) || FC26_TACTICS_CANON.citationsEa.length < 1) {
  fail('FC26_TACTICS_CANON.citationsEa requis');
}
for (const q of FC26_TACTICS_CANON.citationsEa) {
  if (!q.texteFr || !q.url) fail('citationsEa : chaque entrée doit avoir texteFr et url');
}
for (const f of FORMATIONS) {
  const det = FORMATION_DETAILS[f.name];
  if (!det) fail(`FORMATION_DETAILS manque la clé : ${f.name}`);
  if (!det.styleConstruction || !det.approcheDefensive) {
    fail(`FORMATION_DETAILS incomplet (styleConstruction / approcheDefensive) : ${f.name}`);
  }
  if (!defOpts.includes(det.approcheDefensive)) {
    fail(`approcheDefensive invalide pour ${f.name} : ${det.approcheDefensive}`);
  }
  if (!buildOpts.includes(det.styleConstruction)) {
    fail(`styleConstruction invalide pour ${f.name} : ${det.styleConstruction}`);
  }
  if (!Array.isArray(det.gabaritsSelecteur) || det.gabaritsSelecteur.length < 1) {
    fail(`FORMATION_DETAILS.gabaritsSelecteur requis pour : ${f.name}`);
  }
  for (const t of det.gabaritsSelecteur) {
    if (!t || typeof t !== 'string') fail(`gabaritsSelecteur invalide dans ${f.name}`);
  }
  if (!det.noteGabarits || typeof det.noteGabarits !== 'string') {
    fail(`FORMATION_DETAILS.noteGabarits requis pour : ${f.name}`);
  }
  if (!Array.isArray(det.slots) || det.slots.length !== 11) {
    fail(`FORMATION_DETAILS.slots doit avoir 11 postes pour : ${f.name} (reçu ${det.slots?.length})`);
  }
  for (const s of det.slots) {
    if (!s.poste || !s.rolePlus) fail(`Slot invalide dans ${f.name}`);
  }
}
for (const t of TECHNIQUES) {
  if (!t.name || !t.category) fail(`Technique invalide : ${JSON.stringify(t)}`);
}

const settingsKeys = ['balanced', 'aggressive', 'technical', 'control', 'pressing', 'defensive'];
if (!SETTINGS || typeof SETTINGS !== 'object') fail('SETTINGS manquant');
for (const k of settingsKeys) {
  if (!SETTINGS[k] || !SETTINGS[k].label) fail(`SETTINGS.${k} incomplet`);
}
if (!SETTINGS_META_GUIDE || typeof SETTINGS_META_GUIDE !== 'object') fail('SETTINGS_META_GUIDE manquant');
if (!SETTINGS_META_GUIDE.disclaimer) fail('SETTINGS_META_GUIDE.disclaimer requis');
if (!META_SETUP_EXPRESS || typeof META_SETUP_EXPRESS !== 'object') fail('META_SETUP_EXPRESS manquant');
for (const k of ['titre', 'accroche', 'disclaimer', 'rappelChimieUneLigne']) {
  if (!META_SETUP_EXPRESS[k] || typeof META_SETUP_EXPRESS[k] !== 'string') {
    fail(`META_SETUP_EXPRESS.${k} requis (chaîne)`);
  }
}
if (!Array.isArray(META_SETUP_EXPRESS.etapes) || META_SETUP_EXPRESS.etapes.length < 5) {
  fail('META_SETUP_EXPRESS.etapes doit être un tableau d’au moins 5 entrées');
}
for (const st of META_SETUP_EXPRESS.etapes) {
  if (!st || typeof st.titre !== 'string' || typeof st.texte !== 'string') {
    fail('META_SETUP_EXPRESS.etapes : chaque entrée doit avoir titre et texte');
  }
}
const topScoreForm = [...FORMATIONS].sort((a, b) => (Number(b.score) || 0) - (Number(a.score) || 0))[0];
if (!FORMATION_DETAILS[topScoreForm.name]) {
  fail(`FORMATION_DETAILS doit inclure la formation au score max (${topScoreForm.name}) pour Rivaux express`);
}
if (!Array.isArray(SETTINGS_META_GUIDE.sourceLinks) || SETTINGS_META_GUIDE.sourceLinks.length < 2) {
  fail('SETTINGS_META_GUIDE.sourceLinks incomplet');
}

const html = fs.readFileSync(htmlPath, 'utf8');
const required = [
  'function escapeHtml',
  'function initTheme',
  'function escapeJsString',
  'function ensureCatalogLoaded',
  'initTheme();',
  'localStorage.setItem(THEME_KEY',
  'lastFocusBeforeDrawer',
  'dash-official-patch-cta',
  'id="page-squad"',
];
for (const needle of required) {
  if (!html.includes(needle)) fail(`HTML : chaîne requise absente — ${needle}`);
}

const srcMatch = html.match(/<script\s+src="fc26-meta-data\.js(\?v=([^"]+))?"/);
if (!srcMatch) fail('Balise script fc26-meta-data.js introuvable dans le HTML');
if (srcMatch[2] && srcMatch[2] !== CONFIG.bundleVersion) {
  fail(
    `Cache-bust : src indique ?v=${srcMatch[2]} mais CONFIG.bundleVersion=${CONFIG.bundleVersion} (relancer push.sh pour synchroniser).`,
  );
}

const catalogPath = path.join(root, 'data', 'fc26-cards-catalog.json');
if (!fs.existsSync(catalogPath)) {
  console.warn('VERIFY WARN: data/fc26-cards-catalog.json absent — prototype équipe : node scripts/build-fc26-cards-catalog.mjs');
} else {
  try {
    const raw = fs.readFileSync(catalogPath, 'utf8');
    const parsed = JSON.parse(raw);
    const n = parsed && Array.isArray(parsed.cards) ? parsed.cards.length : 0;
    if (n < 1000) console.warn('VERIFY WARN: catalogue FC26 très petit (' + n + ' cartes)');
  } catch (e) {
    console.warn('VERIFY WARN: fc26-cards-catalog.json illisible :', e.message);
  }
}

console.log('VERIFY OK — bundle', CONFIG.bundleVersion, '· joueurs', PLAYERS.length, '· formations', FORMATIONS.length);
