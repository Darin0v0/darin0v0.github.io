document.addEventListener('DOMContentLoaded', function() {
    // Zdjęcia z repozytorium
    const screenshots = [
        {
            src: '395892478-b6ca04c9-8c5b-405a-b4b1-e95050a88131.png',
            alt: 'Główne okno aplikacji System_Plik'
        },
        {
            src: '395892515-0c9fa253-9dba-474c-869e-be6086c1a94e.png',
            alt: 'Operacje na plikach w System_Plik'
        }
    ];

    // Dodanie zdjęć do galerii
    const gallery = document.getElementById('gallery');
    screenshots.forEach(screenshot => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        
        const img = document.createElement('img');
        img.src = screenshot.src;
        img.alt = screenshot.alt;
        img.loading = 'lazy';
        
        item.appendChild(img);
        gallery.appendChild(item);

        // Lightbox
        item.addEventListener('click', () => {
            const lightbox = document.getElementById('lightbox');
            const lightboxImg = document.getElementById('lightbox-img');
            
            lightboxImg.src = screenshot.src;
            lightboxImg.alt = screenshot.alt;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Dodanie sekcji wideo
    const videoSection = document.getElementById('video-section');
    videoSection.innerHTML = `
        <div class="video-container">
            <iframe width="560" height="315" src="https://www.youtube.com/embed/UbvYT8vDKG0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
    `;

    // Obsługa lightbox
    const lightbox = document.getElementById('lightbox');
    document.querySelector('.close-lightbox').addEventListener('click', () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // Zamknięcie lightbox klawiszem ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
});