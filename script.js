const GITHUB_USER = 'Darin0v0';
const GITHUB_REPO = 'Darin0v0.github.io';
const PROJECTS_PATH = 'projects';

const consoleOutput = document.getElementById('consoleOutput');
const consoleInput = document.getElementById('consoleInput');
const runBtn = document.getElementById('runBtn');

let projects = [];

function addConsoleLine(text, type = 'output') {
  const line = document.createElement('div');
  line.className = 'console-line';
  line.innerHTML = `<span class="prompt">$</span> <span class="${type}">${text}</span>`;
  consoleOutput.appendChild(line);
  consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

function clearConsole() {
  consoleOutput.innerHTML = '';
}

function showHelp() {
  addConsoleLine('Dostępne komendy:');
  addConsoleLine('  help  - pokaż ten komunikat');
  addConsoleLine('  projects / ls - pokaż projekty');
  addConsoleLine('  clear - wyczyść terminal');
  addConsoleLine('  about - informacje o mnie');
  addConsoleLine('  [nazwa projektu] - otwórz projekt');
}

function showAbout() {
  addConsoleLine('Darin0v0 - Full Stack Developer');
  addConsoleLine('GitHub: github.com/Darin0v0');
  addConsoleLine('Email: dawidmurias907@gmail.com');
}

function showProjectsList() {
  if (projects.length === 0) {
    addConsoleLine('Ładowanie projektów...');
    return;
  }
  addConsoleLine(`Znaleziono ${projects.length} projektów:`);
  projects.forEach(p => {
    const line = document.createElement('div');
    line.className = 'console-line';
    line.innerHTML = `<span class="prompt">  →</span> <a href="https://${GITHUB_USER}.github.io/${PROJECTS_PATH}/${p.name}/" target="_blank" class="project-link">${p.name.replace(/-/g, ' ')}</a>`;
    consoleOutput.appendChild(line);
  });
  consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

async function fetchProjects() {
  try {
    const response = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${PROJECTS_PATH}`);
    if (!response.ok) throw new Error('Failed to fetch');
    const data = await response.json();
    projects = data.filter(item => item.type === 'dir');
  } catch (error) {
    addConsoleLine('Błąd pobierania projektów', 'error');
  }
}

function handleCommand(cmd) {
  const command = cmd.trim().toLowerCase();
  
  if (!command) return;
  
  addConsoleLine(cmd);
  
  const project = projects.find(p => p.name.toLowerCase() === command || p.name.toLowerCase().replace(/-/g, ' ') === command);
  
  if (project) {
    addConsoleLine(`Otwieranie projektu: ${project.name}...`);
    window.open(`https://${GITHUB_USER}.github.io/${PROJECTS_PATH}/${project.name}/`, '_blank');
    return;
  }
  
  switch (command) {
    case 'help':
      showHelp();
      break;
    case 'projects':
    case 'ls':
      showProjectsList();
      break;
    case 'clear':
      clearConsole();
      break;
    case 'about':
      showAbout();
      break;
    default:
      addConsoleLine(`Nieznana komenda: ${command}`, 'error');
      addConsoleLine('Wpisz "help" aby zobaczyć dostępne komendy.');
  }
}

consoleInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    handleCommand(consoleInput.value);
    consoleInput.value = '';
  }
});

runBtn.addEventListener('click', () => {
  handleCommand(consoleInput.value);
  consoleInput.value = '';
});

fetchProjects();