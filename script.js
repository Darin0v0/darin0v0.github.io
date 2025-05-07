document.addEventListener('DOMContentLoaded', function() {
  // Elementy DOM
  const terminalOutput = document.getElementById('terminalOutput');
  const repoPath = document.getElementById('repoPath');
  const apiBtn = document.getElementById('apiBtn');
  const playMusicBtn = document.getElementById('playMusicBtn');
  const projectsContainer = document.getElementById('projectsContainer');
  const bgMusic = document.getElementById('bgMusic');
  const themeButtons = document.querySelectorAll('.theme-switcher button');
  const body = document.body;
  
  // Zmienne stanu
  let musicPlaying = false;
  
  // Funkcje pomocnicze
  function addToTerminal(text) {
    terminalOutput.innerHTML += text + '<br>';
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }
  
  function typeWriter(text, element) {
    let i = 0;
    const speed = 20;
    function typing() {
      if (i < text.length) {
        element.innerHTML = text.substring(0, i+1);
        i++;
        setTimeout(typing, speed);
      }
    }
    typing();
  }

  // Dane projektów
  const projects = [
    {
      name: "CYBER_TERMINAL",
      description: "Interactive terminal interface",
      url: "#"
    },
    {
      name: "NEURAL_NETWORK",
      description: "Machine learning implementation",
      url: "#"
    },
    {
      name: "GITHUB_PROFILE",
      description: "My GitHub repositories",
      url: "https://github.com/Darin0v0"
    }
  ];

  // Inicjalizacja terminala
  addToTerminal("> SYSTEM INITIALIZED");
  addToTerminal("> WELCOME TO MY DIGITAL SPACE");
  addToTerminal("> TYPE COMMAND BELOW");

  // Przełącznik motywów
  themeButtons.forEach(button => {
    button.addEventListener('click', function() {
      const theme = this.getAttribute('data-theme');
      body.className = `theme-${theme}`;
      localStorage.setItem('cyberTheme', theme);
      addToTerminal(`> THEME CHANGED TO ${theme.toUpperCase()}`);
    });
  });

  // Przywróć zapisany motyw
  const savedTheme = localStorage.getItem('cyberTheme');
  if (savedTheme) {
    body.className = `theme-${savedTheme}`;
  }

  // Muzyka
  playMusicBtn.addEventListener('click', function() {
    if (musicPlaying) {
      bgMusic.pause();
      addToTerminal("> AMBIENT SOUNDS DISABLED");
      this.textContent = "TOGGLE_AMBIENT";
    } else {
      bgMusic.play().catch(e => console.log("Audio play failed:", e));
      addToTerminal("> AMBIENT SOUNDS ENABLED");
      this.textContent = "MUTE_AMBIENT";
    }
    musicPlaying = !musicPlaying;
  });

  // Obsługa komend
  apiBtn.addEventListener('click', executeCommand);
  repoPath.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') executeCommand();
  });

  function executeCommand() {
    const command = repoPath.value.trim().toLowerCase();
    repoPath.value = '';
    
    if (!command) {
      addToTerminal("> ERROR: NO COMMAND PROVIDED");
      return;
    }
    
    addToTerminal(`> EXECUTING: ${command.toUpperCase()}`);
    
    setTimeout(() => {
      if (command === 'help' || command === '?') {
        showHelp();
      } else if (command === 'projects' || command === 'show projects') {
        showProjects();
      } else if (command === 'clear') {
        terminalOutput.innerHTML = '';
        projectsContainer.style.display = 'none';
      } else if (command === 'about') {
        showAbout();
      } else {
        addToTerminal(`> UNKNOWN COMMAND: ${command.toUpperCase()}`);
        addToTerminal("> TYPE 'HELP' FOR AVAILABLE COMMANDS");
      }
    }, 500);
  }
  
  function showHelp() {
    const helpText = [
      "> AVAILABLE COMMANDS:",
      "> HELP - SHOW THIS HELP MESSAGE",
      "> PROJECTS - DISPLAY MY PROJECTS",
      "> ABOUT - SHOW INFORMATION ABOUT ME",
      "> CLEAR - CLEAR TERMINAL SCREEN"
    ].join('<br>');
    
    addToTerminal(helpText);
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
      projectBtn.style.textAlign = 'left';
      projectBtn.style.padding = '1rem';
      projectBtn.textContent = `${project.name} - ${project.description}`;
      projectBtn.target = '_blank';
      projectsContainer.appendChild(projectBtn);
    });
    
    addToTerminal("> PROJECTS LOADED. SCROLL TO VIEW.");
  }
  
  function showAbout() {
    const aboutText = [
      "> DARIN_0V0",
      "> FULL-STACK DEVELOPER",
      "> SPECIALIZING IN:",
      "> - WEB DEVELOPMENT",
      "> - CYBERPUNK AESTHETICS",
      "> - INTERACTIVE DESIGN"
    ].join('<br>');
    
    addToTerminal(aboutText);
  }
});
