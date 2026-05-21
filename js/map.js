// ============================================================
//  MAP - The Skeld layout
// ============================================================

const MAP = {
  WIDTH: 1400,
  HEIGHT: 900,
  
  // Room definitions: {id, name, x, y, w, h, color}
  ROOMS: [
    { id: 'cafeteria',     name: 'Cafeteria',     x: 300,  y: 50,  w: 280, h: 200, color: '#1a3a5c' },
    { id: 'weapons',       name: 'Weapons',        x: 620,  y: 50,  w: 200, h: 160, color: '#1a3a1a' },
    { id: 'navigation',    name: 'Navigation',     x: 860,  y: 50,  w: 220, h: 180, color: '#2a1a3a' },
    { id: 'o2',            name: 'O2',             x: 620,  y: 230, w: 160, h: 130, color: '#2a3a1a' },
    { id: 'shields',       name: 'Shields',        x: 950,  y: 250, w: 200, h: 160, color: '#3a2a1a' },
    { id: 'communications',name: 'Communications', x: 900,  y: 440, w: 240, h: 160, color: '#1a2a3a' },
    { id: 'storage',       name: 'Storage',        x: 620,  y: 560, w: 240, h: 200, color: '#2a1a1a' },
    { id: 'admin',         name: 'Admin',          x: 640,  y: 400, w: 200, h: 140, color: '#1a1a3a' },
    { id: 'electrical',    name: 'Electrical',     x: 300,  y: 520, w: 200, h: 160, color: '#3a1a1a' },
    { id: 'lower_engine',  name: 'Lower Engine',   x: 60,   y: 580, w: 220, h: 180, color: '#1a3a2a' },
    { id: 'upper_engine',  name: 'Upper Engine',   x: 60,   y: 120, w: 220, h: 180, color: '#1a3a2a' },
    { id: 'reactor',       name: 'Reactor',        x: 60,   y: 330, w: 220, h: 230, color: '#3a1a2a' },
    { id: 'security',      name: 'Security',       x: 100,  y: 400, w: 180, h: 160, color: '#2a2a1a' },
    { id: 'medbay',        name: 'MedBay',         x: 300,  y: 340, w: 180, h: 160, color: '#1a2a1a' },
  ],

  // Corridors connecting rooms
  CORRIDORS: [
    { x: 430, y: 240, w: 30, h: 110 },   // cafe -> medbay
    { x: 580, y: 140, w: 50, h: 30 },    // cafe -> weapons
    { x: 800, y: 110, w: 70, h: 30 },    // weapons -> nav
    { x: 740, y: 200, w: 30, h: 80 },    // weapons -> o2
    { x: 860, y: 340, w: 30, h: 120 },   // shields -> comms
    { x: 840, y: 430, w: 70, h: 30 },    // admin -> comms
    { x: 580, y: 440, w: 70, h: 30 },    // medbay -> admin
    { x: 480, y: 370, w: 30, h: 80 },    // medbay -> electrical
    { x: 200, y: 450, w: 110, h: 30 },   // reactor -> security
    { x: 270, y: 490, w: 40, h: 50 },    // security -> electrical
    { x: 580, y: 630, w: 50, h: 30 },    // electrical -> storage
    { x: 270, y: 600, w: 40, h: 120 },   // electrical -> lower engine
    { x: 140, y: 560, w: 30, h: 40 },    // lower engine corridor
    { x: 270, y: 290, w: 40, h: 60 },    // upper engine -> reactor
    { x: 140, y: 290, w: 30, h: 50 },    // reactor corridor
    { x: 840, y: 120, w: 30, h: 140 },   // nav -> shields
  ],

  // Task locations
  TASKS: [
    { id: 't_cafe_wires',  room: 'Cafeteria',      type: 'Fix Wiring',          x: 360, y: 130, icon: '⚡' },
    { id: 't_cafe_data',   room: 'Cafeteria',      type: 'Download Data',       x: 430, y: 90,  icon: '📡' },
    { id: 't_cafe_trash',  room: 'Cafeteria',      type: 'Empty Garbage',       x: 540, y: 180, icon: '🗑️' },
    { id: 't_wpn_aim',     room: 'Weapons',        type: 'Calibrate Targeting', x: 680, y: 100, icon: '🎯' },
    { id: 't_nav_steer',   room: 'Navigation',     type: 'Stabilize Steering',  x: 920, y: 110, icon: '🛸' },
    { id: 't_nav_charts',  room: 'Navigation',     type: 'Chart Course',         x: 1000,y: 140, icon: '🗺️' },
    { id: 't_o2_filter',   room: 'O2',             type: 'Clean O2 Filter',     x: 680, y: 280, icon: '🌿' },
    { id: 't_shields',     room: 'Shields',        type: 'Prime Shields',       x: 1010,y: 310, icon: '🛡️' },
    { id: 't_comms_upload',room: 'Communications', type: 'Upload Data',         x: 960, y: 490, icon: '📶' },
    { id: 't_storage_fuel',room: 'Storage',        type: 'Fuel Engines',        x: 680, y: 610, icon: '⛽' },
    { id: 't_admin_swipe', room: 'Admin',          type: 'Swipe Card',          x: 700, y: 450, icon: '💳' },
    { id: 't_elec_wires',  room: 'Electrical',     type: 'Fix Wiring',          x: 360, y: 570, icon: '⚡' },
    { id: 't_elec_divert', room: 'Electrical',     type: 'Divert Power',        x: 430, y: 610, icon: '🔌' },
    { id: 't_engine_lo',   room: 'Lower Engine',   type: 'Align Engine Output', x: 130, y: 640, icon: '⚙️' },
    { id: 't_engine_up',   room: 'Upper Engine',   type: 'Align Engine Output', x: 130, y: 180, icon: '⚙️' },
    { id: 't_reactor',     room: 'Reactor',        type: 'Start Reactor',       x: 120, y: 420, icon: '☢️' },
    { id: 't_security',    room: 'Security',       type: 'Check Cameras',       x: 155, y: 450, icon: '📷' },
    { id: 't_medbay_scan', room: 'MedBay',         type: 'Submit Scan',         x: 360, y: 400, icon: '🩺' },
    { id: 't_medbay_samp', room: 'MedBay',         type: 'Inspect Sample',      x: 420, y: 440, icon: '🔬' },
    { id: 't_storage_sort',room: 'Storage',        type: 'Sort Samples',        x: 750, y: 660, icon: '📦' },
  ],

  // Sabotage fix locations
  SABOTAGE_FIX: {
    reactor:  [{ x: 100, y: 370, label: 'Reactor L' }, { x: 200, y: 500, label: 'Reactor R' }],
    o2:       [{ x: 690, y: 260, label: 'O2 Panel' }],
    lights:   [{ x: 360, y: 570, label: 'Electrical' }],
    comms:    [{ x: 1000, y: 490, label: 'Comms Panel' }],
  },

  // Door locations (for imposter panel)
  DOORS: [
    { name: 'Cafeteria Left',  x: 370, y: 245, w: 30, h: 10 },
    { name: 'Cafeteria Right', x: 510, y: 245, w: 30, h: 10 },
    { name: 'Admin Top',       x: 700, y: 395, w: 30, h: 10 },
    { name: 'Admin Bottom',    x: 700, y: 538, w: 30, h: 10 },
    { name: 'Storage Top',     x: 680, y: 555, w: 30, h: 10 },
    { name: 'MedBay Door',     x: 375, y: 338, w: 30, h: 10 },
    { name: 'Security Door',   x: 275, y: 395, w: 30, h: 10 },
    { name: 'Electrical Door', x: 370, y: 515, w: 30, h: 10 },
  ],

  // Emergency button location (cafeteria center)
  EMERGENCY_BTN: { x: 440, y: 160 },
};

// ---- RENDERER ----
const Renderer = {
  canvas: null,
  ctx: null,
  camera: { x: 0, y: 0 },
  
  init(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.resize();
    window.addEventListener('resize', () => this.resize());
  },
  
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  },
  
  worldToScreen(wx, wy) {
    return {
      x: wx - this.camera.x + this.canvas.width / 2,
      y: wy - this.camera.y + this.canvas.height / 2
    };
  },
  
  screenToWorld(sx, sy) {
    return {
      x: sx + this.camera.x - this.canvas.width / 2,
      y: sy + this.camera.y - this.canvas.height / 2
    };
  },
  
  centerOn(x, y) {
    this.camera.x = x;
    this.camera.y = y;
  },
  
  clear() {
    this.ctx.fillStyle = '#0a0e1a';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  },
  
  drawMap(gameState) {
    const ctx = this.ctx;
    const doors = gameState?.state?.doors || {};
    const now = Date.now();
    
    // Draw corridors
    MAP.CORRIDORS.forEach(c => {
      const s = this.worldToScreen(c.x, c.y);
      ctx.fillStyle = '#1e2435';
      ctx.fillRect(s.x, s.y, c.w, c.h);
    });
    
    // Draw rooms
    MAP.ROOMS.forEach(room => {
      const s = this.worldToScreen(room.x, room.y);
      
      ctx.fillStyle = room.color;
      ctx.strokeStyle = '#3a4a6a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(s.x, s.y, room.w, room.h, 6);
      ctx.fill();
      ctx.stroke();
      
      // Room label
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.font = 'bold 11px Exo 2';
      ctx.textAlign = 'center';
      ctx.fillText(room.name, s.x + room.w/2, s.y + 16);
    });
    
    // Draw doors
    MAP.DOORS.forEach(door => {
      const s = this.worldToScreen(door.x, door.y);
      const dState = doors[door.name];
      const isLocked = dState && !dState.open && dState.disabledUntil > now;
      
      ctx.fillStyle = isLocked ? '#ff3333' : '#4a6a9a';
      ctx.fillRect(s.x, s.y, door.w, door.h);
      
      if (isLocked) {
        ctx.fillStyle = '#fff';
        ctx.font = '8px Exo 2';
        ctx.textAlign = 'center';
        ctx.fillText('🔒', s.x + door.w/2, s.y + door.h - 1);
      }
    });
    
    // Draw tasks
    this.drawTasks(gameState);
    
    // Draw emergency button
    const eb = this.worldToScreen(MAP.EMERGENCY_BTN.x, MAP.EMERGENCY_BTN.y);
    ctx.fillStyle = '#cc2222';
    ctx.beginPath();
    ctx.arc(eb.x, eb.y, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ff4444';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 9px Exo 2';
    ctx.textAlign = 'center';
    ctx.fillText('SOS', eb.x, eb.y + 3);
    
    // Draw sabotage fix points
    if (gameState?.state?.sabotage) {
      const sab = gameState.state.sabotage;
      const fixes = MAP.SABOTAGE_FIX[sab.type] || [];
      fixes.forEach(fix => {
        const sf = this.worldToScreen(fix.x, fix.y);
        ctx.fillStyle = `rgba(255,80,0,${0.6 + 0.4 * Math.sin(Date.now()/200)})`;
        ctx.beginPath();
        ctx.arc(sf.x, sf.y, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 10px Exo 2';
        ctx.textAlign = 'center';
        ctx.fillText('FIX', sf.x, sf.y + 4);
      });
    }
  },
  
  drawTasks(gameState) {
    const ctx = this.ctx;
    const myPlayer = gameState?.players?.find(p => p.id === Game.playerId);
    const myTasks = myPlayer?.tasks || [];
    const myTaskIds = new Set(myTasks.map(t => t.id));
    const doneIds = new Set(myTasks.filter(t => t.done).map(t => t.id));
    
    MAP.TASKS.forEach(task => {
      if (!myTaskIds.has(task.id)) return;
      const s = this.worldToScreen(task.x, task.y);
      const done = doneIds.has(task.id);
      
      ctx.globalAlpha = done ? 0.4 : 1;
      ctx.fillStyle = done ? '#3a6a3a' : '#2a4a7a';
      ctx.strokeStyle = done ? '#4aaa4a' : '#4a8afa';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(s.x, s.y, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      ctx.font = '14px serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#fff';
      ctx.fillText(task.icon, s.x, s.y + 5);
      ctx.globalAlpha = 1;
    });
  },
  
  drawBodies(bodies) {
    const ctx = this.ctx;
    bodies.forEach(body => {
      const s = this.worldToScreen(body.x, body.y);
      if (body.reportedBy) return;
      
      // Dead body (flipped crewmate)
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(Math.PI / 2);
      this.drawCrewmate(ctx, 0, 0, 14, '#cc2222', true, false);
      ctx.restore();
      
      // Report indicator
      ctx.fillStyle = '#ff4444';
      ctx.font = '10px Exo 2';
      ctx.textAlign = 'center';
      ctx.fillText('REPORT', s.x, s.y - 20);
    });
  },
  
  drawPlayers(players, myId, myRole, myStatus) {
    const ctx = this.ctx;
    
    players.forEach((player, i) => {
      if (!player.visible && player.id !== myId) return;
      
      const s = this.worldToScreen(player.x, player.y);
      const isMe = player.id === myId;
      const isGhost = player.status === 'ghost';
      const color = getColor(i);
      
      if (isGhost) {
        // Ghosts: draw with transparency
        if (myStatus === 'ghost' || myRole === 'impostor') {
          ctx.globalAlpha = 0.45;
          this.drawCrewmate(ctx, s.x, s.y, 16, color, false, true);
          ctx.globalAlpha = 1;
        } else {
          return; // Invisible to living crewmates
        }
      } else {
        this.drawCrewmate(ctx, s.x, s.y, 16, color, false, false);
      }
      
      // Name tag
      ctx.globalAlpha = isGhost ? 0.5 : 1;
      ctx.fillStyle = isMe ? '#ffe066' : '#ffffff';
      ctx.font = `bold ${isMe ? 12 : 11}px Exo 2`;
      ctx.textAlign = 'center';
      ctx.fillText(player.name, s.x, s.y - 24);
      
      // Impostor indicator (only visible to impostors)
      if (player.role === 'impostor' && myRole === 'impostor' && !isMe) {
        ctx.fillStyle = '#ff3333';
        ctx.font = 'bold 10px Exo 2';
        ctx.fillText('👿', s.x + 14, s.y - 14);
      }
      
      ctx.globalAlpha = 1;
    });
  },
  
  drawCrewmate(ctx, x, y, r, color, dead, ghost) {
    // Body
    ctx.fillStyle = color;
    ctx.beginPath();
    if (dead) {
      ctx.ellipse(x, y, r * 1.2, r * 0.7, 0, 0, Math.PI * 2);
    } else {
      ctx.ellipse(x, y, r * 0.8, r, 0, 0, Math.PI * 2);
    }
    ctx.fill();
    
    // Backpack
    if (!dead) {
      ctx.fillStyle = darken(color, 20);
      ctx.beginPath();
      ctx.ellipse(x + r * 0.6, y + r * 0.2, r * 0.4, r * 0.6, 0.3, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Visor
    ctx.fillStyle = ghost ? 'rgba(150,220,255,0.7)' : '#4af';
    ctx.beginPath();
    ctx.ellipse(x - r * 0.15, y - r * 0.25, r * 0.55, r * 0.38, -0.3, 0, Math.PI * 2);
    ctx.fill();
    
    // Visor shine
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.beginPath();
    ctx.ellipse(x - r * 0.3, y - r * 0.35, r * 0.15, r * 0.1, -0.5, 0, Math.PI * 2);
    ctx.fill();
  },
  
  drawVisionOverlay(player, gameState) {
    if (!player) return;
    const ctx = this.ctx;
    const s = this.worldToScreen(player.x, player.y);
    const lights = gameState?.state?.sabotage?.type === 'lights';
    
    const visionRadius = lights
      ? (player.role === 'impostor' ? 200 : 60)
      : (player.role === 'impostor' ? 999 : 400);
    
    if (visionRadius >= 900) return;
    
    // Dark overlay with circular cutout
    const gradient = ctx.createRadialGradient(s.x, s.y, visionRadius * 0.6, s.x, s.y, visionRadius);
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(1, 'rgba(0,0,8,0.97)');
    
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    
    // Fill everything dark
    ctx.fillStyle = 'rgba(0,0,8,0.97)';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Cut out vision circle
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(255,255,255,1)';
    ctx.beginPath();
    ctx.arc(s.x, s.y, visionRadius * 0.7, 0, Math.PI * 2);
    ctx.fill();
    
    // Soft edge
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(s.x, s.y, visionRadius, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  },
  
  drawSabotageOverlay(gameState) {
    if (!gameState?.state?.sabotage) return;
    const sab = gameState.state.sabotage;
    const ctx = this.ctx;
    const t = Date.now() / 1000;
    
    if (sab.type === 'reactor' || sab.type === 'o2') {
      const remaining = ((sab.expiresAt || 0) - Date.now()) / 1000;
      if (remaining < 0) return;
      const pct = remaining / (sab.type === 'reactor' ? 45 : 30);
      
      ctx.fillStyle = `rgba(255, 0, 0, ${0.1 + 0.1 * Math.sin(t * 4)})`;
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      // Countdown bar at top
      ctx.fillStyle = `rgba(255,${Math.floor(100*pct)},0,0.9)`;
      ctx.fillRect(0, 0, this.canvas.width * pct, 6);
    }
    
    if (sab.type === 'lights') {
      // Already handled by vision overlay
    }
  },
  
  drawHUD(gameState, myPlayer, tasksTotal, tasksDone, killCd, sabCd) {
    const ctx = this.ctx;
    
    // Task bar (top center)
    const barW = 200, barH = 12;
    const bx = (this.canvas.width - barW) / 2, by = 8;
    ctx.fillStyle = '#1a2a1a';
    ctx.fillRect(bx, by, barW, barH);
    ctx.fillStyle = '#44ff44';
    ctx.fillRect(bx, by, barW * (tasksTotal > 0 ? tasksDone / tasksTotal : 0), barH);
    ctx.strokeStyle = '#4aaa4a';
    ctx.lineWidth = 1;
    ctx.strokeRect(bx, by, barW, barH);
    ctx.fillStyle = '#fff';
    ctx.font = '9px Exo 2';
    ctx.textAlign = 'center';
    ctx.fillText(`Tasks: ${tasksDone}/${tasksTotal}`, bx + barW/2, by + barH - 2);
  }
};

function darken(hex, amount) {
  const num = parseInt(hex.replace('#',''), 16);
  const r = Math.max(0, (num >> 16) - amount);
  const g = Math.max(0, ((num >> 8) & 0xff) - amount);
  const b = Math.max(0, (num & 0xff) - amount);
  return `rgb(${r},${g},${b})`;
}