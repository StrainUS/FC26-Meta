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
  TECHNIQUES,
  PATCHES,
  SBC_DATA,
  BEHAVIORS,
  SETTINGS,
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
for (const t of TECHNIQUES) {
  if (!t.name || !t.category) fail(`Technique invalide : ${JSON.stringify(t)}`);
}

const settingsKeys = ['balanced', 'aggressive', 'technical', 'control', 'pressing', 'defensive'];
if (!SETTINGS || typeof SETTINGS !== 'object') fail('SETTINGS manquant');
for (const k of settingsKeys) {
  if (!SETTINGS[k] || !SETTINGS[k].label) fail(`SETTINGS.${k} incomplet`);
}

const html = fs.readFileSync(htmlPath, 'utf8');
const required = [
  'function escapeHtml',
  'function initTheme',
  'function escapeJsString',
  'initTheme();',
  'localStorage.setItem(THEME_KEY',
  'lastFocusBeforeDrawer',
  'dash-official-patch-cta',
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

console.log('VERIFY OK — bundle', CONFIG.bundleVersion, '· joueurs', PLAYERS.length, '· formations', FORMATIONS.length);
