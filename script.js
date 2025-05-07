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

  // Funkcja bezpiecznego wyświetlania tekstu w terminalu
  const displayTerminalMessage = (message) => {
    const div = document.createElement('div');
    div.textContent = message;
    terminalOutput.appendChild(div);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
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

  // Symulowane projekty
  const projects = [
    {
      name: "CYBER_TERMINAL",
      description: "Interactive cyberpunk terminal interface",
      technologies: "HTML, CSS, JavaScript",
      url: "#"
    },
    {
      name: "NEURAL_NETWORK",
      description: "Machine learning implementation",
      technologies: "Python, TensorFlow",
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
      "> CLEAR - CLEAR TERMINAL SCREEN"
    ];
    
    helpMessages.forEach(msg => displayTerminalMessage(msg));
  }

  function showProjects() {
    projectsContainer.innerHTML = '';
    projectsContainer.style.display = 'block';
    
    projects.forEach(project => {
      const projectCard = document.createElement('div');
      projectCard.className = 'project-card';
      
      const title = document.createElement('h3');
      title.className = 'project-title';
      title.textContent = project.name;
      
      const desc = document.createElement('p');
      desc.className = 'project-description';
      desc.textContent = project.description;
      
      const tech = document.createElement('p');
      tech.className = 'project-tech';
      tech.textContent = project.technologies;
      
      const link = document.createElement('a');
      link.className = 'project-link';
      link.href = project.url;
      link.target = '_blank';
      link.textContent = 'VIEW PROJECT';
      
      projectCard.append(title, desc, tech, link);
      projectsContainer.appendChild(projectCard);
    });
    
    displayTerminalMessage("> PROJECTS LOADED. SCROLL TO VIEW.");
  }

  // Inicjalizacja terminala
  displayTerminalMessage("> SYSTEM READY");
  displayTerminalMessage("> AWAITING USER INPUT");
});
