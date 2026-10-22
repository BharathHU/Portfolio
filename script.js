"use strict";

document.documentElement.classList.add("js");

const menuIcon = document.querySelector("#menu-icon");
const navbar = document.querySelector(".navbar");
const header = document.querySelector(".header");
const sections = [...document.querySelectorAll("main section")];
const navLinks = [...document.querySelectorAll(".navbar a")];
const themeToggle = document.querySelector("#theme-toggle");
const progressIndicator = document.querySelector("#scroll-progress");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

function setupHeroLetterReveal() {
  const heading = document.querySelector(".hero-title");
  const lines = [...document.querySelectorAll(".hero-title .hero-line")];
  if (!heading || !lines.length) return;

  const accessibleText = lines.map((line) => line.textContent).join("\n");
  heading.setAttribute("aria-label", accessibleText);
  let lineDelay = 0;
  lines.forEach((line) => {
    const text = line.textContent;
    line.textContent = "";
    line.setAttribute("aria-hidden", "true");
    const words = text.match(/\S+|\s+/g) || [];
    words.forEach((part) => {
      if (/^\s+$/.test(part)) {
        line.append(document.createTextNode(part));
        return;
      }
      const word = document.createElement("span");
      word.className = "hero-word";
      word.textContent = part;
      word.setAttribute("aria-hidden", "true");
      word.style.setProperty("--word-delay", `${lineDelay.toFixed(3)}s`);
      line.append(word);
      lineDelay += 0.1;
    });
    lineDelay += 0.35 + 0.1;
  });

  heading.classList.add("letter-reveal-ready");
  if (!prefersReducedMotion) {
    const replay = () => {
      heading.classList.add("letter-reveal-reset");
      heading.classList.remove("letter-reveal-ready");
      void heading.offsetWidth;
      heading.classList.remove("letter-reveal-reset");
      heading.classList.add("letter-reveal-ready");
      window.setTimeout(replay, 4500);
    };
    window.setTimeout(replay, 4500);
  }
}

setupHeroLetterReveal();

function setupCursorEffects() {
  if (!finePointer || prefersReducedMotion) return;

  const dot = document.createElement("span");
  const ring = document.createElement("span");
  dot.className = "cursor-dot";
  ring.className = "cursor-ring";
  document.body.append(dot, ring);

  let pointerX = window.innerWidth / 2;
  let pointerY = window.innerHeight / 2;
  let ringX = pointerX;
  let ringY = pointerY;
  let frame = 0;
  let lastSpark = 0;

  const moveCursor = (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    dot.style.left = `${pointerX}px`;
    dot.style.top = `${pointerY}px`;

    const interactive = event.target instanceof Element
      ? event.target.closest("a, button, input, textarea, .project-card, .skill-category")
      : null;
    ring.classList.toggle("is-hovering", Boolean(interactive));

    const now = performance.now();
    if (now - lastSpark > 38) {
      lastSpark = now;
      const spark = document.createElement("span");
      spark.className = "cursor-spark";
      spark.style.left = `${pointerX}px`;
      spark.style.top = `${pointerY}px`;
      spark.style.setProperty("--spark-x", `${(Math.random() - .5) * 2.4}rem`);
      spark.style.setProperty("--spark-y", `${(Math.random() - .5) * 2.4}rem`);
      document.body.append(spark);
      window.setTimeout(() => spark.remove(), 500);
    }

    if (!frame) frame = window.requestAnimationFrame(updateRing);
  };

  const updateRing = () => {
    frame = 0;
    ringX += (pointerX - ringX) * .18;
    ringY += (pointerY - ringY) * .18;
    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;
    if (Math.abs(pointerX - ringX) > .1 || Math.abs(pointerY - ringY) > .1) {
      frame = window.requestAnimationFrame(updateRing);
    }
  };

  const createRipple = (event) => {
    const ripple = document.createElement("span");
    ripple.className = "cursor-ripple";
    ripple.style.left = `${event.clientX}px`;
    ripple.style.top = `${event.clientY}px`;
    document.body.append(ripple);
    window.setTimeout(() => ripple.remove(), 600);
  };

  document.addEventListener("pointermove", moveCursor, { passive: true });
  document.addEventListener("click", createRipple);
}

setupCursorEffects();

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
  if (navbar?.classList.contains("active") && !navbar.contains(event.target) && !menuIcon?.contains(event.target)) closeMenu();
});

function updateScrollState() {
  const scrollY = window.scrollY;
  const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
  header?.classList.toggle("sticky", scrollY > 40);
  if (progressIndicator) progressIndicator.style.transform = `scaleX(${documentHeight > 0 ? scrollY / documentHeight : 0})`;
  let activeId = "home";
  sections.forEach((section) => {
    if (scrollY >= section.offsetTop - 190) activeId = section.id;
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

document.body.classList.remove("light-theme");
saveTheme("dark");

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

const typingText = document.querySelector("#typing-text");
if (typingText) {
  const roles = ["Python Development", "Backend Development", "Responsive Webpage Design"];
  let roleIndex = 0;
  let characterIndex = roles[0].length;
  let deleting = true;
  const typeRole = () => {
    if (prefersReducedMotion) {
      typingText.textContent = roles[0];
      return;
    }
    const role = roles[roleIndex];
    typingText.textContent = role.slice(0, characterIndex);
    characterIndex += deleting ? -1 : 1;
    if (characterIndex <= 0) {
      characterIndex = 0;
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    } else if (characterIndex >= role.length) {
      characterIndex = role.length;
      deleting = true;
    }
    window.setTimeout(typeRole, deleting ? 65 : 105);
  };
  window.setTimeout(typeRole, 1300);
}

const revealElements = [...document.querySelectorAll(".reveal")]
  .filter((element) => !element.closest("#skills"));
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

const skillsSection = document.querySelector("#skills");
const skillRows = [...document.querySelectorAll("#skills .skill-row")];
let skillsAnimationFrame = 0;
let skillsAnimationRun = 0;

skillRows.forEach((row) => {
  const label = row.querySelector("b");
  const bar = row.querySelector(".skill-progress i");
  if (label && bar) {
    label.dataset.target = String(Number.parseInt(bar.style.getPropertyValue("--progress") || "0", 10));
    label.textContent = "0%";
  }
});

function resetSkills() {
  if (!skillsSection) return;
  skillsAnimationRun += 1;
  if (skillsAnimationFrame) {
    window.cancelAnimationFrame(skillsAnimationFrame);
    skillsAnimationFrame = 0;
  }
  skillsSection.classList.remove("skills-animated");
  skillsSection.querySelectorAll(".reveal").forEach((element) => element.classList.remove("visible"));
  skillRows.forEach((row) => {
    const label = row.querySelector("b");
    if (label) label.textContent = "0%";
  });
}

function animateSkills() {
  if (!skillsSection) return;
  const animationRun = ++skillsAnimationRun;
  skillsSection.classList.add("skills-animated");

  skillsSection.querySelectorAll(".reveal").forEach((element) => element.classList.add("visible"));
  skillRows.forEach((row, index) => {
    const bar = row.querySelector(".skill-progress i");
    const label = row.querySelector("b");
    const target = Number.parseInt(label?.dataset.target || bar?.style.getPropertyValue("--progress") || "0", 10);
    if (!bar || !label) return;
    label.dataset.target = String(target);
    if (prefersReducedMotion) {
      label.textContent = `${target}%`;
      return;
    }

    const start = performance.now() + index * 45;
    const duration = 950;
    const updateLabel = (now) => {
      if (animationRun !== skillsAnimationRun) return;
      const progress = Math.min(1, Math.max(0, (now - start) / duration));
      label.textContent = `${Math.round(target * progress)}%`;
      if (progress < 1) skillsAnimationFrame = window.requestAnimationFrame(updateLabel);
      else label.textContent = `${target}%`;
    };
    window.requestAnimationFrame(updateLabel);
  });
}

if (skillsSection && prefersReducedMotion) {
  animateSkills();
} else if (skillsSection && "IntersectionObserver" in window) {
  const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateSkills();
      } else {
        resetSkills();
      }
    });
  }, { threshold: .18, rootMargin: "0px 0px -8% 0px" });
  skillsObserver.observe(skillsSection);
} else if (skillsSection) {
  animateSkills();
}

const animatedTimelines = [...document.querySelectorAll("[data-timeline]")];
let timelineFrame = 0;

function updateTimelineAnimations() {
  timelineFrame = 0;
  const viewportTrigger = window.innerHeight * .72;

  animatedTimelines.forEach((timeline) => {
    const timelineRect = timeline.getBoundingClientRect();
    const timelineHeight = timelineRect.height;
    const progress = timelineHeight > 0
      ? Math.min(1, Math.max(0, (viewportTrigger - timelineRect.top) / timelineHeight))
      : 0;

    timeline.style.setProperty("--timeline-progress", String(progress));

    timeline.querySelectorAll(".timeline-item").forEach((item) => {
      const itemRect = item.getBoundingClientRect();
      const markerProgress = timelineHeight > 0
        ? (item.offsetTop + item.querySelector(".timeline-marker").offsetTop) / timelineHeight
        : 0;
      const inView = itemRect.top < window.innerHeight * .9 && itemRect.bottom > window.innerHeight * .1;
      item.classList.toggle("timeline-in-view", inView);
      item.classList.toggle("timeline-reached", progress >= markerProgress);
    });
  });
}

function requestTimelineUpdate() {
  if (!timelineFrame) timelineFrame = window.requestAnimationFrame(updateTimelineAnimations);
}

window.addEventListener("scroll", requestTimelineUpdate, { passive: true });
window.addEventListener("resize", requestTimelineUpdate);
window.addEventListener("load", updateTimelineAnimations, { once: true });
updateTimelineAnimations();

const profileCard = document.querySelector(".profile-card");
const heroVisual = document.querySelector(".hero-visual");
if (heroVisual && profileCard && !coarsePointer && !prefersReducedMotion) {
  heroVisual.addEventListener("pointermove", (event) => {
    const rect = heroVisual.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    profileCard.style.transform = `rotateX(${(y - 0.5) * -8}deg) rotateY(${(x - 0.5) * 10}deg) rotateZ(1deg)`;
    heroVisual.style.setProperty("--mouse-x", `${x * 100}%`);
    heroVisual.style.setProperty("--mouse-y", `${y * 100}%`);
  });
  heroVisual.addEventListener("pointerleave", () => {
    profileCard.style.transform = "";
  });
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
  if (contactForm.dataset.submitting === "true") return;
  const endpoint = contactForm.getAttribute("action")?.trim() || "";
  if (!endpoint || endpoint.includes("REPLACE_WITH_YOUR_FORM_ID")) {
    showMessage("The contact form is not configured yet.", true);
    return;
  }
  contactForm.dataset.submitting = "true";
  const submitButton = contactForm.querySelector("button[type='submit']");
  const originalText = submitButton?.innerHTML || "Send Message";
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.setAttribute("aria-busy", "true");
    submitButton.innerHTML = "Sending… <i class='bx bx-loader-alt bx-spin' aria-hidden='true'></i>";
  }
  try {
    const response = await fetch(endpoint, { method: "POST", body: new FormData(contactForm), headers: { Accept: "application/json" } });
    let result = {};
    try { result = await response.json(); } catch (error) {
      if (!response.ok) throw new Error(`Formspree returned status ${response.status}.`);
    }
    if (!response.ok || result?.errors) throw new Error(`Formspree returned status ${response.status}.`);
    contactForm.reset();
    showMessage("Thanks! Your message was sent successfully.");
  } catch (error) {
    console.error("Contact form submission failed:", error);
    showMessage("Unable to send your message right now. Please try again.", true);
  } finally {
    contactForm.dataset.submitting = "false";
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.removeAttribute("aria-busy");
      submitButton.innerHTML = originalText;
    }
  }
});