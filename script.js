const menuIcon = document.querySelector("#menu-icon");
const navbar = document.querySelector(".navbar");
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("header nav a");
const themeToggle = document.querySelector("#theme-toggle");
const themeTransition = document.querySelector("#theme-transition");

// Mobile navigation
if (menuIcon && navbar) {
  menuIcon.addEventListener("click", () => {
    menuIcon.classList.toggle("bx-x");
    navbar.classList.toggle("active");
  });
}

// Close mobile menu after selecting a section
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    menuIcon?.classList.remove("bx-x");
    navbar?.classList.remove("active");
  });
});

// Active navigation + sticky header
function updateScrollState() {
  const scrollY = window.scrollY;
  const header = document.querySelector("header");

  sections.forEach((section) => {
    const top = section.offsetTop - 130;
    const bottom = top + section.offsetHeight;
    const id = section.getAttribute("id");

    if (scrollY >= top && scrollY < bottom) {
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
      });
    }
  });

  header?.classList.toggle("sticky", scrollY > 40);
}

window.addEventListener("scroll", updateScrollState, { passive: true });
updateScrollState();

// Dark / Light theme with animated transition
const savedTheme = localStorage.getItem("portfolio-theme");
if (savedTheme === "light") document.body.classList.add("light-theme");

function updateThemeButton() {
  if (!themeToggle) return;
  const isLight = document.body.classList.contains("light-theme");
  themeToggle.innerHTML = `<i class='bx ${isLight ? "bx-moon" : "bx-sun"}'></i>`;
  themeToggle.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
  themeToggle.title = isLight ? "Switch to dark theme" : "Switch to light theme";
}

updateThemeButton();

themeToggle?.addEventListener("click", () => {
  themeTransition?.classList.remove("play");
  void themeTransition?.offsetWidth;
  themeTransition?.classList.add("play");

  document.body.classList.toggle("light-theme");
  localStorage.setItem(
    "portfolio-theme",
    document.body.classList.contains("light-theme") ? "light" : "dark"
  );
  updateThemeButton();
});

// Reveal cards and timeline items on scroll
const revealElements = document.querySelectorAll(
  ".about-content, .about-img, .education-content, .skill-card, .projects-content .content, .certificate-card, .achievement-summary, .contact form"
);

revealElements.forEach((element) => element.classList.add("reveal"));

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -45px 0px" }
);

revealElements.forEach((element) => revealObserver.observe(element));

// Skills tabs + progress animation
const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

function animateProgressBars(tabId) {
  const activeTab = document.getElementById(tabId);
  if (!activeTab) return;

  activeTab.querySelectorAll(".progress-fill").forEach((fill, index) => {
    const width = fill.getAttribute("data-width") || "0";
    fill.style.width = "0%";
    setTimeout(() => {
      fill.style.width = `${width}%`;
    }, 100 + index * 90);
  });
}

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const targetTab = button.getAttribute("data-tab");
    tabButtons.forEach((btn) => btn.classList.toggle("active", btn === button));
    tabContents.forEach((content) => content.classList.remove("active"));

    const targetContent = document.getElementById(targetTab);
    if (targetContent) {
      targetContent.classList.add("active");
      animateProgressBars(targetTab);
    }
  });
});

setTimeout(() => animateProgressBars("programming"), 450);

// Achievement counters
const statNumbers = document.querySelectorAll(".stat-number");
const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting || entry.target.dataset.animated) return;
      const target = Number.parseInt(entry.target.textContent, 10) || 0;
      entry.target.dataset.animated = "true";

      let current = 0;
      const duration = 900;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        current = Math.floor(progress * target);
        entry.target.textContent = current;
        if (progress < 1) requestAnimationFrame(tick);
        else entry.target.textContent = target;
      }
      requestAnimationFrame(tick);
    });
  },
  { threshold: 0.5 }
);
statNumbers.forEach((stat) => statsObserver.observe(stat));

// Subtle mouse depth effect for the hero visual
const homeVisual = document.querySelector(".home-visual");
const profileFrame = document.querySelector(".profile-frame");
if (homeVisual && profileFrame && !window.matchMedia("(pointer: coarse)").matches) {
  homeVisual.addEventListener("mousemove", (event) => {
    const rect = homeVisual.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    profileFrame.style.transform = `rotateX(${y * -7}deg) rotateY(${x * 9}deg) rotateZ(2deg)`;
  });
  homeVisual.addEventListener("mouseleave", () => {
    profileFrame.style.transform = "rotate(4deg)";
  });
}

// Contact form: keep AJAX behavior and show a polished status message.
const contactForm = document.querySelector(".contact form");

if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!contactForm.action || contactForm.action === window.location.href) {
      showMessage("Please connect the form to a Formspree endpoint first.", true);
      return;
    }

    const submitButton = contactForm.querySelector("button[type='submit']");
    const originalText = submitButton?.innerHTML;
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.innerHTML = "Sending... <i class='bx bx-loader-alt bx-spin'></i>";
    }

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { Accept: "application/json" }
      });

      if (!response.ok) throw new Error("Request failed");
      contactForm.reset();
      showMessage("Message sent successfully!");
    } catch (error) {
      showMessage("Something went wrong. Please try again.", true);
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = originalText || "Send Message";
      }
    }
  });
}

function showMessage(text, error = false) {
  const message = document.createElement("div");
  message.className = `toast-message${error ? " error" : ""}`;
  message.innerHTML = `<i class='bx ${error ? "bx-error-circle" : "bx-check-circle"}'></i>${text}`;
  document.body.appendChild(message);
  setTimeout(() => message.classList.add("show"), 20);
  setTimeout(() => {
    message.classList.remove("show");
    setTimeout(() => message.remove(), 300);
  }, 3000);
}

// Toast styles are injected here so no extra stylesheet is required.
const extraStyle = document.createElement("style");
extraStyle.textContent = `
.toast-message{position:fixed;right:2rem;top:2rem;z-index:10000;display:flex;align-items:center;gap:.8rem;padding:1.2rem 1.5rem;border:1px solid rgba(255,255,255,.12);border-radius:12px;background:#171a20;color:#fff;box-shadow:0 18px 50px rgba(0,0,0,.28);font:600 1.3rem Inter,sans-serif;transform:translateY(-15px);opacity:0;transition:.3s ease}.toast-message.show{transform:none;opacity:1}.toast-message i{font-size:1.8rem;color:#e7a84b}.toast-message.error i{color:#ef6a6a}.toast-message button{cursor:pointer}.toast-message + *{}body.light-theme .toast-message{background:#fffdfa;color:#17191d;border-color:rgba(20,25,30,.1)}
`;
document.head.appendChild(extraStyle);
