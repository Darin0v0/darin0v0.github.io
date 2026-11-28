/* LAYER_00 // logika terminala, motywów i odtwarzacza */
(() => {
  'use strict';

  const GITHUB_USER = 'Darin0v0';
  const GITHUB_REPO = 'Darin0v0.github.io';
  const PROJECTS_PATH = 'projects';
  const VIDEO_ID = 'cReuQk0pJbI';
  const MAX_TERMINAL_LINES = 10;
  const CACHE_TTL = 6 * 60 * 60 * 1000;
  const YT_STATE = { UNSTARTED: -1, ENDED: 0, PLAYING: 1, PAUSED: 2, BUFFERING: 3, CUED: 5 };
  const THEME_ALIASES = { lain: 'lain', matrix: 'matrix', sys: 'matrix', blood: 'blood', '0x00': 'blood' };
  const THEME_COLORS = { lain: '#020000', matrix: '#000500', blood: '#050005' };
  const COMMANDS = ['help', 'projects', 'about', 'clear', 'status', 'theme'];

  // Awaryjny indeks węzłów, gdy GitHub API jest niedostępne (np. limit 60 req/h).
  const FALLBACK_PROJECTS = [
    'Advanced-ToDo-App', 'Bytecode_VM', 'Chess_Engine', 'Clock', 'Clock_v2',
    'Compiler_Lab', 'Crypto_Forge', 'File_System', 'Flow_Graph', 'Fluid_Sim',
    'Fractal_Dive', 'Hex_Dump', 'Neural_Lab', 'Orbital_Lab', 'Packet_Sniffer',
    'Particle_Field', 'Physics_Sandbox', 'Portfolio', 'Query_Lab', 'Ray_Tracer',
    'Raycaster', 'Regex_Forge', 'Shader_Lab', 'Sheet_Engine', 'Spectrum_Lab',
    'STEINER GATE', 'Synth_Wave', 'Terrain_Forge', 'all-in-one', 'basic-console',
    'c-lab ', 'serverhub'
  ];

  const store = {
    get(key) {
      try { return localStorage.getItem(key); } catch (_) { return null; }
    },
    set(key, value) {
      try { localStorage.setItem(key, value); } catch (_) { /* prywatny tryb */ }
    }
  };

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const resolveTheme = (value) => THEME_ALIASES[String(value || '').toLowerCase()] || null;

  // API YouTube może wywołać callback przed DOMContentLoaded.
  let pendingApiReady = false;
  let onApiReady = null;
  window.onYouTubeIframeAPIReady = () => {
    if (onApiReady) onApiReady();
    else pendingApiReady = true;
  };

  document.addEventListener('DOMContentLoaded', () => {
    const el = {
      terminal: document.getElementById('terminal'),
      terminalOutput: document.getElementById('terminalOutput'),
      repoPath: document.getElementById('repoPath'),
      apiBtn: document.getElementById('apiBtn'),
      projects: document.getElementById('projectsContainer'),
      clock: document.getElementById('wiredClock'),
      playBtn: document.getElementById('playMusicBtn'),
      status: document.querySelector('.audio-status'),
      volume: document.getElementById('volumeControl'),
      volumeValue: document.querySelector('.volume-value'),
      canvas: document.getElementById('audioVisualizer'),
      playerHost: document.getElementById('player'),
      audio: document.getElementById('bgMusic'),
      themeButtons: document.querySelectorAll('.theme-switcher button')
    };

    if (!el.terminalOutput) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = el.canvas && el.canvas.getContext ? el.canvas.getContext('2d') : null;

    let baseVolume = clamp(parseInt(store.get('audioVolume') ?? '50', 10) || 0, 0, 100);
    let activeSource = 'youtube';
    let player = null;
    let playerInitialized = false;
    let audioContext = null;
    let analyser = null;
    let frequencyData = null;
    let isPlaying = false;
    let ytTimeout = 0;
    let autoplayTimer = 0;
    let waitingForGesture = false;
    let userTookControl = false;
    let gestureUnlock = null;
    let rafId = 0;
    let pageHidden = document.hidden;
    let projectsLoading = false;

    const history = [];
    let historyIndex = 0;

    /* ---------- terminal ---------- */

    function displayTerminalMessage(message) {
      const line = document.createElement('div');
      line.textContent = message;
      el.terminalOutput.appendChild(line);
      while (el.terminalOutput.children.length > MAX_TERMINAL_LINES) {
        el.terminalOutput.removeChild(el.terminalOutput.firstChild);
      }
      el.terminalOutput.scrollTop = el.terminalOutput.scrollHeight;
    }

    function setLoading(isLoading) {
      if (!el.apiBtn) return;
      el.apiBtn.disabled = isLoading;
      el.apiBtn.textContent = isLoading ? 'LOADING...' : 'EXECUTE_QUERY';
    }

    function setTheme(theme, announce = true) {
      const next = resolveTheme(theme) || 'lain';
      document.body.dataset.theme = next;
      store.set('cyberTheme', next);
      el.themeButtons.forEach((button) => {
        button.setAttribute('aria-pressed', String(button.dataset.theme === next));
      });
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', THEME_COLORS[next]);
      if (announce) displayTerminalMessage(`> PROTOCOL LAYER CHANGED TO ${next.toUpperCase()}`);
    }

    function showHelp() {
      [
        '> AVAILABLE PROTOCOL COMMANDS:',
        '> HELP / ? - SHOW THIS MESSAGE',
        '> PROJECTS - MOUNT PROJECTS FROM GITHUB',
        '> ABOUT - DISPLAY EGO_RECORD',
        '> STATUS - AUDIO SOURCE AND THEME',
        '> THEME <LAIN|SYS|BLOOD> - SWITCH PROTOCOL',
        '> CLEAR - PURGE TERMINAL BUFFER'
      ].forEach(displayTerminalMessage);
    }

    function runCommand(command) {
      if (command === 'help' || command === '?') {
        showHelp();
      } else if (command === 'projects' || command === 'show projects') {
        showProjects();
      } else if (command === 'clear') {
        el.terminalOutput.replaceChildren();
        el.projects.hidden = true;
      } else if (command === 'about') {
        displayTerminalMessage('> DARIN_0V0: FULL-STACK DEVELOPER');
        displayTerminalMessage('> CONNECTED TO THE WIRED // PROTOCOL_7');
        displayTerminalMessage(`> GITHUB: github.com/${GITHUB_USER}`);
        displayTerminalMessage('> EMAIL: dawidmurias907@gmail.com');
      } else if (command === 'status') {
        displayTerminalMessage(`> AUDIO: ${activeSource.toUpperCase()} / ${isPlaying ? 'PLAYING' : 'IDLE'}`);
        displayTerminalMessage(`> THEME: ${document.body.dataset.theme.toUpperCase()} // VOLUME: ${baseVolume}%`);
      } else if (command.startsWith('theme ')) {
        const requested = command.slice(6).trim();
        if (resolveTheme(requested)) setTheme(requested);
        else displayTerminalMessage(`> UNKNOWN THEME: ${requested.toUpperCase() || 'EMPTY'}`);
      } else {
        displayTerminalMessage(`> UNKNOWN COMMAND: ${command.toUpperCase()}`);
        displayTerminalMessage("> TYPE 'HELP' FOR AVAILABLE COMMANDS");
      }
    }

    function executeCommand(forcedCommand = null) {
      const raw = forcedCommand === null ? el.repoPath.value : forcedCommand;
      const command = String(raw).trim().toLowerCase();
      if (forcedCommand === null) el.repoPath.value = '';

      if (!command) {
        displayTerminalMessage('> ERROR: NO COMMAND PROVIDED');
        return;
      }

      if (forcedCommand === null) {
        history.push(command);
        historyIndex = history.length;
      }

      displayTerminalMessage(`> EXECUTING: ${command.toUpperCase()}`);
      window.setTimeout(() => runCommand(command), 200);
    }

    /* ---------- projekty ---------- */

    function normalizeProjects(items) {
      const seen = new Set();
      const names = [];
      items
        .map((item) => (typeof item === 'string' ? item : item && item.name ? item.name : ''))
        .forEach((value) => {
          const raw = String(value || '');
          const key = raw.trim().toLowerCase();
          // Zachowujemy oryginalną nazwę: katalog "c-lab " ma spację na końcu.
          if (!key || seen.has(key)) return;
          seen.add(key);
          names.push(raw);
        });
      return names.sort((a, b) => a.trim().localeCompare(b.trim(), 'pl'));
    }

    function readProjectCache() {
      try {
        const cached = JSON.parse(store.get('cyberProjects') || 'null');
        if (cached && Array.isArray(cached.names) && Date.now() - cached.at < CACHE_TTL) {
          return normalizeProjects(cached.names);
        }
      } catch (_) { /* uszkodzony cache */ }
      return null;
    }

    async function fetchProjects() {
      const cached = readProjectCache();
      if (cached && cached.length) {
        displayTerminalMessage('> USING CACHED NODE INDEX');
        return cached;
      }

      setLoading(true);
      displayTerminalMessage('> CONNECTING TO GITHUB REPOSITORY NODES...');
      const controller = new AbortController();
      const timer = window.setTimeout(() => controller.abort(), 8000);

      try {
        const response = await fetch(
          `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${PROJECTS_PATH}`,
          { signal: controller.signal, headers: { Accept: 'application/vnd.github+json' } }
        );
        if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);
        const data = await response.json();
        const names = normalizeProjects(data.filter((item) => item.type === 'dir'));
        if (!names.length) throw new Error('EMPTY NODE INDEX');
        store.set('cyberProjects', JSON.stringify({ at: Date.now(), names }));
        return names;
      } catch (error) {
        displayTerminalMessage(`> GITHUB INDEX UNAVAILABLE: ${error.message}`);
        displayTerminalMessage('> MOUNTING LOCAL NODE INDEX');
        return normalizeProjects(FALLBACK_PROJECTS);
      } finally {
        window.clearTimeout(timer);
        setLoading(false);
      }
    }

    function renderProjects(projects) {
      el.projects.replaceChildren();

      if (!projects.length) {
        displayTerminalMessage('> NO MEMORY DUMPS FOUND');
        return;
      }

      projects.forEach((name) => {
        const label = name.trim();
        const slug = encodeURIComponent(name);
        const card = document.createElement('div');
        card.className = 'project-card';

        const title = document.createElement('h3');
        title.className = 'project-title';
        title.textContent = label.toUpperCase();

        const liveLink = document.createElement('a');
        liveLink.className = 'project-link';
        liveLink.href = `https://${GITHUB_USER}.github.io/${PROJECTS_PATH}/${slug}/`;
        liveLink.target = '_blank';
        liveLink.rel = 'noopener noreferrer';
        liveLink.textContent = 'ENTER_NODE';
        liveLink.setAttribute('aria-label', `Otwórz projekt ${label}`);

        const sourceLink = document.createElement('a');
        sourceLink.className = 'project-link github-link';
        sourceLink.href = `https://github.com/${GITHUB_USER}/${GITHUB_REPO}/tree/main/${PROJECTS_PATH}/${slug}`;
        sourceLink.target = '_blank';
        sourceLink.rel = 'noopener noreferrer';
        sourceLink.textContent = 'SOURCE_DUMP';
        sourceLink.setAttribute('aria-label', `Źródło projektu ${label}`);

        card.append(title, liveLink, sourceLink);
        el.projects.appendChild(card);
      });

      el.projects.hidden = false;
      displayTerminalMessage(`> MOUNTED ${projects.length} PROJECT NODES`);
    }

    async function showProjects() {
      if (projectsLoading) return;
      projectsLoading = true;
      try {
        renderProjects(await fetchProjects());
      } finally {
        projectsLoading = false;
      }
    }

    /* ---------- audio i wizualizer ---------- */

    useEffectiveVolumeLabel();

    function effectiveVolume() {
      return clamp(Math.round(baseVolume * (pageHidden ? 0.35 : 1)), 0, 100);
    }

    function useEffectiveVolumeLabel() {
      if (el.volume) el.volume.value = String(baseVolume);
      if (el.volumeValue) el.volumeValue.textContent = `${baseVolume}%`;
    }

    function setStatus(text, message) {
      if (el.status) el.status.textContent = text;
      if (message) displayTerminalMessage(message);
    }

    function updatePlayButton() {
      if (!el.playBtn) return;
      el.playBtn.textContent = isPlaying ? 'PAUSE_AMBIENT' : 'TOGGLE_AMBIENT';
      el.playBtn.setAttribute('aria-pressed', String(isPlaying));
    }

    function applyVolume() {
      if (player && typeof player.setVolume === 'function') player.setVolume(effectiveVolume());
      if (el.audio) el.audio.volume = effectiveVolume() / 100;
    }

    function disarmGestureUnlock() {
      if (!gestureUnlock) return;
      ['pointerdown', 'keydown', 'touchstart'].forEach((type) => {
        document.removeEventListener(type, gestureUnlock, true);
      });
      gestureUnlock = null;
    }

    function armGestureUnlock() {
      if (gestureUnlock) return;
      gestureUnlock = (event) => {
        if (event && event.target && event.target.closest && event.target.closest('#playMusicBtn')) return;
        const wasWaiting = waitingForGesture;
        waitingForGesture = false;
        disarmGestureUnlock();
        if (audioContext && audioContext.state === 'suspended') audioContext.resume().catch(() => {});
        if (el.audio) el.audio.muted = false;
        if (player && typeof player.unMute === 'function') player.unMute();
        applyVolume();
        if (activeSource === 'local' && el.audio) {
          if (el.audio.paused) playLocalTrack();
          else setStatus('PLAYING [LOCAL]');
        } else if (activeSource === 'youtube' && player && typeof player.playVideo === 'function') {
          try { player.playVideo(); } catch (_) { /* player jeszcze się nie uruchomił */ }
          setStatus('PLAYING');
        }
        displayTerminalMessage(wasWaiting
          ? '> DŹWIĘK AMBIENTU WŁĄCZONY'
          : '> AMBIENT STARTUJE PO PIERWSZEJ INTERAKCJI');
      };
      ['pointerdown', 'keydown', 'touchstart'].forEach((type) => {
        document.addEventListener(type, gestureUnlock, true);
      });
    }

    function sizeCanvas() {
      if (!ctx || !el.canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = el.canvas.clientWidth || 90;
      const height = el.canvas.clientHeight || 18;
      el.canvas.width = Math.round(width * dpr);
      el.canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawVisualizer();
    }

    function drawVisualizer() {
      if (!ctx || !el.canvas) return;
      const width = el.canvas.clientWidth || 90;
      const height = el.canvas.clientHeight || 18;
      const style = getComputedStyle(document.body);
      const bright = style.getPropertyValue('--secondary').trim() || '#ff2a2a';
      const dim = style.getPropertyValue('--dim').trim() || '#4d0000';

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, width, height);

      const bars = 18;
      const gap = 1;
      const barWidth = Math.max(1, (width - gap * (bars - 1)) / bars);
      const levels = [];

      if (isPlaying && activeSource === 'local' && analyser && frequencyData) {
        analyser.getByteFrequencyData(frequencyData);
        for (let i = 0; i < bars; i += 1) {
          levels.push(frequencyData[Math.floor(i * frequencyData.length / bars)] / 255);
        }
      } else if (isPlaying) {
        const phase = performance.now() / 280;
        for (let i = 0; i < bars; i += 1) {
          const wave = (Math.sin(phase + i * 0.55) + Math.sin(phase * 1.7 + i * 0.23)) / 2;
          levels.push(clamp(0.3 + wave * 0.25 + baseVolume / 400, 0.08, 1));
        }
      } else {
        for (let i = 0; i < bars; i += 1) levels.push(0.05);
      }

      ctx.fillStyle = isPlaying ? bright : dim;
      levels.forEach((level, index) => {
        const barHeight = Math.max(1, clamp(level, 0, 1) * (height - 2));
        ctx.fillRect(index * (barWidth + gap), height - barHeight - 1, barWidth, barHeight);
      });
    }

    function animateVisualizer() {
      drawVisualizer();
      rafId = window.requestAnimationFrame(animateVisualizer);
    }

    function startVisualizer() {
      if (reduceMotion || !ctx) {
        drawVisualizer();
        return;
      }
      if (!rafId) animateVisualizer();
    }

    function stopVisualizer() {
      if (rafId) window.cancelAnimationFrame(rafId);
      rafId = 0;
      drawVisualizer();
    }

    function setupLocalAnalyser() {
      if (!el.audio || audioContext) return;
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      try {
        audioContext = new AudioCtx();
        const source = audioContext.createMediaElementSource(el.audio);
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 128;
        analyser.smoothingTimeConstant = 0.75;
        frequencyData = new Uint8Array(analyser.frequencyBinCount);
        source.connect(analyser);
        analyser.connect(audioContext.destination);
      } catch (_) {
        audioContext = null;
        analyser = null;
        frequencyData = null;
      }
    }

    async function playLocalTrack() {
      if (!el.audio) {
        setStatus('NO AUDIO');
        return;
      }
      try {
        if (audioContext && audioContext.state === 'suspended') audioContext.resume().catch(() => {});
        el.audio.muted = false;
        await el.audio.play();
        waitingForGesture = false;
        disarmGestureUnlock();
      } catch (_) {
        // Przeglądarki blokują dźwięk bez gestu — uruchamiamy odtwarzanie wyciszone.
        try {
          if (audioContext && audioContext.state === 'suspended') audioContext.resume().catch(() => {});
          el.audio.muted = true;
          await el.audio.play();
          waitingForGesture = true;
          setStatus('PLAYING [MUTED]', '> AUTOPLAY WYCISZONY // PIERWSZA INTERAKCJA WŁĄCZY DŹWIĘK');
          armGestureUnlock();
        } catch (_) {
          el.audio.muted = false;
          waitingForGesture = false;
          setStatus('CLICK TO PLAY');
          updatePlayButton();
          armGestureUnlock();
          displayTerminalMessage('> AUTOPLAY ZABLOKOWANY // PIERWSZA INTERAKCJA WŁĄCZY MUZYKĘ');
        }
      }
    }

    function switchToLocal(reason) {
      if (activeSource === 'local') return;
      window.clearTimeout(autoplayTimer);
      activeSource = 'local';
      isPlaying = false;
      window.clearTimeout(ytTimeout);
      try {
        if (player && typeof player.destroy === 'function') player.destroy();
      } catch (_) { /* iframe już usunięty */ }
      player = null;
      const host = document.getElementById('player');
      if (host) host.hidden = true;
      setupLocalAnalyser();
      applyVolume();
      updatePlayButton();
      stopVisualizer();
      setStatus('LOCAL', `> AUDIO FALLBACK ACTIVE: ${reason}`);
      playLocalTrack();
    }

    function initPlayer() {
      if (playerInitialized || activeSource !== 'youtube') return;
      playerInitialized = true;
      window.clearTimeout(ytTimeout);
      try {
        player = new YT.Player('player', {
          videoId: VIDEO_ID,
          playerVars: {
            autoplay: 1,
            controls: 0,
            disablekb: 1,
            enablejsapi: 1,
            fs: 0,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
            showinfo: 0
          },
          events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
            onError: () => switchToLocal('YT_STREAM_ERROR')
          }
        });
        setStatus('LOADING', '> INITIALIZING WIRED AUDIO STREAM...');
      } catch (_) {
        switchToLocal('YT_INIT_FAILED');
      }
    }

    function onPlayerReady(event) {
      window.clearTimeout(ytTimeout);
      applyVolume();
      try {
        const iframe = player && player.getIframe && player.getIframe();
        if (iframe) iframe.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture');
      } catch (_) { /* starszy iframe API */ }
      setStatus('AUTOPLAY', '> LAYER_00 AUDIO STREAM READY // PRÓBUJĘ AUTOPLAY');
      try {
        event.target.playVideo();
      } catch (_) {
        displayTerminalMessage('> YT AUTOPLAY BLOCKED // Czekam na local fallback');
      }
      window.clearTimeout(autoplayTimer);
      autoplayTimer = window.setTimeout(() => {
        if (!userTookControl && !isPlaying && activeSource === 'youtube') {
          switchToLocal('YT_AUTOPLAY_BLOCKED');
        }
      }, 5000);
    }

    function onPlayerStateChange(event) {
      if (activeSource !== 'youtube') return;
      if (event.data === YT_STATE.PLAYING) {
        window.clearTimeout(autoplayTimer);
        waitingForGesture = false;
        disarmGestureUnlock();
        isPlaying = true;
        setStatus('PLAYING');
        updatePlayButton();
        startVisualizer();
        displayTerminalMessage('> AMBIENT SOUNDS ENABLED');
      } else if (event.data === YT_STATE.PAUSED) {
        isPlaying = false;
        setStatus('PAUSED');
        updatePlayButton();
        stopVisualizer();
        displayTerminalMessage('> AMBIENT SOUNDS DISABLED');
      } else if (event.data === YT_STATE.ENDED) {
        try { player.playVideo(); } catch (_) { /* koniec strumienia */ }
      } else if (event.data === YT_STATE.BUFFERING) {
        setStatus('BUFFERING');
        startVisualizer();
      } else if (event.data === YT_STATE.UNSTARTED) {
        isPlaying = false;
        setStatus(userTookControl ? 'PAUSED' : 'AUTOPLAY');
        updatePlayButton();
        stopVisualizer();
      }
    }

    function loadYouTube() {
      onApiReady = initPlayer;
      if (window.YT && window.YT.Player) {
        initPlayer();
        pendingApiReady = false;
        return;
      }
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      tag.async = true;
      tag.onerror = () => switchToLocal('YT_API_BLOCKED');
      (document.head || document.documentElement).appendChild(tag);
      ytTimeout = window.setTimeout(() => switchToLocal('YT_API_TIMEOUT'), 8000);
      if (pendingApiReady) {
        pendingApiReady = false;
        initPlayer();
      }
    }

    function togglePlayback() {
      userTookControl = true;
      window.clearTimeout(autoplayTimer);
      if (waitingForGesture) {
        waitingForGesture = false;
        disarmGestureUnlock();
        if (audioContext && audioContext.state === 'suspended') audioContext.resume().catch(() => {});
        if (el.audio) el.audio.muted = false;
        applyVolume();
        setStatus(activeSource === 'local' ? 'PLAYING [LOCAL]' : 'PLAYING');
        updatePlayButton();
        displayTerminalMessage('> DŹWIĘK AMBIENTU WŁĄCZONY');
        return;
      }
      if (activeSource === 'youtube') {
        if (!player || typeof player.getPlayerState !== 'function') {
          displayTerminalMessage('> ERROR: PLAYER NOT READY');
          return;
        }
        const state = player.getPlayerState();
        if (state === YT_STATE.PLAYING || state === YT_STATE.BUFFERING) player.pauseVideo();
        else player.playVideo();
        return;
      }

      if (el.audio && !el.audio.paused) el.audio.pause();
      else playLocalTrack();
    }

    /* ---------- zdarzenia ---------- */

    el.themeButtons.forEach((button) => {
      button.addEventListener('click', () => setTheme(button.dataset.theme));
    });

    if (el.playBtn) el.playBtn.addEventListener('click', togglePlayback);

    if (el.audio) {
      el.audio.addEventListener('play', () => {
        isPlaying = true;
        setStatus('PLAYING [LOCAL]');
        updatePlayButton();
        startVisualizer();
      });
      el.audio.addEventListener('pause', () => {
        isPlaying = false;
        setStatus('PAUSED [LOCAL]');
        updatePlayButton();
        stopVisualizer();
      });
      el.audio.addEventListener('error', () => {
        isPlaying = false;
        setStatus('AUDIO ERROR');
        stopVisualizer();
        displayTerminalMessage('> ERROR: LOCAL AUDIO FILE UNAVAILABLE');
      });
    }

    if (el.volume) {
      el.volume.addEventListener('input', (event) => {
        baseVolume = clamp(parseInt(event.target.value, 10) || 0, 0, 100);
        store.set('audioVolume', String(baseVolume));
        useEffectiveVolumeLabel();
        applyVolume();
      });
    }

    document.addEventListener('visibilitychange', () => {
      pageHidden = document.hidden;
      applyVolume();
      if (isPlaying) setStatus(pageHidden ? 'BACKGROUND' : activeSource === 'local' ? 'PLAYING [LOCAL]' : 'PLAYING');
    });

    if (el.apiBtn) el.apiBtn.addEventListener('click', () => executeCommand());

    if (el.repoPath) {
      el.repoPath.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          executeCommand();
        } else if (event.key === 'ArrowUp' && historyIndex > 0) {
          event.preventDefault();
          historyIndex -= 1;
          el.repoPath.value = history[historyIndex];
        } else if (event.key === 'ArrowDown') {
          event.preventDefault();
          if (historyIndex < history.length - 1) {
            historyIndex += 1;
            el.repoPath.value = history[historyIndex];
          } else {
            historyIndex = history.length;
            el.repoPath.value = '';
          }
        } else if (event.key === 'Tab' && el.repoPath.value.trim()) {
          const prefix = el.repoPath.value.trim().toLowerCase();
          const matches = COMMANDS.filter((command) => command.startsWith(prefix));
          if (matches.length === 1) {
            event.preventDefault();
            el.repoPath.value = `${matches[0]} `;
          }
        }
      });
    }

    document.querySelectorAll('.node-trigger[data-cmd]').forEach((trigger) => {
      trigger.addEventListener('click', (event) => {
        event.preventDefault();
        executeCommand(trigger.dataset.cmd);
        if (el.terminal && el.terminal.scrollIntoView) {
          el.terminal.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' });
        }
      });
    });

    window.addEventListener('resize', sizeCanvas);
    window.addEventListener('beforeunload', () => {
      stopVisualizer();
      if (audioContext && audioContext.state !== 'closed') audioContext.close().catch(() => {});
    });

    /* ---------- start ---------- */

    if (el.clock) {
      const tick = () => {
        el.clock.textContent = new Date().toLocaleTimeString('pl-PL', {
          hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
        });
      };
      tick();
      window.setInterval(tick, 1000);
    }

    window.__AUDIO_DEBUG__ = () => ({
      source: activeSource,
      playing: isPlaying,
      waitingForGesture,
      userTookControl,
      volume: effectiveVolume(),
      local: el.audio ? {
        paused: el.audio.paused,
        muted: el.audio.muted,
        time: Number(el.audio.currentTime.toFixed(2))
      } : null
    });

    setTheme(resolveTheme(store.get('cyberTheme')) || 'lain', false);
    displayTerminalMessage('> LAYER_00 INITIALIZED');
    displayTerminalMessage('> PRESENT DAY, PRESENT TIME');
    displayTerminalMessage("> TYPE 'HELP' OR CLICK A NODE ABOVE");
    sizeCanvas();
    loadYouTube();
    showProjects();
  });
})();
