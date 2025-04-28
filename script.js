document.addEventListener('DOMContentLoaded', function() {
    // GitHub API dla twojego repozytorium
    const apiBtn = document.getElementById('apiBtn');
    const apiResult = document.getElementById('apiResult');
    const repoPath = document.getElementById('repoPath');
    
    apiBtn.addEventListener('click', async function() {
        const path = repoPath.value.trim() || 'projects'; // Domyślnie szuka w folderze 'projects'
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
                apiResult.innerHTML = `Znaleziono ${folders.length} folderów w ${path}:<br>`;
                folders.forEach(folder => {
                    apiResult.innerHTML += `- ${folder.name}<br>`;
                });
            }
        } catch (error) {
            apiResult.innerHTML = `Błąd: ${error.message}<br>
            Uwaga: Bez tokenu możesz mieć tylko 60 zapytań na godzinę.`;
            console.error(error);
        }
    });
});