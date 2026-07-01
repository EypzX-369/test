document.addEventListener("DOMContentLoaded", () => {
    
    // Enable video sound and autoplay
    const heroVideo = document.getElementById('heroVideo');
    if (heroVideo) {
        heroVideo.volume = 0.5;
        
        // Try to play with sound
        const playPromise = heroVideo.play();
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    heroVideo.muted = false;
                })
                .catch(() => {
                    // Autoplay failed, unmute on first user interaction
                    const unmuteOnInteraction = () => {
                        heroVideo.muted = false;
                        heroVideo.play();
                        document.removeEventListener('click', unmuteOnInteraction);
                        document.removeEventListener('touchstart', unmuteOnInteraction);
                    };
                    document.addEventListener('click', unmuteOnInteraction);
                    document.addEventListener('touchstart', unmuteOnInteraction);
                });
        }
    }
    
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

    // Progress bar and active nav link
    const progressBar = document.getElementById('pb');
    const portfolioSections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progressPercentage = (window.pageYOffset / scrollHeight) * 100;
        progressBar.style.width = `${progressPercentage}%`;

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
