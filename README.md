# ViPrint — Website modern

Website i ri, modern dhe premium për **ViPrint Printing House** (Parku i Biznesit, Mitrovicë, Kosovë).

Dizajn krejtësisht i ri — **jo kopje** e faqes aktuale. Të gjitha informacionet, produktet,
makineritë, datat dhe fotografitë janë **reale, të nxjerra nga faqja zyrtare** `vi-print.com`.

---

## Si t'i hapësh

**Opsioni 1 — dyfish-klik (më i shpejti)**
Hap `index.html` direkt në shfletues. Funksionon plotësisht, pa server, pa build.

**Opsioni 2 — server lokal** (rekomandohet për testim realist)
```bash
cd viprint
python -m http.server 8000
# hap http://localhost:8000
```

> Faqja është ndërtuar me *classic scripts* (jo ES modules) pikërisht që të funksionojë
> edhe nga `file://`. Kjo është arsyeja pse `data/*.js` shkruajnë në namespace-in global `window.VP`.

---

## Teknologjia

Statike, pa varësi, pa build-step — **HTML + CSS + Vanilla JS**.

Pse: është një faqe marketingu me përmbajtje. Statike = ngarkim i menjëhershëm,
SEO i plotë, zero varësi që kalben, publikim direkt në GitHub Pages,
dhe kod që kushdo mund t'a mirëmbajë pa `npm install`.

| Çka | Si |
|---|---|
| Animacione në scroll | `IntersectionObserver` (pa GSAP/AOS) |
| Timeline interaktive | Vanilla JS + ARIA `tablist`, navigim me tastierë |
| Filtrim produktesh + modal | Vanilla JS, fokus i menaxhuar, `Esc` / shigjeta |
| Procesi "nëpër fabrikë" | Stage `position: sticky` + hapa që aktivizohen në scroll |
| Fotografitë | WebP i optimizuar (4 MB total për 127 skedarë) |
| Tipografia | Archivo (display/body) + Instrument Serif (citime) |
| Ngjyra e brendit | `#C5037F` — magenta e ViPrint, nxjerrë nga CSS-i i faqes zyrtare |

Respektohet `prefers-reduced-motion`. Kontrast, `:focus-visible`, dhe `aria-*` të vendosura.

---

## Struktura

```
viprint/
├─ index.html              # një faqe, shtatë seksione + modale
├─ css/
│  ├─ tokens.css           # ngjyrat, tipografia, spacing, motion (design tokens)
│  ├─ base.css             # reset, tipografia bazë, helpers
│  ├─ layout.css           # shell, navbar, drawer, footer
│  ├─ components.css       # butona, karta, chips, modal, marquee, reveal
│  └─ sections.css         # stilet për secilin seksion
├─ js/
│  ├─ main.js              # pika e nisjes
│  └─ modules/
│     ├─ icons.js          # ikonat SVG inline
│     ├─ render.js         # renderon stats, brands, services, why, machines…
│     ├─ nav.js            # sticky nav, drawer, link aktiv, progress bar
│     ├─ reveal.js         # animacionet në scroll + numëratorët
│     ├─ timeline.js       # timeline interaktive
│     ├─ products.js       # filtrim + grid + modal
│     ├─ process.js        # udhëtimi nëpër fabrikë
│     └─ forms.js          # validimi i formularit + lightbox video
├─ data/                   # ← E GJITHË PËRMBAJTJA JETON KËTU
│  ├─ config.js            # formspreeId — i vetmi vend për t'u konfiguruar
│  ├─ company.js           # kontakt, brendet, arsyet, referencat, videot
│  ├─ services.js          # 7 shërbime + 6 hapat e procesit
│  ├─ products.js          # 64 produkte reale
│  ├─ machines.js          # 11 makineri reale
│  └─ timeline.js          # 9 arritje me data reale
└─ assets/img/             # fotografi reale të ViPrint (WebP)
```

**Për të ndryshuar përmbajtjen, ndrysho vetëm `data/*.js`.** HTML-i nuk ka nevojë të prekët.

---

## Burimi i të dhënave (asgjë e shpikur)

| Përmbajtja | Burimi |
|---|---|
| Teksti "Për Ne", "Pse Viprint", shërbimet | `vi-print.com` (versioni shqip + anglisht) |
| **64 produkte** — emrat, përshkrimet, formatet, fotot | CMS-i zyrtar i ViPrint, kategoria "Produktet" (WP REST API) |
| **11 makineri** — emrat, llojet | Seksioni "Makineria e sofistikuar" |
| **9 data historiku** | Arkiva zyrtare e lajmeve (data reale publikimi) |
| Kontakti | `Parku i Biznesit Mitrovica` · `+383 48 350 159` · `info@vi-print.com` |
| Referencat e klientëve | Seksioni "Klientët tanë" (VM3, Meridian Express, Puzzle Media) |
| Videot | Kanali zyrtar YouTube `@viprint2008` (3 video të verifikuara aktive) |
| Fotografitë | Media library e `vi-print.com` |

Arritjet kyçe të përfshira, të gjitha të dokumentuara:
- **1981** — përvoja në industri nis
- **Shtator 2016** — çmimi *Superbrands*
- **Dhjetor 2016** — Man Roland 705, format B1 (100×70 cm)
- **Maj 2017** — linja e re e paketimeve industriale
- **Prill 2021** — **kompania e parë në Kosovë, Shqipëri dhe Maqedoni të Veriut e certifikuar nga FOGRA**
- **Korrik 2021** — *Superbrands* përsëri

---

## ⚠️ Dy gjëra për konfirmim nga klienti

1. **Emri i CEO-s.** Faqja zyrtare është kontradiktore: versioni shqip e nënshkruan citimin
   e udhëheqësisë si **Burbuqe Xhema, CEO**, ndërsa versioni anglisht si **Visar Idrizi,
   Executive Director** (dhe një referencë klienti e quan Visar Idrizi "CEO i Viprint").
   Aktualisht është përdorur atribuimi i **versionit shqip**. Ndryshoje në
   `data/company.js` → `leadershipQuote`.

2. **Fotografitë e makinerive.** Faqja zyrtare ka 12 fotografi të repartit, por **pa etiketa**
   që të tregojnë se cila makinë është në cilën foto. Për këtë arsye ato **nuk** u caktohen
   makinave individuale — paraqiten si *"Galeria e repartit të prodhimit"*. Kur ViPrint të
   dërgojë foto të etiketuara, shtoji si `img:` në `data/machines.js`.

Numri i telefonit: versioni anglisht i faqes listonte `+377 45 555 095`, ndërsa header-i i
të dy versioneve `+383 48 350 159`. Është përdorur i dyti.

---

## Formulari i kontaktit — aktivizimi i dërgimit real

Formspree është **i integruar dhe gati**. Mungon vetëm një ID.

### Hapat (falas, ~1 minutë)

1. Hyr në **https://formspree.io** → *Sign up* (me `info@vi-print.com`).
2. **+ New Form** → emri `ViPrint Website` → *Create*.
3. Kopjo endpoint-in, p.sh. `https://formspree.io/f/xldwpbkq`.
4. Hap **`data/config.js`** dhe ngjit **vetëm kodin e fundit**:

```js
formspreeId: 'xldwpbkq',     //  ← e vetmja gjë që duhet ndryshuar
```

Gati. Formulari tani dërgon email të vërtetë në `info@vi-print.com`.

### Si sillet

| `formspreeId` | Sjellja |
|---|---|
| i plotësuar | POST me AJAX në Formspree — pa reload, butoni shfaq *"Duke dërguar…"*, mesazh suksesi, formulari pastrohet |
| bosh (gjendja aktuale) | Fallback `mailto:` — hap klientin e emailit të vizitorit me fushat e plotësuara |

Të dyja rrugët janë testuar. Përfshihen: trajtimi i gabimeve (shfaq mesazhin e Formspree +
emailin si alternativë), gjendja *disabled* e butonit, dhe një **kurth anti-spam** (`_gotcha`)
që bllokon botët pa CAPTCHA.

Alternativa: Netlify Forms (shto atributin `netlify` te `<form>`), Web3Forms, ose endpoint i vetin.

---

## Publikimi

**GitHub Pages** — repo-ja është e lidhur me `github.com/artsylejmani/viprint`:
```bash
git push -u origin main
# Settings → Pages → Branch: main / root
```

Punon edhe direkt në Netlify / Vercel / Cloudflare Pages — thjesht drag & drop
(pa build command, publish directory = `/`).

---

## Faqja GAME — "Print Master"

Loja është **e ndërtuar** dhe e lidhur. Hape me `game.html` (ose butoni **GAME** në navbar).

| Çka | Ku |
|---|---|
| Hyrja e lojës | `game.html` |
| Stilet (charcoal · ar · blu · magenta) | `css/game.css` |
| Të dhënat (8 nivele, klientë, katalog, upgrade) | `js/game/data.js` |
| Motori (state, ekonomi, pikë, timer, audio, save) | `js/game/engine.js` |
| Produkti 3D + transformimet (CSS 3D) | `js/game/product.js` |
| 16 fazat e prodhimit (mini-lojëra) | `js/game/stages.js` |
| Rrjedha (board, HUD, evente, raport, upgrade) | `js/game/main.js` |

**Koncepti:** lojtari pranon një porosi klienti dhe e prodhon produktin e shtypur përmes
deri në 15 fazave — format → material → artwork → shtyp → efekte → folie → embosim → finish
→ llak parcial → shtancim → palosje → lidhje → montim → kontroll cilësie → paketim → dërgesë.
**Produkti transformohet dukshëm pas çdo faze** (letër e bardhë → karton i zi → shtyp →
folie ari → reliev 3D → llak → prerje → kuti 3D).

- **8 nivele** me klientë fiktivë (Biznes Karta → Flyer → Vizitkartë Premium → Luxury Cosmetics
  → Paketim Torte → Fashion Brand → Libër → VIP Corporate), secili me teknikat e veta.
- **Ekonomia:** çdo porosi ka të ardhura, kosto materiale/makinerish/efektesh/mbeturinash
  dhe fitim. Fitimet blejnë **9 upgrade të fabrikës** (printer më i shpejtë, prerës më i mirë…).
- **Evente të papritura** nga niveli 4+ (bllokim makine, bojë e ulët, folie e shmangur…).
- Punon me **mouse + touch** (drag-and-drop, tap, swipe), desktop/tablet/mobile.
- Teknikat e shtypit janë **vetëm ato reale të ViPrint**; klientët, çmimet dhe kostot janë **fiktive**
  (e shënuar si e tillë në lojë).

Verifikuar me Chrome headless: **0 gabime JS, 8/8 nivele në 100%, pa overflow në 375/820/1440px.**

---

## Checklist i verifikuar

Testuar me Chrome headless në `1440px`, `820px`, `375px` dhe `360px` (iframe):

- ✅ 0 gabime JavaScript
- ✅ 0 fotografi të thyera (48 imazhe të ngarkuara)
- ✅ 0 overflow horizontal në çdo breakpoint
- ✅ Filtrimi i produkteve (9 kategori), "shfaq më shumë", modal + navigim prev/next
- ✅ Timeline: 9 nyje, klik + tastierë
- ✅ Procesi: 6 hapa, stage sticky në desktop, foto inline në mobile
- ✅ Drawer mobile hapet/mbyllet, navbar solid pas hero-s
- ✅ Validimi i formularit shënon 3 fushat e detyrueshme
- ✅ Fontet ngarkohen (Archivo)
