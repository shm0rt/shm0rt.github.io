// Typing animation and scroll effects
let heroTitle, heroText, typingContainer, visibleText, cursor;
let charIndex = 0;
const baseDelay = 40;

// Initialize when DOM is ready
window.addEventListener("DOMContentLoaded", function () {
    // Get hero elements
    heroTitle = document.querySelector(".hero h1");
    heroText = heroTitle.textContent;

    // Setup for typing effect
    heroTitle.innerHTML = '';
    typingContainer = document.createElement("div");
    typingContainer.className = "typing-container";
    heroTitle.appendChild(typingContainer);

    visibleText = document.createElement("span");
    visibleText.className = "visible-text";
    typingContainer.appendChild(visibleText);

    cursor = document.createElement("span");
    cursor.className = "terminal-cursor cursor-typing";
    typingContainer.appendChild(cursor);

    // Make sections visible with animation
    setTimeout(function () {
        document.querySelector(".hero h1").classList.add("visible");
        document.querySelector(".hero p").classList.add("visible");
    }, 300);

    // Initialize scroll effects
    initScrollEffects();

    // Initialize scroll arrow
    initScrollArrow();

    // Start typing after a short delay
    setTimeout(startTyping, 300);

    // Show terminal immediately with fastfetch
    const terminal = document.getElementById("terminalWindow");
    terminal.style.opacity = "1";

    // Call printIntro from terminal.js immediately
    if (typeof window.printIntro === 'function') {
        window.printIntro();
    }

    // Listen for window resize
    window.addEventListener("resize", () => {
        if (heroTitle) heroTitle.style.width = "100%";
    });
});

// More human-like typing delays
function getTypingDelay() {
    // Base typing speed with randomness
    let delay = baseDelay * (0.7 + Math.random() * 0.6);

    // Occasionally add a longer pause (as if thinking)
    if (Math.random() < 0.08) {
        delay *= 3;
    }

    // Add slight pause after punctuation
    const lastChar = heroText.charAt(charIndex - 1);
    if ([',', '.', ':', ';', '&', ':'].includes(lastChar)) {
        delay *= 1.5;
    }

    return Math.floor(delay);
}

function startTyping() {
    charIndex = 0;
    typeNextChar();
}

function typeNextChar() {
    if (charIndex < heroText.length) {
        // Reveal one more character
        visibleText.textContent = heroText.substring(0, charIndex + 1);
        charIndex++;
        setTimeout(typeNextChar, getTypingDelay());
    } else {
        // Animation complete, change cursor to blinking
        cursor.classList.remove("cursor-typing");
        cursor.classList.add("cursor-blinking");
    }
}

// Initialize scroll effects with reveal animations
function initScrollEffects() {
    // Pre-mark elements for animation
    const animatableElements = document.querySelectorAll('.container section, .skill-box, .tech-skill');

    // Set up staggered animations for grid items
    document.querySelectorAll('.skill-grid .skill-box').forEach((el, index) => {
        el.style.setProperty('--animation-order', index);
    });

    document.querySelectorAll('.tech-skills-grid .tech-skill').forEach((el, index) => {
        el.style.setProperty('--animation-order', index % 6); // Keep delays reasonable
    });

    // Store initial widths for skill bars
    document.querySelectorAll('.skill-bar').forEach(bar => {
        bar.setAttribute('data-width', bar.style.width);
        bar.style.width = '0';
    });

    // Mark elements for animation
    animatableElements.forEach(element => {
        element.classList.add('animate-on-scroll', 'hidden');
    });

    // Intersection Observer for reveal on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
                entry.target.classList.remove('hidden');

                // For skill bars, animate after reveal
                if (entry.target.classList.contains('skill-box')) {
                    const skillBar = entry.target.querySelector('.skill-bar');
                    if (skillBar) {
                        setTimeout(() => {
                            skillBar.style.width = skillBar.getAttribute('data-width');
                        }, 200);
                    }
                }

                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    });

    // Start observing elements
    animatableElements.forEach(element => observer.observe(element));
}

// Initialize scroll arrow (following the same style as other initializations)
function initScrollArrow() {
    const scrollArrow = document.getElementById('scrollDownArrow');
    
    // Reset the scroll state on each page load
    if (scrollArrow) {
        // Always hide arrow initially
        scrollArrow.classList.add('hidden');
        
        // Variable to track if user has already scrolled
        let hasScrolled = false;
        
        // Set scroll flag when user scrolls
        window.addEventListener('scroll', function() {
            if (window.scrollY > window.innerHeight * 0.2) {
                hasScrolled = true;
                scrollArrow.classList.remove('visible');
                scrollArrow.classList.add('hidden');
            }
        });
        
        // Show arrow after terminal is visible (4 seconds), but only if user hasn't scrolled
        setTimeout(function() {
            if (!hasScrolled) {
                scrollArrow.classList.add('visible');
                scrollArrow.classList.remove('hidden');
            }
        }, 4000);
        
        // Make arrow clickable to scroll to first section
        scrollArrow.addEventListener('click', function() {
            // Use existing smooth scroll function
            window.smoothScrollToSection('about');
            
            // Hide the arrow after scrolling
            scrollArrow.classList.remove('visible');
            scrollArrow.classList.add('hidden');
        });
    }
}

// Enhanced smooth scroll for terminal navigation
window.smoothScrollToSection = function (sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;

    // Display notification in terminal
    if (window.appendOutput) {
        window.appendOutput(`Navigating to ${sectionId} section...`);
    }

    // Find the section's h2 header
    const sectionHeader = section.querySelector('h2');
    
    // Custom smooth scroll function
    function smoothScroll(target) {
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 800; // Adjust for scroll speed
        let start = null;

        function animation(currentTime) {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        }

        // Easing function for smooth acceleration and deceleration
        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    }

    if (sectionHeader) {
        // Smooth scroll to the header
        smoothScroll(sectionHeader);

        // Highlight section title briefly
        sectionHeader.style.transition = 'color 0.3s ease-in-out';
        sectionHeader.style.color = 'var(--accent)';

        // Remove highlight after animation
        setTimeout(() => {
            sectionHeader.style.color = '';
        }, 1000);
    } else {
        // Fallback if no header found
        smoothScroll(section);
    }
}

// Ensure compatibility with terminal.js
window.cdDir = function (dirId) {
    smoothScrollToSection(dirId);
}