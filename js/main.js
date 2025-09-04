/**
 * SWATI HOSPITAL & AYURVEDIC MEDICAL COLLEGE
 * Main JavaScript File
 * Handles all interactive functionality, animations, and user interactions
 */

// ===================================
// GLOBAL VARIABLES AND CONFIGURATION
// ===================================

const CONFIG = {
  animationDuration: 300,
  scrollOffset: 80,
  debounceDelay: 100,
  counterSpeed: 2000,
  carouselAutoplay: 5000
};

let isScrolling = false;
let currentTestimonial = 0;
let testimonialInterval;

// ===================================
// UTILITY FUNCTIONS
// ===================================

/**
 * Debounce function to limit function calls
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
 * Throttle function to limit function calls
 */
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
  }
}

/**
 * Check if element is in viewport
 */
function isInViewport(element, offset = 0) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= -offset &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Smooth scroll to element
 */
function smoothScrollTo(target, offset = CONFIG.scrollOffset) {
  const element = typeof target === 'string' ? document.querySelector(target) : target;
  if (!element) return;
  
  const targetPosition = element.offsetTop - offset;
  
  window.scrollTo({
    top: targetPosition,
    behavior: 'smooth'
  });
}

/**
 * Add class with animation
 */
function addClassWithDelay(element, className, delay = 0) {
  setTimeout(() => {
    element.classList.add(className);
  }, delay);
}

/**
 * Show element with fade in animation
 */
function showElement(element, display = 'block') {
  element.style.display = display;
  element.classList.add('fade-in');
  setTimeout(() => {
    element.classList.remove('fade-in');
  }, CONFIG.animationDuration);
}

/**
 * Hide element with fade out animation
 */
function hideElement(element) {
  element.classList.add('fade-out');
  setTimeout(() => {
    element.style.display = 'none';
    element.classList.remove('fade-out');
  }, CONFIG.animationDuration);
}

// ===================================
// DARK THEME ONLY
// ===================================

class ThemeManager {
  constructor() {
    this.theme = 'dark';
    this.init();
  }
  
  init() {
    this.applyTheme();
  }
  
  applyTheme() {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.body.setAttribute('data-theme', 'dark');
  }
}

// ===================================
// NAVIGATION MANAGEMENT
// ===================================

class NavigationManager {
  constructor() {
    this.header = document.getElementById('header');
    this.mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    this.navMenu = document.getElementById('nav-menu');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.isMenuOpen = false;
    this.init();
  }
  
  init() {
    this.bindEvents();
    this.handleScroll();
    this.setActiveLink();
  }
  
  bindEvents() {
    // Mobile menu toggle
    if (this.mobileMenuToggle) {
      this.mobileMenuToggle.addEventListener('click', () => this.toggleMobileMenu());
    }
    
    // Navigation links
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => this.handleNavClick(e));
    });
    
    // Scroll events
    window.addEventListener('scroll', throttle(() => this.handleScroll(), 100));
    
    // Close mobile menu on outside click
    document.addEventListener('click', (e) => {
      if (this.isMenuOpen && !this.navMenu.contains(e.target) && !this.mobileMenuToggle.contains(e.target)) {
        this.closeMobileMenu();
      }
    });
    
    // Close mobile menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isMenuOpen) {
        this.closeMobileMenu();
      }
    });
  }
  
  toggleMobileMenu() {
    if (this.isMenuOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }
  
  openMobileMenu() {
    this.navMenu.classList.add('active');
    this.mobileMenuToggle.classList.add('active');
    document.body.classList.add('no-scroll');
    this.isMenuOpen = true;
    
    // Animate menu items
    const menuItems = this.navMenu.querySelectorAll('.nav-item');
    menuItems.forEach((item, index) => {
      addClassWithDelay(item, 'slide-up', index * 100);
    });
  }
  
  closeMobileMenu() {
    this.navMenu.classList.remove('active');
    this.mobileMenuToggle.classList.remove('active');
    document.body.classList.remove('no-scroll');
    this.isMenuOpen = false;
    
    // Remove animation classes
    const menuItems = this.navMenu.querySelectorAll('.nav-item');
    menuItems.forEach(item => {
      item.classList.remove('slide-up');
    });
  }
  
  handleNavClick(e) {
    const href = e.target.getAttribute('href');
    
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      
      if (target) {
        smoothScrollTo(target);
        this.setActiveLink(href);
        
        // Close mobile menu if open
        if (this.isMenuOpen) {
          this.closeMobileMenu();
        }
      }
    }
  }
  
  handleScroll() {
    const scrollY = window.scrollY;
    
    // Add scrolled class to header
    if (scrollY > 50) {
      this.header.classList.add('scrolled');
    } else {
      this.header.classList.remove('scrolled');
    }
    
    // Update active navigation link based on scroll position
    this.updateActiveNavOnScroll();
  }
  
  updateActiveNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + CONFIG.scrollOffset + 50;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        this.setActiveLink(`#${sectionId}`);
      }
    });
  }
  
  setActiveLink(activeHref = null) {
    this.navLinks.forEach(link => {
      link.classList.remove('active');
      
      if (activeHref && link.getAttribute('href') === activeHref) {
        link.classList.add('active');
      }
    });
  }
}

// ===================================
// SEARCH FUNCTIONALITY
// ===================================

class SearchManager {
  constructor() {
    this.searchBtn = document.getElementById('search-btn');
    this.searchOverlay = document.getElementById('search-overlay');
    this.searchInput = document.getElementById('search-input');
    this.searchClose = document.getElementById('search-close');
    this.isSearchOpen = false;
    this.init();
  }
  
  init() {
    this.bindEvents();
  }
  
  bindEvents() {
    // Search button
    if (this.searchBtn) {
      this.searchBtn.addEventListener('click', () => this.openSearch());
    }
    
    // Close button
    if (this.searchClose) {
      this.searchClose.addEventListener('click', () => this.closeSearch());
    }
    
    // Overlay click
    if (this.searchOverlay) {
      this.searchOverlay.addEventListener('click', (e) => {
        if (e.target === this.searchOverlay) {
          this.closeSearch();
        }
      });
    }
    
    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isSearchOpen) {
        this.closeSearch();
      }
    });
    
    // Search input
    if (this.searchInput) {
      this.searchInput.addEventListener('input', debounce((e) => {
        this.performSearch(e.target.value);
      }, CONFIG.debounceDelay));
    }
  }
  
  openSearch() {
    this.searchOverlay.classList.add('active');
    document.body.classList.add('no-scroll');
    this.isSearchOpen = true;
    
    // Focus on input after animation
    setTimeout(() => {
      this.searchInput.focus();
    }, CONFIG.animationDuration);
  }
  
  closeSearch() {
    this.searchOverlay.classList.remove('active');
    document.body.classList.remove('no-scroll');
    this.isSearchOpen = false;
    this.searchInput.value = '';
  }
  
  performSearch(query) {
    if (query.length < 2) return;
    
    // Simple search implementation
    const searchableElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p');
    const results = [];
    
    searchableElements.forEach(element => {
      if (element.textContent.toLowerCase().includes(query.toLowerCase())) {
        results.push({
          element,
          text: element.textContent,
          section: element.closest('section')?.id || 'unknown'
        });
      }
    });
    
    this.displaySearchResults(results, query);
  }
  
  displaySearchResults(results, query) {
    // This would typically display results in a dropdown
    // For now, we'll just log them
    console.log(`Search results for "${query}":`, results);
  }
}

// ===================================
// ANIMATION MANAGER
// ===================================

class AnimationManager {
  constructor() {
    this.animatedElements = document.querySelectorAll('.scroll-animate');
    this.counters = document.querySelectorAll('[data-target]');
    this.hasCountersAnimated = false;
    this.init();
  }
  
  init() {
    this.bindEvents();
    this.checkAnimations();
  }
  
  bindEvents() {
    window.addEventListener('scroll', throttle(() => this.checkAnimations(), 100));
    window.addEventListener('load', () => this.checkAnimations());
  }
  
  checkAnimations() {
    this.animateOnScroll();
    this.animateCounters();
  }
  
  animateOnScroll() {
    this.animatedElements.forEach(element => {
      if (isInViewport(element, 100) && !element.classList.contains('animate')) {
        element.classList.add('animate');
      }
    });
  }
  
  animateCounters() {
    if (this.hasCountersAnimated) return;
    
    const statsSection = document.querySelector('.stats-grid');
    if (statsSection && isInViewport(statsSection, 100)) {
      this.hasCountersAnimated = true;
      
      this.counters.forEach(counter => {
        this.animateCounter(counter);
      });
    }
  }
  
  animateCounter(counter) {
    const target = parseInt(counter.getAttribute('data-target'));
    const duration = CONFIG.counterSpeed;
    const increment = target / (duration / 16); // 60fps
    let current = 0;
    
    const updateCounter = () => {
      current += increment;
      
      if (current < target) {
        counter.textContent = Math.floor(current);
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target;
      }
    };
    
    updateCounter();
  }
}

// ===================================
// TESTIMONIALS CAROUSEL
// ===================================

class TestimonialsCarousel {
  constructor() {
    this.slides = document.querySelectorAll('.testimonial-slide');
    this.dots = document.querySelectorAll('.dot');
    this.prevBtn = document.querySelector('.carousel-btn.prev');
    this.nextBtn = document.querySelector('.carousel-btn.next');
    this.currentSlide = 0;
    this.autoplayInterval = null;
    this.init();
  }
  
  init() {
    if (this.slides.length === 0) return;
    
    this.bindEvents();
    this.startAutoplay();
  }
  
  bindEvents() {
    // Previous button
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.prevSlide());
    }
    
    // Next button
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.nextSlide());
    }
    
    // Dots
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.goToSlide(index));
    });
    
    // Pause autoplay on hover
    const carousel = document.querySelector('.testimonials-carousel');
    if (carousel) {
      carousel.addEventListener('mouseenter', () => this.stopAutoplay());
      carousel.addEventListener('mouseleave', () => this.startAutoplay());
    }
  }
  
  goToSlide(index) {
    // Remove active class from current slide and dot
    this.slides[this.currentSlide].classList.remove('active');
    this.dots[this.currentSlide].classList.remove('active');
    
    // Update current slide
    this.currentSlide = index;
    
    // Add active class to new slide and dot
    this.slides[this.currentSlide].classList.add('active');
    this.dots[this.currentSlide].classList.add('active');
  }
  
  nextSlide() {
    const nextIndex = (this.currentSlide + 1) % this.slides.length;
    this.goToSlide(nextIndex);
  }
  
  prevSlide() {
    const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.goToSlide(prevIndex);
  }
  
  startAutoplay() {
    this.stopAutoplay();
    this.autoplayInterval = setInterval(() => {
      this.nextSlide();
    }, CONFIG.carouselAutoplay);
  }
  
  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }
}

// ===================================
// FORM VALIDATION AND HANDLING
// ===================================

class FormManager {
  constructor() {
    this.appointmentForm = document.getElementById('appointment-form');
    this.newsletterForm = document.getElementById('newsletter-form');
    this.modal = document.getElementById('success-modal');
    this.modalClose = document.getElementById('modal-close');
    this.modalMessage = document.getElementById('modal-message');
    this.init();
  }
  
  init() {
    this.bindEvents();
  }
  
  bindEvents() {
    // Appointment form
    if (this.appointmentForm) {
      this.appointmentForm.addEventListener('submit', (e) => this.handleAppointmentSubmit(e));
      
      // Real-time validation
      const inputs = this.appointmentForm.querySelectorAll('input, select, textarea');
      inputs.forEach(input => {
        input.addEventListener('blur', () => this.validateField(input));
        input.addEventListener('input', () => this.clearFieldError(input));
      });
    }
    
    // Newsletter form
    if (this.newsletterForm) {
      this.newsletterForm.addEventListener('submit', (e) => this.handleNewsletterSubmit(e));
    }
    
    // Modal close
    if (this.modalClose) {
      this.modalClose.addEventListener('click', () => this.closeModal());
    }
    
    // Modal overlay click
    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) {
          this.closeModal();
        }
      });
    }
  }
  
  validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = 'This field is required';
    }
    
    // Email validation
    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
      }
    }
    
    // Phone validation
    if (field.type === 'tel' && value) {
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (!phoneRegex.test(value) || value.length < 10) {
        isValid = false;
        errorMessage = 'Please enter a valid phone number';
      }
    }
    
    // Date validation
    if (field.type === 'date' && value) {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        isValid = false;
        errorMessage = 'Please select a future date';
      }
    }
    
    this.showFieldError(field, isValid, errorMessage);
    return isValid;
  }
  
  showFieldError(field, isValid, errorMessage) {
    const errorElement = field.parentNode.querySelector('.error-message');
    
    if (isValid) {
      field.classList.remove('error');
      field.classList.add('success');
      if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.remove('show');
      }
    } else {
      field.classList.remove('success');
      field.classList.add('error');
      if (errorElement) {
        errorElement.textContent = errorMessage;
        errorElement.classList.add('show');
      }
    }
  }
  
  clearFieldError(field) {
    field.classList.remove('error', 'success');
    const errorElement = field.parentNode.querySelector('.error-message');
    if (errorElement) {
      errorElement.classList.remove('show');
    }
  }
  
  validateForm(form) {
    const fields = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isFormValid = true;
    
    fields.forEach(field => {
      if (!this.validateField(field)) {
        isFormValid = false;
      }
    });
    
    return isFormValid;
  }
  
  handleAppointmentSubmit(e) {
    e.preventDefault();
    
    if (!this.validateForm(this.appointmentForm)) {
      return;
    }
    
    // Show loading state
    const submitBtn = this.appointmentForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Booking...';
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    
    // Simulate API call
    setTimeout(() => {
      // Reset button
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      submitBtn.classList.remove('loading');
      
      // Show success modal
      this.showModal('Your appointment has been booked successfully! We will contact you soon to confirm the details.');
      
      // Reset form
      this.appointmentForm.reset();
      
      // Clear all field states
      const fields = this.appointmentForm.querySelectorAll('input, select, textarea');
      fields.forEach(field => this.clearFieldError(field));
      
    }, 2000);
  }
  
  handleNewsletterSubmit(e) {
    e.preventDefault();
    
    const emailInput = this.newsletterForm.querySelector('input[type="email"]');
    const submitBtn = this.newsletterForm.querySelector('button[type="submit"]');
    
    if (!this.validateField(emailInput)) {
      return;
    }
    
    // Show loading state
    submitBtn.innerHTML = '<div class="loading-spinner"></div>';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
      // Reset button
      submitBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22,2 15,22 11,13 2,9"></polygon></svg>';
      submitBtn.disabled = false;
      
      // Show success message
      this.showModal('Thank you for subscribing to our newsletter!');
      
      // Reset form
      this.newsletterForm.reset();
      this.clearFieldError(emailInput);
      
    }, 1500);
  }
  
  showModal(message) {
    this.modalMessage.textContent = message;
    this.modal.classList.add('active');
    document.body.classList.add('no-scroll');
  }
  
  closeModal() {
    this.modal.classList.remove('active');
    document.body.classList.remove('no-scroll');
  }
}

// ===================================
// FLOATING ACTION BUTTONS
// ===================================

class FloatingActionButtons {
  constructor() {
    this.callFab = document.getElementById('call-fab');
    this.emailFab = document.getElementById('email-fab');
    this.locationFab = document.getElementById('location-fab');
    this.init();
  }
  
  init() {
    this.bindEvents();
  }
  
  bindEvents() {
    if (this.callFab) {
      this.callFab.addEventListener('click', () => {
        window.location.href = 'tel:+911234567890';
      });
    }
    
    if (this.emailFab) {
      this.emailFab.addEventListener('click', () => {
        window.location.href = 'mailto:info@swatihospitalamc.org.in';
      });
    }
    
    if (this.locationFab) {
      this.locationFab.addEventListener('click', () => {
        // Scroll to contact section
        smoothScrollTo('#contact');
      });
    }
  }
}

// ===================================
// LOADING SCREEN MANAGER
// ===================================

class LoadingManager {
  constructor() {
    this.loadingScreen = document.getElementById('loading-screen');
    this.init();
  }
  
  init() {
    // Hide loading screen when page is fully loaded
    window.addEventListener('load', () => {
      setTimeout(() => {
        this.hideLoadingScreen();
      }, 1000); // Minimum loading time for better UX
    });
  }
  
  hideLoadingScreen() {
    if (this.loadingScreen) {
      this.loadingScreen.classList.add('hidden');
      
      // Remove from DOM after animation
      setTimeout(() => {
        this.loadingScreen.remove();
      }, 500);
    }
  }
}

// ===================================
// PERFORMANCE OPTIMIZATIONS
// ===================================

class PerformanceManager {
  constructor() {
    this.init();
  }
  
  init() {
    this.lazyLoadImages();
    this.preloadCriticalResources();
  }
  
  lazyLoadImages() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            img.classList.remove('lazy');
            observer.unobserve(img);
          }
        });
      });
      
      images.forEach(img => imageObserver.observe(img));
    }
  }
  
  preloadCriticalResources() {
    // Preload hero video
    const heroVideo = document.querySelector('.hero-video');
    if (heroVideo) {
      heroVideo.preload = 'metadata';
    }
  }
}

// ===================================
// ACCESSIBILITY ENHANCEMENTS
// ===================================

class AccessibilityManager {
  constructor() {
    this.init();
  }
  
  init() {
    this.handleKeyboardNavigation();
    this.announcePageChanges();
    this.manageFocus();
  }
  
  handleKeyboardNavigation() {
    // Tab navigation for dropdowns
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
      const trigger = dropdown.querySelector('.nav-link');
      const menu = dropdown.querySelector('.dropdown-menu');
      
      if (trigger && menu) {
        trigger.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
          }
        });
      }
    });
  }
  
  announcePageChanges() {
    // Create live region for announcements
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.id = 'live-region';
    document.body.appendChild(liveRegion);
  }
  
  manageFocus() {
    // Focus management for modals
    const modals = document.querySelectorAll('.modal');
    
    modals.forEach(modal => {
      modal.addEventListener('show', () => {
        const firstFocusable = modal.querySelector('button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) {
          firstFocusable.focus();
        }
      });
    });
  }
  
  announce(message) {
    const liveRegion = document.getElementById('live-region');
    if (liveRegion) {
      liveRegion.textContent = message;
    }
  }
}

// ===================================
// SECURITY MANAGER
// ===================================

class SecurityManager {
  constructor() {
    this.init();
  }
  
  init() {
    this.disableDevTools();
    this.disableContextMenu();
    this.disableKeyboardShortcuts();
    this.disableTextSelection();
    this.monitorDevTools();
  }
  
  disableContextMenu() {
    document.addEventListener('contextmenu', function(e) {
      e.preventDefault();
      return false;
    });
  }
  
  disableKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
      // Disable F12 (Developer Tools)
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }
      
      // Disable Ctrl+Shift+I (Inspect Element)
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        return false;
      }
      
      // Disable Ctrl+Shift+J (Console)
      if (e.ctrlKey && e.shiftKey && e.key === 'J') {
        e.preventDefault();
        return false;
      }
      
      // Disable Ctrl+U (View Source)
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        return false;
      }
      
      // Disable Ctrl+Shift+C (Select Element)
      if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        return false;
      }
      
      // Disable Ctrl+S (Save Page)
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        return false;
      }
    });
  }
  
  disableTextSelection() {
    document.addEventListener('selectstart', function(e) {
      e.preventDefault();
      return false;
    });
    
    document.addEventListener('dragstart', function(e) {
      e.preventDefault();
      return false;
    });
  }
  
  disableDevTools() {
    // Clear console periodically
    setInterval(function() {
      console.clear();
    }, 1000);
  }
  
  monitorDevTools() {
    let devtools = {
      open: false,
      orientation: null
    };
    
    const threshold = 160;
    
    setInterval(function() {
      if (window.outerHeight - window.innerHeight > threshold || 
          window.outerWidth - window.innerWidth > threshold) {
        if (!devtools.open) {
          devtools.open = true;
          document.body.innerHTML = '<div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: Arial; font-size: 24px; color: #333;">Developer tools are not allowed on this website.</div>';
        }
      } else {
        devtools.open = false;
      }
    }, 500);
  }
}

// ===================================
// MAIN APPLICATION INITIALIZATION
// ===================================

class App {
  constructor() {
    this.init();
  }
  
  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
    } else {
      this.initializeComponents();
    }
  }
  
  initializeComponents() {
    try {
      // Initialize security first
      this.securityManager = new SecurityManager();
      
      // Initialize all components
      this.loadingManager = new LoadingManager();
      this.themeManager = new ThemeManager();
      this.navigationManager = new NavigationManager();
      this.searchManager = new SearchManager();
      this.animationManager = new AnimationManager();
      this.testimonialsCarousel = new TestimonialsCarousel();
      this.formManager = new FormManager();
      this.floatingActionButtons = new FloatingActionButtons();
      this.performanceManager = new PerformanceManager();
      this.accessibilityManager = new AccessibilityManager();
      
      console.log('🌙 Dark theme website initialized successfully!');
      console.log('🏥 Swati Hospital website initialized successfully!');
      
    } catch (error) {
      console.error('Error initializing application:', error);
    }
  }
}

// Initialize the application
const app = new App();

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { App, CONFIG };
}