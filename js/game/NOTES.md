# VI-PRINT: PRINT MASTER — shënime pune (WIP)

> Gjendja e ndërprerjes: **25.08.2026**. Logjika e lojës është e plotë; mungon shtresa vizuale.

## ✅ Gati (të commit-uara)

| Skedari | Çka bën |
|---|---|
| `data.js` | 8 nivele/porosi, 8 klientë fiktivë, formate, 5 materiale, 10 efekte, 4 finishime, insertet, transporti, 9 upgrade, 9 defekte, 5 evente |
| `engine.js` | State, ekonomia (revenue/cost/waste/profit), pikët, yjet, kohëmatësi, toast/flash/sparkle, audio WebAudio, ruajtje në `localStorage` |
| `product.js` | Renderuesi 3D me CSS (`.pv` → `.sheet`/`.box3d`/`.bookblock`), shtresat material→shtyp→folie→reliev→llak→plastifikim, animacionet `runPress/runFoil/runEmboss/runVarnish/runCut/foldStep/assembleBox/runBind`, defektet e QC, rrotullim me mouse/touch |
| `stages.js` | 16 fazat me mini-lojëra: format, material, artwork (drag&drop), print, effect, foil, emboss, finish, varnish, diecut, fold, bind, assembly, qc, pack, delivery. Helpers: `choices()`, `slider()` me zonë të gjelbër, `sweep()` timing bar |
| `main.js` | Order board, order card, HUD + track, eventet e papritura (nivelet 4+), raporti final, upgrade-t e fabrikës, `PM.test.autoPlay()` për verifikim |

## ⬜ Mbetur për nesër

1. **`css/game.css`** — e vetmja pjesë e madhe që mungon. Duhet të mbulojë (selektorët ekzistojnë tashmë në JS):
   - Shell: `.screen`, `.gbtn`, `.pan__*`, `.chgrid/.ch`, `.ctl` (+`.ctl__band`, `.is-good`), `.sweep` (+`.sweep__zone/.__mark`, `.is-hit/.is-miss`), `.seqrow/.seq`, `.machine--press/foil/emboss/cut/bind`, `.truck`, `.qcbar/.qccount`, `.toast`, `.evt`, `.ord`, `.ocard/.orow`, `.rep/.rl/.eco`, `.upg`, `.tk`
   - **Produkti 3D**: `.pv` (perspective) → `.pv__stage` (preserve-3d) → `.sheet`/`.box3d`/`.bookblock`; `.face` + `.lay--tex/pattern/varnish/finish/fluo/cutline`; `.art__it` me tre kopje `.art__ink` / `.art__foil` / `.art__relief`
   - **Atributet që JS i vendos** (nga `Product.update()`): `data-type`, `data-format`, `data-tex` (fiber/smooth/kraft/linen), `data-foil` (gold/silver/color/holo), `data-relief` (up/down), `data-finish` (soft/matte/gloss/disp), `data-varnish` (lista e zonave), plus klasat `has-material/is-printed/has-foil/has-relief/has-finish/has-varnish/has-texture/has-fluo/is-cut/is-folded/is-bound/is-spinning`
   - **Animacionet**: `anim-press`, `anim-shock`, `anim-emboss-in`, `anim-emboss-rise`, `anim-gloss`, `anim-assemble`, `anim-bind`, `fold-1..4`, `.foilplate.is-down/.is-up`, `.blade.is-go`, `.spark`
   - Variablat: `--mat`, `--ink`, `--accent` (i vendos JS-i)
2. **`game.html`** — shell me 5 ekrane: `data-screen="boot|menu|order|play|report"`, plus hooks: `[data-game] [data-board-list] [data-factory] [data-order] [data-report] [data-viewport] [data-panel] [data-track] [data-event] [data-time] [data-timebar] [data-hud-client] [data-hud-product] [data-hud-spec] [data-toasts] [data-repproduct] [data-goto] [data-mute] [data-reset] [data-abort]`. Renditja e script-eve: `data.js → engine.js → product.js → stages.js → main.js`
3. **Butoni GAME** në `index.html`: zëvendëso `<button ... aria-disabled="true">GAME …</button>` me `<a href="game.html">GAME</a>`, e njëjta edhe në `.drawer`
4. **Verifikim** me Chrome headless + `PM.test.autoPlay(i)` për të 8 nivelet (0 gabime JS, raporti shfaqet), plus 360/820/1440 px

## Vendime dizajni (mos i rishpik)

- **Pa varësi, pa build** — classic scripts + namespace `window.PM`, që `game.html` të hapet edhe me dyfish-klik (si pjesa tjetër e faqes)
- **CSS 3D, jo Three.js** — më e lehtë, e mprehtë, mobile-friendly; folia/embosimi bëhen me gradient metalik + hije të shtresuara
- **Paleta**: charcoal `#0E0E12`, ari `#D9B45B`/`#F6E7B4`, blu i thellë `#1E3A6E`, magenta e brendit `#C5037F` vetëm si aksent VI
- **Klientët/vlerat janë fiktive** (shënim në order card). Teknikat janë vetëm ato reale të VI-Print
- Timerat: 80–125s sipas nivelit; 1–3 min për porosi

## Si të testosh shpejt
```js
PM.test.autoPlay(3, r => console.log(r));   // niveli 4 — Luxury Cosmetics
PM.test.state();
```
