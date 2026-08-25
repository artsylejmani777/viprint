/**
 * Të dhënat e kompanisë ViPrint.
 * BURIMI: vi-print.com (versioni shqip + versioni anglisht + CMS-i zyrtar / WP REST API).
 * Asnjë informacion në këtë skedar nuk është i shpikur — çdo fushë ka origjinë në faqen zyrtare.
 */

/* Namespace global — funksionon si nga file:// (double-click) ashtu edhe nga server. */
window.VP = window.VP || {};

VP.company = {
  name: 'ViPrint',
  legalName: 'Viprint Printing House',
  tagline: 'From Ideas to Reality.',
  taglineAl: 'Nga idea, në realitet.',
  claim: 'Leader in innovation',
  claimAl: 'Lider në inovacion',
  since: 1981,
  // Fjalë për fjalë nga vi-print.com
  experienceQuote: 'Me mbi 21 vjet përvojë, me staf profesional, teknologji dhe softuer, ne jemi këtu për t\'ju ndihmuar për të gjitha nevojat tuaja.',
  contact: {
    address: 'Parku i Biznesit Mitrovica, Kosovë',
    addressShort: 'Parku i Biznesit, Mitrovicë',
    phone: '+383 48 350 159',
    phoneHref: '+38348350159',
    email: 'info@vi-print.com',
    site: 'vi-print.com',
    // Harta: Parku i Biznesit, Mitrovicë (OpenStreetMap embed, pa API key)
    mapEmbed: 'https://www.openstreetmap.org/export/embed.html?bbox=20.8300%2C42.8650%2C20.9100%2C42.9050&layer=mapnik&marker=42.8850%2C20.8700',
    mapLink: 'https://www.openstreetmap.org/search?query=Parku%20i%20Biznesit%20Mitrovica%20Kosovo'
  },
  brands: [
    { name: 'VI Print',     note: 'Shtypi komercial ofset dhe digjital' },
    { name: 'VI Books',     note: 'Libra, revista, katalogë dhe lidhje' },
    { name: 'VI Packs',     note: 'Paketime dhe ambalazhe' },
    { name: 'VI Exclusive', note: 'Efekte speciale dhe finalizim premium' }
  ],
  // Të dyja paragrafët janë tekst zyrtar i ViPrint (faqja "Për Ne")
  about: [
    'Viprint është biznes i orientuar nga shërbimi ndaj klientëve, që ofron shërbime të shtypjes për kompanitë private, shtetërore, publike, si dhe organizatat internacionale, të cilat veprojnë në Republikën e Kosovës dhe jashtë saj.',
    'Plani ynë është të zgjerojmë biznesin tonë duke ofruar kualitet të lartë, shpejtësi në punë dhe produkte të reja inovative për klientët tanë. Dhe sot, padyshim jemi shtypshkronja më inovative jo vetëm në Kosovë por edhe më gjerë.'
  ],
  leadershipQuote: {
    text: 'Industria e shtypit është duke hyrë në etapën e ardhshme të zhvillimit të saj. Kjo etapë është paracaktuar nga kërkesat e rritura botërore që kanë të bëjnë me produktet e shtypit me kualitet të lartë dhe origjinalitet. Përvoja jonë e gjatë nga viti 1981 në këtë fushë na ka treguar se ne gjithmonë duhet të mbajmë premtimin që të jemi një urë lidhëse në mes të klientëve tanë dhe teknologjisë së fundit të avancuar në fushën e shtypit.',
    author: 'Burbuqe Xhema',
    role: 'CEO'
  },
  stats: [
    { value: '1981', label: 'Përvoja në industri nga' },
    { value: '64',   label: 'Produkte në katalog' },
    { value: '11+',  label: 'Makineri prodhuese' },
    { value: 'FOGRA', label: 'E certifikuar' }
  ]
};

/** Arsyet — tekst zyrtar nga seksioni "Pse Viprint?" + "Përparësitë Teknologjike". */
VP.whyViprint = [
  {
    id: 'quality',
    title: 'Cilësi e shkëlqyeshme',
    en: 'Quality',
    text: 'VI Print zotëron njohurinë dhe përvojën për ta përfunduar projektin tuaj të shtypjes qysh në herën e parë dhe si duhet. Prej punëve më të thjeshta dhe dyngjyrëshe deri te shtypja ofset, e sofistikuar, komerciale dhe me ngjyrë të plotë, cilësia jonë është e jashtëzakonshme.'
  },
  {
    id: 'experience',
    title: 'Përvojë nga 1981',
    en: 'Experience',
    text: 'Përvoja e gjatë nga viti 1981 në industrinë e shtypit, me staf profesional, teknologji dhe softuer që mbulojnë të gjitha nevojat e klientëve në Kosovë dhe jashtë saj.'
  },
  {
    id: 'technology',
    title: 'Teknologji e sofistikuar',
    en: 'Technology',
    text: 'Viprint është kompania e parë në Kosovë që përdor makinën me llak të efekteve të llojllojshme speciale dhe makinën e printimit me 3D reliev, me folie të artë e argjendtë. Nga prilli 2021, kompania e parë në Kosovë, Shqipëri dhe Maqedoni të Veriut e certifikuar nga FOGRA.'
  },
  {
    id: 'reliability',
    title: 'Ekzekutim i besueshëm',
    en: 'Reliability',
    text: 'Ne i kushtojmë vëmendje të veçantë hollësive dhe punëve përcjellëse, duke ju komunikuar progresin apo vështirësitë që mund t\'i hasim drejt përmbushjes së afateve të caktuara nga ju. Ne besojmë në mbajtjen e premtimeve dhe i qëndrojmë besnikë punës sonë.'
  },
  {
    id: 'service',
    title: 'Shërbime të shpejta',
    en: 'Professional Service',
    text: 'Duke e kuptuar se sa të rëndësishme janë afatet për klientët tonë, ne nuk marrim përsipër punë, nëse nuk jemi të bindur se do t\'i përfundojmë në afatin e premtuar. Ne e çmojmë kohën tuaj duke i ofruar biznesit tuaj volinë e marrjes së porosisë dhe të dërgesës.'
  },
  {
    id: 'onestop',
    title: 'Të gjitha shërbimet në një vend',
    en: 'One-stop partner',
    text: 'Dëshironi të gjitha shërbimet në një vend? Pikërisht këtë e ofrojmë: filmimin, shtypjen, efektet speciale, plastifikimin, shtancimin, etj. Të gjitha i gjeni në VI Print.'
  }
];

/** Referenca klientësh — tekst zyrtar nga seksioni "Klientët tanë". */
VP.testimonials = [
  {
    text: 'Viprint ka treguar besnikëri dhe korrektësi për vazhdimësi gjatë 10 viteve të bashkëpunimit me VM3 Sh.p.k në shërbimet e shtypit ofset, plastifikimit, efektet speciale dhe paketime për produkte të ndryshme. Përkundër kërkesave tona urgjente, liferimet gjithmonë janë bërë në kohën e duhur.',
    author: 'Driton Abdullahu',
    role: 'VM3 — Drejtor Ekzekutiv'
  },
  {
    text: 'Bashkëpunimi ynë me Viprint ka filluar tash e 5 vite, ku së bashku kemi implementuar printimet më bashkëkohore dhe moderne. Në vitet në vijim, bashkëpunimi ynë është zgjeruar dhe kështu Viprint është bërë një ndër partnerët e ngushtë të kompanisë Meridian Express.',
    author: 'Besa Osmani',
    role: 'Meridian Express — Marketing'
  },
  {
    text: 'Gjatë këtyre viteve në partneritet me Viprint, ne kemi arritur të deportojmë në tregun rajonal si Shqipëri, Maqedoni, dhe tregun Europian me materiale dhe produkte të ndryshme. Kompaninë Viprint e rangojmë si kompani lidere në fushën e inovacionit.',
    author: 'Arsim Demiri',
    role: 'Puzzle Media — CEO'
  }
];

/** Videot zyrtare të ViPrint (kanali YouTube @viprint2008) — të verifikuara si aktive. */
VP.videos = {
  main: { id: 'pUhN_nI8fGs', title: 'Viprint General' },
  more: [
    { id: 'uRYM4wLp5lc', title: 'Tradita nuk krijohet sot, por me dekada ose shekuj' },
    { id: 'PHViWbYY6yo', title: 'Vi-Print' }
  ]
};
