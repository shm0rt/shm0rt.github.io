document.addEventListener("DOMContentLoaded", function () {
  // Elements
  const pgpKeyLink = document.getElementById("pgpKeyLink");
  const pgpKeyModal = document.getElementById("pgpKeyModal");
  const modalClose = document.querySelector(".modal-close");
  const copyButton = document.getElementById("copyPgpKey");
  const downloadButton = document.getElementById("downloadPgpKey");
  const pgpKeyText = document.querySelector(".pgp-key-text");

  // Add icons to buttons for better visual distinction
  copyButton.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
    Copy
  `;

  downloadButton.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
    Download
  `;

  // Update the H3 title with an icon
  const modalTitle = document.querySelector(".modal-content h3");
  if (modalTitle) {
    modalTitle.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2">
        <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
      </svg>
      PGP Public Key
    `;
  }

  // Check if user has clicked the PGP key before
  const hasClickedPgpKey = localStorage.getItem("hasClickedPgpKey") === "true";

  // Add wiggle animation only if user hasn't clicked before
  if (!hasClickedPgpKey) {
    // Start the wiggle animation after a delay
    setTimeout(() => {
      pgpKeyLink.classList.add("wiggle-animation");
    }, 2000); // Start after 2 seconds
  }

  // Open modal when PGP key link is clicked
  pgpKeyLink.addEventListener("click", function (e) {
    e.preventDefault();

    // Remove wiggle animation when clicked
    pgpKeyLink.classList.remove("wiggle-animation");

    // Remember that user has clicked
    localStorage.setItem("hasClickedPgpKey", "true");

    // Show modal
    pgpKeyModal.style.display = "block";

    // Use setTimeout to trigger the animation after display is set
    setTimeout(() => {
      pgpKeyModal.classList.add("show");
    }, 10);
  });

  // Close modal on clicking the X
  modalClose.addEventListener("click", function () {
    pgpKeyModal.classList.remove("show");

    // Hide the modal after transition completes
    setTimeout(() => {
      pgpKeyModal.style.display = "none";
    }, 300);
  });

  // Close modal when clicking outside the content
  pgpKeyModal.addEventListener("click", function (e) {
    if (e.target === pgpKeyModal) {
      pgpKeyModal.classList.remove("show");

      // Hide the modal after transition completes
      setTimeout(() => {
        pgpKeyModal.style.display = "none";
      }, 300);
    }
  });

  // Copy PGP key to clipboard
  copyButton.addEventListener("click", function () {
    const textToCopy = pgpKeyText.textContent.trim();

    // Use the Clipboard API if available
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          // Give feedback to the user
          const originalText = copyButton.innerHTML;
          copyButton.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 6L9 17l-5-5"></path>
            </svg>
            Copied!
          `;

          // Reset after 2 seconds
          setTimeout(() => {
            copyButton.innerHTML = originalText;
          }, 2000);
        })
        .catch((err) => {
          console.error("Could not copy text: ", err);
        });
    } else {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = textToCopy;
      textarea.style.position = "fixed"; // Avoid scrolling to bottom
      document.body.appendChild(textarea);
      textarea.select();

      try {
        document.execCommand("copy");
        const originalText = copyButton.innerHTML;
        copyButton.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 6L9 17l-5-5"></path>
          </svg>
          Copied!
        `;

        // Reset after 2 seconds
        setTimeout(() => {
          copyButton.innerHTML = originalText;
        }, 2000);
      } catch (err) {
        console.error("Could not copy text: ", err);
      }

      document.body.removeChild(textarea);
    }
  });

  // Prepare download link
  downloadButton.addEventListener("click", function () {
    const textToDownload = pgpKeyText.textContent.trim();
    const dataBlob = new Blob([textToDownload], { type: "text/plain" });
    const url = URL.createObjectURL(dataBlob);

    downloadButton.href = url;

    // Clean up the URL object after the download starts
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 100);
  });
});
