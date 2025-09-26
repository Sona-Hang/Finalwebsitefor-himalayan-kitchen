// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded');
    
    // Get DOM elements
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    // Toggle mobile menu
    function toggleMenu() {
        const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
        mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('active', !isExpanded);
        mobileMenuToggle.classList.toggle('active', !isExpanded);
    }
    
    // Close mobile menu
    function closeMenu() {
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
    }
    
    // Add event listeners if elements exist
    if (mobileMenuToggle && navMenu) {
        console.log('Mobile menu elements found');
        
        // Toggle menu on button click
        mobileMenuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            console.log('Menu button clicked');
            toggleMenu();
        });
        
        // Close menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                console.log('Menu link clicked');
                closeMenu();
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.nav-container') && !event.target.closest('.nav-menu')) {
                console.log('Clicked outside menu');
                closeMenu();
            }
        });
        
        // Prevent menu from closing when clicking inside it
        navMenu.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    } else {
        console.error('Mobile menu elements not found');
    }
    
    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add scroll effect to header
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
            } else {
                header.style.backgroundColor = '#ffffff';
                header.style.backdropFilter = 'none';
            }
        });
    }
}); 