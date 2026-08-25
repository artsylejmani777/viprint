/**
 * Shërbimet e ViPrint.
 * BURIMI: vi-print.com — seksionet "Shërbimet tona", "Efekte speciale të printimit",
 * "Makineria e sofistikuar" dhe katalogu i produkteve.
 */

/* Namespace global — funksionon si nga file:// (double-click) ashtu edhe nga server. */
window.VP = window.VP || {};

VP.services = [
  {
    id: 'offset',
    title: 'Offset Printing',
    titleAl: 'Shtyp Offset',
    lead: 'Shtyp komercial ofset me ngjyrë të plotë, deri në formatin B1 (100×70 cm).',
    text: 'Ne jemi të specializuar në shtypin offset që mbulon të gjitha nevojat tuaja — prej punëve më të thjeshta dhe dyngjyrëshe deri te shtypja ofset e sofistikuar, komerciale dhe me ngjyrë të plotë.',
    meta: 'B1 100×70 cm · 5 ngjyra',
    img: 'assets/img/factory/press-hall.webp'
  },
  {
    id: 'digital',
    title: 'Digital Printing',
    titleAl: 'Shtyp Digjital',
    lead: 'Shërbime të shtypjes digjitale për tirazhe të vogla dhe afate të shkurtra.',
    text: 'Ne jemi të specializuar në shtypin offset dhe në shërbimet e shtypjes digjitale të cilat i mbulojnë të gjitha nevojat tuaja.',
    meta: 'Tirazhe të vogla · Afate të shkurtra',
    img: 'assets/img/factory/commercial.webp'
  },
  {
    id: 'packaging',
    title: 'Packaging',
    titleAl: 'Paketime',
    lead: 'Kuti, ambalazhe dhe paketime sipas kërkesës — nga gastronomia deri te kozmetika.',
    text: 'Në maj 2017 ViPrint inauguroi linjën e re të paketimeve industriale. Mund të keni një sërë mundësish për ndryshime në madhësinë, ngjyrën, dizajnin, modelin ose formën e kutisë.',
    meta: '9 tipe paketimi në katalog',
    img: 'assets/img/products/product-51.webp'
  },
  {
    id: 'labels',
    title: 'Labels',
    titleAl: 'Etiketa',
    lead: 'Etiketa vetngjitëse që i shtojnë vlerë produktit tuaj.',
    text: 'Etiketa ngjitëse është detaji që ia shton vlerën produktit tënd — e prodhuar me materiale dhe finalizim që i përshtatet ambalazhit tuaj.',
    meta: 'Vetngjitëse · Sipas formës',
    img: 'assets/img/effects/stickers-1.webp'
  },
  {
    id: 'books',
    title: 'Books',
    titleAl: 'Libra & Revista',
    lead: 'Libra, revista, katalogë dhe broshura me çdo lloj lidhjeje.',
    text: 'Lidhje e fortë, lidhje me ngjitës, lidhje me penjë, lidhje me tel dhe spirale — për libra, revista, katalogë, doracakë dhe agjenda.',
    meta: '20 produkte në katalog',
    img: 'assets/img/products/product-39.webp'
  },
  {
    id: 'effects',
    title: 'Special Effects',
    titleAl: 'Efekte Speciale',
    lead: 'Embosim, folie e nxehtë, llak UV parcial dhe 3D reliev.',
    text: 'Viprint është kompania e parë në Kosovë që përdor makinën me llak të efekteve të llojllojshme speciale dhe makinën e printimit me 3D reliev, me folie të artë e argjendtë.',
    meta: '12 efekte · E para në Kosovë',
    img: 'assets/img/effects/gold-varnish.webp'
  },
  {
    id: 'finishing',
    title: 'Finishing',
    titleAl: 'Finalizim',
    lead: 'Plastifikim, shtancim, palosje, qepje dhe lidhje — nën një kulm.',
    text: 'Dëshironi të gjitha shërbimet në një vend? Pikërisht këtë e ofrojmë: filmimin, shtypjen, efektet speciale, plastifikimin, shtancimin, etj. Të gjitha i gjeni në VI Print.',
    meta: 'Matt · Gloss · Soft touch',
    img: 'assets/img/effects/varnish-emboss.webp'
  }
];

/**
 * Procesi i prodhimit — hapat e kërkuar, të përshkruar me kapacitete reale të ViPrint.
 */
VP.processSteps = [
  {
    n: '01',
    id: 'design',
    title: 'Design',
    titleAl: 'Dizajni & Përgatitja',
    text: 'Projekti nis me dizajnin dhe përgatitjen për shtyp. Filmimi dhe përgatitja e pllakave bëhet në shtëpi me sistemin Cron-Kodak, ashtu që ajo që aprovoni është ajo që shtypet.',
    meta: 'Cron-Kodak · CtP',
    img: 'assets/img/factory/floor-1.webp'
  },
  {
    n: '02',
    id: 'printing',
    title: 'Printing',
    titleAl: 'Shtypi',
    text: 'Shtypi ofset me pesë ngjyra në format B1 (100×70 cm) me Man Roland 705, e futur në përdorim në dhjetor 2016, plus makineri B2 dhe shtyp digjital për tirazhe të vogla.',
    meta: 'Man Roland 705 · B1',
    img: 'assets/img/factory/paper-feed.webp'
  },
  {
    n: '03',
    id: 'finishing',
    title: 'Finishing',
    titleAl: 'Finalizimi & Efektet',
    text: 'Embosim dhe debosim, folie e nxehtë ari, argjend dhe hologram, llak UV parcial dhe glitter, plastifikim matt, gloss e soft touch, shtancim dhe palosje.',
    meta: '12 efekte speciale',
    img: 'assets/img/effects/foil-emboss.webp'
  },
  {
    n: '04',
    id: 'quality',
    title: 'Quality Control',
    titleAl: 'Kontrolli i Cilësisë',
    text: 'Nga prilli 2021, ViPrint është kompania e parë në Kosovë, Shqipëri dhe Maqedoni të Veriut e certifikuar nga FOGRA — standardi ndërkombëtar për saktësinë e ngjyrës në shtyp.',
    meta: 'FOGRA · Nga 2021',
    img: 'assets/img/factory/floor-3.webp'
  },
  {
    n: '05',
    id: 'packaging',
    title: 'Packaging',
    titleAl: 'Paketimi',
    text: 'Produkti i përfunduar paketohet për transport të sigurt. Linja e paketimeve industriale, e inauguruar në maj 2017, mbulon nga kutitë e vogla deri te ambalazhet industriale.',
    meta: 'Linjë industriale · 2017',
    img: 'assets/img/factory/warehouse.webp'
  },
  {
    n: '06',
    id: 'delivery',
    title: 'Delivery',
    titleAl: 'Liferimi',
    text: 'Ne e çmojmë kohën tuaj duke i ofruar biznesit tuaj volinë e marrjes së porosisë dhe të dërgesës. Përkundër kërkesave urgjente, liferimet bëhen në kohën e duhur.',
    meta: 'Kosovë & rajon',
    img: 'assets/img/factory/hall-2.webp'
  }
];
