// ========================================
// THEME TOGGLE
// ========================================
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Check for saved theme preference or system preference
function getPreferredTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        return savedTheme;
    }
    // Default to dark, but respect system preference if set to light
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

// Apply theme
function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

// Initialize theme
setTheme(getPreferredTheme());

// Toggle theme on click
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });
}

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
    }
});

// ========================================
// COPY COMMAND FUNCTIONALITY
// ========================================
const toast = document.getElementById('toast');

function showToast(message = 'Copié !') {
    if (toast) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 1500);
    }
}

function copyCmd(element) {
    const code = element.querySelector('code');
    if (code) {
        const text = code.textContent.trim();
        navigator.clipboard.writeText(text).then(() => {
            // Visual feedback
            element.classList.add('copied');
            const icon = element.querySelector('.cmd-copy-icon');
            if (icon) {
                icon.textContent = '✓';
            }
            
            // Show toast
            showToast();
            
            // Reset after delay
            setTimeout(() => {
                element.classList.remove('copied');
                if (icon) {
                    icon.textContent = '📋';
                }
            }, 1500);
        }).catch(err => {
            console.error('Failed to copy:', err);
        });
    }
}

// ========================================
// ACTIVE NAV LINK ON SCROLL (Guide pages)
// ========================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveNav() {
    if (sections.length === 0 || navLinks.length === 0) return;
    
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

if (sections.length > 0) {
    window.addEventListener('scroll', updateActiveNav);
}

// ========================================
// SMOOTH SCROLL FOR NAV LINKS
// ========================================
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const targetSection = document.querySelector(href);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

// ========================================
// SMOOTH SCROLL FOR ALL ANCHOR LINKS
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href && href.length > 1) {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

// ========================================
// CONTACT FORM (Index page) -> mailto
// ========================================
(function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = (document.getElementById('contactName')?.value || '').trim();
        const handle = (document.getElementById('contactHandle')?.value || '').trim();
        const title = (document.getElementById('contactTitle')?.value || '').trim();
        const message = (document.getElementById('contactMessage')?.value || '').trim();

        if (!name || !handle || !title || !message) {
            showToast('Remplis tous les champs 🙂');
            return;
        }

        const subject = `[Contact-Site-Guide] ${title}`;
        const body =
`Pseudo/Nom: ${name}\n` +
`Contact: ${handle}\n\n` +
`Message:\n${message}\n\n` +
`--\nEnvoyé depuis le site Guide/Codex UE5`;

        const mailto = `mailto:nizoz.studio@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailto;
    });
})();
