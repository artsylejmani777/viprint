/* ============================================================
   VI-PRINT: PRINT MASTER — v.2 (e thjeshtuar)
   ------------------------------------------------------------
   Zgjedh produktin → prodhoje në 4–6 hapa realë në makineri.
   Klientët, vlerat dhe kostot janë FIKTIVE (simulim).
   Teknikat (offset, digjital, folie, embosim, llak UV, shtancim,
   palosje, plastifikim) janë ato reale të VI-Print.
   ============================================================ */
window.PM = window.PM || {};

/* Buxheti fillestar i lojtarit (në euro) — ndryshoje këtu nëse duhet */
PM.START_MONEY = 20000;

/* ---------------- KLIENTËT ----------------
   Markat reale (logot zyrtare) + klientët fiktivë.
   prefers = cilat produkte porosisin zakonisht.
   Vlerat/kostot mbeten fiktive (simulim). */
PM.CLIENTS = {
  /* — Marka reale me logo — */
  bk:   { name: 'Burger King',  logo: 'assets/brands/burger-king.png', accent: '#D62300', focus: 'Paketim ushqimi të shpejtë', prefers: ['box', 'bag', 'flyer', 'label', 'promo'] },
  kfc:  { name: 'KFC',          logo: 'assets/brands/kfc.png',         accent: '#E4002B', focus: 'Paketim + fletushka',        prefers: ['box', 'bag', 'flyer', 'promo'] },
  mcd:  { name: "McDonald's",   logo: 'assets/brands/mcdonalds.png',   accent: '#FFC72C', focus: 'Qese e paketim',             prefers: ['box', 'bag', 'flyer', 'label'] },
  ph:   { name: 'Pizza Hut',    logo: 'assets/brands/pizzahut.png',    accent: '#EE3124', focus: 'Kuti pica + promovim',       prefers: ['box', 'flyer', 'promo', 'label'] },
  sub:  { name: 'Subway',       logo: 'assets/brands/subway.png',      accent: '#008C15', focus: 'Fletushka + menu',           prefers: ['flyer', 'promo', 'box', 'bag'] },
  /* — Klientët fiktivë — */
  studio:    { name: 'Design Studio',     focus: 'Detaje të pastra',  prefers: ['card', 'promo'] },
  cosmetics: { name: 'Luxury Cosmetics',  focus: 'Pamje premium',     prefers: ['box', 'label', 'promo'] },
  fashion:   { name: 'Fashion Brand',     focus: 'Folie + teksturë',  prefers: ['box', 'bag', 'label'] },
  resto:     { name: 'Restaurant',        focus: 'Shpejtësi',         prefers: ['flyer', 'box', 'bag', 'promo'] },
  bakery:    { name: 'Bakery',            focus: 'Paketim',           prefers: ['box', 'bag', 'label'] },
  corporate: { name: 'Corporate Client',  focus: 'Precizion',         prefers: ['card', 'promo', 'flyer'] },
  publisher: { name: 'Publisher',         focus: 'Libra + lidhje',    prefers: ['promo', 'flyer'] },
  vip:       { name: 'VIP Brand',         focus: 'Cilësi maksimale',  prefers: ['box', 'card', 'promo'] }
};

/* ---------------- MATERIALET ---------------- */
PM.MATERIALS = [
  { id: 'standard',   label: 'Karton standard',    spec: '300 g/m² · i pashtresuar', base: '#E6E1D8', ink: '#16161C', tex: 'fiber',  cost: 180 },
  { id: 'coated',     label: 'Karton i shtresuar', spec: '350 g/m² · i shtresuar',   base: '#F6F4F0', ink: '#101018', tex: 'smooth', cost: 320 },
  { id: 'kraft',      label: 'Kraft',              spec: '300 g/m² · i riciklueshëm', base: '#C09A6B', ink: '#3A2A18', tex: 'kraft',  cost: 150 },
  { id: 'blackboard', label: 'Karton i zi luksoz', spec: '400 g/m² · i zi në masë',   base: '#141419', ink: '#F2EDE2', tex: 'smooth', cost: 520 },
  { id: 'textured',   label: 'Karton me strukturë',spec: '350 g/m² · i strukturuar',  base: '#EDE6DA', ink: '#1A1A20', tex: 'linen',  cost: 400 }
];

/* ---------------- FINISHIMET (një hap i vetëm, shumë-zgjedhje) ---------------- */
PM.FINISH_OPTIONS = [
  { id: 'soft',        label: 'Soft Touch',          kind: 'lam',    cost: 240 },
  { id: 'matte',       label: 'Matte Lamination',    kind: 'lam',    cost: 190 },
  { id: 'gloss',       label: 'Gloss Lamination',    kind: 'lam',    cost: 180 },
  { id: 'foil-gold',   label: 'Gold Hot Foil',       kind: 'foil',   cost: 260 },
  { id: 'foil-silver', label: 'Silver Hot Foil',     kind: 'foil',   cost: 240 },
  { id: 'emboss',      label: 'Emboss (3D)',         kind: 'relief', cost: 210 },
  { id: 'uv',          label: 'Spot UV Varnish',     kind: 'varnish',cost: 170 }
];

/* referencat që përdor economy() */
PM.EFFECTS  = PM.FINISH_OPTIONS.filter(function (f) { return f.kind !== 'lam'; })
  .map(function (f) { return { id: f.id, label: f.label, cost: f.cost, kind: f.kind }; });
PM.FINISHES = PM.FINISH_OPTIONS.filter(function (f) { return f.kind === 'lam'; })
  .map(function (f) { return { id: f.id, label: f.label, cost: f.cost }; });

/* ---------------- LLOJET E PRODUKTIT (zgjedhja në menu) ---------------- */
PM.PRODUCT_TYPES = [
  { id: 'card',  label: 'Vizitkarta',             en: 'Business Cards',    icon: '🪪', visual: 'card',
    product: '500 Vizitkarta', materials: ['coated', 'blackboard', 'textured'],
    finishes: ['soft', 'matte', 'gloss', 'foil-gold', 'emboss', 'uv'],
    pipeline: ['material', 'print', 'finish', 'diecut', 'delivery'], value: [300, 600] },
  { id: 'flyer', label: 'Fletushka & Postera',    en: 'Flyers & Posters',  icon: '📄', visual: 'flyer',
    product: '2.000 Fletushka', materials: ['standard', 'coated', 'kraft'],
    finishes: ['gloss', 'matte', 'uv'],
    pipeline: ['material', 'print', 'finish', 'fold', 'delivery'], value: [350, 700] },
  { id: 'label', label: 'Etiketa',                en: 'Labels',            icon: '🏷️', visual: 'label',
    product: '5.000 Etiketa', materials: ['coated', 'standard'],
    finishes: ['gloss', 'matte', 'uv'],
    pipeline: ['material', 'print', 'diecut', 'finish', 'delivery'], value: [280, 560] },
  { id: 'box',   label: 'Paketime',               en: 'Packaging',         icon: '📦', visual: 'box',
    product: '500 Kuti', materials: ['kraft', 'coated', 'blackboard', 'textured'],
    finishes: ['matte', 'gloss', 'soft', 'foil-gold', 'emboss', 'uv'],
    pipeline: ['material', 'print', 'finish', 'diecut', 'fold', 'delivery'], value: [600, 1200] },
  { id: 'bag',   label: 'Qese & Çanta',           en: 'Bags',              icon: '🛍️', visual: 'bag',
    product: '1.000 Qese letre', materials: ['kraft', 'coated', 'standard'],
    finishes: ['matte', 'gloss'],
    pipeline: ['material', 'print', 'fold', 'delivery'], value: [320, 640] },
  { id: 'promo', label: 'Materiale Promocionale', en: 'Promo Materials',   icon: '🎁', visual: 'promo',
    product: '1.000 Fletëpalosje', materials: ['coated', 'standard', 'textured'],
    finishes: ['matte', 'gloss', 'foil-gold', 'emboss'],
    pipeline: ['material', 'print', 'finish', 'diecut', 'delivery'], value: [400, 800] }
];

/* ---------------- UPGRADE-T ---------------- */
PM.UPGRADES = [
  { id: 'printer',  label: 'Printer më i shpejtë',       cost: 1500, desc: 'Zona e gjelbër e shtypit +45%' },
  { id: 'cutter',   label: 'Prerës më i mirë',           cost: 1400, desc: 'Zona e prerjes +45%' },
  { id: 'foil',     label: 'Makinë folie e avancuar',    cost: 1800, desc: 'Toleranca e folies +50%' },
  { id: 'waste',    label: 'Më pak mbeturina',           cost: 1600, desc: 'Mbeturinat −35%' },
  { id: 'capacity', label: 'Kapacitet më i madh',        cost: 2200, desc: 'Të ardhurat e porosisë +12%' },
  { id: 'packing',  label: 'Paketim më i mirë',          cost: 1100, desc: 'Kënaqësia e klientit +8' }
];

/* ---------------- Emrat e fazave ---------------- */
PM.STAGE_META = {
  material: { n: 'Material',    al: 'Zgjidh materialin e kërkuar' },
  print:    { n: 'Shtypi',      al: 'Rregullo makinën dhe ndalo në gjelbër' },
  finish:   { n: 'Finishimi',   al: 'Zgjidh saktësisht finishimet e porosisë' },
  diecut:   { n: 'Prerja',      al: 'Ndalo prerjen brenda zonës së gjelbër' },
  fold:     { n: 'Palosja',     al: 'Ndiq radhën e palosjes' },
  delivery: { n: 'Dorëzimi',    al: 'Dorëzoje porosinë e përfunduar' }
};

/* ---------------- Gjenerimi i porosisë ---------------- */
function rndInt(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function pickN(arr, n) {
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
  return a.slice(0, n);
}
function byId(list, id) { for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; }
PM._byId = byId;

PM.makeOrder = function (typeId) {
  var t = byId(PM.PRODUCT_TYPES, typeId);
  /* klientët që e porosisin zakonisht këtë produkt; ndryshe: cilido */
  var keys = Object.keys(PM.CLIENTS);
  var pool = keys.filter(function (k) {
    return PM.CLIENTS[k].prefers && PM.CLIENTS[k].prefers.indexOf(t.id) !== -1;
  });
  if (!pool.length) pool = keys;
  var client = pick(pool);
  var material = pick(t.materials);
  var nFin = Math.random() < 0.5 ? 1 : 2;
  var finishes = pickN(t.finishes, Math.min(nFin, t.finishes.length));
  var mat = byId(PM.MATERIALS, material);
  var style = mat.label.split(' ')[0] + ' + ' + finishes.map(function (id) {
    return byId(PM.FINISH_OPTIONS, id).label;
  }).join(' + ');

  return {
    type: t.visual,
    typeId: t.id,
    product: t.product,
    style: style,
    styleInk: mat.ink,
    material: material,
    finishes: finishes,
    deadline: t.pipeline.length * 12 + 6,
    value: rndInt(t.value[0], t.value[1]),
    pipeline: t.pipeline,
    client: client
  };
};
