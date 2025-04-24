// Main JavaScript file for the Zellige and Plâtre Sculpté website

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Navigation menu toggle for mobile
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll animations
    const fadeElements = document.querySelectorAll('.fade-in');
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    // Intersection Observer for fade-in elements
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    fadeElements.forEach(element => {
        fadeObserver.observe(element);
    });
    
    // Intersection Observer for timeline items
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                timelineObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    timelineItems.forEach(item => {
        timelineObserver.observe(item);
    });

    // Lightbox functionality for gallery
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = document.querySelector('.lightbox-img');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    
    let currentIndex = 0;
    
    // Open lightbox when clicking on a gallery item
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const info = item.querySelector('.gallery-item-info');
            const title = info.querySelector('h3').textContent;
            const desc = info.querySelector('p').textContent;
            
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightboxCaption.textContent = `${title} - ${desc}`;
            currentIndex = index;
            
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close lightbox
    lightboxClose.addEventListener('click', () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
    
    // Navigate to previous image
    lightboxPrev.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
        updateLightbox();
    });
    
    // Navigate to next image
    lightboxNext.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % galleryItems.length;
        updateLightbox();
    });
    
    // Update lightbox content
    function updateLightbox() {
        const item = galleryItems[currentIndex];
        const img = item.querySelector('img');
        const info = item.querySelector('.gallery-item-info');
        const title = info.querySelector('h3').textContent;
        const desc = info.querySelector('p').textContent;
        
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxCaption.textContent = `${title} - ${desc}`;
    }
    
    // Close lightbox when clicking outside the content
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Keyboard navigation for lightbox
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        } else if (e.key === 'ArrowLeft') {
            currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
            updateLightbox();
        } else if (e.key === 'ArrowRight') {
            currentIndex = (currentIndex + 1) % galleryItems.length;
            updateLightbox();
        }
    });

    // Parallax effect for background images
    window.addEventListener('scroll', function() {
        const parallaxElements = document.querySelectorAll('.parallax-bg');
        
        parallaxElements.forEach(element => {
            const scrollPosition = window.pageYOffset;
            const elementPosition = element.offsetTop;
            const distance = scrollPosition - elementPosition;
            
            if (Math.abs(distance) < window.innerHeight) {
                const speed = 0.5;
                element.style.backgroundPositionY = `${distance * speed}px`;
            }
        });
    });

    // Header scroll effect
    const header = document.querySelector('header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'var(--light-color)';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
        
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });

    // Interactive elements for zellige and plâtre sections
    const interactiveSections = document.querySelectorAll('.interactive-section');
    
    interactiveSections.forEach(section => {
        section.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = section.getBoundingClientRect();
            const x = (e.clientX - left) / width;
            const y = (e.clientY - top) / height;
            
            const bg = section.querySelector('.interactive-bg');
            if (bg) {
                bg.style.opacity = 0.05 + (x * 0.1);
                bg.style.transform = `scale(${1 + (y * 0.05)})`;
            }
        });
        
        section.addEventListener('mouseleave', () => {
            const bg = section.querySelector('.interactive-bg');
            if (bg) {
                bg.style.opacity = 0.1;
                bg.style.transform = 'scale(1)';
            }
        });
    });

    // Create geometric pattern elements dynamically
    function createPatterns() {
        const patternContainer = document.querySelector('.hero');
        const numPatterns = 5;
        
        for (let i = 0; i < numPatterns; i++) {
            const pattern = document.createElement('div');
            pattern.classList.add('geometric-pattern');
            pattern.style.top = `${Math.random() * 100}%`;
            pattern.style.left = `${Math.random() * 100}%`;
            pattern.style.width = `${50 + Math.random() * 150}px`;
            pattern.style.height = `${50 + Math.random() * 150}px`;
            pattern.style.opacity = `${0.05 + Math.random() * 0.1}`;
            pattern.style.transform = `rotate(${Math.random() * 360}deg)`;
            pattern.style.animationDuration = `${5 + Math.random() * 10}s`;
            pattern.style.animationDelay = `${Math.random() * 5}s`;
            
            patternContainer.appendChild(pattern);
        }
    }
    
    // Call the function to create patterns
    createPatterns();
});
