const navLinks = document.querySelectorAll('.nav-links a');
const accountLinks = document.querySelectorAll('.btn-acount a');
const elasticBackground = document.querySelector('.elastic-background');

// Combiner tous les liens pour la gestion globale
const allLinks = [...navLinks, ...accountLinks];

// Récupérer la page active depuis localStorage
const activePage = localStorage.getItem('activePage') || 'Boutique';

function positionElastic(element, isHover = false, immediate = false) {
    const linkRect = element.getBoundingClientRect();
    const navRect = document.querySelector('nav').getBoundingClientRect();

    // Calculer les dimensions et positions avec des limites
    const width = Math.min(linkRect.width + 30, navRect.width);
    let leftPosition = linkRect.left - navRect.left - 15;

    // S'assurer que l'élément élastique ne dépasse pas à droite
    if (leftPosition + width > navRect.width) {
        leftPosition = navRect.width - width;
    }

    // S'assurer que l'élément élastique ne dépasse pas à gauche
    leftPosition = Math.max(0, leftPosition);

    // Appliquer les positions calculées avec une transition plus douce
    elasticBackground.style.transition = immediate ? 'none' :
        isHover ? 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';

    elasticBackground.style.width = `${width}px`;
    elasticBackground.style.height = `${linkRect.height + 10}px`;
    elasticBackground.style.left = `${leftPosition}px`;
    elasticBackground.style.top = `${linkRect.top - navRect.top - 5}px`;
    elasticBackground.style.opacity = '1';

    // Animation d'élasticité plus douce
    if (isHover) {
        setTimeout(() => {
            const adjustedWidth = Math.min(linkRect.width + 20, navRect.width);
            elasticBackground.style.width = `${adjustedWidth}px`;
            elasticBackground.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        }, 200);
    }
}

// Initialiser la position sur la page active sans transition
allLinks.forEach(link => {
    if (link.textContent === activePage) {
        link.classList.add('active');
        positionElastic(link, false, true);
    }
});

let isHovering = false;
let hoverTimeout;

allLinks.forEach(link => {
    link.addEventListener('mouseenter', (e) => {
        isHovering = true;
        clearTimeout(hoverTimeout);
        positionElastic(e.target, true);
    });

    link.addEventListener('mouseleave', () => {
        isHovering = false;
        clearTimeout(hoverTimeout);
        hoverTimeout = setTimeout(() => {
            if (!isHovering) {
                const activeLink = document.querySelector('a.active') || navLinks[0];
                positionElastic(activeLink, false);
            }
        }, 150);
    });

    link.addEventListener('click', (e) => {
        allLinks.forEach(l => l.classList.remove('active'));
        e.target.classList.add('active');
        localStorage.setItem('activePage', e.target.textContent);
        positionElastic(e.target, false, true); // Positionner immédiatement sans transition
    });
});

// Si on quitte la navbar, revenir à l'élément actif avec une transition douce
document.querySelector('nav').addEventListener('mouseleave', () => {
    clearTimeout(hoverTimeout);
    hoverTimeout = setTimeout(() => {
        const activeLink = document.querySelector('a.active') || navLinks[0];
        positionElastic(activeLink, false);
    }, 150);
});