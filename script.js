document.addEventListener('DOMContentLoaded', function() {
  const terminalOutput = document.getElementById('terminalOutput');
  const apiBtn = document.getElementById('apiBtn');
  const playMusicBtn = document.getElementById('playMusicBtn');
  const repoPath = document.getElementById('repoPath');
  const bgMusic = document.getElementById('bgMusic');
  const projectsContainer = document.getElementById('projectsContainer');
  const themeButtons = document.querySelectorAll('.theme-switcher button');
  let isPlaying = false;

  // Ładowanie zapisanego motywu z localStorage
  const savedTheme = localStorage.getItem('theme') || 'cyberpunk';
  setTheme(savedTheme);

  // Obsługa przełączników motywów
  themeButtons.forEach(button => {
    button.addEventListener('click', function() {
      const theme = this.dataset.theme;
      setTheme(theme);
      localStorage.setItem('theme', theme);
      terminalOutput.innerHTML += `<br>> THEME_CHANGED: ${theme.toUpperCase()}`;
      terminalOutput.scrollTop = terminalOutput.scrollHeight;
    });
  });

  function setTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    themeButtons.forEach(btn => {
      btn.style.borderColor = btn.dataset.theme === theme ? 'var(--accent-1)' : 'var(--text-color)';
    });
  }

  // Efekt pisania w terminalu
  const messages = [
    "> SYSTEM_SCAN_COMPLETE",
    "> NO_MALWARE_DETECTED",
    "> CONNECTION_SECURE"
  ];

  let i = 0;
  function typeWriter() {
    if (i < messages.length) {
      terminalOutput.innerHTML += `<br>${messages[i]}`;
      terminalOutput.scrollTop = terminalOutput.scrollHeight;
      i++;
      setTimeout(typeWriter, 1000);
    }
  }
  setTimeout(typeWriter, 1500);

  // Efekt glitch na przyciskach
  document.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('mouseover', () => {
      btn.style.textShadow = `0 0 5px ${Math.random() > 0.5 ? 'var(--accent-1)' : 'var(--accent-2)'}`;
    });
  });

  // Funkcje audio
  function togglePlay() {
    if (isPlaying) {
      bgMusic.pause();
      playMusicBtn.textContent = 'TOGGLE_AMBIENT';
      terminalOutput.innerHTML += '<br>> AUDIO_STREAM_TERMINATED';
    } else {
      bgMusic.play()
        .then(() => {
          playMusicBtn.textContent = 'STOP_AMBIENT';
          terminalOutput.innerHTML += '<br>> AMBIENT_AUDIO_ACTIVATED';
        })
        .catch(error => {
          console.error("Audio playback error:", error);
          terminalOutput.innerHTML += '<br>> AUDIO_ERROR: USER_INTERACTION_REQUIRED';
        });
    }
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
    isPlaying = !isPlaying;
  }

  playMusicBtn.addEventListener('click', togglePlay);

  // Funkcje API GitHub
  function escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function createProjectButton(folderName) {
    const button = document.createElement('div');
    button.className = 'cyber-project-btn';
    button.textContent = folderName;
    
    const indexUrl = `https://darin0v0.github.io/projects/${folderName}/index.html`;
    
    button.onclick = function() {
      terminalOutput.innerHTML += `<br>> OPENING_PROJECT: ${escapeHtml(folderName)}...`;
      terminalOutput.scrollTop = terminalOutput.scrollHeight;
      window.open(indexUrl, '_blank');
    };
    
    return button;
  }

  apiBtn.addEventListener('click', async function() {
    const path = repoPath.value.trim() || 'projects';
    terminalOutput.innerHTML += `<br>> INITIATING_GITHUB_API_REQUEST: ${escapeHtml(path)}`;
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
    
    try {
      const response = await fetch(`https://api.github.com/repos/Darin0v0/Darin0v0.github.io/contents/${path}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        let errorMessage = `ERROR_ACCESSING_PATH: ${escapeHtml(path)}`;
        
        if (errorData?.message) {
          errorMessage += `<br>> GITHUB_API: ${escapeHtml(errorData.message)}`;
        }
        
        throw new Error(errorMessage);
      }
      
      const contents = await response.json();
      const folders = contents.filter(item => item.type === 'dir');
      
      terminalOutput.innerHTML += `<br>> SCAN_COMPLETE. PROJECTS_DETECTED: ${folders.length}`;
      terminalOutput.scrollTop = terminalOutput.scrollHeight;
      
      // Tworzenie kontenera projektów
      projectsContainer.style.display = 'block';
      projectsContainer.innerHTML = '<div class="cyber-projects-grid" id="projectsGrid"></div>';
      const projectsGrid = document.getElementById('projectsGrid');
      
      if (folders.length === 0) {
        projectsGrid.innerHTML = '<div>NO PROJECTS FOUND</div>';
      } else {
        folders.forEach(folder => {
          projectsGrid.appendChild(createProjectButton(folder.name));
        });
      }
      
      terminalOutput.innerHTML += '<br>> READY_FOR_NEXT_QUERY';
      terminalOutput.scrollTop = terminalOutput.scrollHeight;
      
    } catch (error) {
      terminalOutput.innerHTML += `
        <br><br>> SYSTEM_ERROR:
        <br>> ${escapeHtml(error.message).replace('\n', '<br>> ')}
        <br><br>> WARNING: UNAUTHENTICATED_REQUESTS_LIMITED
      `;
      console.error('GitHub API error:', error);
      terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }
  });
  
  repoPath.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      apiBtn.click();
    }
  });
});
