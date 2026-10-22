"use strict";

const menuIcon = document.querySelector("#menu-icon");
const navbar = document.querySelector(".navbar");
const header = document.querySelector(".header");
const sections = [...document.querySelectorAll("main section")];
const navLinks = [...document.querySelectorAll(".navbar a")];
const themeToggle = document.querySelector("#theme-toggle");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function closeMenu() {
  navbar?.classList.remove("active");
  menuIcon?.classList.remove("is-open");
  menuIcon?.setAttribute("aria-expanded", "false");
  menuIcon?.setAttribute("aria-label", "Open navigation menu");
  const icon = menuIcon?.querySelector("i");
  if (icon) icon.className = "bx bx-menu";
}

menuIcon?.addEventListener("click", () => {
  const open = navbar?.classList.toggle("active") ?? false;
  menuIcon.classList.toggle("is-open", open);
  menuIcon.setAttribute("aria-expanded", String(open));
  menuIcon.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
  const icon = menuIcon.querySelector("i");
  if (icon) icon.className = `bx ${open ? "bx-x" : "bx-menu"}`;
});

navLinks.forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("click", (event) => {
  if (navbar?.classList.contains("active") && !navbar.contains(event.target) && !menuIcon?.contains(event.target)) {
    closeMenu();
  }
});

function updateScrollState() {
  const scrollY = window.scrollY;
  header?.classList.toggle("sticky", scrollY > 40);
  let activeId = "home";
  sections.forEach((section) => {
    if (scrollY >= section.offsetTop - 170) activeId = section.id;
  });
  navLinks.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${activeId}`));
}

window.addEventListener("scroll", updateScrollState, { passive: true });
window.addEventListener("resize", updateScrollState);
updateScrollState();

function getSavedTheme() {
  try {
    return localStorage.getItem("portfolio-theme");
  } catch (error) {
    console.warn("Theme preference could not be read:", error);
    return null;
  }
}

function saveTheme(theme) {
  try {
    localStorage.setItem("portfolio-theme", theme);
  } catch (error) {
    console.warn("Theme preference could not be saved:", error);
  }
}

if (getSavedTheme() === "light") document.body.classList.add("light-theme");

function updateThemeButton() {
  if (!themeToggle) return;
  const light = document.body.classList.contains("light-theme");
  themeToggle.innerHTML = `<i class="bx ${light ? "bx-moon" : "bx-sun"}" aria-hidden="true"></i>`;
  themeToggle.setAttribute("aria-label", light ? "Switch to dark theme" : "Switch to light theme");
  themeToggle.title = light ? "Switch to dark theme" : "Switch to light theme";
}

updateThemeButton();
themeToggle?.addEventListener("click", () => {
  const transition = document.querySelector("#theme-transition");
  if (transition && !prefersReducedMotion) {
    transition.classList.remove("play");
    void transition.offsetWidth;
    transition.classList.add("play");
  }
  document.body.classList.toggle("light-theme");
  saveTheme(document.body.classList.contains("light-theme") ? "light" : "dark");
  updateThemeButton();
});

const revealElements = document.querySelectorAll(
  ".about-content, .about-img, .education-content, .skill-card, .projects-content .content, .certificate-card, .achievement-summary, .contact form"
);
revealElements.forEach((element) => element.classList.add("reveal"));

if ("IntersectionObserver" in window && !prefersReducedMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -45px 0px" });
  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("visible"));
}

const tabButtons = [...document.querySelectorAll(".tab-btn")];
const tabContents = [...document.querySelectorAll(".tab-content")];

function animateProgressBars(tabId) {
  document.getElementById(tabId)?.querySelectorAll(".progress-fill").forEach((fill, index) => {
    fill.style.width = "0%";
    window.setTimeout(() => {
      fill.style.width = `${fill.dataset.width || 0}%`;
    }, prefersReducedMotion ? 0 : 100 + index * 90);
  });
}

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const targetTab = button.dataset.tab;
    tabButtons.forEach((tab) => {
      const active = tab === button;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", String(active));
      tab.setAttribute("tabindex", active ? "0" : "-1");
    });
    tabContents.forEach((content) => content.classList.toggle("active", content.id === targetTab));
    animateProgressBars(targetTab);
  });
});

animateProgressBars("programming");

const statNumbers = document.querySelectorAll(".stat-number");
if ("IntersectionObserver" in window && !prefersReducedMotion) {
  const statsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting || entry.target.dataset.animated) return;
      entry.target.dataset.animated = "true";
      const target = Number(entry.target.dataset.target || entry.target.textContent) || 0;
      const start = performance.now();
      const tick = (now) => {
        const progress = Math.min((now - start) / 900, 1);
        entry.target.textContent = String(Math.floor(progress * target));
        if (progress < 1) window.requestAnimationFrame(tick);
        else entry.target.textContent = String(target);
      };
      window.requestAnimationFrame(tick);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.5 });
  statNumbers.forEach((stat) => statsObserver.observe(stat));
}

const homeVisual = document.querySelector(".home-visual");
const profileFrame = document.querySelector(".profile-frame");
if (homeVisual && profileFrame && !window.matchMedia("(pointer: coarse)").matches && !prefersReducedMotion) {
  homeVisual.addEventListener("mousemove", (event) => {
    const rect = homeVisual.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    profileFrame.style.transform = `rotateX(${y * -7}deg) rotateY(${x * 9}deg) rotateZ(2deg)`;
  });
  homeVisual.addEventListener("mouseleave", () => { profileFrame.style.transform = ""; });
}

function showMessage(text, error = false) {
  const message = document.createElement("div");
  message.className = `toast-message${error ? " error" : ""}`;
  message.setAttribute("role", error ? "alert" : "status");
  const icon = document.createElement("i");
  icon.className = `bx ${error ? "bx-error-circle" : "bx-check-circle"}`;
  icon.setAttribute("aria-hidden", "true");
  const textNode = document.createElement("span");
  textNode.textContent = text;
  message.append(icon, textNode);
  document.body.appendChild(message);
  window.requestAnimationFrame(() => message.classList.add("show"));
  window.setTimeout(() => {
    message.classList.remove("show");
    window.setTimeout(() => message.remove(), 300);
  }, 4000);
}

const contactForm = document.querySelector("#contact-form");
contactForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!contactForm.checkValidity()) {
    contactForm.reportValidity();
    return;
  }

  const emailInput = contactForm.querySelector("[name='email']");
  if (!emailInput || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
    emailInput?.setCustomValidity("Enter a valid email address.");
    contactForm.reportValidity();
    return;
  }
  emailInput.setCustomValidity("");

  const endpoint = contactForm.getAttribute("action")?.trim() || "";
  if (!endpoint || contactForm.dataset.formspreePlaceholder === "true" || endpoint.includes("REPLACE_WITH_YOUR_FORM_ID")) {
    showMessage("Add your real Formspree endpoint before submitting.", true);
    return;
  }

  const submitButton = contactForm.querySelector("button[type='submit']");
  const originalText = submitButton?.innerHTML || "Send Message";
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.setAttribute("aria-busy", "true");
    submitButton.innerHTML = "Sending… <i class='bx bx-loader-alt bx-spin' aria-hidden='true'></i>";
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      body: new FormData(contactForm),
      headers: { Accept: "application/json" }
    });
    let result = {};
    try {
      result = await response.json();
    } catch (error) {
      if (response.ok) console.warn("Formspree returned a non-JSON success response.");
    }
    if (!response.ok || result.errors) {
      throw new Error(`Formspree returned status ${response.status}.`);
    }
    contactForm.reset();
    showMessage("Thanks! Your message was sent successfully.");
  } catch (error) {
    console.error("Contact form submission failed:", error);
    showMessage("Unable to send your message right now. Please try again.", true);
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.removeAttribute("aria-busy");
      submitButton.innerHTML = originalText;
    }
  }
});
