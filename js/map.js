// ============================================================
//  MAP — The Skeld (2x scale, better layout)
// ============================================================

const MAP = {
  WIDTH:  2800,
  HEIGHT: 1800,

  ROOMS: [
    { id:'cafeteria',      name:'Cafeteria',      x:580,  y:80,   w:520, h:380, color:'#0d2a45' },
    { id:'weapons',        name:'Weapons',         x:1180, y:80,   w:360, h:300, color:'#0d2a0d' },
    { id:'navigation',     name:'Navigation',      x:1600, y:80,   w:400, h:340, color:'#1a0d2a' },
    { id:'o2',             name:'O2',              x:1180, y:440,  w:300, h:240, color:'#1a2a0d' },
    { id:'shields',        name:'Shields',         x:1780, y:460,  w:380, h:300, color:'#2a1a0d' },
    { id:'communications', name:'Communications',  x:1680, y:840,  w:440, h:300, color:'#0d1a2a' },
    { id:'storage',        name:'Storage',         x:1180, y:1080, w:440, h:380, color:'#2a0d0d' },
    { id:'admin',          name:'Admin',           x:1200, y:760,  w:380, h:260, color:'#0d0d2a' },
    { id:'electrical',     name:'Electrical',      x:540,  y:1000, w:380, h:300, color:'#2a0d0d' },
    { id:'lower_engine',   name:'Lower Engine',    x:80,   y:1120, w:420, h:340, color:'#0d2a1a' },
    { id:'upper_engine',   name:'Upper Engine',    x:80,   y:200,  w:420, h:340, color:'#0d2a1a' },
    { id:'reactor',        name:'Reactor',         x:80,   y:620,  w:420, h:440, color:'#2a0d1a' },
    { id:'security',       name:'Security',        x:160,  y:760,  w:340, h:300, color:'#1a1a0d' },
    { id:'medbay',         name:'MedBay',          x:540,  y:640,  w:360, h:300, color:'#0d2a0d' },
  ],

  CORRIDORS: [
    // cafe <-> upper engine
    { x:500, y:260, w:90,  h:60  },
    // cafe bottom <-> medbay
    { x:700, y:455, w:60,  h:200 },
    // cafe <-> weapons
    { x:1095,y:180, w:100, h:60  },
    // weapons <-> navigation
    { x:1535,y:160, w:80,  h:60  },
    // weapons <-> o2
    { x:1260,y:375, w:60,  h:80  },
    // navigation <-> shields
    { x:1650,y:415, w:60,  h:60  },
    // shields <-> comms
    { x:1840,y:755, w:60,  h:100 },
    // admin <-> comms
    { x:1580,y:900, w:110, h:60  },
    // medbay <-> admin
    { x:890, y:820, w:320, h:60  },
    // medbay <-> electrical
    { x:590, y:935, w:60,  h:80  },
    // electrical <-> storage
    { x:900, y:1150,w:300, h:60  },
    // electrical <-> lower engine
    { x:490, y:1140,w:60,  h:100 },
    // upper engine <-> reactor
    { x:130, y:535, w:60,  h:100 },
    // reactor <-> security
    { x:340, y:870, w:120, h:60  },
    // lower engine corridor
    { x:130, y:1050,w:60,  h:80  },
    // security <-> electrical
    { x:495, y:870, w:60,  h:200 },
    // o2 <-> admin
    { x:1260,y:680, w:60,  h:90  },
    // storage <-> comms
    { x:1480,y:1130,w:220, h:60  },
  ],

  TASKS: [
    { id:'t_cafe_wires',   room:'Cafeteria',      type:'Fix Wiring',          x:680,  y:220,  icon:'⚡' },
    { id:'t_cafe_data',    room:'Cafeteria',      type:'Download Data',       x:820,  y:150,  icon:'📡' },
    { id:'t_cafe_trash',   room:'Cafeteria',      type:'Empty Garbage',       x:1020, y:360,  icon:'🗑️' },
    { id:'t_wpn_aim',      room:'Weapons',        type:'Calibrate Targeting', x:1300, y:180,  icon:'🎯' },
    { id:'t_nav_steer',    room:'Navigation',     type:'Stabilize Steering',  x:1700, y:180,  icon:'🛸' },
    { id:'t_nav_charts',   room:'Navigation',     type:'Chart Course',        x:1870, y:240,  icon:'🗺️' },
    { id:'t_o2_filter',    room:'O2',             type:'Clean O2 Filter',     x:1290, y:530,  icon:'🌿' },
    { id:'t_shields',      room:'Shields',        type:'Prime Shields',       x:1920, y:570,  icon:'🛡️' },
    { id:'t_comms_upload', room:'Communications', type:'Upload Data',         x:1820, y:950,  icon:'📶' },
    { id:'t_storage_fuel', room:'Storage',        type:'Fuel Engines',        x:1300, y:1200, icon:'⛽' },
    { id:'t_admin_swipe',  room:'Admin',          type:'Swipe Card',          x:1340, y:860,  icon:'💳' },
    { id:'t_elec_wires',   room:'Electrical',     type:'Fix Wiring',          x:640,  y:1100, icon:'⚡' },
    { id:'t_elec_divert',  room:'Electrical',     type:'Divert Power',        x:790,  y:1200, icon:'🔌' },
    { id:'t_engine_lo',    room:'Lower Engine',   type:'Align Engine Output', x:220,  y:1280, icon:'⚙️' },
    { id:'t_engine_up',    room:'Upper Engine',   type:'Align Engine Output', x:220,  y:340,  icon:'⚙️' },
    { id:'t_reactor',      room:'Reactor',        type:'Start Reactor',       x:220,  y:820,  icon:'☢️' },
    { id:'t_security',     room:'Security',       type:'Check Cameras',       x:290,  y:870,  icon:'📷' },
    { id:'t_medbay_scan',  room:'MedBay',         type:'Submit Scan',         x:650,  y:760,  icon:'🩺' },
    { id:'t_medbay_samp',  room:'MedBay',         type:'Inspect Sample',      x:820,  y:850,  icon:'🔬' },
    { id:'t_storage_sort', room:'Storage',        type:'Sort Samples',        x:1480, y:1320, icon:'📦' },
  ],

  SABOTAGE_FIX: {
    reactor: [{ x:160, y:700 }, { x:160, y:980 }],
    o2:      [{ x:1290, y:500 }],
    lights:  [{ x:640,  y:1080 }],
    comms:   [{ x:1820, y:920 }],
  },

  DOORS: [
    { name:'Cafeteria Left',  x:670,  y:458, w:60, h:16 },
    { name:'Cafeteria Right', x:950,  y:458, w:60, h:16 },
    { name:'Admin Top',       x:1300, y:758, w:60, h:16 },
    { name:'Admin Bottom',    x:1300, y:1018,w:60, h:16 },
    { name:'Storage Top',     x:1260, y:1078,w:60, h:16 },
    { name:'MedBay Door',     x:698,  y:638, w:60, h:16 },
    { name:'Security Door',   x:498,  y:858, w:60, h:16 },
    { name:'Electrical Door', x:698,  y:998, w:60, h:16 },
  ],

  EMERGENCY_BTN: { x:840, y:300 },
};

// ============================================================
//  RENDERER
// ============================================================
const Renderer = {
  canvas: null,
  ctx:    null,
  camera: { x: 0, y: 0 },

  init(canvas) {
    this.canvas = canvas;
    this.ctx    = canvas.getContext('2d');
    this.resize();
    window.addEventListener('resize', () => this.resize());
  },

  resize() {
    this.canvas.width  = window.innerWidth;
    this.canvas.height = window.innerHeight;
  },

  worldToScreen(wx, wy) {
    return {
      x: wx - this.camera.x + this.canvas.width  / 2,
      y: wy - this.camera.y + this.canvas.height / 2,
    };
  },

  screenToWorld(sx, sy) {
    return {
      x: sx + this.camera.x - this.canvas.width  / 2,
      y: sy + this.camera.y - this.canvas.height / 2,
    };
  },

  centerOn(x, y) {
    this.camera.x = x;
    this.camera.y = y;
  },

  clear() {
    this.ctx.fillStyle = '#06090f';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  },

  // ── MAP ──
  drawMap(gameState) {
    const ctx   = this.ctx;
    const doors = gameState?.state?.doors || {};
    const now   = Date.now();

    // Corridors
    MAP.CORRIDORS.forEach(c => {
      const s = this.worldToScreen(c.x, c.y);
      ctx.fillStyle = '#111827';
      ctx.fillRect(s.x, s.y, c.w, c.h);
      // corridor border
      ctx.strokeStyle = '#1e2d45';
      ctx.lineWidth = 1;
      ctx.strokeRect(s.x, s.y, c.w, c.h);
    });

    // Rooms
    MAP.ROOMS.forEach(room => {
      const s = this.worldToScreen(room.x, room.y);

      // Room shadow
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.fillRect(s.x + 4, s.y + 4, room.w, room.h);

      // Room fill
      ctx.fillStyle = room.color;
      ctx.strokeStyle = '#2a4a7a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(s.x, s.y, room.w, room.h, 10);
      ctx.fill();
      ctx.stroke();

      // Inner highlight line at top
      ctx.strokeStyle = 'rgba(255,255,255,0.07)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(s.x + 12, s.y + 2);
      ctx.lineTo(s.x + room.w - 12, s.y + 2);
      ctx.stroke();

      // Room name
      ctx.fillStyle = 'rgba(255,255,255,0.75)';
      ctx.font = 'bold 14px Exo 2';
      ctx.textAlign = 'center';
      ctx.fillText(room.name, s.x + room.w / 2, s.y + 22);
    });

    // Doors
    MAP.DOORS.forEach(door => {
      const s      = this.worldToScreen(door.x, door.y);
      const dState = doors[door.name];
      const locked = dState && !dState.open && dState.disabledUntil > now;

      if (locked) {
        ctx.fillStyle = '#cc2222';
        ctx.shadowColor = '#ff0000';
        ctx.shadowBlur  = 8;
      } else {
        ctx.fillStyle = '#2a5a9a';
        ctx.shadowBlur = 0;
      }
      ctx.fillRect(s.x, s.y, door.w, door.h);
      ctx.shadowBlur = 0;
    });

    // Emergency button
    const eb = this.worldToScreen(MAP.EMERGENCY_BTN.x, MAP.EMERGENCY_BTN.y);
    const pulse = 0.15 + 0.08 * Math.sin(Date.now() / 400);
    ctx.fillStyle   = '#cc1111';
    ctx.shadowColor = '#ff3333';
    ctx.shadowBlur  = 20;
    ctx.beginPath();
    ctx.arc(eb.x, eb.y, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#ff5555';
    ctx.lineWidth   = 3;
    ctx.stroke();
    ctx.fillStyle   = '#fff';
    ctx.font        = 'bold 11px Exo 2';
    ctx.textAlign   = 'center';
    ctx.fillText('SOS', eb.x, eb.y + 4);

    // Tasks
    this.drawTasks(gameState);

    // Sabotage fix markers
    if (gameState?.state?.sabotage) {
      const sab   = gameState.state.sabotage;
      const fixes = MAP.SABOTAGE_FIX[sab.type] || [];
      fixes.forEach(fix => {
        const sf    = this.worldToScreen(fix.x, fix.y);
        const alpha = 0.7 + 0.3 * Math.sin(Date.now() / 180);
        ctx.fillStyle   = `rgba(255,80,0,${alpha})`;
        ctx.shadowColor = '#ff5500';
        ctx.shadowBlur  = 16;
        ctx.beginPath();
        ctx.arc(sf.x, sf.y, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle  = '#fff';
        ctx.font       = 'bold 11px Exo 2';
        ctx.textAlign  = 'center';
        ctx.fillText('FIX', sf.x, sf.y + 4);
      });
    }
  },

  drawTasks(gameState) {
    const ctx     = this.ctx;
    const me      = gameState?.players?.find(p => p.id === Game.playerId);
    const myTasks = Object.values(me?.tasks || {});
    const myIds   = new Set(myTasks.map(t => t.id));
    const doneIds = new Set(myTasks.filter(t => t.done).map(t => t.id));

    MAP.TASKS.forEach(task => {
      if (!myIds.has(task.id)) return;
      const s    = this.worldToScreen(task.x, task.y);
      const done = doneIds.has(task.id);

      ctx.globalAlpha   = done ? 0.4 : 1;
      ctx.fillStyle     = done ? '#1a4a1a' : '#1a3a6a';
      ctx.strokeStyle   = done ? '#44cc44' : '#44aaff';
      ctx.lineWidth     = 2;
      ctx.shadowColor   = done ? '#44cc44' : '#44aaff';
      ctx.shadowBlur    = done ? 0 : 8;
      ctx.beginPath();
      ctx.arc(s.x, s.y, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur  = 0;
      ctx.font        = '16px serif';
      ctx.textAlign   = 'center';
      ctx.fillStyle   = '#fff';
      ctx.fillText(task.icon, s.x, s.y + 6);
      ctx.globalAlpha = 1;
    });
  },

  // ── BODIES ──
  drawBodies(bodies) {
    const ctx = this.ctx;
    bodies.forEach(body => {
      if (body.reportedBy) return;
      const s = this.worldToScreen(body.x, body.y);

      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(Math.PI / 2);
      this.drawCrewmate(ctx, 0, 0, 18, '#cc2222', true, false);
      ctx.restore();

      // Blinking report label
      ctx.globalAlpha = 0.7 + 0.3 * Math.sin(Date.now() / 300);
      ctx.fillStyle   = '#ff4444';
      ctx.font        = 'bold 11px Exo 2';
      ctx.textAlign   = 'center';
      ctx.fillText('⚠ REPORT', s.x, s.y - 28);
      ctx.globalAlpha = 1;
    });
  },

  // ── PLAYERS ──
  drawPlayers(players, myId, myRole, myStatus) {
    const ctx = this.ctx;

    players.forEach((player, i) => {
      if (!player.visible && player.id !== myId) return;

      const s       = this.worldToScreen(player.x, player.y);
      const isMe    = player.id === myId;
      const isGhost = player.status === 'ghost';
      const color   = getColor(i);

      if (isGhost) {
        if (myStatus === 'ghost' || myRole === 'impostor') {
          ctx.globalAlpha = 0.4;
          this.drawCrewmate(ctx, s.x, s.y, 20, color, false, true);
          ctx.globalAlpha = 1;
        } else {
          return;
        }
      } else {
        this.drawCrewmate(ctx, s.x, s.y, 20, color, false, false);
      }

      // "YOU" arrow above local player
      if (isMe) {
        ctx.fillStyle = '#ffe066';
        ctx.beginPath();
        ctx.moveTo(s.x,      s.y - 44);
        ctx.lineTo(s.x - 8,  s.y - 56);
        ctx.lineTo(s.x + 8,  s.y - 56);
        ctx.closePath();
        ctx.fill();
      }

      // Name tag
      ctx.globalAlpha = isGhost ? 0.5 : 1;
      ctx.fillStyle   = isMe ? '#ffe066' : '#ffffff';
      ctx.font        = `bold ${isMe ? 13 : 12}px Exo 2`;
      ctx.textAlign   = 'center';

      // Name shadow
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur  = 4;
      ctx.fillText(player.name, s.x, s.y - 30);
      ctx.shadowBlur  = 0;

      // Impostor mark (visible only to impostors)
      if (player.role === 'impostor' && myRole === 'impostor' && !isMe) {
        ctx.fillStyle = '#ff3333';
        ctx.font      = '12px Exo 2';
        ctx.fillText('👿', s.x + 18, s.y - 18);
      }

      ctx.globalAlpha = 1;
    });
  },

  drawCrewmate(ctx, x, y, r, color, dead, ghost) {
    const dr = darken(color, 25);

    if (dead) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.ellipse(x, y, r * 1.4, r * 0.8, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Body
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.ellipse(x, y + r * 0.1, r * 0.85, r, 0, 0, Math.PI * 2);
      ctx.fill();

      // Backpack
      ctx.fillStyle = dr;
      ctx.beginPath();
      ctx.ellipse(x + r * 0.65, y + r * 0.2, r * 0.42, r * 0.65, 0.3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Visor
    ctx.fillStyle = ghost ? 'rgba(150,220,255,0.65)' : '#33aaff';
    ctx.shadowColor = ghost ? 'rgba(150,220,255,0.5)' : 'rgba(50,150,255,0.6)';
    ctx.shadowBlur  = ghost ? 6 : 4;
    ctx.beginPath();
    ctx.ellipse(x - r * 0.12, y - r * 0.28, r * 0.58, r * 0.4, -0.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Visor shine
    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.beginPath();
    ctx.ellipse(x - r * 0.32, y - r * 0.38, r * 0.18, r * 0.12, -0.5, 0, Math.PI * 2);
    ctx.fill();
  },

  // ── VISION OVERLAY ──
  drawVisionOverlay(player, gameState) {
    if (!player) return;
    const ctx    = this.ctx;
    const s      = this.worldToScreen(player.x, player.y);
    const lights = gameState?.state?.sabotage?.type === 'lights';

    const vr = lights
      ? (player.role === 'impostor' ? 260 : 80)
      : (player.role === 'impostor' ? 9999 : 500);

    if (vr >= 900) return;

    const g = ctx.createRadialGradient(s.x, s.y, vr * 0.55, s.x, s.y, vr);
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(1, 'rgba(0,0,8,0.98)');

    ctx.save();
    ctx.fillStyle = 'rgba(0,0,8,0.98)';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(255,255,255,1)';
    ctx.beginPath();
    ctx.arc(s.x, s.y, vr * 0.75, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(s.x, s.y, vr, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },

  // ── SABOTAGE OVERLAY ──
  drawSabotageOverlay(gameState) {
    if (!gameState?.state?.sabotage) return;
    const sab = gameState.state.sabotage;
    const ctx = this.ctx;
    const t   = Date.now() / 1000;

    if (sab.type === 'reactor' || sab.type === 'o2') {
      const rem = ((sab.expiresAt || 0) - Date.now()) / 1000;
      if (rem < 0) return;
      const pct = rem / (sab.type === 'reactor' ? 45 : 30);

      ctx.fillStyle = `rgba(255,0,0,${0.08 + 0.08 * Math.sin(t * 5)})`;
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      // Countdown bar
      ctx.fillStyle = `rgba(255,${Math.floor(pct * 140)},0,0.95)`;
      ctx.fillRect(0, 0, this.canvas.width * pct, 8);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 12px Exo 2';
      ctx.textAlign = 'center';
      ctx.fillText(`${Math.ceil(rem)}s`, this.canvas.width / 2, 20);
    }
  },

  // ── KILL BUTTON (drawn on canvas, bottom right for impostor) ──
  drawKillButton(myPlayer, players, settings) {
    if (!myPlayer || myPlayer.role !== 'impostor' || myPlayer.status !== 'alive') return;
    const ctx = this.ctx;
    const cd  = settings?.killCooldown || 25;
    const elapsed = (Date.now() - (Game.lastKillTs || 0)) / 1000;
    const ready    = elapsed >= cd;
    const pct      = Math.min(1, elapsed / cd);

    const bx = this.canvas.width  - 100;
    const by = this.canvas.height - 100;
    const br = 44;

    // Check if anyone in range
    const inRange = Object.values(players).some(p =>
      p.id !== myPlayer.id && p.role === 'crewmate' && p.status === 'alive' &&
      Math.hypot(myPlayer.x - p.x, myPlayer.y - p.y) < CONFIG.KILL_RADIUS
    );

    // Cooldown arc
    ctx.strokeStyle = ready ? (inRange ? '#ff4444' : '#884444') : '#444';
    ctx.lineWidth   = 5;
    ctx.beginPath();
    ctx.arc(bx, by, br + 6, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * pct);
    ctx.stroke();

    // Button circle
    ctx.fillStyle   = ready && inRange ? '#cc1111' : '#441111';
    ctx.shadowColor = ready && inRange ? '#ff3333' : 'transparent';
    ctx.shadowBlur  = ready && inRange ? 20 : 0;
    ctx.beginPath();
    ctx.arc(bx, by, br, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = ready ? '#fff' : '#888';
    ctx.font      = '22px serif';
    ctx.textAlign = 'center';
    ctx.fillText('🔪', bx, by + 8);

    if (!ready) {
      ctx.fillStyle = '#aaa';
      ctx.font      = 'bold 11px Exo 2';
      ctx.fillText(`${Math.ceil(cd - elapsed)}s`, bx, by + 26);
    }

    // Make clickable
    this._killBtnBounds = { x: bx, y: by, r: br };
  },

  _killBtnBounds: null,

  isKillBtnClick(cx, cy) {
    if (!this._killBtnBounds) return false;
    const b = this._killBtnBounds;
    return Math.hypot(cx - b.x, cy - b.y) < b.r;
  },

  // ── HUD TASK BAR ──
  drawHUD(gameState, myPlayer, tasksTotal, tasksDone) {
    const ctx = this.ctx;
    const bw  = 240, bh = 14;
    const bx  = (this.canvas.width - bw) / 2, by = 8;

    ctx.fillStyle = '#0a1a0a';
    ctx.fillRect(bx, by, bw, bh);
    ctx.fillStyle = '#44ff44';
    ctx.fillRect(bx, by, bw * (tasksTotal > 0 ? tasksDone / tasksTotal : 0), bh);
    ctx.strokeStyle = '#4aaa4a';
    ctx.lineWidth   = 1;
    ctx.strokeRect(bx, by, bw, bh);
    ctx.fillStyle   = '#fff';
    ctx.font        = '9px Exo 2';
    ctx.textAlign   = 'center';
    ctx.fillText(`Tasks: ${tasksDone}/${tasksTotal}`, bx + bw / 2, by + bh - 2);
  },
};

function darken(hex, amount) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r   = Math.max(0, (num >> 16) - amount);
  const g   = Math.max(0, ((num >> 8) & 0xff) - amount);
  const b   = Math.max(0, (num & 0xff) - amount);
  return `rgb(${r},${g},${b})`;
}
