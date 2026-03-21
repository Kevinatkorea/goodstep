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
    initHeroSlider();
    initImageSliders();
    initReviewsSlider();
    initTargetSlider();
    initScrollSnapDots('.steps-container', '.step-card', '.steps-dots', 'steps-dot');
    initScrollSnapDots('.cop-comparison', '.cop-compare-item', '.cop-dots', 'cop-dot');
    initFAQ();
    initFloatingCTA();
    initPurchaseDate();
    initFooterYear();
    initScrollToTop();
    initLightbox();
});

/* ============================================
   Hero Slider (background + text synced)
   ============================================ */

function initHeroSlider() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const bgSlides = hero.querySelectorAll('.hero-slide');
    const textSlides = hero.querySelectorAll('.hero-text-slide');
    const dotsContainer = hero.querySelector('.hero-dots');
    const prevBtn = hero.querySelector('.hero-prev');
    const nextBtn = hero.querySelector('.hero-next');
    const progressBar = hero.querySelector('.hero-progress-bar');

    if (bgSlides.length <= 1) return;

    let currentIndex = 0;
    let autoSlideTimer;
    let progressTimer;
    const interval = 5000; // 5 seconds per slide
    const progressStep = 30; // update every 30ms

    // Create dots
    bgSlides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('hero-dot');
        if (index === 0) dot.classList.add('active');
        dot.setAttribute('aria-label', '슬라이드 ' + (index + 1));
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.hero-dot');

    function goToSlide(index) {
        // Remove active from current
        bgSlides[currentIndex].classList.remove('active');
        textSlides[currentIndex].classList.remove('active');
        if (dots[currentIndex]) dots[currentIndex].classList.remove('active');

        // Update index
        currentIndex = index;
        if (currentIndex >= bgSlides.length) currentIndex = 0;
        if (currentIndex < 0) currentIndex = bgSlides.length - 1;

        // Add active to new
        bgSlides[currentIndex].classList.add('active');
        textSlides[currentIndex].classList.add('active');
        if (dots[currentIndex]) dots[currentIndex].classList.add('active');

        // Reset progress
        resetProgress();
    }

    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    // Progress bar
    function resetProgress() {
        if (progressBar) {
            progressBar.style.transition = 'none';
            progressBar.style.width = '0%';
            // Force reflow
            progressBar.offsetHeight;
            progressBar.style.transition = 'width ' + interval + 'ms linear';
            progressBar.style.width = '100%';
        }
    }

    function startAutoSlide() {
        stopAutoSlide();
        autoSlideTimer = setInterval(nextSlide, interval);
        resetProgress();
    }

    function stopAutoSlide() {
        clearInterval(autoSlideTimer);
    }

    // Arrow navigation
    if (prevBtn) prevBtn.addEventListener('click', () => { goToSlide(currentIndex - 1); startAutoSlide(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { goToSlide(currentIndex + 1); startAutoSlide(); });

    // Pause on hover
    hero.addEventListener('mouseenter', stopAutoSlide);
    hero.addEventListener('mouseleave', startAutoSlide);

    // Touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    hero.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    hero.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                goToSlide(currentIndex + 1);
            } else {
                goToSlide(currentIndex - 1);
            }
            startAutoSlide();
        }
    }, { passive: true });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!isInViewport(hero, 0.3)) return;
        if (e.key === 'ArrowLeft') { goToSlide(currentIndex - 1); startAutoSlide(); }
        if (e.key === 'ArrowRight') { goToSlide(currentIndex + 1); startAutoSlide(); }
    });

    // Start
    startAutoSlide();

    // Mark hero as loaded for CTA animation
    setTimeout(() => hero.classList.add('loaded'), 100);
}

/* ============================================
   Image Sliders
   ============================================ */

function initImageSliders() {
    const sliders = document.querySelectorAll('.image-slider');

    sliders.forEach(slider => {
        const slides = slider.querySelectorAll('.slide');
        const dotsContainer = slider.querySelector('.slider-dots');
        const interval = parseInt(slider.dataset.interval) || 4000;
        let currentIndex = 0;
        let autoSlideTimer;

        if (slides.length <= 1) return;

        // tech-slider: PC에서는 슬라이더 비활성화 (세로 나열)
        if (slider.classList.contains('tech-slider') && window.innerWidth > 768) {
            slides.forEach(s => { s.classList.add('active'); s.style.opacity = '1'; });
            return;
        }

        // Create dots
        if (dotsContainer) {
            slides.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.classList.add('slider-dot');
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goToSlide(index));
                dotsContainer.appendChild(dot);
            });
        }

        const dots = dotsContainer ? dotsContainer.querySelectorAll('.slider-dot') : [];

        function goToSlide(index) {
            slides[currentIndex].classList.remove('active');
            if (dots[currentIndex]) dots[currentIndex].classList.remove('active');

            currentIndex = index;
            if (currentIndex >= slides.length) currentIndex = 0;
            if (currentIndex < 0) currentIndex = slides.length - 1;

            slides[currentIndex].classList.add('active');
            if (dots[currentIndex]) dots[currentIndex].classList.add('active');
        }

        function nextSlide() {
            goToSlide(currentIndex + 1);
        }

        function startAutoSlide() {
            autoSlideTimer = setInterval(nextSlide, interval);
        }

        function stopAutoSlide() {
            clearInterval(autoSlideTimer);
        }

        // Start auto slide
        startAutoSlide();

        // Pause on hover
        slider.addEventListener('mouseenter', stopAutoSlide);
        slider.addEventListener('mouseleave', startAutoSlide);

        // Initialize first slide
        slides[0].classList.add('active');
    });
}

/* ============================================
   Reviews Slider
   ============================================ */

function initReviewsSlider() {
    const wrapper = document.querySelector('.reviews-slider-wrapper');
    if (!wrapper) return;

    const track = wrapper.querySelector('.reviews-track');
    const cards = wrapper.querySelectorAll('.review-card');
    const prevBtn = wrapper.querySelector('.review-prev');
    const nextBtn = wrapper.querySelector('.review-next');
    const dotsContainer = document.querySelector('.review-dots');

    if (!track || cards.length === 0) return;

    let currentIndex = 0;
    const cardWidth = cards[0].offsetWidth + 24; // card width + gap
    const visibleCards = window.innerWidth > 992 ? 3 : window.innerWidth > 768 ? 2 : 1;
    const maxIndex = Math.max(0, cards.length - visibleCards);

    // Create dots
    function createDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        var vis = window.innerWidth > 992 ? 3 : window.innerWidth > 768 ? 2 : 1;
        var max = Math.max(0, cards.length - vis);
        for (var i = 0; i <= max; i++) {
            var dot = document.createElement('button');
            dot.className = 'review-dot' + (i === currentIndex ? ' active' : '');
            dot.setAttribute('aria-label', '후기 ' + (i + 1) + '번째 페이지');
            (function(idx) {
                dot.addEventListener('click', function() {
                    currentIndex = idx;
                    updateSlider();
                });
            })(i);
            dotsContainer.appendChild(dot);
        }
    }

    function updateDots() {
        if (!dotsContainer) return;
        var dots = dotsContainer.querySelectorAll('.review-dot');
        dots.forEach(function(dot, i) {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    function updateSlider() {
        var gap = 24;
        var w = cards[0].offsetWidth + gap;
        track.style.transform = `translateX(-${currentIndex * w}px)`;
        updateDots();
    }

    function goToNext() {
        var vis = window.innerWidth > 992 ? 3 : window.innerWidth > 768 ? 2 : 1;
        var max = Math.max(0, cards.length - vis);
        if (currentIndex < max) {
            currentIndex++;
        } else {
            currentIndex = 0;
        }
        updateSlider();
    }

    function goToPrev() {
        var vis = window.innerWidth > 992 ? 3 : window.innerWidth > 768 ? 2 : 1;
        var max = Math.max(0, cards.length - vis);
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = max;
        }
        updateSlider();
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', goToPrev);
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', goToNext);
    }

    // Auto slide every 5 seconds
    let autoSlide = setInterval(goToNext, 5000);

    // Pause on hover
    wrapper.addEventListener('mouseenter', () => clearInterval(autoSlide));
    wrapper.addEventListener('mouseleave', () => {
        autoSlide = setInterval(goToNext, 5000);
    });

    // Create initial dots
    createDots();

    // Update on resize
    window.addEventListener('resize', debounce(() => {
        const newVisibleCards = window.innerWidth > 992 ? 3 : window.innerWidth > 768 ? 2 : 1;
        const newMaxIndex = Math.max(0, cards.length - newVisibleCards);
        if (currentIndex > newMaxIndex) {
            currentIndex = newMaxIndex;
        }
        createDots();
        updateSlider();
    }, 250));
}

/* ============================================
   Target Recommendations Slider
   ============================================ */

function initTargetSlider() {
    const wrapper = document.querySelector('.target-slider-wrapper');
    if (!wrapper) return;

    const track = wrapper.querySelector('.target-grid');
    const cards = wrapper.querySelectorAll('.target-card');
    const prevBtn = wrapper.querySelector('.target-prev');
    const nextBtn = wrapper.querySelector('.target-next');
    const dotsContainer = document.querySelector('.target-dots');

    if (!track || cards.length === 0) return;

    let currentIndex = 0;

    // Create dots
    if (dotsContainer) {
        cards.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('target-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateSlider();
            });
            dotsContainer.appendChild(dot);
        });
    }

    const dots = dotsContainer ? dotsContainer.querySelectorAll('.target-dot') : [];

    function getVisibleCards() {
        if (window.innerWidth > 768) return cards.length;
        if (window.innerWidth > 576) return 2;
        return 1;
    }

    function getMaxIndex() {
        return Math.max(0, cards.length - getVisibleCards());
    }

    function updateDots() {
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    function updateSlider() {
        if (window.innerWidth > 768) {
            track.style.transform = '';
            return;
        }

        if (window.innerWidth <= 576) {
            // Mobile: scroll to card position
            var mobileCardW = cards[0].offsetWidth + 12;
            track.scrollTo({ left: currentIndex * mobileCardW, behavior: 'smooth' });
            updateDots();
            return;
        }

        // Tablet: JS transform
        var tabletCardW = cards[0].offsetWidth + 20;
        currentIndex = Math.min(currentIndex, getMaxIndex());
        track.style.transform = 'translateX(-' + (currentIndex * tabletCardW) + 'px)';
        updateDots();
    }

    // Reset scroll to first item after layout completes
    setTimeout(function() { track.scrollLeft = 0; }, 50);
    setTimeout(function() { track.scrollLeft = 0; }, 200);

    // Arrow buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            currentIndex = currentIndex > 0 ? currentIndex - 1 : getMaxIndex();
            updateSlider();
        });
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            currentIndex = currentIndex < getMaxIndex() ? currentIndex + 1 : 0;
            updateSlider();
        });
    }

    // Mobile: sync dots with scroll position
    track.addEventListener('scroll', debounce(function() {
        if (window.innerWidth > 576) return;
        var scrollLeft = track.scrollLeft;
        var cardWidth = cards[0].offsetWidth + 16;
        var newIndex = Math.round(scrollLeft / cardWidth);
        if (newIndex !== currentIndex && newIndex >= 0 && newIndex < cards.length) {
            currentIndex = newIndex;
            updateDots();
        }
    }, 50));

    // Resize handler
    window.addEventListener('resize', debounce(function() {
        currentIndex = Math.min(currentIndex, getMaxIndex());
        track.style.transform = '';
        updateSlider();
    }, 250));
}

/* ============================================
   Generic Scroll-Snap Dot Sync
   ============================================ */

function initScrollSnapDots(containerSel, itemSel, dotsSel, dotClass) {
    var container = document.querySelector(containerSel);
    var dotsContainer = document.querySelector(dotsSel);
    if (!container || !dotsContainer) return;

    var items = container.querySelectorAll(itemSel);
    if (items.length === 0) return;

    // Create dots
    items.forEach(function(_, index) {
        var dot = document.createElement('button');
        dot.classList.add(dotClass);
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', function() {
            var itemWidth = items[0].offsetWidth + 12;
            container.scrollTo({ left: index * itemWidth, behavior: 'smooth' });
        });
        dotsContainer.appendChild(dot);
    });

    var dots = dotsContainer.querySelectorAll('.' + dotClass);

    // Reset scroll on mobile
    function resetSlider() {
        if (window.innerWidth <= 768) {
            container.scrollLeft = 0;
        }
    }
    setTimeout(resetSlider, 50);
    setTimeout(resetSlider, 300);
    window.addEventListener('resize', debounce(resetSlider, 250));

    // Sync dots with scroll
    container.addEventListener('scroll', debounce(function() {
        var scrollLeft = container.scrollLeft;
        var itemWidth = items[0].offsetWidth + 12;
        var newIndex = Math.round(scrollLeft / itemWidth);
        newIndex = Math.max(0, Math.min(newIndex, items.length - 1));
        dots.forEach(function(dot, i) {
            dot.classList.toggle('active', i === newIndex);
        });
    }, 50));
}

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
    let scrollPosition = 0;

    function openMenu() {
        scrollPosition = window.scrollY;
        document.body.style.top = `-${scrollPosition}px`;
        menuBtn.classList.add('active');
        navMenu.classList.add('active');
        document.body.classList.add('menu-open');
    }

    function closeMenu() {
        menuBtn.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
        document.body.style.top = '';
        window.scrollTo(0, scrollPosition);
    }

    if (menuBtn && navMenu) {
        menuBtn.addEventListener('click', function() {
            if (navMenu.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                closeMenu();
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (navMenu.classList.contains('active') &&
                !menuBtn.contains(e.target) &&
                !navMenu.contains(e.target)) {
                closeMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                closeMenu();
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
   Optional: Parallax Effect for Hero (removed - using slider)
   ============================================ */

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
});

/* ============================================
   FAQ Accordion
   ============================================ */

function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-question');

    function updateIcon(item) {
        var icon = item.querySelector('.faq-toggle-icon');
        if (icon) icon.innerHTML = item.classList.contains('open') ? '&minus;' : '+';
    }

    faqItems.forEach(function(btn) {
        btn.addEventListener('click', function() {
            const item = this.parentElement;
            const isOpen = item.classList.contains('open');

            // Close all other items
            document.querySelectorAll('.faq-item.open').forEach(function(openItem) {
                if (openItem !== item) {
                    openItem.classList.remove('open');
                    openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                    updateIcon(openItem);
                }
            });

            // Toggle current item
            item.classList.toggle('open', !isOpen);
            this.setAttribute('aria-expanded', !isOpen);
            updateIcon(item);
        });
    });

    // Initialize icons for any pre-opened items
    document.querySelectorAll('.faq-item').forEach(updateIcon);
}

/* ============================================
   Floating CTA (mobile only)
   ============================================ */

function initFloatingCTA() {
    var floatingCta = document.querySelector('.floating-cta');
    if (!floatingCta) return;

    var purchaseSection = document.querySelector('#purchase');
    var heroSection = document.querySelector('#hero');

    window.addEventListener('scroll', throttle(function() {
        var scrollY = window.scrollY;
        var heroBottom = heroSection ? heroSection.offsetTop + heroSection.offsetHeight : 600;
        var purchaseTop = purchaseSection ? purchaseSection.offsetTop - window.innerHeight : Infinity;

        // Show after hero, hide when purchase section is visible
        if (scrollY > heroBottom && scrollY < purchaseTop) {
            floatingCta.classList.add('visible');
        } else {
            floatingCta.classList.remove('visible');
        }
    }, 100));
}

/* ============================================
   Purchase Dynamic Date
   ============================================ */

function initPurchaseDate() {
    var el = document.getElementById('purchase-date-text');
    if (!el) return;
    var today = new Date();
    var mm = today.getMonth() + 1;
    var dd = today.getDate();
    el.textContent = '지금 주문하면 ' + mm + '월 ' + dd + '일 보행교정 가이드 PDF 무료 증정';
}

/* ============================================
   Footer Year Auto-Update
   ============================================ */

function initFooterYear() {
    var footerBottom = document.querySelector('.footer-bottom p');
    if (footerBottom) {
        footerBottom.innerHTML = footerBottom.innerHTML.replace('2024', new Date().getFullYear());
    }
}

/* ============================================
   Scroll to Top Button
   ============================================ */

function initScrollToTop() {
    var btn = document.getElementById('scrollTopBtn');
    if (!btn) return;

    window.addEventListener('scroll', throttle(function() {
        if (window.scrollY > 300) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    }, 100));

    btn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ============================================
   Lightbox Modal
   ============================================ */

function initLightbox() {
    var overlay = document.getElementById('lightbox');
    var img = document.getElementById('lightbox-img');
    if (!overlay || !img) return;

    document.querySelectorAll('.trust-lightbox-trigger').forEach(function(trigger) {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            var targetImg = this.querySelector('img');
            if (targetImg) {
                img.src = targetImg.src;
                img.alt = targetImg.alt;
            }
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeLightbox() {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    overlay.addEventListener('click', function(e) {
        if (e.target === overlay || e.target.classList.contains('lightbox-close')) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            closeLightbox();
        }
    });
}

console.log('Good Step Website Initialized');
