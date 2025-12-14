// Custom Cursor
const cursor = document.getElementById('cursor');
const cursorDot = document.getElementById('cursorDot');
const spotlight = document.getElementById('spotlight');

let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';

    spotlight.style.left = mouseX + 'px';
    spotlight.style.top = mouseY + 'px';
});

function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.1;
    cursorY += (mouseY - cursorY) * 0.1;

    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';

    requestAnimationFrame(animateCursor);
}
animateCursor();

// Scroll Progress
window.addEventListener('scroll', () => {
    const scrollProgress = document.getElementById('scrollProgress');
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = progress + '%';
});

// Network Canvas
const canvas = document.getElementById('networkCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: null, y: null, radius: 150 };

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(99, 102, 241, 0.5)';
        ctx.fill();
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        if (mouse.x) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < mouse.radius) {
                const angle = Math.atan2(dy, dx);
                this.x -= Math.cos(angle) * 2;
                this.y -= Math.sin(angle) * 2;
            }
        }
    }
}

function initParticles() {
    particles = [];
    const numParticles = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
    for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
    }
}
initParticles();

function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 120) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(99, 102, 241, ${0.2 - distance / 600})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

function animateNetwork() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    connectParticles();
    requestAnimationFrame(animateNetwork);
}
animateNetwork();

canvas.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

canvas.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
});

// Text Scramble Effect
class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }

    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise(resolve => this.resolve = resolve);
        this.queue = [];

        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }

        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }

    update() {
        let output = '';
        let complete = 0;

        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];

            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.chars[Math.floor(Math.random() * this.chars.length)];
                    this.queue[i].char = char;
                }
                output += `<span class="text-indigo-400">${char}</span>`;
            } else {
                output += from;
            }
        }

        this.el.innerHTML = output;

        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }
}

// Reveal on Scroll
function reveal() {
    const reveals = document.querySelectorAll('.reveal-section, .stagger-children');
    reveals.forEach(el => {
        const windowHeight = window.innerHeight;
        const elementTop = el.getBoundingClientRect().top;
        const elementVisible = 100;

        if (elementTop < windowHeight - elementVisible) {
            el.classList.add('active');
        }
    });
}

window.addEventListener('scroll', reveal);

// Form submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        alert('Thanks for reaching out! I\'ll get back to you soon. 🚀');
        this.reset();
    });
}

// Mobile menu
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const closeMenu = document.getElementById('closeMenu');

if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.remove('hidden');
    });

    closeMenu.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
}

// Hide custom cursor on mobile
if ('ontouchstart' in window) {
    cursor.style.display = 'none';
    cursorDot.style.display = 'none';
    document.body.style.cursor = 'auto';
    document.querySelectorAll('*').forEach(el => {
        el.style.cursor = 'auto';
    });
}

// ============================================
// INITIALIZE AFTER CONTENT IS LOADED
// ============================================
document.addEventListener('contentLoaded', function(e) {
    console.log('Content loaded event received, initializing dynamic features...');
    
    // Initialize hover effects for cursor
    initHoverEffects();
    
    // Initialize tilt cards
    initTiltCards();
    
    // Initialize magnetic buttons
    initMagneticButtons();
    
    // Initialize text scramble
    initTextScramble();
    
    // Initialize iPhone carousel
    initCarousel();
    
    // Initialize counters
    initCounters();
    
    // Initialize mobile menu links
    initMobileLinks();
    
    // Run reveal once
    reveal();
});

function initHoverEffects() {
    document.querySelectorAll('.hover-target').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
}

function initTiltCards() {
    document.querySelectorAll('.tilt-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
}

function initMagneticButtons() {
    document.querySelectorAll('.magnetic-btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });
}

function initTextScramble() {
    const scrambleEl = document.querySelector('.scramble-text');
    if (scrambleEl) {
        const fx = new TextScramble(scrambleEl);
        const texts = ['Rohit Saini', 'iOS Engineer', 'AI Engineer', 'ComfyUI Expert'];
        let counter = 0;

        const next = () => {
            fx.setText(texts[counter]).then(() => {
                setTimeout(next, 3000);
            });
            counter = (counter + 1) % texts.length;
        };

        setTimeout(next, 2000);
    }
}


function initCarousel() {
    const carousel = document.getElementById('appCarousel');
    const dotsContainer = document.getElementById('carouselDots');

    if (!carousel || !dotsContainer) return;

    const dots = dotsContainer.querySelectorAll('.carousel-dot');
    const screenCount = window.carouselScreenCount || dots.length;
    const videos = carousel.querySelectorAll('.iphone-video');
    const playBtns = carousel.querySelectorAll('.video-play-btn');
    
    let currentSlide = 0;
    let carouselInterval;

    function pauseAllVideos() {
        videos.forEach((video, i) => {
            if (video && !video.error) {
                video.pause();
            }
            if (playBtns[i]) {
                playBtns[i].innerHTML = '<i class="fas fa-play"></i>';
            }
        });
    }

    function playCurrentVideo() {
        pauseAllVideos();
        const currentVideo = videos[currentSlide];
        const currentPlayBtn = playBtns[currentSlide];
        
        if (currentVideo && !currentVideo.error && currentVideo.readyState >= 2) {
            currentVideo.play().then(() => {
                if (currentPlayBtn) {
                    currentPlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
                }
            }).catch((err) => {
                console.log('Autoplay blocked or video error:', err.message);
            });
        }
    }

    function goToSlide(index) {
        currentSlide = index;
        carousel.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach((dot, i) => {
            dot.classList.toggle('bg-white', i === index);
            dot.classList.toggle('bg-white/30', i !== index);
        });
        
        // Handle video playback with delay for smooth transition
        setTimeout(() => {
            playCurrentVideo();
        }, 300);
    }

    // Add click handlers to dots
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            goToSlide(i);
            clearInterval(carouselInterval);
            startAutoRotate();
        });
    });

    // Handle play button clicks
    playBtns.forEach((btn, index) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const video = videos[index];
            if (video && !video.error) {
                if (video.paused) {
                    pauseAllVideos();
                    video.play().then(() => {
                        btn.innerHTML = '<i class="fas fa-pause"></i>';
                    }).catch(() => {});
                    // Pause auto-rotation when manually playing
                    clearInterval(carouselInterval);
                } else {
                    video.pause();
                    btn.innerHTML = '<i class="fas fa-play"></i>';
                    // Resume auto-rotation
                    startAutoRotate();
                }
            }
        });
    });

    // Swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0 && currentSlide < screenCount - 1) {
                // Swipe left - next slide
                goToSlide(currentSlide + 1);
            } else if (diff < 0 && currentSlide > 0) {
                // Swipe right - previous slide
                goToSlide(currentSlide - 1);
            }
            clearInterval(carouselInterval);
            startAutoRotate();
        }
    }

    function startAutoRotate() {
        carouselInterval = setInterval(() => {
            currentSlide = (currentSlide + 1) % screenCount;
            goToSlide(currentSlide);
        }, 6000); // 6 seconds per slide for videos
    }

    // Start auto-rotation and play first video
    startAutoRotate();
    
    // Wait a bit for videos to load before playing
    setTimeout(() => {
        playCurrentVideo();
    }, 1000);

    // Pause videos when not in viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                pauseAllVideos();
                clearInterval(carouselInterval);
            } else {
                playCurrentVideo();
                startAutoRotate();
            }
        });
    }, { threshold: 0.3 });

    const mockup = document.getElementById('iphoneMockup');
    if (mockup) {
        observer.observe(mockup);
    }

    console.log('Carousel initialized with', screenCount, 'screens');
}

function initCounters() {
    const counters = document.querySelectorAll('.counter');
    console.log('Found counters:', counters.length);
    
    counters.forEach(counter => {
        const target = parseInt(counter.dataset.target);
        if (isNaN(target)) {
            console.warn('Counter missing data-target:', counter);
            return;
        }
        
        let hasAnimated = false;

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !hasAnimated) {
                hasAnimated = true;
                animateCounter(counter, target);
                observer.disconnect();
            }
        }, { threshold: 0.5 });

        observer.observe(counter);
    });
}

function animateCounter(counter, target) {
    const duration = 2000; // 2 seconds
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(easeOutQuart * target);
        
        counter.textContent = current + '+';
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            counter.textContent = target + '+';
        }
    }
    
    requestAnimationFrame(update);
}

function initMobileLinks() {
    const mobileLinks = document.querySelectorAll('.mobile-link');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            const mobileMenu = document.getElementById('mobileMenu');
            if (mobileMenu) {
                mobileMenu.classList.add('hidden');
            }
        });
    });
}