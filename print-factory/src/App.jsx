import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import Game from './Game';
import { HUD, Toast, Intro, Shop } from './ui';

export default function App() {
  const [shopOpen, setShopOpen] = useState(false);

  return (
    <>
      <Canvas shadows camera={{ position: [0, 16, 18], fov: 45 }}>
        <Suspense fallback={null}>
          <Physics gravity={[0, -9.81, 0]}>
            <Game />
          </Physics>
        </Suspense>
      </Canvas>
      <HUD onShop={() => setShopOpen(true)} />
      <Toast />
      <Intro />
      {shopOpen && <Shop onClose={() => setShopOpen(false)} />}
    </>
  );
}
