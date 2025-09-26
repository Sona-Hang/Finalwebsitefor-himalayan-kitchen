// Mobile Menu Toggle - Optimized for performance
(function() {
    'use strict';

    // Cache DOM elements
    let menuToggle, navMenu, navLinks;
    let isAnimating = false;
    const ANIMATION_DURATION = 300; // ms

    // Initialize the mobile menu
    function initMobileMenu() {
        // Get elements
        menuToggle = document.querySelector('.mobile-menu-toggle');
        navMenu = document.querySelector('.nav-menu');
        
        if (!menuToggle || !navMenu) return;
        
        navLinks = Array.from(document.querySelectorAll('.nav-menu a'));
        
        // Add ARIA attributes
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-controls', 'main-navigation');
        navMenu.setAttribute('id', 'main-navigation');
        
        // Create two horizontal lines for hamburger menu
        menuToggle.innerHTML = '';
        
        // Create first line
        const line1 = document.createElement('span');
        line1.className = 'menu-line';
        menuToggle.appendChild(line1);
        
        // Create second line
        const line2 = document.createElement('span');
        line2.className = 'menu-line';
        menuToggle.appendChild(line2);
        
        // Add event listeners
        menuToggle.addEventListener('click', handleMenuToggle, { passive: true });
        
        // Close menu when clicking on links
        navLinks.forEach(link => {
            link.addEventListener('click', handleLinkClick, { passive: true });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', handleDocumentClick, false);
        
        // Handle keyboard navigation
        document.addEventListener('keydown', handleKeyDown, false);
        
        // Handle window resize
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(handleResize, 250);
        }, { passive: true });
    }
    
    // Toggle menu
    function handleMenuToggle(e) {
        if (e) e.preventDefault();
        if (isAnimating) return;
        
        isAnimating = true;
        
        if (navMenu.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
        
        // Reset animation flag
        setTimeout(() => {
            isAnimating = false;
        }, ANIMATION_DURATION);
    }
    
    // Open menu
    function openMenu() {
        menuToggle.classList.add('active');
        menuToggle.setAttribute('aria-expanded', 'true');
        navMenu.classList.add('active');
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
    }
    
    // Close menu
    function closeMenu() {
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('active');
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
    }
    
    // Handle link clicks
    function handleLinkClick() {
        if (window.innerWidth <= 768) {
            closeMenu();
        }
    }
    
    // Handle document clicks
    function handleDocumentClick(e) {
        if (!e.target.closest('.nav-container') && navMenu.classList.contains('active')) {
            closeMenu();
        }
    }
    
    // Handle keyboard navigation
    function handleKeyDown(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
            menuToggle.focus();
        }
        
        // Trap focus within menu when open
        if (e.key === 'Tab' && navMenu.classList.contains('active')) {
            const focusableElements = navMenu.querySelectorAll('a, button, [tabindex="0"]');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    }
    
    // Handle window resize
    function handleResize() {
        if (window.innerWidth > 768) {
            // Reset menu state on desktop
            if (navMenu && navMenu.classList.contains('active')) {
                closeMenu();
            }
        }
    }
    
    // Initialize the mobile menu when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileMenu);
    } else {
        initMobileMenu();
    }
    
    // Make functions available for debugging
    window.mobileMenu = {
        open: openMenu,
        close: closeMenu,
        toggle: handleMenuToggle
    };
})();
