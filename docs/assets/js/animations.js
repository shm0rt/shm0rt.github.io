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
        // Always show arrow on page load regardless of previous scrolling
        scrollArrow.classList.add('hidden');
        
        // Show arrow after terminal is visible (6 seconds)
        setTimeout(function() {
            scrollArrow.classList.add('visible');
            scrollArrow.classList.remove('hidden');
        }, 6000);
        
        // Hide arrow when user scrolls
        window.addEventListener('scroll', function() {
            if (window.scrollY > window.innerHeight * 0.2) {
                scrollArrow.classList.remove('visible');
                scrollArrow.classList.add('hidden');
            }
        });
        
        // Make arrow clickable to scroll to first section
        scrollArrow.addEventListener('click', function() {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth' });
                scrollArrow.classList.remove('visible');
                scrollArrow.classList.add('hidden');
            }
        });
    }
}

// Enhanced smooth scroll for terminal navigation - modified to only highlight the title
window.smoothScrollToSection = function (sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;

    // Display notification in terminal
    if (window.appendOutput) {
        window.appendOutput(`Navigating to ${sectionId} section...`);
    }

    // Only highlight the section's title (h2) instead of the entire section
    const sectionTitle = section.querySelector('h2');
    if (sectionTitle) {
        // Add a subtle highlight to the title only
        sectionTitle.style.transition = 'color 0.3s ease-in-out';
        sectionTitle.style.color = 'var(--accent)';

        // Smooth scroll
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Remove highlight after animation
        setTimeout(() => {
            sectionTitle.style.color = '';
        }, 1000);
    } else {
        // If no title found, just scroll without highlighting
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Make available for terminal.js
window.cdDir = function (dirId) {
    smoothScrollToSection(dirId);
}