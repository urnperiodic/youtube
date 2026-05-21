// ============================================================
//  API — Firebase Realtime Database (Modular SDK)
//  All reads use onValue() listeners (push, ~50ms).
//  All writes use set() / update() / push().
// ============================================================

import { getDatabase, ref, get, set, update, push, onValue, off, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-database.js";

const db = getDatabase(window.firebaseApp);

const API = {
  // ---- internal helpers ----

  db() {
    return db;
  },

  ref(path) {
    return ref(db, path);
  },

  async get(path) {
    const snapshot = await get(this.ref(path));
    return snapshot.exists() ? snapshot.val() : null;
  },

  async set(path, value) {
    await set(this.ref(path), value);
  },

  async update(path, value) {
    await update(this.ref(path), value);
  },

  async push(path, value) {
    const newRef = await push(this.ref(path), value);
    return newRef.key;
  },

  async transaction(path, fn) {
    return new Promise((resolve, reject) => {
      const dbRef = this.ref(path);
      onValue(dbRef, (snapshot) => {
        try {
          const newValue = fn(snapshot.val());
          if (newValue !== undefined) {
            set(dbRef, newValue).then(() => {
              resolve({ committed: true, value: newValue });
            }).catch(reject);
          }
        } catch (err) {
          reject(err);
        }
      }, { onlyOnce: true });
    });
  },

  // ---- room management ----

  async createRoom(playerId, playerName) {
    const code = this._genCode();
    const defaults = {
      killCooldown: 25, taskCount: 5, emergencyCooldown: 15,
      maxEmergencies: 1, impostorCount: 1, saboteCooldown: 30,
      doorDuration: 10, confirmEjects: true, discussionTime: 30, votingTime: 60,
    };

    const room = {
      hostId:   playerId,
      phase:    'lobby',
      settings: defaults,
      state: {
        bodies: {}, sabotage: null, doors: this._initDoors(),
        meeting: null, lastEmergency: 0, winner: null, lastSabotage: 0,
      },
      createdAt: serverTimestamp(),
    };

    await this.set(`rooms/${code}`, room);

    const player = this._makePlayer(playerId, playerName, 'crewmate', 400, 300);
    await this.set(`rooms/${code}/players/${playerId}`, player);

    return { code, playerId };
  },

  async joinRoom(code, playerId, playerName) {
    const room = await this.get(`rooms/${code}`);
    if (!room) throw new Error('Room not found');
    if (room.phase !== 'lobby') throw new Error('Game already started');

    const players = room.players || {};
    if (Object.keys(players).length >= 15) throw new Error('Room is full');

    if (!players[playerId]) {
      const i = Object.keys(players).length;
      const sx = 400 + (i % 4) * 40 - 40;
      const sy = 300 + Math.floor(i / 4) * 40;
      await this.set(`rooms/${code}/players/${playerId}`, this._makePlayer(playerId, playerName, 'crewmate', sx, sy));
    }

    return { code, playerId, isHost: room.hostId === playerId };
  },

  // ---- live listeners (replaces polling) ----

  listenRoom(code, cb) {
    const dbRef = this.ref(`rooms/${code}`);
    const unsubscribe = onValue(dbRef, snap => {
      if (snap.exists()) cb(snap.val());
    });
    return unsubscribe;
  },

  listenPlayers(code, cb) {
    const dbRef = this.ref(`rooms/${code}/players`);
    const unsubscribe = onValue(dbRef, snap => cb(snap.val() || {}));
    return unsubscribe;
  },

  listenChat(code, cb) {
    // Only last 50 messages
    const dbRef = this.ref(`rooms/${code}/chat`);
    const unsubscribe = onValue(dbRef, snap => {
      const msgs = [];
      snap.forEach(c => msgs.push(c.val()));
      cb(msgs);
    });
    return unsubscribe;
  },

  stopListening(code, unsubscribers) {
    if (unsubscribers) {
      unsubscribers.forEach(unsub => unsub());
    }
  },

  // ---- game actions ----

  async startGame(code, hostId) {
    const room = await this.get(`rooms/${code}`);
    if (!room) throw new Error('Room not found');
    if (room.hostId !== hostId) throw new Error('Only host can start');

    const players = room.players || {};
    const ids = Object.keys(players);
    if (ids.length < 4) throw new Error('Need at least 4 players');

    const settings = room.settings;
    const impostorCount = Math.min(settings.impostorCount, Math.floor(ids.length / 3));
    const impostors = new Set(this._shuffle(ids).slice(0, impostorCount));

    const TASK_POOL = MAP.TASKS.map(t => ({ id: t.id, room: t.room, type: t.type, done: false }));
    const updates = {};

    ids.forEach((pid, i) => {
      const role = impostors.has(pid) ? 'impostor' : 'crewmate';
      const sx = 400 + (i % 4) * 40 - 80;
      const sy = 300 + Math.floor(i / 4) * 40;
      const tasks = this._shuffle(TASK_POOL)
        .slice(0, settings.taskCount)
        .reduce((acc, t) => { acc[t.id] = { ...t }; return acc; }, {});

      updates[`rooms/${code}/players/${pid}/role`]   = role;
      updates[`rooms/${code}/players/${pid}/status`] = 'alive';
      updates[`rooms/${code}/players/${pid}/x`]      = sx;
      updates[`rooms/${code}/players/${pid}/y`]      = sy;
      updates[`rooms/${code}/players/${pid}/tasks`]  = tasks;
    });

    const doors = this._initDoors();
    updates[`rooms/${code}/phase`]              = 'game';
    updates[`rooms/${code}/state/impostors`]    = [...impostors];
    updates[`rooms/${code}/state/doors`]        = doors;
    updates[`rooms/${code}/state/lastSabotage`] = 0;
    updates[`rooms/${code}/state/lastEmergency`]= 0;

    await update(ref(db), updates);
  },

  async move(code, playerId, x, y) {
    // Ultra-low-latency: write only x/y, nothing else
    await this.update(`rooms/${code}/players/${playerId}`, { x, y });
  },

  async kill(code, killerId, targetId, x, y) {
    const updates = {};
    updates[`rooms/${code}/players/${targetId}/status`] = 'ghost';
    // body keyed by targetId
    updates[`rooms/${code}/state/bodies/${targetId}`] = { id: targetId, x, y, reportedBy: null };
    updates[`rooms/${code}/state/killCooldowns/${killerId}`] = Date.now();
    await update(ref(db), updates);
    await this._checkWin(code);
  },

  async reportBody(code, reporterId, bodyId) {
    const room = await this.get(`rooms/${code}`);
    if (!room) throw new Error('Room not found');
    if (room.state.meeting) throw new Error('Meeting already active');

    const body = room.state.bodies?.[bodyId];
    if (!body || body.reportedBy) throw new Error('Body not found');

    const now = Date.now();
    const settings = room.settings;
    const meeting = {
      type: 'report', reporterId, bodyId, startTime: now,
      discussionEnd: now + settings.discussionTime * 1000,
      votingEnd:     now + (settings.discussionTime + settings.votingTime) * 1000,
      votes: {},
    };

    const updates = {};
    updates[`rooms/${code}/state/bodies/${bodyId}/reportedBy`] = reporterId;
    updates[`rooms/${code}/state/meeting`]                     = meeting;
    updates[`rooms/${code}/phase`]                             = 'meeting';
    await update(ref(db), updates);
    await this._addChat(code, 'SYSTEM', `🔴 Body reported by ${reporterId}!`);
  },

  async callMeeting(code, callerId) {
    const room = await this.get(`rooms/${code}`);
    if (!room) throw new Error('Room not found');
    if (room.state.meeting) throw new Error('Meeting already active');

    const now = Date.now();
    if (now - (room.state.lastEmergency || 0) < room.settings.emergencyCooldown * 1000) {
      throw new Error('Emergency button on cooldown');
    }

    const settings = room.settings;
    const meeting = {
      type: 'emergency', callerId, startTime: now,
      discussionEnd: now + settings.discussionTime * 1000,
      votingEnd:     now + (settings.discussionTime + settings.votingTime) * 1000,
      votes: {},
    };

    const updates = {};
    updates[`rooms/${code}/state/meeting`]        = meeting;
    updates[`rooms/${code}/state/lastEmergency`]  = now;
    updates[`rooms/${code}/phase`]                = 'meeting';
    await update(ref(db), updates);
    await this._addChat(code, 'SYSTEM', `🚨 ${callerId} called an emergency meeting!`);
  },

  async vote(code, voterId, targetId) {
    // Use a transaction-like approach
    const { value: meeting } = await this.transaction(
      `rooms/${code}/state/meeting`,
      (m) => {
        if (!m) return m;
        if (m.votes?.[voterId]) return; // abort — already voted
        if (!m.votes) m.votes = {};
        m.votes[voterId] = targetId;
        return m;
      }
    );

    if (!meeting) throw new Error('No meeting active');

    // Check if we should resolve
    const players = await this.get(`rooms/${code}/players`);
    const alive   = Object.values(players || {}).filter(p => p.status === 'alive');
    if (Object.keys(meeting.votes || {}).length >= alive.length || Date.now() > meeting.votingEnd) {
      await this._resolveVotes(code, meeting, players);
    }
  },

  async completeTask(code, playerId, taskId) {
    await this.set(`rooms/${code}/players/${playerId}/tasks/${taskId}/done`, true);
    await this._checkTaskWin(code);
  },

  async sabotage(code, playerId, sabType) {
    const room = await this.get(`rooms/${code}`);
    if (!room) throw new Error('Room not found');
    const now = Date.now();
    if (now - (room.state.lastSabotage || 0) < room.settings.saboteCooldown * 1000) {
      throw new Error('Sabotage on cooldown');
    }
    if (room.state.sabotage) throw new Error('Sabotage already active');

    const DURATION = { reactor: 45000, o2: 30000 };
    const sab = {
      type: sabType,
      startTime: now,
      expiresAt: DURATION[sabType] ? now + DURATION[sabType] : null,
      fixedBy:   {},
      fixCount:  sabType === 'reactor' ? 2 : 1,
    };

    const updates = {};
    updates[`rooms/${code}/state/sabotage`]    = sab;
    updates[`rooms/${code}/state/lastSabotage`]= now;
    await update(ref(db), updates);
    await this._addChat(code, 'SYSTEM', `⚠️ ${sabType.toUpperCase()} SABOTAGED!`);
  },

  async fixSabotage(code, playerId) {
    const { value: sab } = await this.transaction(
      `rooms/${code}/state/sabotage`,
      (s) => {
        if (!s) return s;
        if (!s.fixedBy) s.fixedBy = {};
        s.fixedBy[playerId] = true;
        return s;
      }
    );
    if (!sab) return;
    if (Object.keys(sab.fixedBy || {}).length >= sab.fixCount) {
      await this.set(`rooms/${code}/state/sabotage`, null);
      await this._addChat(code, 'SYSTEM', `✅ ${sab.type.toUpperCase()} fixed!`);
    }
  },

  async toggleDoor(code, playerId, doorName) {
    const room = await this.get(`rooms/${code}`);
    const dur  = (room?.settings?.doorDuration || 10) * 1000;
    const now  = Date.now();
    await this.set(`rooms/${code}/state/doors/${doorName}`, {
      open: false, disabledUntil: now + dur,
    });
  },

  async updateSettings(code, hostId, settings) {
    const room = await this.get(`rooms/${code}`);
    if (!room) throw new Error('Room not found');
    if (room.hostId !== hostId) throw new Error('Only host can change settings');
    // Sanitise
    const clean = {
      killCooldown:      Math.max(10, Math.min(60,  +settings.killCooldown      || 25)),
      taskCount:         Math.max(1,  Math.min(10,  +settings.taskCount         || 5)),
      emergencyCooldown: Math.max(0,  Math.min(60,  +settings.emergencyCooldown || 15)),
      maxEmergencies:    Math.max(1,  Math.min(9,   +settings.maxEmergencies    || 1)),
      impostorCount:     Math.max(1,  Math.min(3,   +settings.impostorCount     || 1)),
      saboteCooldown:    Math.max(10, Math.min(60,  +settings.saboteCooldown    || 30)),
      doorDuration:      Math.max(5,  Math.min(30,  +settings.doorDuration      || 10)),
      confirmEjects:     settings.confirmEjects === true || settings.confirmEjects === 'true',
      discussionTime:    Math.max(15, Math.min(120, +settings.discussionTime    || 30)),
      votingTime:        Math.max(30, Math.min(300, +settings.votingTime        || 60)),
    };
    await this.set(`rooms/${code}/settings`, clean);
    return clean;
  },

  async sendChat(code, playerId, playerName, message) {
    if (!message?.trim()) return;
    await this._addChat(code, playerName, message.slice(0, 200), playerId);
  },

  async leaveRoom(code, playerId) {
    const dbRef = ref(db, `rooms/${code}/players/${playerId}`);
    await set(dbRef, null);
  },

  // ---- private helpers ----

  async _addChat(code, sender, message, senderId) {
    await this.push(`rooms/${code}/chat`, {
      sender, message, senderId: senderId || null,
      time: serverTimestamp(),
    });
  },

  async _resolveVotes(code, meeting, players) {
    const votes  = meeting.votes || {};
    const tally  = {};
    Object.values(votes).forEach(v => { tally[v] = (tally[v] || 0) + 1; });

    let maxV = 0, ejected = null, tie = false;
    Object.entries(tally).forEach(([t, c]) => {
      if (t === 'skip') return;
      if (c > maxV)       { maxV = c; ejected = t; tie = false; }
      else if (c === maxV){ tie = true; }
    });
    if ((tally['skip'] || 0) >= maxV) { ejected = null; tie = false; }
    if (tie) ejected = null;

    const updates = {};
    updates[`rooms/${code}/state/meeting`] = null;
    updates[`rooms/${code}/phase`]         = 'game';

    if (ejected) {
      updates[`rooms/${code}/players/${ejected}/status`] = 'ghost';
      const ejName = players[ejected]?.name || ejected;
      const room   = await this.get(`rooms/${code}`);
      const wasImp = room?.state?.impostors?.includes(ejected);
      const msg    = room?.settings?.confirmEjects
        ? `⚖️ ${ejName} ejected — they ${wasImp ? 'WERE' : 'were NOT'} an Impostor.`
        : `⚖️ ${ejName} was ejected.`;
      await this._addChat(code, 'SYSTEM', msg);
    } else {
      await this._addChat(code, 'SYSTEM', tie ? '⚖️ Tied vote — no ejection.' : '⚖️ Crew voted to skip.');
    }

    await update(ref(db), updates);
    await this._checkWin(code);
  },

  async _checkWin(code) {
    const players = await this.get(`rooms/${code}/players`);
    const alive   = Object.values(players || {}).filter(p => p.status === 'alive');
    const imps    = alive.filter(p => p.role === 'impostor');
    const crew    = alive.filter(p => p.role === 'crewmate');

    if (imps.length === 0) {
      await this.update(`rooms/${code}`, { phase: 'end' });
      await this.set(`rooms/${code}/state/winner`, 'crewmates');
      await this._addChat(code, 'SYSTEM', '🏆 Crewmates win! All Impostors ejected!');
    } else if (imps.length >= crew.length) {
      await this.update(`rooms/${code}`, { phase: 'end' });
      await this.set(`rooms/${code}/state/winner`, 'impostors');
      await this._addChat(code, 'SYSTEM', '💀 Impostors win!');
    }
  },

  async _checkTaskWin(code) {
    const players = await this.get(`rooms/${code}/players`);
    const crew    = Object.values(players || {}).filter(p => p.role === 'crewmate');
    const allDone = crew.every(p => Object.values(p.tasks || {}).every(t => t.done));
    if (allDone) {
      await this.update(`rooms/${code}`, { phase: 'end' });
      await this.set(`rooms/${code}/state/winner`, 'crewmates');
      await this._addChat(code, 'SYSTEM', '🏆 Crewmates win! All tasks complete!');
    }
  },

  _makePlayer(id, name, role, x, y) {
    return { id, name, role, status: 'alive', x, y, tasks: {} };
  },

  _initDoors() {
    const doors = {};
    MAP.DOORS.forEach(d => { doors[d.name] = { open: true, disabledUntil: 0 }; });
    return doors;
  },

  _genCode() {
    const c = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    return Array.from({ length: 6 }, () => c[Math.floor(Math.random() * c.length)]).join('');
  },

  _shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  },
};

export default API;
