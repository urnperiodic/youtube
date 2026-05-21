// ============================================================
//  MAIN — Firebase init + entry point (Modular SDK)
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCUdXqdFCzyEmORFjUVBDxRiTSsipSack0",
  authDomain: "among-us-42dfe.firebaseapp.com",
  databaseURL: "https://among-us-42dfe-default-rtdb.firebaseio.com",
  projectId: "among-us-42dfe",
  storageBucket: "among-us-42dfe.firebasestorage.app",
  messagingSenderId: "571898379716",
  appId: "1:571898379716:web:ed81ba6b6b47a5bbf63891"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Make available globally for API module
window.firebaseApp = app;
window.firebaseDatabase = database;

// Load other scripts
Promise.all([
  import('./config.js'),
  import('./map.js'),
  import('./api.js'),
  import('./game.js'),
  import('./ui.js')
]).then(() => {
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

  // ---- Show menu ----
  UI.showMenu();

  // ---- Unload cleanup ----
  window.addEventListener('beforeunload', () => {
    if (Game.code && Game.playerId) Game.leave();
  });

  // ---- Mobile touch joystick ----
  setupTouchControls();
}).catch(err => {
  console.error('Failed to load game modules:', err);
  alert('Error loading game. Check console.');
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
