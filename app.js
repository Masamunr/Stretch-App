/* ---------------------------------------------------------
   Storage helpers (localStorage only -- no accounts, no server)
--------------------------------------------------------- */
const STORAGE_KEY = 'stretchapp.sessions.v1';

function loadSessions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Could not read saved sessions', e);
    return [];
  }
}
function saveSessions(sessions) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (e) {
    console.error('Could not save sessions', e);
  }
}

/* ---------------------------------------------------------
   Global state
--------------------------------------------------------- */
const state = {
  view: 'home',
  homeContextFilter: 'all',
  homeDifficultyFilter: 'all',
  homeMuscleFilter: 'all',
  customSelection: new Set(),
  sessions: loadSessions(),

  queue: [],
  index: 0,
  secondsLeft: 0,
  totalDuration: 0,
  running: false,
  timerHandle: null,
  routineName: '',
  sessionStartedAt: null,
  finished: false,
};

const stretchById = Object.fromEntries(STRETCHES.map(s => [s.id, s]));

/* ---------------------------------------------------------
   Navigation
--------------------------------------------------------- */
function setView(view) {
  if (state.view === 'session' && view !== 'session') stopTimer();
  state.view = view;
  document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
  document.getElementById('view-' + view).classList.add('active');
  document.querySelectorAll('.tab').forEach(el => {
    el.classList.toggle('active', el.dataset.view === view);
  });
  render();
}

document.getElementById('tabs').addEventListener('click', (e) => {
  const btn = e.target.closest('.tab');
  if (btn) setView(btn.dataset.view);
});

/* ---------------------------------------------------------
   Home view: routines + custom builder
--------------------------------------------------------- */
function renderHome() {
  const root = document.getElementById('view-home');
  const ctx = state.homeContextFilter;
  const diff = state.homeDifficultyFilter;
  const muscle = state.homeMuscleFilter;

  const filteredRoutines = ROUTINES.filter(r => {
    const stretches = r.stretchIds.map(id => stretchById[id]);
    return (ctx === 'all' || r.context === ctx) &&
      (diff === 'all' || r.difficulty === diff) &&
      (muscle === 'all' || stretches.some(s => s.part === muscle));
  });

  const contextChips = ['all', ...CONTEXTS.map(c => c.id)].map(id => {
    const label = id === 'all' ? 'All' : CONTEXTS.find(c => c.id === id).label;
    return `<button class="chip ${ctx === id ? 'active' : ''}" data-ctxchip="${id}">${label}</button>`;
  }).join('');

  const diffChips = ['all', ...DIFFICULTIES].map(id => {
    const label = id === 'all' ? 'All levels' : id[0].toUpperCase() + id.slice(1);
    return `<button class="chip ${diff === id ? 'active' : ''}" data-diffchip="${id}">${label}</button>`;
  }).join('');

  const muscleChips = ['all', ...MUSCLE_GROUPS].map(id => {
    const label = id === 'all' ? 'All muscles' : id;
    return `<button class="chip ${muscle === id ? 'active' : ''}" data-musclechip="${id}">${label}</button>`;
  }).join('');

  const routineCards = filteredRoutines.map(r => {
    const stretches = r.stretchIds.map(id => stretchById[id]);
    const totalSecs = stretches.reduce((sum, s) => sum + s.duration * (s.sides ? 2 : 1), 0);
    return `
      <div class="routine-card" data-routine="${r.id}">
        <div class="routine-top">
          <div>
            <div class="routine-name">${r.name}</div>
            <div class="routine-meta">${stretches.length} stretches - ~${Math.round(totalSecs / 60)} min</div>
          </div>
          <span class="difficulty-badge difficulty-${r.difficulty}">${r.difficulty}</span>
        </div>
        <div class="routine-blurb">${r.blurb}</div>
        <button class="routine-start-btn" data-startroutine="${r.id}">Start routine</button>
      </div>`;
  }).join('') || `<div class="empty-state">No routines match those filters -- try widening them.</div>`;

  const visibleStretches = STRETCHES.filter(s => muscle === 'all' || s.part === muscle);
  const customRows = visibleStretches.length
    ? visibleStretches.map(s => `
      <label class="stretch-row">
        <div class="pose-thumb">${s.img}</div>
        <div class="info">
          <div class="name">${s.name}</div>
          <div class="meta">${s.part} - ${s.duration}s${s.sides ? ' /side' : ''} - ${s.difficulty}</div>
        </div>
        <input type="checkbox" data-custom="${s.id}" ${state.customSelection.has(s.id) ? 'checked' : ''}>
      </label>
    `).join('')
    : `<div class="empty-state" style="padding:24px 0;">No stretches for that muscle group.</div>`;

  root.innerHTML = `
    <div class="section-label">Filter by time</div>
    <div class="filter-row">${contextChips}</div>
    <div class="filter-row">${diffChips}</div>
    <div class="section-label">Filter by muscle</div>
    <div class="filter-row">${muscleChips}</div>

    <div class="section-label">Routines</div>
    ${routineCards}

    <div class="section-label">Build your own</div>
    <div class="custom-builder">
      <div>${customRows}</div>
      <button class="custom-start-btn" id="customStartBtn" ${state.customSelection.size === 0 ? 'disabled' : ''}>
        Start custom session (${state.customSelection.size} selected)
      </button>
    </div>
  `;

  root.querySelectorAll('[data-ctxchip]').forEach(el => el.addEventListener('click', () => {
    state.homeContextFilter = el.dataset.ctxchip; renderHome();
  }));
  root.querySelectorAll('[data-diffchip]').forEach(el => el.addEventListener('click', () => {
    state.homeDifficultyFilter = el.dataset.diffchip; renderHome();
  }));
  root.querySelectorAll('[data-musclechip]').forEach(el => el.addEventListener('click', () => {
    state.homeMuscleFilter = el.dataset.musclechip; renderHome();
  }));
  root.querySelectorAll('[data-startroutine]').forEach(el => el.addEventListener('click', () => {
    const routine = ROUTINES.find(r => r.id === el.dataset.startroutine);
    startSession(routine.stretchIds, routine.name);
  }));
  root.querySelectorAll('[data-custom]').forEach(el => el.addEventListener('change', () => {
    if (el.checked) state.customSelection.add(el.dataset.custom);
    else state.customSelection.delete(el.dataset.custom);
    const btn = document.getElementById('customStartBtn');
    btn.disabled = state.customSelection.size === 0;
    btn.textContent = `Start custom session (${state.customSelection.size} selected)`;
  }));
  const customBtn = document.getElementById('customStartBtn');
  if (customBtn) customBtn.addEventListener('click', () => {
    startSession([...state.customSelection], 'Custom Session');
  });
}

/* ---------------------------------------------------------
   Session playback
--------------------------------------------------------- */
function buildQueue(stretchIds) {
  const queue = [];
  stretchIds.forEach(id => {
    const stretch = stretchById[id];
    if (!stretch) return;
    if (stretch.sides) {
      queue.push({ stretch, side: 'Left' });
      queue.push({ stretch, side: 'Right' });
    } else {
      queue.push({ stretch, side: null });
    }
  });
  return queue;
}

function startSession(stretchIds, routineName) {
  stopTimer();
  state.queue = buildQueue(stretchIds);
  state.index = 0;
  state.routineName = routineName;
  state.finished = false;
  state.sessionStartedAt = Date.now();
  state.totalDuration = state.queue.reduce((sum, item) => sum + item.stretch.duration, 0);
  loadCurrentStretchTime();
  setView('session');
  startTimer();
}

function loadCurrentStretchTime() {
  const item = state.queue[state.index];
  state.secondsLeft = item ? item.stretch.duration : 0;
}

function startTimer() {
  state.running = true;
  clearInterval(state.timerHandle);
  state.timerHandle = setInterval(tick, 1000);
  renderSession();
}
function stopTimer() {
  state.running = false;
  clearInterval(state.timerHandle);
  state.timerHandle = null;
}
function togglePlayPause() {
  if (state.finished) return;
  if (state.running) stopTimer();
  else startTimer();
  renderSession();
}

function tick() {
  state.secondsLeft -= 1;
  if (state.secondsLeft <= 0) {
    goNext(true);
  } else {
    renderSession();
  }
}

function goNext(auto) {
  if (state.index < state.queue.length - 1) {
    state.index += 1;
    loadCurrentStretchTime();
    renderSession();
  } else {
    finishSession();
  }
}
function goPrev() {
  if (state.index > 0) {
    state.index -= 1;
    loadCurrentStretchTime();
    renderSession();
  }
}
function skip() { goNext(false); }

function finishSession() {
  stopTimer();
  state.finished = true;
  const elapsedSecs = Math.round((Date.now() - state.sessionStartedAt) / 1000);
  const uniqueParts = [...new Set(state.queue.map(q => q.stretch.part))];
  const session = {
    id: 'sess_' + Date.now(),
    name: state.routineName,
    date: new Date().toISOString(),
    durationSecs: elapsedSecs,
    stretchCount: state.queue.length,
    parts: uniqueParts,
  };
  state.sessions.unshift(session);
  saveSessions(state.sessions);
  renderSession();
}

function exitSession() {
  stopTimer();
  setView('home');
}

function renderSession() {
  const root = document.getElementById('view-session');

  if (state.finished) {
    const mins = Math.floor(state.totalDuration / 60);
    const secs = state.totalDuration % 60;
    root.innerHTML = `
      <div class="session-header">
        <button class="session-exit" id="sessExit">Close</button>
        <span class="session-progress">Complete</span>
      </div>
      <div class="session-summary">
        <div class="section-label" style="margin:0">${state.routineName}</div>
        <div class="big-stat">${mins}:${String(secs).padStart(2, '0')}</div>
        <div class="stat-label">time stretched - ${state.queue.length} stretches</div>
        <button class="done-btn" id="sessDone">Back to routines</button>
      </div>
    `;
    document.getElementById('sessExit').addEventListener('click', () => setView('home'));
    document.getElementById('sessDone').addEventListener('click', () => setView('home'));
    return;
  }

  const item = state.queue[state.index];
  const stretch = item.stretch;
  const radius = 88;
  const circumference = 2 * Math.PI * radius;
  const fraction = state.secondsLeft / stretch.duration;
  const dashoffset = circumference * (1 - fraction);

  const upcoming = state.queue.map((q, i) => {
    const cls = i < state.index ? 'done' : (i === state.index ? 'current' : '');
    return `<div class="upcoming-item ${cls}">${q.stretch.img}</div>`;
  }).join('');

  root.innerHTML = `
    <div class="session-header">
      <button class="session-exit" id="sessExit">Close</button>
      <span class="session-progress">${state.index + 1} / ${state.queue.length} - ${state.routineName}</span>
    </div>

    <div class="pose-stage">
      <div class="pose-thumb">${stretch.img}</div>
      <h2>${stretch.name}</h2>
      ${item.side ? `<div class="pose-side-tag">${item.side} side</div>` : ''}
      <div class="pose-cue">${stretch.cue}</div>
    </div>

    <div class="timer-wrap">
      <div class="timer-ring">
        <svg width="200" height="200">
          <circle class="track" cx="100" cy="100" r="${radius}"></circle>
          <circle class="progress" cx="100" cy="100" r="${radius}"
            stroke-dasharray="${circumference}" stroke-dashoffset="${dashoffset}"></circle>
        </svg>
        <div class="timer-time">${state.secondsLeft}</div>
      </div>
    </div>

    <div class="transport">
      <button id="btnPrev" aria-label="Previous stretch">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
      </button>
      <button class="play-pause" id="btnPlayPause" aria-label="${state.running ? 'Pause' : 'Play'}">
        ${state.running
          ? '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zm8 0h4v14h-4z"/></svg>'
          : '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>'}
      </button>
      <button id="btnNext" aria-label="Skip to next stretch">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 6h2v12h-2zM6 6v12l8.5-6z"/></svg>
      </button>
    </div>

    <div class="upcoming-strip">${upcoming}</div>
  `;

  document.getElementById('sessExit').addEventListener('click', exitSession);
  document.getElementById('btnPlayPause').addEventListener('click', togglePlayPause);
  document.getElementById('btnPrev').addEventListener('click', goPrev);
  document.getElementById('btnNext').addEventListener('click', skip);
}

/* ---------------------------------------------------------
   Log view
--------------------------------------------------------- */
function renderLog() {
  const root = document.getElementById('view-log');
  if (state.sessions.length === 0) {
    root.innerHTML = `<div class="empty-state">No sessions logged yet.<br>Finish a routine and it'll show up here.</div>`;
    return;
  }
  const entries = state.sessions.map(s => {
    const d = new Date(s.date);
    const dateStr = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    const timeStr = d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
    const mins = Math.round(s.durationSecs / 60);
    return `
      <div class="log-entry" data-id="${s.id}">
        <div>
          <div class="name">${s.name}</div>
          <div class="date">${dateStr} - ${timeStr} - ${s.stretchCount} stretches</div>
        </div>
        <div style="display:flex; align-items:center; gap:10px;">
          <div class="duration">${mins} min</div>
          <button class="log-delete" data-del="${s.id}" aria-label="Delete session">&times;</button>
        </div>
      </div>`;
  }).join('');
  root.innerHTML = entries;
  root.querySelectorAll('[data-del]').forEach(el => el.addEventListener('click', () => {
    state.sessions = state.sessions.filter(s => s.id !== el.dataset.del);
    saveSessions(state.sessions);
    renderLog();
    renderMetrics();
  }));
}

/* ---------------------------------------------------------
   Metrics view
--------------------------------------------------------- */
function renderMetrics() {
  const root = document.getElementById('view-metrics');
  const sessions = state.sessions;
  if (sessions.length === 0) {
    root.innerHTML = `<div class="empty-state">No metrics yet -- your stats will build up as you log sessions.</div>`;
    return;
  }

  const totalSessions = sessions.length;
  const totalMins = Math.round(sessions.reduce((sum, s) => sum + s.durationSecs, 0) / 60);

  const daySet = new Set(sessions.map(s => new Date(s.date).toDateString()));
  let streak = 0;
  let cursor = new Date();
  while (daySet.has(cursor.toDateString())) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  const avgMins = Math.round(totalMins / totalSessions);

  const partCounts = {};
  sessions.forEach(s => s.parts.forEach(p => { partCounts[p] = (partCounts[p] || 0) + 1; }));
  const maxCount = Math.max(...Object.values(partCounts));
  const bars = Object.entries(partCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([part, count]) => `
      <div class="bar-row">
        <div class="bar-label">${part}</div>
        <div class="bar-track"><div class="bar-fill" style="width:${(count / maxCount) * 100}%"></div></div>
        <div class="bar-count">${count}</div>
      </div>`).join('');

  root.innerHTML = `
    <div class="metrics-grid">
      <div class="metric-card"><div class="value">${totalSessions}</div><div class="label">Sessions logged</div></div>
      <div class="metric-card"><div class="value">${totalMins}</div><div class="label">Total minutes</div></div>
      <div class="metric-card"><div class="value">${streak}</div><div class="label">Day streak</div></div>
      <div class="metric-card"><div class="value">${avgMins}</div><div class="label">Avg min / session</div></div>
    </div>
    <div class="section-label">Most stretched areas</div>
    <div class="bar-chart">${bars}</div>
  `;
}

/* ---------------------------------------------------------
   Master render
--------------------------------------------------------- */
function render() {
  if (state.view === 'home') renderHome();
  if (state.view === 'log') renderLog();
  if (state.view === 'metrics') renderMetrics();
}

render();
