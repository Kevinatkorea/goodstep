/* ============================================
   Good Step Brand Website - JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initNavbar();
    initMobileMenu();
    initSmoothScroll();
    initScrollAnimations();
    initNavbarScroll();
});

/* ============================================
   Navigation
   ============================================ */

function initNavbar() {
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

function initNavbarScroll() {
    // Highlight active section in navigation
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');

    window.addEventListener('scroll', function() {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;

            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

/* ============================================
   Mobile Menu
   ============================================ */

function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    if (menuBtn && navMenu) {
        menuBtn.addEventListener('click', function() {
            menuBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                menuBtn.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!menuBtn.contains(e.target) && !navMenu.contains(e.target)) {
                menuBtn.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }
}

/* ============================================
   Smooth Scroll
   ============================================ */

function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            if (href === '#') return;

            e.preventDefault();

            const target = document.querySelector(href);
            if (target) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ============================================
   Scroll Animations
   ============================================ */

function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');

    // Initial check for elements in view
    checkFadeElements();

    // Check on scroll
    window.addEventListener('scroll', throttle(checkFadeElements, 100));

    function checkFadeElements() {
        fadeElements.forEach(element => {
            if (isInViewport(element, 0.2)) {
                element.classList.add('visible');
            }
        });
    }
}

/* ============================================
   Utility Functions
   ============================================ */

function isInViewport(element, threshold = 0) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const offset = windowHeight * threshold;

    return (
        rect.top <= windowHeight - offset &&
        rect.bottom >= offset
    );
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/* ============================================
   Optional: Parallax Effect for Hero
   ============================================ */

(function() {
    const hero = document.querySelector('.hero');
    const productFloat = document.querySelector('.product-float');

    if (hero && productFloat) {
        window.addEventListener('scroll', function() {
            const scrolled = window.scrollY;
            const heroHeight = hero.offsetHeight;

            if (scrolled < heroHeight) {
                const parallaxValue = scrolled * 0.3;
                productFloat.style.transform = `translateY(${parallaxValue}px) rotate(${-5 + scrolled * 0.02}deg)`;
            }
        });
    }
})();

/* ============================================
   Optional: Counter Animation
   ============================================ */

function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');

    counters.forEach(counter => {
        const target = counter.innerText;
        const hasNumber = /\d/.test(target);

        if (!hasNumber) return;

        // Extract number from text
        const numberMatch = target.match(/\d+/);
        if (!numberMatch) return;

        const targetNumber = parseInt(numberMatch[0]);
        const prefix = target.split(numberMatch[0])[0];
        const suffix = target.split(numberMatch[0])[1];

        let current = 0;
        const increment = targetNumber / 50;
        const duration = 1500;
        const stepTime = duration / 50;

        const timer = setInterval(() => {
            current += increment;
            if (current >= targetNumber) {
                current = targetNumber;
                clearInterval(timer);
            }
            counter.innerText = prefix + Math.floor(current) + suffix;
        }, stepTime);
    });
}

/* ============================================
   Optional: Intersection Observer for Advanced Animations
   ============================================ */

if ('IntersectionObserver' in window) {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Animate counters when stats section is visible
                if (entry.target.classList.contains('solution-stats')) {
                    animateCounters();
                }
            }
        });
    }, observerOptions);

    // Observe elements
    document.querySelectorAll('.fade-in, .solution-stats').forEach(el => {
        observer.observe(el);
    });
}

/* ============================================
   Purchase Button Click Tracking (Optional)
   ============================================ */

document.querySelectorAll('.btn-purchase, .nav-cta').forEach(btn => {
    btn.addEventListener('click', function(e) {
        // You can add analytics tracking here
        console.log('Purchase button clicked');

        // If it's a placeholder link, show alert
        const href = this.getAttribute('href');
        if (href === '#' || !href) {
            e.preventDefault();
            alert('쇼핑몰 링크가 곧 연결됩니다.');
        }
    });
});

/* ============================================
   Preloader (Optional - can be removed)
   ============================================ */

window.addEventListener('load', function() {
    document.body.classList.add('loaded');

    // Trigger initial animations
    setTimeout(() => {
        document.querySelectorAll('.hero .fade-in').forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('visible');
            }, index * 150);
        });
    }, 100);
});

console.log('Good Step Website Initialized');
