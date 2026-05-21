// ============================================================
//  GAME — Core game logic (Firebase realtime version)
//  No polling. Firebase listeners push all state changes.
// ============================================================

const Game = {
  code:        null,
  playerId:    null,
  playerName:  null,
  isHost:      false,

  // Live state (assembled from Firebase listeners)
  room:        null,   // room metadata + settings + state
  players:     {},     // { [id]: playerObj }
  chat:        [],

  // Derived convenience refs
  myRole:      null,
  myStatus:    null,
  myPlayer:    null,

  // Input / timing
  keys:        {},
  lastMove:    0,
  lastKillTs:  0,

  // RAF handle
  animFrame:   null,

  // Firebase unsubscribe fns
  _unsubs:     [],

  // ---- ID ----
  _genId() { return 'p_' + Math.random().toString(36).substr(2, 9); },

  // ---- CREATE / JOIN ----

  async createRoom() {
    const name = document.getElementById('playerName').value.trim() || 'Player';
    this.playerId   = this._genId();
    this.playerName = name;
    this.isHost     = true;

    UI.showScreen('screen-create');
    document.getElementById('createdCode').textContent = '...';
    document.getElementById('createSpinner').style.display = 'block';

    try {
      const { code } = await API.createRoom(this.playerId, name);
      this.code = code;
      document.getElementById('createdCode').textContent = code;
      document.getElementById('createSpinner').style.display = 'none';
      setTimeout(() => { UI.showScreen('screen-lobby'); this._attachListeners(); }, 1200);
    } catch (e) {
      UI.toast('Failed to create room: ' + e.message, 'error');
      UI.showScreen('screen-menu');
    }
  },

  async joinRoom() {
    const code = document.getElementById('joinCode').value.trim().toUpperCase();
    const name = document.getElementById('playerName').value.trim() || 'Player';
    if (code.length < 4) { UI.toast('Enter a valid room code', 'error'); return; }

    this.playerId   = this._genId();
    this.playerName = name;
    this.code       = code;
    this.isHost     = false;

    try {
      const data = await API.joinRoom(code, this.playerId, name);
      this.isHost = data.isHost;
      UI.showScreen('screen-lobby');
      this._attachListeners();
    } catch (e) {
      UI.toast(e.message, 'error');
    }
  },

  // ---- FIREBASE LISTENERS ----
  // These replace ALL polling. Firebase calls the callbacks instantly
  // whenever data changes in the DB (~50-150ms latency).

  _attachListeners() {
    // Room listener: settings, phase, state (sabotage, doors, meeting, bodies, winner)
    const offRoom = API.listenRoom(this.code, room => {
      const prevPhase = this.room?.phase;
      this.room = room;
      this._onRoomChange(prevPhase, room);
    });

    // Players listener: positions, roles, tasks, statuses
    const offPlayers = API.listenPlayers(this.code, players => {
      this.players = players;
      this._refreshMyPlayer();
      // Re-render HUD without full phase logic
      if (this.room?.phase === 'game') UI.updateHUD(this._buildViewState());
      if (this.room?.phase === 'lobby') UI.updateLobby(this._buildViewState());
    });

    // Chat listener
    const offChat = API.listenChat(this.code, msgs => {
      this.chat = msgs;
      if (this.room?.phase === 'meeting') UI.updateChatOnly(msgs);
    });

    this._unsubs = [offRoom, offPlayers, offChat];
  },

  _detachListeners() {
    this._unsubs.forEach(fn => fn?.());
    this._unsubs = [];
    if (this.animFrame) cancelAnimationFrame(this.animFrame);
  },

  _onRoomChange(prevPhase, room) {
    const phase = room.phase;

    // Update sabotage alert every room tick
    if (phase === 'game') UI.updateSabotageAlert(room.state?.sabotage);

    if (prevPhase === phase) {
      // Same phase — just refresh current screen
      if (phase === 'lobby')   UI.updateLobby(this._buildViewState());
      if (phase === 'meeting') UI.updateMeeting(this._buildViewState());
      return;
    }

    // Phase changed!
    if (phase === 'game' && prevPhase === 'lobby') {
      UI.showScreen('screen-game');
      this._startGameLoop();
    } else if (phase === 'meeting') {
      UI.showScreen('screen-meeting');
      UI.updateMeeting(this._buildViewState());
    } else if (phase === 'game' && prevPhase === 'meeting') {
      UI.showScreen('screen-game');
      UI.updateHUD(this._buildViewState());
    } else if (phase === 'end') {
      this._detachListeners();
      UI.showScreen('screen-end');
      UI.showEnd(this._buildViewState());
    }
  },

  _refreshMyPlayer() {
    this.myPlayer = this.players[this.playerId] || null;
    this.myRole   = this.myPlayer?.role   || null;
    this.myStatus = this.myPlayer?.status || null;
  },

  // Build a unified view object that UI.js expects
  _buildViewState() {
    const playerArr = Object.values(this.players).map((p, i) => {
      // Ghost visibility: hide from living crewmates
      if (p.status === 'ghost' && this.myStatus === 'alive' && this.myRole !== 'impostor' && p.id !== this.playerId) {
        return { ...p, x: -9999, y: -9999, visible: false, isGhost: true };
      }
      return { ...p, visible: true };
    });

    return {
      code:     this.code,
      hostId:   this.room?.hostId,
      phase:    this.room?.phase,
      settings: this.room?.settings || {},
      state:    this.room?.state    || {},
      players:  playerArr,
      chat:     this.chat,
      myRole:   this.myRole,
      myStatus: this.myStatus,
    };
  },

  // ---- GAME LOOP (render only, no data fetching) ----

  _startGameLoop() {
    UI.updateHUD(this._buildViewState());
    this._setupInput();
    const loop = () => {
      this.animFrame = requestAnimationFrame(loop);
      this._handleInput();
      this._render();
    };
    loop();
  },

  _setupInput() {
    // Remove old listeners to avoid duplicates on re-entry
    window.onkeydown = e => {
      this.keys[e.code] = true;
      if (e.code === 'KeyE') this.tryInteract();
      if (e.code === 'KeyQ') this.tryKill();
      if (e.code === 'KeyR') this.tryReport();
    };
    window.onkeyup = e => { this.keys[e.code] = false; };

    const canvas = document.getElementById('gameCanvas');
    if (!canvas._listenerSet) {
      canvas._listenerSet = true;
      canvas.addEventListener('click', e => {
        const pos = Renderer.screenToWorld(e.clientX, e.clientY);
        this.tryInteractAt(pos.x, pos.y);
      });
    }

    Renderer.init(canvas);
  },

  _handleInput() {
    if (!this.myPlayer || this.myStatus === 'ghost') return;
    const phase = this.room?.phase;
    if (phase === 'meeting' || phase === 'end') return;

    let dx = 0, dy = 0;
    if (this.keys['ArrowLeft']  || this.keys['KeyA']) dx -= CONFIG.SPEED;
    if (this.keys['ArrowRight'] || this.keys['KeyD']) dx += CONFIG.SPEED;
    if (this.keys['ArrowUp']    || this.keys['KeyW']) dy -= CONFIG.SPEED;
    if (this.keys['ArrowDown']  || this.keys['KeyS']) dy += CONFIG.SPEED;

    if (dx || dy) {
      if (dx && dy) { dx *= 0.707; dy *= 0.707; }
      const nx = Math.max(50, Math.min(MAP.WIDTH  - 50, this.myPlayer.x + dx));
      const ny = Math.max(50, Math.min(MAP.HEIGHT - 50, this.myPlayer.y + dy));
      // Update local copy immediately for smooth feel
      this.myPlayer.x = nx;
      this.myPlayer.y = ny;
      this.players[this.playerId].x = nx;
      this.players[this.playerId].y = ny;
      Renderer.centerOn(nx, ny);

      const now = Date.now();
      if (now - this.lastMove > CONFIG.MOVE_THROTTLE) {
        this.lastMove = now;
        API.move(this.code, this.playerId, nx, ny).catch(() => {});
      }
    }

    this.updateActionButton();
  },

  _render() {
    if (!this.room) return;
    const vs = this._buildViewState();
    Renderer.clear();
    Renderer.drawMap(vs);

    const bodies = Object.values(vs.state.bodies || {}).filter(b => !b.reportedBy);
    Renderer.drawBodies(bodies);

    Renderer.drawPlayers(vs.players, this.playerId, this.myRole, this.myStatus);

    if (this.myStatus !== 'ghost') Renderer.drawVisionOverlay(this.myPlayer, vs);
    Renderer.drawSabotageOverlay(vs);

    const tasks = Object.values(this.myPlayer?.tasks || {});
    Renderer.drawHUD(vs, this.myPlayer, tasks.length, tasks.filter(t => t.done).length);
  },

  // ---- INTERACTIONS ----

  updateActionButton() {
    const btn     = document.getElementById('actionBtn');
    const nearest = this.findNearestInteractable();
    if (nearest) {
      btn.classList.remove('hidden');
      btn.textContent = nearest.label;
      btn.onclick     = nearest.action;
    } else {
      btn.classList.add('hidden');
    }
  },

  findNearestInteractable() {
    if (!this.myPlayer) return null;
    const mx = this.myPlayer.x, my = this.myPlayer.y;
    const r  = CONFIG.INTERACT_RADIUS;
    const state = this.room?.state || {};

    // My tasks (object form from Firebase)
    const myTasks = Object.values(this.myPlayer.tasks || {});
    for (const mapTask of MAP.TASKS) {
      const t = myTasks.find(mt => mt.room === mapTask.room && mt.type === mapTask.type && !mt.done);
      if (!t) continue;
      if (Math.hypot(mx - mapTask.x, my - mapTask.y) < r)
        return { label: `[E] ${mapTask.type}`, action: () => this.doTask(t.id) };
    }

    // Bodies
    for (const body of Object.values(state.bodies || {})) {
      if (!body.reportedBy && Math.hypot(mx - body.x, my - body.y) < r)
        return { label: '[E] Report Body', action: () => this.report(body.id) };
    }

    // Emergency button
    const eb = MAP.EMERGENCY_BTN;
    if (Math.hypot(mx - eb.x, my - eb.y) < r)
      return { label: '[E] Emergency Meeting', action: () => this.callMeeting() };

    // Sabotage fix
    if (state.sabotage) {
      const fixes = MAP.SABOTAGE_FIX[state.sabotage.type] || [];
      for (const fix of fixes) {
        const alreadyFixed = state.sabotage.fixedBy?.[this.playerId];
        if (!alreadyFixed && Math.hypot(mx - fix.x, my - fix.y) < r)
          return { label: `[E] Fix ${state.sabotage.type.toUpperCase()}`, action: () => this.fix() };
      }
    }

    return null;
  },

  tryInteract() { this.findNearestInteractable()?.action(); },

  tryInteractAt(wx, wy) {
    const r     = CONFIG.INTERACT_RADIUS * 1.5;
    const state = this.room?.state || {};
    const tasks = Object.values(this.myPlayer?.tasks || {});

    for (const mapTask of MAP.TASKS) {
      const t = tasks.find(mt => mt.room === mapTask.room && mt.type === mapTask.type && !mt.done);
      if (!t) continue;
      if (Math.hypot(wx - mapTask.x, wy - mapTask.y) < r) { this.doTask(t.id); return; }
    }

    const eb = MAP.EMERGENCY_BTN;
    if (Math.hypot(wx - eb.x, wy - eb.y) < r) { this.callMeeting(); return; }

    for (const body of Object.values(state.bodies || {})) {
      if (!body.reportedBy && Math.hypot(wx - body.x, wy - body.y) < r) { this.report(body.id); return; }
    }

    if (state.sabotage) {
      const fixes = MAP.SABOTAGE_FIX[state.sabotage.type] || [];
      for (const fix of fixes) {
        if (Math.hypot(wx - fix.x, wy - fix.y) < r) { this.fix(); return; }
      }
    }
  },

  tryKill() {
    if (this.myRole !== 'impostor' || this.myStatus !== 'alive') return;
    const mx = this.myPlayer.x, my = this.myPlayer.y;
    const cd = (this.room?.settings?.killCooldown || 25) * 1000;
    if (Date.now() - this.lastKillTs < cd) { UI.toast('Kill on cooldown!', 'warning'); return; }

    const target = Object.values(this.players).find(p =>
      p.id !== this.playerId && p.role === 'crewmate' && p.status === 'alive' &&
      Math.hypot(mx - p.x, my - p.y) < CONFIG.KILL_RADIUS
    );
    if (!target) { UI.toast('No one in range', 'warning'); return; }

    this.lastKillTs = Date.now();
    API.kill(this.code, this.playerId, target.id, target.x, target.y)
      .then(() => UI.toast(`Killed ${target.name}`, 'success'))
      .catch(e => UI.toast(e.message, 'error'));
  },

  tryReport() {
    const mx = this.myPlayer?.x, my = this.myPlayer?.y;
    if (!mx) return;
    for (const body of Object.values(this.room?.state?.bodies || {})) {
      if (!body.reportedBy && Math.hypot(mx - body.x, my - body.y) < CONFIG.INTERACT_RADIUS) {
        this.report(body.id); return;
      }
    }
  },

  // ---- ACTIONS ----

  doTask(taskId) { UI.showTaskPanel(taskId, this.myPlayer); },

  async finishTask(taskId) {
    try {
      await API.completeTask(this.code, this.playerId, taskId);
      UI.toast('Task complete! ✅', 'success');
      UI.hideTaskPanel();
      // Optimistic local update
      if (this.myPlayer?.tasks?.[taskId]) this.myPlayer.tasks[taskId].done = true;
    } catch (e) { UI.toast(e.message, 'error'); }
  },

  async report(bodyId) {
    try { await API.reportBody(this.code, this.playerId, bodyId); }
    catch (e) { UI.toast(e.message, 'error'); }
  },

  async callMeeting() {
    try { await API.callMeeting(this.code, this.playerId); }
    catch (e) { UI.toast(e.message, 'error'); }
  },

  async vote(targetId) {
    try { await API.vote(this.code, this.playerId, targetId); UI.toast('Voted!', 'success'); }
    catch (e) { UI.toast(e.message, 'error'); }
  },

  async fix() {
    try { await API.fixSabotage(this.code, this.playerId); }
    catch (e) { UI.toast(e.message, 'error'); }
  },

  openSabotage() { UI.showSabPanel(); },

  async doSabotage(type) {
    UI.hideSabPanel();
    try { await API.sabotage(this.code, this.playerId, type); }
    catch (e) { UI.toast(e.message, 'error'); }
  },

  openDoors() { UI.showDoorsPanel(this.room?.state?.doors); },

  async toggleDoor(doorName) {
    try { await API.toggleDoor(this.code, this.playerId, doorName); UI.toast('Door locked!', 'success'); }
    catch (e) { UI.toast(e.message, 'error'); }
  },

  async saveSettings() {
    const settings = UI.readSettings();
    try { await API.updateSettings(this.code, this.playerId, settings); UI.toast('Settings saved!', 'success'); }
    catch (e) { UI.toast(e.message, 'error'); }
  },

  async startGame() {
    if (!this.isHost) return;
    try { await API.startGame(this.code, this.playerId); }
    catch (e) { UI.toast(e.message, 'error'); }
  },

  async sendChat() {
    const input = document.getElementById('meetingChatInput');
    const msg   = input.value.trim();
    if (!msg) return;
    input.value = '';
    API.sendChat(this.code, this.playerId, this.playerName, msg).catch(() => {});
  },

  leave() {
    this._detachListeners();
    if (this.code) API.leaveRoom(this.code, this.playerId).catch(() => {});
    this.code = this.playerId = this.room = null;
    this.players = {}; this.chat = [];
  },
};

export default Game;