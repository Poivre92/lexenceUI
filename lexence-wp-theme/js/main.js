document.addEventListener('DOMContentLoaded', () => {
    // --- 0. Clerk Initialization ---
    const CLERK_PUBLISHABLE_KEY = "pk_test_Y2xlcmstbGV4ZW5jZS00NC5jbGVyay5hY2NvdW50cy5kZXYk"; // REMPLACEZ PAR VOTRE CLER_PUBLISHABLE_KEY

    const startClerk = async () => {
        const clerk = window.Clerk;
        try {
            await clerk.load({
                publishableKey: CLERK_PUBLISHABLE_KEY
            });

            const userButtonDiv = document.getElementById('clerk-user-button');
            const authButtonsDiv = document.getElementById('clerk-auth-buttons');
            const mobileAuthDiv = document.querySelector('.mobile-auth');

            if (clerk.user) {
                clerk.mountUserButton(userButtonDiv);
                if (authButtonsDiv) authButtonsDiv.style.display = 'none';
                if (mobileAuthDiv) mobileAuthDiv.innerHTML = '<div id="mobile-clerk-user"></div>';
                clerk.mountUserButton(document.getElementById('mobile-clerk-user'));
            } else {
                if (authButtonsDiv) authButtonsDiv.style.display = 'flex';
            }
        } catch (err) {
            console.error('Error starting Clerk: ', err);
        }
    };

    if (window.Clerk) {
        startClerk();
    }

    // --- 1. Header Logic ---
    const header = document.querySelector('.header');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileNavOverlay = document.getElementById('mobile-nav-overlay');

    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            mobileNavOverlay.classList.toggle('active');
            document.body.style.overflow = mobileNavOverlay.classList.contains('active') ? 'hidden' : 'unset';
        });
    }

    // --- 2. Theme Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
        });
    }

    // --- 3. Animations ---
    if (typeof gsap !== 'undefined') {
        const animatedTitles = document.querySelectorAll('.animated-title');
        animatedTitles.forEach(title => {
            const text = title.textContent;
            title.textContent = '';
            text.split('').forEach(char => {
                const span = document.createElement('span');
                span.textContent = char === ' ' ? '\u00A0' : char;
                span.style.display = 'inline-block';
                span.style.opacity = '0';
                title.appendChild(span);
            });

            gsap.to(title.querySelectorAll('span'), {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.02,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: title,
                    start: "top 85%"
                }
            });
        });

        const reveals = document.querySelectorAll('.reveal');
        reveals.forEach(el => {
            gsap.fromTo(el,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    scrollTrigger: {
                        trigger: el,
                        start: "top 90%"
                    }
                }
            );
        });
    }

    initDynamicBackground();
    initIdeasLogic();
    initFeaturesLogic();
    initTypewriter();
    initTestimonials();
});

function initTestimonials() {
    const track = document.getElementById('testimonials-track');
    const indicators = document.querySelectorAll('.carousel-indicators .indicator');
    if (!track || !indicators.length) return;

    let currentIndex = 0;
    const slides = track.children;
    const totalSlides = slides.length;

    function goToSlide(index) {
        currentIndex = index;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;

        indicators.forEach((ind, i) => {
            if (i === currentIndex) ind.classList.add('active');
            else ind.classList.remove('active');
        });
    }

    // Auto rotate
    setInterval(() => {
        goToSlide((currentIndex + 1) % totalSlides);
    }, 6000);

    // Click events
    indicators.forEach((ind, index) => {
        ind.addEventListener('click', () => {
            goToSlide(index);
        });
    });
}

function initTypewriter() {
    const el = document.getElementById('typewriter-hero');
    if (!el) return;

    const words = ["Enrichissez votre vocabulaire.", "Maîtrisez les nuances.", "Découvrez l'étymologie.", "Brillez en société."];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentWord = words[wordIndex];

        if (isDeleting) {
            el.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            el.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typeSpeed = 2000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500; // Pause before new word
        }

        setTimeout(type, typeSpeed);
    }

    type();
}

function initFeaturesLogic() {
    const list = document.getElementById('games-list');
    if (!list) return;

    const items = list.querySelectorAll('.game-item');
    const gifs = document.querySelectorAll('.game-gif');
    const badge = document.getElementById('interaction-badge');
    let currentIndex = 0;
    let autoPlay = true;

    const badges = ["❓", "🎯", "✍️", "🧩", "▦"];

    function activateIndex(index) {
        items.forEach(item => item.classList.remove('active'));
        gifs.forEach(gif => gif.classList.remove('active'));

        items[index].classList.add('active');
        if (gifs[index]) gifs[index].classList.add('active');
        if (badge) badge.textContent = badges[index] || "✨";
        currentIndex = index;
    }

    // Auto-rotation
    let interval = setInterval(() => {
        if (autoPlay) {
            activateIndex((currentIndex + 1) % items.length);
        }
    }, 5000);

    // Click interaction
    items.forEach((item, index) => {
        item.addEventListener('click', () => {
            autoPlay = false; // Stop auto-play on interaction
            clearInterval(interval);
            activateIndex(index);
        });
    });
}

function initIdeasLogic() {
    const form = document.getElementById('submit-idea-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('idea-title').value;
            const content = document.getElementById('idea-content').value;
            const messageDiv = document.getElementById('form-message');

            const formData = new FormData();
            formData.append('action', 'submit_idea');
            formData.append('title', title);
            formData.append('content', content);

            fetch(lexenceData.ajaxUrl, {
                method: 'POST',
                body: formData
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        messageDiv.textContent = data.data.message;
                        messageDiv.style.color = '#10B981';
                        form.reset();
                        // Optional: Refresh list or add item manually
                    } else {
                        messageDiv.textContent = data.data;
                        messageDiv.style.color = '#EF4444';
                    }
                });
        });
    }

    document.addEventListener('click', (e) => {
        if (e.target.closest('.vote-button')) {
            const btn = e.target.closest('.vote-button');
            const postId = btn.getAttribute('data-id');
            const countSpan = btn.querySelector('.count');

            const formData = new FormData();
            formData.append('action', 'vote_idea');
            formData.append('post_id', postId);

            fetch(lexenceData.ajaxUrl, {
                method: 'POST',
                body: formData
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        countSpan.textContent = data.data.new_votes;
                        btn.classList.add('voted');
                    }
                });
        }
    });
}

function initDynamicBackground() {
    const container = document.getElementById('dynamic-background');
    if (!container) return;

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const letterCount = 20;

    for (let i = 0; i < letterCount; i++) {
        const span = document.createElement('span');
        span.textContent = letters.charAt(Math.floor(Math.random() * letters.length));
        span.className = 'floating-letter';
        span.style.left = `${Math.random() * 100}%`;
        span.style.top = `${Math.random() * 100}%`;
        span.style.fontSize = `${Math.random() * 40 + 20}px`;
        span.style.opacity = Math.random() * 0.1 + 0.05;
        container.appendChild(span);

        gsap.to(span, {
            x: `random(-100, 100)`,
            y: `random(-100, 100)`,
            rotate: `random(-45, 45)`,
            duration: `random(10, 20)`,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }
}
