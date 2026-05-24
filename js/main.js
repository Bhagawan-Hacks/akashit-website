/**
 * Global Theme Initialization
 * Prevents "flash of theme" and handles persistence across all pages.
 */
(function initTheme() {
    const savedTheme = localStorage.getItem('bhagawan_it_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
})();

document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Menu Toggle ---
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('nav-active');
            // Toggle hamburger icon between ☰ and ✕
            if (navLinks.classList.contains('nav-active')) {
                mobileMenuBtn.innerHTML = '✕';
            } else {
                mobileMenuBtn.innerHTML = '☰';
            }
        });
    }

    // --- Sticky Navbar on Scroll ---
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Active Link Highlighting based on current page ---
    // Normalize pathname: strip leading slash and .html extension to compare cleanly
    const rawPath = window.location.pathname.split('/').pop() || 'index';
    const currentPage = rawPath.replace(/\.html$/, '') || 'index';

    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(link => {
        const href = (link.getAttribute('href') || '').replace(/\.html$/, '').replace(/^\//, '') || 'index';
        if (href === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // --- Intersection Observer for Scroll Animations ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optional: Stop observing once animated
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => scrollObserver.observe(el));

    // --- Stats Counter Animation ---
    const statsCounters = document.querySelectorAll('[data-target]');
    let hasCounted = false;

    const runCounters = () => {
        statsCounters.forEach(counter => {
            counter.innerText = '0';
            const updateCounter = () => {
                const target = +counter.getAttribute('data-target');
                const c = +counter.innerText;
                const increment = target / 200; // Adjust speed

                if (c < target) {
                    counter.innerText = `${Math.ceil(c + increment)}`;
                    setTimeout(updateCounter, 10);
                } else {
                    counter.innerText = target;
                }
            };
            updateCounter();
        });
    }

    const statsSection = document.querySelector('.stats-bar');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            const entry = entries[0];
            if (entry.isIntersecting && !hasCounted) {
                runCounters();
                hasCounted = true;
            }
        }, { threshold: 0.5 });
        
        statsObserver.observe(statsSection);
    }

    // --- Testimonial Carousel ---
    const track = document.querySelector('.testimonial-track');
    const dots = document.querySelectorAll('.carousel-dots .dot');
    let currentIndex = 0;

    if (track && dots.length > 0) {
        const updateCarousel = (index) => {
            track.style.transform = `translateX(-${index * 100}%)`;
            dots.forEach(d => d.classList.remove('active'));
            dots[index].classList.add('active');
        };

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel(currentIndex);
            });
        });

        // Auto rotate
        setInterval(() => {
            currentIndex = (currentIndex + 1) % dots.length;
            updateCarousel(currentIndex);
        }, 5000);
    }

    // --- Portfolio Filtering ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-card');

    if (filterBtns.length > 0 && portfolioCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active state
                filterBtns.forEach(b => b.classList.remove('btn-primary'));
                filterBtns.forEach(b => b.classList.add('btn-outline'));
                btn.classList.add('btn-primary');
                btn.classList.remove('btn-outline');

                const filterValue = btn.getAttribute('data-filter');

                portfolioCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    if (filterValue === 'all' || filterValue === category) {
                        card.style.display = 'flex';
                        // Add a small animation effect
                        card.style.animation = 'float 0.5s ease-out';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // --- FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // --- Dynamic Theme Toggle Button ---
    const themeBtn = document.createElement('button');
    themeBtn.className = 'theme-toggle-btn';
    themeBtn.setAttribute('aria-label', 'Toggle Dark/Light Mode');
    themeBtn.innerHTML = document.documentElement.getAttribute('data-theme') === 'light' ? '🌙' : '☀️';
    themeBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--bg-card-glass);
        border: 1px solid var(--border-light);
        color: var(--text-off-white);
        font-size: 1.5rem;
        cursor: pointer;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(12px);
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    `;
    
    // Add hover effect
    themeBtn.addEventListener('mouseenter', () => {
        themeBtn.style.transform = 'translateY(-5px) scale(1.05)';
        themeBtn.style.boxShadow = '0 8px 25px rgba(230, 57, 70, 0.4)';
    });
    themeBtn.addEventListener('mouseleave', () => {
        themeBtn.style.transform = 'none';
        themeBtn.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
    });

    themeBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('bhagawan_it_theme', newTheme);
        themeBtn.innerHTML = newTheme === 'light' ? '🌙' : '☀️';
        
        // Quick spin animation on click
        themeBtn.animate([
            { transform: 'rotate(0deg) scale(1)' },
            { transform: 'rotate(180deg) scale(1.2)' },
            { transform: 'rotate(360deg) scale(1)' }
        ], { duration: 400, easing: 'ease-in-out' });
    });
    
    document.body.appendChild(themeBtn);

    // --- Scroll to Top Button ---
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.innerHTML = '↑';
    scrollTopBtn.style.cssText = `
        position: fixed;
        bottom: 80px;
        right: 20px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: var(--color-primary-red);
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        z-index: 9998;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 15px rgba(230, 57, 70, 0.4);
        transition: all 0.3s ease;
        opacity: 0;
        pointer-events: none;
        transform: translateY(20px);
    `;

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    scrollTopBtn.addEventListener('mouseenter', () => {
        scrollTopBtn.style.transform = 'translateY(-3px)';
        scrollTopBtn.style.boxShadow = '0 6px 20px rgba(230, 57, 70, 0.6)';
    });
    scrollTopBtn.addEventListener('mouseleave', () => {
        scrollTopBtn.style.transform = 'translateY(0)';
        scrollTopBtn.style.boxShadow = '0 4px 15px rgba(230, 57, 70, 0.4)';
    });

    document.body.appendChild(scrollTopBtn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTopBtn.style.opacity = '1';
            scrollTopBtn.style.pointerEvents = 'auto';
            scrollTopBtn.style.transform = 'translateY(0)';
        } else {
            scrollTopBtn.style.opacity = '0';
            scrollTopBtn.style.pointerEvents = 'none';
            scrollTopBtn.style.transform = 'translateY(20px)';
        }
    });

    // --- Interactive 3D Card Tilt Effect ---
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; 
            const y = e.clientY - rect.top;  
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate rotation. Max rotation is 15 degrees.
            const rotateX = ((y - centerY) / centerY) * -15; 
            const rotateY = ((x - centerX) / centerX) * 15;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            // Wait for transition, then clear style so CSS hover works if needed, but JS controls it now
            setTimeout(() => {
                card.style.transform = '';
            }, 400); 
        });
    });

});
