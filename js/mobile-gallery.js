// Mobile Gallery JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if device is mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (!isMobile) return; // Exit if not on mobile

    // Initialize variables
    let currentImageIndex = 0;
    let images = [];
    const galleryContainer = document.querySelector('.gallery-grid');
    
    if (!galleryContainer) return;

    // Initialize gallery
    function initMobileGallery() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        if (!galleryItems.length) return;

        // Reset grid for mobile
        galleryContainer.style.gridTemplateColumns = 'repeat(2, 1fr)';
        galleryContainer.style.gap = '8px';
        galleryContainer.style.padding = '0 8px';
        galleryContainer.style.margin = '0 auto 2rem';
        galleryContainer.style.maxWidth = '100%';

        // Process each gallery item
        galleryItems.forEach((item, index) => {
            try {
                const img = item.querySelector('img');
                if (!img) return;

                // Store image data
                images.push({
                    src: img.dataset.src || img.src,
                    alt: img.alt || `Gallery image ${index + 1}`,
                    title: item.querySelector('.gallery-caption h3')?.textContent || '',
                    description: item.querySelector('.gallery-caption p')?.textContent || ''
                });

                // Style adjustments for mobile
                item.style.margin = '0';
                item.style.borderRadius = '8px';
                item.style.overflow = 'hidden';
                item.style.aspectRatio = '1/1'; // Make items square
                
                // Make images fill the container
                if (img) {
                    img.style.width = '100%';
                    img.style.height = '100%';
                    img.style.objectFit = 'cover';
                }

                // Add touch events
                setupTouchEvents(item, index);
                
            } catch (error) {
                console.error('Error initializing mobile gallery item:', error);
            }
        });
    }

    // Set up touch events for mobile
    function setupTouchEvents(item, index) {
        let touchStartTime = 0;
        let touchStartX = 0;
        let touchStartY = 0;
        const longPressDuration = 500; // ms
        const maxTouchMove = 10; // pixels
        let longPressTimer;
        let hasMoved = false;

        // Touch start handler
        item.addEventListener('touchstart', (e) => {
            touchStartTime = Date.now();
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            hasMoved = false;
            
            // Start long press timer
            longPressTimer = setTimeout(() => {
                if (!hasMoved) {
                    openLightbox(index);
                }
            }, longPressDuration);
            
            // Add active class for visual feedback
            item.classList.add('active');
        }, { passive: true });

        // Touch move handler
        item.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            const moveX = Math.abs(touch.clientX - touchStartX);
            const moveY = Math.abs(touch.clientY - touchStartY);
            
            // Check if touch has moved significantly
            if (moveX > maxTouchMove || moveY > maxTouchMove) {
                hasMoved = true;
                clearTimeout(longPressTimer);
            }
        }, { passive: true });

        // Touch end handler
        item.addEventListener('touchend', (e) => {
            clearTimeout(longPressTimer);
            item.classList.remove('active');
            
            // If it was a tap (not a long press and didn't move much)
            if (!hasMoved && (Date.now() - touchStartTime) < longPressDuration) {
                e.preventDefault();
                toggleCaption(item);
            }
        }, { passive: true });

        // Touch cancel handler
        item.addEventListener('touchcancel', () => {
            clearTimeout(longPressTimer);
            item.classList.remove('active');
        }, { passive: true });
    }

    // Toggle caption visibility
    function toggleCaption(item) {
        const caption = item.querySelector('.gallery-caption');
        if (caption) {
            const isActive = item.classList.toggle('show-caption');
            caption.style.opacity = isActive ? '1' : '0';
            caption.style.visibility = isActive ? 'visible' : 'hidden';
        }
    }

    // Lightbox functions
    function openLightbox(index) {
        currentImageIndex = index;
        const lightbox = document.getElementById('lightbox');
        const lightboxImage = lightbox?.querySelector('.lightbox-image');
        const lightboxTitle = lightbox?.querySelector('.lightbox-title');
        const lightboxDescription = lightbox?.querySelector('.lightbox-description');
        
        if (lightbox && lightboxImage && lightboxTitle && lightboxDescription) {
            const image = images[index];
            lightboxImage.src = image.src;
            lightboxImage.alt = image.alt;
            lightboxTitle.textContent = image.title;
            lightboxDescription.textContent = image.description;
            
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Add swipe handlers for lightbox
            setupLightboxSwipe(lightbox);
        }
    }
    
    function closeLightbox() {
        const lightbox = document.getElementById('lightbox');
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    function setupLightboxSwipe(lightbox) {
        let touchStartX = 0;
        let touchEndX = 0;
        const swipeThreshold = 50; // Minimum distance for swipe
        
        lightbox.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        lightbox.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            const diff = touchStartX - touchEndX;
            
            // Swipe left (next image)
            if (diff > swipeThreshold && currentImageIndex < images.length - 1) {
                openLightbox(currentImageIndex + 1);
            } 
            // Swipe right (previous image)
            else if (diff < -swipeThreshold && currentImageIndex > 0) {
                openLightbox(currentImageIndex - 1);
            }
        }
    }
    
    // Close lightbox when clicking outside the image
    document.addEventListener('click', (e) => {
        const lightbox = document.getElementById('lightbox');
        if (lightbox && lightbox.classList.contains('active') && e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Close button
    const closeButton = document.querySelector('.lightbox-close');
    if (closeButton) {
        closeButton.addEventListener('click', closeLightbox);
    }
    
    // Initialize the mobile gallery
    initMobileGallery();
});
