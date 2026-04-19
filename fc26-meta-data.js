/**
 * FC26_META_DATA — couche données (éditer après chaque patch)
 * Mettre à jour : CONFIG.bundleVersion, CONFIG.lastOfficialPatchId, CONFIG.dataRevision
 * Puis : PLAYERS / FORMATIONS / TECHNIQUES / PATCHES / SBC_DATA / BEHAVIORS
 * Les champs "tier", "metaScore", "cost" = lecture communautaire/analytique (pas EA).
 */
window.FC26_META_DATA = {
  CONFIG: {
    bundleVersion: '2026.04.19.2',
    dataRevision: 'post-v1.5.3',
    lastOfficialPatchId: 'v1.5.3',
    lastOfficialPatchUrl: 'https://forums.ea.com/blog/ea-sports-fc-game-info-hub-en/ea-sports-fc%E2%84%A2-26--title-update-v1-5-3/13312649',
    maintainerNote: 'Après patch EA : dupliquer un bloc dans PATCHES, ajuster META_SNAPSHOT + BEHAVIORS, revoir patchSens joueurs concernés.',
    newsIndexUrl: 'https://www.ea.com/games/ea-sports-fc/fc-26/news'
  },
  META_SNAPSHOT: {
    headline: 'Post v1.5.0 : passes au sol et stats de base remontées ; PlayStyles passes/tirs moins dominants.',
    pillars: [
      { k: 'Priorité skill', v: 'Passes sol + lecture ligne (officiel v1.5.0)', src: 'official' },
      { k: 'Risque loft', v: 'Double-appui lofted moins précis (officiel)', src: 'official' },
      { k: 'Skill buffer', v: 'Fake Shot / Heel Chop / Feint +5% vitesse (officiel)', src: 'official' },
      { k: 'GK exploit', v: 'Passes spam GK → sortie touche (v1.5.3, rare)', src: 'official' },
      { k: 'Lecture UT', v: 'Courbe progression plus lente vs FC25 (launch)', src: 'official' },
      { k: 'Formations (non EA)', v: '4231 / 4213 / 4411 restent cadres compétitifs fréquents', src: 'community' }
    ]
  },
  PLAYERS: [
    { id:'mbappe', name:'Kylian Mbappé', league:'LALIGA', club:'Real Madrid', nation:'France', pos:'ST', bestPos:'ST', altPos:['LW','CF'], metaRole:'Finisseur transition', tier:'S', acc:'Explosive', playstyles:['Finesse+','Rapid+','Flair'], chemNone:'Hawk / Finisher', chemChem:'Hunter si burst max', tacticalFit:'4-2-3-1 / 4-4-1-1', cost:'Maj FUTBIN', metaScore:97, patchSens:'moyen', confidence:'community', source:'community', strengths:'Line-breaking, finition angle', limits:'Aérien vs grands défenseurs' },
    { id:'haaland', name:'Erling Haaland', league:'PL', club:'Man City', nation:'Norvège', pos:'ST', bestPos:'ST', altPos:['CF'], metaRole:'9 de surface', tier:'S', acc:'Lengthy', playstyles:['Power Shot','Aerial+','Finesse+'], chemNone:'Engine (liaison) / Hunter', chemChem:'Hawk', tacticalFit:'4-2-1-3 / 4-4-2', cost:'Maj FUTBIN', metaScore:94, patchSens:'faible', confidence:'community', source:'community', strengths:'Tirs chargés, surface', limits:'Agilité serré' },
    { id:'vini', name:'Vinicius Jr', league:'LALIGA', club:'Real Madrid', nation:'Brésil', pos:'LW', bestPos:'LW', altPos:['ST','LM'], metaRole:'Ailier line-breaker', tier:'S', acc:'Explosive', playstyles:['Rapid+','Trickster+','Quick Step+'], chemNone:'Engine', chemChem:'Hunter', tacticalFit:'4-2-3-1 large', cost:'Maj FUTBIN', metaScore:95, patchSens:'moyen', confidence:'community', source:'community', strengths:'1c1, provocation', limits:'Finition variable' },
    { id:'yamal', name:'Lamine Yamal', league:'LALIGA', club:'Barcelona', nation:'Espagne', pos:'RW', bestPos:'RW', altPos:['CAM','LW'], metaRole:'Créateur ailier', tier:'S', acc:'Explosive', playstyles:['Trickster+','Technical+','Rapid+'], chemNone:'Engine / Maestro', chemChem:'Hunter', tacticalFit:'4-2-3-1 / 4-3-3(4)', cost:'Maj FUTBIN', metaScore:95, patchSens:'moyen', confidence:'community', source:'community', strengths:'Agilité, combos', limits:'Physique' },
    { id:'salah', name:'Mohamed Salah', league:'PL', club:'Liverpool', nation:'Égypte', pos:'RW', bestPos:'RW', altPos:['ST','CAM'], metaRole:'Inside forward', tier:'S', acc:'Explosive', playstyles:['Finesse+','Rapid+','Whipped Pass+'], chemNone:'Hawk / Hunter', chemChem:'Hunter', tacticalFit:'4-2-3-1', cost:'Maj FUTBIN', metaScore:93, patchSens:'faible', confidence:'community', source:'community', strengths:'Finition angle, vitesse', limits:'Force dos au but' },
    { id:'bellingham', name:'Jude Bellingham', league:'LALIGA', club:'Real Madrid', nation:'Angleterre', pos:'CM', bestPos:'CAM', altPos:['CM','ST'], metaRole:'Box to box caméléon', tier:'S', acc:'Controlled', playstyles:['Incisive Pass+','Power Header','Bruiser+'], chemNone:'Hunter / Shadow (si bas)', chemChem:'Engine', tacticalFit:'4-2-3-1 / 4-4-1-1', cost:'Maj FUTBIN', metaScore:94, patchSens:'moyen', confidence:'community', source:'community', strengths:'Surface, timings', limits:'Pas pur sprinter' },
    { id:'pedri', name:'Pedri', league:'LALIGA', club:'Barcelona', nation:'Espagne', pos:'CM', bestPos:'CAM', altPos:['CM','LM'], metaRole:'Conducteur', tier:'A', acc:'Controlled', playstyles:['Technical+','First Touch+','Incisive Pass'], chemNone:'Maestro / Artist', chemChem:'Engine', tacticalFit:'4-1-2-1-2 étroit / 4-3-3(4)', cost:'Maj FUTBIN', metaScore:88, patchSens:'faible', confidence:'analytical', source:'analytical', strengths:'Circulation, sécurité', limits:'Défense brute' },
    { id:'kdb', name:'Kevin De Bruyne', league:'PL', club:'Man City', nation:'Belgique', pos:'CM', bestPos:'CAM', altPos:['CM'], metaRole:'Playmaker vertical', tier:'A', acc:'Controlled', playstyles:['Incisive Pass+','Long Ball Pass+','Whipped Pass+'], chemNone:'Hunter / Engine', chemChem:'Hunter', tacticalFit:'4-2-3-1', cost:'Maj FUTBIN', metaScore:90, patchSens:'moyen', confidence:'analytical', source:'analytical', strengths:'Through balls, coups francs', limits:'Défense' },
    { id:'rodri', name:'Rodri', league:'PL', club:'Man City', nation:'Espagne', pos:'CDM', bestPos:'CDM', altPos:['CM'], metaRole:'Sentinelle', tier:'S', acc:'Controlled', playstyles:['Intercept+','Long Ball Pass+','Bruiser'], chemNone:'Shadow', chemChem:'Anchor', tacticalFit:'Double pivot toutes formations', cost:'Maj FUTBIN', metaScore:91, patchSens:'faible', confidence:'analytical', source:'analytical', strengths:'Couverture, relance', limits:'Explosivité' },
    { id:'kimmich', name:'Joshua Kimmich', league:'Bundesliga', club:'Bayern', nation:'Allemagne', pos:'CDM', bestPos:'CDM', altPos:['RB','CM'], metaRole:'Regista défensif', tier:'A', acc:'Controlled', playstyles:['Intercept+','Incisive Pass','Long Ball Pass+'], chemNone:'Shadow / Powerhouse', chemChem:'Anchor', tacticalFit:'4-2-3-1 / 3-5-2', cost:'Maj FUTBIN', metaScore:88, patchSens:'faible', confidence:'analytical', source:'analytical', strengths:'Passes longues, IQ', limits:'Pace vs counters' },
    { id:'tchouameni', name:'Aurélien Tchouaméni', league:'LALIGA', club:'Real Madrid', nation:'France', pos:'CDM', bestPos:'CDM', altPos:['CB'], metaRole:'Stoppeur', tier:'A', acc:'Lengthy', playstyles:['Bruiser+','Intercept+','Block+'], chemNone:'Shadow', chemChem:'Anchor', tacticalFit:'Double pivot', cost:'Maj FUTBIN', metaScore:87, patchSens:'faible', confidence:'community', source:'community', strengths:'Ligne, duels', limits:'Relieve court' },
    { id:'vvd', name:'Virgil van Dijk', league:'PL', club:'Liverpool', nation:'Pays-Bas', pos:'CB', bestPos:'CB', altPos:[], metaRole:'Stoppeur central', tier:'S', acc:'Lengthy', playstyles:['Block+','Aerial+','Anticipate+'], chemNone:'Shadow', chemChem:'Anchor', tacticalFit:'Toute défense 4/5', cost:'Maj FUTBIN', metaScore:92, patchSens:'faible', confidence:'community', source:'community', strengths:'Duels, couverture', limits:'Agilité serré' },
    { id:'militao', name:'Éder Militão', league:'LALIGA', club:'Real Madrid', nation:'Brésil', pos:'CB', bestPos:'CB', altPos:['RB'], metaRole:'Défenseur recovery', tier:'A', acc:'Explosive', playstyles:['Jockey+','Block+','Intercept+'], chemNone:'Shadow', chemChem:'Anchor', tacticalFit:'4 défenseurs', cost:'Maj FUTBIN', metaScore:89, patchSens:'faible', confidence:'community', source:'community', strengths:'Rattrapages, vitesse', limits:'Discipline' },
    { id:'pacho', name:'Willian Pacho', league:'Ligue1', club:'PSG', nation:'Équateur', pos:'CB', bestPos:'CB', altPos:[], metaRole:'Budget meta', tier:'A', acc:'Controlled', playstyles:['Intercept+','Block+'], chemNone:'Shadow', chemChem:'Anchor', tacticalFit:'4-2-3-1', cost:'Maj FUTBIN', metaScore:85, patchSens:'faible', confidence:'analytical', source:'analytical', strengths:'Taille, ligne', limits:'Passe progressive' },
    { id:'theo', name:'Theo Hernández', league:'SerieA', club:'Milan', nation:'France', pos:'LB', bestPos:'LB', altPos:['LWB'], metaRole:'Overlap', tier:'S', acc:'Explosive', playstyles:['Quick Step+','Whipped Pass+'], chemNone:'Shadow', chemChem:'Anchor', tacticalFit:'5-2-1-2 / 4-3-3', cost:'Maj FUTBIN', metaScore:90, patchSens:'faible', confidence:'community', source:'community', strengths:'Courses, finition', limits:'Stamina si spam' },
    { id:'dalot', name:'Diogo Dalot', league:'PL', club:'Man Utd', nation:'Portugal', pos:'RB', bestPos:'RB', altPos:['LB'], metaRole:'Fullback équilibré', tier:'A', acc:'Explosive', playstyles:['Jockey+','Whipped Pass'], chemNone:'Shadow', chemChem:'Anchor', tacticalFit:'4231', cost:'Maj FUTBIN', metaScore:84, patchSens:'faible', confidence:'community', source:'community', strengths:'Pace, solidité', limits:'Création' },
    { id:'trent', name:'Trent Alexander-Arnold', league:'LALIGA', club:'Real Madrid', nation:'Angleterre', pos:'RB', bestPos:'CM', altPos:['RB','CDM'], metaRole:'Créateur bas', tier:'A', acc:'Controlled', playstyles:['Incisive Pass+','Whipped Pass+','Long Ball Pass+'], chemNone:'Maestro / Artist', chemChem:'Engine', tacticalFit:'3 milieux', cost:'Maj FUTBIN', metaScore:88, patchSens:'moyen', confidence:'analytical', source:'analytical', strengths:'Passes diagonales', limits:'Défense si RB seul' },
    { id:'alisson', name:'Alisson', league:'PL', club:'Liverpool', nation:'Brésil', pos:'GK', bestPos:'GK', altPos:[], metaRole:'GK équilibré', tier:'S', acc:'Controlled', playstyles:['1v1 Close Down','Far Throw'], chemNone:'Glove', chemChem:'Basic si budget', tacticalFit:'Toutes', cost:'Maj FUTBIN', metaScore:90, patchSens:'faible', confidence:'community', source:'community', strengths:'Sorties, reflex', limits:'RL NG adverses' },
    { id:'donnarumma', name:'Gianluigi Donnarumma', league:'Ligue1', club:'PSG', nation:'Italie', pos:'GK', bestPos:'GK', altPos:[], metaRole:'GK physique', tier:'A', acc:'Lengthy', playstyles:['Far Reach+'], chemNone:'Glove', chemChem:'Cat', tacticalFit:'Toutes', cost:'Maj FUTBIN', metaScore:87, patchSens:'faible', confidence:'community', source:'community', strengths:'Portée', limits:'Prix' },
    { id:'musiala', name:'Jamal Musiala', league:'Bundesliga', club:'Bayern', nation:'Allemagne', pos:'CAM', bestPos:'CAM', altPos:['LM','ST'], metaRole:'Demi-space', tier:'S', acc:'Explosive', playstyles:['Technical+','First Touch+','Rapid+'], chemNone:'Hunter / Engine', chemChem:'Hunter', tacticalFit:'4231 / 41212', cost:'Maj FUTBIN', metaScore:92, patchSens:'moyen', confidence:'community', source:'community', strengths:'Dribble dense', limits:'Finishing matchs serrés' },
    { id:'palmer', name:'Cole Palmer', league:'PL', club:'Chelsea', nation:'Angleterre', pos:'CAM', bestPos:'CAM', altPos:['RW','CF'], metaRole:'Finisseur créatif', tier:'A', acc:'Controlled', playstyles:['Finesse+','Incisive Pass'], chemNone:'Hunter / Finisher', chemChem:'Hunter', tacticalFit:'4231', cost:'Maj FUTBIN', metaScore:88, patchSens:'moyen', confidence:'community', source:'community', strengths:'Tirs calmes', limits:'Défense' },
    { id:'wirtz', name:'Florian Wirtz', league:'Bundesliga', club:'Leverkusen', nation:'Allemagne', pos:'CAM', bestPos:'CAM', altPos:['LM','CF'], metaRole:'10 technique', tier:'A', acc:'Controlled', playstyles:['Technical+','First Touch+'], chemNone:'Maestro / Hunter', chemChem:'Engine', tacticalFit:'Possession', cost:'Maj FUTBIN', metaScore:87, patchSens:'faible', confidence:'analytical', source:'analytical', strengths:'Combinaisons', limits:'Long sprint' },
    { id:'griezmann', name:'Antoine Griezmann', league:'LALIGA', club:'Atlético', nation:'France', pos:'CAM', bestPos:'CAM', altPos:['ST','CF'], metaRole:'Second striker', tier:'A', acc:'Controlled', playstyles:['Finesse+','First Touch+'], chemNone:'Hunter / Engine', chemChem:'Hawk', tacticalFit:'442 / 4411', cost:'Maj FUTBIN', metaScore:86, patchSens:'faible', confidence:'community', source:'community', strengths:'Mouvement, finition', limits:'Pace pure' },
    { id:'leao', name:'Rafael Leão', league:'SerieA', club:'Milan', nation:'Portugal', pos:'LW', bestPos:'LW', altPos:['ST'], metaRole:'Line breaker', tier:'A', acc:'Explosive', playstyles:['Rapid+','Power Shot'], chemNone:'Hunter', chemChem:'Hunter', tacticalFit:'433', cost:'Maj FUTBIN', metaScore:88, patchSens:'moyen', confidence:'community', source:'community', strengths:'Accélération', limits:'Régularité skill' },
    { id:'dembele', name:'Ousmane Dembélé', league:'Ligue1', club:'PSG', nation:'France', pos:'RW', bestPos:'RW', altPos:['RM','CAM'], metaRole:'Large puis intérieur', tier:'A', acc:'Explosive', playstyles:['Rapid+','Whipped Pass+'], chemNone:'Hunter / Engine', chemChem:'Hunter', tacticalFit:'4213', cost:'Maj FUTBIN', metaScore:87, patchSens:'moyen', confidence:'community', source:'community', strengths:'Percussion', limits:'Finition' },
    { id:'kvara', name:'Khvicha Kvaratskhelia', league:'Ligue1', club:'PSG', nation:'Géorgie', pos:'LW', bestPos:'LW', altPos:['CAM'], metaRole:'1c1 wide', tier:'A', acc:'Explosive', playstyles:['Trickster+','Technical+'], chemNone:'Hunter / Engine', chemChem:'Hunter', tacticalFit:'4213', cost:'Maj FUTBIN', metaScore:88, patchSens:'moyen', confidence:'community', source:'community', strengths:'Carries', limits:'End product' },
    { id:'zubimendi', name:'Martín Zubimendi', league:'PL', club:'Arsenal', nation:'Espagne', pos:'CDM', bestPos:'CDM', altPos:['CM'], metaRole:'6 relance', tier:'A', acc:'Controlled', playstyles:['Intercept+','Incisive Pass'], chemNone:'Shadow', chemChem:'Anchor', tacticalFit:'Double pivot', cost:'Maj FUTBIN', metaScore:86, patchSens:'faible', confidence:'analytical', source:'analytical', strengths:'Positionnement', limits:'Rythme' },
    { id:'gvardiol', name:'Joško Gvardiol', league:'PL', club:'Man City', nation:'Croatie', pos:'CB', bestPos:'CB', altPos:['LB'], metaRole:'Progressif', tier:'A', acc:'Lengthy', playstyles:['Anticipate+','Bruiser'], chemNone:'Shadow', chemChem:'Anchor', tacticalFit:'3 CB / 4 déf', cost:'Maj FUTBIN', metaScore:87, patchSens:'faible', confidence:'community', source:'community', strengths:'Porteur sûr', limits:'Vitesse pure ailier' },
    { id:'walker', name:'Kyle Walker', league:'PL', club:'Man City', nation:'Angleterre', pos:'RB', bestPos:'RB', altPos:['RWB','CB'], metaRole:'Recovery fullback', tier:'A', acc:'Explosive', playstyles:['Jockey+','Quick Step'], chemNone:'Shadow', chemChem:'Anchor', tacticalFit:'5 der', cost:'Maj FUTBIN', metaScore:85, patchSens:'faible', confidence:'community', source:'community', strengths:'Rattrapage', limits:'Technique' },
    { id:'neymar', name:'Neymar Jr', league:'Brasileirao', club:'Flamengo', nation:'Brésil', pos:'LW', bestPos:'LW', altPos:['CAM','CF'], metaRole:'Skill pivot', tier:'B', acc:'Explosive', playstyles:['Trickster+','Flair+','Technical+'], chemNone:'Engine', chemChem:'Hunter', tacticalFit:'Fun / cups', cost:'Maj FUTBIN', metaScore:80, patchSens:'élevé', confidence:'community', source:'community', strengths:'Skill ceiling', limits:'Meta compétitif, prix' }
  ],
  FORMATIONS: [
    { name:'4-2-3-1', style:'Équilibre / création', tier:'S', popularity:88, stability:'Stable', tags:['press','possession','counter'], aggression:6, control:7, width:55, depth:58, strengths:'Double pivot + CAM SS', weaknesses:'Ailes si instructions passives', counters:'352 large', context:'Rivals / Champs', score:92, idealRoles:'CDM ancre + distributeur ; CAM finisseur ; ST get in behind', source:'community' },
    { name:'4-2-1-3', style:'Large / transitions', tier:'S', popularity:84, stability:'Stable', tags:['counter','press'], aggression:7, control:6, width:62, depth:56, strengths:'Front 3 permanent', weaknesses:'Axe si CM flat', counters:'433(2) compact', context:'Contre lignes hautes', score:91, idealRoles:'LW/RW IF ; ST profondeur ; double 6 discipline', source:'community' },
    { name:'4-4-1-1', style:'Bloc compact / contre', tier:'S', popularity:82, stability:'Post patch passes', tags:['counter','press'], aggression:6, control:7, width:48, depth:54, strengths:'ST-CAM liaison', weaknesses:'Largeur offensive limitée', counters:'352 WB', context:'WL défensif', score:90, idealRoles:'LM/RM work ; CAM SS ; ST central', source:'community' },
    { name:'4-4-2 (flat)', style:'Simplicité pressing', tier:'A', popularity:78, stability:'Stable', tags:['press','counter'], aggression:8, control:5, width:58, depth:52, strengths:'2 ST piège CB', weaknesses:'Sans 10 naturel', counters:'4231', context:'Débutant-expert', score:84, idealRoles:'ST duo complémentaires ; CM1 stay back', source:'community' },
    { name:'4-3-2-1', style:'Surcharge axial', tier:'A', popularity:74, stability:'Stable', tags:['press','possession'], aggression:7, control:6, width:42, depth:55, strengths:'Combinaisons étroites', weaknesses:'Largeur à créer manuellement', counters:'433', context:'Players techniques', score:83, idealRoles:'CM triangle ; LF/RF IF', source:'community' },
    { name:'4-3-3 (4)', style:'Possession large', tier:'A', popularity:72, stability:'Stable', tags:['possession'], aggression:5, control:8, width:60, depth:50, strengths:'Sorties balle latérales', weaknesses:'Exposition si CM hauts', counters:'442', context:'Build-up patient', score:82, idealRoles:'CM box-to-box ; wings stay wide', source:'community' },
    { name:'4-1-2-1-2 (étroit)', style:'Overload central', tier:'A', popularity:68, stability:'Sensible patch', tags:['possession','press'], aggression:6, control:8, width:40, depth:52, strengths:'Triangles courts', weaknesses:'Flancs exposés', counters:'4213', context:'Terrain étroit', score:81, idealRoles:'CM latéraux box2box ; CAM SS', source:'community' },
    { name:'3-5-2', style:'Contrôle + WB', tier:'B', popularity:52, stability:'Sensible', tags:['possession','counter'], aggression:5, control:7, width:65, depth:48, strengths:'Surcharge milieu', weaknesses:'WB stamina', counters:'433', context:'Experts défense', score:76, idealRoles:'Wingbacks pace ; 3 CB recovery', source:'community' },
    { name:'5-3-2', style:'Bloc bas', tier:'B', popularity:48, stability:'Stable', tags:['counter'], aggression:4, control:6, width:50, depth:45, strengths:'Sécurité', weaknesses:'Création', counters:'Possession 433', context:'Lead à défendre', score:74, idealRoles:'WBs équilibrés ; ST un pivot', source:'community' },
    { name:'4-2-2-2', style:'Deux 10 semi-large', tier:'A', popularity:70, stability:'Stable', tags:['press','counter'], aggression:7, control:6, width:52, depth:56, strengths:'Pressing ST + CAM', weaknesses:'Milieu 2 vs 3', counters:'433(2)', context:'Transitions', score:83, idealRoles:'CAM work rates ; CDM cover', source:'community' },
    { name:'4-3-1-2', style:'Compact + CAM', tier:'A', popularity:66, stability:'Stable', tags:['possession','press'], aggression:6, control:7, width:45, depth:54, strengths:'Triangles ST-CAM', weaknesses:'Flancs', counters:'4213', context:'Terrain central', score:80, idealRoles:'Fullbacks overlap manual', source:'community' },
    { name:'4-5-1', style:'Bloc milieu', tier:'B', popularity:55, stability:'Stable', tags:['possession'], aggression:5, control:7, width:55, depth:50, strengths:'Saturation milieu', weaknesses:'ST isolé', counters:'352', context:'Négation jeu adverse', score:75, idealRoles:'LM/RM défensifs', source:'community' },
    { name:'3-4-2-1', style:'WB + deux 10', tier:'B', popularity:50, stability:'Sensible', tags:['counter','press'], aggression:7, control:6, width:62, depth:52, strengths:'Surcharge finale', weaknesses:'3 CB discipline', counters:'433', context:'Risk reward', score:77, idealRoles:'WBs endurance', source:'community' }
  ],
  TECHNIQUES: [
    { name:'Through ball profondeur', category:'passe', diff:'Facile', eff:92, tier:'S', input:'△', timing:'Après L1 run, fenêtre dos ligne', context:'Ligne haute', error:'Trop tôt = HJ', risk:'Faible', reward:'Très élevé', when:'Transition', why:'Espace dos', against:'Depth bas', chain:'L1→△→R2', zone:'Demi-lune', profile:'High pass stats', patch:'Buff sol v1.5.0', source:'official', simple:'L1 puis △ au bon timing', advanced:'Feinte corps avant △', counterRead:'Défenseur suit course = passer 3e homme' },
    { name:'Passe au sol enchaînée', category:'passe', diff:'Facile', eff:90, tier:'S', input:'×', timing:'1-2 touches', context:'Post v1.5.0', error:'Forcer loft double tap', risk:'Faible', reward:'Progression', when:'Construction', why:'EA buff sol', against:'Pressing', chain:'Triangle L1', zone:'Axe', profile:'Technical CM', patch:'v1.5.0', source:'official', simple:'× × × orientation', advanced:'Semi-manuel direction', counterRead:'Adversaire slide = opposite side' },
    { name:'Lofted through (double tap)', category:'passe', diff:'Moyen', eff:58, tier:'B', input:'△×2', timing:'Dernier geste si ligne', context:'Après v1.5.0', error:'Spam loft', risk:'Moyen', reward:'Situationnel', when:'Défense compacte', why:'Inventive compens partiel', against:'RL GK', chain:'Feinte→loft', zone:'Surface', profile:'Inventive+', patch:'Nerf loft v1.5.0', source:'official', simple:'Rare', advanced:'Inventive+ seulement si build', counterRead:'CB drop auto' },
    { name:'L1 déclenché manuel', category:'passe', diff:'Facile', eff:91, tier:'S', input:'L1 + stick', timing:'Avant passe', context:'Création course', error:'Oublier L1', risk:'Très faible', reward:'Élevé', when:'Mi-temps adverse', why:'Contrôle course', against:'Zonal', chain:'L1→×/△', zone:'Partout', profile:'Tout attaquant', patch:'Stable', source:'official', simple:'L1 orienter', advanced:'Double L1 pour 2e coureur', counterRead:'Man mark suit coureur' },
    { name:'R1 close dribble (serré)', category:'dribble', diff:'Moyen', eff:78, tier:'A', input:'R1 + directions', timing:'Contact proche', context:'Surface dense', error:'Sprint panique', risk:'Moyen', reward:'Moyen', when:'1v1 court', why:'Protège', against:'Jockey', chain:'R1→skill', zone:'Surface', profile:'High agility', patch:'Dynamic dribbling', source:'community', simple:'R1 micro', advanced:'Mix L2 fake', counterRead:'Tacle auto si spam' },
    { name:'Explosive Sprint', category:'dribble', diff:'Facile', eff:88, tier:'S', input:'Sprint + direction', timing:'Espace ouvert', context:'NG', error:'Zone dense', risk:'Moyen', reward:'Élevé', when:'Flanc', why:'Diff vitesse', against:'Fullback lent', chain:'R2 ligne', zone:'Large', profile:'Explosive', patch:'Deep Dive', source:'official', simple:'R2 ligne droite', advanced:'Couper après 2m', counterRead:'Jockey mirror' },
    { name:'Fake shot stop', category:'dribble', diff:'Moyen', eff:82, tier:'A', input:'○ puis ×', timing:'Quasi simultané', context:'1v1 GK', error:'Direction = tir', risk:'Faible', reward:'Élevé', when:'Face GK', why:'Freeze défense', against:'Rush GK', chain:'Fake→R2', zone:'Surface', profile:'Tout', patch:'+5% v1.5.0', source:'official', simple:'○× neutre', advanced:'Angle 45°', counterRead:'GK patient' },
    { name:'Heel chop', category:'dribble', diff:'Moyen', eff:76, tier:'A', input:'Sprint + ○×', timing:'Pleine course', context:'Flanc', error:'Input raté', risk:'Moyen', reward:'Moyen', when:'Fullback face', why:'Changement rythme', against:'Jockey', chain:'Heel→through', zone:'Aile', profile:'Skillers', patch:'+5% v1.5.0', source:'official', simple:'Sprint trick', advanced:'Cancel en skill', counterRead:'Anticipate déf' },
    { name:'Feint and Exit', category:'dribble', diff:'Moyen', eff:75, tier:'A', input:'R1 flick', timing:'Face déf', context:'1c1', error:'Spam', risk:'Moyen', reward:'Moyen', when:'Aile', why:'Sortie vitesse', against:'Aggro', chain:'Feint→sprint', zone:'Large', profile:'Trickster', patch:'+5% v1.5.0', source:'official', simple:'R1 skill', advanced:'Chaîne 2 skills', counterRead:'Second défenseur cover' },
    { name:'Croqueta', category:'dribble', diff:'Facile', eff:74, tier:'A', input:'L1←/→', timing:'Latéral', context:'Axe', error:'Spam', risk:'Faible', reward:'Moyen', when:'Milieu', why:'Sort press', against:'CM flat', chain:'Croq→pass', zone:'Axe', profile:'Trickster', patch:'Contexte communautaire', source:'community', simple:'L1 lat', advanced:'Double croq rare', counterRead:'Tacle latéral' },
    { name:'Finesse (angle)', category:'tir', diff:'Facile', eff:86, tier:'S', input:'R1+○', timing:'Entrée surface', context:'Inside cut', error:'Trop central', risk:'Faible', reward:'Élevé', when:'Aile→int', why:'Arc', against:'GK statique', chain:'Cut→finesse', zone:'15-20m', profile:'Finesse+', patch:'Chip buff ≠ finesse', source:'community', simple:'R1+○', advanced:'Timed optionnel', counterRead:'GK anticipé' },
    { name:'Power Shot', category:'tir', diff:'Moyen', eff:80, tier:'A', input:'L1+R1+○', timing:'Espace 0.5s', context:'Mi-distance', error:'Sous pression', risk:'Moyen', reward:'Très élevé', when:'Central 18m', why:'Trajectoire v1.5.0', against:'Drop bas', chain:'Feinte→PS', zone:'Zone 18', profile:'Power Shot+', patch:'Buff v1.5.0', source:'official', simple:'L1R1○', advanced:'Orient pied faible', counterRead:'Block CDM' },
    { name:'Chip shot', category:'tir', diff:'Moyen', eff:72, tier:'B', input:'L1+○ (contexte)', timing:'GK sort', context:'1v1', error:'Trop tôt', risk:'Moyen', reward:'Situationnel', when:'GK rush', why:'Buff v1.5.0', against:'GK timide', chain:'R1 drib→chip', zone:'Surface', profile:'Chip PS+', patch:'v1.5.0', source:'official', simple:'Chip si sortie', advanced:'Feinte avant', counterRead:'GK patient' },
    { name:'Low driven', category:'tir', diff:'Facile', eff:84, tier:'S', input:'○+○ tap', timing:'Angle fermé', context:'Surface', error:'Trop loin', risk:'Faible', reward:'Élevé', when:'Couloir', why:'GK RL', against:'GK bas', chain:'Pass→driven', zone:'6m', profile:'Finisher', patch:'GK RL', source:'community', simple:'Double tap', advanced:'Near post aim', counterRead:'Second barre' },
    { name:'Jockey défensif', category:'defense', diff:'Facile', eff:90, tier:'S', input:'R2', timing:'Maintien', context:'1v1', error:'Tacle rush', risk:'Très faible', reward:'Élevé', when:'Approche', why:'Angles', against:'Skills', chain:'R2→×', zone:'Dernière ligne', profile:'Jockey+', patch:'Deep Dive', source:'official', simple:'R2 face', advanced:'L2+Jockey micro', counterRead:'Feinte corps' },
    { name:'Second défenseur press', category:'defense', diff:'Moyen', eff:78, tier:'A', input:'R1 press', timing:'Après switch', context:'Couloir', error:'Trop tôt double', risk:'Moyen', reward:'Moyen', when:'Aile', why:'Fermeture', against:'Skill chain', chain:'Switch→R1', zone:'Flanc', profile:'Work rates H', patch:'Stable', source:'community', simple:'R1 teammate', advanced:'Curved run déf', counterRead:'Pass 3e homme' },
    { name:'Tacle glissé sélectif', category:'defense', diff:'Difficile', eff:70, tier:'B', input:'○', timing:'Fin fenêtre', context:'Déséquilibre attaquant', error:'Spam', risk:'Élevé', reward:'Élevé', when:'Last man', why:'Stop net', against:'Agility', chain:'Jockey→slide', zone:'Surface', profile:'Def stats', patch:'Patch history variable', source:'community', simple:'Rare', advanced:'Angle couverture', counterRead:'Fake shot' },
    { name:'Passement aérien manuel', category:'defense', diff:'Moyen', eff:73, tier:'B', input:'△ (clear)', timing:'Sous pression', context:'Surface', error:'Mauvais angle', risk:'Moyen', reward:'Moyen', when:'Corner déf', why:'Sortie danger', against:'Tall ST', chain:'Jockey→clear', zone:'PA', profile:'CB aerial', patch:'Stable', source:'community', simple:'Clear direction', advanced:'Direction touche', counterRead:'Recycle 2e ball' },
    { name:'R1 + passe 1-2', category:'passe', diff:'Facile', eff:85, tier:'A', input:'R1+×', timing:'Avant réception', context:'Demi-lune', error:'Mauvais angle', risk:'Faible', reward:'Élevé', when:'ST dos', why:'Fixe déf', against:'Low depth', chain:'R1×→through', zone:'18m', profile:'ST technique', patch:'Stable', source:'community', simple:'Wall pass', advanced:'Third-man', counterRead:'CDM track' },
    { name:'Driven pass (R1+R1)', category:'passe', diff:'Moyen', eff:80, tier:'A', input:'R1+R1+×', timing:'Couloir serré', context:'Pressing', error:'Interception', risk:'Moyen', reward:'Percée', when:'Aile', why:'Vitesse balle', against:'Dense', chain:'Driven→1-2', zone:'Flanc', profile:'Vision', patch:'Stable', source:'community', simple:'R1R1×', advanced:'Receiver open side', counterRead:'Intercep lane read' }
  ],
  PATCHES: [
    { version:'v1.5.3', date:'2026', channel:'EA Forums', summary:'Correctifs UT/Career + GK anti temps (rare).', changes:[{ type:'neutral', text:'GK : sortie touche si passes spam au gardien.'},{ type:'buff', text:'UT : recherche kits/badges ; previews célébrations.'},{ type:'neutral', text:'Career/UI/stabilité.'}], metaImpact:'Mineur compétitif global.', bascule:'Faible', sourceUrl:'https://forums.ea.com/blog/ea-sports-fc-game-info-hub-en/ea-sports-fc%E2%84%A2-26--title-update-v1-5-3/13312649', sourceType:'official' },
    { version:'v1.5.0', date:'4 mars 2026', channel:'ea.com', summary:'PlayStyles passes/tirs vs stats de base ; passes sol ; lofted ; power/chip ; tiki ; inventive ; skills +5%.', changes:[{ type:'buff', text:'Passes sol précision/vitesse (haut passing).'},{ type:'buff', text:'Through courbe sans Incisive si hauts short/long/curve.'},{ type:'nerf', text:'Lofted double tap moins précis.'},{ type:'buff', text:'Power shot traj + précision PS+.'},{ type:'buff', text:'Chip + précision ; bonus Chip PS.'},{ type:'nerf', text:'Tiki Taka passes sol/first time (reste buff global).'},{ type:'neutral', text:'Inventive loft compens partiel.'},{ type:'buff', text:'Fake shot / heel chop / feint +5% vitesse.'}], metaImpact:'Valorisation stats de base passe/tir.', bascule:'Moyenne', sourceUrl:'https://www.ea.com/games/ea-sports-fc/fc-26/news/pitch-notes-fc26-title-update-1-5-0', sourceType:'official' },
    { version:'TEMPLATE_POST_PATCH', date:'À remplir', channel:'ea.com ou Forums', summary:'Copier-coller résumé EA après lecture.', changes:[{ type:'neutral', text:'Lister changements officiels un par un.'}], metaImpact:'À compléter après analyse.', bascule:'?', sourceUrl:'https://www.ea.com/games/ea-sports-fc/fc-26/news', sourceType:'unconfirmed' }
  ],
  SBC_DATA: [
    { name:'Pack rare joueurs (exemple)', cat:'Promo', cost:50000, reward:52000, utilMeta:.25, utilClub:.45, liq:.55, deadline:.7, renta:'neutral', reco:'Neutre — maj prix', tag:'neutre' },
    { name:'DCE évolution 84 (exemple)', cat:'Evolution', cost:150000, reward:320000, utilMeta:.75, utilClub:.85, liq:.55, deadline:.5, renta:'profitable', reco:'Fort si carte eligible meta', tag:'rentable' },
    { name:'Pick Icône mid (exemple)', cat:'Icon', cost:350000, reward:420000, utilMeta:.55, utilClub:.35, liq:.4, deadline:.6, renta:'neutral', reco:'Variance haute', tag:'neutre' },
    { name:'SBC League segment (exemple)', cat:'League', cost:30000, reward:28000, utilMeta:.15, utilClub:.7, liq:.35, deadline:.8, renta:'avoid', reco:'Fodder sink si pas besoin', tag:'faible' },
    { name:'Foundation starter (exemple)', cat:'Foundation', cost:5000, reward:18000, utilMeta:.1, utilClub:.9, liq:.7, deadline:1, renta:'profitable', reco:'Toujours rentable début', tag:'rentable' },
    { name:'Flashback premium (exemple)', cat:'Promo', cost:600000, reward:520000, utilMeta:.45, utilClub:.5, liq:.3, deadline:.4, renta:'avoid', reco:'Coût > reward attendu', tag:'faible' },
    { name:'Showdown +1 (exemple)', cat:'Promo', cost:200000, reward:240000, utilMeta:.5, utilClub:.55, liq:.45, deadline:.55, renta:'neutral', reco:'Dépend issue match', tag:'neutre' },
    { name:'Upgrade 82-88 (exemple)', cat:'Upgrade', cost:12000, reward:22000, utilMeta:.2, utilClub:.75, liq:.6, deadline:.9, renta:'profitable', reco:'Loterie mais EV+ souvent', tag:'rentable' },
    { name:'Hero pick (exemple)', cat:'Promo', cost:450000, reward:400000, utilMeta:.5, utilClub:.4, liq:.35, deadline:.5, renta:'avoid', reco:'Risque variance', tag:'faible' },
    { name:'Daily upgrade bronze-silver', cat:'Foundation', cost:2000, reward:6000, utilMeta:.05, utilClub:.95, liq:.8, deadline:1, renta:'profitable', reco:'Recycler bronze', tag:'rentable' },
    { name:'SBC collectif TOTW (exemple)', cat:'Promo', cost:180000, reward:200000, utilMeta:.35, utilClub:.5, liq:.5, deadline:.65, renta:'neutral', reco:'Attendre TOTW fort', tag:'neutre' },
    { name:'Evo défenseur long (exemple)', cat:'Evolution', cost:220000, reward:380000, utilMeta:.65, utilClub:.8, liq:.45, deadline:.45, renta:'profitable', reco:'Si fullback/CB meta', tag:'rentable' }
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
    { name:'Styles chimie 3/6/9', zone:'UT', freq:'Permanent', status:'Launch', risk:'Stable', source:'official', note:'Moins burst pace global.' },
    { name:'Constant pressure stamina', zone:'Tactique', freq:'Communauté', status:'Déconseillé', risk:'Stable', source:'community', note:'Stamina drain vs after loss.' },
    { name:'Through vertical spam', zone:'Transitions', freq:'Très élevée', status:'Actif', risk:'Moyen', source:'community', note:'Dépend lecture ligne + patch passes.' },
    { name:'Width manipulation', zone:'Tactique', freq:'Élevée', status:'Actif', risk:'Faible', source:'community', note:'Instructions LM/RM.' },
    { name:'Manual switching', zone:'Défense', freq:'Compétitif', status:'Actif', risk:'Faible', source:'community', note:'Skill expression défensive.' },
    { name:'Cutback low crosses', zone:'Surface', freq:'Élevée', status:'Actif', risk:'Moyen', source:'community', note:'Contre bas-blocks.' },
    { name:'Kickoff glitch variants', zone:'Kickoff', freq:'Variable', status:'Suivi EA', risk:'Élevé', source:'community', note:'Peut être patché anytime.' },
    { name:'Ping system abuse', zone:'Coop', freq:'Faible', status:'N/A', risk:'Faible', source:'community', note:'Hors 1v1 rivals.' }
  ],
  META_TABLE: [
    { el:'Passes sol + vision', force:'S', stab:'Stable', nerf:'Faible', src:'official' },
    { el:'Through ball dos', force:'A', stab:'Stable', nerf:'Moyen', src:'community' },
    { el:'Lofted passes', force:'B', stab:'Patch-sensitive', nerf:'Élevé', src:'official' },
    { el:'PlayStyle passes global', force:'B', stab:'Patch-sensitive', nerf:'Moyen', src:'official' },
    { el:'Power shot + PS+', force:'A', stab:'Moyen', nerf:'Moyen', src:'official' },
    { el:'Skill chains longs', force:'B', stab:'Sensible', nerf:'Élevé', src:'community' },
    { el:'Jockey défensif', force:'S', stab:'Stable', nerf:'Faible', src:'official' },
    { el:'RL GK', force:'A', stab:'Stable', nerf:'Faible', src:'official' }
  ],
  CHEM_OFFICIAL: {
    headline:'EA Launch : styles 3/6/9, trade-offs pace, stats secondaires (Composure, Reactions, Stamina…).',
    bullets:['Modèle +3/+6/+9 au lieu de +4/+8/+12','Styles pace avec trade-offs','Diversité builds encouragée'],
    sourceUrl:'https://www.ea.com/games/ea-sports-fc/fc-26/news/pitch-notes-fc26-launch-update'
  },
  CHEM_PICKS: [
    { role:'ST burst', noChem:'Hawk / Hunter', withChem:'Hunter', conf:'community' },
    { role:'ST équilibré', noChem:'Hawk', withChem:'Hawk / Engine', conf:'community' },
    { role:'Ailier', noChem:'Engine', withChem:'Hunter', conf:'community' },
    { role:'CAM créateur', noChem:'Maestro', withChem:'Hunter / Engine', conf:'community' },
    { role:'CDM', noChem:'Shadow', withChem:'Anchor', conf:'community' },
    { role:'LB/RB déf', noChem:'Shadow', withChem:'Anchor', conf:'community' },
    { role:'CB', noChem:'Shadow', withChem:'Anchor', conf:'community' },
    { role:'GK', noChem:'Glove', withChem:'Basic / Cat', conf:'community' }
  ],
  SETTINGS: {
    balanced:{ label:'Équilibré', desc:'Référence polyvalente Rivals/Champs.', groups:[
      { title:'Tactique (ingame)', items:[
        { label:'Style défensif', val:'Press après perte', note:'Moins coûteux que constant' },
        { label:'Profondeur', val:'50–55', note:'Compromis ligne' },
        { label:'Largeur déf.', val:'45–50', note:'Compact' },
        { label:'Build-up', val:'Équilibré', note:'Sécurité' },
        { label:'Opportunités', val:'Direct', note:'Mouvements IA' },
        { label:'Largeur att.', val:'50', note:'Équilibre' },
        { label:'Joueurs dans la surface', val:'3', note:'HJ' }
      ]},
      { title:'Manette', items:[
        { label:'Changement joueur', val:'Manuel', note:'Ou assisted court' },
        { label:'Passes', val:'Semi / assisté selon niveau', note:'Contrôle direction' },
        { label:'Tirs', val:'Assisté / semi', note:'Régularité' },
        { label:'Caméra', val:'Co-op / Télé', note:'Vision' }
      ]}
    ]},
    aggressive:{ label:'Agressif', desc:'Pressing haut + transitions.', groups:[{ title:'Tactique', items:[
      { label:'Profondeur', val:'60–68', note:'Ligne haute' },
      { label:'Press', val:'After loss + overloads', note:'Stamina' },
      { label:'Largeur att.', val:'58–65', note:'Étirement' }
    ]}]},
    technical:{ label:'Technique', desc:'Possession + demi-espaces.', groups:[{ title:'Tactique', items:[
      { label:'Build-up', val:'Lent → équilibré', note:'Attirer press' },
      { label:'Profondeur', val:'45–52', note:'Sécurité dos' },
      { label:'Passes', val:'Privilégier sol', note:'Aligné v1.5.0' }
    ]}]},
    control:{ label:'Contrôle', desc:'Réduction variance.', groups:[{ title:'Tactique', items:[
      { label:'Profondeur', val:'44–50', note:'Moins d’1v1 dos' },
      { label:'Densité', val:'CMs bas', note:'Couverture' }
    ]}]},
    pressing:{ label:'Pressing', desc:'D-pad situationnel.', groups:[{ title:'Tactique', items:[
      { label:'Style', val:'After possession loss', note:'Éviter constant' },
      { label:'Stamina', val:'Milieux 80+', note:'Rotation bench' }
    ]}]},
    defensive:{ label:'Défensif', desc:'Bloc + contres.', groups:[{ title:'Tactique', items:[
      { label:'Profondeur', val:'38–45', note:'Bloc bas' },
      { label:'Joueurs surface', val:'2', note:'Transitions' }
    ]}]}
  }
};
