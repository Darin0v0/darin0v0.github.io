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
      const projectCard = document.createElement('div');
      projectCard.className = 'project-card';
      projectCard.innerHTML = `
        <h3 class="project-title">${project.name}</h3>
        <p class="project-description">${project.description}</p>
        <p class="project-tech">${project.technologies}</p>
        <a href="${project.url}" class="project-link" target="_blank">VIEW PROJECT</a>
      `;
      projectsContainer.appendChild(projectCard);
    });
    
    terminalOutput.innerHTML += "> PROJECTS LOADED. SCROLL TO VIEW.<br>";
  }

  // Inicjalizacja terminala
  terminalOutput.innerHTML += "> SYSTEM READY<br>> AWAITING USER INPUT<br>";
});
