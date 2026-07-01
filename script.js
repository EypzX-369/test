document.addEventListener("DOMContentLoaded", () => {
    
    const splashScreen = document.getElementById('splashScreen');
    const heroVideo = document.getElementById('heroVideo');
    
    // Handle splash screen click
    const removeSplashScreen = () => {
        splashScreen.classList.add('hidden');
        if (heroVideo) {
            heroVideo.volume = 0.5;
            heroVideo.play().catch(err => console.log('Video play failed:', err));
        }
    };
    
    splashScreen.addEventListener('click', removeSplashScreen);
    document.addEventListener('touchstart', removeSplashScreen, { once: true });
    
    // Video setup
    if (heroVideo) {
        heroVideo.volume = 0.5;
        // Don't auto-play, wait for splash screen click
    }
    
    // Scroll reveal / disappear animation for text and buttons in every section
    const revealSelector = [
        'section:not(#hero) h1',
        'section:not(#hero) h2',
        'section:not(#hero) h3',
        'section:not(#hero) h4',
        'section:not(#hero) p',
        'section:not(#hero) .btn',
        'section:not(#hero) li',
        'section:not(#hero) .social-item',
        'footer p'
    ].join(', ');

    const revealTargets = document.querySelectorAll(revealSelector);
    revealTargets.forEach(el => el.classList.add('reveal-fade'));

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
            } else {
                entry.target.classList.remove('reveal-visible');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -10% 0px'
    });

    revealTargets.forEach(el => revealObserver.observe(el));

    // Glow tracking for cards
    const trackGlowCards = document.querySelectorAll('.glass-card');
    
    trackGlowCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${mouseX}px`);
            card.style.setProperty('--mouse-y', `${mouseY}px`);
        });
    });

    // Mobile menu toggle
    const burger = document.getElementById('burgerMenu');
    const navLinks = document.querySelector('.nav-links');
    const individualLinks = document.querySelectorAll('.nav-links a');

    burger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        burger.classList.toggle('toggle');
    });

    individualLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            burger.classList.remove('toggle');
        });
    });

    // Progress bar, active nav link, and hero fade-out
    const progressBar = document.getElementById('pb');
    const portfolioSections = document.querySelectorAll('section');
    const heroSection = document.getElementById('hero');

    window.addEventListener('scroll', () => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progressPercentage = (window.pageYOffset / scrollHeight) * 100;
        progressBar.style.width = `${progressPercentage}%`;

        // Hide the fixed hero once the user has scrolled roughly past it
        if (heroSection) {
            if (window.pageYOffset > window.innerHeight * 0.85) {
                heroSection.classList.add('hero-hidden');
            } else {
                heroSection.classList.remove('hero-hidden');
            }
        }

        let currentActiveSectionId = "";
        portfolioSections.forEach(section => {
            const sectionTopPos = section.offsetTop - 120;
            if (window.pageYOffset >= sectionTopPos) {
                currentActiveSectionId = section.getAttribute('id');
            }
        });

        individualLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentActiveSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // Form submission
    const contactFormNode = document.getElementById('cf');
    const successBanner = document.getElementById('sb');
    const errorBanner = document.getElementById('eb');

    contactFormNode.addEventListener('submit', async (event) => {
        event.preventDefault();

        const dataPayload = new FormData(contactFormNode);

        try {
            const response = await fetch(contactFormNode.action, {
                method: contactFormNode.method,
                body: dataPayload,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                successBanner.style.display = "block";
                errorBanner.style.display = "none";
                contactFormNode.reset();
            } else {
                const parsedData = await response.json();
                throw new Error(parsedData.errors ? parsedData.errors.map(err => err.message).join(', ') : "Message delivery failed");
            }
        } catch (err) {
            errorBanner.textContent = `✗ ${err.message}`;
            errorBanner.style.display = "block";
            successBanner.style.display = "none";
        }
    });
});
