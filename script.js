document.addEventListener('DOMContentLoaded', function() {
    const apiBtn = document.getElementById('apiBtn');
    const terminalOutput = document.getElementById('terminalOutput');
    const repoPath = document.getElementById('repoPath');
    
    // Efekt ładowania w stylu cyberpunk
    function setLoading(isLoading) {
        apiBtn.disabled = isLoading;
        if (isLoading) {
            apiBtn.innerHTML = '<span class="spinner">⌛</span> EXECUTING_QUERY...';
            terminalOutput.innerHTML += '<br>> SCANNING_REPOSITORY...';
        } else {
            apiBtn.innerHTML = 'EXECUTE_QUERY';
        }
    }
    
    // Funkcja tworząca cyberpunkowe przyciski projektów
    function createProjectButton(folderName) {
        const container = document.createElement('div');
        container.className = 'cyber-project-item';
        
        const button = document.createElement('button');
        button.className = 'cyber-project-btn';
        
        // Ikona i tekst
        button.innerHTML = `
            <span class="cyber-icon">⎔</span>
            <span class="cyber-btn-text">ACCESS_${folderName.toUpperCase()}</span>
            <span class="cyber-btn-border"></span>
        `;
        
        // URL do projektu
        const indexUrl = `https://darin0v0.github.io/projects/${folderName}/index.html`;
        
        button.onclick = function() {
            terminalOutput.innerHTML += `<br>> OPENING_PROJECT: ${folderName}...`;
            window.open(indexUrl, '_blank');
        };
        
        // Efekt hover
        button.addEventListener('mouseenter', () => {
            terminalOutput.innerHTML += `<br>> PROJECT_HIGHLIGHTED: ${folderName}`;
        });
        
        container.appendChild(button);
        return container;
    }
    
    // Główna funkcja obsługująca kliknięcie
    apiBtn.addEventListener('click', async function() {
        const path = repoPath.value.trim() || 'projects';
        setLoading(true);
        
        try {
            terminalOutput.innerHTML += '<br>> INITIATING_GITHUB_API_REQUEST...';
            
            const response = await fetch(`https://api.github.com/repos/Darin0v0/Site/contents/${path}`);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                let errorMessage = `ERROR_ACCESSING_PATH: ${path} (STATUS: ${response.status})`;
                
                if (errorData?.message) {
                    errorMessage += `<br>> GITHUB_API: ${errorData.message}`;
                }
                
                throw new Error(errorMessage);
            }
            
            const contents = await response.json();
            const folders = contents.filter(item => item.type === 'dir');
            
            terminalOutput.innerHTML += '<br>> SCAN_COMPLETE. ANALYZING_RESULTS...';
            
            setTimeout(() => {
                if (folders.length === 0) {
                    terminalOutput.innerHTML += `<br><br>> NO_PROJECTS_FOUND_IN: ${path}`;
                } else {
                    terminalOutput.innerHTML += `<br><br>> PROJECTS_DETECTED: ${folders.length}`;
                    
                    const projectsContainer = document.createElement('div');
                    projectsContainer.className = 'cyber-projects-grid';
                    
                    folders.forEach(folder => {
                        projectsContainer.appendChild(createProjectButton(folder.name));
                        terminalOutput.innerHTML += `<br>> LOADED_PROJECT: ${folder.name}`;
                    });
                    
                    // Dodajemy kontener z projektami pod terminalem
                    const existingProjects = document.querySelector('.cyber-projects-grid');
                    if (existingProjects) {
                        existingProjects.replaceWith(projectsContainer);
                    } else {
                        apiResult.parentNode.insertBefore(projectsContainer, apiResult.nextSibling);
                    }
                }
                
                terminalOutput.innerHTML += '<br><br>> READY_FOR_NEXT_QUERY';
                terminalOutput.scrollTop = terminalOutput.scrollHeight;
            }, 800);
            
        } catch (error) {
            terminalOutput.innerHTML += `
                <br><br>> SYSTEM_ERROR:
                <br>> ${error.message.replace('\n', '<br>> ')}
                <br><br>> WARNING: UNAUTHENTICATED_REQUESTS_LIMITED_TO_60_PER_HOUR
            `;
            console.error('GitHub API error:', error);
        } finally {
            setLoading(false);
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
        }
    });
    
    // Obsługa klawisza Enter
    repoPath.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            apiBtn.click();
        }
    });
    
    // Dodajemy styl CSS dla przycisków projektów
    const style = document.createElement('style');
    style.textContent = `
        .cyber-projects-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 1rem;
            margin-top: 2rem;
            padding: 1rem;
            background: rgba(5, 5, 15, 0.7);
            border: 1px solid var(--neon-purple);
            box-shadow: var(--thin-glow);
        }
        
        .cyber-project-btn {
            position: relative;
            width: 100%;
            padding: 1rem;
            background: rgba(10, 10, 20, 0.8);
            border: none;
            color: var(--neon-blue);
            font-family: 'Share Tech Mono', monospace;
            text-align: left;
            cursor: pointer;
            overflow: hidden;
            transition: all 0.3s ease;
            z-index: 1;
        }
        
        .cyber-project-btn:hover {
            color: var(--neon-green);
            box-shadow: 0 0 10px var(--neon-blue);
        }
        
        .cyber-icon {
            margin-right: 0.5rem;
            font-size: 1.2rem;
        }
        
        .cyber-btn-text {
            position: relative;
        }
        
        .cyber-project-btn::before {
            content: "";
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(
                90deg,
                transparent,
                rgba(0, 225, 255, 0.1),
                transparent
            );
            transition: all 0.5s ease;
            z-index: -1;
        }
        
        .cyber-project-btn:hover::before {
            left: 100%;
        }
        
        .spinner {
            display: inline-block;
            animation: spin 1s linear infinite;
            margin-right: 0.5rem;
        }
        
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
});
