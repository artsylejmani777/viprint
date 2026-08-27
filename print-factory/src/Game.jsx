/* ==========================================================================
   Game.jsx — bota 3D: fabrika, makinat, lojtari, klientët, fizika, efekte
   ========================================================================== */
import { useMemo, useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Html } from '@react-three/drei';
import { RigidBody, BallCollider, CuboidCollider } from '@react-three/rapier';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { useGame } from './store';
import { MACHINES, product, category } from './data';

/* Load a GLB (cloned per instance) */
function Model({ url, scale = 1, position = [0, 0, 0], rotation = [0, 0, 0], ...rest }) {
  const { scene } = useGLTF(url);
  const cloned = useMemo(() => scene.clone(true), [scene]);
  return <primitive object={cloned} scale={scale} position={position} rotation={rotation} {...rest} />;
}

/* ---------- lights ---------- */
function Lights() {
  return (
    <>
      <ambientLight intensity={0.75} />
      <directionalLight position={[12, 20, 8]} intensity={1.1} castShadow shadow-mapSize={[2048, 2048]} />
      <hemisphereLight args={['#bfe3ff', '#4a5a4a', 0.4]} />
    </>
  );
}

/* ---------- factory walls colliders ---------- */
const WALLS = [
  { args: [15, 0.55, 0.2], position: [0, 0.55, -10] },
  { args: [0.2, 0.55, 10], position: [-15, 0.55, 0] },
  { args: [0.2, 0.55, 10], position: [15, 0.55, 0] },
  { args: [6.5, 0.55, 0.2], position: [-8.25, 0.55, 10] },
  { args: [6.5, 0.55, 0.2], position: [8.25, 0.55, 10] },
];

function Factory() {
  return (
    <group>
      <Model url="/models/factory.glb" />
      {WALLS.map((w, i) => <CuboidCollider key={i} args={w.args} position={w.position} />)}
    </group>
  );
}

/* ---------- machines (6 sectors × 2) ---------- */
function MachineSector({ sec }) {
  const mach = MACHINES.find((m) => m.id === sec.id);
  return (
    <group>
      {/* two machine units side by side */}
      <Model url="/models/machine.glb" position={[-1.5, 0, sec.z]} />
      <Model url="/models/machine.glb" position={[1.5, 0, sec.z]} />
      <CuboidCollider args={[2.6, 0.8, 0.75]} position={[sec.x, 0.8, sec.z]} />
      {/* label */}
      <Html position={[sec.x, 2.3, sec.z]} center distanceFactor={12}>
        <div style={{ whiteSpace: 'nowrap', background: 'rgba(9,35,40,.92)', color: '#ffd54f', padding: '3px 10px', borderRadius: 999, fontSize: 12, fontWeight: 700, border: '1px solid rgba(255,213,79,.5)' }}>
          {mach.emoji} {mach.name} ×2
        </div>
      </Html>
      {/* finished product floating above */}
      {sec.product && (
        <Model url={productModel(sec.product.productId)} position={[sec.x, 1.9, sec.z]} scale={0.6} />
      )}
      {/* progress bar while printing */}
      {sec.printing && <PrintBar x={sec.x} z={sec.z} progress={sec.progress} />}
    </group>
  );
}

function productModel(productId) {
  const p = product(productId);
  if (p.cat === 'ambalazhe' || p.cat === 'tjera') return '/models/product-box.glb';
  if (p.cat === 'libra') return '/models/product-book.glb';
  if (p.cat === 'zyre' || p.cat === 'dokumente') return '/models/product-card.glb';
  return '/models/product-bag.glb';
}

function PrintBar({ x, z, progress }) {
  return (
    <group position={[x, 2.0, z]}>
      <mesh>
        <boxGeometry args={[2.4, 0.12, 0.12]} />
        <meshBasicMaterial color="#0d1a1f" />
      </mesh>
      <mesh position={[-1.2 + progress * 1.2, 0, 0]}>
        <boxGeometry args={[progress * 2.4, 0.1, 0.1]} />
        <meshBasicMaterial color="#7fd98a" />
      </mesh>
    </group>
  );
}

/* ---------- player ---------- */
const keys = {};
function Player() {
  const body = useRef();
  const setPlayer = useGame((s) => s.setPlayer);

  useEffect(() => {
    const down = (e) => {
      const k = e.key.toLowerCase();
      if (k === 'w' || k === 'a' || k === 's' || k === 'd') keys[k] = true;
      if (k === 'e') useGame.getState().interact();
    };
    const up = (e) => { const k = e.key.toLowerCase(); if (k in keys) keys[k] = false; };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, []);

  useFrame(() => {
    const b = body.current;
    if (!b) return;
    let ix = 0, iz = 0;
    if (keys.w) iz -= 1;
    if (keys.s) iz += 1;
    if (keys.a) ix -= 1;
    if (keys.d) ix += 1;
    const len = Math.hypot(ix, iz);
    if (len > 0) {
      const spd = 4.2;
      b.setLinvel({ x: (ix / len) * spd, y: b.linvel().y, z: (iz / len) * spd }, true);
    } else {
      b.setLinvel({ x: 0, y: b.linvel().y, z: 0 }, true);
    }
    const t = b.translation();
    setPlayer(t.x, t.z, ix !== 0 ? Math.sign(ix) : undefined);
  });

  return (
    <RigidBody ref={body} position={[0, 0.35, 7]} colliders={false} enabledRotations={[false, false, false]} linearDamping={0}>
      <BallCollider args={[0.34]} />
      <Model url="/models/avatar-male.glb" position={[0, -0.35, 0]} />
    </RigidBody>
  );
}

/* ---------- customers ---------- */
function Customers() {
  const customers = useGame((s) => s.customers);
  const carrying = useGame((s) => s.carrying);
  return (
    <group>
      {customers.map((c) => (
        <Customer key={c.id} c={c} isTarget={carrying && carrying.orderId === c.orderId} />
      ))}
    </group>
  );
}

function Customer({ c, isTarget }) {
  const p = product(c.productId);
  const cat = category(p.cat);
  const walking = c.state === 'walk' || c.state === 'leave' || c.state === 'announce';
  return (
    <group position={[c.x, 0, c.z]}>
      <Model url={c.gender === 'f' ? '/models/avatar-female.glb' : '/models/avatar-male.glb'} />
      {c.state === 'wait' || c.state === 'announce' ? (
        <Html position={[0, 2.3, 0]} center distanceFactor={10}>
          <div style={{ whiteSpace: 'nowrap', background: '#fff', color: '#1a2427', padding: '4px 10px', borderRadius: 8, fontSize: 12, fontWeight: 600, maxWidth: 220, lineHeight: 1.3 }}>
            {cat.emoji} {c.companyEmoji} {c.name}: {c.qty}× {p.name}
            <div style={{ color: '#5b686d', fontSize: 10 }}>⏱ {Math.ceil(c.patience)}s</div>
          </div>
        </Html>
      ) : null}
      {isTarget && (
        <mesh position={[0, 2.7, 0]}>
          <coneGeometry args={[0.25, 0.5, 4]} />
          <meshBasicMaterial color="#ffd54f" />
        </mesh>
      )}
    </group>
  );
}

/* ---------- order pointer (shigjeta drejt sektorit) ---------- */
function OrderPointer() {
  const orders = useGame((s) => s.orders);
  const carrying = useGame((s) => s.carrying);
  const sectors = useGame((s) => s.sectors);
  const first = orders.find((o) => o.status === 'new');
  if (!first || carrying) return null;
  const sec = sectors.find((s) => s.id === first.machine);
  if (!sec) return null;
  return (
    <group position={[sec.x, 3.2, sec.z]}>
      <mesh>
        <coneGeometry args={[0.4, 0.8, 4]} />
        <meshBasicMaterial color="#ffd54f" />
      </mesh>
    </group>
  );
}

/* ---------- camera rig ---------- */
function CameraRig() {
  const { camera } = useThree();
  useFrame(() => {
    const p = useGame.getState().player;
    camera.position.x += (p.x - camera.position.x) * 0.08;
    camera.position.y += (16 - camera.position.y) * 0.08;
    camera.position.z += (p.z + 11 - camera.position.z) * 0.08;
    camera.lookAt(p.x, 0, p.z);
  });
  return null;
}

/* ---------- effects ---------- */
function Effects() {
  return (
    <EffectComposer>
      <Bloom intensity={0.35} luminanceThreshold={0.75} mipmapBlur />
      <Vignette eskil={false} offset={0.2} darkness={0.5} />
    </EffectComposer>
  );
}

/* ---------- main world ---------- */
export default function Game() {
  const sectors = useGame((s) => s.sectors);
  const started = useGame((s) => s.started);

  useFrame((_, dt) => {
    useGame.getState().tick(dt);
  });

  return (
    <>
      <color attach="background" args={['#0a2026']} />
      <fog attach="fog" args={['#0a2026', 30, 60]} />
      <Lights />
      <Factory />
      {sectors.map((sec) => <MachineSector key={sec.id} sec={sec} />)}
      {started && <Player />}
      {started && <Customers />}
      {started && <OrderPointer />}
      <CameraRig />
      <Effects />
    </>
  );
}
