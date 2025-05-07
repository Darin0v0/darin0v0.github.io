<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CYBERSPACE_TERMINAL</title>
  
  <!-- Czcionki -->
  <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@300;500;700&family=Orbitron:wght@400;700&family=Michroma&family=Titillium+Web:wght@300;600&family=Exo+2:wght@300;600&display=swap" rel="stylesheet">
  
  <!-- Ikona -->
  <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💻</text></svg>">
  
  <!-- Style -->
  <style>
    :root {
      --primary: #0f0;
      --secondary: #0ff;
      --background: #111;
      --text: #eee;
      --accent: #f0f;
      --highlight: rgba(0, 255, 255, 0.1);
      --glow: 0 0 5px var(--primary), 0 0 10px var(--primary);
    }

    /* Cyberpunk Theme */
    .theme-cyberpunk {
      --primary: #ff2a6d;
      --secondary: #05d9e8;
      --background: #0d0221;
      --text: #d1f7ff;
      --accent: #f6019d;
      --highlight: rgba(255, 42, 109, 0.1);
    }

    /* Matrix Theme */
    .theme-matrix {
      --primary: #00ff41;
      --secondary: #008f11;
      --background: #000;
      --text: #00ff41;
      --accent: #003b00;
      --highlight: rgba(0, 255, 65, 0.1);
    }

    /* Solarized Theme */
    .theme-solarized {
      --primary: #b58900;
      --secondary: #268bd2;
      --background: #002b36;
      --text: #839496;
      --accent: #d33682;
      --highlight: rgba(181, 137, 0, 0.1);
    }

    /* Ghost in the Shell Theme */
    .theme-ghost-in-the-shell {
      --primary: #ff4d4d;
      --secondary: #4dffff;
      --background: #1a1a2e;
      --text: #e6e6e6;
      --accent: #ff9999;
      --highlight: rgba(255, 77, 77, 0.1);
    }

    /* Evangelion Theme */
    .theme-evangelion {
      --primary: #ff0033;
      --secondary: #9900ff;
      --background: #0a0a1a;
      --text: #ccffff;
      --accent: #ffcc00;
      --highlight: rgba(255, 0, 51, 0.1);
    }

    /* Akira Theme */
    .theme-akira {
      --primary: #ff0000;
      --secondary: #ff9900;
      --background: #000033;
      --text: #ffffff;
      --accent: #990000;
      --highlight: rgba(255, 0, 0, 0.1);
    }

    /* Cowboy Bebop Theme */
    .theme-cowboy-bebop {
      --primary: #ff9900;
      --secondary: #00ccff;
      --background: #000033;
      --text: #ffffff;
      --accent: #9900cc;
      --highlight: rgba(255, 153, 0, 0.1);
    }

    /* Psycho-Pass Theme */
    .theme-psycho-pass {
      --primary: #ff4d4d;
      --secondary: #4d4dff;
      --background: #0d0d0d;
      --text: #f2f2f2;
      --accent: #b30000;
      --highlight: rgba(255, 77, 77, 0.1);
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Share Tech Mono', monospace;
      background-color: var(--background);
      color: var(--text);
      line-height: 1.6;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      transition: all 0.3s ease;
    }

    .cyber-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .cyber-header {
      text-align: center;
      margin-bottom: 2rem;
      border-bottom: 1px solid var(--primary);
      padding-bottom: 1rem;
      text-shadow: var(--glow);
    }

    .cyber-title {
      font-family: 'Orbitron', sans-serif;
      font-size: 2.5rem;
      color: var(--primary);
      margin-bottom: 0.5rem;
      letter-spacing: 0.2rem;
    }

    .cyber-subtitle {
      font-family: 'Rajdhani', sans-serif;
      font-size: 1.2rem;
      color: var(--secondary);
      letter-spacing: 0.1rem;
    }

    .theme-switcher {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 0.5rem;
      margin-top: 1.5rem;
    }

    .theme-switcher button {
      font-family: 'Share Tech Mono', monospace;
      background: transparent;
      color: var(--text);
      border: 1px solid var(--primary);
      padding: 0.5rem 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
      text-transform: uppercase;
      font-size: 0.7rem;
      letter-spacing: 0.1rem;
    }

    .theme-switcher button:hover {
      background: var(--highlight);
      color: var(--primary);
      text-shadow: var(--glow);
    }

    .cyber-main {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .terminal {
      background-color: rgba(0, 0, 0, 0.5);
      border: 1px solid var(--primary);
      padding: 1.5rem;
      margin-bottom: 1rem;
      font-family: 'Share Tech Mono', monospace;
      color: var(--primary);
      height: 300px;
      overflow-y: auto;
      text-shadow: 0 0 5px currentColor;
      box-shadow: inset 0 0 10px rgba(0, 255, 255, 0.1);
    }

    .terminal::-webkit-scrollbar {
      width: 5px;
    }

    .terminal::-webkit-scrollbar-track {
      background: transparent;
    }

    .terminal::-webkit-scrollbar-thumb {
      background: var(--primary);
    }

    .input-group {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .cyber-input {
      background: transparent;
      border: 1px solid var(--primary);
      padding: 0.8rem;
      color: var(--text);
      font-family: 'Share Tech Mono', monospace;
      width: 100%;
      transition: all 0.3s ease;
    }

    .cyber-input:focus {
      outline: none;
      box-shadow: 0 0 10px var(--highlight);
      background: rgba(0, 0, 0, 0.3);
    }

    .cyber-input::placeholder {
      color: var(--secondary);
      opacity: 0.7;
    }

    .button-group {
      display: flex;
      gap: 1rem;
    }

    .cyber-button {
      font-family: 'Rajdhani', sans-serif;
      background: transparent;
      color: var(--text);
      border: 1px solid var(--primary);
      padding: 0.8rem 1.5rem;
      cursor: pointer;
      transition: all 0.3s ease;
      text-transform: uppercase;
      letter-spacing: 0.1rem;
      flex: 1;
    }

    .cyber-button:hover {
      background: var(--highlight);
      color: var(--primary);
      text-shadow: var(--glow);
    }

    .cyber-footer {
      text-align: center;
      border-top: 1px solid var(--primary);
      padding-top: 1rem;
      margin-top: 2rem;
    }

    .footer-links {
      display: flex;
      justify-content: center;
      gap: 2rem;
      margin-top: 1rem;
    }

    .cyber-link {
      color: var(--secondary);
      text-decoration: none;
      transition: all 0.3s ease;
      font-family: 'Rajdhani', sans-serif;
      text-transform: uppercase;
      letter-spacing: 0.1rem;
      font-size: 0.9rem;
    }

    .cyber-link:hover {
      color: var(--primary);
      text-shadow: var(--glow);
    }

    .project-card {
      border: 1px solid var(--secondary);
      padding: 1rem;
      margin-bottom: 1rem;
      background: rgba(0, 0, 0, 0.3);
      transition: all 0.3s ease;
    }

    .project-card:hover {
      border-color: var(--primary);
      box-shadow: 0 0 10px var(--highlight);
    }

    .project-title {
      color: var(--primary);
      font-family: 'Rajdhani', sans-serif;
      margin-bottom: 0.5rem;
      font-size: 1.2rem;
    }

    .project-description {
      color: var(--text);
      margin-bottom: 0.5rem;
    }

    .project-tech {
      color: var(--secondary);
      font-size: 0.8rem;
      font-style: italic;
    }

    .project-link {
      display: inline-block;
      margin-top: 0.5rem;
      color: var(--accent);
      text-decoration: none;
    }

    .project-link:hover {
      text-decoration: underline;
    }

    @media (max-width: 768px) {
      .cyber-container {
        padding: 1rem;
      }
      
      .cyber-title {
        font-size: 1.8rem;
      }
      
      .cyber-subtitle {
        font-size: 1rem;
      }
      
      .theme-switcher {
        flex-direction: column;
      }
      
      .button-group {
        flex-direction: column;
      }
      
      .footer-links {
        flex-direction: column;
        gap: 0.5rem;
      }
    }

    /* Typing animation */
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }

    .cursor {
      display: inline-block;
      width: 10px;
      height: 1.2rem;
      background-color: var(--primary);
      vertical-align: middle;
      margin-left: 2px;
      animation: blink 1s step-end infinite;
    }

    /* Glitch effect */
    @keyframes glitch {
      0% { transform: translate(0); }
      20% { transform: translate(-2px, 2px); }
      40% { transform: translate(-2px, -2px); }
      60% { transform: translate(2px, 2px); }
      80% { transform: translate(2px, -2px); }
      100% { transform: translate(0); }
    }

    .glitch {
      animation: glitch 0.5s linear infinite;
    }

    .glitch:hover {
      animation: none;
    }
  </style>
  
  <!-- Preload audio -->
  <link rel="preload" href="https://www.myinstants.com/media/sounds/ghost-in-the-shell-innocence-cyberbrain-conversation.mp3" as="audio">
</head>
<body class="theme-matrix">
  <div class="cyber-container">
    <header class="cyber-header">
      <h1 class="cyber-title">DAWID_MURIAS</h1>
      <p class="cyber-subtitle">CYBERSPACE_TERMINAL_v4.2.1</p>
      
      <div class="theme-switcher">
        <button data-theme="cyberpunk" aria-label="Cyberpunk theme">CYBERPUNK</button>
        <button data-theme="matrix" aria-label="Matrix theme">MATRIX</button>
        <button data-theme="solarized" aria-label="Solarized theme">SOLARIZED</button>
        <button data-theme="ghost-in-the-shell" aria-label="Ghost in the Shell theme">GHOST IN SHELL</button>
        <button data-theme="evangelion" aria-label="Evangelion theme">EVANGELION</button>
        <button data-theme="akira" aria-label="Akira theme">AKIRA</button>
        <button data-theme="cowboy-bebop" aria-label="Cowboy Bebop theme">COWBOY BEBOP</button>
        <button data-theme="psycho-pass" aria-label="Psycho-Pass theme">PSYCHO-PASS</button>
      </div>
    </header>

    <main class="cyber-main">
      <div class="terminal" id="terminalOutput" aria-live="polite">
        > SYSTEM INITIALIZED<br>
        > WELCOME TO MY DIGITAL SPACE<br>
        > TYPE COMMAND BELOW
      </div>

      <div class="input-group">
        <input type="text" id="repoPath" placeholder="ENTER_QUERY_PATH::" class="cyber-input" aria-label="Command input">
        <div class="button-group">
          <button id="apiBtn" class="cyber-button">EXECUTE_QUERY</button>
          <button id="playMusicBtn" class="cyber-button">TOGGLE_AMBIENT</button>
        </div>
      </div>

      <div id="projectsContainer" class="terminal" style="display:none;" aria-live="polite">
        <!-- Projekty będą ładowane dynamicznie -->
      </div>
    </main>

    <footer class="cyber-footer">
      <p>CONNECT:</p>
      <div class="footer-links">
        <a href="mailto:dawidmurias907@gmail.com" class="cyber-link">EMAIL</a>
        <a href="https://github.com/Darin0v0" class="cyber-link" target="_blank" rel="noopener noreferrer">GITHUB</a>
      </div>
    </footer>
  </div>

  <!-- Audio -->
  <audio id="bgMusic" loop>
    <source src="https://www.myinstants.com/media/sounds/ghost-in-the-shell-innocence-cyberbrain-conversation.mp3" type="audio/mpeg">
    Twoja przeglądarka nie obsługuje elementu audio.
  </audio>

  <!-- Skrypt -->
  <script>
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
      let currentTheme = 'matrix';
      
      // Dummy data for projects (replace with actual API calls)
      const projects = [
        {
          name: "CYBER_TERMINAL",
          description: "A fully interactive cyberpunk-style terminal interface with theme customization and sound effects.",
          technologies: "HTML, CSS, JavaScript",
          url: "#"
        },
        {
          name: "NEURAL_NETWORK",
          description: "Machine learning implementation for pattern recognition and data analysis.",
          technologies: "Python, TensorFlow, Keras",
          url: "#"
        },
        {
          name: "QUANTUM_SIM",
          description: "Quantum computing simulation environment with visualizations.",
          technologies: "JavaScript, Qiskit, Three.js",
          url: "#"
        },
        {
          name: "AUGMENTED_REALITY",
          description: "AR application for interactive 3D model visualization.",
          technologies: "Unity, ARCore, C#",
          url: "#"
        }
      ];
      
      // Initialize terminal with typing effect
      typeWriter("> SYSTEM INITIALIZED\n> WELCOME TO MY DIGITAL SPACE\n> TYPE COMMAND BELOW", terminalOutput);
      
      // Theme switcher
      themeButtons.forEach(button => {
        button.addEventListener('click', function() {
          const theme = this.getAttribute('data-theme');
          changeTheme(theme);
        });
      });
      
      function changeTheme(theme) {
        body.className = `theme-${theme}`;
        currentTheme = theme;
        addToTerminal(`> THEME CHANGED TO ${theme.toUpperCase()}`);
      }
      
      // Music toggle
      playMusicBtn.addEventListener('click', function() {
        if (musicPlaying) {
          bgMusic.pause();
          addToTerminal("> AMBIENT SOUNDS DISABLED");
        } else {
          bgMusic.play().catch(e => console.log("Audio play failed:", e));
          addToTerminal("> AMBIENT SOUNDS ENABLED");
        }
        musicPlaying = !musicPlaying;
        this.textContent = musicPlaying ? "MUTE_AMBIENT" : "TOGGLE_AMBIENT";
      });
      
      // Execute command
      apiBtn.addEventListener('click', executeCommand);
      repoPath.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          executeCommand();
        }
      });
      
      function executeCommand() {
        const command = repoPath.value.trim().toLowerCase();
        repoPath.value = '';
        
        if (!command) {
          addToTerminal("> ERROR: NO COMMAND PROVIDED");
          return;
        }
        
        addToTerminal(`> EXECUTING: ${command.toUpperCase()}`);
        
        // Simulate processing
        setTimeout(() => {
          if (command === 'help' || command === '?') {
            showHelp();
          } else if (command === 'projects' || command === 'show projects') {
            showProjects();
          } else if (command === 'clear') {
            clearTerminal();
          } else if (command === 'about') {
            showAbout();
          } else if (command === 'contact') {
            showContact();
          } else if (command === 'theme') {
            showThemes();
          } else {
            addToTerminal(`> UNKNOWN COMMAND: ${command.toUpperCase()}\n> TYPE 'HELP' FOR AVAILABLE COMMANDS`);
          }
        }, 500);
      }
      
      function showHelp() {
        const helpText = [
          "> AVAILABLE COMMANDS:",
          "> HELP - SHOW THIS HELP MESSAGE",
          "> PROJECTS - DISPLAY MY PROJECTS",
          "> ABOUT - SHOW INFORMATION ABOUT ME",
          "> CONTACT - SHOW CONTACT OPTIONS",
          "> THEME - LIST AVAILABLE THEMES",
          "> CLEAR - CLEAR TERMINAL SCREEN"
        ].join('\n');
        
        addToTerminal(helpText);
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
        
        addToTerminal("> PROJECTS LOADED. SCROLL TO VIEW.");
      }
      
      function showAbout() {
        const aboutText = [
          "> DAWID MURIAS",
          "> FULL-STACK DEVELOPER & CYBERPUNK ENTHUSIAST",
          "> SPECIALIZING IN:",
          "> - WEB DEVELOPMENT",
          "> - MACHINE LEARNING",
          "> - CYBERSECURITY",
          "> - INTERACTIVE DESIGN",
          "> CURRENTLY WORKING ON QUANTUM COMPUTING APPLICATIONS"
        ].join('\n');
        
        addToTerminal(aboutText);
      }
      
      function showContact() {
        const contactText = [
          "> CONTACT OPTIONS:",
          "> EMAIL: dawidmurias907@gmail.com",
          "> GITHUB: github.com/Darin0v0",
          "> LINKEDIN: [YOUR LINKEDIN]",
          "> TWITTER: [YOUR TWITTER]"
        ].join('\n');
        
        addToTerminal(contactText);
      }
      
      function showThemes() {
        const themesText = [
          "> AVAILABLE THEMES:",
          "> CYBERPUNK - Neon pink/blue cyberpunk style",
          "> MATRIX - Green code matrix style",
          "> SOLARIZED - Solarized dark theme",
          "> GHOST IN SHELL - Red/blue Ghost in the Shell style",
          "> EVANGELION - Purple/red Evangelion style",
          "> AKIRA - Red/blue Akira style",
          "> COWBOY BEBOP - Orange/blue Cowboy Bebop style",
          "> PSYCHO-PASS - Red/blue Psycho-Pass style",
          "> CLICK THEME BUTTONS ABOVE TO CHANGE"
        ].join('\n');
        
        addToTerminal(themesText);
      }
      
      function clearTerminal() {
        terminalOutput.innerHTML = '';
        projectsContainer.style.display = 'none
