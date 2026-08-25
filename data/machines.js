/**
 * Makineritë e ViPrint.
 * BURIMI: vi-print.com — seksioni "Përparësitë Teknologjike që posedojmë / Makineria e sofistikuar".
 * Emrat dhe llojet janë fjalë për fjalë sipas listës zyrtare.
 *
 * SHËNIM MBI FOTOGRAFITË: faqja zyrtare ka 12 fotografi të repartit (machinery-01..12),
 * por ato NUK janë të etiketuara me emrin e makinës. Për këtë arsye ato paraqiten si
 * galeri e repartit të prodhimit (shih `machineHall`) dhe NUK u caktohen makinave
 * individuale — për të mos pretenduar diçka të paverifikuar.
 */

/* Namespace global — funksionon si nga file:// (double-click) ashtu edhe nga server. */
window.VP = window.VP || {};

VP.machineIntro = 'Pasja e makinerisë më moderne të printimit i jep Viprint përparësinë ndaj konkurrentëve të cilën klienti do ta përjetojë pasi të përdorë produktin. Makineria e Viprint mbulon tërësisht ecurinë e printimit duke nisur nga elementet themelore deri te efektet speciale përmbyllëse.';

VP.machines = [
  {
    name: 'Man Roland 705',
    type: 'Makinë B1 Ofset pesë-ngjyrëshe',
    spec: 'Format B1 — 100 × 70 cm',
    note: 'Futur në përdorim në dhjetor 2016. Makina kryesore e shtypit ofset me ngjyrë të plotë.',
    tag: 'Shtyp',
    highlight: true
  },
  {
    name: 'Man Roland 305',
    type: 'Makinë B2 Ofset pesë-ngjyrëshe',
    spec: 'Format B2 · 5 ngjyra',
    note: 'Shtyp ofset me pesë ngjyra për formate të mesme.',
    tag: 'Shtyp'
  },
  {
    name: 'Man Miller TP4',
    type: 'Makinë Ofset dy-ngjyrëshe',
    spec: '2 ngjyra',
    note: 'Shtyp ofset dy-ngjyrësh për punë komerciale.',
    tag: 'Shtyp'
  },
  {
    name: 'Man Roland 201',
    type: 'Makinë Ofset një-ngjyrëshe',
    spec: '1 ngjyrë',
    note: 'Shtyp ofset një-ngjyrësh.',
    tag: 'Shtyp'
  },
  {
    name: 'Heidelberg GTO',
    type: 'Makinë Ofset një-ngjyrëshe',
    spec: '1 ngjyrë',
    note: 'Shtyp ofset një-ngjyrësh.',
    tag: 'Shtyp'
  },
  {
    name: 'Cron-Kodak',
    type: 'Makinë për pllaka',
    spec: 'Përgatitje pllakash (CtP)',
    note: 'Filmimi dhe përgatitja e pllakave bëhet brenda kompanisë.',
    tag: 'Përgatitje'
  },
  {
    name: 'MBO 66',
    type: 'Makinë për palosjen e letrës',
    spec: 'Palosje',
    note: 'Palosje e letrës për fletushka, fletëpalosje dhe broshura.',
    tag: 'Finalizim'
  },
  {
    name: 'MBO 54',
    type: 'Makinë për palosjen e letrës',
    spec: 'Palosje',
    note: 'Makina e dytë e palosjes për kapacitet paralel.',
    tag: 'Finalizim'
  },
  {
    name: 'Miller Martin',
    type: 'Makinë për qepje dhe prerje të letrës',
    spec: 'Qepje · Prerje',
    note: 'Qepje dhe prerje për revista, broshura dhe katalogë.',
    tag: 'Finalizim'
  },
  {
    name: 'Heidelberg ST300',
    type: 'Makinë për qepje dhe prerje të letrës',
    spec: 'Qepje · Prerje',
    note: 'Qepje dhe prerje me kapacitet të lartë.',
    tag: 'Finalizim'
  },
  {
    name: 'Horizon',
    type: 'Makinë për lidhjen e librave',
    spec: 'Lidhje librash',
    note: 'Lidhje për libra, katalogë dhe doracakë.',
    tag: 'Lidhje'
  }
];

/** Fjalë për fjalë nga faqja zyrtare, pas listës së makinerive. */
VP.machineFooter = '…dhe një mori aparaturash të tjera.';

/** Dallimet teknologjike — tekst zyrtar. */
VP.machineFirsts = [
  'Kompania e parë në Kosovë që përdor makinën me llak të efekteve të llojllojshme speciale.',
  'Kompania e parë në Kosovë që përdor makinën e printimit me 3D reliev, me folie të artë e argjendtë.',
  'Kompania e parë në Kosovë, Shqipëri dhe Maqedoni të Veriut e certifikuar nga FOGRA (prill 2021).'
];

/** Galeria e repartit të prodhimit — fotografi reale nga faqja zyrtare (pa etiketim makinash). */
VP.machineHall = Array.from({ length: 12 }, (_, i) => {
  const n = String(i + 1).padStart(2, '0');
  return { img: `assets/img/machines/m${n}.webp`, alt: `Reparti i prodhimit të ViPrint — pamje ${i + 1}` };
});
