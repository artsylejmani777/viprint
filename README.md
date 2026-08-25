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

## Faqja GAME (së shpejti)

Butoni **GAME** ekziston në navbar dhe është shënuar *"së shpejti"* — loja **nuk** është
ndërtuar, sipas kërkesës. Kur të vijë koha:

1. Krijo `game.html` (rikthe `<link>`-at e CSS-it dhe navbar-in nga `index.html`).
2. Në `index.html` zëvendëso `<button ... aria-disabled="true">` me
   `<a class="btn btn--ghost-light btn--sm" href="game.html">GAME</a>`.
3. Të njëjtën ndryshim bëje edhe në `.drawer` për mobile.

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
