document.addEventListener('DOMContentLoaded', function() {
  // Konfiguracja
  const GITHUB_USER = 'Darin0v0';
  const GITHUB_REPO = 'Darin0v0.github.io';
  const PROJECTS_PATH = 'projects';

  // Elementy DOM
  const terminalOutput = document.getElementById('terminalOutput');
  const themeButtons = document.querySelectorAll('.theme-switcher button');
  const playMusicBtn = document.getElementById('playMusicBtn');
  const bgMusic = document.getElementById('bgMusic');
  const apiBtn = document.getElementById('apiBtn');
  const repoPath = document.getElementById('repoPath');
  const projectsContainer = document.getElementById('projectsContainer');
  
  let musicPlaying = false;

  // Audio System Variables
  const volumeControl = document.getElementById('volumeControl');
  const volumeValue = document.querySelector('.volume-value');
  const audioVisualizer = document.getElementById('audioVisualizer');
  const audioStatus = document.querySelector('.audio-status');
  let audioContext = null;
  let analyser = null;
  let audioSource = null;
  let isPlaying = false;
  let animationFrame;
  let player;

  // Load YouTube IFrame API
  function loadYouTubeAPI() {
    if (window.YT) {
      initPlayer();
      return;
    }

    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }

  // Initialize YouTube Player
  function initPlayer() {
    try {
      player = new YT.Player('player', {
        videoId: 'cReuQk0pJbI',
        playerVars: {
          'autoplay': 1,
          'controls': 0,
          'disablekb': 1,
          'enablejsapi': 1,
          'fs': 0,
          'modestbranding': 1,
          'playsinline': 1,
          'rel': 0,
          'showinfo': 0
        },
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange,
          'onError': onPlayerError
        }
      });
      displayTerminalMessage("> INITIALIZING YOUTUBE PLAYER");
    } catch (error) {
      console.error('YouTube player initialization failed:', error);
      displayTerminalMessage("> ERROR: YOUTUBE PLAYER INITIALIZATION FAILED");
      audioStatus.textContent = "ERROR";
    }
  }

  function onPlayerReady(event) {
    try {
      // Set initial volume
      const savedVolume = localStorage.getItem('audioVolume') || 50;
      player.setVolume(savedVolume);
      volumeControl.value = savedVolume;
      volumeValue.textContent = `${savedVolume}%`;
      
      // Start playing
      event.target.playVideo();
      isPlaying = true;
      playMusicBtn.textContent = "MUTE_AMBIENT";
      audioStatus.textContent = "PLAYING";
      displayTerminalMessage("> YOUTUBE PLAYER READY");
    } catch (error) {
      console.error('Player ready handler failed:', error);
      displayTerminalMessage("> ERROR: PLAYER SETUP FAILED");
      audioStatus.textContent = "ERROR";
    }
  }

  function onPlayerStateChange(event) {
    try {
      if (event.data == YT.PlayerState.PLAYING) {
        isPlaying = true;
        playMusicBtn.textContent = "MUTE_AMBIENT";
        audioStatus.textContent = "PLAYING";
        displayTerminalMessage("> AMBIENT SOUNDS ENABLED");
      } else if (event.data == YT.PlayerState.PAUSED) {
        isPlaying = false;
        playMusicBtn.textContent = "TOGGLE_AMBIENT";
        audioStatus.textContent = "PAUSED";
        displayTerminalMessage("> AMBIENT SOUNDS DISABLED");
      } else if (event.data == YT.PlayerState.ENDED) {
        // Restart the video when it ends
        player.playVideo();
      }
    } catch (error) {
      console.error('State change handler failed:', error);
      displayTerminalMessage("> ERROR: PLAYER STATE CHANGE FAILED");
    }
  }

  function onPlayerError(event) {
    console.error('YouTube player error:', event.data);
    displayTerminalMessage("> ERROR: YOUTUBE PLAYER ERROR");
    audioStatus.textContent = "ERROR";
  }

  // Volume Control
  volumeControl.addEventListener('input', (e) => {
    try {
      const volume = parseInt(e.target.value);
      if (player && player.setVolume) {
        player.setVolume(volume);
        volumeValue.textContent = `${volume}%`;
        localStorage.setItem('audioVolume', volume);
      }
    } catch (error) {
      console.error('Volume control failed:', error);
      displayTerminalMessage("> ERROR: VOLUME CONTROL FAILED");
    }
  });

  // Toggle Play/Pause
  playMusicBtn.addEventListener('click', () => {
    try {
      if (player && player.getPlayerState) {
        if (isPlaying) {
          player.pauseVideo();
        } else {
          player.playVideo();
        }
      } else {
        displayTerminalMessage("> ERROR: PLAYER NOT READY");
      }
    } catch (error) {
      console.error('Play/Pause failed:', error);
      displayTerminalMessage("> ERROR: PLAYBACK CONTROL FAILED");
    }
  });

  // Handle visibility change
  document.addEventListener('visibilitychange', () => {
    try {
      if (document.hidden) {
        if (isPlaying && player && player.setVolume) {
          player.setVolume(20);
          audioStatus.textContent = "BACKGROUND";
        }
      } else {
        if (isPlaying && player && player.setVolume) {
          player.setVolume(parseInt(volumeControl.value));
          audioStatus.textContent = "PLAYING";
        }
      }
    } catch (error) {
      console.error('Visibility change handler failed:', error);
    }
  });

  // Initialize YouTube API
  window.onYouTubeIframeAPIReady = initPlayer;
  loadYouTubeAPI();

  // Funkcje pomocnicze
  const displayTerminalMessage = (message) => {
    const div = document.createElement('div');
    div.textContent = message;
    terminalOutput.appendChild(div);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  };

  const setLoading = (isLoading) => {
    apiBtn.disabled = isLoading;
    apiBtn.textContent = isLoading ? 'LOADING...' : 'EXECUTE_QUERY';
  };

  // Funkcja zmiany motywu
  const setTheme = (theme) => {
    try {
      document.body.className = `theme-${theme}`;
      localStorage.setItem('cyberTheme', theme);
      displayTerminalMessage(`> THEME CHANGED TO ${theme.toUpperCase()}`);
    } catch (e) {
      console.error("Error saving theme:", e);
      displayTerminalMessage("> THEME CHANGED BUT NOT SAVED");
    }
  };

  // Przywróć zapisany motyw
  try {
    const savedTheme = localStorage.getItem('cyberTheme') || 'matrix';
    setTheme(savedTheme);
  } catch (e) {
    console.error("Error loading theme:", e);
    setTheme('matrix');
  }

  // Obsługa przycisków motywów
  themeButtons.forEach(button => {
    button.addEventListener('click', () => {
      const theme = button.getAttribute('data-theme');
      setTheme(theme);
    });
  });

  // Audio System Initialization
  function initializeAudioContext() {
    try {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioContext.createAnalyser();
      return true;
    } catch (error) {
      console.error('Failed to initialize Audio Context:', error);
      displayTerminalMessage("> ERROR: AUDIO SYSTEM INITIALIZATION FAILED");
      return false;
    }
  }

  // Audio System Setup
  function setupAudioSystem() {
    if (!audioContext && !initializeAudioContext()) {
      return false;
    }

    try {
      if (!audioSource) {
        audioSource = audioContext.createMediaElementSource(bgMusic);
        audioSource.connect(analyser);
        analyser.connect(audioContext.destination);
      }

      // Configure analyser
      analyser.fftSize = 256;
      setupVisualizer();
      return true;
    } catch (error) {
      console.error('Failed to setup audio system:', error);
      displayTerminalMessage("> ERROR: AUDIO SETUP FAILED");
      return false;
    }
  }

  // Visualizer Setup
  function setupVisualizer() {
    const canvas = audioVisualizer;
    const canvasCtx = canvas.getContext('2d');
    
    // Set canvas size
    function resizeCanvas() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function drawVisualizer() {
      animationFrame = requestAnimationFrame(drawVisualizer);

      analyser.getByteFrequencyData(dataArray);
      canvasCtx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for(let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] / 255) * canvas.height;

        // Use theme colors for visualizer
        const computedStyle = getComputedStyle(document.body);
        const primary = computedStyle.getPropertyValue('--primary');
        const secondary = computedStyle.getPropertyValue('--secondary');
        
        const gradient = canvasCtx.createLinearGradient(0, canvas.height, 0, canvas.height - barHeight);
        gradient.addColorStop(0, primary || '#ff0000');
        gradient.addColorStop(1, secondary || '#00ff00');
        
        canvasCtx.fillStyle = gradient;
        canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }
    }

    drawVisualizer();
  }

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
    if (audioContext) {
      audioContext.close();
    }
  });

  // Pobieranie projektów z GitHub
  async function fetchProjects() {
    try {
      setLoading(true);
      displayTerminalMessage("> CONNECTING TO GITHUB API...");
      
      const response = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${PROJECTS_PATH}`);
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.filter(item => item.type === 'dir');
    } catch (error) {
      console.error("Error fetching projects:", error);
      displayTerminalMessage(`> ERROR: ${error.message}`);
      return [];
    } finally {
      setLoading(false);
    }
  }

  // Wyświetlanie projektów
  async function showProjects() {
    const projects = await fetchProjects();
    projectsContainer.innerHTML = '';
    projectsContainer.style.display = 'block';
    
    if (projects.length === 0) {
      displayTerminalMessage("> NO PROJECTS FOUND");
      return;
    }
    
    projects.forEach(project => {
      const projectCard = document.createElement('div');
      projectCard.className = 'project-card';
      
      const title = document.createElement('h3');
      title.className = 'project-title';
      title.textContent = project.name.replace(/-/g, ' ').toUpperCase();
      
      const link = document.createElement('a');
      link.className = 'project-link';
      link.href = `https://${GITHUB_USER}.github.io/${PROJECTS_PATH}/${project.name}/`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = 'OPEN';
      
      const githubLink = document.createElement('a');
      githubLink.className = 'project-link github-link';
      githubLink.href = `https://github.com/${GITHUB_USER}/${GITHUB_REPO}/tree/main/${PROJECTS_PATH}/${project.name}`;
      githubLink.target = '_blank';
      githubLink.rel = 'noopener noreferrer';
      githubLink.textContent = '      SOURCE CODE';
      
      projectCard.append(title, link, githubLink);
      projectsContainer.appendChild(projectCard);
    });
    
    displayTerminalMessage(`> LOADED ${projects.length} PROJECTS`);
  }

  // Obsługa komend
  apiBtn.addEventListener('click', executeCommand);
  repoPath.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') executeCommand();
  });

  function executeCommand() {
    const command = repoPath.value.trim().toLowerCase();
    repoPath.value = '';
    
    if (!command) {
      displayTerminalMessage("> ERROR: NO COMMAND PROVIDED");
      return;
    }
    
    displayTerminalMessage(`> EXECUTING: ${command.toUpperCase()}`);
    
    setTimeout(() => {
      if (command === 'help' || command === '?') {
        showHelp();
      } else if (command === 'projects' || command === 'show projects') {
        showProjects();
      } else if (command === 'clear') {
        terminalOutput.innerHTML = '';
      } else if (command === 'about') {
        displayTerminalMessage("> DARIN_0V0: FULL-STACK DEVELOPER");
        displayTerminalMessage("> SPECIALIZING IN CYBERPUNK AESTHETICS");
        displayTerminalMessage(`> GITHUB: github.com/${GITHUB_USER}`);
        displayTerminalMessage("> EMAIL: dawidmurias907@gmail.com");
      } else {
        displayTerminalMessage(`> UNKNOWN COMMAND: ${command.toUpperCase()}`);
        displayTerminalMessage("> TYPE 'HELP' FOR AVAILABLE COMMANDS");
      }
    }, 500);
  }

  function showHelp() {
    const helpMessages = [
      "> AVAILABLE COMMANDS:",
      "> HELP - SHOW THIS MESSAGE",
      "> PROJECTS - DISPLAY MY PROJECTS",
      "> ABOUT - SHOW INFORMATION ABOUT ME",
      "> CLEAR - CLEAR TERMINAL SCREEN",
      "> ",
      "> PROJECT NAVIGATION:",
      "> - CLICK 'VIEW LIVE DEMO' TO OPEN PROJECT",
      "> - CLICK 'VIEW SOURCE CODE' TO SEE CODE ON GITHUB"
    ];
    
    helpMessages.forEach(msg => displayTerminalMessage(msg));
  }

  // Inicjalizacja terminala
  displayTerminalMessage("> SYSTEM READY");
  displayTerminalMessage("> WELCOME TO CYBERSPACE TERMINAL");
  displayTerminalMessage("> TYPE 'HELP' FOR COMMAND LIST");

  // Remove old Lain theme background effect
  document.addEventListener('mousemove', (e) => {
    if (document.body.classList.contains('theme-lain')) {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      document.body.style.setProperty('--mouse-x', `${x}%`);
      document.body.style.setProperty('--mouse-y', `${y}%`);
    }
  });

  // Reset background when leaving Lain theme
  document.querySelectorAll('.theme-switcher button').forEach(button => {
    button.addEventListener('click', () => {
      document.body.style.background = '';
    });
  });
});
