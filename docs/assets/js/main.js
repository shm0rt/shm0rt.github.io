// Add loading class initially, remove when DOM is ready
document.documentElement.classList.add("loading");
window.addEventListener("DOMContentLoaded", () => {
  document.documentElement.classList.remove("loading");
});
