document.addEventListener('DOMContentLoaded', function() {
  // Elementy DOM
  const terminalOutput = document.getElementById('terminalOutput');
  const themeButtons = document.querySelectorAll('.theme-switcher button');
  const playMusicBtn = document.getElementById('playMusicBtn');
  const bgMusic = document.getElementById('bgMusic');
  const apiBtn = document.getElementById('apiBtn');
  const repoPath = document.getElementById('repoPath');
  const projectsContainer = document.getElementById('projectsContainer');
  
  let musicPlaying = false;

  // Funkcja zmiany motywu
  const setTheme = (theme) => {
    document.body.className = `theme-${theme}`;
    localStorage.setItem('cyberTheme', theme);
    terminalOutput.innerHTML += `> THEME CHANGED TO ${theme.toUpperCase()}<br>`;
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  };

  // Przywróć zapisany motyw
  const savedTheme = localStorage.getItem('cyberTheme') || 'matrix';
  setTheme(savedTheme);

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
      terminalOutput.innerHTML += "> AMBIENT SOUNDS DISABLED<br>";
      playMusicBtn.textContent = "TOGGLE_AMBIENT";
    } else {
      bgMusic.play().catch(e => console.log("Audio error:", e));
      terminalOutput.innerHTML += "> AMBIENT SOUNDS ENABLED<br>";
      playMusicBtn.textContent = "MUTE_AMBIENT";
    }
    musicPlaying = !musicPlaying;
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  });

  // Lista projektów jako przyciski
  const projects = [
    {
      name: "CYBER_TERMINAL",
      description: "Interactive cyberpunk terminal interface",
      url: "#"
    },
    {
      name: "NEURAL_NETWORK",
      description: "Machine learning implementation",
      url: "#"
    },
    {
      name: "GITHUB_PROFILE",
      description: "Check my GitHub repositories",
      url: "https://github.com/Darin0v0"
    },
    {
      name: "QUANTUM_SIM",
      description: "Quantum computing simulation",
      url: "#"
    }
  ];

  // Obsługa komend
  apiBtn.addEventListener('click', executeCommand);
  repoPath.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') executeCommand();
  });

  function executeCommand() {
    const command = repoPath.value.trim().toLowerCase();
    repoPath.value = '';
    
    if (!command) {
      terminalOutput.innerHTML += "> ERROR: NO COMMAND PROVIDED<br>";
      return;
    }
    
    terminalOutput.innerHTML += `> EXECUTING: ${command.toUpperCase()}<br>`;
    
    setTimeout(() => {
      if (command === 'help' || command === '?') {
        showHelp();
      } else if (command === 'projects' || command === 'show projects') {
        showProjects();
      } else if (command === 'clear') {
        terminalOutput.innerHTML = '';
      } else if (command === 'about') {
        terminalOutput.innerHTML += "> DARIN_0V0: FULL-STACK DEVELOPER<br>> SPECIALIZING IN CYBERPUNK AESTHETICS<br>";
      } else {
        terminalOutput.innerHTML += `> UNKNOWN COMMAND: ${command.toUpperCase()}<br>> TYPE 'HELP' FOR AVAILABLE COMMANDS<br>`;
      }
      terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }, 500);
  }

  function showHelp() {
    terminalOutput.innerHTML += `
      > AVAILABLE COMMANDS:<br>
      > HELP - SHOW THIS MESSAGE<br>
      > PROJECTS - DISPLAY MY PROJECTS<br>
      > ABOUT - SHOW INFORMATION ABOUT ME<br>
      > CLEAR - CLEAR TERMINAL SCREEN<br>
    `;
  }

  function showProjects() {
    projectsContainer.innerHTML = '';
    projectsContainer.style.display = 'block';
    
    projects.forEach(project => {
      const projectBtn = document.createElement('a');
      projectBtn.href = project.url;
      projectBtn.className = 'cyber-button';
      projectBtn.style.display = 'block';
      projectBtn.style.margin = '0.5rem 0';
      projectBtn.textContent = `${project.name} - ${project.description}`;
      projectBtn.target = '_blank';
      projectsContainer.appendChild(projectBtn);
    });
    
    terminalOutput.innerHTML += "> PROJECTS LOADED. SCROLL TO VIEW.<br>";
  }

  // Inicjalizacja terminala
  terminalOutput.innerHTML += "> SYSTEM READY<br>> AWAITING USER INPUT<br>";
});
