const navLinks = document.querySelectorAll('.nav-links a');
const accountLinks = document.querySelectorAll('.btn-acount a');
const elasticBackground = document.querySelector('.elastic-background');

// Combiner tous les liens pour la gestion globale
const allLinks = [...navLinks, ...accountLinks];

// Récupérer la page active depuis localStorage
const activePage = localStorage.getItem('activePage') || 'Boutique';

function positionElastic(element) {
    const linkRect = element.getBoundingClientRect();
    const navRect = document.querySelector('nav').getBoundingClientRect();

    elasticBackground.style.width = `${linkRect.width + 30}px`;
    elasticBackground.style.height = `${linkRect.height + 10}px`;
    elasticBackground.style.left = `${linkRect.left - navRect.left - 15}px`;
    elasticBackground.style.top = `${linkRect.top - navRect.top - 5}px`;
    elasticBackground.style.opacity = '1';

    setTimeout(() => {
        elasticBackground.style.width = `${linkRect.width + 20}px`;
    }, 150);
}

// Initialiser la position sur la page active
allLinks.forEach(link => {
    if (link.textContent === activePage) {
        link.classList.add('active');
        positionElastic(link);
    }
});

let isHovering = false;

allLinks.forEach(link => {
    link.addEventListener('mouseenter', (e) => {
        isHovering = true;
        positionElastic(e.target);
    });

    link.addEventListener('mouseleave', () => {
        isHovering = false;
        setTimeout(() => {
            if (!isHovering) {
                // Revenir à l'élément actif ou au premier élément de nav-links
                const activeLink = document.querySelector('a.active') || navLinks[0];
                positionElastic(activeLink);
            }
        }, 100);
    });

    link.addEventListener('click', (e) => {
        allLinks.forEach(l => l.classList.remove('active'));
        e.target.classList.add('active');
        localStorage.setItem('activePage', e.target.textContent);
    });
});

// Si on quitte la navbar, revenir à l'élément actif
document.querySelector('nav').addEventListener('mouseleave', () => {
    const activeLink = document.querySelector('a.active') || navLinks[0];
    positionElastic(activeLink);
});
