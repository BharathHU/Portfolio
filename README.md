# Bharath H U | Personal Portfolio

A modern, responsive personal portfolio website showcasing my skills, education, projects, and certifications as a Full Stack Developer. Built with plain HTML, CSS, and JavaScript — no build tools or frameworks required.

🔗 **Live Demo:** _[add your deployed link here, e.g. GitHub Pages / Netlify / Vercel URL]_

## ✨ Features

- **Responsive design** — works across desktop, tablet, and mobile devices
- **Dark / Light theme toggle** with animated transition and persisted preference (`localStorage`)
- **Sticky, animated navigation bar** with active-section highlighting on scroll
- **Mobile hamburger menu** for small screens
- **Animated hero section** with a floating tech-stack visual and subtle mouse-tracking depth effect
- **Scroll-reveal animations** for sections and cards using the `IntersectionObserver` API
- **Tabbed, animated skills section** (Programming, Web Development, Tools, Soft Skills) with progress bars
- **Animated statistic counters** (e.g., years of experience, projects completed)
- **Projects showcase** with descriptions, tech stacks, and links to live demos / GitHub repos
- **Certificates gallery** grouped by category with an image overlay "View Certificate" action
- **Contact form** wired to [Formspree](https://formspree.io/) via `fetch`, with success/error toast notifications
- **Social links** for GitHub, LinkedIn, Instagram, and email

## 🛠️ Tech Stack

- **HTML5** — semantic page structure (`index.html`)
- **CSS3** — custom styling, theming, and animations (`style.css`)
- **JavaScript (Vanilla)** — interactivity, theming, scroll effects, and form handling (`script.js`)
- **[Boxicons](https://boxicons.com/)** — icon library (loaded via CDN)
- **[Formspree](https://formspree.io/)** — backend-less contact form submission handling

## 📁 Project Structure

```
personal-portfolio/
├── index.html                  # Main HTML page with all sections
├── style.css                   # Styling, themes, layout, and animations
├── script.js                   # Navigation, theming, animations, and contact form logic
├── bb.png                      # Hero profile image
├── profile.jpeg                # About section profile photo
├── Full Stack Certificate.png   # Certificate image
├── MERN Certificate.png         # Certificate image
└── README.md                   # Project documentation
```

Only assets referenced by the live page are kept in the project root. Private recovery codes
and unused image files are intentionally excluded from the portfolio directory.

## 🚀 Getting Started

No build step, package manager, or dependencies are required — this is a static site.

### Run locally

1. Clone the repository:
   ```bash
   git clone https://github.com/BharathHU/Portfolio.git
   cd Portfolio
   ```
2. Open `index.html` directly in your browser, **or** serve it with a local dev server for the best experience (recommended so relative paths and CORS behave correctly):
   ```bash
   # Using VS Code Live Server extension, or
   npx serve .
   # or
   python -m http.server 5500
   ```
3. Visit `http://localhost:5500` (or the port shown) in your browser.

### Configure the contact form

The contact form (`#contact-form`) submits asynchronously via `fetch` to the configured Formspree endpoint. It validates required fields, prevents duplicate submissions, shows a loading state, and only clears the form after Formspree confirms a successful response.

1. Create an account or sign in at [formspree.io](https://formspree.io/).
2. Create a new form and set the destination/notification email to **bharathhubharath@gmail.com** in the Formspree dashboard.
3. Copy the endpoint Formspree provides. It will look like:
   ```html
   https://formspree.io/f/your-form-id
   ```
4. In `index.html`, replace `REPLACE_WITH_YOUR_FORM_ID` in the form action:
   ```html
   <form id="contact-form" action="https://formspree.io/f/your-form-id" method="POST" novalidate>
   ```
5. Remove `data-formspree-placeholder="true"` from that same form tag. This prevents the placeholder from being submitted accidentally.

The JavaScript uses `fetch()` and `FormData`, disables the submit button while sending, clears the form only after a confirmed successful response, and reports network or non-2xx responses as errors. The email recipient is configured in Formspree, not by placing an email address in the endpoint URL.
3. If you replace the endpoint with an invalid or placeholder URL, submitting the form will show an error toast instead of reporting success.

## 📦 Deployment

Since this is a static site, it can be deployed on any static hosting provider, for example:

- **GitHub Pages** — enable Pages on the repository, pointing to the `main` branch root.
- **Netlify** — drag-and-drop the folder or connect the GitHub repo.
- **Vercel** — import the repo as a static project.

## 📄 Sections Overview

| Section          | Description                                                                 |
| ----------------- | ---------------------------------------------------------------------------- |
| **Home**          | Introduction, role, CV link, and social/contact links                        |
| **About**         | Short bio and professional summary                                           |
| **Education**     | Academic journey — Bachelor's, Higher Secondary, and Secondary schooling      |
| **Skills**        | Tabbed skills with progress bars — Programming, Web Dev, Tools, Soft Skills   |
| **Projects**      | Featured projects with tech stack and links to demos/repos                   |
| **Certificates**  | Internship and achievement certificates grouped by category                  |
| **Contact**       | Contact form for inquiries, opportunities, and collaboration                 |

## 👤 Author

**Bharath H U**

- GitHub: [@BharathHU](https://github.com/BharathHU)
- LinkedIn: [Bharath H U](https://www.linkedin.com/in/bharath-h-u-658446313)
- Instagram: [@bharath_h_u_07](https://www.instagram.com/bharath_h_u_07)
- Email: [bharathhubharath@gmail.com](mailto:bharathhubharath@gmail.com)

## 📝 License

Copyright © 2026 Bharath H U. All Rights Reserved.
