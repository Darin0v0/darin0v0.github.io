// AutoElite - Enhanced JavaScript with Theme Toggle
class AutoElite {
    constructor() {
        this.currentTheme = 'light';
        this.init();
    }

    init() {
        this.loadTheme();
        this.setupNavigation();
        this.setupAnimations();
        this.setupForms();
        this.setupPortfolio();
        this.setupThemeToggle();
        this.setupMobileScaling();
    }

    // Theme functionality
    loadTheme() {
        const savedTheme = localStorage.getItem('autoelite-theme') || 'light';
        this.setTheme(savedTheme);
    }

    setTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('autoelite-theme', theme);
        
        // Update theme button icon
        const themeBtn = document.querySelector('.theme-btn');
        if (themeBtn) {
            themeBtn.innerHTML = theme === 'dark' ? 
                '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        }
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    setupThemeToggle() {
        const themeBtn = document.querySelector('.theme-btn');
        if (themeBtn) {
            themeBtn.addEventListener('click', () => this.toggleTheme());
        }
    }

    // Mobile scaling
    setupMobileScaling() {
        // Prevent zoom on input focus for mobile
        if ('ontouchstart' in window) {
            document.addEventListener('touchstart', function() {}, {passive: true});
        }

        // Handle viewport scaling
        this.setViewportScale();
        window.addEventListener('resize', () => this.setViewportScale());
        window.addEventListener('orientationchange', () => this.setViewportScale());
    }

    setViewportScale() {
        const viewport = document.querySelector('meta[name="viewport"]');
        if (window.innerWidth <= 768) {
            viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes');
        } else {
            viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
        }
    }

    // Nawigacja - POPRAWIONE
    setupNavigation() {
        const navbar = document.getElementById('navbar');
        const mobileBtn = document.querySelector('.mobile-menu-btn');
        const navLinks = document.querySelector('.nav-links');

        // Scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Mobile menu - POPRAWIONE
        if (mobileBtn && navLinks) {
            mobileBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                navLinks.classList.toggle('active');
                mobileBtn.innerHTML = navLinks.classList.contains('active') ? 
                    '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
            });

            // Zamknij menu po kliknięciu gdziekolwiek
            document.addEventListener('click', (e) => {
                if (navLinks.classList.contains('active') && 
                    !e.target.closest('.nav-links') && 
                    !e.target.closest('.mobile-menu-btn')) {
                    navLinks.classList.remove('active');
                    mobileBtn.innerHTML = '<i class="fas fa-bars"></i>';
                }
            });

            // Zamknij menu po kliknięciu w link
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    navLinks.classList.remove('active');
                    mobileBtn.innerHTML = '<i class="fas fa-bars"></i>';
                });
            });
        }

        // Active link highlighting based on current page
        this.setActiveNavLink();
    }

    setActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkPage = link.getAttribute('href');
            
            // Remove active class from all links first
            link.classList.remove('active');
            
            // Add active class to current page link
            if (currentPage === linkPage || 
                (currentPage === '' && linkPage === 'index.html') ||
                (currentPage.includes('index') && linkPage === 'index.html')) {
                link.classList.add('active');
            }
        });
    }

    // Animacje
    setupAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Obserwuj elementy z animacjami
        document.querySelectorAll('.fade-in').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            observer.observe(el);
        });
    }

    // Formularze
    setupForms() {
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Prosta walidacja
                const requiredFields = contactForm.querySelectorAll('[required]');
                let isValid = true;

                requiredFields.forEach(field => {
                    if (!field.value.trim()) {
                        field.style.borderColor = 'var(--primary)';
                        isValid = false;
                    } else {
                        field.style.borderColor = '';
                    }
                });

                if (isValid) {
                    this.showNotification('Dziękujemy za zapytanie! Skontaktujemy się z Tobą w ciągu 24 godzin.', 'success');
                    contactForm.reset();
                } else {
                    this.showNotification('Proszę wypełnić wszystkie wymagane pola.', 'error');
                }
            });

            // Real-time validation
            contactForm.querySelectorAll('.form-control').forEach(input => {
                input.addEventListener('blur', () => {
                    if (input.hasAttribute('required') && !input.value.trim()) {
                        input.style.borderColor = 'var(--primary)';
                    } else {
                        input.style.borderColor = '';
                    }
                });
            });
        }
    }

    // Portfolio filters
    setupPortfolio() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const portfolioItems = document.querySelectorAll('.portfolio-item');

        if (filterButtons.length > 0 && portfolioItems.length > 0) {
            filterButtons.forEach(button => {
                button.addEventListener('click', () => {
                    // Update active state
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');

                    // Filter items
                    const filterValue = button.getAttribute('data-filter');

                    portfolioItems.forEach(item => {
                        if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                            item.style.display = 'block';
                            setTimeout(() => {
                                item.style.opacity = '1';
                                item.style.transform = 'translateY(0)';
                            }, 50);
                        } else {
                            item.style.opacity = '0';
                            item.style.transform = 'translateY(20px)';
                            setTimeout(() => item.style.display = 'none', 300);
                        }
                    });
                });
            });
        }
    }

    // Powiadomienia
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}-circle"></i>
                <span>${message}</span>
            </div>
        `;

        // Stylowanie powiadomienia
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: type === 'success' ? '#2ecc71' : '#e74c3c',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '12px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
            zIndex: '10000',
            transform: 'translateX(400px)',
            transition: 'transform 0.3s ease',
            maxWidth: '400px',
            wordWrap: 'break-word',
            fontSize: '14px'
        });

        document.body.appendChild(notification);

        // Animacja wejścia
        setTimeout(() => notification.style.transform = 'translateX(0)', 100);

        // Automatyczne ukrywanie
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);

        // Manual close
        notification.addEventListener('click', () => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
    }
}

// Inicjalizacja gdy DOM jest gotowy
document.addEventListener('DOMContentLoaded', () => {
    new AutoElite();
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Lazy loading dla obrazów
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }
                if (img.dataset.srcset) {
                    img.srcset = img.dataset.srcset;
                }
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.1
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Handle page load transitions
window.addEventListener('load', function() {
    document.body.style.opacity = '1';
    
    // Remove preloader if exists
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            if (preloader.parentNode) {
                preloader.parentNode.removeChild(preloader);
            }
        }, 500);
    }
});

// Prevent layout shifts and handle initial load
document.addEventListener('DOMContentLoaded', function() {
    // Add loading state
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
    
    // Handle images loading
    const images = document.querySelectorAll('img');
    let loadedImages = 0;
    const totalImages = images.length;
    
    if (totalImages === 0) {
        // If no images, show content immediately
        document.body.style.opacity = '1';
        return;
    }
    
    function imageLoaded() {
        loadedImages++;
        if (loadedImages === totalImages) {
            document.body.style.opacity = '1';
        }
    }
    
    images.forEach(img => {
        if (img.complete) {
            imageLoaded();
        } else {
            img.addEventListener('load', imageLoaded);
            img.addEventListener('error', imageLoaded); // Count errors as loaded too
        }
    });
    
    // Fallback - show content after max 3 seconds
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 3000);
});

// Handle responsive behavior
window.addEventListener('resize', function() {
    // Close mobile menu on resize to desktop
    const navLinks = document.querySelector('.nav-links');
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    
    if (window.innerWidth > 768 && navLinks && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        if (mobileBtn) {
            mobileBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
    }
});

// Add CSS for animations if not present
if (!document.querySelector('#autoelite-animations')) {
    const style = document.createElement('style');
    style.id = 'autoelite-animations';
    style.textContent = `
        .fade-in {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s ease, transform 0.8s ease;
        }
        
        .fade-in.visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
}