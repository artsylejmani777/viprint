/* Namespace global — funksionon si nga file:// (double-click) ashtu edhe nga server. */
window.VP = window.VP || {};

// Katalogu i produkteve — burimi: vi-print.com (CMS zyrtar i ViPrint, kategoria "Produktet")
// 64 produkte reale, emrat/pershkrimet/formatet marre nga faqja zyrtare.

VP.productCategories = [
  {
    "id": "all",
    "label": "Të gjitha"
  },
  {
    "id": "libra",
    "label": "Libra & Revista"
  },
  {
    "id": "paketime",
    "label": "Paketime"
  },
  {
    "id": "efekte",
    "label": "Efekte Speciale"
  },
  {
    "id": "promo",
    "label": "Materiale Promocionale"
  },
  {
    "id": "fletushka",
    "label": "Fletushka & Postera"
  },
  {
    "id": "vizitkarta",
    "label": "Vizitkarta"
  },
  {
    "id": "etiketa",
    "label": "Etiketa"
  },
  {
    "id": "canta",
    "label": "Kese & Çanta"
  }
];

VP.products = [
  {
    "id": "debosim",
    "name": "Debosim",
    "cat": "efekte",
    "img": "assets/img/products/product-64.webp",
    "desc": "Debosimi është e kundërta e embosit. Ashtu si embosimi, ju mund të zgjidhni për të lënë zonën e debosit të paprekur ose të mbushur me ngjyrë.",
    "formats": ""
  },
  {
    "id": "folje-e-nxehte-ngjyra-sipas-kerkeses",
    "name": "Folje e nxehtë ngjyra sipas kërkesës",
    "cat": "efekte",
    "img": "assets/img/products/product-62.webp",
    "desc": "Mund të përdorni folie me ngjyra të ndryshme që ju përshtaten me brendin tuaj.",
    "formats": ""
  },
  {
    "id": "folje-e-nxehte-hologram",
    "name": "Folje e nxehtë hologram",
    "cat": "efekte",
    "img": "assets/img/products/product-61.webp",
    "desc": "Përdorimi i një folie holografike ose fletëve me ngjyra i jep kutisë për të ndryshuar kombinimet e ngjyrave kur shihen në kënde të ndryshme. Foliet holografike ofrojnë një zbavitje dhe një stil të sofistikuar për paketimin e produktit.",
    "formats": ""
  },
  {
    "id": "folje-e-nxehte-argjend",
    "name": "Folje e nxehtë argjend",
    "cat": "efekte",
    "img": "assets/img/products/product-60.webp",
    "desc": "Ky efekt realizohet me një makinë vulosje të pllakave që përdoret në pllakë metalike dhe është e gdhendur me një imazh të dizajnit që dëshironi për aplikimin e folies.",
    "formats": ""
  },
  {
    "id": "llak-dispersiv-me-baze-te-ujit",
    "name": "Llak Dispersiv (me bazë të ujit)",
    "cat": "efekte",
    "img": "assets/img/products/product-58.webp",
    "desc": "Mund ta përdorni llakun dispersiv me bazë të ujit për shumicen e produkteve tuaja.",
    "formats": ""
  },
  {
    "id": "uv-llak-glitter",
    "name": "UV llak glitter",
    "cat": "efekte",
    "img": "assets/img/products/product-57.webp",
    "desc": "Për një vështrim të guximshëm, xixat vezulluese janë mënyra më e mirë për produktin tuaj. Ata gjithashtu vijnë në një shumëllojshmëri të gjerë të ngjyrave.",
    "formats": ""
  },
  {
    "id": "uv-llak-parcial",
    "name": "UV llak parcial",
    "cat": "efekte",
    "img": "assets/img/products/product-56.webp",
    "desc": "Ne ju ofrojmë mundësinë për të bërë produktet tuaja me llak UV me shkëlqim dhe një pamje të stilit të lartë.",
    "formats": ""
  },
  {
    "id": "plastifikim-soft-touch",
    "name": "Plastifikim Soft touch",
    "cat": "efekte",
    "img": "assets/img/products/product-55.webp",
    "desc": "Deshironi qe produkti juaj te jete i veqante? Plastifikimi soft touch ju jep ndjehsine e tillë.",
    "formats": ""
  },
  {
    "id": "plastifikim-gloss",
    "name": "Plastifikim Gloss",
    "cat": "efekte",
    "img": "assets/img/products/product-54.webp",
    "desc": "Komercializoni produktin tuaj me plastifikim që shkelqen.",
    "formats": ""
  },
  {
    "id": "plastifikim-matt",
    "name": "Plastifikim Matt",
    "cat": "efekte",
    "img": "assets/img/products/product-53.webp",
    "desc": "Jepini elegance produktit tuaj me plastifikim matt",
    "formats": ""
  },
  {
    "id": "kese-te-letres",
    "name": "Kese të letrës",
    "cat": "canta",
    "img": "assets/img/products/product-52.webp",
    "desc": "",
    "formats": ""
  },
  {
    "id": "kutia-sipas-kerkesave",
    "name": "Kutia sipas kërkesave",
    "cat": "paketime",
    "img": "assets/img/products/product-51.webp",
    "desc": "Mund të keni një sërë mundësish për të cilat mund të bëni ndryshime në kuti. Këto ndryshime mund të bëhen në madhësinë, ngjyrën, dizajnin, modelin ose formën e kutisë.",
    "formats": ""
  },
  {
    "id": "kuti-per-hamburger",
    "name": "Kuti për hamburger",
    "cat": "paketime",
    "img": "assets/img/products/product-50.webp",
    "desc": "Paketimi i ushqimit kërkon kujdes shtesë pasi ato janë të ndjeshme ndaj ndryshimeve më të vogla në mjedis, bëjini ushqimet e sigurta me paketimet tona për ushqim.",
    "formats": ""
  },
  {
    "id": "kuti-per-pomfrit",
    "name": "Kuti për pomfrit",
    "cat": "paketime",
    "img": "assets/img/products/product-49.webp",
    "desc": "E përshtatshme për ta marrë me vete, paketimi duket tërheqës dhe e ruan cilësinë njëkohësisht.",
    "formats": ""
  },
  {
    "id": "kuti-per-bakllave",
    "name": "Kuti për bakllavë",
    "cat": "paketime",
    "img": "assets/img/products/product-48.webp",
    "desc": "E duhura për ta mbajtur bakllavën dhe lëngun e saj, nuk do të ketë rrjedhje përshkak se bëhet me material të veqantë. Ju do të mbeteni shumë të kënaqur me këtë produkt.",
    "formats": ""
  },
  {
    "id": "kuti-per-cokollata",
    "name": "Kuti për çokollata",
    "cat": "paketime",
    "img": "assets/img/products/product-47.webp",
    "desc": "Funksioni i parë dhe më i rëndësishëm i paketimit është të tërheqë konsumatorët dhe t’i detyrojë ata të blejnë vetë produktin",
    "formats": ""
  },
  {
    "id": "paketime-per-caja",
    "name": "Paketime për çaja",
    "cat": "paketime",
    "img": "assets/img/products/product-45.webp",
    "desc": "Vetëm paketimi mund ta bëjë produktin tuaj të shquar në raftin e shitësit dhe ta bëjë atë të duken të dallueshme nga zëvendësuesit e tjerë të vendosura në të njëjtën raft.",
    "formats": ""
  },
  {
    "id": "mbajtese-per-gota",
    "name": "Mbajtëse për gota",
    "cat": "paketime",
    "img": "assets/img/products/product-44.webp",
    "desc": "Bëjeni eventin tuaj të duket bukur me këtë detaj, e përshtatshme për takime biznesore.",
    "formats": ""
  },
  {
    "id": "revista-me-lidhje-me-tel",
    "name": "Revista me lidhje me tel",
    "cat": "libra",
    "img": "assets/img/products/product-43.webp",
    "desc": "Shtrirja e shalës është një nga metodat më të njohura të librit që ne i ofrojmë. Ne e përdorim këtë metodë për një larmi të llojeve të librave duke përfshirë katalogët, doracakët, broshurat, programe, etj.",
    "formats": "A5"
  },
  {
    "id": "revista-me-lidhje-me-ngjites",
    "name": "Revista me lidhje me ngjitës",
    "cat": "libra",
    "img": "assets/img/products/product-42.webp",
    "desc": "Faqet janë të ngjitura së bashku në shpinë me një ngjitës të fortë, fleksibël.",
    "formats": "A5 B5"
  },
  {
    "id": "libra-me-lidhje-me-ngjites",
    "name": "Libra me lidhje me ngjitës",
    "cat": "libra",
    "img": "assets/img/products/product-41.webp",
    "desc": "Në lidhjen tradicionale me ngjitës, fletët shtypen, palosen dhe bashkohen në rendin e tyre të duhur të faqes.",
    "formats": "A5 B5"
  },
  {
    "id": "libra-me-lidhje-me-penje",
    "name": "Libra me lidhje me penjë",
    "cat": "libra",
    "img": "assets/img/products/product-40.webp",
    "desc": "Një libër i seksionuar është zgjidhja më e fortë dhe më e mirë për cilësinë dhe do të shtojë jetëgjatësinë në librin tuaj. Faqet janë të palosura dhe sistemohen në seksione.",
    "formats": "A4 A5 B4 B5"
  },
  {
    "id": "katallog-me-lidhje-te-forte",
    "name": "Katallog me lidhje të fortë",
    "cat": "libra",
    "img": "assets/img/products/product-38.webp",
    "desc": "Me lidhjen e përsosur, faqet janë të lidhura mirë me njëri-tjetrin me një ngjitës të fortë, duke krijuar një shpinë me pamje profesionale, katrorë. Lidhja e përkryer, e njohur edhe si lidhja e buzës, është më e përshtatshme për katalogët që janë më shumë se 40 faqe.",
    "formats": "A3 A4"
  },
  {
    "id": "katallog-lidhje-me-ngjites",
    "name": "Katallog lidhje me ngjitës",
    "cat": "libra",
    "img": "assets/img/products/product-37.webp",
    "desc": "Katalogu mund të jetë një mjet reklamimi efektiv dhe i qëndrueshëm që gjeneron të ardhura të konsiderueshme për kompaninë ose organizatën tuaj.",
    "formats": "A3 A4"
  },
  {
    "id": "katallog-lidhje-me-tel",
    "name": "Katallog lidhje me tel",
    "cat": "libra",
    "img": "assets/img/products/product-36.webp",
    "desc": "Lidhja me tel është metoda më e zakonshme e lidhjes së katalogut. Eshtë e përshtatshme për katalogë që janë 4 deri në 64 faqe.",
    "formats": ""
  },
  {
    "id": "katallog-me-spirale",
    "name": "Katallog me spirale",
    "cat": "libra",
    "img": "assets/img/products/product-35.webp",
    "desc": "Shtypja e katalogut është një mënyrë e shkëlqyeshme për të arritur tek klientët, duke përdorur imazhe të gjalla dhe tekst përshkrues për të treguar se çfarë ofron kompania juaj.",
    "formats": "A5"
  },
  {
    "id": "kalendar-tavoline",
    "name": "Kalendar tavoline",
    "cat": "promo",
    "img": "assets/img/products/product-34.webp",
    "desc": "Nëse doni që në të njëjtën kohë të markoni kompaninë dhe tregun direkt tek klientët tuaj, nuk ka mënyrë më të mirë për të bërë në mënyrë efikase dhe efektive sesa me shtypjen e kalendarëve. Asgjë tjetër nuk e vendos mesazhin tuaj në kaq shumë njerëz çdo ditë.",
    "formats": "A5 B5"
  },
  {
    "id": "kalendar-muri",
    "name": "Kalendar muri",
    "cat": "promo",
    "img": "assets/img/products/product-33.webp",
    "desc": "Kalendarët tanë të murit janë në dispozicion në madhësi të ndryshme dhe të shtypura në letrën që ju e zgjedhni.",
    "formats": "A5 B5"
  },
  {
    "id": "blloka-ncr-me-kopje",
    "name": "Blloka NCR me kopje",
    "cat": "libra",
    "img": "assets/img/products/product-32.webp",
    "desc": "NCR janë një formë shumë-pjesëshe e ndërtuar nga letra kopje pa karbon. Format NCR formojnë kopje të shpejta dhe të lira të një dokumenti origjinal, ato janë shumë të njohura në botën e biznesit. Formati A4 A5 B4 B5",
    "formats": ""
  },
  {
    "id": "cd-cover",
    "name": "CD cover",
    "cat": "promo",
    "img": "assets/img/products/product-31.webp",
    "desc": "Me të vërtetë doni të bëni një përshtypje me prezantimin tuaj multimedial? Provoni bojën metalike ose me vulosje të pllakave, kështu që paketimi i produktit tuaj do të shkëlqejë me të vërtetë. Emboss në logo ose në emrin e projektit, ngjyra pantone ose llak janë të gjitha mundësitë që mund ti përdorni.",
    "formats": ""
  },
  {
    "id": "etiketa-vetngjitese",
    "name": "Etiketa vetngjitëse",
    "cat": "etiketa",
    "img": "assets/img/products/product-30.webp",
    "desc": "Ne ofrojmë etiketa vetngjitëse të shtypura në cfardo madhësive. Ju mund ti rregulloni etiketat vetë në mënyre që klientët ti identifikojnë produktet tuaja sapo të hyjnë në market.",
    "formats": ""
  },
  {
    "id": "menu",
    "name": "Menu",
    "cat": "promo",
    "img": "assets/img/products/product-29.webp",
    "desc": "Shtypjen e menysë – menutë me ngjyrë të plotë të ushqimeve të shijshme. Një menu e konceptuar mirë, e dizajnuar mirë dhe e printuar mirë mund të bëjë një ndryshim të madh në suksesin tuaj.",
    "formats": ""
  },
  {
    "id": "folder-per-dosje",
    "name": "Folder për dosje",
    "cat": "promo",
    "img": "assets/img/products/product-28.webp",
    "desc": "Folder ideal per mbrojtjen e dokumenteve tuaja.",
    "formats": ""
  },
  {
    "id": "mbajtes-per-promocione-nga-letra",
    "name": "Mbajtës për promocione nga letra",
    "cat": "promo",
    "img": "assets/img/products/product-27.webp",
    "desc": "Ofrojmë mbajtëse të ndryshme nga letra me dimenzione të ndryshme.",
    "formats": "A1 A2 A3 A4 A5 B1 B2 B3 B4 B5"
  },
  {
    "id": "mbeshtjelles-per-bileta",
    "name": "Mbështjellës për bileta",
    "cat": "paketime",
    "img": "assets/img/products/product-26.webp",
    "desc": "Mbështjellëse për çdo madhësi të biletave, bëjeni produktin tuaj të veqantë.",
    "formats": ""
  },
  {
    "id": "broshura-me-ngjites",
    "name": "Broshura me ngjitës",
    "cat": "libra",
    "img": "assets/img/products/product-25.webp",
    "desc": "Duke filluar nga tetë faqe, broshurat tona janë zgjidhja më e mirë nëse keni nevojë të printoni broshura ose revista me cilësi të lartë.",
    "formats": "A4 A5 B4 B5"
  },
  {
    "id": "broshura-me-spirale",
    "name": "Broshura me spirale",
    "cat": "libra",
    "img": "assets/img/products/product-24.webp",
    "desc": "Nëse keni një rast të veçantë dhe doni të keni një broshurë spirale të shtypur për të, ne ju ofrojmë këtë mundësi.",
    "formats": "A4 A5 B4 B5"
  },
  {
    "id": "broshura-lidhje-me-tel",
    "name": "Broshura lidhje me tel",
    "cat": "libra",
    "img": "assets/img/products/product-23.webp",
    "desc": "Keni nevojë për më shumë hapësirë për të prezantuar produktet tuaja, broshurat janë ideale për t’ju ndihmuar të promovoni produktet tuaja.",
    "formats": "A4 A5 B4 B5"
  },
  {
    "id": "ftesa",
    "name": "Ftesa",
    "cat": "promo",
    "img": "assets/img/products/product-22.webp",
    "desc": "Të punuara me letra speciale, me efekte që do ta bëjë takimin, ahengun tuaj më special.",
    "formats": "A5 A6 B5 B6"
  },
  {
    "id": "certifikata",
    "name": "Certifikata",
    "cat": "promo",
    "img": "assets/img/products/product-21.webp",
    "desc": "Njerëzit janë krenarë të tregojnë certifikatat e tyre, edhe pse disa certifikata thjesht kanë për qëllim të jenë argëtuese ose kujtesë e bukur për ngjarjet të veçanta. Në një formë apo tjetër ato janë shumë të çmuara.",
    "formats": "A3 A4"
  },
  {
    "id": "diploma",
    "name": "Diploma",
    "cat": "promo",
    "img": "assets/img/products/product-20.webp",
    "desc": "Bëjmë shtypin e diplomave me letra speciale.",
    "formats": "A3 A4"
  },
  {
    "id": "orare-shkollore",
    "name": "Orare shkollore",
    "cat": "libra",
    "img": "assets/img/products/product-18.webp",
    "desc": "Të përshtatshme për më të vegjelit tanë, dizajni me animacione do ti bëje edhe më të veqantë",
    "formats": "A5"
  },
  {
    "id": "fletore-agjenda-me-pelhure-me-spirale",
    "name": "Fletore agjenda me pëlhurë me spirale",
    "cat": "libra",
    "img": "assets/img/products/product-17.webp",
    "desc": "Ofrojmë fletore të mveshura me material të pëlhurës, shumë elegante dhe të qëndrueshme, lidhja me spirale.",
    "formats": "A5 B5"
  },
  {
    "id": "fletore-agjenda-me-pelhure",
    "name": "Fletore agjenda me pëlhurë",
    "cat": "libra",
    "img": "assets/img/products/product-16.webp",
    "desc": "Ofrojmë fletore të mveshura me material të pëlhurës, shumë elegante dhe të qëndrueshme.",
    "formats": "A5 B5"
  },
  {
    "id": "fletore-me-kopertina-te-forta",
    "name": "Fletore me kopertina të forta",
    "cat": "libra",
    "img": "assets/img/products/product-15.webp",
    "desc": "Fletore të qëndrueshme dhe shume praktike ne perdorim.",
    "formats": "A4 A5 B4 B5"
  },
  {
    "id": "kartolina",
    "name": "Kartolina",
    "cat": "promo",
    "img": "assets/img/products/product-14.webp",
    "desc": "Kartolinat na kujtojnë kujtimet e një të kaluare jo shumë të largët, kur e-mailet, mediat sociale dhe mesazhet e menjëhershme celulare nuk ishin të pranishme. Nëse jeni duke kërkuar të personalizoni përshëndetjet festive të kompanisë suaj ose për të promovuar një produkt apo ngjarje të re, kartolinat janë një alternativë elegante dhe e nevojshme.",
    "formats": "A5 A6 B6"
  },
  {
    "id": "folder",
    "name": "Folder",
    "cat": "promo",
    "img": "assets/img/products/product-13.webp",
    "desc": "E disponueshme në formate të ndryshme dhe perfekte për transportin e sigurt dhe të lehtë të të gjitha dokumenteve tuaja. Formati A4 B4",
    "formats": ""
  },
  {
    "id": "zarfa",
    "name": "Zarfa",
    "cat": "promo",
    "img": "assets/img/products/product-12.webp",
    "desc": "Zgjidhje ideale për korrespondencën tuaj.",
    "formats": "A4 A5 Amerikan"
  },
  {
    "id": "memo",
    "name": "Memo",
    "cat": "promo",
    "img": "assets/img/products/product-11.webp",
    "desc": "Janë të përdorshme për shënime, janë dhurata popullore promovuese në panaire, konferenca dhe ngjarje të tjera.",
    "formats": "A4"
  },
  {
    "id": "poster",
    "name": "Poster",
    "cat": "fletushka",
    "img": "assets/img/products/product-10.webp",
    "desc": "E disponueshme në të gjitha dimensionet, ideale për prezantimin e produktit tuaj.",
    "formats": "A1 A2 A3 B1 B2 B3"
  },
  {
    "id": "fletore-me-spirale",
    "name": "Fletore me spirale",
    "cat": "libra",
    "img": "assets/img/products/product-09.webp",
    "desc": "Trajtimi i lehtë me dizajn funksional dhe të qëndrueshme është ajo që i bën fletoret tona të lidhura me spirale të dallohen nga të tjerat.",
    "formats": "A4 A5 B4 B5"
  },
  {
    "id": "bloka-per-vizatime",
    "name": "Bloka për vizatime",
    "cat": "libra",
    "img": "assets/img/products/product-08.webp",
    "desc": "Një nga aspektet më të rëndësishme të pikturës së akuareleve është blloku i vizatimit, cilësia e të cilave mund të ndikojë drejtpërsëdrejti në rezultatin tuaj përfundimtar.",
    "formats": "A3 B3"
  },
  {
    "id": "fletore-shkollore",
    "name": "Fletore shkollore",
    "cat": "libra",
    "img": "assets/img/products/product-8x.webp",
    "desc": "Ndjehuni te veqante me fletoret tona me animacione te ndryshme.",
    "formats": "A5 B5"
  },
  {
    "id": "voucher",
    "name": "Voucher",
    "cat": "promo",
    "img": "assets/img/products/product-06.webp",
    "desc": "Jepni eventit tuaj kualitetin profesional. Ju do të lini një përshtypje të gjatë me dizajnin tuaj personal.",
    "formats": "A4"
  },
  {
    "id": "bileta",
    "name": "Bileta",
    "cat": "promo",
    "img": "assets/img/products/product-05.webp",
    "desc": "Ne ofrojmë cilësi profesionale printim të biletave me porosi, porosi të dizajnuara për të promovuar ngjarjen tuaj ose ndonje rast të veçantë",
    "formats": "A1 A2 A3 B1 B2 B3"
  },
  {
    "id": "flyer-me-varrse",
    "name": "Flyer me varrse",
    "cat": "fletushka",
    "img": "assets/img/products/product-04.webp",
    "desc": "Trokitni në derën e klientit tuaj me një mesazh të pagabueshëm! Varëset mund të shtypen në një anë ose në të dyja anët.",
    "formats": "A5 A6 B5 B6 DL"
  },
  {
    "id": "flyer",
    "name": "Flyer",
    "cat": "fletushka",
    "img": "assets/img/products/product-03.webp",
    "desc": "Fletëpalosje me hapësirë të mjaftueshme për informacion.",
    "formats": "A5 A6 B5 B6 DL"
  },
  {
    "id": "wobbler",
    "name": "Wobbler",
    "cat": "fletushka",
    "img": "assets/img/products/product-01.webp",
    "desc": "Nëse jeni duke menduar të prodhoni nje flyer promocional, pse të mos provoni një wobbler të thjeshtë dhe shumë efektiv.",
    "formats": "A5 A6 A7 B5 B6 B7"
  },
  {
    "id": "embosim",
    "name": "Embosim",
    "cat": "efekte",
    "img": "assets/img/products/product-63.webp",
    "desc": "Embosimi e ndryshon sipërfaqen e letrës duke krijuar një efekt tre-dimensional ose të ngritur në zona të zgjedhura. Procesi është i thjeshtë dhe një mënyrë me kosto efektive për të rritur pamjen dhe cilësinë e produktit.",
    "formats": ""
  },
  {
    "id": "folje-e-nxehte-ari",
    "name": "Folje e nxehtë ari",
    "cat": "efekte",
    "img": "assets/img/effects/foil-gold.webp",
    "desc": "Rezultati është një ‘’dokument’’ që ka një imazh shumë reflektues me një pamje ari të ndritshme dhe të dendur.",
    "formats": ""
  },
  {
    "id": "kutia-per-torte",
    "name": "Kutia për torte",
    "cat": "paketime",
    "img": "assets/img/products/product-46.webp",
    "desc": "Kutiat janë të lehta në mënyre që të mund të transportohen me lehtësi. Prandaj janë shumë të përshtatshme për t’u përdorur. Edhe pse peshojnë pak, ato mund të mbështesin peshën e produktit të mbyllur dhe të sigurojnë mbrojtjen e plotë.",
    "formats": ""
  },
  {
    "id": "libra-me-lidhje-te-forte",
    "name": "Libra me lidhje të fortë",
    "cat": "libra",
    "img": "assets/img/products/product-39.webp",
    "desc": "Lidhja e fortë – një formë e lidhjes që përdoret më së shumti për llojet e ndryshme të librave të njohur ndryshe si libra me kapak apo libra softcover. Librat me lidhje të fortë gjithashtu mund të përdoren për doracakët, katalogët, etj.",
    "formats": "A5 A6 B5 B6"
  },
  {
    "id": "vizitkarta",
    "name": "Vizitkarta",
    "cat": "vizitkarta",
    "img": "assets/img/products/product-19.webp",
    "desc": "Është përshtypja e parë e cila ka rëndësi! Me cilësinë tonë të vizitkartelave ju do të lini një përshtypje të qëndrueshme.",
    "formats": "85x55mm 80x50mm 90x50mm"
  },
  {
    "id": "fletepalosje",
    "name": "Fletepalosje",
    "cat": "fletushka",
    "img": "assets/img/products/product-02.webp",
    "desc": "Fletëpalosjet janë një nga mjetet më të famshme të marketingut. E quajtur gjthashtu fletushkë e palosshme, është një pjesët thelbësore në ekspozita, panaire etj.",
    "formats": "A4 B4"
  }
];
