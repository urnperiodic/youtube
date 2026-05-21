// ============================================================
//  MAIN — Firebase init + entry point
// ============================================================

window.addEventListener('DOMContentLoaded', () => {

  // ---- Firebase init ----
  if (CONFIG.FIREBASE.apiKey === 'YOUR_API_KEY') {
    setTimeout(() => UI.toast('⚠️ Add your Firebase config in js/config.js!', 'error'), 600);
  } else {
    firebase.initializeApp(CONFIG.FIREBASE);
  }

  // ---- Starfield ----
  document.querySelectorAll('.stars').forEach(container => {
    for (let i = 0; i < 80; i++) {
      const s = document.createElement('div');
      s.className   = 'star';
      s.style.left  = Math.random() * 100 + '%';
      s.style.top   = Math.random() * 100 + '%';
      const sz      = Math.random() * 2.5 + 0.5;
      s.style.width = s.style.height = sz + 'px';
      s.style.animationDelay = Math.random() * 3 + 's';
      container.appendChild(s);
    }
  });

  // ---- Unload cleanup ----
  window.addEventListener('beforeunload', () => {
    if (Game.code && Game.playerId) Game.leave();
  });

  // ---- Mobile touch joystick ----
  setupTouchControls();
});

function setupTouchControls() {
  const canvas = document.getElementById('gameCanvas');
  let touchStart = null;

  canvas.addEventListener('touchstart', e => {
    e.preventDefault();
    const t = e.touches[0];
    touchStart = { x: t.clientX, y: t.clientY };
  }, { passive: false });

  canvas.addEventListener('touchmove', e => {
    e.preventDefault();
    if (!touchStart || !Game.myPlayer) return;
    const t  = e.touches[0];
    const dx = t.clientX - touchStart.x;
    const dy = t.clientY - touchStart.y;
    const d  = Math.hypot(dx, dy);
    if (d > 8) {
      const spd = CONFIG.SPEED * 1.6;
      const nx = Math.max(50, Math.min(MAP.WIDTH  - 50, Game.myPlayer.x + dx / d * spd));
      const ny = Math.max(50, Math.min(MAP.HEIGHT - 50, Game.myPlayer.y + dy / d * spd));
      Game.myPlayer.x = nx;
      Game.myPlayer.y = ny;
      if (Game.players[Game.playerId]) { Game.players[Game.playerId].x = nx; Game.players[Game.playerId].y = ny; }
      Renderer.centerOn(nx, ny);
      const now = Date.now();
      if (now - Game.lastMove > CONFIG.MOVE_THROTTLE) {
        Game.lastMove = now;
        API.move(Game.code, Game.playerId, nx, ny).catch(() => {});
      }
    }
  }, { passive: false });

  canvas.addEventListener('touchend', () => { touchStart = null; }, { passive: true });
}
