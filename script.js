document.addEventListener('DOMContentLoaded', function() {
    const apiBtn = document.getElementById('apiBtn');
    const apiResult = document.getElementById('apiResult');
    const repoPath = document.getElementById('repoPath');
    
    // Dodajemy efekt ładowania
    function setLoading(isLoading) {
        apiBtn.disabled = isLoading;
        apiBtn.innerHTML = isLoading 
            ? '<span class="spinner"></span> Wyszukiwanie...' 
            : 'Zlicz przez API';
    }
    
    // Funkcja do tworzenia przycisków
    function createProjectButton(folderName) {
        const container = document.createElement('div');
        container.className = 'project-item';
        
        const button = document.createElement('button');
        button.textContent = `Otwórz ${folderName}`;
        button.className = 'openButton';
        
        // Dodajemy ikonę
        const icon = document.createElement('span');
        icon.className = 'button-icon';
        icon.innerHTML = '🔗';
        button.prepend(icon);
        
        // URL do projektu
        const indexUrl = `https://darin0v0.github.io/projects/${folderName}/index.html`;
        
        button.onclick = function() {
            window.open(indexUrl, '_blank');
        };
        
        container.appendChild(button);
        return container;
    }
    
    // Główna funkcja obsługująca kliknięcie
    apiBtn.addEventListener('click', async function() {
        const path = repoPath.value.trim() || 'projects';
        setLoading(true);
        apiResult.innerHTML = '<div class="loading">Ładowanie projektów...</div>';
        
        try {
            const response = await fetch(`https://api.github.com/repos/Darin0v0/Site/contents/${path}`);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                let errorMessage = `Nie można odczytać zawartości folderu ${path}. Status: ${response.status}`;
                
                if (errorData?.message) {
                    errorMessage += `<br>GitHub: ${errorData.message}`;
                }
                
                throw new Error(errorMessage);
            }
            
            const contents = await response.json();
            const folders = contents.filter(item => item.type === 'dir');
            
            apiResult.innerHTML = '';
            
            if (folders.length === 0) {
                apiResult.innerHTML = `<div class="no-projects">Nie znaleziono folderów w ${path}</div>`;
            } else {
                const title = document.createElement('h3');
                title.textContent = `Znaleziono ${folders.length} projektów:`;
                apiResult.appendChild(title);
                
                const projectsContainer = document.createElement('div');
                projectsContainer.className = 'projects-grid';
                
                folders.forEach(folder => {
                    projectsContainer.appendChild(createProjectButton(folder.name));
                });
                
                apiResult.appendChild(projectsContainer);
            }
        } catch (error) {
            apiResult.innerHTML = `
                <div class="error">
                    <strong>Błąd:</strong> ${error.message}<br><br>
                    <small>Uwaga: Bez tokenu autoryzacyjnego możesz mieć tylko 60 zapytań na godzinę do GitHub API.</small>
                </div>
            `;
            console.error('Błąd pobierania danych:', error);
        } finally {
            setLoading(false);
        }
    });
    
    // Obsługa klawisza Enter w polu input
    repoPath.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            apiBtn.click();
        }
    });
});
