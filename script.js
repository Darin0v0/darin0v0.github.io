document.addEventListener('DOMContentLoaded', function() {
    const apiBtn = document.getElementById('apiBtn');
    const apiResult = document.getElementById('apiResult');
    const repoPath = document.getElementById('repoPath');
    
    apiBtn.addEventListener('click', async function() {
        const path = repoPath.value.trim() || 'projects'; // Domyślna ścieżka
        apiResult.innerHTML = "Ładowanie...";
        
        try {
            const response = await fetch(`https://api.github.com/repos/Darin0v0/Site/contents/${path}`);
            
            if (!response.ok) {
                throw new Error(`Nie można odczytać zawartości folderu ${path}. Status: ${response.status}`);
            }
            
            const contents = await response.json();
            const folders = contents.filter(item => item.type === 'dir');
            
            if (folders.length === 0) {
                apiResult.innerHTML = `Nie znaleziono folderów w ${path}`;
            } else {
                apiResult.innerHTML = `Znaleziono ${folders.length} folderów w ${path}:<br><br>`;
                folders.forEach(folder => {
                    const folderName = folder.name;
                    const indexUrl = `https://darino0v0.github.io/Site/${path}/${folderName}/index.html`;

                    const button = document.createElement('button');
                    button.textContent = `Otwórz ${folderName}`;
                    button.className = 'openButton'; // Dodaję klasę CSS!
                    button.onclick = function() {
                        window.open(indexUrl, '_blank');
                    };

                    apiResult.appendChild(button);
                    apiResult.appendChild(document.createElement('br'));
                });
            }
        } catch (error) {
            apiResult.innerHTML = `Błąd: ${error.message}<br>
            Uwaga: Bez tokenu możesz mieć tylko 60 zapytań na godzinę.`;
            console.error(error);
        }
    });
});
