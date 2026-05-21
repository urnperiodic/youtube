// ============================================================
//  UI — Screen management (Firebase version)
// ============================================================

const UI = {
  _meetingInterval: null,

  showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id)?.classList.add('active');
  },

  showMenu() {
    Game.leave();
    this.showScreen('screen-menu');
  },

  showCreate() {
    const name = document.getElementById('playerName').value.trim();
    if (!name) { this.toast('Enter your name first!', 'error'); return; }
    Game.createRoom();
  },

  showJoin() {
    const name = document.getElementById('playerName').value.trim();
    if (!name) { this.toast('Enter your name first!', 'error'); return; }
    this.showScreen('screen-join');
  },

  // ---- LOBBY ----

  updateLobby(vs) {
    document.getElementById('lobbyCode').textContent = vs.code || '------';
    document.getElementById('startBtn').style.display  = Game.isHost ? 'block' : 'none';
    document.getElementById('waitMsg').style.display   = Game.isHost ? 'none'  : 'block';

    // Player list
    const list = document.getElementById('playerList');
    list.innerHTML = '';
    vs.players.forEach((p, i) => {
      const div  = document.createElement('div');
      div.className = 'player-item';
      const dot  = document.createElement('div');
      dot.className = 'player-dot';
      dot.style.background = getColor(i);
      div.appendChild(dot);
      const span = document.createElement('span');
      span.textContent = p.name + (p.id === vs.hostId ? ' 👑' : '');
      div.appendChild(span);
      list.appendChild(div);
    });

    // Settings
    if (Game.isHost) {
      this._renderSettingsEditable(vs.settings);
      document.getElementById('saveSettingsBtn').style.display = 'block';
    } else {
      this._renderSettingsReadOnly(vs.settings);
    }
  },

  _renderSettingsEditable(s) {
    document.getElementById('settingsGrid').innerHTML = `
      <div class="setting-item"><label>Kill Cooldown (s)</label>
        <input type="number" id="s_killCooldown"      value="${s.killCooldown}"      min="10" max="60"></div>
      <div class="setting-item"><label>Task Count</label>
        <input type="number" id="s_taskCount"          value="${s.taskCount}"          min="1"  max="10"></div>
      <div class="setting-item"><label>Emergency Cooldown (s)</label>
        <input type="number" id="s_emergencyCooldown"  value="${s.emergencyCooldown}"  min="0"  max="60"></div>
      <div class="setting-item"><label>Max Emergencies</label>
        <input type="number" id="s_maxEmergencies"     value="${s.maxEmergencies}"     min="1"  max="9"></div>
      <div class="setting-item"><label>Impostor Count</label>
        <input type="number" id="s_impostorCount"      value="${s.impostorCount}"      min="1"  max="3"></div>
      <div class="setting-item"><label>Sabotage Cooldown (s)</label>
        <input type="number" id="s_saboteCooldown"     value="${s.saboteCooldown}"     min="10" max="60"></div>
      <div class="setting-item"><label>Door Disable Duration (s)</label>
        <input type="number" id="s_doorDuration"       value="${s.doorDuration}"       min="5"  max="30"></div>
      <div class="setting-item"><label>Discussion Time (s)</label>
        <input type="number" id="s_discussionTime"     value="${s.discussionTime}"     min="15" max="120"></div>
      <div class="setting-item"><label>Voting Time (s)</label>
        <input type="number" id="s_votingTime"         value="${s.votingTime}"         min="30" max="300"></div>
      <div class="setting-item"><label>Confirm Ejects</label>
        <select id="s_confirmEjects">
          <option value="true"  ${s.confirmEjects ? 'selected':''}​>On</option>
          <option value="false" ${!s.confirmEjects ? 'selected':''}​>Off</option>
        </select></div>
    `;
  },

  _renderSettingsReadOnly(s) {
    const labels = {
      killCooldown:'Kill Cooldown (s)', taskCount:'Task Count',
      emergencyCooldown:'Emergency Cooldown (s)', maxEmergencies:'Max Emergencies',
      impostorCount:'Impostor Count', saboteCooldown:'Sabotage Cooldown (s)',
      doorDuration:'Door Duration (s)', confirmEjects:'Confirm Ejects',
      discussionTime:'Discussion Time (s)', votingTime:'Voting Time (s)',
    };
    document.getElementById('settingsGrid').innerHTML =
      Object.entries(s).map(([k,v]) =>
        `<div class="setting-item"><label>${labels[k]||k}</label>
         <span class="setting-val">${v}</span></div>`
      ).join('');
  },

  readSettings() {
    return {
      killCooldown:      document.getElementById('s_killCooldown')?.value,
      taskCount:         document.getElementById('s_taskCount')?.value,
      emergencyCooldown: document.getElementById('s_emergencyCooldown')?.value,
      maxEmergencies:    document.getElementById('s_maxEmergencies')?.value,
      impostorCount:     document.getElementById('s_impostorCount')?.value,
      saboteCooldown:    document.getElementById('s_saboteCooldown')?.value,
      doorDuration:      document.getElementById('s_doorDuration')?.value,
      confirmEjects:     document.getElementById('s_confirmEjects')?.value,
      discussionTime:    document.getElementById('s_discussionTime')?.value,
      votingTime:        document.getElementById('s_votingTime')?.value,
    };
  },

  // ---- HUD ----

  updateHUD(vs) {
    const roleEl = document.getElementById('hudRole');
    roleEl.textContent = vs.myRole === 'impostor' ? '👿 IMPOSTOR' : '✅ CREWMATE';
    roleEl.className   = vs.myRole === 'impostor' ? 'hud-impostor' : 'hud-crewmate';
    if (vs.myStatus === 'ghost') roleEl.textContent += ' 👻 Ghost';

    const me    = vs.players.find(p => p.id === Game.playerId);
    const tasks = Object.values(me?.tasks || {});
    const done  = tasks.filter(t => t.done).length;
    document.getElementById('hudTasks').textContent = `Tasks: ${done}/${tasks.length}`;

    const impPanel = document.getElementById('impostorPanel');
    if (vs.myRole === 'impostor' && vs.myStatus === 'alive') {
      impPanel.classList.remove('hidden');
    } else {
      impPanel.classList.add('hidden');
    }
  },

  updateSabotageAlert(sab) {
    const el = document.getElementById('sabotageAlert');
    if (!sab) { el.classList.add('hidden'); return; }
    el.classList.remove('hidden');
    const names = { reactor:'☢️ REACTOR MELTDOWN', o2:'💨 O2 DEPLETED', lights:'💡 LIGHTS OUT', comms:'📡 COMMS SABOTAGED' };
    let txt = names[sab.type] || 'SABOTAGE!';
    if (sab.expiresAt) txt += ` — ${Math.max(0, Math.ceil((sab.expiresAt - Date.now()) / 1000))}s`;
    el.textContent = txt;
  },

  // ---- MEETING ----

  updateMeeting(vs) {
    const meeting = vs.state?.meeting;
    if (!meeting) return;

    document.getElementById('meetingTitle').textContent =
      meeting.type === 'report' ? '🔴 Body Reported!' : '🚨 Emergency Meeting';

    this._startMeetingTimer(meeting);

    const now          = Date.now();
    const inDiscussion = now < meeting.discussionEnd;
    document.getElementById('discussionLabel').textContent = inDiscussion ? '💬 DISCUSSION' : '🗳️ VOTING';
    document.getElementById('skipBtn').disabled    = inDiscussion;
    document.getElementById('skipBtn').style.opacity = inDiscussion ? '0.4' : '1';

    const votes  = meeting.votes || {};
    const myVote = votes[Game.playerId];
    const grid   = document.getElementById('voteGrid');
    grid.innerHTML = '';

    vs.players.filter(p => p.status === 'alive').forEach((p, i) => {
      const card = document.createElement('div');
      card.className = 'vote-card' + (myVote === p.id ? ' voted' : '');
      if (!myVote && !inDiscussion && p.id !== Game.playerId) {
        card.style.cursor = 'pointer';
        card.onclick = () => Game.vote(p.id);
      }

      const dot = document.createElement('div');
      dot.className = 'vote-dot';
      dot.style.background = getColor(i);
      card.appendChild(dot);

      const name = document.createElement('div');
      name.className = 'vote-name';
      name.textContent = p.name + (p.id === vs.hostId ? ' 👑' : '');
      card.appendChild(name);

      const vCnt = Object.values(votes).filter(v => v === p.id).length;
      if (vCnt > 0) {
        const vc = document.createElement('div');
        vc.className = 'vote-count';
        vc.textContent = '🗳️'.repeat(Math.min(vCnt, 9));
        card.appendChild(vc);
      }

      grid.appendChild(card);
    });

    this.updateChatOnly(vs.chat);
  },

  updateChatOnly(msgs) {
    const el = document.getElementById('meetingChat');
    if (!el) return;
    el.innerHTML = (msgs || []).slice(-40).map(m =>
      `<div class="chat-msg"><span class="chat-sender">${this._esc(m.sender)}:</span> ${this._esc(m.message)}</div>`
    ).join('');
    el.scrollTop = el.scrollHeight;
  },

  _startMeetingTimer(meeting) {
    if (this._meetingInterval) clearInterval(this._meetingInterval);
    const update = () => {
      const timerEl = document.getElementById('meetingTimer');
      if (!timerEl) return;
      const now = Date.now();
      if (now < meeting.discussionEnd) {
        timerEl.textContent = Math.ceil((meeting.discussionEnd - now) / 1000) + 's';
        timerEl.style.color = '#4af';
      } else if (now < meeting.votingEnd) {
        timerEl.textContent = Math.ceil((meeting.votingEnd - now) / 1000) + 's';
        timerEl.style.color = '#fa4';
        document.getElementById('discussionLabel').textContent = '🗳️ VOTING';
        document.getElementById('skipBtn').disabled    = false;
        document.getElementById('skipBtn').style.opacity = '1';
      } else {
        timerEl.textContent = '0s';
        clearInterval(this._meetingInterval);
      }
    };
    update();
    this._meetingInterval = setInterval(update, 500);
  },

  // ---- TASK PANEL ----

  showTaskPanel(taskId, myPlayer) {
    const task = Object.values(myPlayer?.tasks || {}).find(t => t.id === taskId);
    if (!task) return;
    const panel = document.getElementById('taskPanel');
    panel.classList.remove('hidden');
    panel.innerHTML = `
      <div class="task-content">
        <h3>${task.type}</h3>
        <p style="color:var(--muted);font-size:13px">📍 ${task.room}</p>
        <div class="task-minigame" id="taskMinigame"></div>
        <div class="task-btns">
          <button class="btn-primary"  onclick="UI.completeTaskMinigame('${taskId}')">✅ Complete</button>
          <button class="btn-back"     onclick="UI.hideTaskPanel()">Cancel</button>
        </div>
      </div>`;
    this._renderMinigame(task, document.getElementById('taskMinigame'));
  },

  _renderMinigame(task, container) {
    if (task.type.includes('Wiring')) {
      const colors = ['🔴','🔵','🟡','🟢'];
      const shuffled = [...colors].sort(() => Math.random() - 0.5);
      container.innerHTML = `
        <p style="color:var(--muted);font-size:12px;margin-bottom:8px">Connect matching wires!</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px 48px">
          ${colors.map((c,i) => `<div class="wire-left"  data-i="${i}" onclick="UI._wirePick(this,'L')">${c}</div>`).join('')}
          ${shuffled.map((c,i) => `<div class="wire-right" data-c="${colors.indexOf(c)}" onclick="UI._wirePick(this,'R')">${c}</div>`).join('')}
        </div>`;
      this._wireState = { selected: null, done: 0 };
    } else if (task.type.includes('Reactor') || task.type.includes('Align') || task.type.includes('Fuel')) {
      container.innerHTML = `
        <p style="color:var(--muted);font-size:12px">Hold BOTH buttons until bar fills!</p>
        <div style="display:flex;gap:20px;justify-content:center;margin:10px 0">
          <button class="hold-btn" id="holdL"
            onmousedown="UI.holdStart('L')" onmouseup="UI.holdEnd('L')"
            ontouchstart="UI.holdStart('L')" ontouchend="UI.holdEnd('L')">LEFT</button>
          <button class="hold-btn" id="holdR"
            onmousedown="UI.holdStart('R')" onmouseup="UI.holdEnd('R')"
            ontouchstart="UI.holdStart('R')" ontouchend="UI.holdEnd('R')">RIGHT</button>
        </div>
        <div style="height:10px;background:#222;border-radius:5px;overflow:hidden">
          <div id="holdBar" style="height:100%;width:0%;background:var(--accent);transition:width .05s"></div>
        </div>`;
      this._holdPct = 0; this._holdL = false; this._holdR = false;
    } else {
      // Light-up tap game
      const delay = 800 + Math.random() * 2000;
      container.innerHTML = `
        <p style="color:var(--muted);font-size:12px">Tap the button when it lights up!</p>
        <div style="text-align:center;margin-top:12px">
          <div id="taskLight" style="width:64px;height:64px;border-radius:50%;background:#222;margin:0 auto;border:2px solid #444;transition:all .3s;cursor:pointer" onclick="UI._lightTap()"></div>
          <p id="lightMsg" style="color:var(--muted);font-size:12px;margin-top:8px">Waiting…</p>
        </div>`;
      this._lightReady = false;
      setTimeout(() => {
        const l = document.getElementById('taskLight');
        const m = document.getElementById('lightMsg');
        if (!l) return;
        l.style.background   = '#44ff44';
        l.style.boxShadow    = '0 0 24px #44ff44';
        m.textContent        = 'TAP NOW!';
        this._lightReady     = true;
      }, delay);
    }
  },

  // Wire minigame
  _wireState: null,
  _wirePick(el, side) {
    if (!this._wireState) return;
    if (side === 'L') {
      document.querySelectorAll('.wire-left').forEach(e => e.classList.remove('selected'));
      el.classList.add('selected');
      this._wireState.selected = parseInt(el.dataset.i);
    } else {
      if (this._wireState.selected === null) return;
      const rightIdx = parseInt(el.dataset.c);
      if (rightIdx === this._wireState.selected) {
        el.style.opacity = '0.3'; el.style.pointerEvents = 'none';
        const lEl = document.querySelector(`.wire-left[data-i="${rightIdx}"]`);
        if (lEl) { lEl.style.opacity = '0.3'; lEl.style.pointerEvents = 'none'; }
        this._wireState.done++;
        this._wireState.selected = null;
      } else {
        el.style.animation = 'shake .3s';
        setTimeout(() => el.style.animation = '', 300);
        this._wireState.selected = null;
        document.querySelectorAll('.wire-left').forEach(e => e.classList.remove('selected'));
      }
    }
  },

  // Hold minigame
  _holdL: false, _holdR: false, _holdPct: 0, _holdInterval: null,
  holdStart(side) {
    if (side === 'L') this._holdL = true;
    if (side === 'R') this._holdR = true;
    document.getElementById('hold'+side)?.classList.add('held');
    if (this._holdL && this._holdR) {
      this._holdInterval = setInterval(() => {
        this._holdPct = Math.min(100, this._holdPct + 2.5);
        const b = document.getElementById('holdBar');
        if (b) b.style.width = this._holdPct + '%';
      }, 50);
    }
  },
  holdEnd(side) {
    if (side === 'L') this._holdL = false;
    if (side === 'R') this._holdR = false;
    document.getElementById('hold'+side)?.classList.remove('held');
    clearInterval(this._holdInterval);
  },

  // Light tap minigame
  _lightReady: false,
  _lightTap() {
    if (this._lightReady) {
      const l = document.getElementById('taskLight');
      if (l) { l.style.background = '#fff'; l.style.boxShadow = '0 0 30px #fff'; }
      const m = document.getElementById('lightMsg');
      if (m) m.textContent = '✅ Good!';
    }
  },

  completeTaskMinigame(taskId) {
    // Wire check
    if (this._wireState) {
      if (this._wireState.done < 4) { this.toast('Connect all 4 wires!', 'warning'); return; }
    }
    // Hold check
    if (document.getElementById('holdBar')) {
      if (this._holdPct < 100) { this.toast('Hold both buttons until full!', 'warning'); return; }
    }
    // Light check
    if (document.getElementById('taskLight') && !this._lightReady) {
      this.toast('Wait for the light!', 'warning'); return;
    }
    Game.finishTask(taskId);
  },

  hideTaskPanel() { document.getElementById('taskPanel').classList.add('hidden'); },

  // ---- SABOTAGE PANEL ----

  showSabPanel() {
    const p = document.getElementById('sabPanel');
    p.classList.remove('hidden');
    p.innerHTML = `
      <div class="panel-card">
        <h3>💀 Sabotage</h3>
        <div class="sab-grid">
          <button class="sab-option" onclick="Game.doSabotage('reactor')">☢️<br>Reactor<br><small>45s timer</small></button>
          <button class="sab-option" onclick="Game.doSabotage('o2')">💨<br>O2<br><small>30s timer</small></button>
          <button class="sab-option" onclick="Game.doSabotage('lights')">💡<br>Lights<br><small>Vision out</small></button>
          <button class="sab-option" onclick="Game.doSabotage('comms')">📡<br>Comms<br><small>Tasks hidden</small></button>
        </div>
        <button class="btn-back" onclick="UI.hideSabPanel()">Cancel</button>
      </div>`;
  },
  hideSabPanel() { document.getElementById('sabPanel').classList.add('hidden'); },

  // ---- DOORS PANEL ----

  showDoorsPanel(doors) {
    const now = Date.now();
    const p   = document.getElementById('doorsPanel');
    p.classList.remove('hidden');
    p.innerHTML = `
      <div class="panel-card">
        <h3>🚪 Lock Doors</h3>
        <div class="doors-grid">
          ${MAP.DOORS.map(d => {
            const ds     = doors?.[d.name];
            const locked = ds && !ds.open && ds.disabledUntil > now;
            const rem    = locked ? Math.ceil((ds.disabledUntil - now) / 1000) : 0;
            return `<button class="door-btn ${locked?'locked':''}"
              onclick="Game.toggleDoor('${d.name}')" ${locked?'disabled':''}>
              ${locked ? `🔒 ${rem}s` : '🚪'} ${d.name}
            </button>`;
          }).join('')}
        </div>
        <button class="btn-back" onclick="UI.hideDoorsPanel()">Cancel</button>
      </div>`;
  },
  hideDoorsPanel() { document.getElementById('doorsPanel').classList.add('hidden'); },

  // ---- END SCREEN ----

  showEnd(vs) {
    const w     = vs.state?.winner;
    const title = document.getElementById('endTitle');
    title.textContent  = w === 'impostors' ? '💀 IMPOSTORS WIN' : '🏆 CREWMATES WIN';
    title.style.color  = w === 'impostors' ? '#ff4444' : '#44ff44';

    document.getElementById('endRoles').innerHTML = vs.players.map((p, i) => `
      <div class="end-player">
        <div class="player-dot" style="background:${getColor(i)}"></div>
        <span>${this._esc(p.name)}</span>
        <span class="end-role ${p.role}">${p.role === 'impostor' ? '👿 Impostor' : '✅ Crewmate'}</span>
        <span class="end-status">${p.status === 'ghost' ? '💀' : '✅'}</span>
      </div>`).join('');
  },

  // ---- TOAST ----

  toast(msg, type = 'info') {
    const el = document.getElementById('toast');
    el.textContent  = msg;
    el.className    = `toast toast-${type}`;
    el.classList.remove('hidden');
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => el.classList.add('hidden'), 3000);
  },

  _esc(s) {
    return String(s || '')
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  },
};

export default UI;