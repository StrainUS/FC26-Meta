let CONFIG, PLAYERS, FORMATIONS, FC26_TACTICS_CANON, FORMATION_DETAILS, TECHNIQUES, SBC_DATA, PATCHES, BEHAVIORS, META_TABLE, META_SNAPSHOT, CHEM_OFFICIAL, CHEM_PICKS, SETTINGS, SETTINGS_META_GUIDE, META_SETUP_EXPRESS, LIVE_META, CELEBRATIONS, META_APP_CHARTER;
let playerFilters = { q:'', pos:'', league:'', acc:'', patchSens:'' };
const THEME_KEY = 'fc26-theme';
let detailReturnFormation = 'meta-home';
let detailReturnPlayer = 'players';
let _fc26RouteSuppress = false;

/** Catalogue FC26 (build script → data/fc26-cards-catalog.json) */
let FC26_CARDS = null;
let FC26_CARDS_META = null;
let _fc26CatalogPromise = null;
let _squadCardMap = null;
let squadState = { formation: '4-2-3-1', starters: Array(11).fill(null), bench: Array(7).fill(null) };
let squadPickSlot = null;
let _squadStateInited = false;
const SQUAD_LS_KEY = 'fc26-squad-prototype-v1';
/** Affichage par lots (évite de monter 18k nœuds DOM d’un coup). */
const CATALOG_PAGE_CHUNK = 400;
let _squadCatListSig = '';
let _squadCatShowCount = CATALOG_PAGE_CHUNK;
let _rosterListSig = null;
let _rosterShowCount = CATALOG_PAGE_CHUNK;
let _rosterSearchTimer;

function squadInvalidateCardMap(){ _squadCardMap = null; }
function getSquadCard(id){
  if(id==null||id===''||!FC26_CARDS) return null;
  if(!_squadCardMap) _squadCardMap = new Map(FC26_CARDS.map(c=>[String(c.id), c]));
  return _squadCardMap.get(String(id)) || null;
}

/** Complète une entrée du fichier data/fc26-catalog-extra.json (même forme que le catalogue principal). */
function fc26NormalizeCatalogCard(raw){
  const r = raw && typeof raw === 'object' ? raw : {};
  const positions = Array.isArray(r.positions) && r.positions.length
    ? r.positions.map((x) => String(x).trim()).filter(Boolean)
    : r.pos
      ? [String(r.pos).trim()]
      : ['CM'];
  const pos = String(r.pos || positions[0] || 'CM').trim() || 'CM';
  return {
    id: String(r.id != null ? r.id : '').trim(),
    name: String(r.name || '').trim(),
    shortName: String(r.shortName || '').trim(),
    ovr: Math.round(Number(r.ovr) || 0),
    pot: Math.round(Number(r.pot != null ? r.pot : r.ovr) || 0),
    age: Math.round(Number(r.age) || 0),
    pos,
    positions,
    club: String(r.club || '').trim(),
    nation: String(r.nation || '').trim(),
    league: String(r.league || '').trim(),
    face: (() => {
      const f = r.face ? String(r.face).trim() : '';
      if (f && /^https?:\/\//i.test(f)) return f;
      const id = String(r.id != null ? r.id : '').trim();
      if (!/^\d+$/.test(id)) return '';
      const p6 = id.padStart(6, '0');
      return 'https://cdn.sofifa.net/players/' + p6.slice(0, 3) + '/' + p6.slice(3) + '/26_120.png';
    })(),
    pace: Math.round(Number(r.pace) || 0),
    sho: Math.round(Number(r.sho) || 0),
    pas: Math.round(Number(r.pas) || 0),
    dri: Math.round(Number(r.dri) || 0),
    def: Math.round(Number(r.def) || 0),
    phy: Math.round(Number(r.phy) || 0),
    sm: Math.round(Number(r.sm) || 0),
    wf: Math.round(Number(r.wf) || 0),
    cardType: String(r.cardType || 'Complément').trim(),
    dataSource: String(r.dataSource || 'extra').trim(),
  };
}

function ensureCatalogLoaded(){
  if(FC26_CARDS) return Promise.resolve(FC26_CARDS);
  if(_fc26CatalogPromise) return _fc26CatalogPromise;
  const v = CONFIG && CONFIG.bundleVersion ? String(CONFIG.bundleVersion) : '';
  _fc26CatalogPromise = fetch('data/fc26-cards-catalog.json?v=' + encodeURIComponent(v))
    .then((r) => {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then((data) => {
      FC26_CARDS = Array.isArray(data.cards) ? data.cards : [];
      FC26_CARDS_META = data.meta || {};
      squadInvalidateCardMap();
      return fetch('data/fc26-catalog-extra.json?v=' + encodeURIComponent(v))
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null)
        .then((extra) => {
          if (extra && Array.isArray(extra.cards)) {
            const ids = new Set(FC26_CARDS.map((c) => String(c.id)));
            let merged = 0;
            for (const raw of extra.cards) {
              const c = fc26NormalizeCatalogCard(raw);
              if (!c.id || !c.name || ids.has(c.id)) continue;
              ids.add(c.id);
              FC26_CARDS.push(c);
              merged += 1;
            }
            if (merged && FC26_CARDS_META && typeof FC26_CARDS_META === 'object') {
              FC26_CARDS_META.extraCardsMerged = merged;
            }
          }
          squadInvalidateCardMap();
          return FC26_CARDS;
        });
    })
    .catch((e) => {
      _fc26CatalogPromise = null;
      throw e;
    });
  return _fc26CatalogPromise;
}

/** SofIFA : années 26 / 25 / 24 + tailles 120 / 180 / 60 (certaines têtes n’existent qu’en FC25). */
function fc26SofifaFaceChainFromUrl(faceUrl){
  const s = String(faceUrl || '').trim();
  const m = s.match(/^(https:\/\/cdn\.sofifa\.net\/players\/\d+\/\d+\/)(\d+)_(\d+)\.png$/i);
  if (!m) return s ? [s] : [];
  const base = m[1];
  const out = [];
  const seen = new Set();
  for (const yr of ['26', '25', '24']) {
    for (const sz of ['120', '180', '60']) {
      const u = `${base}${yr}_${sz}.png`;
      if (!seen.has(u)) {
        seen.add(u);
        out.push(u);
      }
    }
  }
  return out;
}

/** URL portrait SofIFA standard à partir de l’id EA (6 chiffres → dossiers aaa/bbb). */
function fc26SofifaDefaultFaceUrlFromPlayerId(pid){
  const id = String(pid != null ? pid : '').trim();
  if (!/^\d+$/.test(id)) return '';
  const p6 = id.padStart(6, '0');
  return 'https://cdn.sofifa.net/players/' + p6.slice(0, 3) + '/' + p6.slice(3) + '/26_120.png';
}

function fc26FaceOnError(ev){
  const el = ev && ev.target;
  if (!el || el.tagName !== 'IMG') return;
  let chain = [];
  try {
    chain = JSON.parse(decodeURIComponent(el.getAttribute('data-fc-face-chain') || '%5B%5D'));
  } catch (_) {
    chain = [];
  }
  let i = parseInt(el.getAttribute('data-fc-face-i') || '0', 10);
  i += 1;
  if (i < chain.length) {
    el.setAttribute('data-fc-face-i', String(i));
    el.src = chain[i];
    return;
  }
  if (el.dataset.fc26fb === '1') return;
  el.dataset.fc26fb = '1';
  const enc = el.getAttribute('data-fcfallback');
  if (!enc) return;
  try {
    el.removeAttribute('onerror');
    el.src = decodeURIComponent(enc);
  } catch (_) {}
}

function fc26CatalogFaceSvgDataUrl(displayName, w, h){
  const W = Math.max(16, Math.round(Number(w) || 48));
  const H = Math.max(16, Math.round(Number(h) || 48));
  const raw = String(displayName || '?').replace(/[<>&]/g, '');
  const tok = raw.trim().split(/\s+/).filter(Boolean);
  let ini = '?';
  if (tok.length >= 2) ini = (tok[0][0] + tok[tok.length - 1][0]).toUpperCase();
  else if (tok.length === 1 && tok[0].length) ini = tok[0].slice(0, 2).toUpperCase();
  ini = ini.replace(/[<>&]/g, '');
  const fs = Math.max(10, Math.round(H * 0.34));
  const cy = Math.round(H * 0.56);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect fill="#1a2230" width="${W}" height="${H}"/><text x="${W / 2}" y="${cy}" text-anchor="middle" fill="#8b9cb3" font-size="${fs}" font-family="system-ui,sans-serif">${ini}</text></svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

function fc26CatalogFaceImgHtml(faceUrl, w, h, className, fallbackName, playerId){
  const W = Math.round(Number(w) || 48);
  const H = Math.round(Number(h) || 48);
  const ph = fc26CatalogFaceSvgDataUrl(fallbackName, W, H);
  const dataFb = encodeURIComponent(ph);
  const cls = String(className || '')
    .replace(/[<>"']/g, '')
    .trim();
  let fu = faceUrl && /^https?:\/\//i.test(String(faceUrl)) ? String(faceUrl).replace(/"/g, '%22').replace(/'/g, '%27') : '';
  if (!fu) {
    const derived = fc26SofifaDefaultFaceUrlFromPlayerId(playerId);
    if (derived) fu = derived.replace(/"/g, '%22').replace(/'/g, '%27');
  }
  const clsAttr = cls ? ` class="${cls}"` : '';
  if (!fu) {
    return `<img${clsAttr} src="${ph}" alt="" width="${W}" height="${H}" decoding="async" referrerpolicy="no-referrer">`;
  }
  let chain = fc26SofifaFaceChainFromUrl(fu);
  const sofifaIdUrl = fc26SofifaDefaultFaceUrlFromPlayerId(playerId);
  if (
    sofifaIdUrl &&
    !/^https:\/\/cdn\.sofifa\.net\/players\/\d+\/\d+\/\d+_\d+\.png$/i.test(String(fu).trim())
  ) {
    const extra = fc26SofifaFaceChainFromUrl(sofifaIdUrl);
    const seen = new Set(chain);
    for (const u of extra) {
      if (u && !seen.has(u)) {
        seen.add(u);
        chain.push(u);
      }
    }
  }
  const primary = chain[0] || fu;
  const chainEnc = encodeURIComponent(JSON.stringify(chain));
  const primaryEsc = primary.replace(/"/g, '%22').replace(/'/g, '%27');
  /** SofIFA CDN : 403 si Referer tiers — ne pas envoyer de référent pour afficher les portraits hors sofifa.com. */
  return `<img${clsAttr} src="${primaryEsc}" alt="" width="${W}" height="${H}" loading="lazy" decoding="async" referrerpolicy="no-referrer" data-fc-face-chain="${chainEnc}" data-fc-face-i="0" data-fcfallback="${dataFb}" onerror="fc26FaceOnError(event)">`;
}

function initSquadStateOnce(){
  if (_squadStateInited) return;
  _squadStateInited = true;
  try {
    const raw = localStorage.getItem(SQUAD_LS_KEY);
    if (!raw) return;
    const s = JSON.parse(raw);
    if (s && FORMATION_DETAILS && FORMATION_DETAILS[s.formation]) {
      squadState.formation = s.formation;
      if (Array.isArray(s.starters) && s.starters.length === 11) {
        squadState.starters = s.starters.map((x) => (x == null || x === '' ? null : String(x)));
      }
      if (Array.isArray(s.bench)) {
        const b = s.bench.map((x) => (x == null || x === '' ? null : String(x)));
        while (b.length < 7) b.push(null);
        squadState.bench = b.slice(0, 7);
      }
    }
  } catch (_) {}
}

function saveSquadToStorage(){
  try {
    localStorage.setItem(
      SQUAD_LS_KEY,
      JSON.stringify({
        formation: squadState.formation,
        starters: squadState.starters,
        bench: squadState.bench,
      }),
    );
  } catch (_) {}
}

function squadGetDetail(){
  return FORMATION_DETAILS && FORMATION_DETAILS[squadState.formation] ? FORMATION_DETAILS[squadState.formation] : null;
}

function squadPopulateFormationSelect(){
  const sel = document.getElementById('squad-formation');
  if (!sel || !Array.isArray(FORMATIONS)) return;
  const names = FORMATIONS.map((f) => f.name).filter((n) => FORMATION_DETAILS && FORMATION_DETAILS[n]);
  sel.innerHTML = names.map((n) => `<option value="${escapeHtml(n)}">${escapeHtml(n)}</option>`).join('');
  if (names.includes(squadState.formation)) sel.value = squadState.formation;
  else if (names[0]) {
    squadState.formation = names[0];
    sel.value = names[0];
  }
}

/**
 * Positions % sur le terrain (centre de la vignette). Ordre = slots FORMATION_DETAILS (GK → attaque, haut = camp adverse).
 * Clés = noms exacts des formations dans assets/fc26-meta-data.js
 */
const SQUAD_PITCH_LAYOUTS = {
  '4-2-3-1': [
    { l: 50, t: 90 }, { l: 12, t: 72 }, { l: 35, t: 72 }, { l: 65, t: 72 }, { l: 88, t: 72 },
    { l: 35, t: 58 }, { l: 65, t: 58 }, { l: 12, t: 38 }, { l: 50, t: 34 }, { l: 88, t: 38 }, { l: 50, t: 14 },
  ],
  '4-2-1-3': [
    { l: 50, t: 90 }, { l: 10, t: 73 }, { l: 35, t: 73 }, { l: 65, t: 73 }, { l: 90, t: 73 },
    { l: 35, t: 58 }, { l: 65, t: 58 }, { l: 50, t: 44 }, { l: 14, t: 22 }, { l: 50, t: 14 }, { l: 86, t: 22 },
  ],
  '4-4-1-1': [
    { l: 50, t: 90 }, { l: 10, t: 74 }, { l: 36, t: 74 }, { l: 64, t: 74 }, { l: 90, t: 74 },
    { l: 8, t: 52 }, { l: 38, t: 52 }, { l: 62, t: 52 }, { l: 92, t: 52 }, { l: 50, t: 34 }, { l: 50, t: 14 },
  ],
  '4-4-2 (flat)': [
    { l: 50, t: 90 }, { l: 10, t: 74 }, { l: 36, t: 74 }, { l: 64, t: 74 }, { l: 90, t: 74 },
    { l: 8, t: 50 }, { l: 38, t: 50 }, { l: 62, t: 50 }, { l: 92, t: 50 }, { l: 38, t: 15 }, { l: 62, t: 15 },
  ],
  '4-3-2-1': [
    { l: 50, t: 90 }, { l: 10, t: 74 }, { l: 36, t: 74 }, { l: 64, t: 74 }, { l: 90, t: 74 },
    { l: 28, t: 48 }, { l: 50, t: 48 }, { l: 72, t: 48 }, { l: 22, t: 26 }, { l: 78, t: 26 }, { l: 50, t: 12 },
  ],
  '4-3-3 (4)': [
    { l: 50, t: 90 }, { l: 10, t: 74 }, { l: 36, t: 74 }, { l: 64, t: 74 }, { l: 90, t: 74 },
    { l: 30, t: 48 }, { l: 50, t: 48 }, { l: 70, t: 48 }, { l: 14, t: 20 }, { l: 50, t: 14 }, { l: 86, t: 20 },
  ],
  '4-1-2-1-2 (étroit)': [
    { l: 50, t: 90 }, { l: 10, t: 74 }, { l: 36, t: 74 }, { l: 64, t: 74 }, { l: 90, t: 74 },
    { l: 50, t: 62 }, { l: 35, t: 46 }, { l: 65, t: 46 }, { l: 50, t: 32 }, { l: 38, t: 16 }, { l: 62, t: 16 },
  ],
  '3-5-2': [
    { l: 50, t: 90 }, { l: 26, t: 74 }, { l: 50, t: 74 }, { l: 74, t: 74 }, { l: 6, t: 46 },
    { l: 30, t: 48 }, { l: 50, t: 48 }, { l: 70, t: 48 }, { l: 94, t: 46 }, { l: 38, t: 14 }, { l: 62, t: 14 },
  ],
  '5-3-2': [
    { l: 50, t: 90 }, { l: 6, t: 70 }, { l: 28, t: 76 }, { l: 50, t: 76 }, { l: 72, t: 76 }, { l: 94, t: 70 },
    { l: 32, t: 50 }, { l: 50, t: 50 }, { l: 68, t: 50 }, { l: 38, t: 16 }, { l: 62, t: 16 },
  ],
  '4-2-2-2': [
    { l: 50, t: 90 }, { l: 10, t: 74 }, { l: 36, t: 74 }, { l: 64, t: 74 }, { l: 90, t: 74 },
    { l: 38, t: 60 }, { l: 62, t: 60 }, { l: 38, t: 36 }, { l: 62, t: 36 }, { l: 38, t: 16 }, { l: 62, t: 16 },
  ],
  '4-3-1-2': [
    { l: 50, t: 90 }, { l: 10, t: 74 }, { l: 36, t: 74 }, { l: 64, t: 74 }, { l: 90, t: 74 },
    { l: 30, t: 48 }, { l: 50, t: 48 }, { l: 70, t: 48 }, { l: 50, t: 30 }, { l: 38, t: 14 }, { l: 62, t: 14 },
  ],
  '4-5-1': [
    { l: 50, t: 90 }, { l: 10, t: 74 }, { l: 36, t: 74 }, { l: 64, t: 74 }, { l: 90, t: 74 },
    { l: 6, t: 50 }, { l: 32, t: 50 }, { l: 50, t: 50 }, { l: 68, t: 50 }, { l: 94, t: 50 }, { l: 50, t: 12 },
  ],
  '3-4-2-1': [
    { l: 50, t: 90 }, { l: 26, t: 74 }, { l: 50, t: 74 }, { l: 74, t: 74 }, { l: 6, t: 46 },
    { l: 40, t: 50 }, { l: 60, t: 50 }, { l: 94, t: 46 }, { l: 24, t: 26 }, { l: 76, t: 26 }, { l: 50, t: 12 },
  ],
};

function squadPitchCoords(formationName, index){
  const L = SQUAD_PITCH_LAYOUTS[formationName] || SQUAD_PITCH_LAYOUTS['4-2-3-1'];
  const p = L[index] || L[0] || { l: 50, t: 50 };
  return { l: p.l, t: p.t };
}

function squadChangeFormation(name){
  if (!FORMATION_DETAILS || !FORMATION_DETAILS[name]) return;
  squadState.formation = name;
  squadState.starters = Array(11).fill(null);
  squadState.bench = Array(7).fill(null);
  squadPickSlot = null;
  saveSquadToStorage();
  squadPopulateFormationSelect();
  renderSquadSlots();
}

function squadActivateSlot(kind, i){
  if (squadPickSlot && squadPickSlot.kind === kind && squadPickSlot.i === i) squadPickSlot = null;
  else squadPickSlot = { kind, i };
  renderSquadSlots();
}

function squadPitchSlotClick(ev, i){
  if (
    ev.shiftKey &&
    squadPickSlot &&
    squadPickSlot.kind === 'starter' &&
    typeof squadPickSlot.i === 'number' &&
    squadPickSlot.i !== i
  ) {
    const a = squadPickSlot.i;
    const b = i;
    const t = squadState.starters[a];
    squadState.starters[a] = squadState.starters[b];
    squadState.starters[b] = t;
    squadPickSlot = null;
    saveSquadToStorage();
    renderSquadSlots();
    return;
  }
  squadActivateSlot('starter', i);
}

function squadBenchSlotClick(ev, i){
  if (
    ev.shiftKey &&
    squadPickSlot &&
    squadPickSlot.kind === 'bench' &&
    typeof squadPickSlot.i === 'number' &&
    squadPickSlot.i !== i
  ) {
    const a = squadPickSlot.i;
    const b = i;
    const t = squadState.bench[a];
    squadState.bench[a] = squadState.bench[b];
    squadState.bench[b] = t;
    squadPickSlot = null;
    saveSquadToStorage();
    renderSquadSlots();
    return;
  }
  squadActivateSlot('bench', i);
}

function squadClearSlot(kind, i){
  if (kind === 'starter') squadState.starters[i] = null;
  else squadState.bench[i] = null;
  saveSquadToStorage();
  renderSquadSlots();
}

function squadResetAll(){
  squadState.starters = Array(11).fill(null);
  squadState.bench = Array(7).fill(null);
  squadPickSlot = null;
  saveSquadToStorage();
  renderSquadSlots();
  squadRenderCatalog();
}

function squadPickCard(cardId){
  if (!cardId) return;
  if (!squadPickSlot) {
    const st = document.getElementById('squad-catalog-status');
    if (st) st.textContent = 'Sélectionnez une case terrain ou banc (surbrillance verte), puis un joueur.';
    return;
  }
  const { kind, i } = squadPickSlot;
  if (kind === 'starter') squadState.starters[i] = String(cardId);
  else squadState.bench[i] = String(cardId);
  saveSquadToStorage();
  renderSquadSlots();
  squadRenderCatalog();
}

function squadChemDemo(){
  const cards = squadState.starters.map(getSquadCard).filter(Boolean);
  if (!cards.length) return { pts: 0, label: '0 / 33' };
  const clubs = new Set(cards.map((c) => c.club).filter(Boolean));
  const nations = new Set(cards.map((c) => c.nation).filter(Boolean));
  const leagues = new Set(cards.map((c) => c.league).filter(Boolean));
  let pts = 0;
  if (clubs.size <= 4) pts += 6;
  if (clubs.size <= 2) pts += 6;
  if (nations.size <= 5) pts += 5;
  if (nations.size <= 3) pts += 5;
  if (leagues.size <= 3) pts += 4;
  if (cards.length >= 11) pts += 7;
  pts = Math.min(33, pts);
  return { pts, label: pts + ' / 33' };
}

function squadUpdateSidebarStats(){
  const grid = document.getElementById('squad-sidebar-stats');
  const avgEl = document.getElementById('squad-starters-avg');
  const chemFill = document.getElementById('squad-chem-fill');
  const chemLab = document.getElementById('squad-chem-label');
  const cards = squadState.starters.map(getSquadCard).filter(Boolean);
  const n = cards.length;
  if (avgEl) avgEl.textContent = n ? 'Moy. ' + Math.round(cards.reduce((s, c) => s + (Number(c.ovr) || 0), 0) / n) : '—';
  const avg6 = (key) => {
    if (!n) return '—';
    const v = Math.round(cards.reduce((s, c) => s + (Number(c[key]) || 0), 0) / n);
    return String(v);
  };
  if (grid) {
    grid.innerHTML = ['pace', 'sho', 'pas', 'dri', 'def', 'phy']
      .map(
        (k) =>
          `<div class="squad-stat-cell"><div class="lab">${escapeHtml(
            { pace: 'PAC', sho: 'SHO', pas: 'PAS', dri: 'DRI', def: 'DEF', phy: 'PHY' }[k],
          )}</div><div class="val">${escapeHtml(avg6(k))}</div></div>`,
      )
      .join('');
  }
  const ch = squadChemDemo();
  if (chemFill) chemFill.style.width = Math.round((ch.pts / 33) * 100) + '%';
  if (chemLab) chemLab.textContent = ch.label;
}

function renderSquadSlots(){
  const detail = squadGetDetail();
  const pitch = document.getElementById('squad-pitch-slots');
  const bn = document.getElementById('squad-bench');
  if (!pitch || !bn) return;
  if (!detail || !Array.isArray(detail.slots) || detail.slots.length !== 11) {
    pitch.innerHTML = '<p class="td-muted" style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);text-align:center;padding:12px">Formation ou 11 postes indisponibles.</p>';
    bn.innerHTML = '';
    squadUpdateSidebarStats();
    return;
  }
  const fn = squadState.formation;
  pitch.innerHTML = detail.slots
    .map((slot, i) => {
      const id = squadState.starters[i];
      const c = getSquadCard(id);
      const { l, t } = squadPitchCoords(fn, i);
      const active = squadPickSlot && squadPickSlot.kind === 'starter' && squadPickSlot.i === i;
      const face = c ? fc26CatalogFaceImgHtml(c.face, 34, 34, 'pitch-slot-face', c.name || '', c.id) : '';
      const plus = !c ? '<span class="pitch-slot-plus" aria-hidden="true">+</span>' : '';
      const ovr = c ? `<span class="pitch-slot-ovr">${escapeHtml(String(c.ovr))}</span>` : '';
      const nm = c ? `<span class="pitch-slot-name">${escapeHtml(c.name)}</span>` : '';
      const clr = id
        ? `<button type="button" class="pitch-slot-clear" onclick="event.stopPropagation();squadClearSlot('starter',${i})" aria-label="Retirer le joueur">×</button>`
        : '';
      return `<div class="pitch-slot${active ? ' active' : ''}" role="button" tabindex="0" style="--pl:${l}%;--pt:${t}%"
        aria-label="Poste ${escapeHtml(slot.poste)}${c ? ', ' + escapeHtml(c.name) : ', vide'}"
        aria-pressed="${active}" data-slot-idx="${i}"
        onclick="squadPitchSlotClick(event,${i})"
        onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();squadPitchSlotClick(event,${i});}">${clr}${face}${plus}${ovr}${nm}<span class="pitch-slot-pos">${escapeHtml(slot.poste)}</span></div>`;
    })
    .join('');
  bn.innerHTML = [0, 1, 2, 3, 4, 5, 6]
    .map((i) => {
      const id = squadState.bench[i];
      const c = getSquadCard(id);
      const active = squadPickSlot && squadPickSlot.kind === 'bench' && squadPickSlot.i === i;
      const face = c ? fc26CatalogFaceImgHtml(c.face, 30, 30, 'pitch-slot-face', c.name || '', c.id) : '';
      const plus = !c ? '<span class="pitch-slot-plus" style="font-size:18px">+</span>' : '';
      const ovr = c ? `<span class="pitch-slot-ovr" style="font-size:13px">${escapeHtml(String(c.ovr))}</span>` : '';
      const nm = c ? `<span class="pitch-slot-name">${escapeHtml(c.name)}</span>` : '';
      const clr = id
        ? `<button type="button" class="pitch-slot-clear" onclick="event.stopPropagation();squadClearSlot('bench',${i})" aria-label="Retirer">×</button>`
        : '';
      return `<div class="bench-slot${active ? ' active' : ''}" role="button" tabindex="0" aria-pressed="${active}"
        onclick="squadBenchSlotClick(event,${i})"
        onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();squadBenchSlotClick(event,${i});}">${clr}${face}${plus}${ovr}${nm}<span class="pitch-slot-pos">R${i + 1}</span></div>`;
    })
    .join('');
  squadUpdateSidebarStats();
}

let _squadCatTimer;
function squadCatalogFilterDebounced(){
  clearTimeout(_squadCatTimer);
  _squadCatTimer = setTimeout(squadRenderCatalog, 200);
}

function squadCatalogLoadMore(){
  _squadCatShowCount += CATALOG_PAGE_CHUNK;
  squadRenderCatalog();
}
function squadCatalogLoadAll(total){
  _squadCatShowCount = Math.max(CATALOG_PAGE_CHUNK, Math.min(Number(total) || 0, 500000));
  squadRenderCatalog();
}

function squadRenderCatalog(){
  const list = document.getElementById('squad-catalog-list');
  if (!list) return;
  if (!FC26_CARDS || !FC26_CARDS.length) {
    list.innerHTML = '<p class="td-muted" style="padding:10px">Aucune carte — lancez le script de build ou vérifiez le chemin data/fc26-cards-catalog.json.</p>';
    return;
  }
  const qEl = document.getElementById('squad-cat-q');
  const posEl = document.getElementById('squad-cat-pos');
  const minEl = document.getElementById('squad-cat-minovr');
  const qRaw = (qEl && qEl.value ? qEl.value : '').trim();
  const pos = posEl && posEl.value ? posEl.value : '';
  const minRaw = minEl && minEl.value !== '' ? minEl.value : '';
  const minOvr = minRaw === '' ? NaN : Number(minRaw);
  const listSig = `${qRaw}|${pos}|${minRaw}`;
  if (listSig !== _squadCatListSig) {
    _squadCatListSig = listSig;
    _squadCatShowCount = CATALOG_PAGE_CHUNK;
  }
  const filtered = FC26_CARDS.filter((c) => {
    if (!Number.isNaN(minOvr) && (Number(c.ovr) || 0) < minOvr) return false;
    if (pos) {
      const positions = Array.isArray(c.positions) ? c.positions : [];
      if (c.pos !== pos && !positions.includes(pos)) return false;
    }
    if (!fc26CatalogCardMatchesQuery(c, qRaw)) return false;
    return true;
  });
  const limit = Math.min(filtered.length, _squadCatShowCount);
  const slice = filtered.slice(0, limit);
  const rest = filtered.length - limit;
  const more =
    rest > 0
      ? `<div class="catalog-load-more"><span class="td-muted" style="font-size:11px;align-self:center;margin-right:auto">${escapeHtml(String(rest))} carte${rest > 1 ? 's' : ''} non affichée${rest > 1 ? 's' : ''}</span><button type="button" class="filter-btn" onclick="squadCatalogLoadMore()">+ ${CATALOG_PAGE_CHUNK}</button><button type="button" class="filter-btn" onclick="squadCatalogLoadAll(${filtered.length})">Tout afficher (${escapeHtml(String(filtered.length))})</button></div>`
      : '';
  list.innerHTML =
    slice
      .map((c) => {
        const fid = escapeJsString(String(c.id));
        const img = fc26CatalogFaceImgHtml(c.face, 36, 36, '', c.name || '', c.id);
        return `<button type="button" class="catalog-row" role="option" onclick="squadPickCard('${fid}')">${img}<span class="nm"><b>${escapeHtml(c.name)}</b><span>${escapeHtml([c.pos, c.club].filter(Boolean).join(' · '))}</span></span><span class="ovr">${escapeHtml(String(c.ovr != null ? c.ovr : '—'))}</span></button>`;
      })
      .join('') + more;
}

function squadExportJson(){
  const detail = squadGetDetail();
  const map = _squadCardMap || (FC26_CARDS ? new Map(FC26_CARDS.map((c) => [String(c.id), c])) : new Map());
  const pick = (id) => {
    if (!id) return null;
    return map.get(String(id)) || { id: String(id) };
  };
  const payload = {
    exportedAt: new Date().toISOString(),
    formation: squadState.formation,
    formationMeta: detail ? { approcheDefensive: detail.approcheDefensive, styleConstruction: detail.styleConstruction } : null,
    starters: squadState.starters.map(pick),
    bench: squadState.bench.map(pick),
    catalogMeta: FC26_CARDS_META || null,
  };
  try {
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'fc26-prototype-equipe.json';
    a.click();
    URL.revokeObjectURL(a.href);
  } catch (e) {
    alert('Export impossible : ' + (e && e.message));
  }
}

function initSquadPage(){
  initSquadStateOnce();
  squadPopulateFormationSelect();
  const statusEl = document.getElementById('squad-catalog-status');
  const countEl = document.getElementById('squad-catalog-count');
  const afterLoad = () => {
    if (statusEl) {
      statusEl.textContent = FC26_CARDS_META
        ? `Catalogue : ${FC26_CARDS.length} cartes · généré ${FC26_CARDS_META.generatedAt || '—'}`
        : `Catalogue : ${FC26_CARDS.length} cartes`;
    }
    if (countEl) countEl.textContent = String(FC26_CARDS.length);
    squadInvalidateCardMap();
    renderSquadSlots();
    squadRenderCatalog();
  };
  if (FC26_CARDS && FC26_CARDS.length) afterLoad();
  else {
    if (statusEl) statusEl.textContent = 'Chargement de data/fc26-cards-catalog.json…';
    ensureCatalogLoaded()
      .then(afterLoad)
      .catch((e) => {
        if (statusEl) {
          statusEl.textContent =
            'Catalogue indisponible : ' +
            (e && e.message) +
            ' — exécutez « node scripts/build-fc26-cards-catalog.mjs » dans le dépôt, puis rechargez.';
        }
        if (countEl) countEl.textContent = '0';
        renderSquadSlots();
        squadRenderCatalog();
      });
  }
}

function escapeHtml(s){
  if(s==null) return '';
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
function escapeJsString(s){
  return String(s).replace(/\\/g,'\\\\').replace(/'/g,"\\'").replace(/\r|\n/g,' ');
}

/** Recherche catalogue : minuscules + suppression des accents (NFD, combinant marks). */
function fc26SearchNorm(s){
  try {
    return String(s || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  } catch (_) {
    return String(s || '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
  }
}

function fc26CardSearchBlob(c){
  return fc26SearchNorm(
    [c.name, c.shortName, c.club, c.nation, c.league, String(c.ovr != null ? c.ovr : '')].join(' '),
  );
}

/** Plusieurs mots = tous doivent apparaître dans le blob (ex. « kane bayern »). */
function fc26CatalogCardMatchesQuery(c, qRaw){
  const norm = fc26SearchNorm(qRaw);
  if (!norm) return true;
  const blob = fc26CardSearchBlob(c);
  return norm.split(/\s+/).filter(Boolean).every((p) => blob.includes(p));
}
function initTheme(){
  try{
    const saved = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.dataset.theme = saved || (prefersDark ? 'dark' : 'light');
  }catch(_){ document.documentElement.dataset.theme = 'dark'; }
}

function loadData(){
  const D = window.FC26_META_DATA;
  if(!D){ alert('Fichier assets/fc26-meta-data.js introuvable : vérifiez le dossier assets/ à côté de ce HTML.'); return false; }
  CONFIG = D.CONFIG;
  PLAYERS = D.PLAYERS;
  FORMATIONS = D.FORMATIONS;
  FORMATION_DETAILS = D.FORMATION_DETAILS || {};
  FC26_TACTICS_CANON = D.FC26_TACTICS_CANON || null;
  TECHNIQUES = D.TECHNIQUES;
  SBC_DATA = D.SBC_DATA;
  PATCHES = D.PATCHES;
  BEHAVIORS = D.BEHAVIORS;
  META_TABLE = D.META_TABLE || [];
  META_SNAPSHOT = D.META_SNAPSHOT || { headline:'', pillars:[] };
  CHEM_OFFICIAL = D.CHEM_OFFICIAL || { headline:'', bullets:[], sourceUrl:'' };
  CHEM_PICKS = D.CHEM_PICKS || [];
  SETTINGS = D.SETTINGS || {};
  SETTINGS_META_GUIDE = D.SETTINGS_META_GUIDE || null;
  META_SETUP_EXPRESS = D.META_SETUP_EXPRESS || null;
  LIVE_META = D.LIVE_META || null;
  CELEBRATIONS = D.CELEBRATIONS || null;
  META_APP_CHARTER = D.META_APP_CHARTER || null;
  return true;
}

function renderMetaAppCharter(){
  const root = document.getElementById('meta-app-charter-root');
  if (!root) return;
  const M = META_APP_CHARTER;
  if (!M) {
    root.innerHTML = '';
    return;
  }
  root.innerHTML = `<div class="meta-app-charter card section-block--compact" style="padding:12px 14px;margin-bottom:12px;border-color:rgba(168,85,247,.32)">
    <p style="margin:0 0 10px;font-size:12px;font-weight:600;color:var(--text-primary);line-height:1.45">${escapeHtml(M.lead)}</p>
    <div class="meta-app-charter-grid">
      <div class="meta-app-charter-block meta-app-charter-block--app">
        <span class="badge badge-analytical" style="margin-bottom:6px">${escapeHtml(M.badgeApp || 'Méta app')}</span>
        <p style="margin:0;font-size:12px;color:var(--text-secondary);line-height:1.5">${escapeHtml(M.appBlock)}</p>
      </div>
      <div class="meta-app-charter-block meta-app-charter-block--ea">
        <span class="badge badge-official" style="margin-bottom:6px">${escapeHtml(M.badgeEa || 'EA')}</span>
        <p style="margin:0;font-size:12px;color:var(--text-secondary);line-height:1.5">${escapeHtml(M.eaBlock)}</p>
      </div>
    </div>
    ${M.footer ? `<p class="td-muted" style="font-size:10px;margin:10px 0 0;line-height:1.45">${escapeHtml(M.footer)}</p>` : ''}
  </div>`;
}

function renderCelebrationsPage(){
  const root = document.getElementById('mf-celebrations-body');
  if (!root) return;
  const C = CELEBRATIONS;
  if (!C || !Array.isArray(C.basics)) {
    const t = CONFIG && CONFIG.celebrationsNotes ? String(CONFIG.celebrationsNotes) : '—';
    root.innerHTML = `<p class="td-muted" style="font-size:12px">${escapeHtml(t)}</p>`;
    return;
  }
  const basicsRows = C.basics
    .map(
      (b) =>
        `<tr><td class="td-name">${escapeHtml(b.name)}</td><td class="td-val cel-mono">${escapeHtml(b.ps)}</td><td class="td-val cel-mono">${escapeHtml(b.xbox)}</td><td class="td-muted cel-mono">${escapeHtml(b.pc != null ? b.pc : '—')}</td></tr>`,
    )
    .join('');
  const headCard = `<div class="card section-block section-block--compact" style="padding:12px;margin-bottom:12px">
    <p style="font-size:13px;color:var(--text-secondary);margin:0 0 8px;line-height:1.45">${escapeHtml(C.headline || '')}</p>
    <p class="td-muted" style="font-size:11px;margin:0 0 8px">${escapeHtml(C.sourceLabel || '')}${C.sourceUrl ? ` · <a href="${safeExternalHref(C.sourceUrl)}" target="_blank" rel="noopener noreferrer">EA FC26</a>` : ''}</p>
    <ul class="td-muted" style="font-size:11px;margin:0;padding-left:18px;line-height:1.5">${(C.legend || []).map((e) => `<li>${escapeHtml(e)}</li>`).join('')}</ul>
  </div>`;
  const secHtml = (C.sections || [])
    .map((sec) => {
      const rows = (sec.rows || [])
        .map(
          (r) =>
            `<tr><td class="td-name">${escapeHtml(r.name)}</td><td class="td-val cel-mono">${escapeHtml(r.ps)}</td><td class="td-val cel-mono">${escapeHtml(r.xbox)}</td><td class="td-muted cel-mono">${escapeHtml(r.pc != null ? r.pc : '—')}</td></tr>`,
        )
        .join('');
      return `<h3 class="section-title section-title--sm" style="margin-top:14px">${escapeHtml(sec.title)}</h3>
      ${sec.hint ? `<p class="td-muted" style="font-size:11px;margin:-4px 0 8px;line-height:1.45">${escapeHtml(sec.hint)}</p>` : ''}
      <div class="table-wrap cel-table-wrap"><table><thead><tr><th>Célébration</th><th>PlayStation</th><th>Xbox</th><th>PC</th></tr></thead><tbody>${rows}</tbody></table></div>`;
    })
    .join('');
  root.innerHTML = `${headCard}
    <h3 class="section-title section-title--sm">Raccourcis globaux</h3>
    <div class="table-wrap cel-table-wrap"><table><thead><tr><th>Action</th><th>PlayStation</th><th>Xbox</th><th>PC</th></tr></thead><tbody>${basicsRows}</tbody></table></div>
    ${secHtml}
    ${C.footer ? `<p class="td-muted" style="font-size:10px;margin-top:12px;line-height:1.45">${escapeHtml(C.footer)}</p>` : ''}`;
}

/** Bandeau type « Warzone Meta » : picks éditables dans LIVE_META (fc26-meta-data.js). */
function renderMetaLive(){
  const root = document.getElementById('meta-live-root');
  if (!root) return;
  const L = LIVE_META;
  if (!L || !Array.isArray(L.picks) || !L.picks.length) {
    root.innerHTML = '<p class="td-muted">LIVE_META.picks vide — éditer assets/fc26-meta-data.js.</p>';
    return;
  }
  const head = `<div class="meta-live-head">
    <div>
      <h2 class="section-title" style="margin:0 0 4px">Méta du moment</h2>
      <p class="td-muted" style="font-size:12px;margin:0;line-height:1.45">${escapeHtml(L.headline || '')}</p>
    </div>
    <div class="meta-live-updated td-muted" style="font-size:11px;font-family:var(--mono);text-align:right">MAJ ${escapeHtml(L.updatedAt || '—')} · bundle ${escapeHtml(CONFIG && CONFIG.bundleVersion ? String(CONFIG.bundleVersion) : '—')}</div>
  </div>`;
  const cards = L.picks
    .map((p) => {
      const tier = p.tier != null && String(p.tier).trim() !== '' && String(p.tier).trim() !== '—' ? getTierBadge(p.tier) : '';
      const tag = p.tag ? `<span class="badge badge-analytical">${escapeHtml(p.tag)}</span>` : '';
      let btn = '';
      if (p.kind === 'formation' && p.formationName) {
        btn = `<button type="button" class="filter-btn filter-btn--primary" style="width:100%" onclick="showFormationDetailPage('${escapeJsString(p.formationName)}','meta-home')">Ouvrir la fiche</button>`;
      } else if (p.kind === 'gestes') {
        btn = `<button type="button" class="filter-btn filter-btn--primary" style="width:100%" onclick="showPage('meta-home',{initialTab:'gestes'})">Gestes</button>`;
      } else if (p.kind === 'players') {
        btn = `<button type="button" class="filter-btn filter-btn--primary" style="width:100%" onclick="showPage('players',{initialPlayersTab:'catalog'})">Cartes FC26</button>`;
      } else if (p.kind === 'squad') {
        btn = `<button type="button" class="filter-btn filter-btn--primary" style="width:100%" onclick="showPage('squad')">Composeur</button>`;
      } else if (p.kind === 'guide') {
        btn = `<button type="button" class="filter-btn filter-btn--primary" style="width:100%" onclick="showPage('meta-home',{initialTab:'hub'})">Hub</button>`;
      } else if (p.kind === 'celebrations') {
        btn = `<button type="button" class="filter-btn filter-btn--primary" style="width:100%" onclick="showPage('meta-home',{initialTab:'fut'})">Célébrations</button>`;
      }
      const sClass = String(p.tier || '').toUpperCase() === 'S' ? ' meta-live-card--s' : '';
      return `<article class="meta-live-card${sClass}">
      <div class="meta-live-card__top">${tier}${tier && tag ? ' ' : ''}${tag}</div>
      <h3 class="meta-live-card__title">${escapeHtml(p.title)}</h3>
      <p class="meta-live-card__blurb">${escapeHtml(p.blurb)}</p>
      ${btn}
    </article>`;
    })
    .join('');
  root.innerHTML = `${head}<div class="meta-live-grid">${cards}</div>`;
}

/** Peuple la page unique Méta FC 26 (tactique, formations, gameplay, patchs, chimie, gestes, DCE, célébrations). */
function renderMetaHome(opts){
  opts = opts || {};
  renderMetaAppCharter();
  renderMetaLive();
  renderSetupExpress();
  initDashboard();
  const formArr = opts && Array.isArray(opts.formations) ? opts.formations : FORMATIONS;
  if (opts && Array.isArray(opts.formations)) {
    document.querySelectorAll('#page-meta-home #mf-formations .filter-btn').forEach((b) => b.classList.remove('active'));
  } else {
    document.querySelectorAll('#page-meta-home #mf-formations .filter-btn').forEach((b, i) => b.classList.toggle('active', i === 0));
  }
  renderFormations(formArr);
  renderMetaTable();
  renderPatches();
  renderBehaviors();
  renderChemistryPage();
  const techArr = opts && Array.isArray(opts.techniques) ? opts.techniques : TECHNIQUES;
  if (opts && Array.isArray(opts.techniques)) {
    document.querySelectorAll('#page-meta-home #mf-techniques .filter-btn').forEach((b) => b.classList.remove('active'));
  } else {
    document.querySelectorAll('#page-meta-home #mf-techniques .filter-btn').forEach((b, i) => b.classList.toggle('active', i === 0));
  }
  renderTechniques(techArr);
  renderSBC();
  renderCelebrationsPage();
  const tabsOk = ['hub', 'tactique', 'gameplay', 'fut', 'gestes'];
  let tab = 'hub';
  if (opts && Array.isArray(opts.formations)) tab = 'tactique';
  else if (opts && Array.isArray(opts.techniques)) tab = 'gestes';
  else if (opts.initialTab && tabsOk.includes(String(opts.initialTab))) tab = String(opts.initialTab);
  fc26MetaHomeTab(tab);
}

/** Toujours vrai : aucun mode « DATA / communauté » — pas de score ni rentabilité inventés dans l’UI. */
function fc26IsOfficialOnly(){
  return CONFIG && CONFIG.appMode === 'official_only';
}

function getBadge(src){
  const map={ official:'badge-official', analytical:'badge-analytical', community:'badge-community', unconfirmed:'badge-unconfirmed' };
  const label={ official:'Officiel', analytical:'Analytique', community:'Communauté', unconfirmed:'Non confirmé' };
  return `<span class="badge ${map[src]||'badge-unconfirmed'}">${label[src]||src}</span>`;
}
function getTierBadge(t){
  if(t==null||t===''||t==='—'||(typeof t==='string'&&t.trim()==='')) return `<span class="badge badge-official">Sans palier EA</span>`;
  const m={ S:'badge-meta-s',A:'badge-meta-a',B:'badge-meta-b',C:'badge-meta-c' };
  return `<span class="badge ${m[t]||'badge-meta-c'}">Palier ${escapeHtml(t)}</span>`;
}
function playerMatchesFilters(p){
  const qRaw = playerFilters.q || '';
  if (fc26SearchNorm(qRaw)) {
    const blob = fc26SearchNorm([p.name, p.club, p.league, p.nation, p.metaRole, (p.altPos || []).join(' ')].join(' '));
    const parts = fc26SearchNorm(qRaw).split(/\s+/).filter(Boolean);
    if (!parts.every((t) => blob.includes(t))) return false;
  }
  if(playerFilters.league && p.league!==playerFilters.league) return false;
  if(playerFilters.acc && p.acc!==playerFilters.acc) return false;
  if(playerFilters.patchSens && (p.patchSens||'')!==playerFilters.patchSens) return false;
  if(playerFilters.pos){
    if(playerFilters.pos==='W'){ if(p.pos!=='LW'&&p.pos!=='RW') return false; }
    else if(playerFilters.pos==='FB'){ if(p.pos!=='LB'&&p.pos!=='RB') return false; }
    else if(p.bestPos!==playerFilters.pos&&p.pos!==playerFilters.pos&&!(p.altPos||[]).includes(playerFilters.pos)) return false;
  }
  return true;
}

function srcBadgePlayer(p){
  if(p.source==='official') return getBadge('official');
  if(p.source==='analytical'||p.confidence==='analytical') return getBadge('analytical');
  return getBadge('community');
}

function renderPlayers(arr){
  const g=document.getElementById('players-grid');
  if(!arr.length){ g.innerHTML='<p class="td-muted" style="padding:20px">Aucun résultat.</p>'; return; }
  g.innerHTML=arr.map(p=>`
    <article class="player-card" tabindex="0" role="button" aria-label="Fiche ${escapeHtml(p.name)}" onclick="showPlayerDetailPage('${escapeJsString(p.id)}','players')" onkeydown="if(event.key==='Enter')showPlayerDetailPage('${escapeJsString(p.id)}','players')">
      <div class="player-card-header"><div><div class="player-card-name">${escapeHtml(p.name)}</div><div class="player-card-meta">${escapeHtml(p.club)} · ${escapeHtml(p.league)}</div></div>
      <div style="display:flex;flex-direction:column;gap:4px;align-items:flex-end"><div class="player-card-pos">${escapeHtml(p.bestPos)}</div>${getTierBadge(p.tier)}</div></div>
      <div class="player-card-meta">${escapeHtml(p.metaRole||'')}</div>
      <div class="player-card-meta">Accél : ${escapeHtml(p.acc)} · Patch : <span class="badge ${(p.patchSens||'')==='élevé'?'badge-patch':'badge-stable'}">${escapeHtml(p.patchSens||'—')}</span></div>
      <div class="player-card-meta">Alt : ${escapeHtml((p.altPos||[]).join(', ')||'—')}</div>
      <div class="player-card-playstyles">${(p.playstyles||[]).map(ps=>`<span class="ps-chip ${String(ps).endsWith('+')?'plus':''}">${escapeHtml(ps)}</span>`).join('')}</div>
      <div class="player-card-meta">${escapeHtml(p.strengths||'')}</div>
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px">
        <span style="font-family:var(--mono);font-size:11px;color:var(--gold)">${escapeHtml(p.cost||'—')}</span>${srcBadgePlayer(p)}
      </div>
    </article>`).join('');
}

function playersRosterSearchDebounced(){
  clearTimeout(_rosterSearchTimer);
  _rosterSearchTimer = setTimeout(() => renderPlayersRosterResults(), 200);
}

function rosterLoadMore(){
  _rosterShowCount += CATALOG_PAGE_CHUNK;
  renderPlayersRosterResults(true);
}
function rosterLoadAll(total){
  _rosterShowCount = Math.max(CATALOG_PAGE_CHUNK, Math.min(Number(total) || 0, 500000));
  renderPlayersRosterResults(true);
}

function renderPlayersRosterResults(immediate, opts){
  if (immediate) clearTimeout(_rosterSearchTimer);
  const list = document.getElementById('roster-results');
  if (!list) return;
  if (!FC26_CARDS || !FC26_CARDS.length) {
    list.innerHTML = '<p class="td-muted" style="padding:10px">Catalogue non chargé — ouvrez via un serveur HTTP local si besoin.</p>';
    return;
  }
  const qEl = document.getElementById('roster-q');
  const q = (qEl && qEl.value ? qEl.value : '').trim();
  if (opts && opts.forceRosterPagingReset) {
    _rosterListSig = null;
  }
  if (_rosterListSig !== q) {
    _rosterListSig = q;
    _rosterShowCount = CATALOG_PAGE_CHUNK;
  }
  let filtered;
  if (!fc26SearchNorm(q)) {
    filtered = [...FC26_CARDS].sort((a, b) =>
      String(a.name || '').localeCompare(String(b.name || ''), 'fr', { sensitivity: 'base' }),
    );
  } else {
    filtered = FC26_CARDS.filter((c) => fc26CatalogCardMatchesQuery(c, q));
  }
  const limit = Math.min(filtered.length, _rosterShowCount);
  const slice = filtered.slice(0, limit);
  const rest = filtered.length - limit;
  const browseHint = !fc26SearchNorm(q)
    ? `<p class="td-muted" style="font-size:11px;padding:8px 4px">${escapeHtml(String(FC26_CARDS.length))} cartes — tri A→Z (base FC26 / pool joueurs). Les variantes FUT promo ne sont pas dans ce fichier.</p>`
    : '';
  const more =
    rest > 0
      ? `<div class="catalog-load-more"><span class="td-muted" style="font-size:11px;align-self:center;margin-right:auto">${escapeHtml(String(rest))} résultat${rest > 1 ? 's' : ''} masqué${rest > 1 ? 's' : ''}</span><button type="button" class="filter-btn" onclick="rosterLoadMore()">+ ${CATALOG_PAGE_CHUNK}</button><button type="button" class="filter-btn" onclick="rosterLoadAll(${filtered.length})">Tout afficher (${escapeHtml(String(filtered.length))})</button></div>`
      : '';
  list.innerHTML =
    browseHint +
    slice
      .map((c) => {
        const fid = escapeJsString(String(c.id));
        const img = fc26CatalogFaceImgHtml(c.face, 36, 36, '', c.name || '', c.id);
        return `<button type="button" class="catalog-row" role="option" onclick="showPlayerDetailPage('${fid}','players')">${img}<span class="nm"><b>${escapeHtml(c.name)}</b><span>${escapeHtml([c.pos, c.club].filter(Boolean).join(' · '))}</span></span><span class="ovr">${escapeHtml(String(c.ovr != null ? c.ovr : '—'))}</span></button>`;
      })
      .join('') + more;
}

function playersRosterEnsureCatalog(){
  const st = document.getElementById('roster-load-status');
  if (FC26_CARDS && FC26_CARDS.length) {
    if (st) {
      st.textContent =
        'Catalogue chargé : ' +
        FC26_CARDS.length +
        ' cartes' +
        (FC26_CARDS_META && FC26_CARDS_META.generatedAt ? ' · généré ' + FC26_CARDS_META.generatedAt : '') +
        (FC26_CARDS_META && FC26_CARDS_META.extraCardsMerged
          ? ' · +' + FC26_CARDS_META.extraCardsMerged + ' complément(s)'
          : '') +
        '.';
    }
    renderPlayersRosterResults();
    return;
  }
  if (st) st.textContent = 'Chargement de data/fc26-cards-catalog.json…';
  ensureCatalogLoaded()
    .then(() => {
      if (st) {
        st.textContent =
          'Catalogue : ' +
          FC26_CARDS.length +
          ' cartes' +
          (FC26_CARDS_META && FC26_CARDS_META.generatedAt ? ' · généré ' + FC26_CARDS_META.generatedAt : '') +
          (FC26_CARDS_META && FC26_CARDS_META.extraCardsMerged
            ? ' · +' + FC26_CARDS_META.extraCardsMerged + ' complément(s)'
            : '') +
          '.';
      }
      renderPlayersRosterResults();
    })
    .catch((e) => {
      if (st) {
        st.textContent =
          'Erreur chargement catalogue : ' +
          (e && e.message ? e.message : String(e)) +
          ' — utilisez un serveur HTTP local (file:// bloque souvent fetch).';
      }
      const list = document.getElementById('roster-results');
      if (list) list.innerHTML = '';
    });
}

function buildPlayerDetailHTML(p){
  const alts=(p.altPos||[]).map(a=>`<span class="badge badge-analytical">${escapeHtml(a)}</span>`).join(' ')||'<span class="td-muted">—</span>';
  return `<article class="card" style="padding:22px;max-width:900px">
    <h1 id="player-detail-title" class="fd-pro-title" style="font-size:26px;margin-bottom:8px">${escapeHtml(p.name)}</h1>
    <p class="td-muted">${escapeHtml(p.club)} · ${escapeHtml(p.nation)} · ${escapeHtml(p.league)}</p>
    <div style="display:flex;gap:6px;margin:12px 0;flex-wrap:wrap">${getTierBadge(p.tier)}${srcBadgePlayer(p)}
    <span class="badge ${(p.patchSens||'')==='élevé'?'badge-patch':'badge-stable'}">Patch ${escapeHtml(p.patchSens||'n/a')}</span></div>
    <div class="section-block"><div class="td-muted" style="font-size:10px;text-transform:uppercase">Rôle (fiche)</div>
    <p style="font-size:13px;color:var(--text-secondary)">${escapeHtml(p.metaRole||'—')}</p></div>
    <div class="section-block"><div class="td-muted" style="font-size:10px;text-transform:uppercase">Meilleur poste / alternatifs</div>
    <p><span class="badge badge-role">${escapeHtml(p.bestPos)}</span> ${alts}</p></div>
    <div class="section-block"><div class="td-muted" style="font-size:10px;text-transform:uppercase">Styles chimie (indicatif)</div>
    <p style="font-size:13px;color:var(--text-secondary)"><strong>Sans +3 :</strong> ${escapeHtml(p.chemNone||'—')}<br><strong>Avec +3 :</strong> ${escapeHtml(p.chemChem||'—')}</p></div>
    <div class="section-block"><div class="td-muted" style="font-size:10px;text-transform:uppercase">Tactique</div><p style="font-size:13px;color:var(--text-secondary)">${escapeHtml(p.tacticalFit||'—')}</p></div>
    <div class="section-block"><div class="td-muted" style="font-size:10px;text-transform:uppercase">Atouts / limites</div>
    <p style="font-size:13px;color:var(--text-secondary)"><strong>+</strong> ${escapeHtml(p.strengths||'—')}<br><strong>−</strong> ${escapeHtml(p.limits||'—')}</p></div>
  </article>`;
}

function buildCatalogPlayerDetailHTML(c){
  if (!c) return '<p class="td-muted">Carte introuvable.</p>';
  const face = fc26CatalogFaceImgHtml(c.face, 128, 128, 'catalog-hero-face', c.name || '', c.id);
  const posLine = Array.isArray(c.positions) && c.positions.length ? c.positions.join(' · ') : c.pos || '—';
  const head = [c.club, c.nation, c.league].filter(Boolean).join(' · ');
  const rows = [
    ['Rythme', c.pace],
    ['Tir', c.sho],
    ['Passe', c.pas],
    ['Dribble', c.dri],
    ['Défense', c.def],
    ['Physique', c.phy]
  ]
    .map(
      ([lab, v]) =>
        `<tr><td class="td-name">${lab}</td><td class="td-val">${escapeHtml(String(v != null ? v : '—'))}</td></tr>`
    )
    .join('');
  const isExtra = String(c.dataSource || '').toLowerCase() === 'extra';
  const badge = isExtra
    ? '<span class="badge badge-analytical">Complément FC26-Meta</span>'
    : '<span class="badge badge-official">Base FC26</span>';
  const note = `<p class="td-muted" style="font-size:11px;margin-top:10px">${badge} · id <code style="font-family:var(--mono)">${escapeHtml(String(c.id))}</code></p>`;
  const sub = [head, c.shortName].filter(Boolean).join(' · ');
  return `<article class="card" style="padding:22px;max-width:920px">
    <div class="fc26-cat-detail-grid">
      <div>${face}</div>
      <div>
        <h1 id="player-detail-title" class="fd-pro-title" style="font-size:26px;margin-bottom:6px">${escapeHtml(c.name || '—')}</h1>
        <p class="td-muted">${escapeHtml(sub || '—')}</p>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin:12px 0">
          <span class="badge badge-official">OVR ${escapeHtml(String(c.ovr != null ? c.ovr : '—'))}</span>
          <span class="badge badge-analytical">POT ${escapeHtml(String(c.pot != null ? c.pot : '—'))}</span>
          <span class="badge badge-community">${escapeHtml(String(c.age != null ? c.age + ' ans' : '—'))}</span>
          <span class="badge badge-role">${escapeHtml(c.pos || '—')}</span>
          ${c.sm != null ? `<span class="badge badge-community">SM ${escapeHtml(String(c.sm))}</span>` : ''}
          ${c.wf != null ? `<span class="badge badge-community">WF ${escapeHtml(String(c.wf))}</span>` : ''}
        </div>
        <div class="section-block"><div class="td-muted" style="font-size:10px;text-transform:uppercase">Postes</div>
        <p style="font-size:13px;color:var(--text-secondary)">${escapeHtml(posLine)}</p></div>
        <div class="section-block"><div class="td-muted" style="font-size:10px;text-transform:uppercase">Stats in-game (FC26)</div>
        <div class="table-wrap"><table><tbody>${rows}</tbody></table></div></div>
        ${c.cardType ? `<div class="section-block"><div class="td-muted" style="font-size:10px;text-transform:uppercase">Type carte</div><p style="font-size:13px;color:var(--text-secondary)">${escapeHtml(c.cardType)}</p></div>` : ''}
        ${note}
      </div>
    </div>
  </article>`;
}

function showPlayerDetailPage(id, returnPage, skipHash){
  detailReturnPlayer = returnPage || 'players';
  const hint = document.getElementById('player-detail-back-hint');
  const setHint = (t) => {
    if (hint) hint.textContent = t;
  };
  const p = PLAYERS.find((x) => x.id === id);
  document.querySelectorAll('.page').forEach((pg) => pg.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach((n) => n.classList.remove('active'));
  const nav = document.querySelector('.nav-item[data-page="' + detailReturnPlayer + '"]');
  if (nav) nav.classList.add('active');
  const page = document.getElementById('page-player-detail');
  if (page) page.classList.add('active');
  const root = document.getElementById('player-detail-root');
  const finishShell = () => {
    closeAllNavCats();
    window.scrollTo(0, 0);
    const main = document.getElementById('main');
    if (main) main.scrollTop = 0;
    if (!skipHash && !_fc26RouteSuppress) {
      try {
        history.replaceState({ fc26: 'player', id, ret: detailReturnPlayer }, '', '#player=' + encodeURIComponent(id));
      } catch (_) {}
    }
    const b = document.getElementById('player-detail-back');
    if (b) b.focus();
  };

  if (p) {
    setHint(detailReturnPlayer === 'players' ? 'Liste Joueurs' : '');
    if (root) root.innerHTML = buildPlayerDetailHTML(p);
    finishShell();
    return;
  }

  const c0 = getSquadCard(id);
  if (c0) {
    setHint(detailReturnPlayer === 'players' ? 'Roster base FC26 (~18k cartes)' : '');
    if (root) root.innerHTML = buildCatalogPlayerDetailHTML(c0);
    finishShell();
    return;
  }

  setHint('Chargement du catalogue…');
  if (root) root.innerHTML = '<p class="td-muted">Chargement du catalogue joueurs…</p>';
  finishShell();
  ensureCatalogLoaded()
    .then(() => {
      const c = getSquadCard(id);
      const root2 = document.getElementById('player-detail-root');
      const still = document.getElementById('page-player-detail') && document.getElementById('page-player-detail').classList.contains('active');
      if (!still || !root2) return;
      if (c) {
        setHint(detailReturnPlayer === 'players' ? 'Roster base FC26 (~18k cartes)' : '');
        root2.innerHTML = buildCatalogPlayerDetailHTML(c);
      } else {
        setHint('');
        root2.innerHTML =
          '<p class="td-muted">Aucune carte pour cet identifiant dans le catalogue local. Vérifiez data/fc26-cards-catalog.json (script build).</p>';
      }
    })
    .catch((e) => {
      const root2 = document.getElementById('player-detail-root');
      const still = document.getElementById('page-player-detail') && document.getElementById('page-player-detail').classList.contains('active');
      if (!still || !root2) return;
      setHint('');
      root2.innerHTML =
        '<p class="td-muted">Impossible de charger le catalogue : ' + escapeHtml(String((e && e.message) || e)) + '</p>';
    });
}

function leavePlayerDetailPage(){ showPage(detailReturnPlayer || 'players'); }

function clearAppHashIfNeeded(){
  if(_fc26RouteSuppress) return;
  if(location.hash && /^#(formation|player)=/.test(location.hash)){
    try{
      const clean = location.href.split('#')[0];
      history.replaceState(null, '', clean);
    }catch(_){}
  }
}

function tryOpenRouteFromHash(){
  const h = location.hash || '';
  if(h.startsWith('#formation=')){
    const name = decodeURIComponent(h.slice('#formation='.length));
    if(Array.isArray(FORMATIONS) && FORMATIONS.some((f) => f.name === name)){
      _fc26RouteSuppress = true;
      showFormationDetailPage(name, 'meta-home', true);
      _fc26RouteSuppress = false;
      return true;
    }
  }
  if(h.startsWith('#player=')){
    const id = decodeURIComponent(h.slice('#player='.length));
    _fc26RouteSuppress = true;
    showPlayerDetailPage(id, 'players', true);
    _fc26RouteSuppress = false;
    return true;
  }
  return false;
}

function pitchMiniDotColor(poste){
  const p = String(poste || '').toUpperCase();
  if (p === 'GK') return '#4da6ff';
  if (/ST|LW|RW|LF|RF|CAM|CF/.test(p)) return '#ff6b6b';
  if (/M|CDM/.test(p)) return '#ffd700';
  return '#8b9cb3';
}

/** Mini terrain SVG (positions = même ordre que FORMATION_DETAILS / SQUAD_PITCH_LAYOUTS). */
function renderFormationPitchMini(formationName, slots){
  const W = 220;
  const H = 320;
  const L = SQUAD_PITCH_LAYOUTS[formationName] || SQUAD_PITCH_LAYOUTS['4-2-3-1'];
  const list = Array.isArray(slots) ? slots : [];
  const circles = list
    .map((s, i) => {
      const c = L[i] || { l: 50, t: 50 };
      const cx = (c.l / 100) * W;
      const cy = (c.t / 100) * H;
      const col = pitchMiniDotColor(s.poste);
      const title = escapeHtml([s.poste, s.libelle].filter(Boolean).join(' — '));
      return `<circle cx="${cx}" cy="${cy}" r="8.5" fill="${col}" stroke="rgba(255,255,255,.35)" stroke-width="1"><title>${title}</title></circle>`;
    })
    .join('');
  const fn = escapeHtml(formationName || '');
  return `<svg class="mini-pitch" viewBox="0 0 ${W} ${H}" role="img" aria-label="Schéma ${fn}">
    <defs><linearGradient id="fc26pitchg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0d3d22"/><stop offset="50%" stop-color="#0a5c32"/><stop offset="100%" stop-color="#0d3d22"/></linearGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#fc26pitchg)"/>
    <rect x="10" y="10" width="${W - 20}" height="${H - 20}" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="1"/>
    <line x1="10" y1="${H / 2}" x2="${W - 10}" y2="${H / 2}" stroke="rgba(255,255,255,.18)"/>
    <circle cx="${W / 2}" cy="${H / 2}" r="26" fill="none" stroke="rgba(255,255,255,.16)"/>
    ${circles}
  </svg>`;
}

function consignesToChips(consignes){
  if (!consignes || typeof consignes !== 'string') return '<span class="td-muted">—</span>';
  const parts = consignes.split(/\s*·\s*/).map((s) => s.trim()).filter(Boolean);
  if (!parts.length) return `<span class="td-muted">${escapeHtml(consignes)}</span>`;
  return parts.map((p, i) => `<span class="inst-chip${i === 0 ? ' accent' : ''}">${escapeHtml(p)}</span>`).join('');
}

function readingLines(s){
  if (!s || typeof s !== 'string') return [];
  return s.split(/\s*·\s*/).map((x) => x.trim()).filter(Boolean);
}

function renderFormationSlotRows(slots){
  if(!Array.isArray(slots)||!slots.length) return '<p class="td-muted">Aucune ligne poste.</p>';
  const fixed = fc26IsOfficialOnly() && CONFIG && CONFIG.officialSlotConsigne ? String(CONFIG.officialSlotConsigne) : null;
  return `<div class="table-wrap"><table class="slot-table" role="grid" aria-label="Rôles par poste"><thead><tr>
    <th scope="col">Poste</th><th scope="col">Rôle+ &amp; objectif</th><th scope="col">${fixed ? 'Consignes (rappel EA)' : 'Consignes (fiche locale)'}</th>
  </tr></thead><tbody>${slots.map(s=>`<tr>
    <td class="td-name">${escapeHtml(s.poste)}<div class="td-muted" style="font-size:11px;margin-top:2px">${escapeHtml(s.libelle||'')}</div></td>
    <td><span class="badge badge-role">${escapeHtml(s.rolePlus||'—')}</span><p style="margin-top:6px;font-size:12px;color:var(--text-secondary);font-style:italic;border-left:2px solid var(--green-dim);padding-left:8px">${escapeHtml(s.objectifRole||'—')}</p></td>
    <td><div class="inst-wrap">${consignesToChips(fixed || s.consignes)}</div></td>
  </tr>`).join('')}</tbody></table></div>`;
}

function getExpressFormation(){
  if(!Array.isArray(FORMATIONS)||FORMATIONS.length===0) return null;
  const ref = CONFIG && CONFIG.expressFormationRef;
  const formation = ref ? FORMATIONS.find((f) => f.name === ref) : null;
  const chosen = formation || FORMATIONS[0];
  const detail = FORMATION_DETAILS && chosen && FORMATION_DETAILS[chosen.name] ? FORMATION_DETAILS[chosen.name] : null;
  return { formation: chosen, detail };
}

function renderSetupExpress(){
  const root=document.getElementById('setup-express-root');
  if(!root) return;
  const E=META_SETUP_EXPRESS;
  const top=getExpressFormation();
  if(!E){
    root.innerHTML='<p class="td-muted">META_SETUP_EXPRESS absent.</p>';
    return;
  }
  if(!top){
    root.innerHTML='<p class="td-muted">Aucune formation.</p>';
    return;
  }
  const f=top.formation;
  const d=top.detail;
  const gabarits=d&&Array.isArray(d.gabaritsSelecteur)?d.gabaritsSelecteur.join(' · '):'—';
  const appr=d?d.approcheDefensive:'—';
  const styleC=d?d.styleConstruction:'—';
  const balanced=SETTINGS&&SETTINGS.balanced;
  const tactRows=(balanced&&balanced.groups&&balanced.groups[0]&&balanced.groups[0].items)?balanced.groups[0].items:[];
  const tactTable=tactRows.length?`<div class="table-wrap" style="margin-top:10px"><table class="slot-table"><thead><tr><th>Paramètre</th><th>Valeur</th></tr></thead><tbody>
    ${tactRows.map(i=>`<tr><td class="td-name">${escapeHtml(i.label)}</td><td class="td-val" style="font-size:12px">${escapeHtml(i.val)}</td></tr>`).join('')}
  </tbody></table></div>`:'';
  const etapes=(E.etapes||[]).map((st,i)=>`<li>${i+1}. ${escapeHtml(st.titre)}</li>`).join('');
  const fname=JSON.stringify(f.name);
  root.innerHTML=`
    <div class="grid-2" style="gap:12px;margin-bottom:12px">
      <div class="card" style="border-color:rgba(0,255,136,.25);padding:14px">
        <div class="formation-name" style="font-size:20px;margin-bottom:4px">${escapeHtml(f.name)}</div>
        <p class="td-muted" style="font-size:12px;margin:0 0 8px">${escapeHtml(f.style)} · ${getTierBadge(f.tier)}</p>
        <p class="td-muted" style="font-size:12px;margin:0 0 10px">Sélecteur : <span class="td-val">${escapeHtml(gabarits)}</span></p>
        <button type="button" class="filter-btn" onclick='showFormationDetailPage(${fname},"meta-home")'>Fiche formation</button>
      </div>
      <div class="card" style="border-color:rgba(168,85,247,.2);padding:14px">
        <div style="display:grid;gap:8px">
          <div><span class="td-muted" style="font-size:11px">Défense</span><p style="font-size:17px;font-weight:700;color:var(--blue);margin:2px 0 0">${escapeHtml(appr)}</p></div>
          <div><span class="td-muted" style="font-size:11px">Construction</span><p style="font-size:17px;font-weight:700;color:var(--green);margin:2px 0 0">${escapeHtml(styleC)}</p></div>
        </div>
      </div>
    </div>
    <div class="card section-block" style="padding:14px">
      <ol style="margin:0;padding-left:18px;font-size:13px;color:var(--text-secondary);line-height:1.5">${etapes}</ol>
      ${tactTable}
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px">
        <button type="button" class="filter-btn" onclick="showPage('settings');setTimeout(function(){fc26SettingsTab('sticks');},0)">Manette</button>
        <button type="button" class="filter-btn" onclick="showPage('meta-home',{initialTab:'fut'})">Chimie</button>
      </div>
    </div>`;
}

function buildFormationDetailHTML(formationName){
  const f=FORMATIONS.find(x=>x.name===formationName);
  if(!f) return '';
  const d=FORMATION_DETAILS[formationName];
  let bodyInner = '';
  if (d) {
    const tplList = Array.isArray(d.gabaritsSelecteur) && d.gabaritsSelecteur.length
      ? d.gabaritsSelecteur.map((t) => `<code style="font-size:12px">${escapeHtml(t)}</code>`).join(' · ')
      : '';
    const tplBlock = tplList
      ? `<div class="card" style="padding:12px;margin-bottom:12px"><div class="card-header" style="margin-bottom:6px"><span class="card-title" style="font-size:11px">Sélecteur</span>${getBadge('official')}</div>
        <p style="font-size:13px;font-weight:600;line-height:1.45">${tplList}</p></div>`
      : '';
    const styleConstr = d.styleConstruction || '—';
    const approchDef = d.approcheDefensive || '—';
    bodyInner = `
    ${tplBlock}
    <div class="grid-2" style="gap:10px;margin-bottom:12px">
      <div class="card" style="padding:12px"><div class="card-header" style="margin-bottom:6px"><span class="card-title" style="font-size:11px">Construction</span>${getBadge('official')}</div>
        <p style="font-size:15px;font-weight:700;color:var(--green)">${escapeHtml(styleConstr)}</p></div>
      <div class="card" style="padding:12px"><div class="card-header" style="margin-bottom:6px"><span class="card-title" style="font-size:11px">Défense</span>${getBadge('official')}</div>
        <p style="font-size:15px;font-weight:700;color:var(--blue)">${escapeHtml(approchDef)}</p></div>
    </div>
    <h3 class="section-title" style="font-size:14px;margin:12px 0 8px">11 postes</h3>
    ${renderFormationSlotRows(d.slots)}`;
  } else {
    bodyInner = `<p class="td-muted">Pas de fiche FORMATION_DETAILS.</p>`;
  }
  const statTiles = `<div class="fd-pro-stat"><div class="v" style="color:var(--green)">${escapeHtml(d ? d.styleConstruction || '—' : '—')}</div><div class="l">Construction</div></div>
    <div class="fd-pro-stat"><div class="v" style="color:var(--blue)">${escapeHtml(d ? d.approcheDefensive || '—' : '—')}</div><div class="l">Défense</div></div>`;
  const pitchBlock = d && Array.isArray(d.slots) ? renderFormationPitchMini(f.name, d.slots) : `<p class="td-muted" style="text-align:center;font-size:12px">Schéma indisponible.</p>`;
  return `
    <div class="fd-pro fd-pro--fullpage">
      <div class="fd-pro-header">
        <h2 id="formation-detail-title" class="fd-pro-title">${escapeHtml(f.name)}</h2>
        <div class="fd-pro-sub">${escapeHtml(f.style)} · ${getTierBadge(f.tier)} <span class="badge badge-stable">${escapeHtml(f.stability)}</span> ${getBadge('official')}</div>
        <div class="fd-pro-stats">${statTiles}</div>
      </div>
      <div class="fd-pro-body">
        <div class="fd-pro-pitch">
          <span class="td-muted" style="font-size:9px;font-family:var(--mono);text-transform:uppercase;letter-spacing:.08em">Terrain</span>
          ${pitchBlock}
        </div>
        <div class="fd-pro-detail">${bodyInner}</div>
      </div>
    </div>`;
}

function showFormationDetailPage(formationName, returnPage, skipHash){
  const html = buildFormationDetailHTML(formationName);
  if(!html) return;
  detailReturnFormation = returnPage || 'meta-home';
  const hint=document.getElementById('formation-detail-back-hint');
  if(hint){
    hint.textContent = detailReturnFormation === 'meta-home' ? 'Retour : Méta FC 26' : 'Retour';
  }
  document.querySelectorAll('.page').forEach(pg=>pg.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  const nav=document.querySelector('.nav-item[data-page="meta-home"]');
  if(nav) nav.classList.add('active');
  const page=document.getElementById('page-formation-detail');
  if(page) page.classList.add('active');
  const root=document.getElementById('formation-detail-root');
  if(root) root.innerHTML = html;
  closeAllNavCats();
  window.scrollTo(0,0);
  const main=document.getElementById('main'); if(main) main.scrollTop=0;
  if(!skipHash && !_fc26RouteSuppress){
    try{ history.replaceState({ fc26:'formation', name: formationName, ret: detailReturnFormation }, '', '#formation=' + encodeURIComponent(formationName)); }catch(_){}
  }
  const b=document.getElementById('formation-detail-back'); if(b) b.focus();
}

function leaveFormationDetailPage(){ showPage(detailReturnFormation || 'meta-home'); }

function onFormationsContainerClick(e){
  const card=e.target.closest('.formation-row-card[data-formation]');
  if(!card) return;
  const raw=card.getAttribute('data-formation');
  if(!raw) return;
  document.querySelectorAll('.formation-row-card.is-active').forEach((el)=>el.classList.remove('is-active'));
  card.classList.add('is-active');
  try{ showFormationDetailPage(decodeURIComponent(raw),'meta-home'); }catch(_){ showFormationDetailPage(raw,'meta-home'); }
}
function onFormationsContainerKeydown(e){
  if(e.key!=='Enter'&&e.key!==' ') return;
  const card=e.target.closest('.formation-row-card[data-formation]');
  if(!card) return;
  e.preventDefault();
  const raw=card.getAttribute('data-formation');
  if(raw) try{ showFormationDetailPage(decodeURIComponent(raw),'meta-home'); }catch(_){ showFormationDetailPage(raw,'meta-home'); }
}

function renderFormations(arr){
  const n = arr.length;
  const aside = `<aside class="formations-pro-aside card" style="padding:14px">
    <button type="button" class="filter-btn" style="width:100%;margin-bottom:8px" onclick="showPage('meta-home',{initialTab:'hub'})">Hub</button>
    <button type="button" class="filter-btn" style="width:100%" onclick="showPage('squad')">Composeur</button>
    <p class="td-muted" style="font-size:11px;margin-top:10px">${n} formation${n > 1 ? 's' : ''}</p>
  </aside>`;
  const rows = arr
    .map(
      (f) => `
    <section class="formation-row-card" tabindex="0" role="button" aria-label="Fiche formation ${escapeHtml(f.name)}" data-formation="${encodeURIComponent(f.name)}">
      <div class="formation-row-main">
        <div class="formation-row-name">${escapeHtml(f.name)}</div>
        <div class="formation-row-meta">${escapeHtml(f.style)}</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">${getTierBadge(f.tier)}<span class="badge badge-stable">${escapeHtml(f.stability)}</span>${getBadge('official')}</div>
      </div>
      <div style="min-width:120px;text-align:right">
        <div class="formation-row-score">—</div>
        <p class="formation-hint" style="margin-top:8px">Ouvrir</p>
      </div>
    </section>`,
    )
    .join('');
  document.getElementById('formations-container').innerHTML = `<div class="formations-pro-grid"><div class="formations-pro-list" role="list">${rows}</div>${aside}</div>`;
}

function catTechBadge(cat){
  const cmap={ tir:'badge-meta-s', passe:'badge-meta-a', defense:'badge-role', dribble:'badge-meta-b' };
  return cmap[cat]||'badge-meta-c';
}

function renderTechniques(arr){
  document.getElementById('techniques-container').innerHTML=`<div class="grid-auto">${arr.map(t=>`
    <article class="technique-card card">
      <div style="display:flex;justify-content:space-between;gap:8px;align-items:flex-start;margin-bottom:6px">
        <h3 style="font-family:var(--display);font-size:16px;margin:0">${escapeHtml(t.name)}</h3>${t.tier != null ? getTierBadge(t.tier) : ''}</div>
      <div class="input-chip" aria-label="Input">${escapeHtml(t.input)}</div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin:8px 0">
        <span class="badge ${catTechBadge(t.category)}">${escapeHtml(String(t.category||'').toUpperCase())}</span>
        <span class="badge badge-analytical">${escapeHtml(t.diff||'')}</span>
      </div>
      ${t.why ? `<p style="margin:0;font-size:12px;color:var(--text-secondary)">${escapeHtml(t.why)}</p>` : ''}
    </article>`).join('')}</div>`;
}

function renderSBC(){
  const hub = CONFIG && CONFIG.newsIndexUrl ? safeExternalHref(CONFIG.newsIndexUrl) : 'https://www.ea.com/games/ea-sports-fc/fc-26/news';
  const webapp = 'https://www.ea.com/games/ea-sports-fc/ultimate-team/web-app';
  document.getElementById('sbc-container').innerHTML = `
    <div class="card section-block">
      <div class="card-header"><div class="card-title">DCE</div>${getBadge('official')}</div>
      <ul style="font-size:13px;color:var(--text-secondary);padding-left:18px;line-height:1.5;margin-top:8px">
        <li>FUT / Web App — chiffres in-game uniquement.</li>
        <li><a href="${webapp}" target="_blank" rel="noopener noreferrer">Web App EA</a></li>
        <li><a href="${hub}" target="_blank" rel="noopener noreferrer">Actus FC26</a></li>
      </ul>
    </div>`;
}

function renderMetaTable(){
  const el=document.getElementById('meta-table-wrap'); if(!el||!META_TABLE.length) return;
  el.innerHTML=`<table><thead><tr><th>Sujet</th><th>Rappel (notes EA / TU)</th><th>Périmètre</th><th>Suivi équilibrage</th></tr></thead><tbody>
    ${META_TABLE.map(r=>`<tr><td class="td-name">${escapeHtml(r.el)}</td><td>${escapeHtml(r.rappel)}</td><td>${escapeHtml(r.perimetre)}</td><td>${escapeHtml(r.suivi)}</td></tr>`).join('')}
  </tbody></table>`;
}

function renderChemistryPage(){
  const oc=document.getElementById('chem-official-card');
  if(oc) oc.innerHTML=`<div class="card-header"><div class="card-title">EA — Chimie FUT (lancement)</div>${getBadge('official')}</div>
    <p style="font-size:13px;color:var(--text-secondary);margin-bottom:10px">${escapeHtml(CHEM_OFFICIAL.headline||'')}</p>
    <ul style="font-size:13px;color:var(--text-secondary);padding-left:18px">${(CHEM_OFFICIAL.bullets||[]).map(b=>`<li>${escapeHtml(b)}</li>`).join('')}</ul>`;
  const pw=document.getElementById('chem-picks-wrap');
  if(pw) pw.innerHTML=`<table><thead><tr><th>Rôle</th><th>Sans +3 (menus FUT)</th><th>Avec +3 / +6 / +9</th></tr></thead><tbody>
    ${(CHEM_PICKS||[]).map(r=>`<tr><td class="td-name">${escapeHtml(r.role)}</td><td>${escapeHtml(r.noChem)}</td><td>${escapeHtml(r.withChem)}</td></tr>`).join('')}
  </tbody></table>`;
}

function initDashboard(){
  const sub=document.getElementById('dash-subtitle');
  if(sub) sub.textContent=`${CONFIG.lastOfficialPatchId||'—'} · v${CONFIG.bundleVersion}`;
  const live=document.getElementById('live-patch-text');
  if(live) live.textContent=CONFIG.lastOfficialPatchId;
  const kp=document.getElementById('kpi-patch'); if(kp) kp.textContent=CONFIG.lastOfficialPatchId;
  const kpp=document.getElementById('kpi-players'); if(kpp) kpp.textContent=String(PLAYERS.length);
  const kf=document.getElementById('kpi-form'); if(kf) kf.textContent=String(FORMATIONS.length);
  const kt=document.getElementById('kpi-tech'); if(kt) kt.textContent=String(TECHNIQUES.length);
}

function exportDataJson(){
  const el=document.getElementById('export-status');
  try{
    const blob=new Blob([JSON.stringify(window.FC26_META_DATA,null,2)],{type:'application/json'});
    const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='fc26-meta-backup.json'; a.click(); URL.revokeObjectURL(a.href);
    if(el) el.textContent='Export fc26-meta-backup.json déclenché (navigateur).';
  }catch(e){ if(el) el.textContent='Erreur export : '+e; }
}

function renderPatches(){
  const list=PATCHES.filter(p=>!String(p.version||'').includes('TEMPLATE'));
  document.getElementById('patches-container').innerHTML=list.map(p=>{
    const ch = Array.isArray(p.changes) ? p.changes : [];
    return `
    <article class="patch-card">
      <header style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-bottom:8px">
        <div><div class="patch-version">${escapeHtml(p.version)}</div><div class="patch-date">${escapeHtml(p.date)} · ${escapeHtml(p.channel)}</div></div>
        <div style="display:flex;gap:6px;align-items:center">${getBadge(p.sourceType)}</div>
      </header>
      <p class="td-muted" style="font-size:12px;margin-bottom:10px;line-height:1.45">${escapeHtml(p.summary)}</p>
      <ul class="patch-changes">${ch.map(c=>{ const dot=['buff','nerf','neutral'].includes(c.type)?c.type:'neutral'; return `<li><span class="impact-dot ${dot}" aria-hidden="true"></span>${escapeHtml(c.text)}</li>`; }).join('')}</ul>
    </article>`;
  }).join('');
}

function renderBehaviors(){
  document.getElementById('behaviors-container').innerHTML=`<div class="table-wrap"><table><thead><tr>
    <th>Sujet</th><th>Zone</th><th>Fréquence</th><th>Statut</th><th>Risque</th><th>Note</th>
  </tr></thead><tbody>${BEHAVIORS.map(b=>`<tr>
    <td class="td-name">${escapeHtml(b.name)}</td><td class="td-muted">${escapeHtml(b.zone)}</td><td>${escapeHtml(b.freq)}</td><td>${escapeHtml(b.status)}</td><td>${escapeHtml(b.risk)}</td><td class="td-muted" style="max-width:260px">${escapeHtml(b.note)}</td>
  </tr>`).join('')}</tbody></table></div>`;
}

function safeExternalHref(u){
  const s=String(u||'');
  return /^https?:\/\//i.test(s)?s.replace(/"/g,'%22'):'#';
}

function renderSettingsMetaGuide(){
  const el=document.getElementById('settings-meta-guide');
  if(!el) return;
  const G=SETTINGS_META_GUIDE;
  if(!G){ el.innerHTML='<p class="td-muted">Données absentes.</p>'; return; }
  const op=(G.officialPresets?.bullets||[]).map(b=>`<li>${escapeHtml(b.text)} — <a href="${safeExternalHref(b.url)}" target="_blank" rel="noopener noreferrer" style="color:var(--blue);font-size:11px">${escapeHtml(b.src||'EA')}</a></li>`).join('');
  const co=(G.controllerOfficial?.bullets||[]).map(b=>`<li>${escapeHtml(b.text)} — <a href="${safeExternalHref(b.url)}" target="_blank" rel="noopener noreferrer" style="color:var(--blue);font-size:11px">${escapeHtml(b.src||'EA')}</a></li>`).join('');
  const sys=(G.officialGameplaySystems?.items||[]).map(it=>`<li style="margin-bottom:8px">${escapeHtml(it.text)} <span class="badge badge-official" style="margin-left:4px">${escapeHtml(it.tag||'')}</span> <a href="${safeExternalHref(it.url)}" target="_blank" rel="noopener noreferrer" style="color:var(--blue);font-size:11px;margin-left:6px">Lien</a></li>`).join('');
  const links=(G.sourceLinks||[]).map(l=>`<li><a href="${safeExternalHref(l.url)}" target="_blank" rel="noopener noreferrer" style="color:var(--blue)">${escapeHtml(l.title)}</a></li>`).join('');
  el.innerHTML=`
    <h2 class="section-title">Manette &amp; EA</h2>
    <div class="grid-2">
      <div class="card">
        <div class="card-header"><div class="card-title">${escapeHtml(G.officialPresets?.title||'Préréglages')}</div>${getBadge('official')}</div>
        <ul style="font-size:13px;color:var(--text-secondary);padding-left:18px;line-height:1.5;margin-top:8px">${op}</ul>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title">${escapeHtml(G.controllerOfficial?.title||'Manette')}</div>${getBadge('official')}</div>
        <ul style="font-size:13px;color:var(--text-secondary);padding-left:18px;line-height:1.5;margin-top:8px">${co}</ul>
      </div>
    </div>
    <div class="card section-block" style="margin-top:14px">
      <div class="card-header"><div class="card-title">${escapeHtml(G.officialGameplaySystems?.title||'Systèmes')}</div>${getBadge('official')}</div>
      <ul style="font-size:13px;color:var(--text-secondary);padding-left:18px;line-height:1.5;margin-top:8px">${sys}</ul>
    </div>
    <div class="card section-block" style="margin-top:14px">
      <div class="card-header"><div class="card-title">Liens</div>${getBadge('official')}</div>
      <ul style="font-size:13px;padding-left:18px;line-height:1.6;margin-top:8px">${links}</ul>
    </div>`;
}

function renderSettings(profile){
  const s=SETTINGS[profile]; const c=document.getElementById('settings-container');
  if(!s){ c.innerHTML='<p class="td-muted">Profil indisponible.</p>'; return; }
  c.innerHTML=`<h3 class="section-title" style="font-size:15px;margin-bottom:12px">${escapeHtml(s.label)} ${getBadge(fc26IsOfficialOnly()?'official':'analytical')}</h3>
    <p class="td-muted" style="font-size:12px;margin:-8px 0 14px">${escapeHtml(s.desc)}</p>
    ${(s.groups||[]).map(g=>`<section class="section-block"><h3 class="section-title" style="font-size:15px">${escapeHtml(g.title)}</h3>
      <div class="table-wrap"><table><thead><tr><th>Paramètre</th><th>Valeur</th><th>Note</th></tr></thead><tbody>
      ${(g.items||[]).map(i=>`<tr><td class="td-name">${escapeHtml(i.label)}</td><td class="td-val" style="font-size:12px">${escapeHtml(i.val)}</td><td class="td-muted">${escapeHtml(i.note)}</td></tr>`).join('')}
      </tbody></table></div></section>`).join('')}`;
}

function closeAllNavCats(){
  document.querySelectorAll('#site-nav details.nav-cat[open]').forEach((d)=>{ d.open = false; });
}
function fc26NavGo(id){
  closeAllNavCats();
  showPage(id);
}
let _fc26HdrResizeTimer;
function fc26SyncHeaderHeight(){
  const el = document.getElementById('app-header');
  if (!el) return;
  const h = Math.ceil(el.getBoundingClientRect().height);
  document.documentElement.style.setProperty('--app-header-h', Math.max(64, h) + 'px');
}
function fc26SyncHeaderHeightDebounced(){
  clearTimeout(_fc26HdrResizeTimer);
  _fc26HdrResizeTimer = setTimeout(fc26SyncHeaderHeight, 80);
}
function initSiteNav(){
  const nav = document.getElementById('site-nav');
  if (!nav) return;
  nav.querySelectorAll('details.nav-cat').forEach((det) => {
    det.addEventListener('toggle', () => {
      if (det.open) {
        nav.querySelectorAll('details.nav-cat').forEach((d) => {
          if (d !== det) d.open = false;
        });
      }
      requestAnimationFrame(fc26SyncHeaderHeight);
    });
  });
  /* Bubble : la phase capture pouvait interférer avec l’ouverture des <details> sur certains navigateurs. */
  document.addEventListener('click', (ev) => {
    const t = ev.target;
    if (t instanceof Node && nav.contains(t)) return;
    closeAllNavCats();
  });
  window.addEventListener('resize', fc26SyncHeaderHeightDebounced);
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', fc26SyncHeaderHeightDebounced);
  }
}

function fc26MetaHomeTab(id, btn){
  const page = document.getElementById('page-meta-home');
  if (!page) return;
  const bar = page.querySelector('.fc26-subtab-bar--meta');
  if (!bar) return;
  const trigger =
    btn && btn.getAttribute && btn.getAttribute('data-meta-tab') === id
      ? btn
      : bar.querySelector('.fc26-subtab[data-meta-tab="' + id + '"]');
  bar.querySelectorAll('.fc26-subtab[data-meta-tab]').forEach((b) => {
    const on = b.getAttribute('data-meta-tab') === id;
    b.classList.toggle('active', on);
    b.setAttribute('aria-selected', on ? 'true' : 'false');
  });
  page.querySelectorAll('.meta-home-panels .fc26-subpanel[data-meta-tab]').forEach((p) => {
    const on = p.getAttribute('data-meta-tab') === id;
    p.classList.toggle('is-active', on);
    if (on) p.removeAttribute('hidden');
    else p.setAttribute('hidden', '');
  });
  if (trigger && typeof trigger.focus === 'function') {
    try {
      trigger.focus({ preventScroll: true });
    } catch (_) {
      trigger.focus();
    }
  }
  requestAnimationFrame(fc26SyncHeaderHeight);
}

function fc26PlayersTab(id, btn){
  const page = document.getElementById('page-players');
  if (!page) return;
  const bar = page.querySelector('.fc26-subtab-bar');
  const trigger =
    btn && btn.getAttribute && btn.getAttribute('data-players-tab') === id
      ? btn
      : bar && bar.querySelector('.fc26-subtab[data-players-tab="' + id + '"]');
  page.querySelectorAll('.fc26-subtab[data-players-tab]').forEach((b) => {
    const on = b.getAttribute('data-players-tab') === id;
    b.classList.toggle('active', on);
    b.setAttribute('aria-selected', on ? 'true' : 'false');
  });
  page.querySelectorAll('.fc26-subpanel[data-players-tab]').forEach((p) => {
    const on = p.getAttribute('data-players-tab') === id;
    p.classList.toggle('is-active', on);
    if (on) p.removeAttribute('hidden');
    else p.setAttribute('hidden', '');
  });
  if (id === 'catalog') playersRosterEnsureCatalog();
  if (trigger && typeof trigger.focus === 'function') {
    try {
      trigger.focus({ preventScroll: true });
    } catch (_) {
      trigger.focus();
    }
  }
  requestAnimationFrame(fc26SyncHeaderHeight);
}

function fc26SettingsTab(id, btn){
  const page = document.getElementById('page-settings');
  if (!page) return;
  const bar = page.querySelector('.fc26-subtab-bar');
  const trigger =
    btn && btn.getAttribute && btn.getAttribute('data-settings-tab') === id
      ? btn
      : bar && bar.querySelector('.fc26-subtab[data-settings-tab="' + id + '"]');
  page.querySelectorAll('.fc26-subtab[data-settings-tab]').forEach((b) => {
    const on = b.getAttribute('data-settings-tab') === id;
    b.classList.toggle('active', on);
    b.setAttribute('aria-selected', on ? 'true' : 'false');
  });
  page.querySelectorAll('.fc26-subpanel[data-settings-tab]').forEach((p) => {
    const on = p.getAttribute('data-settings-tab') === id;
    p.classList.toggle('is-active', on);
    if (on) p.removeAttribute('hidden');
    else p.setAttribute('hidden', '');
  });
  if (trigger && typeof trigger.focus === 'function') {
    try {
      trigger.focus({ preventScroll: true });
    } catch (_) {
      trigger.focus();
    }
  }
  requestAnimationFrame(fc26SyncHeaderHeight);
}

function showPage(id, opts){
  opts = opts || {};
  clearAppHashIfNeeded();
  closeAllNavCats();
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  const page=document.getElementById('page-'+id);
  if(page) page.classList.add('active');
  const nav=document.querySelector(`.nav-item[data-page="${id}"]`);
  if(nav) nav.classList.add('active');
  if(id==='meta-home') renderMetaHome(opts);
  if(id==='players'){
    fc26PlayersTab(opts.initialPlayersTab === 'catalog' ? 'catalog' : 'fiches');
    applyPlayerFilters();
    playersRosterEnsureCatalog();
  }
  if(id==='squad') initSquadPage();
  if(id==='settings'){
    fc26SettingsTab('sources');
    document.querySelectorAll('#page-settings #settings-panel-sticks .filter-btn').forEach((b,i)=>b.classList.toggle('active',i===0));
    renderSettingsMetaGuide();
    renderSettings('balanced');
  }
  document.getElementById('main').focus({preventScroll:true});
}
function navKey(e,id){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); fc26NavGo(id);} }
function toggleSidebar(){ closeAllNavCats(); }
function toggleTheme(){
  const h=document.documentElement;
  h.dataset.theme=h.dataset.theme==='dark'?'light':'dark';
  try{ localStorage.setItem(THEME_KEY, h.dataset.theme); }catch(_){}
  requestAnimationFrame(fc26SyncHeaderHeight);
}

function setPlayerFilter(k,v){ playerFilters[k]=v; applyPlayerFilters(); }
function applyPlayerFilters(){ renderPlayers(PLAYERS.filter(playerMatchesFilters)); }
function resetPlayerFilters(){
  playerFilters={q:'',pos:'',league:'',acc:'',patchSens:''};
  ['f-q','f-pos','f-league','f-acc','f-patch'].forEach(id=>{ const el=document.getElementById(id); if(el) el.value=''; });
  applyPlayerFilters();
}

function filterFormations(f,btn){
  document.querySelectorAll('#page-meta-home #mf-formations .filter-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  let arr=FORMATIONS;
  if(!fc26IsOfficialOnly() && f!=='all'){
    if(f==='S'||f==='A'){
      arr=FORMATIONS.filter(x=>x.tier===f);
      if(arr.length===0) arr=FORMATIONS;
    }else{
      arr=FORMATIONS.filter(x=>Array.isArray(x.tags)&&x.tags.includes(f));
      if(arr.length===0) arr=FORMATIONS;
    }
  }
  renderFormations(arr);
}
function filterTech(cat,btn){
  document.querySelectorAll('#page-meta-home #mf-techniques .filter-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  renderTechniques(cat==='all'?TECHNIQUES:TECHNIQUES.filter(t=>t.category===cat));
}
function showSettingProfile(profile,btn){
  document.querySelectorAll('#settings-panel-sticks .filter-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  renderSettings(profile);
}

let _gsTimer;
function globalSearchDebounced(q){
  clearTimeout(_gsTimer);
  _gsTimer=setTimeout(()=>globalSearch(q),200);
}
function globalSearchShowNone(q){
  const st = document.getElementById('search-status');
  if (st) {
    st.style.display = 'inline';
    st.textContent = 'Aucun résultat pour « ' + String(q).slice(0, 80) + ' »';
    clearTimeout(window._fc26SearchStatusTimer);
    window._fc26SearchStatusTimer = setTimeout(() => {
      st.textContent = '';
      st.style.display = 'none';
    }, 4000);
  }
}

function globalSearchOpenCatalogHits(tRaw){
  const rq = document.getElementById('roster-q');
  if (rq) rq.value = tRaw;
  showPage('players', { initialPlayersTab: 'catalog' });
  renderPlayersRosterResults(true, { forceRosterPagingReset: true });
  const st = document.getElementById('search-status');
  if (st) {
    st.style.display = 'inline';
    st.textContent = 'Résultats catalogue (recherche barre du haut)';
    clearTimeout(window._fc26SearchStatusTimer);
    window._fc26SearchStatusTimer = setTimeout(() => {
      st.textContent = '';
      st.style.display = 'none';
    }, 3500);
  }
}

function globalSearch(q){
  const tRaw = (q || '').trim();
  const t = fc26SearchNorm(tRaw);
  if (t.length < 2) return;
  const pHits = PLAYERS.filter((p) => {
    const blob = fc26SearchNorm([p.name, p.club].join(' '));
    return t.split(/\s+/).filter(Boolean).every((x) => blob.includes(x)) || blob.includes(t);
  });
  const fHits = FORMATIONS.filter((f) => {
    const blob = fc26SearchNorm([f.name, f.style].join(' '));
    return t.split(/\s+/).filter(Boolean).every((x) => blob.includes(x)) || blob.includes(t);
  });
  const techHits = TECHNIQUES.filter((x) => {
    const blob = fc26SearchNorm([x.name, x.input || ''].join(' '));
    return t.split(/\s+/).filter(Boolean).every((tok) => blob.includes(tok)) || blob.includes(t);
  });
  if (pHits.length) {
    showPage('players');
    playerFilters = { q: '', pos: '', league: '', acc: '', patchSens: '' };
    ['f-pos', 'f-league', 'f-acc', 'f-patch'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    const fq = document.getElementById('f-q');
    if (fq) fq.value = '';
    renderPlayers(pHits);
    return;
  }
  if (fHits.length) {
    showPage('meta-home', { formations: fHits });
    return;
  }
  if (techHits.length) {
    showPage('meta-home', { techniques: techHits });
    return;
  }

  const tryCatalog = () => {
    if (!FC26_CARDS || !FC26_CARDS.length) return false;
    const cardHits = FC26_CARDS.filter((c) => fc26CatalogCardMatchesQuery(c, tRaw));
    if (!cardHits.length) return false;
    globalSearchOpenCatalogHits(tRaw);
    return true;
  };

  if (tryCatalog()) return;

  ensureCatalogLoaded()
    .then(() => {
      if (tryCatalog()) return;
      globalSearchShowNone(q);
    })
    .catch(() => {
      globalSearchShowNone(q);
    });
}

document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){
    closeAllNavCats();
    const fpd=document.getElementById('page-formation-detail');
    if(fpd&&fpd.classList.contains('active')){ e.preventDefault(); leaveFormationDetailPage(); return; }
    const ppd=document.getElementById('page-player-detail');
    if(ppd&&ppd.classList.contains('active')){ e.preventDefault(); leavePlayerDetailPage(); return; }
    const squadPage=document.getElementById('page-squad');
    if(squadPage&&squadPage.classList.contains('active')&&squadPickSlot){
      e.preventDefault();
      squadPickSlot=null;
      renderSquadSlots();
    }
  }
});

document.addEventListener('DOMContentLoaded',()=>{
  initTheme();
  initSiteNav();
  if(!loadData()) return;
  try{
    document.querySelectorAll('.filter-formations-extra').forEach((b)=>{ b.style.display=fc26IsOfficialOnly()?'none':''; });
  }catch(_){}
  renderMetaHome();
  renderPlayers(PLAYERS);
  renderSettingsMetaGuide();
  const fcont=document.getElementById('formations-container');
  if(fcont){
    fcont.addEventListener('click',onFormationsContainerClick);
    fcont.addEventListener('keydown',onFormationsContainerKeydown);
  }
  tryOpenRouteFromHash();
  fc26SyncHeaderHeight();
  requestAnimationFrame(() => {
    fc26SyncHeaderHeight();
    requestAnimationFrame(fc26SyncHeaderHeight);
  });
});
