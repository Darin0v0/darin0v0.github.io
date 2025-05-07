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

  // Obsługa muzyki
  playMusicBtn.addEventListener('click', () => {
    if (musicPlaying) {
      bgMusic.pause();
      displayTerminalMessage("> AMBIENT SOUNDS DISABLED");
      playMusicBtn.textContent = "TOGGLE_AMBIENT";
    } else {
      bgMusic.play().catch(e => {
        console.log("Audio error:", e);
        displayTerminalMessage("> ERROR: CLICK TO ENABLE AUDIO");
      });
      displayTerminalMessage("> AMBIENT SOUNDS ENABLED");
      playMusicBtn.textContent = "MUTE_AMBIENT";
    }
    musicPlaying = !musicPlaying;
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
      link.textContent = 'VIEW LIVE DEMO';
      
      const githubLink = document.createElement('a');
      githubLink.className = 'project-link github-link';
      githubLink.href = `https://github.com/${GITHUB_USER}/${GITHUB_REPO}/tree/main/${PROJECTS_PATH}/${project.name}`;
      githubLink.target = '_blank';
      githubLink.rel = 'noopener noreferrer';
      githubLink.textContent = 'VIEW SOURCE CODE';
      
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
});
