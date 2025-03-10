// Typing animation and scroll effects
let heroTitle;
let heroText;
let typingContainer;
let visibleText;
let cursor;
let charIndex = 0;
const baseDelay = 40;

// Initialize when DOM is ready
window.addEventListener("DOMContentLoaded", function () {
    // Get hero elements
    heroTitle = document.querySelector(".hero h1");
    heroText = heroTitle.textContent;

    // Setup for typing effect
    heroTitle.innerHTML = ''; // Clear the title

    // Create typing container to keep text and cursor aligned
    typingContainer = document.createElement("div");
    typingContainer.className = "typing-container";
    heroTitle.appendChild(typingContainer);

    // Create visible text span (starts empty)
    visibleText = document.createElement("span");
    visibleText.className = "visible-text";
    typingContainer.appendChild(visibleText);

    // Create terminal-style cursor
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

    // Start typing after a short delay
    setTimeout(startTyping, 300);

    // CHANGE: Show terminal immediately with fastfetch
    const terminal = document.getElementById("terminalWindow");
    terminal.style.opacity = "1";

    // Call printIntro from terminal.js immediately
    if (typeof window.printIntro === 'function') {
        window.printIntro();
    }

    // Listen for window resize to ensure text wrapping works correctly
    window.addEventListener("resize", updateTextWrapping);
});

// Ensure text wrapping is handled properly
function updateTextWrapping() {
    // Just ensure the wrapping is respected
    if (heroTitle) {
        heroTitle.style.width = "100%";
    }
}

// More human-like typing delays
function getTypingDelay() {
    // Base typing speed
    let delay = baseDelay;

    // Add some randomness to simulate human typing
    delay *= (0.7 + Math.random() * 0.6);

    // Occasionally add a longer pause (as if thinking)
    if (Math.random() < 0.08) {
        delay *= 3;
    }

    // Add slight pause after punctuation and special characters
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

function initScrollEffects() {
    document.addEventListener(
        "scroll",
        function () {
            const details = document.querySelector("details");
            const sections = document.querySelectorAll(".content section");
            const skillBars = document.querySelectorAll(".skill-bar");

            if (details.open) {
                sections.forEach((section) => section.classList.add("visible"));
                return;
            }

            const buffer = 50;
            const windowHeight = window.innerHeight;

            sections.forEach(function (section) {
                const rect = section.getBoundingClientRect();
                if (rect.top >= 0 - buffer && rect.bottom <= windowHeight + buffer) {
                    section.classList.add("visible");
                } else {
                    section.classList.remove("visible");
                }
            });
        },
        { passive: true }
    );
}