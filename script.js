/**
 * ====================================
 * WEDDINGVERSE - MAIN JAVASCRIPT FILE
 * Modern Wedding Invitation Website
 * ==================================== 
 */

// ==========================================
// INITIALIZATION & DOM READY
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initMobileMenu();
    initSmoothScroll();
    initFAQAccordion();
    initTestimonialSlider();
    initScrollReveal();
    initPricingAnimations();
    initTemplateCards();
    initWhatsAppButton();
    
    console.log('WeddingVerse initialized');
});

// ==========================================
// 1. MOBILE MENU TOGGLE
// ==========================================

function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!mobileMenuToggle) return;
    
    // Toggle menu on hamburger click
    mobileMenuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close menu when a nav link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navMenu.contains(event.target);
        const isClickOnToggle = mobileMenuToggle.contains(event.target);
        
        if (!isClickInsideNav && !isClickOnToggle) {
            mobileMenuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// ==========================================
// 2. SMOOTH SCROLL
// ==========================================

function initSmoothScroll() {
    // Handle smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just '#'
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==========================================
// 3. FAQ ACCORDION
// ==========================================

function initFAQAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            // Close all other items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Toggle current item
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });
    
    // Keyboard support for FAQ (Enter/Space to toggle)
    faqQuestions.forEach(question => {
        question.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

// ==========================================
// 4. TESTIMONIAL SLIDER
// ==========================================

function initTestimonialSlider() {
    const slider = document.getElementById('testimonialsSlider');
    const prevBtn = document.getElementById('prevTestimonial');
    const nextBtn = document.getElementById('nextTestimonial');
    const indicatorsContainer = document.getElementById('sliderIndicators');
    
    if (!slider) return;
    
    let currentIndex = 0;
    const testimonials = document.querySelectorAll('.testimonial-card');
    const totalTestimonials = testimonials.length;
    
    // Create indicators
    function createIndicators() {
        indicatorsContainer.innerHTML = '';
        for (let i = 0; i < totalTestimonials; i++) {
            const indicator = document.createElement('button');
            indicator.className = `indicator ${i === 0 ? 'active' : ''}`;
            indicator.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
            
            indicator.addEventListener('click', () => {
                currentIndex = i;
                updateSlider();
            });
            
            indicatorsContainer.appendChild(indicator);
        }
    }
    
    // Update slider display
    function updateSlider() {
        // Remove active class from all testimonials
        testimonials.forEach((card, index) => {
            card.classList.remove('active');
        });
        
        // Add active class to current testimonial
        testimonials[currentIndex].classList.add('active');
        
        // Update indicators
        document.querySelectorAll('.indicator').forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
    }
    
    // Next button
    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % totalTestimonials;
        updateSlider();
    });
    
    // Previous button
    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + totalTestimonials) % totalTestimonials;
        updateSlider();
    });
    
    // Auto rotate testimonials every 5 seconds
    let autoRotateInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % totalTestimonials;
        updateSlider();
    }, 5000);
    
    // Pause auto-rotate on user interaction
    const pauseAutoRotate = () => {
        clearInterval(autoRotateInterval);
        autoRotateInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % totalTestimonials;
            updateSlider();
        }, 5000);
    };
    
    nextBtn.addEventListener('click', pauseAutoRotate);
    prevBtn.addEventListener('click', pauseAutoRotate);
    document.querySelectorAll('.indicator').forEach(ind => {
        ind.addEventListener('click', pauseAutoRotate);
    });
    
    // Initialize
    createIndicators();
    updateSlider();
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevBtn.click();
        } else if (e.key === 'ArrowRight') {
            nextBtn.click();
        }
    });
}

// ==========================================
// 5. SCROLL REVEAL ANIMATIONS
// ==========================================

function initScrollReveal() {
    // Elements that should be revealed on scroll
    const revealElements = document.querySelectorAll(
        '.religion-card, .template-card, .pricing-card, .feature-card'
    );
    
    // Create intersection observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('scroll-reveal');
                entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    revealElements.forEach(element => {
        observer.observe(element);
    });
}

// ==========================================
// 6. PRICING ANIMATIONS
// ==========================================

function initPricingAnimations() {
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    pricingCards.forEach((card, index) => {
        // Add staggered animation delay
        card.style.animation = `fadeInUp 0.6s ease-out ${index * 0.1}s forwards`;
        card.style.opacity = '0';
        
        // Add hover effect
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            // Reset if not featured
            if (!this.classList.contains('pricing-featured')) {
                this.style.transform = 'translateY(0)';
            }
        });
    });
    
    // Animate prices on view
    const priceAnimationObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const amount = entry.target.querySelector('.amount');
                if (amount && !amount.dataset.animated) {
                    animatePrice(amount);
                    amount.dataset.animated = 'true';
                }
            }
        });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('.pricing-section').forEach(section => {
        priceAnimationObserver.observe(section);
    });
}

// Animate price counting up
function animatePrice(element) {
    const finalPrice = parseInt(element.textContent);
    let currentPrice = 0;
    const increment = Math.ceil(finalPrice / 30);
    
    const counter = setInterval(() => {
        currentPrice += increment;
        if (currentPrice >= finalPrice) {
            element.textContent = finalPrice;
            clearInterval(counter);
        } else {
            element.textContent = currentPrice;
        }
    }, 20);
}

// ==========================================
// 7. TEMPLATE CARD INTERACTIONS
// ==========================================

function initTemplateCards() {
    const templateCards = document.querySelectorAll('.template-card');
    
    templateCards.forEach(card => {
        // Add click event for future template preview/modal functionality
        card.addEventListener('click', function() {
            const category = this.dataset.category;
            const religion = this.dataset.religion;
            const name = this.querySelector('.template-name').textContent;
            
            // Log template selection (can be connected to backend)
            console.log(`Selected: ${name} (${religion} - ${category})`);
            
            // Optional: Add visual feedback
            this.style.borderColor = 'var(--secondary)';
            setTimeout(() => {
                this.style.borderColor = 'transparent';
            }, 200);
        });
        
        // Add keyboard support
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        
        card.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

// ==========================================
// 8. WHATSAPP BUTTON FUNCTIONALITY
// ==========================================

function initWhatsAppButton() {
    const whatsappButton = document.getElementById('whatsappButton');
    const viewTemplatesBtn = document.getElementById('viewTemplatesBtn');
    
    if (viewTemplatesBtn) {
        viewTemplatesBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Smooth scroll to templates section
            const templatesSection = document.getElementById('video-templates');
            if (templatesSection) {
                templatesSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // WhatsApp URL should be updated with actual WhatsApp number
    // Format: https://wa.me/919876543210 (replace with real number)
    if (whatsappButton) {
        whatsappButton.addEventListener('click', function() {
            // Optional: Track WhatsApp clicks
            console.log('WhatsApp button clicked');
        });
    }
}

// ==========================================
// 9. UTILITY FUNCTIONS
// ==========================================

/**
 * Get element position relative to viewport
 */
function getElementPosition(element) {
    return element.getBoundingClientRect();
}

/**
 * Check if element is in viewport
 */
function isInViewport(element) {
    const rect = getElementPosition(element);
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Debounce function for performance
 */
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

/**
 * Throttle function for performance
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ==========================================
// 10. PERFORMANCE OPTIMIZATIONS
// ==========================================

/**
 * Lazy load images (optional, for future image implementation)
 */
function lazyLoadImages() {
    if ('IntersectionObserver' in window) {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

/**
 * Preload critical resources
 */
function preloadResources() {
    // Preload fonts
    const fontLinks = document.querySelectorAll('link[rel="preload"]');
    // Already handled in HTML via <link rel="preconnect">
}

// ==========================================
// 11. ANALYTICS & TRACKING (Optional)
// ==========================================

/**
 * Track user interactions (customize with your analytics service)
 */
const analytics = {
    trackEvent: function(category, action, label) {
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                'event_category': category,
                'event_label': label
            });
        }
        console.log(`Event tracked: ${category} - ${action} - ${label}`);
    },
    
    trackButtonClick: function(buttonName) {
        this.trackEvent('engagement', 'button_click', buttonName);
    },
    
    trackCTA: function(ctaName) {
        this.trackEvent('conversion', 'cta_click', ctaName);
    }
};

// ==========================================
// 12. ERROR HANDLING & LOGGING
// ==========================================

/**
 * Custom error handler
 */
window.addEventListener('error', function(event) {
    console.error('Global error:', event.error);
    // Send to error tracking service (e.g., Sentry)
});

// ==========================================
// 13. RESPONSIVE BEHAVIOR
// ==========================================

/**
 * Handle responsive breakpoints
 */
const responsiveHandler = {
    isMobile: function() {
        return window.innerWidth <= 768;
    },
    
    isTablet: function() {
        return window.innerWidth > 768 && window.innerWidth <= 1024;
    },
    
    isDesktop: function() {
        return window.innerWidth > 1024;
    }
};

// Debounced resize handler
window.addEventListener('resize', debounce(function() {
    // Handle window resize if needed
    console.log('Window resized');
}, 250));

// ==========================================
// 14. FORM VALIDATION (For future use)
// ==========================================

/**
 * Validate form fields
 */
function validateForm(form) {
    const inputs = form.querySelectorAll('input, textarea');
    let isValid = true;
    
    inputs.forEach(input => {
        if (input.required && !input.value.trim()) {
            isValid = false;
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }
    });
    
    return isValid;
}

// ==========================================
// 15. LOCAL STORAGE UTILITIES
// ==========================================

/**
 * Storage utility for persisting user preferences
 */
const storage = {
    set: function(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Storage error:', e);
            return false;
        }
    },
    
    get: function(key) {
        try {
            return JSON.parse(localStorage.getItem(key));
        } catch (e) {
            console.error('Storage error:', e);
            return null;
        }
    },
    
    remove: function(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Storage error:', e);
            return false;
        }
    }
};

// ==========================================
// 16. DYNAMIC CONTENT LOADING
// ==========================================

/**
 * Load content dynamically (for future backend integration)
 */
async function loadTemplates(category, religion) {
    try {
        // This would connect to your backend API
        const response = await fetch(`/api/templates?category=${category}&religion=${religion}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading templates:', error);
        return null;
    }
}

// ==========================================
// 17. PAGE PERFORMANCE MONITORING
// ==========================================

/**
 * Monitor page performance
 */
if (window.performance && window.performance.timing) {
    window.addEventListener('load', function() {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log('Page load time:', pageLoadTime, 'ms');
    });
}

// ==========================================
// 18. EXPORT FOR EXTERNAL USE
// ==========================================

// Make utilities globally available if needed
window.WeddingVerse = {
    analytics: analytics,
    storage: storage,
    responsive: responsiveHandler,
    utils: {
        debounce: debounce,
        throttle: throttle,
        isInViewport: isInViewport,
        validateForm: validateForm
    }
};

// ==========================================
// 19. NOTIFICATION SYSTEM (Optional)
// ==========================================

/**
 * Simple notification system
 */
const notify = {
    show: function(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            border-radius: 0.5rem;
            z-index: 1000;
            animation: slideInRight 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideInRight 0.3s ease-out reverse';
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }
};

window.notify = notify;

console.log('WeddingVerse JavaScript initialized successfully');
