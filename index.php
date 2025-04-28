<?php
// Funkcja do skanowania folderów z projektami
function get_projects() {
    $projects = [];
    $projects_dir = 'projekty';
    
    if (is_dir($projects_dir)) {
        $folders = array_diff(scandir($projects_dir), ['.', '..']);
        
        foreach ($folders as $folder) {
            $folder_path = $projects_dir . '/' . $folder;
            if (is_dir($folder_path)) {
                $projects[] = [
                    'name' => ucfirst(str_replace(['-', '_'], ' ', $folder)),
                    'path' => $folder_path,
                    'description' => file_exists("$folder_path/opis.txt") ? 
                                    file_get_contents("$folder_path/opis.txt") : 
                                    'Brak opisu',
                    'image' => file_exists("$folder_path/thumbnail.jpg") ? 
                              "$folder_path/thumbnail.jpg" : 
                              'assets/placeholder.jpg'
                ];
            }
        }
    }
    
    return $projects;
}

$projects = get_projects();

// Filtrowanie przez wyszukiwarkę
if (isset($_GET['search'])) {
    $search = strtolower($_GET['search']);
    $projects = array_filter($projects, function($project) use ($search) {
        return strpos(strtolower($project['name']), $search) !== false || 
               strpos(strtolower($project['description']), $search) !== false;
    });
}
?>
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Moje Projekty</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>Moje Projekty</h1>
        <form method="GET" class="search-container">
            <input type="text" name="search" placeholder="Wyszukaj projekt..." 
                   value="<?= isset($_GET['search']) ? htmlspecialchars($_GET['search']) : '' ?>">
            <button type="submit">Szukaj</button>
        </form>
    </header>
    
    <main>
        <div class="projects-grid">
            <?php foreach ($projects as $project): ?>
            <div class="project-card">
                <a href="<?= $project['path'] ?>">
                    <img src="<?= $project['image'] ?>" alt="<?= $project['name'] ?>" class="project-image">
                    <div class="project-info">
                        <h3 class="project-title"><?= $project['name'] ?></h3>
                        <p class="project-description"><?= $project['description'] ?></p>
                    </div>
                </a>
            </div>
            <?php endforeach; ?>
        </div>
    </main>
</body>
</html>