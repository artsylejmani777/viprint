/* ==========================================================================
   ui.jsx — HUD, Toast, Intro, Dyqani (overlays mbi skenën 3D)
   ========================================================================== */
import { useEffect, useState } from 'react';
import { useGame } from './store';
import { GOAL_MONEY, WORKER_COST, STICKER_COST } from './data';

function fmt(n) { return Math.round(n).toLocaleString('en-US'); }

export function HUD({ onShop }) {
  const money = useGame((s) => s.money);
  const level = useGame((s) => s.level);
  const timeLeft = useGame((s) => s.timeLeft);
  const workers = useGame((s) => s.workers);
  const stickers = useGame((s) => s.stickers);
  const earned = useGame((s) => s.earned);
  const canUpgrade = useGame((s) => s.level === 1 && s.earned >= GOAL_MONEY);
  const upgrade = useGame((s) => s.upgrade);
  const started = useGame((s) => s.started);

  return (
    <header className="hud">
      <div className="hud-brand">🖨️ ViPrint <b>Factory 3D</b></div>
      <div className="hud-stat" title="Paraja">💰 {fmt(money)}€</div>
      <div className="hud-stat" title="Niveli">🏭 {level}</div>
      <div className={'hud-stat timer' + (level === 1 && timeLeft <= 10 ? ' urgent' : '')} title="Koha e nivelit 1">⏱ {level === 1 ? Math.max(0, Math.ceil(timeLeft)) : '∞'}s</div>
      <div className="hud-stat" title="Makineritë">🖨️ {level === 1 ? 12 : 20}</div>
      <div className="hud-stat" title="Punëtorët">🧑‍🏭 {workers}</div>
      <div className="hud-stat" title="Stickers">⭐ {stickers}</div>
      {canUpgrade && <button className="hud-btn upgrade" onClick={upgrade}>⬆️ Upgrade në Nivelin 2</button>}
      {started && <button className="hud-btn" onClick={onShop}>🏪 Dyqani</button>}
      {level === 1 && <div className="hud-stat" title="Qëllimi">🎯 {fmt(Math.min(earned, GOAL_MONEY))}/{GOAL_MONEY}€</div>}
    </header>
  );
}

export function Toast() {
  const msg = useGame((s) => s.toastMsg);
  const kind = useGame((s) => s.toastKind);
  const at = useGame((s) => s.toastAt);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!at) return;
    setShow(true);
    const t = setTimeout(() => setShow(false), 2800);
    return () => clearTimeout(t);
  }, [at]);

  return <div className={'toast' + (show ? ' show' : '') + (kind ? ' ' + kind : '')}>{msg}</div>;
}

export function Intro() {
  const intro = useGame((s) => s.intro);
  const start = useGame((s) => s.start);
  if (!intro) return null;
  return (
    <div className="overlay">
      <div className="card">
        <h1>🖨️ ViPrint Factory 3D</h1>
        <p className="sub">6 sektorë · 64 produkte reale.<br />Fito <b>1000€</b> në <b>75 sekonda</b> për të avancuar në nivelin 2!</p>
        <div className="rules">
          <p>💬 Klientët vijnë <b>në çifte</b> nga kompani të ndryshme dhe porosisin <b>10+ copë</b>.</p>
          <p>🧭 Shigjeta e verdhë tregon <b>sektorin e duhur</b> të makinës.</p>
          <p>🕹️ Lëviz: <b>WASD</b> · Ndërvepro: <b>E</b> · Dorëzo te klienti për para.</p>
        </div>
        <button className="btn btn-primary btn-block" onClick={start}>▶️ Fillo lojën</button>
      </div>
    </div>
  );
}

export function Shop({ onClose }) {
  const level = useGame((s) => s.level);
  const money = useGame((s) => s.money);
  const workers = useGame((s) => s.workers);
  const stickers = useGame((s) => s.stickers);
  const earned = useGame((s) => s.earned);
  const canUpgrade = useGame((s) => s.level === 1 && s.earned >= GOAL_MONEY);
  const upgrade = useGame((s) => s.upgrade);
  const buyWorker = useGame((s) => s.buyWorker);
  const buySticker = useGame((s) => s.buySticker);

  return (
    <div className="overlay">
      <div className="card" style={{ position: 'relative', textAlign: 'left', width: 'min(480px, calc(100vw - 32px))' }}>
        <button className="overlay-close" onClick={onClose} aria-label="Mbyll">✕</button>
        <h1 style={{ fontSize: '1.2rem' }}>🏪 Dyqani</h1>
        <div className="shop-list">
          {level === 1 && (
            <button className={'shop-item' + (canUpgrade ? ' afford' : '')} disabled={!canUpgrade} onClick={upgrade}>
              <span className="shop-ico">🏭</span>
              <span className="shop-info">
                <b>Upgrade në Nivelin 2</b>
                <small>{canUpgrade ? 'Gati! 20 makina + 5 punëtorë' : 'Fito ' + GOAL_MONEY + '€ nga shitjet (' + fmt(earned) + '/' + GOAL_MONEY + '€)'}</small>
              </span>
              <span className="shop-cost">{canUpgrade ? 'GO!' : '🔒'}</span>
            </button>
          )}
          {level === 2 && (
            <button className={'shop-item' + (money >= WORKER_COST ? ' afford' : '')} disabled={money < WORKER_COST} onClick={buyWorker}>
              <span className="shop-ico">🧑‍🏭</span>
              <span className="shop-info"><b>Punëtor i ri</b><small>Ke {workers} punëtorë</small></span>
              <span className="shop-cost">{WORKER_COST}€</span>
            </button>
          )}
          <button className={'shop-item' + (money >= STICKER_COST ? ' afford' : '')} disabled={money < STICKER_COST} onClick={buySticker}>
            <span className="shop-ico">⭐</span>
            <span className="shop-info"><b>Sticker / artikull</b><small>Ke {stickers} stickers</small></span>
            <span className="shop-cost">{STICKER_COST}€</span>
          </button>
        </div>
      </div>
    </div>
  );
}
