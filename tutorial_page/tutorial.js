// Tutorial page scripts
document.addEventListener("DOMContentLoaded", () => {
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  if (hamburgerBtn) {
    hamburgerBtn.addEventListener("click", () => {
      document.body.classList.toggle("nav-open");
      hamburgerBtn.classList.toggle("active");
    });
  }

  const navLinks = document.querySelectorAll(".nav-link");
  if (navLinks.length) {
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        document.body.classList.remove("nav-open");
        if (hamburgerBtn) {
          hamburgerBtn.classList.remove("active");
        }
      });
    });
  }

  const sidebar = document.querySelector(".sidebar");
  document.addEventListener("click", (event) => {
    if (!document.body.classList.contains("nav-open")) {
      return;
    }

    const target = event.target;
    const clickedHamburger = hamburgerBtn && hamburgerBtn.contains(target);
    const clickedSidebar = sidebar && sidebar.contains(target);

    if (!clickedHamburger && !clickedSidebar) {
      document.body.classList.remove("nav-open");
      if (hamburgerBtn) {
        hamburgerBtn.classList.remove("active");
      }
    }
  });
});
