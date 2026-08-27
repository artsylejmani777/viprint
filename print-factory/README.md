# Print Factory 3D — ViPrint

Lojë 3D e fabrikës së shtypit, e ndërtuar me **React Three Fiber** dhe modele **GLB**.

## Stack teknologjik

| Teknologji | Roli |
|---|---|
| **@react-three/fiber** (R3F) | Skena 3D (React renderer për three.js) |
| **@react-three/drei** | Helpers: `useGLTF`, `Html` |
| **@react-three/rapier** | Fizika (RigidBody, BallCollider, CuboidCollider) |
| **@react-three/postprocessing** | Efektet (Bloom, Vignette) |
| **zustand** | Menaxhimi i gjendjes së lojës |
| **three** | Motori 3D |

## Asetet GLB

Të gjitha modelet janë **GLB**, të gjeneruara proceduralisht me skriptin `scripts/make-models.mjs` (three.js + GLTFExporter):

| Model | Përshkrim |
|---|---|
| `machine.glb` | Makina e shtypit |
| `avatar-male.glb` | Djalë me kostum (xhaketë + kravatë) |
| `avatar-female.glb` | Vajzë me fustan (A-line) |
| `product-box/card/book/bag.glb` | Produktet e shtypura |
| `factory.glb` | Fabrika (dysheme + mure) |

## Si ta ndërtosh / luash

```bash
npm install       # instalon varësitë
npm run models    # gjeneron modelet GLB → public/models/
npm run dev       # dev server → http://localhost:5173
npm run build     # prodhim → dist/
```

## Loja

- **64 produkte reale** ViPrint (nga vi-print.com), 7 kategori.
- **6 sektorë × 2 makina** (12 makina në nivelin 1).
- **2 nivele:** niveli 1 = 75 sekonda, fito **1000€** për të kaluar në nivelin 2 (pa limit).
- Klientët vijnë **në çifte** nga kompani të ndryshme, porosisin **10+ copë**.
- Lëviz: **WASD** · Ndërvepro: **E** · Dorëzo te klienti për para.
- Klientët paguajnë **≥300€** për porosi.

## Struktura

```
print-factory/
├─ scripts/make-models.mjs   # gjeneron modelet GLB
├─ public/models/*.glb       # asetet 3D
└─ src/
   ├─ data.js                # 64 produkte, 6 makina, kompani
   ├─ store.js               # zustand (logjika e lojës)
   ├─ Game.jsx               # bota 3D (fabrika, makinat, lojtari, klientët)
   ├─ ui.jsx                 # HUD, intro, dyqani
   ├─ App.jsx                # Canvas + Physics + UI
   └─ style.css
```
