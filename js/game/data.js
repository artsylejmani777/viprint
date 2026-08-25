/* ============================================================
   VI-PRINT: PRINT MASTER — Katalogu i prodhimit + porositë
   ------------------------------------------------------------
   SHËNIM: Klientët, vlerat e porosive dhe kostot janë FIKTIVE,
   pjesë e simulimit të lojës. Teknikat e prodhimit (offset,
   digjital, folie e nxehtë, embosim/debosim, llak parcial UV,
   plastifikim matt/gloss/soft touch, shtancim, palosje, lidhje,
   shtyp fluoreshent, teksturë) janë ato që VI-Print paraqet si
   kapacitete të vetat në vi-print.com.
   ============================================================ */
window.PM = window.PM || {};

/* ---------------- FORMATET (sipas tipit të produktit) ---------------- */
PM.FORMATS = {
  card: [
    { id: 'c85', label: 'Small',  spec: '85 × 55 mm' },
    { id: 'c90', label: 'Medium', spec: '90 × 50 mm' },
    { id: 'c80', label: 'Large',  spec: '80 × 50 mm' },
    { id: 'ccu', label: 'Custom', spec: 'Sipas kërkesës' }
  ],
  flyer: [
    { id: 'fa6', label: 'Small',  spec: 'A6 — 105 × 148 mm' },
    { id: 'fa5', label: 'Medium', spec: 'A5 — 148 × 210 mm' },
    { id: 'fa4', label: 'Large',  spec: 'A4 — 210 × 297 mm' },
    { id: 'fdl', label: 'Custom', spec: 'DL — 99 × 210 mm' }
  ],
  box: [
    { id: 'bs', label: 'Small',  spec: '60 × 60 × 90 mm' },
    { id: 'bm', label: 'Medium', spec: '90 × 90 × 140 mm' },
    { id: 'bl', label: 'Large',  spec: '140 × 140 × 200 mm' },
    { id: 'bc', label: 'Custom', spec: 'Sipas kërkesës' }
  ],
  book: [
    { id: 'ka6', label: 'Small',  spec: 'A6 — 105 × 148 mm' },
    { id: 'ka5', label: 'Medium', spec: 'A5 — 148 × 210 mm' },
    { id: 'kb5', label: 'Large',  spec: 'B5 — 176 × 250 mm' },
    { id: 'kcu', label: 'Custom', spec: 'Sipas kërkesës' }
  ]
};

/* ---------------- MATERIALET ---------------- */
/* base = ngjyra e letrës, ink = ngjyra e paracaktuar e shtypit mbi të */
PM.MATERIALS = [
  { id: 'standard', label: 'Standard Card',        spec: '300 g/m² · i pashtresuar',
    base: '#E6E1D8', ink: '#16161C', tex: 'fiber',  cost: 180 },
  { id: 'coated',   label: 'Premium Coated Card',  spec: '350 g/m² · i shtresuar',
    base: '#F6F4F0', ink: '#101018', tex: 'smooth', cost: 320 },
  { id: 'kraft',    label: 'Kraft',                spec: '300 g/m² · i riciklueshëm',
    base: '#C09A6B', ink: '#3A2A18', tex: 'kraft',  cost: 150, eco: 2 },
  { id: 'blackboard', label: 'Luxury Black Board', spec: '400 g/m² · e zezë në masë',
    base: '#141419', ink: '#F2EDE2', tex: 'smooth', cost: 520 },
  { id: 'textured', label: 'Textured Board',       spec: '350 g/m² · e strukturuar',
    base: '#EDE6DA', ink: '#1A1A20', tex: 'linen',  cost: 400 }
];

/* ---------------- EFEKTET SPECIALE ---------------- */
PM.EFFECTS = [
  { id: 'foil-gold',   label: 'Gold Hot Foil',    kind: 'foil',    tone: 'gold',   cost: 260 },
  { id: 'foil-silver', label: 'Silver Hot Foil',  kind: 'foil',    tone: 'silver', cost: 240 },
  { id: 'foil-color',  label: 'Colored Hot Foil', kind: 'foil',    tone: 'color',  cost: 250 },
  { id: 'foil-holo',   label: 'Holographic Foil', kind: 'foil',    tone: 'holo',   cost: 300 },
  { id: 'emboss',      label: 'Emboss',           kind: 'relief',  tone: 'up',     cost: 210 },
  { id: 'deboss',      label: 'Deboss',           kind: 'relief',  tone: 'down',   cost: 200 },
  { id: 'varnish-spot',label: 'Spot Varnish',     kind: 'varnish', tone: 'spot',   cost: 170 },
  { id: 'varnish-uv',  label: 'UV Effect',        kind: 'varnish', tone: 'uv',     cost: 190 },
  { id: 'texture',     label: 'Texture',          kind: 'texture', tone: 'micro',  cost: 180 },
  { id: 'fluo',        label: 'Fluorescent Print',kind: 'ink',     tone: 'fluo',   cost: 220 }
];

/* ---------------- FINISHIMET (plastifikim / llak) ---------------- */
PM.FINISHES = [
  { id: 'soft',  label: 'Soft Touch Lamination', cost: 240 },
  { id: 'matte', label: 'Matte Lamination',      cost: 190 },
  { id: 'gloss', label: 'Gloss Lamination',      cost: 180 },
  { id: 'disp',  label: 'Dispersion Varnish',    cost: 120 }
];

/* ---------------- ZONAT E LLAKUT PARCIAL ---------------- */
PM.VARNISH_AREAS = [
  { id: 'logo',    label: 'Logo' },
  { id: 'name',    label: 'Product Name' },
  { id: 'pattern', label: 'Pattern' },
  { id: 'all',     label: 'Entire Surface' }
];

/* ---------------- INSERTET (assembly) ---------------- */
PM.INSERTS = [
  { id: 'product', label: 'Product insert',    cost: 60 },
  { id: 'bottle',  label: 'Bottle holder',     cost: 90 },
  { id: 'protect', label: 'Protective insert', cost: 70 },
  { id: 'info',    label: 'Information card',  cost: 30 },
  { id: 'promo',   label: 'Promotional card',  cost: 35 }
];

/* ---------------- PAKETIMI I DËRGESËS ---------------- */
PM.SHIPPING = [
  { id: 'standard', label: 'Standard', cost: 120, sat: 0,  eco: 0, note: 'Kuti transporti bazë' },
  { id: 'premium',  label: 'Premium',  cost: 320, sat: 8,  eco: -2, note: 'Mbrojtje + prezantim' },
  { id: 'eco',      label: 'Eco',      cost: 180, sat: 4,  eco: 10, note: 'Karton i riciklueshëm' }
];

/* ---------------- UPGRADE-T E FABRIKËS ---------------- */
PM.UPGRADES = [
  { id: 'printer', label: 'Faster Printer',        cost: 1800, desc: 'Zona e gjelbër e shtypit +45%' },
  { id: 'cutter',  label: 'Better Cutting Machine',cost: 1600, desc: 'Zona e prerjes +45%' },
  { id: 'foil',    label: 'Advanced Foil Machine', cost: 2200, desc: 'Toleranca e temperaturës +50%' },
  { id: 'emboss',  label: 'Faster Embossing',      cost: 1700, desc: 'Presa lëviz më butë, +2s' },
  { id: 'qc',      label: 'Better Quality Control',cost: 1500, desc: '+3s inspektim, defektet pulsojnë' },
  { id: 'capacity',label: 'Larger Capacity',       cost: 2600, desc: 'Të ardhurat e porosisë +12%' },
  { id: 'waste',   label: 'Reduced Material Waste',cost: 2000, desc: 'Mbeturinat −35%' },
  { id: 'fold',    label: 'Faster Folding',        cost: 1400, desc: 'Një hap palosjeje më pak' },
  { id: 'packing', label: 'Better Packaging',      cost: 1200, desc: 'Kënaqësia e klientit +6' }
];

/* ---------------- KLIENTËT (FIKTIVË) ---------------- */
PM.CLIENTS = {
  cosmetics: { name: 'Luxury Cosmetics', focus: 'Pamje premium',      accent: '#D9B45B' },
  fashion:   { name: 'Fashion Brand',    focus: 'Folie + teksturë',   accent: '#C5037F' },
  resto:     { name: 'Restaurant',       focus: 'Shpejtësi',          accent: '#E2673B' },
  publisher: { name: 'Publisher',        focus: 'Libra + lidhje',     accent: '#3E6DBF' },
  bakery:    { name: 'Bakery',           focus: 'Paketim',            accent: '#D98B3B' },
  corporate: { name: 'Corporate Client', focus: 'Precizion',          accent: '#5A6B7C' },
  vip:       { name: 'VIP Brand',        focus: 'Cilësi maksimale',   accent: '#E8D8A8' },
  studio:    { name: 'Design Studio',    focus: 'Detaje të pastra',   accent: '#4FA88B' }
};

/* ============================================================
   POROSITË / NIVELET
   pipeline = radha e fazave; artwork chips = elementet e dizajnit
   ============================================================ */
PM.LEVELS = [
  {
    id: 1, client: 'corporate', type: 'card',
    product: '1.000 Business Cards',
    style: 'White + Deep Blue', styleInk: '#1E3A6E',
    format: 'c85', material: 'coated',
    effects: [], finish: 'matte',
    inserts: [],
    deadline: 80, value: 480,
    pipeline: ['format', 'material', 'artwork', 'print', 'finish', 'diecut', 'pack', 'delivery'],
    brief: 'Vizitkarta klasike korporative. Precizion mbi të gjitha.'
  },
  {
    id: 2, client: 'resto', type: 'flyer',
    product: '5.000 Restaurant Flyers',
    style: 'Warm Red + Cream', styleInk: '#B7332B',
    format: 'fa5', material: 'standard',
    effects: [], finish: 'gloss',
    inserts: [],
    deadline: 80, value: 720,
    pipeline: ['format', 'material', 'print', 'finish', 'diecut', 'fold', 'pack', 'delivery'],
    brief: 'Fletushka për menynë e re. Shpejtësia është prioritet.'
  },
  {
    id: 3, client: 'studio', type: 'card',
    product: '500 Premium Business Cards',
    style: 'Black + Silver', styleInk: '#EDEDF2',
    format: 'c90', material: 'blackboard',
    effects: ['foil-silver'], finish: 'soft',
    inserts: [],
    deadline: 88, value: 1150,
    pipeline: ['format', 'material', 'artwork', 'print', 'effect', 'finish', 'foil', 'diecut', 'qc', 'pack', 'delivery'],
    brief: 'Vizitkarta premium: soft touch me folie argjendi.'
  },
  {
    id: 4, client: 'cosmetics', type: 'box',
    product: '500 Premium Packaging Boxes',
    style: 'Black + Gold', styleInk: '#EFE3C4',
    format: 'bm', material: 'blackboard',
    effects: ['foil-gold', 'emboss'], finish: 'soft',
    varnishAreas: ['logo'],
    inserts: ['bottle', 'info'],
    deadline: 105, value: 4850,
    pipeline: ['format', 'material', 'artwork', 'print', 'effect', 'foil', 'emboss', 'finish', 'varnish', 'diecut', 'fold', 'assembly', 'qc', 'pack', 'delivery'],
    brief: 'Paketim luksoz kozmetike. Folie ari + embosim + llak parcial.'
  },
  {
    id: 5, client: 'bakery', type: 'box',
    product: '800 Premium Cake Boxes',
    style: 'Cream + Warm Brown', styleInk: '#6B4423',
    format: 'bl', material: 'textured',
    effects: [], finish: 'matte',
    inserts: ['protect', 'promo'],
    deadline: 100, value: 2400,
    pipeline: ['format', 'material', 'print', 'finish', 'diecut', 'fold', 'assembly', 'qc', 'pack', 'delivery'],
    brief: 'Kuti torte me strukturë. Palosja duhet të mbajë peshën.'
  },
  {
    id: 6, client: 'fashion', type: 'box',
    product: '600 Fashion Gift Boxes',
    style: 'Magenta + Holographic', styleInk: '#F4E9F2',
    format: 'bm', material: 'coated',
    effects: ['foil-holo', 'emboss', 'texture'], finish: 'matte',
    varnishAreas: ['pattern'],
    inserts: ['protect'],
    deadline: 108, value: 3900,
    pipeline: ['format', 'material', 'artwork', 'print', 'effect', 'foil', 'emboss', 'finish', 'varnish', 'diecut', 'fold', 'qc', 'pack', 'delivery'],
    brief: 'Folie holografike + embosim + teksturë. Guximtare, e pastër.'
  },
  {
    id: 7, client: 'publisher', type: 'book',
    product: '2.000 Hardcover Books',
    style: 'Deep Blue + Gold', styleInk: '#E8D8A8',
    format: 'ka5', material: 'coated',
    effects: ['foil-gold', 'deboss'], finish: 'matte',
    inserts: [],
    deadline: 112, value: 5600,
    pipeline: ['format', 'material', 'artwork', 'print', 'effect', 'foil', 'emboss', 'finish', 'bind', 'diecut', 'qc', 'pack', 'delivery'],
    brief: 'Kopertinë e fortë, folie ari, debosim, lidhje dhe prerje.'
  },
  {
    id: 8, client: 'vip', type: 'box',
    product: '300 VIP Corporate Sets',
    style: 'Black + Gold + Fluo', styleInk: '#F6EFDC',
    format: 'bl', material: 'blackboard',
    effects: ['foil-gold', 'emboss', 'varnish-spot', 'fluo'], finish: 'soft',
    varnishAreas: ['logo', 'name'],
    inserts: ['product', 'info', 'promo'],
    deadline: 125, value: 8900,
    pipeline: ['format', 'material', 'artwork', 'print', 'effect', 'foil', 'emboss', 'finish', 'varnish', 'diecut', 'fold', 'assembly', 'qc', 'pack', 'delivery'],
    brief: 'Porosia më e kërkuar: çdo teknikë e VI-Print në një produkt.'
  }
];

/* ---------------- DEFEKTET (Quality Control) ---------------- */
PM.DEFECTS = [
  { id: 'logo',    label: 'Misaligned logo' },
  { id: 'foil',    label: 'Missing foil' },
  { id: 'scratch', label: 'Scratched surface' },
  { id: 'color',   label: 'Incorrect color' },
  { id: 'emboss',  label: 'Bad emboss' },
  { id: 'cut',     label: 'Cutting error' },
  { id: 'fold',    label: 'Folding error' },
  { id: 'insert',  label: 'Missing insert' },
  { id: 'varnish', label: 'Uneven varnish' }
];

/* ---------------- EVENTET E PAPRITURA (nivelet 4+) ---------------- */
PM.EVENTS = [
  { id: 'jam',   label: 'MACHINE JAM',           action: 'CLEAR JAM',   hint: 'Bllokim letre — liroje makinën!' },
  { id: 'ink',   label: 'INK LOW',               action: 'REFILL INK',  hint: 'Bojë e ulët — plotësoje!' },
  { id: 'foil',  label: 'FOIL MISALIGNMENT',     action: 'REALIGN',     hint: 'Folia u shmang — rreshtoje!' },
  { id: 'paper', label: 'PAPER ERROR',           action: 'RELOAD',      hint: 'Gabim letre — ringarko!' },
  { id: 'rush',  label: 'URGENT CUSTOMER REQUEST', action: 'ACCEPT',    hint: 'Kërkesë urgjente — prano!' }
];

/* ---------------- Emrat e fazave ---------------- */
PM.STAGE_META = {
  format:   { n: 'Format',          al: 'Zgjidh formatin e kërkuar' },
  material: { n: 'Material',        al: 'Zgjidh materialin e kërkuar' },
  artwork:  { n: 'Artwork',         al: 'Vendos elementet në pozicion' },
  print:    { n: 'Printing',        al: 'Rregullo bojën, presionin dhe ndalo në gjelbër' },
  effect:   { n: 'Special Effect',  al: 'Zgjidh saktësisht efektet e porosisë' },
  foil:     { n: 'Hot Foil',        al: 'Temperatura, pozicioni dhe presa' },
  emboss:   { n: 'Emboss',          al: 'Rreshto pllakën, kyçe dhe presoje' },
  finish:   { n: 'Finish',          al: 'Zgjidh plastifikimin e kërkuar' },
  varnish:  { n: 'Spot Varnish',    al: 'Shëno zonat për llak parcial' },
  diecut:   { n: 'Die Cutting',     al: 'Ndalo prerjen brenda zonës së gjelbër' },
  fold:     { n: 'Creasing & Folding', al: 'Palosje → palosje → presë → kyç' },
  bind:     { n: 'Binding',         al: 'Rreshto blokun dhe lidhe' },
  assembly: { n: 'Assembly',        al: 'Vendos insertet brenda paketimit' },
  qc:       { n: 'Quality Control', al: 'Gjej defektet para se të kalojë koha' },
  pack:     { n: 'Pack the Order',  al: 'Zgjidh paketimin e transportit' },
  delivery: { n: 'Delivery',        al: 'Dorëzoje porosinë' }
};
