/**
 * FC26_META_DATA — base EA (pitch notes, TU, forums) + rappels tactiques FUT.
 * Pas de scores « méta » inventés ni de rentabilité DCE calculée.
 * Fichier : assets/fc26-meta-data.js. Mettre à jour CONFIG.bundleVersion, LIVE_META (picks + updatedAt), PATCHES, META_SNAPSHOT après veille EA / FUT.
 */
window.FC26_META_DATA = {
  CONFIG: {
    bundleVersion: '2026.04.19.43',
    /** meta_lab : filtres formations / consignes fichier. official_only : lecture stricte EA. */
    appMode: 'meta_lab',
    dataRevision: 'meta-home-v1',
    dataScope: 'meta_fc26',
    /** Formation utilisée uniquement comme exemple de navigation (EA ne publie pas de « meilleure » formation). */
    expressFormationRef: '4-2-3-1',
    /** Texte unique affiché à la place des consignes DATA sur les fiches 11 postes. */
    officialSlotConsigne:
      'Configurer les consignes, rôles+ et objectifs dans FUT > Tactiques d’équipe sur ta console ou PC (menus Electronic Arts).',
    officialFormationGabaritNote:
      'Les gabarits (large, étroit, plat, variante numérotée…) sont des entrées du sélecteur EA. Vérifier le libellé exact dans ton client français.',
    lastOfficialPatchId: 'v1.5.3',
    lastOfficialPatchUrl: 'https://forums.ea.com/blog/ea-sports-fc-game-info-hub-en/ea-sports-fc%E2%84%A2-26--title-update-v1-5-3/13312649',
    maintainerNote:
      'Après chaque patch EA : PATCHES + META_SNAPSHOT + BEHAVIORS si besoin. Célébrations / animations : texte court ci-dessous (détail in-game).',
    newsIndexUrl: 'https://www.ea.com/games/ea-sports-fc/fc-26/news',
    /** Rappel court si CELEBRATIONS absent (secours). */
    celebrationsNotes:
      'Après un but : touches affichées à l’écran + favoris dans Paramètres FC26. Le tableau « Célébrations » ci-dessous détaille les combinaisons courantes.',
  },
  /**
   * Charte affichée dans le hub : sépare **méta applicative** (cette codebase) et **cadre EA** (sources).
   * Ne prétend jamais qu’EA a certifié une tier list unique Rivaux.
   */
  META_APP_CHARTER: {
    badgeApp: 'Méta FC26-Meta',
    badgeEa: 'Cadre EA',
    lead: '« Méta » ici = deux couches. Ne les confonds pas.',
    appBlock:
      'Référence de cette application : paliers S / A / B sur les formations, picks de l’encadré live, tactiques du dépôt — c’est la ligne FC26-Meta (curatée dans les fichiers). Pour cette couche, ce que l’outil affiche fait foi pour l’outil ; ce n’est pas un communiqué Electronic Arts.',
    eaBlock:
      'Electronic Arts : patchs, pitch notes, menus FUT, chimie quand on cite EA. EA ne publie pas une tier list officielle unique « meilleures tactiques Rivaux ».',
    footer:
      'Mode official_only (CONFIG) : masque les filtres paliers et réduit la couche locale — utile si tu veux surtout des rappels EA.',
  },
  META_SNAPSHOT: {
    headline:
      'Ce centre mélange la ligne méta FC26-Meta (picks + paliers dans les fichiers) et les rappels EA (patchs, gameplay, FUT). Patch de référence : Title Update v1.5.3 — liens pour le libellé exact des changements.',
    pillars: [
      { k: 'Gameplay FC26', v: 'Notes approfondies : radar tactique six axes, hauteur de ligne, schémas de touches, sprint explosif, etc.', src: 'official' },
      { k: 'Title Update 1.5.0', v: 'Passes au sol, passes en profondeur, lofted double appui, tirs puissance / lob, StarSkills : détail sur ea.com.', src: 'official' },
      { k: 'Title Update 1.5.3', v: 'Correctifs dont comportement GK sur passes répétées (forums EA).', src: 'official' },
      { k: 'Lancement FUT', v: 'Chimie +3 / +6 / +9 et compromis sur la vitesse (Launch Update EA).', src: 'official' }
    ]
  },
  /**
   * Hub « live » (même idée qu’une appli Warzone Meta) : tu édites picks + updatedAt + bundleVersion à chaque veille.
   * kind : formation | gestes | players | squad | guide | note
   */
  LIVE_META: {
    headline:
      'Picks FC26-Meta (à éditer ici) : formations, gestes, catalogue, composeur — distinct du cadre EA en bas de page.',
    updatedAt: '2026-04-19',
    picks: [
      {
        id: 'hub-4231',
        kind: 'formation',
        tier: 'S',
        tag: 'FUT',
        title: '4-2-3-1',
        blurb: 'Socle large pour milieux + MOC ; ouvre la fiche 11 postes et recopie dans FUT.',
        formationName: '4-2-3-1',
      },
      {
        id: 'hub-433',
        kind: 'formation',
        tier: 'A',
        tag: 'FUT',
        title: '4-3-3 (4)',
        blurb: 'Largeur naturelle ; vérifier gabarits exacts dans le sélecteur EA.',
        formationName: '4-3-3 (4)',
      },
      {
        id: 'hub-patch-moves',
        kind: 'gestes',
        tier: 'S',
        tag: 'v1.5.x',
        title: 'Gestes & patchs',
        blurb: 'Passes au sol, profondeur, tirs, jockey : rappels EA regroupés plus bas sur cette page.',
        scrollTo: 'mf-techniques',
      },
      {
        id: 'hub-roster',
        kind: 'players',
        tier: 'A',
        tag: 'Catalogue',
        title: 'Cartes base FC26',
        blurb: 'Recherche par nom (insensible aux accents) pour aligner ta méta cartes.',
      },
      {
        id: 'hub-squad',
        kind: 'squad',
        tier: 'A',
        tag: 'XI',
        title: 'Composeur',
        blurb: 'Monte un XI + banc sur le pool local — puis reproduis dans Ultimate Team.',
      },
      {
        id: 'hub-rivals',
        kind: 'guide',
        tier: 'B',
        tag: 'Rivaux',
        title: 'Guide Rivaux',
        blurb: 'Ordre des menus FUT + rappels EA pour ne rien oublier avant une session.',
      },
      {
        id: 'hub-celeb',
        kind: 'celebrations',
        tier: 'A',
        tag: 'FUT',
        title: 'Célébrations',
        blurb: 'Combinaisons manette + PC : tableau complet onglet FUT.',
      },
    ],
  },
  /**
   * Célébrations de but : combinaisons (PS5 / Xbox / PC clavier référence).
   * Les entrées « pichenette RS » renvoient à l’écran d’aide FC26 (direction stick) quand le guide source utilise seulement (flick).
   * Synthèse alignée sur les schémas habituels FC / communautés fiables — vérifier après patch EA.
   */
  CELEBRATIONS: {
    headline:
      'Après un but : d’abord les raccourcis globaux, puis les mouvements de finition (L1/L2/R1/R2 + stick / touches). RS = stick droit ; pichenette = mouvement bref du stick.',
    sourceLabel: 'Réf. communautaire + client FC26',
    sourceUrl: 'https://www.ea.com/games/ea-sports-fc/fc-26',
    legend: [
      'Moment : juste après le but, avant le rejoué automatique — sauf mention « en course » (porteur qui court).',
      'Quand une ligne dit « pichenette RS » : ouvre Paramètres FC26 → Personnalisation / Aide touches pour la direction exacte (EA change parfois les libellés).',
      'PC : schéma clavier courant FC ; rebind possible — colonne indicative.',
    ],
    footer:
      'EA ne publie pas toujours une liste web à jour de chaque célébration : en cas de doute, catalogue in-game + notes de mise à jour (Title Update).',
    basics: [
      {
        name: 'Célébration signature (joueur / club)',
        ps: 'Croix',
        xbox: 'A',
        pc: 'S',
      },
      {
        name: 'Célébration aléatoire',
        ps: 'Rond',
        xbox: 'B',
        pc: 'A ou E (selon config)',
      },
      {
        name: 'Passer / annuler la célébration (toi)',
        ps: 'L1 + R1 (maintenir)',
        xbox: 'LB + RB (maintenir)',
        pc: 'LShift + T (maintenir)',
      },
      {
        name: 'Passer le rejoué (participant)',
        ps: '—',
        xbox: '—',
        pc: 'LShift + D',
      },
    ],
    sections: [
      {
        id: 'finishing',
        title: 'Mouvements de finition (après le but)',
        hint: 'Maintenir L1/L2/R1/R2 pendant la séquence ; « pichenette RS » = stick droit bref (direction = menu Aide FC26).',
        rows: [
          { name: 'Point to the Sky', ps: 'L1 maintenir + Croix', xbox: 'LB maintenir + A', pc: 'LShift maintenir + S' },
          { name: 'Show Respect', ps: 'L1 maintenir + double appui (voir aide touches)', xbox: 'LB idem', pc: 'LShift + double appui' },
          { name: 'Spanish Dance', ps: 'L2 maintenir + pichenette RS puis Haut ×2', xbox: 'LT idem', pc: 'W maintenir + pichenette puis Haut ×2' },
          { name: 'Flex', ps: 'L1 maintenir + Croix', xbox: 'LB maintenir + A', pc: 'LShift + S' },
          { name: 'All Ears', ps: 'L1 maintenir + Croix', xbox: 'LB maintenir + A', pc: 'LShift + A' },
          { name: 'X (bras en X)', ps: 'L1 maintenir + pichenette RS', xbox: 'LB maintenir + pichenette RS', pc: 'LShift + pichenette' },
          { name: 'Who, Me?', ps: 'L1 maintenir + directions RS (voir aide)', xbox: 'LB idem', pc: 'LShift + RS équivalent' },
          { name: 'Baby', ps: 'L1 maintenir + RS (voir aide)', xbox: 'LB idem', pc: 'LShift + maintien' },
          { name: 'Knee Slide 1', ps: 'L1 maintenir + pichenette RS', xbox: 'LB idem', pc: 'LShift + pichenette' },
          { name: 'Band Master', ps: 'L1 maintenir + pichenette RS (combo)', xbox: 'LB idem', pc: 'LShift + pichenette' },
          { name: 'Mask', ps: 'L1 maintenir + pichenette RS', xbox: 'LB idem', pc: 'LShift + pichenette' },
          { name: 'Knee Slide Spin', ps: 'L1 maintenir + rotation RS', xbox: 'LB idem', pc: 'LShift + rotation' },
          { name: 'Arms to Crowd', ps: 'L1 maintenir + rotation RS', xbox: 'LB idem', pc: 'LShift + rotation' },
          { name: 'Timber', ps: 'L2 maintenir + Croix', xbox: 'LT maintenir + A', pc: 'W + S' },
          { name: 'Cell Phone', ps: 'L2 maintenir + Croix', xbox: 'LT + A', pc: 'W + S' },
          { name: 'Hypnosis', ps: 'L2 maintenir + Croix', xbox: 'LT + A', pc: 'W + A' },
          { name: 'Think', ps: 'L2 maintenir + double appui Croix', xbox: 'LT + double A', pc: 'W + double S' },
          { name: 'Stir the Pot', ps: 'L2 maintenir + double appui Croix', xbox: 'LT idem', pc: 'W + double A' },
          { name: 'Cabaret', ps: 'L2 maintenir + RS directions (voir aide)', xbox: 'LT idem', pc: 'W + RS' },
          { name: 'I Can’t Hear You', ps: 'L2 maintenir + RS', xbox: 'LT idem', pc: 'W + RS' },
          { name: 'Heart Symbol (finition)', ps: 'L2 maintenir + RS', xbox: 'LT idem', pc: 'W + RS' },
          { name: 'Brick Fall', ps: 'L2 maintenir + RS', xbox: 'LT idem', pc: 'W + RS' },
          { name: 'Driving', ps: 'L2 maintenir + pichenette RS', xbox: 'LT idem', pc: 'W + pichenette' },
          { name: 'Pulse', ps: 'L2 maintenir + pichenette RS', xbox: 'LT idem', pc: 'W + pichenette' },
          { name: 'Tea', ps: 'L2 maintenir + pichenette RS', xbox: 'LT idem', pc: 'W + pichenette' },
          { name: 'Neighbourhood', ps: 'L2 maintenir + pichenette RS', xbox: 'LT idem', pc: 'W + pichenette' },
          { name: 'Faking It', ps: 'L2 maintenir + pichenette RS', xbox: 'LT idem', pc: 'W + pichenette' },
          { name: 'Guitar', ps: 'L2 maintenir + rotation RS', xbox: 'LT + rotation RS', pc: 'W + rotation' },
          { name: 'Twist Flip (agiles)', ps: 'L2 maintenir + rotation RS', xbox: 'LT idem', pc: 'W + rotation' },
          { name: 'One Eye', ps: 'R2 maintenir + R3 (clic RS)', xbox: 'RT + RS clic', pc: 'LCtrl combo (voir config)' },
          { name: 'Boxing', ps: 'R1 maintenir + double appui Croix', xbox: 'RB + double A', pc: 'D + double A' },
          { name: 'Kiss the Ring', ps: 'R2 maintenir + double appui Croix', xbox: 'RT + double A', pc: 'LCtrl + double A' },
          { name: 'The Salute', ps: 'R1 maintenir + Croix', xbox: 'RB + A', pc: 'D + S' },
          { name: 'Hop & Point', ps: 'R2 maintenir + pichenette RS', xbox: 'RT idem', pc: 'LCtrl + pichenette' },
          { name: 'Swagger', ps: 'R1 maintenir + double appui Croix', xbox: 'RB idem', pc: 'D + double' },
          { name: 'Knee Slide', ps: 'R1 maintenir + pichenette RS', xbox: 'RB idem', pc: 'D + pichenette' },
          { name: 'Giant', ps: 'R1 maintenir + pichenette RS', xbox: 'RB idem', pc: 'D + pichenette' },
          { name: 'All in One', ps: 'R1 maintenir + rotation RS', xbox: 'RB + rotation', pc: 'D + rotation' },
          { name: 'Eyes and Arms', ps: 'R2 maintenir + pichenette RS', xbox: 'RT idem', pc: 'LCtrl + pichenette' },
          { name: 'Slide Salute', ps: 'R1 maintenir + RS (maintien)', xbox: 'RB idem', pc: 'D + RS' },
          { name: 'Slides and Kiss', ps: 'R1 maintenir + RS (maintien)', xbox: 'RB idem', pc: 'D + RS' },
          { name: 'Gamer', ps: 'R1 maintenir + pichenette RS', xbox: 'RB idem', pc: 'D + pichenette' },
          { name: 'Happy Walk', ps: 'L1 maintenir + RS (maintien)', xbox: 'LB idem', pc: 'LShift + RS' },
          { name: 'Chicken Dance', ps: 'L1 maintenir + pichenette RS', xbox: 'LB idem', pc: 'LShift + pichenette' },
        ],
      },
      {
        id: 'running',
        title: 'En course (buteur qui court)',
        hint: 'Pendant la course du buteur : beaucoup de lignes utilisent uniquement le stick droit (appui court, maintien ou pichenette). Vérifie l’icône à l’écran.',
        rows: [
          { name: 'Aeroplane', ps: 'R3 maintenir', xbox: 'RS clic maintenir', pc: 'T maintenir' },
          { name: 'Windmill', ps: 'Rotation rapide RS', xbox: 'Rotation RS', pc: 'Rotation équivalent' },
          { name: 'Telephone', ps: 'RS maintien (direction aide)', xbox: 'RS idem', pc: '—' },
          { name: 'Point to Sky (course)', ps: 'RS maintien', xbox: 'RS idem', pc: '—' },
          { name: 'Thumb Suck', ps: 'RS maintien', xbox: 'RS idem', pc: 'S maintenir' },
          { name: 'Arms Out', ps: 'RS tap puis maintien', xbox: 'RS idem', pc: 'S tap + maintien' },
        ],
      },
      {
        id: 'pro',
        title: 'Déblocages Pro Clubs (exemples)',
        hint: 'Mode Clubs — certaines réservées hors ligne ou progression.',
        rows: [
          { name: 'Hands Crossed', ps: 'R2 maintenir + RS maintien', xbox: 'RT + RS', pc: 'LCtrl combo' },
          { name: 'Peace', ps: 'R1 maintenir + double Croix', xbox: 'RB + double A', pc: 'D + double S' },
          { name: 'Pigeon', ps: 'R1 maintenir + R3', xbox: 'RB + RS clic', pc: 'D + T' },
          { name: 'All in One (Pro)', ps: 'R1 maintenir + rotation RS', xbox: 'RB + rotation', pc: 'D + rotation' },
          { name: 'Sleep', ps: 'R2 maintenir + pichenette RS', xbox: 'RT idem', pc: 'LCtrl + pichenette' },
          { name: 'Run', ps: 'R2 maintenir + pichenette RS', xbox: 'RT idem', pc: 'LCtrl + pichenette' },
        ],
      },
      {
        id: 'eas',
        title: 'Déblocages EAS FC / objectifs',
        hint: 'Suivre les objectifs in-game pour déverrouiller.',
        rows: [
          { name: 'KO', ps: 'L1 maintenir + double Croix', xbox: 'LB + double A', pc: 'LShift + double S' },
          { name: 'Right Here, Right Now', ps: 'R1 maintenir + Croix', xbox: 'RB + A', pc: 'D + S' },
          { name: 'Low Fist Pump', ps: 'L2 maintenir + pichenette RS', xbox: 'LT idem', pc: 'W + pichenette' },
          { name: 'Stand Tall', ps: 'R1 maintenir + RS maintien', xbox: 'RB + RS', pc: 'D + RS' },
          { name: 'Rock On', ps: 'L2 maintenir + R3', xbox: 'LT + RS clic', pc: 'W + T' },
          { name: 'Stretch', ps: 'R1 maintenir + rotation RS', xbox: 'RB + rotation', pc: 'D + rotation' },
          { name: 'Ground Hit', ps: 'R1 maintenir + pichenette RS', xbox: 'RB idem', pc: 'D + pichenette' },
          { name: 'Bye', ps: 'L1 maintenir + R3', xbox: 'LB + RS clic', pc: 'LShift + T' },
        ],
      },
    ],
  },
  /**
   * Parcours navigation FUT + liens EA. La formation affichée = CONFIG.expressFormationRef (exemple), pas un classement.
   */
  META_SETUP_EXPRESS: {
    titre: 'Guide Rivaux FUT',
    accroche:
      'Étapes pour ouvrir les bons menus dans Ultimate Team et retrouver les explications Electronic Arts (pas de « meilleure formation » imposée).',
    disclaimer:
      'Contenu de ce fichier limité aux sources EA listées sous Liens officiels. Aucune tier list, score interne ou rentabilité DCE inventée.',
    etapes: [
      { titre: 'Entrer en Ultimate Team', texte: 'Lance le mode FUT et va sur l’écran de ton club (accueil club).' },
      { titre: 'Ouvrir les tactiques d’équipe', texte: 'Depuis l’équipe active, ouvre la tactique / le plan de jeu (menus Electronic Arts).' },
      { titre: 'Choisir une disposition', texte: 'Dans le sélecteur de formations, choisis celle qui convient à ton style — l’encadré ci-contre montre seulement un exemple (CONFIG.expressFormationRef), pas une recommandation EA.' },
      { titre: 'Régler approche défensive et construction', texte: 'Utilise les options proposées par le jeu (quatre niveaux d’approche défensive et trois styles de construction en français — vérifier les libellés exacts dans FUT > Tactiques).' },
      { titre: 'Curseurs et consignes', texte: 'Régler profondeur, largeurs et consignes par poste directement dans les menus FUT ; EA ne fournit pas de tableau unique « parfait » pour tous les joueurs.' },
      { titre: 'Lire les correctifs EA', texte: 'Sur ea.com ou les forums EA, ouvre la dernière mise à jour titre ; la page « Mises à jour (patchs) » de ce site reprend les extraits utiles.' },
      { titre: 'Console (hors FUT)', texte: 'Dans les paramètres FC26, pars des préréglages console décrits dans les pitch notes EA (compétition en ligne / réalisme hors ligne).' },
      { titre: 'Lancer Division Rivaux', texte: 'Menu compétition FUT → Division Rivaux → choisis ton rang / session et lance une partie.' }
    ],
    rappelChimieUneLigne:
      'Styles de chimie et attributs : sur les cartes et dans les menus FUT (client EA) ; encadré dédié sur la page « Chimie FUT ».'
  },
  PLAYERS: [
    {
      id: 'ea_fut_cards',
      name: 'Cartes et attributs FUT',
      league: 'FUT',
      club: 'EA SPORTS FC 26',
      nation: '—',
      pos: '—',
      bestPos: '—',
      altPos: [],
      metaRole: 'Données affichées sur chaque carte dans le client',
      tier: '—',
      acc: '—',
      playstyles: [],
      chemNone: 'Menu Styles de chimie (FUT)',
      chemChem: 'idem',
      tacticalFit: '—',
      cost: '—',
      metaScore: 0,
      patchSens: '—',
      confidence: 'ea',
      source: 'official',
      strengths: 'Source : jeu Ultimate Team (Electronic Arts)',
      limits: 'Pas de score « classement » EA dans cet outil'
    },
    {
      id: 'ea_patch_notes',
      name: 'Équilibrage & patchs',
      league: 'News',
      club: 'Electronic Arts',
      nation: '—',
      pos: '—',
      bestPos: '—',
      altPos: [],
      metaRole: 'Lire les Title Updates et pitch notes',
      tier: '—',
      acc: '—',
      playstyles: [],
      chemNone: '—',
      chemChem: '—',
      tacticalFit: '—',
      cost: '—',
      metaScore: 0,
      patchSens: '—',
      confidence: 'ea',
      source: 'official',
      strengths: 'ea.com / forums EA — page Mises à jour (patchs) de ce site',
      limits: '—'
    }
  ],
  FORMATIONS: [
    { name:'4-2-3-1', style:'Disposition listée dans le sélecteur FUT', tier:'—', popularity:null, stability:'—', tags:[], aggression:null, control:null, width:null, depth:null, strengths:'—', weaknesses:'—', counters:'—', context:'—', score:0, idealRoles:'—', source:'official' },
    { name:'4-2-1-3', style:'Disposition listée dans le sélecteur FUT', tier:'—', popularity:null, stability:'—', tags:[], aggression:null, control:null, width:null, depth:null, strengths:'—', weaknesses:'—', counters:'—', context:'—', score:0, idealRoles:'—', source:'official' },
    { name:'4-4-1-1', style:'Disposition listée dans le sélecteur FUT', tier:'—', popularity:null, stability:'—', tags:[], aggression:null, control:null, width:null, depth:null, strengths:'—', weaknesses:'—', counters:'—', context:'—', score:0, idealRoles:'—', source:'official' },
    { name:'4-4-2 (flat)', style:'Disposition listée dans le sélecteur FUT', tier:'—', popularity:null, stability:'—', tags:[], aggression:null, control:null, width:null, depth:null, strengths:'—', weaknesses:'—', counters:'—', context:'—', score:0, idealRoles:'—', source:'official' },
    { name:'4-3-2-1', style:'Disposition listée dans le sélecteur FUT', tier:'—', popularity:null, stability:'—', tags:[], aggression:null, control:null, width:null, depth:null, strengths:'—', weaknesses:'—', counters:'—', context:'—', score:0, idealRoles:'—', source:'official' },
    { name:'4-3-3 (4)', style:'Disposition listée dans le sélecteur FUT', tier:'—', popularity:null, stability:'—', tags:[], aggression:null, control:null, width:null, depth:null, strengths:'—', weaknesses:'—', counters:'—', context:'—', score:0, idealRoles:'—', source:'official' },
    { name:'4-1-2-1-2 (étroit)', style:'Disposition listée dans le sélecteur FUT', tier:'—', popularity:null, stability:'—', tags:[], aggression:null, control:null, width:null, depth:null, strengths:'—', weaknesses:'—', counters:'—', context:'—', score:0, idealRoles:'—', source:'official' },
    { name:'3-5-2', style:'Disposition listée dans le sélecteur FUT', tier:'—', popularity:null, stability:'—', tags:[], aggression:null, control:null, width:null, depth:null, strengths:'—', weaknesses:'—', counters:'—', context:'—', score:0, idealRoles:'—', source:'official' },
    { name:'5-3-2', style:'Disposition listée dans le sélecteur FUT', tier:'—', popularity:null, stability:'—', tags:[], aggression:null, control:null, width:null, depth:null, strengths:'—', weaknesses:'—', counters:'—', context:'—', score:0, idealRoles:'—', source:'official' },
    { name:'4-2-2-2', style:'Disposition listée dans le sélecteur FUT', tier:'—', popularity:null, stability:'—', tags:[], aggression:null, control:null, width:null, depth:null, strengths:'—', weaknesses:'—', counters:'—', context:'—', score:0, idealRoles:'—', source:'official' },
    { name:'4-3-1-2', style:'Disposition listée dans le sélecteur FUT', tier:'—', popularity:null, stability:'—', tags:[], aggression:null, control:null, width:null, depth:null, strengths:'—', weaknesses:'—', counters:'—', context:'—', score:0, idealRoles:'—', source:'official' },
    { name:'4-5-1', style:'Disposition listée dans le sélecteur FUT', tier:'—', popularity:null, stability:'—', tags:[], aggression:null, control:null, width:null, depth:null, strengths:'—', weaknesses:'—', counters:'—', context:'—', score:0, idealRoles:'—', source:'official' },
    { name:'3-4-2-1', style:'Disposition listée dans le sélecteur FUT', tier:'—', popularity:null, stability:'—', tags:[], aggression:null, control:null, width:null, depth:null, strengths:'—', weaknesses:'—', counters:'—', context:'—', score:0, idealRoles:'—', source:'official' }
  ],
  FC26_TACTICS_CANON: {
    rôle: 'Référence tactique FC26 en français : résumés fidèles des notes EA (Gameplay Deep Dive) + listes de presets alignées sur le client français.',
    citationsEa: [
      {
        texteFr:
          'Résumé tactique en « toile d’araignée » : six axes pour voir forces et faiblesses — attaque, défense, construction, largeur, profondeur (longueur), endurance.',
        url: 'https://www.ea.com/games/ea-sports-fc/fc-26/news/pitch-notes-fc26-gameplay-deep-dive',
      },
      {
        texteFr: 'La hauteur de ligne est enregistrée dans le code tactique partagé.',
        url: 'https://www.ea.com/games/ea-sports-fc/fc-26/news/pitch-notes-fc26-gameplay-deep-dive',
      },
      {
        texteFr:
          'Hauteur de la ligne défensive : la ligne ne remonte plus automatiquement autant lors des tentatives de jeu du hors-jeu.',
        url: 'https://www.ea.com/games/ea-sports-fc/fc-26/news/pitch-notes-fc26-gameplay-deep-dive',
      },
    ],
    optionsApprocheDefensive: ['Bas', 'Équilibré', 'Haut', 'Extrême'],
    optionsStyleConstruction: ['Passe courte', 'Équilibré', 'Contre-attaque'],
    rappelClientFr:
      'Dans le jeu en français, l’approche défensive propose en général quatre niveaux (souvent du type bas, équilibré, haut, extrême) et la construction trois styles (passe courte, équilibré, contre-attaque). Vérifier les libellés exacts dans FUT > Tactiques.',
    noteAnalytique:
      'Sur chaque fiche formation, la paire (approche défensive / style de construction) rappelle des options fréquentes du client français ; ce n’est pas une recommandation officielle EA par formation.',
  },
  /**
   * Fiches UT : gabarits = aide au sélecteur FR ; approcheDefensive / styleConstruction ∈ FC26_TACTICS_CANON (exemples de menus).
   * Rôle+ / objectif : libellés d’aide — le client FUT (EA) fait foi.
   * En mode official_only, l’UI remplace les consignes par CONFIG.officialSlotConsigne.
   */
  FORMATION_DETAILS: {
    '4-2-3-1': {
      gabaritsSelecteur: ['4-2-3-1 large', '4-2-3-1 étroit'],
      noteGabarits:
        'Post-patch passes : l’étroit compresse encore plus le jeu — privilégier le large si tu te sens étouffé. Sans largeur réelle aux « ailes », le schéma se referme et le MOC disparaît des options.',
      approcheDefensive: 'Bas',
      styleConstruction: 'Équilibré',
      slots: [
        { poste: 'GK', libelle: 'Gardien', rolePlus: 'Gardien libéro', objectifRole: 'Construire', consignes: 'Activer comme solution de passe · sorties modérées' },
        { poste: 'LB', libelle: 'DG', rolePlus: 'Défenseur latéral', objectifRole: 'Défendre', consignes: 'Revenir en défense · largeur prudente (ne pas tout monter)' },
        { poste: 'CB', libelle: 'DCG', rolePlus: 'Défenseur central', objectifRole: 'Défendre', consignes: 'Rester en défense · couvrir le centre' },
        { poste: 'CB', libelle: 'DCD', rolePlus: 'Défenseur stoppeur', objectifRole: 'Équilibré', consignes: 'Rester en défense · presser sur les porteurs' },
        { poste: 'RB', libelle: 'DD', rolePlus: 'Défenseur latéral', objectifRole: 'Défendre', consignes: 'Revenir en défense · largeur prudente (ne pas tout monter)' },
        { poste: 'CDM', libelle: 'MCD gauche', rolePlus: 'Milieu défensif', objectifRole: 'Défendre', consignes: 'Rester devant la défense · couvrir le centre' },
        { poste: 'CDM', libelle: 'MCD droit', rolePlus: 'Milieu défensif', objectifRole: 'Défendre', consignes: 'Rester devant la défense · passes courtes · pas de montée folle' },
        { poste: 'LM', libelle: 'MG', rolePlus: 'Ailier', objectifRole: 'Équilibré', consignes: 'S’appuyer sur les côtés en phase 1 · rentrer seulement quand le bloc est posé' },
        { poste: 'CAM', libelle: 'MOC', rolePlus: 'Meneur de jeu', objectifRole: 'Équilibré', consignes: 'Glisser entre les lignes · ne pas rester statique sous le MDC adverse' },
        { poste: 'RM', libelle: 'MD', rolePlus: 'Ailier', objectifRole: 'Équilibré', consignes: 'S’appuyer sur les côtés en phase 1 · rentrer seulement quand le bloc est posé' },
        { poste: 'ST', libelle: 'BU', rolePlus: 'Renard des surfaces', objectifRole: 'Attaquer', consignes: 'S’en profond · rester central' },
      ],
    },
    '4-2-1-3': {
      gabaritsSelecteur: ['4-2-1-3'],
      noteGabarits: 'Un seul gabarit standard 4-2-1-3 dans le sélecteur ; vérifier le libellé exact in-game.',
      approcheDefensive: 'Haut',
      styleConstruction: 'Contre-attaque',
      slots: [
        { poste: 'GK', libelle: 'Gardien', rolePlus: 'Gardien libéro', objectifRole: 'Construire', consignes: 'Solution de passe haute · risque contrôle' },
        { poste: 'LB', libelle: 'DG', rolePlus: 'Défenseur latéral offensif', objectifRole: 'Équilibré', consignes: 'Revenir en défense · largeur à la montée' },
        { poste: 'CB', libelle: 'DCG', rolePlus: 'Défenseur central', objectifRole: 'Défendre', consignes: 'Rester en défense · ligne' },
        { poste: 'CB', libelle: 'DCD', rolePlus: 'Défenseur stoppeur', objectifRole: 'Équilibré', consignes: 'Rester en défense · presser' },
        { poste: 'RB', libelle: 'DD', rolePlus: 'Défenseur latéral offensif', objectifRole: 'Équilibré', consignes: 'Revenir en défense · largeur à la montée' },
        { poste: 'CDM', libelle: 'MCD G', rolePlus: 'Milieu défensif', objectifRole: 'Défendre', consignes: 'Rester devant la défense · couvrir le centre' },
        { poste: 'CDM', libelle: 'MCD D', rolePlus: 'Milieu box-to-box', objectifRole: 'Équilibré', consignes: 'Rester en défense · équilibre montée' },
        { poste: 'CM', libelle: 'MC axial', rolePlus: 'Meneur de jeu', objectifRole: 'Équilibré', consignes: 'Rester au bord de la surface · création' },
        { poste: 'LW', libelle: 'AG', rolePlus: 'Ailier', objectifRole: 'Attaquer', consignes: 'S’appuyer sur les côtés · s’en profond' },
        { poste: 'ST', libelle: 'BU', rolePlus: 'Renard des surfaces', objectifRole: 'Attaquer', consignes: 'S’en profond · rester central' },
        { poste: 'RW', libelle: 'AD', rolePlus: 'Ailier', objectifRole: 'Attaquer', consignes: 'S’appuyer sur les côtés · s’en profond' },
      ],
    },
    '4-4-1-1': {
      gabaritsSelecteur: ['4-4-1-1'],
      noteGabarits: 'Gabarit unique 4-4-1-1 ; confirmer le libellé in-game.',
      approcheDefensive: 'Équilibré',
      styleConstruction: 'Passe courte',
      slots: [
        { poste: 'GK', libelle: 'Gardien', rolePlus: 'Gardien', objectifRole: 'Équilibré', consignes: 'Revenir en défense · passes courtes' },
        { poste: 'LB', libelle: 'DG', rolePlus: 'Défenseur latéral', objectifRole: 'Défendre', consignes: 'Revenir en défense · largeur prudente' },
        { poste: 'CB', libelle: 'DCG', rolePlus: 'Défenseur central', objectifRole: 'Défendre', consignes: 'Rester en défense · ligne' },
        { poste: 'CB', libelle: 'DCD', rolePlus: 'Défenseur stoppeur', objectifRole: 'Équilibré', consignes: 'Rester en défense · duels' },
        { poste: 'RB', libelle: 'DD', rolePlus: 'Défenseur latéral', objectifRole: 'Défendre', consignes: 'Revenir en défense · largeur prudente' },
        { poste: 'LM', libelle: 'MG', rolePlus: 'Milieu box-to-box', objectifRole: 'Équilibré', consignes: 'Rester en défense · largeur' },
        { poste: 'CM', libelle: 'MCG', rolePlus: 'Milieu box-to-box', objectifRole: 'Équilibré', consignes: 'Rester en défense · soutien axial' },
        { poste: 'CM', libelle: 'MCD', rolePlus: 'Milieu box-to-box', objectifRole: 'Équilibré', consignes: 'Rester en défense · soutien axial' },
        { poste: 'RM', libelle: 'MD', rolePlus: 'Milieu box-to-box', objectifRole: 'Équilibré', consignes: 'Rester en défense · largeur' },
        { poste: 'CAM', libelle: 'MOC / SS', rolePlus: 'Neuf et demi', objectifRole: 'Attaquer', consignes: 'Rester au bord de la surface · appels dans la surface' },
        { poste: 'ST', libelle: 'BU', rolePlus: 'Pivot', objectifRole: 'Équilibré', consignes: 'Rester central · dos au but' },
      ],
    },
    '4-4-2 (flat)': {
      gabaritsSelecteur: ['4-4-2 plat'],
      noteGabarits: 'Le sélecteur distingue le 4-4-2 plat des autres variantes 4-4-2 ; confirmer le libellé exact dans ton jeu.',
      approcheDefensive: 'Équilibré',
      styleConstruction: 'Équilibré',
      slots: [
        { poste: 'GK', libelle: 'Gardien', rolePlus: 'Gardien', objectifRole: 'Défendre', consignes: 'Rester sur sa ligne · jeu court' },
        { poste: 'LB', libelle: 'DG', rolePlus: 'Défenseur latéral', objectifRole: 'Équilibré', consignes: 'Revenir en défense' },
        { poste: 'CB', libelle: 'DCG', rolePlus: 'Défenseur central', objectifRole: 'Défendre', consignes: 'Rester en défense' },
        { poste: 'CB', libelle: 'DCD', rolePlus: 'Défenseur stoppeur', objectifRole: 'Équilibré', consignes: 'Rester en défense · presser' },
        { poste: 'RB', libelle: 'DD', rolePlus: 'Défenseur latéral', objectifRole: 'Équilibré', consignes: 'Revenir en défense' },
        { poste: 'LM', libelle: 'MG', rolePlus: 'Milieu box-to-box', objectifRole: 'Équilibré', consignes: 'Rester en défense · largeur' },
        { poste: 'CM', libelle: 'MCG', rolePlus: 'Milieu box-to-box', objectifRole: 'Équilibré', consignes: 'Rester en défense · axial' },
        { poste: 'CM', libelle: 'MCD', rolePlus: 'Milieu box-to-box', objectifRole: 'Équilibré', consignes: 'Rester en défense · axial' },
        { poste: 'RM', libelle: 'MD', rolePlus: 'Milieu box-to-box', objectifRole: 'Équilibré', consignes: 'Rester en défense · largeur' },
        { poste: 'ST', libelle: 'BU 1', rolePlus: 'Pivot', objectifRole: 'Équilibré', consignes: 'Rester central · dos au but' },
        { poste: 'ST', libelle: 'BU 2', rolePlus: 'Renard des surfaces', objectifRole: 'Attaquer', consignes: 'S’en profond · appels dos ligne' },
      ],
    },
    '4-3-2-1': {
      gabaritsSelecteur: ['4-3-2-1'],
      noteGabarits: 'Gabarit 4-3-2-1 « arbre de Noël » ; vérifier in-game.',
      approcheDefensive: 'Équilibré',
      styleConstruction: 'Passe courte',
      slots: [
        { poste: 'GK', libelle: 'Gardien', rolePlus: 'Gardien libéro', objectifRole: 'Équilibré', consignes: 'Passes courtes · sortie modérée' },
        { poste: 'LB', libelle: 'DG', rolePlus: 'Défenseur latéral', objectifRole: 'Équilibré', consignes: 'Revenir en défense · montée mesurée' },
        { poste: 'CB', libelle: 'DCG', rolePlus: 'Défenseur central', objectifRole: 'Défendre', consignes: 'Rester en défense' },
        { poste: 'CB', libelle: 'DCD', rolePlus: 'Défenseur stoppeur', objectifRole: 'Équilibré', consignes: 'Rester en défense' },
        { poste: 'RB', libelle: 'DD', rolePlus: 'Défenseur latéral', objectifRole: 'Équilibré', consignes: 'Revenir en défense · montée mesurée' },
        { poste: 'CM', libelle: 'MCG', rolePlus: 'Mezzala', objectifRole: 'Équilibré', consignes: 'Rester en défense · élargir' },
        { poste: 'CM', libelle: 'MC axial', rolePlus: 'Meneur de jeu', objectifRole: 'Équilibré', consignes: 'Rester au bord de la surface · axial' },
        { poste: 'CM', libelle: 'MCD', rolePlus: 'Mezzala', objectifRole: 'Équilibré', consignes: 'Rester en défense · élargir' },
        { poste: 'LF', libelle: 'AG intérieur', rolePlus: 'Attaquant intérieur', objectifRole: 'Équilibré', consignes: 'Rentrer dans l’axe · s’en profond' },
        { poste: 'RF', libelle: 'AD intérieur', rolePlus: 'Attaquant intérieur', objectifRole: 'Équilibré', consignes: 'Rentrer dans l’axe · s’en profond' },
        { poste: 'ST', libelle: 'BU', rolePlus: 'Renard des surfaces', objectifRole: 'Attaquer', consignes: 'S’en profond · rester central' },
      ],
    },
    '4-3-3 (4)': {
      gabaritsSelecteur: ['4-3-3 (4)'],
      noteGabarits: 'Le « (4) » désigne la variante possession / milieux resserrés dans le sélecteur FC26.',
      approcheDefensive: 'Équilibré',
      styleConstruction: 'Passe courte',
      slots: [
        { poste: 'GK', libelle: 'Gardien', rolePlus: 'Gardien libéro', objectifRole: 'Équilibré', consignes: 'Passes courtes · option de relance' },
        { poste: 'LB', libelle: 'DG', rolePlus: 'Défenseur latéral', objectifRole: 'Équilibré', consignes: 'Revenir en défense · largeur' },
        { poste: 'CB', libelle: 'DCG', rolePlus: 'Défenseur central', objectifRole: 'Défendre', consignes: 'Rester en défense' },
        { poste: 'CB', libelle: 'DCD', rolePlus: 'Défenseur relanceur', objectifRole: 'Défendre', consignes: 'Rester en défense · relance mesurée' },
        { poste: 'RB', libelle: 'DD', rolePlus: 'Défenseur latéral', objectifRole: 'Équilibré', consignes: 'Revenir en défense · largeur' },
        { poste: 'CM', libelle: 'MCG', rolePlus: 'Milieu box-to-box', objectifRole: 'Équilibré', consignes: 'Rester en défense · demi-lune' },
        { poste: 'CM', libelle: 'MC axial', rolePlus: 'Meneur de jeu', objectifRole: 'Équilibré', consignes: 'Rester au bord de la surface · création' },
        { poste: 'CM', libelle: 'MCD', rolePlus: 'Milieu box-to-box', objectifRole: 'Équilibré', consignes: 'Rester en défense · demi-lune' },
        { poste: 'LW', libelle: 'AG', rolePlus: 'Ailier', objectifRole: 'Équilibré', consignes: 'S’appuyer sur les côtés · s’en profond' },
        { poste: 'ST', libelle: 'BU', rolePlus: 'Pivot', objectifRole: 'Équilibré', consignes: 'Rester central · liaison' },
        { poste: 'RW', libelle: 'AD', rolePlus: 'Ailier', objectifRole: 'Équilibré', consignes: 'S’appuyer sur les côtés · s’en profond' },
      ],
    },
    '4-1-2-1-2 (étroit)': {
      gabaritsSelecteur: ['4-1-2-1-2 étroit'],
      noteGabarits: 'Variante resserrée du 4-1-2-1-2 ; aligner avec l’entrée correspondante du sélecteur de formations.',
      approcheDefensive: 'Bas',
      styleConstruction: 'Passe courte',
      slots: [
        { poste: 'GK', libelle: 'Gardien', rolePlus: 'Gardien', objectifRole: 'Défendre', consignes: 'Rester sur sa ligne · jeu court' },
        { poste: 'LB', libelle: 'DG', rolePlus: 'Défenseur latéral offensif', objectifRole: 'Équilibré', consignes: 'Revenir en défense · montée' },
        { poste: 'CB', libelle: 'DCG', rolePlus: 'Défenseur central', objectifRole: 'Défendre', consignes: 'Rester en défense' },
        { poste: 'CB', libelle: 'DCD', rolePlus: 'Défenseur stoppeur', objectifRole: 'Équilibré', consignes: 'Rester en défense' },
        { poste: 'RB', libelle: 'DD', rolePlus: 'Défenseur latéral offensif', objectifRole: 'Équilibré', consignes: 'Revenir en défense · montée' },
        { poste: 'CDM', libelle: 'MCD ancré', rolePlus: 'Milieu défensif', objectifRole: 'Défendre', consignes: 'Rester devant la défense · couvrir le centre' },
        { poste: 'CM', libelle: 'MCG', rolePlus: 'Milieu box-to-box', objectifRole: 'Équilibré', consignes: 'Rester en défense · rentrer dans l’axe' },
        { poste: 'CM', libelle: 'MCD', rolePlus: 'Milieu box-to-box', objectifRole: 'Équilibré', consignes: 'Rester en défense · rentrer dans l’axe' },
        { poste: 'CAM', libelle: 'MOC', rolePlus: 'Meneur de jeu', objectifRole: 'Équilibré', consignes: 'Rester au bord de la surface' },
        { poste: 'ST', libelle: 'BU G', rolePlus: 'Attaquant avancé', objectifRole: 'Attaquer', consignes: 'Rester central · largeur courte' },
        { poste: 'ST', libelle: 'BU D', rolePlus: 'Renard des surfaces', objectifRole: 'Attaquer', consignes: 'S’en profond · rester central' },
      ],
    },
    '3-5-2': {
      gabaritsSelecteur: ['3-5-2'],
      noteGabarits: 'Gabarit 3-5-2 standard.',
      approcheDefensive: 'Équilibré',
      styleConstruction: 'Équilibré',
      slots: [
        { poste: 'GK', libelle: 'Gardien', rolePlus: 'Gardien libéro', objectifRole: 'Équilibré', consignes: 'Passes courtes · relance' },
        { poste: 'CB', libelle: 'DCG', rolePlus: 'Défenseur central excentré', objectifRole: 'Équilibré', consignes: 'Couvrir couloir gauche · ligne à 3' },
        { poste: 'CB', libelle: 'DC axial', rolePlus: 'Défenseur central', objectifRole: 'Défendre', consignes: 'Rester en défense · axe' },
        { poste: 'CB', libelle: 'DCD', rolePlus: 'Défenseur central excentré', objectifRole: 'Défendre', consignes: 'Couvrir couloir droit · ligne à 3' },
        { poste: 'LWB', libelle: 'Carrilero G', rolePlus: 'Piston', objectifRole: 'Équilibré', consignes: 'Revenir en défense · largeur' },
        { poste: 'CM', libelle: 'MCG', rolePlus: 'Milieu box-to-box', objectifRole: 'Équilibré', consignes: 'Rester en défense · milieu à 5' },
        { poste: 'CM', libelle: 'MC axial', rolePlus: 'Meneur de jeu', objectifRole: 'Équilibré', consignes: 'Rester au bord de la surface · pivot' },
        { poste: 'CM', libelle: 'MCD', rolePlus: 'Milieu box-to-box', objectifRole: 'Équilibré', consignes: 'Rester en défense · milieu à 5' },
        { poste: 'RWB', libelle: 'Carrilero D', rolePlus: 'Piston', objectifRole: 'Équilibré', consignes: 'Revenir en défense · largeur' },
        { poste: 'ST', libelle: 'BU 1', rolePlus: 'Pivot', objectifRole: 'Équilibré', consignes: 'Rester central' },
        { poste: 'ST', libelle: 'BU 2', rolePlus: 'Renard des surfaces', objectifRole: 'Attaquer', consignes: 'S’en profond' },
      ],
    },
    '5-3-2': {
      gabaritsSelecteur: ['5-3-2'],
      noteGabarits: 'Gabarit 5-3-2.',
      approcheDefensive: 'Bas',
      styleConstruction: 'Contre-attaque',
      slots: [
        { poste: 'GK', libelle: 'Gardien', rolePlus: 'Gardien', objectifRole: 'Défendre', consignes: 'Rester sur sa ligne · jeu long si besoin' },
        { poste: 'LWB', libelle: 'Carrilero G', rolePlus: 'Défenseur latéral', objectifRole: 'Défendre', consignes: 'Rester en défense · largeur basse' },
        { poste: 'CB', libelle: 'DCG', rolePlus: 'Défenseur central excentré', objectifRole: 'Défendre', consignes: 'Couvrir montée piston gauche' },
        { poste: 'CB', libelle: 'DC axial', rolePlus: 'Défenseur stoppeur', objectifRole: 'Équilibré', consignes: 'Rester en défense · ligne à 5' },
        { poste: 'CB', libelle: 'DCD', rolePlus: 'Défenseur central excentré', objectifRole: 'Attaquer', consignes: 'Presser côté droit · couvrir piston' },
        { poste: 'RWB', libelle: 'Carrilero D', rolePlus: 'Défenseur latéral', objectifRole: 'Défendre', consignes: 'Rester en défense · largeur basse' },
        { poste: 'CM', libelle: 'MCG', rolePlus: 'Milieu défensif', objectifRole: 'Défendre', consignes: 'Rester en défense · saturation' },
        { poste: 'CM', libelle: 'MC axial', rolePlus: 'Meneur de jeu reculé', objectifRole: 'Défendre', consignes: 'Rester au bord de la surface · relance' },
        { poste: 'CM', libelle: 'MCD', rolePlus: 'Milieu défensif', objectifRole: 'Défendre', consignes: 'Rester en défense · saturation' },
        { poste: 'ST', libelle: 'BU 1', rolePlus: 'Pivot', objectifRole: 'Équilibré', consignes: 'Rester central · dos au but' },
        { poste: 'ST', libelle: 'BU 2', rolePlus: 'Renard des surfaces', objectifRole: 'Attaquer', consignes: 'S’en profond' },
      ],
    },
    '4-2-2-2': {
      gabaritsSelecteur: ['4-2-2-2'],
      noteGabarits: 'Gabarit 4-2-2-2.',
      approcheDefensive: 'Haut',
      styleConstruction: 'Contre-attaque',
      slots: [
        { poste: 'GK', libelle: 'Gardien', rolePlus: 'Gardien libéro', objectifRole: 'Construire', consignes: 'Sortie pour relancer sous pressing' },
        { poste: 'LB', libelle: 'DG', rolePlus: 'Défenseur latéral', objectifRole: 'Équilibré', consignes: 'Revenir en défense' },
        { poste: 'CB', libelle: 'DCG', rolePlus: 'Défenseur central', objectifRole: 'Défendre', consignes: 'Rester en défense' },
        { poste: 'CB', libelle: 'DCD', rolePlus: 'Défenseur stoppeur', objectifRole: 'Équilibré', consignes: 'Rester en défense · ligne haute' },
        { poste: 'RB', libelle: 'DD', rolePlus: 'Défenseur latéral', objectifRole: 'Équilibré', consignes: 'Revenir en défense' },
        { poste: 'CDM', libelle: 'MCD G', rolePlus: 'Milieu défensif', objectifRole: 'Défendre', consignes: 'Rester devant la défense' },
        { poste: 'CDM', libelle: 'MCD D', rolePlus: 'Meneur de jeu reculé', objectifRole: 'Défendre', consignes: 'Rester devant la défense · relance' },
        { poste: 'CAM', libelle: 'MOC G', rolePlus: 'Neuf et demi', objectifRole: 'Attaquer', consignes: 'Rester au bord de la surface · appels' },
        { poste: 'CAM', libelle: 'MOC D', rolePlus: 'Neuf et demi', objectifRole: 'Attaquer', consignes: 'Rester au bord de la surface · appels' },
        { poste: 'ST', libelle: 'BU 1', rolePlus: 'Attaquant avancé', objectifRole: 'Attaquer', consignes: 'Rester central · pressing' },
        { poste: 'ST', libelle: 'BU 2', rolePlus: 'Renard des surfaces', objectifRole: 'Attaquer', consignes: 'S’en profond' },
      ],
    },
    '4-3-1-2': {
      gabaritsSelecteur: ['4-3-1-2'],
      noteGabarits: 'Gabarit 4-3-1-2.',
      approcheDefensive: 'Équilibré',
      styleConstruction: 'Passe courte',
      slots: [
        { poste: 'GK', libelle: 'Gardien', rolePlus: 'Gardien libéro', objectifRole: 'Équilibré', consignes: 'Passes courtes · relance' },
        { poste: 'LB', libelle: 'DG', rolePlus: 'Défenseur latéral offensif', objectifRole: 'Équilibré', consignes: 'Revenir en défense · montée' },
        { poste: 'CB', libelle: 'DCG', rolePlus: 'Défenseur central', objectifRole: 'Défendre', consignes: 'Rester en défense' },
        { poste: 'CB', libelle: 'DCD', rolePlus: 'Défenseur stoppeur', objectifRole: 'Équilibré', consignes: 'Rester en défense' },
        { poste: 'RB', libelle: 'DD', rolePlus: 'Défenseur latéral offensif', objectifRole: 'Équilibré', consignes: 'Revenir en défense · montée' },
        { poste: 'CM', libelle: 'MCG', rolePlus: 'Mezzala', objectifRole: 'Équilibré', consignes: 'Rester en défense · largeur' },
        { poste: 'CM', libelle: 'MC axial', rolePlus: 'Meneur de jeu', objectifRole: 'Équilibré', consignes: 'Rester au bord de la surface · axial' },
        { poste: 'CM', libelle: 'MCD', rolePlus: 'Mezzala', objectifRole: 'Équilibré', consignes: 'Rester en défense · largeur' },
        { poste: 'CAM', libelle: 'MOC', rolePlus: 'Meneur de jeu', objectifRole: 'Équilibré', consignes: 'Rester au bord de la surface · lien double BU' },
        { poste: 'ST', libelle: 'BU G', rolePlus: 'Faux 9', objectifRole: 'Construire', consignes: 'Rentrer dans l’axe · combinaisons' },
        { poste: 'ST', libelle: 'BU D', rolePlus: 'Renard des surfaces', objectifRole: 'Attaquer', consignes: 'S’en profond · rester central' },
      ],
    },
    '4-5-1': {
      gabaritsSelecteur: ['4-5-1 plat'],
      noteGabarits: 'Variante « milieu plat » du 4-5-1 ; vérifier l’intitulé exact dans le sélecteur.',
      approcheDefensive: 'Équilibré',
      styleConstruction: 'Passe courte',
      slots: [
        { poste: 'GK', libelle: 'Gardien', rolePlus: 'Gardien', objectifRole: 'Équilibré', consignes: 'Passes courtes' },
        { poste: 'LB', libelle: 'DG', rolePlus: 'Défenseur latéral', objectifRole: 'Défendre', consignes: 'Revenir en défense' },
        { poste: 'CB', libelle: 'DCG', rolePlus: 'Défenseur central', objectifRole: 'Défendre', consignes: 'Rester en défense' },
        { poste: 'CB', libelle: 'DCD', rolePlus: 'Défenseur stoppeur', objectifRole: 'Équilibré', consignes: 'Rester en défense' },
        { poste: 'RB', libelle: 'DD', rolePlus: 'Défenseur latéral', objectifRole: 'Défendre', consignes: 'Revenir en défense' },
        { poste: 'LM', libelle: 'MG', rolePlus: 'Milieu box-to-box', objectifRole: 'Équilibré', consignes: 'Rester en défense · largeur' },
        { poste: 'CM', libelle: 'MCG', rolePlus: 'Milieu défensif', objectifRole: 'Équilibré', consignes: 'Rester en défense · couper lignes' },
        { poste: 'CM', libelle: 'MC axial', rolePlus: 'Meneur de jeu', objectifRole: 'Équilibré', consignes: 'Rester au bord de la surface · relance' },
        { poste: 'CM', libelle: 'MCD', rolePlus: 'Milieu défensif', objectifRole: 'Équilibré', consignes: 'Rester en défense · couper lignes' },
        { poste: 'RM', libelle: 'MD', rolePlus: 'Milieu box-to-box', objectifRole: 'Équilibré', consignes: 'Rester en défense · largeur' },
        { poste: 'ST', libelle: 'BU', rolePlus: 'Pivot', objectifRole: 'Équilibré', consignes: 'Rester central · cible longue' },
      ],
    },
    '3-4-2-1': {
      gabaritsSelecteur: ['3-4-2-1'],
      noteGabarits: 'Gabarit 3-4-2-1.',
      approcheDefensive: 'Haut',
      styleConstruction: 'Contre-attaque',
      slots: [
        { poste: 'GK', libelle: 'Gardien', rolePlus: 'Gardien libéro', objectifRole: 'Construire', consignes: 'Relance haute · risque maîtrisé' },
        { poste: 'CB', libelle: 'DCG', rolePlus: 'Défenseur central excentré', objectifRole: 'Équilibré', consignes: 'Couvrir couloir gauche · ligne à 3' },
        { poste: 'CB', libelle: 'DC axial', rolePlus: 'Défenseur central', objectifRole: 'Défendre', consignes: 'Rester en défense · axe' },
        { poste: 'CB', libelle: 'DCD', rolePlus: 'Défenseur central excentré', objectifRole: 'Attaquer', consignes: 'Presser côté droit · couvrir piston' },
        { poste: 'LWB', libelle: 'Carrilero G', rolePlus: 'Piston', objectifRole: 'Attaquer', consignes: 'Revenir en défense · largeur haute' },
        { poste: 'CM', libelle: 'MCG', rolePlus: 'Milieu box-to-box', objectifRole: 'Équilibré', consignes: 'Rester en défense · milieu à 4' },
        { poste: 'CM', libelle: 'MCD', rolePlus: 'Milieu box-to-box', objectifRole: 'Équilibré', consignes: 'Rester en défense · milieu à 4' },
        { poste: 'RWB', libelle: 'Carrilero D', rolePlus: 'Piston', objectifRole: 'Attaquer', consignes: 'Revenir en défense · largeur haute' },
        { poste: 'LF', libelle: 'AG / 10', rolePlus: 'Attaquant intérieur', objectifRole: 'Équilibré', consignes: 'Rentrer dans l’axe · s’en profond' },
        { poste: 'RF', libelle: 'AD / 10', rolePlus: 'Attaquant intérieur', objectifRole: 'Équilibré', consignes: 'Rentrer dans l’axe · s’en profond' },
        { poste: 'ST', libelle: 'BU', rolePlus: 'Renard des surfaces', objectifRole: 'Attaquer', consignes: 'Rester central · s’en profond' },
      ],
    },
  },
  TECHNIQUES: [
    { name:'Passes au sol (stats de passe)', category:'passe', diff:'—', eff:null, tier:null, input:'×', timing:'—', context:'Title Update 1.5.0', error:'—', risk:'—', reward:'—', when:'—', why:'EA : passes au sol plus rapides et précises lorsque les stats de passe sont élevées.', against:'—', chain:'—', zone:'—', profile:'—', patch:'v1.5.0', source:'official', simple:'Voir notes EA 1.5.0', advanced:'—', counterRead:'—' },
    { name:'Passes en profondeur', category:'passe', diff:'—', eff:null, tier:null, input:'△', timing:'—', context:'Title Update 1.5.0', error:'—', risk:'—', reward:'—', when:'—', why:'EA : trajectoire selon contexte ; sans style « passe décisive » si passes courtes / longues / courbe déjà hautes.', against:'—', chain:'—', zone:'—', profile:'—', patch:'v1.5.0', source:'official', simple:'Voir notes EA 1.5.0', advanced:'—', counterRead:'—' },
    { name:'Passe lobée double appui', category:'passe', diff:'—', eff:null, tier:null, input:'△×2', timing:'—', context:'Title Update 1.5.0', error:'—', risk:'—', reward:'—', when:'—', why:'EA : précision réduite sur double appui.', against:'—', chain:'—', zone:'—', profile:'—', patch:'v1.5.0', source:'official', simple:'Voir notes EA 1.5.0', advanced:'—', counterRead:'—' },
    { name:'Sprint explosif', category:'dribble', diff:'—', eff:null, tier:null, input:'R2', timing:'—', context:'Pitch notes gameplay', error:'—', risk:'—', reward:'—', when:'—', why:'EA : mécanique de vitesse décrite dans les notes gameplay FC26.', against:'—', chain:'—', zone:'—', profile:'—', patch:'—', source:'official', simple:'Voir pitch notes EA', advanced:'—', counterRead:'—' },
    { name:'Feinte de tir / talonnade / feinte sortante', category:'dribble', diff:'—', eff:null, tier:null, input:'—', timing:'—', context:'Title Update 1.5.0', error:'—', risk:'—', reward:'—', when:'—', why:'EA : légère accélération de la vitesse d’exécution (+5 %).', against:'—', chain:'—', zone:'—', profile:'—', patch:'v1.5.0', source:'official', simple:'Voir notes EA 1.5.0', advanced:'—', counterRead:'—' },
    { name:'Tir en puissance', category:'tir', diff:'—', eff:null, tier:null, input:'L1+R1+○', timing:'—', context:'Title Update 1.5.0', error:'—', risk:'—', reward:'—', when:'—', why:'EA : trajectoire et précision ajustées (dont style Plus).', against:'—', chain:'—', zone:'—', profile:'—', patch:'v1.5.0', source:'official', simple:'Voir notes EA 1.5.0', advanced:'—', counterRead:'—' },
    { name:'Tir lobé (chip)', category:'tir', diff:'—', eff:null, tier:null, input:'—', timing:'—', context:'Title Update 1.5.0', error:'—', risk:'—', reward:'—', when:'—', why:'EA : précision et bonus style Chip ajustés.', against:'—', chain:'—', zone:'—', profile:'—', patch:'v1.5.0', source:'official', simple:'Voir notes EA 1.5.0', advanced:'—', counterRead:'—' },
    { name:'Jockey défensif', category:'defense', diff:'—', eff:null, tier:null, input:'R2', timing:'—', context:'Pitch notes gameplay', error:'—', risk:'—', reward:'—', when:'—', why:'EA : schémas de touches et aide défensive documentés dans les pitch notes.', against:'—', chain:'—', zone:'—', profile:'—', patch:'—', source:'official', simple:'Voir pitch notes EA', advanced:'—', counterRead:'—' }
  ],
  PATCHES: [
    { version:'v1.5.3', date:'2026', channel:'EA Forums', summary:'Correctifs UT/Career + comportement GK (passes répétées).', changes:[{ type:'neutral', text:'GK : sortie touche si passes spam au gardien.'},{ type:'buff', text:'UT : recherche kits/badges ; previews célébrations.'},{ type:'neutral', text:'Career/UI/stabilité.'}], metaImpact:'EA ne publie pas de synthèse séparée : se référer à la liste des changements ci-dessus.', bascule:'—', sourceUrl:'https://forums.ea.com/blog/ea-sports-fc-game-info-hub-en/ea-sports-fc%E2%84%A2-26--title-update-v1-5-3/13312649', sourceType:'official' },
    { version:'v1.5.0', date:'4 mars 2026', channel:'ea.com', summary:'PlayStyles passes/tirs vs stats de base ; passes sol ; lofted ; power/chip ; tiki ; inventive ; StarSkills +5 %.', changes:[{ type:'buff', text:'Passes sol précision/vitesse (haut passing).'},{ type:'buff', text:'Through courbe sans Incisive si hauts short/long/curve.'},{ type:'nerf', text:'Lofted double tap moins précis.'},{ type:'buff', text:'Power shot traj + précision PS+.'},{ type:'buff', text:'Chip + précision ; bonus Chip PS.'},{ type:'nerf', text:'Tiki Taka passes sol/first time (reste buff global).'},{ type:'neutral', text:'Inventive loft compens partiel.'},{ type:'buff', text:'Fake shot / heel chop / feint +5% vitesse.'}], metaImpact:'EA ne publie pas de synthèse séparée : se référer à la liste des changements ci-dessus.', bascule:'—', sourceUrl:'https://www.ea.com/games/ea-sports-fc/fc-26/news/pitch-notes-fc26-title-update-1-5-0', sourceType:'official' }
  ],
  /** Rappel documentaire uniquement — l’UI DCE n’affiche pas de tableau chiffré (pas de coût / rentabilité calculés ici). */
  SBC_DATA: [
    {
      name: 'Défis Squad Building (DCE)',
      cat: 'FUT',
      rappel:
        'Coûts, exigences et récompenses sont indiqués dans Ultimate Team (client Electronic Arts). Cet outil ne calcule ni rentabilité ni score pour les DCE.',
    },
  ],
  BEHAVIORS: [
    { name:'Construction passes sol', zone:'Global', freq:'Très élevée', status:'Buff v1.5.0', risk:'Stable', source:'official', note:'EA : haute précision si haut passing.' },
    { name:'Lofted double tap', zone:'Dernier tiers', freq:'Moyenne', status:'Nerf v1.5.0', risk:'Moyen', source:'official', note:'Précision réduite.' },
    { name:'Incisive moins dominant', zone:'Création', freq:'Élevée', status:'Patch v1.5.0', risk:'Suivi', source:'official', note:'Shift stats de base.' },
    { name:'Power shot + PS+', zone:'18m', freq:'Moyenne', status:'Buff v1.5.0', risk:'Moyen', source:'official', note:'Traj + précision.' },
    { name:'Tiki Taka first time', zone:'Surface', freq:'Moyenne', status:'Nerf partiel', risk:'Moyen', source:'official', note:'Moins OP vs sans PS.' },
    { name:'Fake shot / heel / feint speed', zone:'Surface', freq:'Élevée', status:'Buff +5%', risk:'Faible', source:'official', note:'Skill buffer officiel.' },
    { name:'GK spam passes', zone:'PA', freq:'Rare', status:'v1.5.3', risk:'Très faible', source:'official', note:'Anti exploit temps.' },
    { name:'RL GK positioning', zone:'PA', freq:'Permanente NG', status:'Feature', risk:'Stable', source:'official', note:'Positionnement ML.' },
    { name:'Courbe FUT plus lente', zone:'UT', freq:'Saison', status:'Launch', risk:'Stable', source:'official', note:'EA launch : power curve.' },
    { name:'Styles chimie 3/6/9', zone:'UT', freq:'Permanent', status:'Launch', risk:'Stable', source:'official', note:'Moins burst pace global.' }
  ],
  META_TABLE: [
    {
      el: 'Passes au sol (stats de passe)',
      rappel:
        'Title Update 1.5.0 (Electronic Arts) : passes au sol plus rapides et plus précises lorsque les statistiques de passe sont élevées.',
      perimetre: 'Notes ea.com — Title Update 1.5.0',
      suivi: 'Contrôler les Title Updates suivantes pour d’éventuels ajustements.',
      src: 'official',
    },
    {
      el: 'Passes en profondeur',
      rappel:
        'Title Update 1.5.0 : trajectoire selon le contexte ; sans PlayStyle « passe décisive » si passes courtes / longues / courbe sont déjà hautes.',
      perimetre: 'Notes ea.com — Title Update 1.5.0',
      suivi: 'Lecture in-game + patch notes à chaque mise à jour.',
      src: 'official',
    },
    {
      el: 'Passe lobée en profondeur (double appui)',
      rappel: 'Title Update 1.5.0 : précision réduite sur double appui (loft en profondeur).',
      perimetre: 'Notes ea.com — Title Update 1.5.0',
      suivi: 'Suivre les correctifs passes dans les prochains TU.',
      src: 'official',
    },
    {
      el: 'PlayStyles — passes et tirs',
      rappel:
        'Title Update 1.5.0 : rééquilibrage des styles liés aux passes et aux tirs (dont ajustements tirs puissance / lob, Tiki Taka, inventive, StarSkills +5 % sur certains gestes).',
      perimetre: 'Liste détaillée sur la page EA du TU 1.5.0',
      suivi: 'Mettre à jour ce fichier après lecture de chaque patch.',
      src: 'official',
    },
    {
      el: 'Tir en puissance et tir lobé (chip)',
      rappel: 'Title Update 1.5.0 : trajectoire et précision ajustées (y compris avec PlayStyle Plus).',
      perimetre: 'Notes ea.com — Title Update 1.5.0',
      suivi: 'Vérifier le ressenti en match après patch.',
      src: 'official',
    },
    {
      el: 'Jockey défensif et schémas de touches',
      rappel: 'Notes gameplay FC26 (Electronic Arts) : schémas de contrôle, aide défensive, sprint explosif, etc.',
      perimetre: 'Pitch notes — Gameplay Deep Dive ea.com',
      suivi: 'Croiser avec les réglages manette du client.',
      src: 'official',
    },
    {
      el: 'Positionnement du gardien (NG)',
      rappel: 'Notes gameplay FC26 : apprentissage pour le placement ; désactivé pendant la résolution d’un arrêt.',
      perimetre: 'Pitch notes — Gameplay Deep Dive ea.com',
      suivi: 'Title Update v1.5.3 — correctifs comportement GK (forums EA).',
      src: 'official',
    },
    {
      el: 'Chimie FUT (+3 / +6 / +9)',
      rappel:
        'Launch Update EA : nouveau palier de styles de chimie et compromis sur la vitesse ; stats secondaires mises en avant.',
      perimetre: 'Pitch notes — Launch Update ea.com',
      suivi: 'Lire les effets sur les cartes dans le client FUT.',
      src: 'official',
    },
  ],
  CHEM_OFFICIAL: {
    headline:'Lancement EA : styles 3 / 6 / 9, compromis sur la vitesse, stats secondaires mises en avant (sang-froid, réactions, endurance…).',
    bullets:['Modèle +3 / +6 / +9 au lieu de +4 / +8 / +12','Styles vitesse avec compromis','Diversité des montages encouragée'],
    sourceUrl:'https://www.ea.com/games/ea-sports-fc/fc-26/news/pitch-notes-fc26-launch-update'
  },
  CHEM_PICKS: [
    { role:'Tous postes', noChem:'Choisir dans FUT > Styles de chimie (client EA)', withChem:'Voir effets +3 / +6 / +9 sur la carte', conf:'official' }
  ],
  SETTINGS: {
    balanced:{ label:'Équilibré', desc:'Rappel : régler les curseurs dans FUT > Tactiques d’équipe (Electronic Arts).', groups:[
      { title:'Tactiques d’équipe (FUT)', items:[
        { label:'Approche défensive', val:'Quatre options', note:'Bas · équilibré · haut · extrême — libellés exacts dans le jeu (FR).' },
        { label:'Style de construction', val:'Trois options', note:'Passe courte · équilibré · contre-attaque — libellés exacts dans le jeu (FR).' },
        { label:'Curseurs (largeur, profondeur, etc.)', val:'In-game', note:'EA ne publie pas de tableau unique de valeurs pour Rivaux.' },
        { label:'Consignes par poste', val:'In-game', note:'Menus FUT > Tactiques d’équipe.' }
      ]},
      { title:'Manette', items:[
        { label:'Schémas de touches', val:'Pitch notes EA', note:'Contrôle orienté, centres, etc. — voir page Manette & options / guide.' },
        { label:'Assistances', val:'Menus FC26', note:'Passes, tirs, changement de joueur : choisir dans les paramètres du titre.' }
      ]}
    ]},
    aggressive:{ label:'Agressif', desc:'Rappel : tout réglage précis se fait dans les tactiques FUT (client EA).', groups:[{ title:'Tactiques d’équipe (FUT)', items:[
      { label:'Approche défensive', val:'Haut / extrême', note:'Options disponibles dans le menu tactique ; gérer l’endurance in-game.' },
      { label:'Autres curseurs', val:'In-game', note:'Non documentés comme preset unique par EA.' }
    ]}]},
    technical:{ label:'Technique', desc:'Rappel : styles de construction et passes au sol décrits dans les notes EA 1.5.0.', groups:[{ title:'Tactiques d’équipe (FUT)', items:[
      { label:'Style de construction', val:'Passe courte (exemple)', note:'Une des trois options du menu.' },
      { label:'Lecture patch', val:'ea.com', note:'Title Update 1.5.0 — passes au sol et passes en profondeur.' }
    ]}]},
    control:{ label:'Contrôle', desc:'Rappel : ajuster les tactiques selon ton ressenti dans le client.', groups:[{ title:'Tactique', items:[
      { label:'Curseurs', val:'In-game', note:'EA ne prescrit pas de profondeur fixe pour tous les joueurs.' }
    ]}]},
    pressing:{ label:'Pressing', desc:'Rappel : approches hautes disponibles dans le menu ; effets endurance gérés par le moteur de jeu.', groups:[{ title:'Tactiques d’équipe (FUT)', items:[
      { label:'Approche défensive', val:'Haut / extrême', note:'Quatre niveaux dans le menu français.' }
    ]}]},
    defensive:{ label:'Défensif', desc:'Rappel : approche basse et curseurs dans FUT.', groups:[{ title:'Tactique', items:[
      { label:'Approche défensive', val:'Bas', note:'Option du menu tactique.' }
    ]}]}
  },
  /**
   * Guide « meta » réglages : séparer strictement officiel EA vs lecture analytique.
   * EA ne fournit pas de preset numérique unique « parfait » pour tous les joueurs.
   */
  SETTINGS_META_GUIDE: {
    disclaimer: 'Electronic Arts documente des systèmes (préréglages console, patchs gameplay, schémas de touches) mais ne publie pas une liste officielle de curseurs tactiques « parfaits » pour Division Rivaux. Cette application ne répète pas de valeurs chiffrées inventées : ouvrir FUT pour régler les curseurs.',
    officialPresets: {
      title: 'Préréglages console EA (en ligne / hors ligne)',
      lead: 'EA propose un profil plutôt compétitif en ligne et un profil plus réaliste hors ligne — détaillé dans les notes gameplay FC26.',
      bullets: [
        { text: 'Compétition : privilégie le matchmaking en ligne, la réactivité et la lisibilité en duel.', url: 'https://www.ea.com/games/ea-sports-fc/fc-26/news/pitch-notes-fc26-gameplay-deep-dive', src: 'Notes gameplay EA' },
        { text: 'Réalisme : expérience plus proche du football réel en modes hors ligne ou selon certaines options.', url: 'https://www.ea.com/games/ea-sports-fc/fc-26/news/pitch-notes-fc26-gameplay-deep-dive', src: 'Notes gameplay EA' }
      ]
    },
    officialGameplaySystems: {
      title: 'Systèmes gameplay confirmés EA (impact sur ton ressenti)',
      items: [
        { text: 'Conduite de balle dynamique, touches de dribble rééquilibrées ; sprint explosif ; trois profils d’accélération (calculs distincts hommes / femmes).', url: 'https://www.ea.com/games/ea-sports-fc/fc-26/news/pitch-notes-fc26-gameplay-deep-dive', tag: 'Notes gameplay' },
        { text: 'Positionnement du gardien NG : apprentissage pour le placement ; désactivé pendant la résolution d’un arrêt.', url: 'https://www.ea.com/games/ea-sports-fc/fc-26/news/pitch-notes-fc26-gameplay-deep-dive', tag: 'Notes gameplay' },
        { text: 'Passes au sol : plus rapides et plus précises lorsque les stats de passe sont élevées (mise à jour titre 1.5.0).', url: 'https://www.ea.com/games/ea-sports-fc/fc-26/news/pitch-notes-fc26-title-update-1-5-0', tag: 'v1.5.0' },
        { text: 'Passes en profondeur : trajectoire selon le contexte, sans style « passe décisive » si passes courtes / longues et courbe sont déjà hautes.', url: 'https://www.ea.com/games/ea-sports-fc/fc-26/news/pitch-notes-fc26-title-update-1-5-0', tag: 'v1.5.0' },
        { text: 'Passe lobée en profondeur (double appui) : précision réduite ; tir en puissance / lob ajustés ; légère accélération des gestes feinte de tir / talonnade / feinte sortante.', url: 'https://www.ea.com/games/ea-sports-fc/fc-26/news/pitch-notes-fc26-title-update-1-5-0', tag: 'v1.5.0' },
        { text: 'Lancement FUT : styles de chimie 3 / 6 / 9, compromis sur la vitesse, stats secondaires mises en avant.', url: 'https://www.ea.com/games/ea-sports-fc/fc-26/news/pitch-notes-fc26-launch-update', tag: 'Lancement' }
      ]
    },
    controllerOfficial: {
      title: 'Manette — ce que EA détaille officiellement',
      bullets: [
        { text: 'Schémas et logique des touches (dont contrôle orienté, centres) dans les notes EA — pas de tableau unique « sensibilité parfaite ».', url: 'https://www.ea.com/games/ea-sports-fc/fc-26/news/pitch-notes-fc26-gameplay-deep-dive', src: 'EA' }
      ]
    },
    controllerAnalytical: {
      title: 'Manette — avis tiers (non utilisés ici)',
      intro: 'Cette section a été vidée : seuls les schémas et options décrits par EA (pitch notes) sont conservés ci-dessus.',
      rows: []
    },
    utMenusNote: {
      title: 'Tactiques d’équipe Ultimate Team (FC26)',
      official:
        'EA décrit un résumé tactique (type graphique radar) sur six axes : attaque, défense, construction, largeur, profondeur, endurance ; la hauteur de ligne est stockée dans le code tactique partagé.',
      clientPresets:
        'En français, l’approche défensive propose en pratique quatre niveaux (souvent : bas, équilibré, haut, extrême) et la construction trois styles (passe courte, équilibré, contre-attaque). Vérifier les libellés exacts dans FUT > Tactiques.',
      analytical:
        'Les fiches Formations reprennent des libellés français du client pour les rôles+ ; seul le jeu fait foi. Les gabarits large / étroit ou plat correspondent à des entrées distinctes du sélecteur lorsqu’elles existent.'
    },
    optimizePlay: {
      title:'Lecture des notes EA',
      steps: [
        'Lire la dernière Title Update sur ea.com ou les forums EA.',
        'Relire les pitch notes gameplay FC26 pour les systèmes (tactique, touches, sprint, gardien NG, etc.).',
        'Dans le jeu, partir des préréglages console « compétition en ligne » / « réalisme » décrits par EA, puis ajuster selon ton confort.',
        'Pour FUT : chimie, styles et tactiques se configurent dans les menus du client — pas de tableau unique EA pour tous les joueurs.'
      ]
    },
    sourceLinks: [
      { title: 'Notes gameplay approfondies FC26', url: 'https://www.ea.com/games/ea-sports-fc/fc-26/news/pitch-notes-fc26-gameplay-deep-dive' },
      { title: 'Mise à jour titre 1.5.0', url: 'https://www.ea.com/games/ea-sports-fc/fc-26/news/pitch-notes-fc26-title-update-1-5-0' },
      { title: 'Mise à jour lancement FUT', url: 'https://www.ea.com/games/ea-sports-fc/fc-26/news/pitch-notes-fc26-launch-update' },
      { title: 'Title Update 1.5.3 (forums EA)', url: 'https://forums.ea.com/blog/ea-sports-fc-game-info-hub-en/ea-sports-fc%E2%84%A2-26--title-update-v1-5-3/13312649' }
    ]
  },
};
