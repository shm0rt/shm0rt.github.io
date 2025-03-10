document.documentElement.classList.add("loading");

window.addEventListener("DOMContentLoaded", function () {
  // Show page content
  document.documentElement.classList.remove("loading");
});