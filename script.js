/* Enhanced JavaScript for HomeIns About Page - Professional Version */
/* ================================================================= */

// Utility Functions
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Animation and Intersection Observer utilities
const createObserver = (callback, options = {}) => {
    const defaultOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    return new IntersectionObserver(callback, { ...defaultOptions, ...options });
};

// Loading Screen Handler
class LoadingScreen {
    constructor() {
        this.loadingScreen = $('#loading-screen');
        this.init();
    }

    init() {
        // Simulate loading time and hide loading screen
        window.addEventListener('load', () => {
            setTimeout(() => this.hide(), 1500);
        });
    }

    hide() {
        if (this.loadingScreen) {
            this.loadingScreen.classList.add('hidden');
            setTimeout(() => {
                this.loadingScreen.style.display = 'none';
            }, 500);
        }
    }
}

// Enhanced Header Controller
class HeaderController {
    constructor() {
        this.header = $('#main-header');
        this.navLinks = $$('.nav-link');
        this.mobileMenu = $('#mobile-menu');
        this.navLinksContainer = $('#nav-links');
        this.lastScrollY = 0;
        this.isMenuOpen = false;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.handleActiveSection();
    }

    bindEvents() {
        // Scroll effects
        window.addEventListener('scroll', this.throttle(this.handleScroll.bind(this), 10));
        
        // Mobile menu toggle
        if (this.mobileMenu) {
            this.mobileMenu.addEventListener('click', this.toggleMobileMenu.bind(this));
        }

        // Smooth scrolling for navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', this.handleNavClick.bind(this));
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && !this.header.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // Handle window resize
        window.addEventListener('resize', this.throttle(this.handleResize.bind(this), 100));
    }

    handleScroll() {
        const currentScrollY = window.pageYOffset;
        
        // Add scrolled class for header styling
        if (currentScrollY > 50) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }

        // Update active section
        this.updateActiveSection();
        
        this.lastScrollY = currentScrollY;
    }

    handleNavClick(e) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        const targetElement = $(targetId);
        
        if (targetElement) {
            const headerHeight = this.header.offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }

        // Close mobile menu if open
        if (this.isMenuOpen) {
            this.closeMobileMenu();
        }
    }

    toggleMobileMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        
        if (this.isMenuOpen) {
            this.openMobileMenu();
        } else {
            this.closeMobileMenu();
        }
    }

    openMobileMenu() {
        this.navLinksContainer.classList.add('active');
        this.mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeMobileMenu() {
        this.navLinksContainer.classList.remove('active');
        this.mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
        this.isMenuOpen = false;
    }

    updateActiveSection() {
        const sections = $$('section[id]');
        const scrollPosition = window.pageYOffset + this.header.offsetHeight + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = $(`.nav-link[href="#${sectionId}"]`);

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                this.navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) {
                    navLink.classList.add('active');
                }
            }
        });
    }

    handleActiveSection() {
        // Set initial active section based on current page
        const currentPath = window.location.pathname;
        if (currentPath.includes('about')) {
            this.navLinks.forEach(link => link.classList.remove('active'));
            const aboutLink = $('.nav-link[href="#about"]');
            if (aboutLink) aboutLink.classList.add('active');
        }
    }

    handleResize() {
        if (window.innerWidth > 768 && this.isMenuOpen) {
            this.closeMobileMenu();
        }
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
}

// Animated Counter for Hero Stats
class AnimatedCounter {
    constructor() {
        this.counters = $$('.stat-number');
        this.init();
    }

    init() {
        const observer = createObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });

        this.counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current).toLocaleString();
        }, 16);
    }
}

// Scroll Animations Controller
class ScrollAnimations {
    constructor() {
        this.animateElements = $$('.animate-on-scroll');
        this.init();
    }

    init() {
        const observer = createObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.delay || 0;
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, delay * 1000);
                    observer.unobserve(entry.target);
                }
            });
        });

        this.animateElements.forEach(element => observer.observe(element));
    }
}

// Cart Functionality
class CartController {
    constructor() {
        this.cartBtn = $('.cart-btn');
        this.cartCount = $('.cart-count');
        this.cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
        
        this.init();
    }

    init() {
        this.updateCartDisplay();
        
        if (this.cartBtn) {
            this.cartBtn.addEventListener('click', this.toggleCart.bind(this));
        }
    }

    updateCartDisplay() {
        if (this.cartCount) {
            const totalItems = this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
            this.cartCount.textContent = totalItems;
            this.cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    }

    toggleCart() {
        // Animate cart icon
        if (this.cartBtn) {
            this.cartBtn.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.cartBtn.style.transform = 'scale(1)';
            }, 150);
        }
        
        // Here you would typically open a cart modal or navigate to cart page
        console.log('Cart toggled - items:', this.cartItems.length);
    }

    addItem(item) {
        const existingItem = this.cartItems.find(cartItem => cartItem.id === item.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cartItems.push({ ...item, quantity: 1 });
        }
        
        this.saveCart();
        this.updateCartDisplay();
        this.showAddedToCartNotification();
    }

    saveCart() {
        localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    }

    showAddedToCartNotification() {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <span class="notification-icon">✓</span>
            <span>Added to cart!</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 2000);
    }
}

// Search Functionality
class SearchController {
    constructor() {
        this.searchBtn = $('.search-btn');
        this.searchModal = null;
        
        this.init();
    }

    init() {
        if (this.searchBtn) {
            this.searchBtn.addEventListener('click', this.toggleSearch.bind(this));
        }
    }

    toggleSearch() {
        if (!this.searchModal) {
            this.createSearchModal();
        }
        
        this.searchModal.classList.toggle('active');
        
        if (this.searchModal.classList.contains('active')) {
            setTimeout(() => {
                const searchInput = this.searchModal.querySelector('.search-input');
                if (searchInput) searchInput.focus();
            }, 300);
        }
    }

    createSearchModal() {
        this.searchModal = document.createElement('div');
        this.searchModal.className = 'search-modal';
        this.searchModal.innerHTML = `
            <div class="search-overlay"></div>
            <div class="search-container">
                <div class="search-header">
                    <h3>Search Products</h3>
                    <button class="search-close">×</button>
                </div>
                <div class="search-input-container">
                    <input type="text" class="search-input" placeholder="Search for furniture, decor, lighting...">
                    <button class="search-submit">Search</button>
                </div>
                <div class="search-suggestions">
                    <div class="suggestion-group">
                        <h4>Popular Categories</h4>
                        <div class="suggestions">
                            <span class="suggestion">Living Room</span>
                            <span class="suggestion">Bedroom</span>
                            <span class="suggestion">Kitchen</span>
                            <span class="suggestion">Lighting</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.searchModal);
        
        // Bind events
        const closeBtn = this.searchModal.querySelector('.search-close');
        const overlay = this.searchModal.querySelector('.search-overlay');
        const suggestions = this.searchModal.querySelectorAll('.suggestion');
        
        closeBtn.addEventListener('click', () => this.toggleSearch());
        overlay.addEventListener('click', () => this.toggleSearch());
        
        suggestions.forEach(suggestion => {
            suggestion.addEventListener('click', (e) => {
                const searchInput = this.searchModal.querySelector('.search-input');
                searchInput.value = e.target.textContent;
                this.performSearch(e.target.textContent);
            });
        });
    }

    performSearch(query) {
        console.log('Searching for:', query);
        // Here you would typically perform the actual search
        this.toggleSearch();
    }
}

// Scroll Controls
class ScrollController {
    constructor() {
        this.scrollToTopBtn = $('#scroll-to-top');
        this.backHomeBtn = $('#back-home');
        this.scrollIndicator = $('.scroll-indicator');
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.handleScroll();
    }

    bindEvents() {
        window.addEventListener('scroll', this.throttle(this.handleScroll.bind(this), 100));
        
        if (this.scrollToTopBtn) {
            this.scrollToTopBtn.addEventListener('click', this.scrollToTop.bind(this));
        }
        
        if (this.backHomeBtn) {
            this.backHomeBtn.addEventListener('click', this.scrollToTop.bind(this));
        }
        
        if (this.scrollIndicator) {
            this.scrollIndicator.addEventListener('click', this.scrollToNext.bind(this));
        }
    }

    handleScroll() {
        const scrollY = window.pageYOffset;
        
        // Show/hide scroll to top button
        if (this.scrollToTopBtn) {
            if (scrollY > 500) {
                this.scrollToTopBtn.classList.add('visible');
            } else {
                this.scrollToTopBtn.classList.remove('visible');
            }
        }
        
        // Show/hide back home button
        if (this.backHomeBtn) {
            if (scrollY > 200) {
                this.backHomeBtn.classList.add('visible');
            } else {
                this.backHomeBtn.classList.remove('visible');
            }
        }
        
        // Hide scroll indicator after scrolling
        if (this.scrollIndicator && scrollY > 100) {
            this.scrollIndicator.style.opacity = '0';
        }
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    scrollToNext() {
        const nextSection = $('#story');
        if (nextSection) {
            const headerHeight = $('#main-header').offsetHeight;
            const targetPosition = nextSection.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
}

// Interactive Cards Enhancement
class CardInteractions {
    constructor() {
        this.valueCards = $$('.value-card');
        this.teamMembers = $$('.team-member');
        
        this.init();
    }

    init() {
        this.enhanceValueCards();
        this.enhanceTeamCards();
    }

    enhanceValueCards() {
        this.valueCards.forEach(card => {
            card.addEventListener('mouseenter', this.handleCardHover.bind(this));
            card.addEventListener('mouseleave', this.handleCardLeave.bind(this));
            card.addEventListener('click', this.handleCardClick.bind(this));
        });
    }

    enhanceTeamCards() {
        this.teamMembers.forEach(member => {
            member.addEventListener('mouseenter', this.handleTeamHover.bind(this));
            member.addEventListener('mouseleave', this.handleTeamLeave.bind(this));
        });
    }

    handleCardHover(e) {
        const card = e.currentTarget;
        const glow = card.querySelector('.card-glow');
        
        if (glow) {
            glow.style.opacity = '1';
        }
        
        card.style.transform = 'translateY(-10px) scale(1.02)';
    }

    handleCardLeave(e) {
        const card = e.currentTarget;
        const glow = card.querySelector('.card-glow');
        
        if (glow) {
            glow.style.opacity = '0.5';
        }
        
        card.style.transform = 'translateY(0) scale(1)';
    }

    handleCardClick(e) {
        const card = e.currentTarget;
        const title = card.querySelector('h3').textContent;
        
        // Add ripple effect
        this.createRipple(e, card);
        
        console.log(`Value card clicked: ${title}`);
        // Here you could open a modal with more details
    }

    handleTeamHover(e) {
        const member = e.currentTarget;
        const avatar = member.querySelector('.member-avatar');
        
        if (avatar) {
            avatar.style.transform = 'scale(1.1) rotate(5deg)';
        }
    }

    handleTeamLeave(e) {
        const member = e.currentTarget;
        const avatar = member.querySelector('.member-avatar');
        
        if (avatar) {
            avatar.style.transform = 'scale(1) rotate(0deg)';
        }
    }

    createRipple(e, element) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple-effect';
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        element.appendChild(ripple);
        
        setTimeout(() => {
            element.removeChild(ripple);
        }, 600);
    }
}

// Newsletter Subscription
class NewsletterController {
    constructor() {
        this.form = $('.newsletter-form');
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', this.handleSubmit.bind(this));
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const email = this.form.querySelector('input[type="email"]').value;
        const submitBtn = this.form.querySelector('button[type="submit"]');
        
        // Validate email
        if (!this.isValidEmail(email)) {
            this.showMessage('Please enter a valid email address', 'error');
            return;
        }
        
        // Show loading state
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Subscribing...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            this.showMessage('Thank you for subscribing!', 'success');
            this.form.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showMessage(message, type) {
        const messageElement = document.createElement('div');
        messageElement.className = `newsletter-message ${type}`;
        messageElement.textContent = message;
        
        this.form.appendChild(messageElement);
        
        setTimeout(() => {
            messageElement.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            messageElement.classList.remove('show');
            setTimeout(() => {
                if (this.form.contains(messageElement)) {
                    this.form.removeChild(messageElement);
                }
            }, 300);
        }, 3000);
    }
}

// Performance Monitoring
class PerformanceMonitor {
    constructor() {
        this.init();
    }

    init() {
        // Monitor page load performance
        window.addEventListener('load', () => {
            if ('performance' in window) {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
            }
        });

        // Monitor scroll performance
        let scrollStart = null;
        window.addEventListener('scroll', () => {
            if (!scrollStart) {
                scrollStart = performance.now();
                requestAnimationFrame(() => {
                    const scrollEnd = performance.now();
                    if (scrollEnd - scrollStart > 16) {
                        console.warn('Scroll performance issue detected:', scrollEnd - scrollStart, 'ms');
                    }
                    scrollStart = null;
                });
            }
        });
    }
}

// Footer Controller
class FooterController {
    constructor() {
        this.newsletterForm = $('.newsletter-form');
        this.socialLinks = $$('.social-link');
        this.footerLinks = $$('.footer-section a');
        this.footer = $('.footer');
        this.init();
    }

    init() {
        this.bindEvents();
        this.animateFooterLinks();
        this.initializeParallax();
        this.setupSocialShare();
    }

    bindEvents() {
        // Handle newsletter form submission
        if (this.newsletterForm) {
            this.newsletterForm.addEventListener('submit', this.handleNewsletterSubmit.bind(this));
            this.addInputAnimation();
        }

        // Enhanced social links interaction
        this.socialLinks.forEach(link => {
            link.addEventListener('mouseenter', this.handleSocialHover.bind(this));
            link.addEventListener('mouseleave', this.handleSocialHover.bind(this));
            link.addEventListener('click', this.handleSocialClick.bind(this));
        });

        // Enhanced footer links with loading indicator
        this.footerLinks.forEach(link => {
            link.addEventListener('click', this.handleFooterLinkClick.bind(this));
            link.addEventListener('mouseenter', this.handleLinkHover.bind(this));
        });
    }

    handleNewsletterSubmit(e) {
        e.preventDefault();
        const emailInput = this.newsletterForm.querySelector('input[type="email"]');
        const email = emailInput.value.trim();

        if (this.validateEmail(email)) {
            // Here you would typically send this to your backend
            console.log('Newsletter subscription for:', email);
            this.showSubscriptionMessage('Thank you for subscribing!');
            emailInput.value = '';
        } else {
            this.showSubscriptionMessage('Please enter a valid email address.', true);
        }
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    showSubscriptionMessage(message, isError = false) {
        const messageEl = document.createElement('div');
        messageEl.className = `subscription-message ${isError ? 'error' : 'success'}`;
        messageEl.textContent = message;

        const existingMessage = this.newsletterForm.querySelector('.subscription-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        this.newsletterForm.appendChild(messageEl);
        setTimeout(() => messageEl.remove(), 3000);
    }

    handleSocialHover(e) {
        const link = e.currentTarget;
        link.style.transition = 'transform 0.3s ease';
        link.style.transform = e.type === 'mouseenter' ? 'translateY(-2px)' : '';
    }

    handleFooterLinkClick(e) {
        const href = e.currentTarget.getAttribute('href');
        if (href.startsWith('#')) {
            e.preventDefault();
            const targetElement = document.querySelector(href);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }

    animateFooterLinks() {
        const footerSections = $$('.footer-section');
        footerSections.forEach((section, index) => {
            section.style.animation = `fadeInUp 0.5s ease forwards ${index * 0.1}s`;
            section.style.opacity = '0';
        });
    }

    handleLinkHover(e) {
        const link = e.currentTarget;
        const text = link.textContent;
        
        // Create and animate link highlight effect
        const highlight = document.createElement('span');
        highlight.className = 'link-highlight';
        highlight.style.cssText = `
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 0;
            height: 2px;
            background: var(--primary-gold);
            transition: width 0.3s ease;
        `;
        
        link.style.position = 'relative';
        link.appendChild(highlight);
        
        requestAnimationFrame(() => {
            highlight.style.width = '100%';
        });
        
        link.addEventListener('mouseleave', () => {
            highlight.style.width = '0';
            setTimeout(() => highlight.remove(), 300);
        }, { once: true });
    }

    setupSocialShare() {
        this.socialLinks.forEach(link => {
            link.setAttribute('title', 'Share on ' + link.textContent);
            link.setAttribute('aria-label', 'Share on ' + link.textContent);
        });
    }

    handleSocialClick(e) {
        e.preventDefault();
        const platform = e.currentTarget.textContent.toLowerCase();
        const url = window.location.href;
        const text = "Check out HomeIns - Luxury Living Redefined";
        
        let shareUrl;
        switch(platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
                break;
            case 'pinterest':
                shareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(text)}`;
                break;
            case 'instagram':
                // Instagram doesn't support direct sharing, show a message instead
                alert('Follow us on Instagram @HomeIns');
                return;
            default:
                shareUrl = url;
        }
        
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }

    initializeParallax() {
        if (!this.footer) return;
        
        let ticking = false;
        const footerBg = document.createElement('div');
        footerBg.className = 'footer-parallax-bg';
        this.footer.appendChild(footerBg);
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrolled = window.pageYOffset;
                    const rate = scrolled * 0.15;
                    
                    if (footerBg) {
                        footerBg.style.transform = `translate3d(0, ${rate}px, 0)`;
                    }
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    addInputAnimation() {
        const input = this.newsletterForm.querySelector('input');
        const label = document.createElement('label');
        label.className = 'newsletter-label';
        label.textContent = 'Your email';
        
        input.parentNode.insertBefore(label, input);
        
        input.addEventListener('focus', () => {
            label.classList.add('active');
        });
        
        input.addEventListener('blur', () => {
            if (!input.value) {
                label.classList.remove('active');
            }
        });
        
        if (input.value) {
            label.classList.add('active');
        }
    }
}

// Main Application Class
class HomeInsAboutApp {
    constructor() {
        this.components = {};
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', this.initializeComponents.bind(this));
        } else {
            this.initializeComponents();
        }
    }

    initializeComponents() {
        try {
            // Initialize all components
            this.components.loadingScreen = new LoadingScreen();
            this.components.header = new HeaderController();
            this.components.counter = new AnimatedCounter();
            this.components.scrollAnimations = new ScrollAnimations();
            this.components.cart = new CartController();
            this.components.search = new SearchController();
            this.components.scroll = new ScrollController();
            this.components.cards = new CardInteractions();
            this.components.newsletter = new NewsletterController();
            this.components.footer = new FooterController();
            
            // Initialize performance monitoring in development
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                this.components.performance = new PerformanceMonitor();
            }
            
            console.log('HomeIns About App initialized successfully');
            
        } catch (error) {
            console.error('Error initializing HomeIns About App:', error);
        }
    }

    // Public method to access components
    getComponent(name) {
        return this.components[name];
    }
}

// Initialize the application
const app = new HomeInsAboutApp();

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HomeInsAboutApp;
}
