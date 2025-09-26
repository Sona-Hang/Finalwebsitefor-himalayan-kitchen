// Enhanced UI/UX Interactions for Himalayan Kitchen & Bar

document.addEventListener('DOMContentLoaded', function() {
    
    // Logo Loading Fix
    const brandLogo = document.querySelector('.brand-logo');
    if (brandLogo) {
        // Force logo to display
        brandLogo.style.display = 'block';
        brandLogo.style.visibility = 'visible';
        brandLogo.style.opacity = '1';
        
        // Add error handling for logo
        brandLogo.addEventListener('error', function() {
            console.log('Logo failed to load, showing fallback');
            this.style.display = 'none';
            // Show emoji fallback
            const brand = document.querySelector('.brand');
            if (brand) {
                brand.style.setProperty('--show-emoji', 'inline-block');
            }
        });
        
        // Ensure logo loads
        brandLogo.addEventListener('load', function() {
            console.log('Logo loaded successfully');
            this.style.display = 'block';
            this.style.visibility = 'visible';
            this.style.opacity = '1';
        });
    }
    
    // Loading Screen
    const loadingScreen = document.createElement('div');
    loadingScreen.className = 'loading-screen';
    loadingScreen.innerHTML = '<div class="loading-spinner"></div>';
    document.body.appendChild(loadingScreen);
    
    // Hide loading screen after page loads
    window.addEventListener('load', function() {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.remove();
            }, 500);
        }, 1000);
    });
    
    // Scroll Progress Indicator
    const scrollIndicator = document.createElement('div');
    scrollIndicator.className = 'scroll-indicator';
    scrollIndicator.innerHTML = '<div class="scroll-progress"></div>';
    document.body.appendChild(scrollIndicator);
    
    const scrollProgress = scrollIndicator.querySelector('.scroll-progress');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        scrollProgress.style.width = scrollPercent + '%';
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
    
    // Observe menu sections for animation
    document.querySelectorAll('.menu-section').forEach(section => {
        observer.observe(section);
    });
    
    // Enhanced mobile menu toggle
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileToggle.contains(event.target) && !navMenu.contains(event.target)) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
            }
        });
        
        // Close mobile menu on window resize (if it becomes desktop)
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
            }
        });
    }
    
    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        });
    }
    
    // Add hover effects to menu items
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(8px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(4px)';
        });
    });
    
    // Enhanced button interactions
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.02)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        button.addEventListener('mousedown', function() {
            this.style.transform = 'translateY(-1px) scale(0.98)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = 'translateY(-3px) scale(1.02)';
        });
    });
    
    // Add subtle animations to navigation items
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.05)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Brand logo hover effect
    const brand = document.querySelector('.brand');
    if (brand) {
        brand.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.02)';
        });
        
        brand.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    }
    
    // Add loading animation to images
    document.querySelectorAll('img').forEach(img => {
        // Set initial state
        img.style.opacity = '0';
        img.style.transform = 'scale(0.95)';
        img.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        // Handle loaded images
        if (img.complete) {
            img.style.opacity = '1';
            img.style.transform = 'scale(1)';
        } else {
            img.addEventListener('load', function() {
                this.style.opacity = '1';
                this.style.transform = 'scale(1)';
            });
        }
    });

    // Smooth scroll effects
    function updateScrollEffects() {
        const scrollPosition = window.pageYOffset;
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
            const isVisible = (elementTop - window.innerHeight) < scrollPosition;
            
            if (isVisible) {
                element.classList.add('animated');
            }
        });
        
        // Parallax effect for hero
        const hero = document.querySelector('.hero');
        if (hero) {
            const rate = scrollPosition * -0.3;
            hero.style.transform = `translateY(${rate}px)`;
        }
        
        ticking = false;
    }
    
    // Enhanced form interactions (if any forms exist)
    document.querySelectorAll('input, textarea, select').forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
    
    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close mobile menu on escape
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
            }
        }
    });
    
    // Performance optimization: Throttle scroll events
    let ticking = false;
    
    function updateScrollEffects() {
        // Update scroll progress
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        scrollProgress.style.width = scrollPercent + '%';
        
        // Update parallax
        if (hero) {
            const rate = scrollTop * -0.3;
            hero.style.transform = `translateY(${rate}px)`;
        }
        
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    });
    
    console.log('🍜 Enhanced UI/UX interactions loaded for Himalayan Kitchen & Bar!');
});
