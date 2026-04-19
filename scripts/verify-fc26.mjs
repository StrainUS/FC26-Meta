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

const dataPath = path.join(root, 'assets', 'fc26-meta-data.js');
const appJsPath = path.join(root, 'assets', 'fc26-command-center.js');
const htmlPath = path.join(root, 'fc26-meta-command-center.html');

if (!fs.existsSync(dataPath)) fail(`Fichier manquant : ${dataPath}`);
if (!fs.existsSync(appJsPath)) fail(`Fichier manquant : ${appJsPath}`);
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
  META_TABLE,
  LIVE_META,
  CELEBRATIONS,
  META_APP_CHARTER,
} = D;

if (!CONFIG || typeof CONFIG.bundleVersion !== 'string' || !CONFIG.bundleVersion.trim()) {
  fail('CONFIG.bundleVersion requis');
}
if (CONFIG.appMode && !['meta_lab', 'official_only'].includes(CONFIG.appMode)) {
  fail('CONFIG.appMode doit être meta_lab ou official_only');
}
if (!CONFIG.lastOfficialPatchId) fail('CONFIG.lastOfficialPatchId requis');
if (!CONFIG.expressFormationRef || typeof CONFIG.expressFormationRef !== 'string') {
  fail('CONFIG.expressFormationRef requis (formation exemple pour Rivaux express — pas un classement EA)');
}

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
if (!Array.isArray(META_TABLE) || META_TABLE.length < 1) {
  fail('META_TABLE doit être un tableau d’au moins une ligne (synthèse gameplay EA)');
}
for (const r of META_TABLE) {
  if (!r || typeof r.el !== 'string' || typeof r.rappel !== 'string') {
    fail(`META_TABLE : chaque ligne doit avoir el et rappel — ${JSON.stringify(r)}`);
  }
  if (typeof r.perimetre !== 'string' || typeof r.suivi !== 'string') {
    fail(`META_TABLE : perimetre et suivi requis — ${JSON.stringify(r)}`);
  }
  if (r.src !== 'official' && r.src !== 'analytical') {
    fail(`META_TABLE : src doit être official ou analytical — ${JSON.stringify(r)}`);
  }
}
const formationNameSet = new Set((FORMATIONS || []).map((f) => f.name));
if (!LIVE_META || typeof LIVE_META !== 'object') fail('LIVE_META requis');
if (typeof LIVE_META.headline !== 'string' || !LIVE_META.headline.trim()) fail('LIVE_META.headline requis');
if (typeof LIVE_META.updatedAt !== 'string' || !LIVE_META.updatedAt.trim()) fail('LIVE_META.updatedAt requis (ex. YYYY-MM-DD)');
if (!Array.isArray(LIVE_META.picks) || LIVE_META.picks.length < 1) {
  fail('LIVE_META.picks : au moins une entrée (hub méta type Warzone)');
}
const liveKinds = new Set(['formation', 'gestes', 'players', 'squad', 'guide', 'note', 'celebrations']);
for (const p of LIVE_META.picks) {
  if (!p || typeof p.id !== 'string' || !p.id.trim()) fail(`LIVE_META.picks : id requis — ${JSON.stringify(p)}`);
  if (!p.kind || typeof p.kind !== 'string' || !liveKinds.has(p.kind)) {
    fail(`LIVE_META.picks.kind invalide pour ${p.id} — utiliser formation|gestes|players|squad|guide|note`);
  }
  if (typeof p.title !== 'string' || !p.title.trim()) fail(`LIVE_META.picks.title requis — ${p.id}`);
  if (typeof p.blurb !== 'string' || !p.blurb.trim()) fail(`LIVE_META.picks.blurb requis — ${p.id}`);
  if (p.tag != null && typeof p.tag !== 'string') fail(`LIVE_META.picks.tag doit être une chaîne — ${p.id}`);
  if (p.tier != null && typeof p.tier !== 'string') fail(`LIVE_META.picks.tier doit être une chaîne — ${p.id}`);
  if (p.kind === 'formation') {
    if (!p.formationName || typeof p.formationName !== 'string' || !formationNameSet.has(p.formationName)) {
      fail(`LIVE_META.picks.formationName doit exister dans FORMATIONS — ${p.id}`);
    }
  }
  if (p.kind === 'gestes' && p.scrollTo != null && typeof p.scrollTo !== 'string') {
    fail(`LIVE_META.picks.scrollTo doit être une chaîne — ${p.id}`);
  }
}
if (!FORMATION_DETAILS[CONFIG.expressFormationRef]) {
  fail(`FORMATION_DETAILS doit inclure CONFIG.expressFormationRef (${CONFIG.expressFormationRef})`);
}
if (!META_APP_CHARTER || typeof META_APP_CHARTER !== 'object') fail('META_APP_CHARTER manquant');
for (const k of ['lead', 'appBlock', 'eaBlock']) {
  if (typeof META_APP_CHARTER[k] !== 'string' || !META_APP_CHARTER[k].trim()) {
    fail(`META_APP_CHARTER.${k} requis (chaîne non vide)`);
  }
}
if (!CELEBRATIONS || typeof CELEBRATIONS !== 'object') fail('CELEBRATIONS manquant');
if (!Array.isArray(CELEBRATIONS.basics) || CELEBRATIONS.basics.length < 2) {
  fail('CELEBRATIONS.basics : au moins 2 entrées (signature / aléatoire / passer…)');
}
for (const b of CELEBRATIONS.basics) {
  if (!b || typeof b.name !== 'string' || typeof b.ps !== 'string' || typeof b.xbox !== 'string') {
    fail('CELEBRATIONS.basics : chaque ligne doit avoir name, ps, xbox');
  }
}
if (!Array.isArray(CELEBRATIONS.sections) || CELEBRATIONS.sections.length < 1) {
  fail('CELEBRATIONS.sections : au moins une section (finition, course, etc.)');
}
for (const sec of CELEBRATIONS.sections) {
  if (!sec || typeof sec.title !== 'string' || !Array.isArray(sec.rows) || sec.rows.length < 1) {
    fail(`CELEBRATIONS.section invalide : ${JSON.stringify(sec && sec.title)}`);
  }
  for (const r of sec.rows) {
    if (!r || typeof r.name !== 'string' || typeof r.ps !== 'string' || typeof r.xbox !== 'string') {
      fail(`CELEBRATIONS.rows : name, ps, xbox requis — ${JSON.stringify(r)}`);
    }
  }
}
if (!Array.isArray(SETTINGS_META_GUIDE.sourceLinks) || SETTINGS_META_GUIDE.sourceLinks.length < 2) {
  fail('SETTINGS_META_GUIDE.sourceLinks incomplet');
}

const html = fs.readFileSync(htmlPath, 'utf8');
const appJs = fs.readFileSync(appJsPath, 'utf8');
const synApp = spawnSync(process.execPath, ['--check', appJsPath], { encoding: 'utf8' });
if (synApp.status !== 0) {
  fail(`Syntaxe assets/fc26-command-center.js : ${synApp.stderr || synApp.stdout || 'erreur'}`);
}

const required = [
  'function escapeHtml',
  'function initTheme',
  'function escapeJsString',
  'function ensureCatalogLoaded',
  'function playersRosterEnsureCatalog',
  'function buildCatalogPlayerDetailHTML',
  'initTheme();',
  'localStorage.setItem(THEME_KEY',
  'page-formation-detail',
  'id="dash-kpis"',
  'id="page-squad"',
  'id="site-nav"',
  'function fc26SyncHeaderHeight',
  'id="page-meta-home"',
  'function renderMetaHome',
  'id="meta-live-root"',
  'function renderMetaLive',
  'function fc26MetaHomeTab',
  'function renderCelebrationsPage',
  'meta-panel-hub',
  'meta-app-charter-root',
  'function renderMetaAppCharter',
];
const htmlPlusApp = html + '\n' + appJs;
for (const needle of required) {
  if (!htmlPlusApp.includes(needle)) fail(`HTML / app JS : chaîne requise absente — ${needle}`);
}

const assetRefs = [
  ['assets/fc26-meta-data.js', /assets\/fc26-meta-data\.js\?v=([^"]+)/],
  ['assets/fc26-command-center.js', /assets\/fc26-command-center\.js\?v=([^"]+)/],
  ['assets/fc26-command-center.css', /assets\/fc26-command-center\.css\?v=([^"]+)/],
];
for (const [label, re] of assetRefs) {
  const m = html.match(re);
  if (!m) fail(`Référence manquante dans le HTML : ${label}?v=…`);
  if (m[1] !== CONFIG.bundleVersion) {
    fail(
      `Cache-bust ${label} : ?v=${m[1]} mais CONFIG.bundleVersion=${CONFIG.bundleVersion} (relancer push.sh pour synchroniser).`,
    );
  }
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

const extraPath = path.join(root, 'data', 'fc26-catalog-extra.json');
if (fs.existsSync(extraPath)) {
  try {
    const ex = JSON.parse(fs.readFileSync(extraPath, 'utf8'));
    if (!Array.isArray(ex.cards)) fail('fc26-catalog-extra.json : propriété cards[] requise');
    for (const c of ex.cards) {
      if (!c || !c.id || !c.name) fail('fc26-catalog-extra.json : chaque carte doit avoir id et name');
    }
  } catch (e) {
    if (e.message && e.message.startsWith('VERIFY')) throw e;
    fail(`fc26-catalog-extra.json : ${e.message}`);
  }
}

console.log('VERIFY OK — bundle', CONFIG.bundleVersion, '· joueurs', PLAYERS.length, '· formations', FORMATIONS.length);
