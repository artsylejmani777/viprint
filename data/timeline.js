/**
 * Historiku i ViPrint — vetëm data të verifikueshme.
 * BURIMI: vi-print.com (teksti zyrtar "Për Ne" / "Makineria e sofistikuar")
 *         + arkiva e lajmeve zyrtare (WP REST API, kategoria "Lajme") me data reale publikimi.
 * Asnjë vit apo arritje nuk është e shpikur.
 */

/* Namespace global — funksionon si nga file:// (double-click) ashtu edhe nga server. */
window.VP = window.VP || {};

VP.timeline = [
  {
    year: '1981',
    date: '1981',
    title: 'Fillimi i përvojës në industrinë e shtypit',
    text: 'Përvoja e gjatë e ViPrint në fushën e shtypit nis nga viti 1981 — baza mbi të cilën ndërtohet çdo gjë që vjen më pas.',
    tag: 'Origjina'
  },
  {
    year: '2016',
    date: 'Shtator 2016',
    title: 'Viprint shpërblehet me çmimin “Superbrands”',
    text: 'Njohja e brendit ViPrint me çmimin ndërkombëtar Superbrands.',
    tag: 'Çmim',
    img: 'assets/img/news/superbrands.webp'
  },
  {
    year: '2016',
    date: 'Dhjetor 2016',
    title: 'Man Roland 705 — formati B1 futet në përdorim',
    text: 'ViPrint futi në përdorim makinën e formatit B1 (100×70 cm) të shtypit ofset, të kompanisë gjermane Man Roland, si dhe makina të tjera për përpunimin e letrës dhe kartonit.',
    tag: 'Investim'
  },
  {
    year: '2017',
    date: 'Prill 2017',
    title: 'Vizitë e Odës Amerikane në Kosovë',
    text: 'Drejtori ekzekutiv i Odës Amerikane në Kosovë vizitoi ViPrint.',
    tag: 'Vizitë',
    img: 'assets/img/news/amcham.webp'
  },
  {
    year: '2017',
    date: 'Maj 2017',
    title: 'Linja e re e paketimeve industriale',
    text: 'ViPrint inauguroi linjën e re të paketimeve industriale, duke zgjeruar kapacitetin për ambalazhe.',
    tag: 'Zgjerim',
    img: 'assets/img/news/packaging-line.webp'
  },
  {
    year: '2017',
    date: 'Gusht 2017',
    title: 'Vizitë e KFOR-it Zviceran',
    text: 'Pjesëtarë të KFOR-it Zviceran vizituan repartin e prodhimit të ViPrint.',
    tag: 'Vizitë',
    img: 'assets/img/news/kfor.webp'
  },
  {
    year: '2017',
    date: 'Nëntor 2017',
    title: 'Fletore për fëmijët jetimë',
    text: 'ViPrint dhuroi fletore për fëmijët jetimë — përgjegjësi sociale si pjesë e punës së kompanisë.',
    tag: 'Komunitet',
    img: 'assets/img/news/donation.webp'
  },
  {
    year: '2021',
    date: 'Prill 2021',
    title: 'Certifikim FOGRA — i pari në tre vende',
    text: 'ViPrint u certifikua nga FOGRA si kompania e parë në Kosovë, Shqipëri dhe Maqedoni të Veriut — standardi ndërkombëtar për saktësi të ngjyrës dhe kontroll të cilësisë në shtyp.',
    tag: 'Certifikim',
    highlight: true
  },
  {
    year: '2021',
    date: 'Korrik 2021',
    title: 'SUPERBRANDS edhe këtë vit',
    text: 'ViPrint konfirmohet përsëri si pjesë e SUPERBRANDS.',
    tag: 'Çmim'
  }
];
