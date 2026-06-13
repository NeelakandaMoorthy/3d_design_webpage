// ========================================
// CREATOR VAULT - PREMIUM JAVASCRIPT
// Interactive Features & Conversions
// ========================================

// ========== DOM ELEMENTS ==========
const navbar = document.getElementById('navbar');
const navMenu = document.getElementById('navMenu');
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelectorAll('.nav-link');
const faqItems = document.querySelectorAll('.faq-item');
const statNumbers = document.querySelectorAll('.stat-number');
const bannerTimer = document.getElementById('banner-timer');

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initFAQ();
    initCounterAnimation();
    initSmoothScroll();
    initObserver();
    startScarcityTimer();
    trackPageEvent('page_view');
});

// ========================================
// NAVIGATION - STICKY & HAMBURGER MENU
// ========================================
function initNavigation() {
    // Hamburger menu toggle
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scroll-active');
        } else {
            navbar.classList.remove('scroll-active');
        }
    });

    // Active link highlighting on scroll
    updateActiveNavLink();
    window.addEventListener('scroll', updateActiveNavLink);
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// ========================================
// FAQ ACCORDION
// ========================================
function initFAQ() {
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', function() {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            // Toggle current item
            item.classList.toggle('active');
            trackEvent('faq_click', {
                question: question.querySelector('span').textContent
            });
        });
    });
}

// ========================================
// COUNTER ANIMATION
// ========================================
function initCounterAnimation() {
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                const stat = entry.target;
                const target = parseInt(stat.getAttribute('data-target'));
                animateCounter(stat, target);
                stat.classList.add('counted');
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => counterObserver.observe(stat));
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString() + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString() + '+';
        }
    }, 30);
}

// ========================================
// SMOOTH SCROLL
// ========================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                const element = document.querySelector(href);
                const offsetTop = element.offsetTop - 100;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========================================
// AOS INITIALIZATION
// ========================================
function initObserver() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            offset: 100,
            once: true,
            disable: 'mobile'
        });
    }
}

// ========================================
// SCARCITY TIMER
// ========================================
function startScarcityTimer() {
    // Target time (24 hours from now)
    let targetTime = new Date().getTime() + (24 * 60 * 60 * 1000);
    
    // Store in localStorage to persist across page reloads
    if (localStorage.getItem('scarcityTarget')) {
        targetTime = parseInt(localStorage.getItem('scarcityTarget'));
    } else {
        localStorage.setItem('scarcityTarget', targetTime);
    }

    function updateTimer() {
        const now = new Date().getTime();
        const distance = targetTime - now;

        if (distance < 0) {
            // Timer expired, reset for next 24 hours
            targetTime = new Date().getTime() + (24 * 60 * 60 * 1000);
            localStorage.setItem('scarcityTarget', targetTime);
            updateTimer();
            return;
        }

        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        bannerTimer.textContent = 
            String(hours).padStart(2, '0') + ':' +
            String(minutes).padStart(2, '0') + ':' +
            String(seconds).padStart(2, '0');
    }

    updateTimer();
    setInterval(updateTimer, 1000);
}

// ========================================
// CONVERSION TRACKING
// ========================================
function trackPageEvent(eventName, eventData = {}) {
    const data = {
        event: eventName,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        ...eventData
    };
    
    // Log to console in development
    console.log('Event tracked:', data);
    
    // Send to analytics service (Google Analytics, Mixpanel, etc.)
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventData);
    }
}

function trackEvent(eventName, eventData = {}) {
    trackPageEvent(eventName, eventData);
}

// Track WhatsApp link clicks
document.querySelectorAll('a[href^="https://wa.me"]').forEach(link => {
    link.addEventListener('click', function() {
        const message = this.getAttribute('href');
        trackEvent('whatsapp_click', {
            message: message,
            section: this.closest('section')?.getAttribute('id') || 'unknown'
        });
    });
});

// ========================================
// BUTTON RIPPLE EFFECT
// ========================================
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// ========================================
// EXIT INTENT POPUP
// ========================================
function initExitIntentPopup() {
    let shown = false;
    
    document.addEventListener('mouseleave', function(e) {
        if (e.clientY <= 0 && !shown && window.scrollY > 500) {
            showExitPopup();
            shown = true;
        }
    });
}

function showExitPopup() {
    const popup = document.createElement('div');
    popup.className = 'exit-popup';
    popup.innerHTML = `
        <div class="exit-popup-content">
            <button class="exit-close">&times;</button>
            <h3>Wait! Don't miss out! 🔥</h3>
            <p>Get 67% off Creator Vault Bundle today. Offer expires in 24 hours!</p>
            <a href="https://wa.me/919876543210?text=I%20want%20to%20buy%20the%20Ultimate%20Bundle" class="btn btn-primary">
                <i class="fab fa-whatsapp"></i> Grab the Deal Now
            </a>
        </div>
    `;
    
    document.body.appendChild(popup);
    
    popup.querySelector('.exit-close').addEventListener('click', function() {
        popup.remove();
    });
    
    trackEvent('exit_intent_popup_shown');
}

// ========================================
// LAZY LOADING IMAGES
// ========================================
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ========================================
// KEYBOARD NAVIGATION
// ========================================
document.addEventListener('keydown', function(e) {
    // Close mobile menu on Escape
    if (e.key === 'Escape') {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
    
    // Tab navigation for accessibility
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-nav');
});

// ========================================
// PERFORMANCE OPTIMIZATION
// ========================================
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

// Debounced scroll handler
window.addEventListener('scroll', debounce(function() {
    updateActiveNavLink();
}, 100));

// ========================================
// FORM VALIDATION (if added in future)
// ========================================
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validateForm(formData) {
    const errors = [];
    
    if (!formData.name || formData.name.trim().length < 2) {
        errors.push('Name must be at least 2 characters');
    }
    
    if (!formData.email || !validateEmail(formData.email)) {
        errors.push('Please enter a valid email');
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

// ========================================
// LOCAL STORAGE UTILITIES
// ========================================
const Storage = {
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('Storage error:', e);
        }
    },
    get: (key) => {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : null;
        } catch (e) {
            console.error('Storage error:', e);
            return null;
        }
    },
    remove: (key) => {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.error('Storage error:', e);
        }
    }
};

// ========================================
// ANALYTICS HELPERS
// ========================================
function getSessionDuration() {
    const sessionStart = Storage.get('sessionStart') || Date.now();
    if (!Storage.get('sessionStart')) {
        Storage.set('sessionStart', sessionStart);
    }
    return Math.floor((Date.now() - sessionStart) / 1000);
}

function trackPageMetrics() {
    const metrics = {
        sessionDuration: getSessionDuration(),
        scrollDepth: Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100),
        viewport: {
            width: window.innerWidth,
            height: window.innerHeight
        }
    };
    return metrics;
}

// ========================================
// MOBILE TOUCH ENHANCEMENTS
// ========================================
function initTouchHandlers() {
    let touchStartX = 0;
    
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        
        // Swipe left to close menu
        if (touchStartX - touchEndX > 50 && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
}

// ========================================
// FEATURE DETECTION
// ========================================
const Features = {
    supportsLocalStorage: () => {
        try {
            const test = '__localStorage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch(e) {
            return false;
        }
    },
    supportsIntersectionObserver: () => {
        return 'IntersectionObserver' in window;
    }
};

// ========================================
// INITIALIZATION COMPLETE
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    initTouchHandlers();
    initExitIntentPopup();
    initLazyLoading();
    
    // Log page load performance
    if (window.performance && window.performance.timing) {
        window.addEventListener('load', function() {
            const perf = window.performance.timing;
            const pageLoadTime = perf.loadEventEnd - perf.navigationStart;
            console.log('Page load time:', pageLoadTime, 'ms');
            trackEvent('page_load_complete', {
                loadTime: pageLoadTime
            });
        });
    }
});

// ========================================
// GLOBAL ERROR HANDLER
// ========================================
window.addEventListener('error', function(e) {
    console.error('Error:', e.message);
    trackEvent('javascript_error', {
        message: e.message,
        source: e.filename,
        lineno: e.lineno
    });
});

// ========================================
// UNHANDLED PROMISE REJECTION HANDLER
// ========================================
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    trackEvent('unhandled_rejection', {
        reason: String(e.reason)
    });
});

// ========================================
// SERVICE WORKER REGISTRATION (Optional PWA)
// ========================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment to enable PWA functionality
        // navigator.serviceWorker.register('sw.js')
        //     .then(reg => console.log('Service Worker registered'))
        //     .catch(err => console.log('Service Worker registration failed'));
    });
}

// ========================================
// CUSTOM EVENTS
// ========================================
const CreatorVaultEvents = {
    TEMPLATE_VIEWED: 'cv:template_viewed',
    PROMPT_DOWNLOADED: 'cv:prompt_downloaded',
    BUNDLE_VIEWED: 'cv:bundle_viewed',
    WHATSAPP_CLICKED: 'cv:whatsapp_clicked',
    FAQ_EXPANDED: 'cv:faq_expanded'
};

// Dispatch custom event
function dispatchCVEvent(eventName, detail = {}) {
    const event = new CustomEvent(eventName, { detail });
    document.dispatchEvent(event);
}

// Listen to custom events
Object.values(CreatorVaultEvents).forEach(eventName => {
    document.addEventListener(eventName, function(e) {
        trackEvent(eventName.replace('cv:', ''), e.detail);
    });
});

// ========================================
// RESPONSIVE IMAGE SIZES
// ========================================
function updateResponsiveImages() {
    const images = document.querySelectorAll('img[data-responsive]');
    images.forEach(img => {
        if (window.innerWidth < 768) {
            img.src = img.dataset.mobileSrc || img.src;
        } else {
            img.src = img.dataset.desktopSrc || img.src;
        }
    });
}

window.addEventListener('resize', debounce(updateResponsiveImages, 250));

// ========================================
// PREFETCH LINKS
// ========================================
function initLinkPrefetch() {
    const links = document.querySelectorAll('a[href^="http"]');
    links.forEach(link => {
        const prefetch = document.createElement('link');
        prefetch.rel = 'prefetch';
        prefetch.href = link.href;
        document.head.appendChild(prefetch);
    });
}

// ========================================
// CONSOLE BRANDING
// ========================================
console.log(
    '%c🚀 Creator Vault - Premium News Templates & AI Prompts',
    'font-size: 18px; font-weight: bold; color: #E63946;'
);
console.log(
    '%cVisit: https://creatorvault.com | WhatsApp: +91 9876543210',
    'font-size: 12px; color: #25D366;'
);

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Copy to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        console.log('Copied to clipboard');
        trackEvent('copy_to_clipboard', { text: text.substring(0, 50) });
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}

// Share function
function share(title, text, url) {
    if (navigator.share) {
        navigator.share({
            title: title,
            text: text,
            url: url
        }).then(() => {
            trackEvent('shared', { title });
        }).catch(err => {
            console.log('Share failed:', err);
        });
    }
}

// Geolocation (if needed for location-based offers)
function getUserLocation() {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                trackEvent('user_location', { latitude, longitude });
            },
            error => {
                console.log('Geolocation error:', error);
            }
        );
    }
}

// ========================================
// FINALLY - CALL INIT
// ========================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Creator Vault fully loaded and ready!');
    });
} else {
    console.log('Creator Vault fully loaded and ready!');
}
