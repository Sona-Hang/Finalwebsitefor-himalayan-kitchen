// Gallery JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    let lightbox, lightboxImage, lightboxTitle, lightboxDescription, lightboxClose, lightboxPrev, lightboxNext;
    const galleryItems = document.querySelectorAll('.gallery-item');
    let currentImageIndex = 0;
    let images = [];
    let imageObserver;
    
    // Initialize lightbox elements with error handling
    try {
        lightbox = document.getElementById('lightbox');
        if (!lightbox) throw new Error('Lightbox element not found');
        
        lightboxImage = lightbox.querySelector('.lightbox-image');
        lightboxTitle = lightbox.querySelector('.lightbox-title');
        lightboxDescription = lightbox.querySelector('.lightbox-description');
        lightboxClose = lightbox.querySelector('.lightbox-close');
        lightboxPrev = lightbox.querySelector('.lightbox-prev');
        lightboxNext = lightbox.querySelector('.lightbox-next');
        
        if (!lightboxImage || !lightboxTitle || !lightboxDescription || !lightboxClose || !lightboxPrev || !lightboxNext) {
            throw new Error('One or more lightbox elements are missing');
        }
    } catch (error) {
        console.error('Gallery initialization error:', error);
        return; // Stop execution if lightbox is not properly set up
    }

    // Check if device is mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // Initialize gallery
    function initGallery() {
        if (!galleryItems.length) {
            console.warn('No gallery items found');
            return;
        }

        // Collect all images and their data
        galleryItems.forEach((item, index) => {
            try {
                const img = item.querySelector('img');
                if (!img) {
                    console.warn('Image not found in gallery item', item);
                    markItemAsError(item, 'No image found');
                    return;
                }
                
                const caption = item.querySelector('.gallery-caption');
                const title = caption?.querySelector('h3')?.textContent || '';
                const description = caption?.querySelector('p')?.textContent || '';
                
                // Add loading state
                item.classList.add('loading');
                
                // Add to images array
                images.push({
                    src: img.dataset.src || img.src,
                    alt: img.alt || `Gallery image ${index + 1}`,
                    title: title,
                    description: description
                });

                if (isMobile) {
                    // For mobile: tap to toggle caption, long press to open lightbox
                    let tapTimer;
                    let isLongPress = false;
                    
                    // Touch start handler
                    item.addEventListener('touchstart', (e) => {
                        isLongPress = false;
                        tapTimer = setTimeout(() => {
                            isLongPress = true;
                            openLightbox(index);
                        }, 500); // Long press duration (ms)
                    }, { passive: true });
                    
                    // Touch end handler
                    item.addEventListener('touchend', (e) => {
                        clearTimeout(tapTimer);
                        if (!isLongPress) {
                            // Toggle caption on tap
                            e.preventDefault();
                            item.classList.toggle('active');
                            
                            // Close other open captions
                            galleryItems.forEach((otherItem, otherIndex) => {
                                if (otherIndex !== index && otherItem.classList.contains('active')) {
                                    otherItem.classList.remove('active');
                                }
                            });
                        }
                    }, { passive: true });
                    
                    // Prevent default touch behavior
                    item.addEventListener('touchmove', (e) => {
                        clearTimeout(tapTimer);
                    }, { passive: true });
                    
                } else {
                    // For desktop: click to open lightbox
                    item.addEventListener('click', () => openLightbox(index));
                    
                    // Add keyboard event for accessibility
                    item.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            openLightbox(index);
                        }
                    });
                }
                
                // Add error handling
                img.addEventListener('error', () => handleImageError(img, item));
                
                // If image is already loaded, remove loading state
                if (img.complete) {
                    item.classList.remove('loading');
                    item.classList.add('loaded');
                } else {
                    img.addEventListener('load', () => {
                        item.classList.remove('loading');
                        item.classList.add('loaded');
                    });
                }
                
            } catch (error) {
                console.error('Error initializing gallery item:', error, item);
                markItemAsError(item, 'Error loading item');
            }
        });
        
        // Initialize lazy loading if supported
        initLazyLoading();
    }

    // Open lightbox
    function openLightbox(index) {
        currentImageIndex = index;
        updateLightboxContent();
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        // Focus management for accessibility
        lightboxClose.focus();
    }

    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        
        // Return focus to the gallery item that was clicked
        if (galleryItems[currentImageIndex]) {
            galleryItems[currentImageIndex].focus();
        }
    }

    // Update lightbox content
    function updateLightboxContent() {
        const currentImage = images[currentImageIndex];
        lightboxImage.src = currentImage.src;
        lightboxImage.alt = currentImage.alt;
        lightboxTitle.textContent = currentImage.title;
        lightboxDescription.textContent = currentImage.description;
    }

    // Navigate to previous image
    function showPreviousImage() {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        updateLightboxContent();
    }

    // Navigate to next image
    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        updateLightboxContent();
    }

    // Event listeners
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', showPreviousImage);
    lightboxNext.addEventListener('click', showNextImage);

    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        switch (e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                showPreviousImage();
                break;
            case 'ArrowRight':
                showNextImage();
                break;
        }
    });

    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    lightbox.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next image
                showNextImage();
            } else {
                // Swipe right - previous image
                showPreviousImage();
            }
        }
    }

    // Mark item as having an error
    function markItemAsError(item, message) {
        item.classList.remove('loading');
        item.classList.add('error');
        
        // Only add error message if not already present
        if (!item.querySelector('.error-message')) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = message;
            item.appendChild(errorDiv);
        }
    }
    
    // Image loading error handling
    function handleImageError(img, item) {
        if (!img || !item) return;
        
        try {
            item.classList.remove('loading');
            markItemAsError(item, 'Image failed to load');
            
            // Try to load a fallback image if available
            const fallbackSrc = img.dataset.fallbackSrc;
            if (fallbackSrc && img.src !== fallbackSrc) {
                img.src = fallbackSrc;
                return;
            }
            
            // If no fallback, hide the broken image
            img.style.display = 'none';
        } catch (error) {
            console.error('Error handling image error:', error);
        }
    }

    // Initialize lazy loading
    function initLazyLoading() {
        if (!('IntersectionObserver' in window)) return;
        
        imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        img.classList.remove('lazy');
                    }
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '200px', // Start loading images 200px before they're in view
            threshold: 0.01
        });

        // Observe all lazy-loaded images
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Add CSS for loading states
    function addGalleryStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .gallery-item.loading {
                background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                background-size: 200% 100%;
                animation: loading 1.5s infinite;
            }
            
            .gallery-item.loading img {
                opacity: 0;
            }
            
            .gallery-item.loaded img {
                opacity: 1;
                transition: opacity 0.3s ease;
            }
            
            .gallery-item.error {
                background: #f8f8f8;
                border: 2px dashed #ddd;
            }
            
            .error-message {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #666;
                font-size: 0.9rem;
                padding: 1rem;
                text-align: center;
            }
            
            @keyframes loading {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
            }
            
            @media (prefers-reduced-motion: reduce) {
                .gallery-item.loading {
                    animation: none;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
    
    // Initialize the gallery
    try {
        addGalleryStyles();
        initGallery();
    } catch (error) {
        console.error('Failed to initialize gallery:', error);
        // Show error message to user if needed
        const gallery = document.querySelector('.gallery');
        if (gallery && !gallery.querySelector('.gallery-error')) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'gallery-error';
            errorDiv.textContent = 'Failed to load gallery. Please refresh the page or try again later.';
            gallery.prepend(errorDiv);
        }
    }
});
