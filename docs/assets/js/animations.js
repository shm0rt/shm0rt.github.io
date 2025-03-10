// Typing animation and scroll effects
let heroTitle;
let heroText;
let visibleText;
let hiddenText;
let cursor;
let charIndex = 0;
const baseDelay = 40;

// Initialize when DOM is ready
window.addEventListener("DOMContentLoaded", function() {
  // Get hero elements
  heroTitle = document.querySelector(".hero h1");
  heroText = heroTitle.textContent;
  
  // Setup for typing effect - grug way
  heroTitle.innerHTML = ''; // Clear the title
  
  // Create visible text span (starts empty)
  visibleText = document.createElement("span");
  visibleText.className = "visible-text";
  heroTitle.appendChild(visibleText);
  
  // Create cursor
  cursor = document.createElement("span");
  cursor.className = "cursor cursor-typing";
  heroTitle.appendChild(cursor);
  
  // Create hidden text span (starts with full text)
  hiddenText = document.createElement("span");
  hiddenText.className = "hidden-text";
  hiddenText.textContent = heroText;
  heroTitle.appendChild(hiddenText);
  
  // Make sections visible with animation
  setTimeout(function() {
    document.querySelector(".hero h1").classList.add("visible");
    document.querySelector(".hero p").classList.add("visible");
  }, 300);
  
  // Initialize scroll effects
  initScrollEffects();
  
  // Start typing after a short delay
  setTimeout(startTyping, 300);
});

function getTypingDelay() {
  return Math.floor(baseDelay * (0.7 + Math.random() * 0.6));
}

function startTyping() {
  charIndex = 0;
  typeNextChar();
}

function typeNextChar() {
  if (charIndex < heroText.length) {
    // Reveal one more character
    visibleText.textContent = heroText.substring(0, charIndex + 1);
    hiddenText.textContent = heroText.substring(charIndex + 1);
    
    charIndex++;
    setTimeout(typeNextChar, getTypingDelay());
  } else {
    // Animation complete, remove hidden text and start cursor blinking
    hiddenText.remove();
    cursor.classList.remove("cursor-typing");
    
    setTimeout(function() {
      const terminal = document.getElementById("terminalWindow");
      terminal.style.opacity = "1";
      
      // Call printIntro from terminal.js
      if (typeof window.printIntro === 'function') {
        window.printIntro();
      }
    }, 500);
  }
}

function initScrollEffects() {
  document.addEventListener(
    "scroll",
    function() {
      const details = document.querySelector("details");
      const sections = document.querySelectorAll(".content section");

      if (details.open) {
        sections.forEach((section) => section.classList.add("visible"));
        return;
      }

      const buffer = 50;
      const windowHeight = window.innerHeight;

      sections.forEach(function(section) {
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