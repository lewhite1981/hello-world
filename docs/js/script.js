/* ============================================================
   International Growth – script.js
   Interactions, animations, navigation
   ============================================================ */

/* --- Navbar scroll effect --- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

/* --- Mobile nav toggle --- */
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
// Close menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* --- Smooth scroll for anchor links --- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* --- Intersection Observer: fade-in on scroll --- */
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
};
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

// Add fade-in class to animatable elements
const animatables = document.querySelectorAll(
  '.service-card, .expertise-card, .value-item, .timeline-item, .sector-tag, .about-card'
);
animatables.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = `opacity 0.5s ease ${i * 0.06}s, transform 0.5s ease ${i * 0.06}s`;
  el.classList.add('fade-target');
  fadeObserver.observe(el);
});

// Add visible class via CSS
const styleEl = document.createElement('style');
styleEl.textContent = `.fade-target.visible { opacity: 1 !important; transform: translateY(0) !important; }`;
document.head.appendChild(styleEl);

/* --- Contact form --- */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const btn = this.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<span>Envoi en cours...</span>';

    // Simulate submission (replace with actual API call)
    setTimeout(() => {
      this.innerHTML = `
        <div class="form-success" style="display:block">
          <div style="font-size:2rem;margin-bottom:12px">✓</div>
          <strong>Message envoyé avec succès !</strong><br />
          <span style="font-size:0.9rem;color:var(--text-secondary);font-weight:400">
            Notre équipe vous répondra dans les 24h.
          </span>
        </div>`;
    }, 1200);
  });
}

/* --- Counter animation for stats --- */
function animateCounter(el, target, duration = 1500) {
  const start = performance.now();
  const isFloat = target % 1 !== 0;
  const update = (time) => {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = isFloat ? (target * eased).toFixed(1) : Math.round(target * eased);
    el.textContent = el.dataset.prefix + value + el.dataset.suffix;
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const raw = el.textContent.replace(/[^0-9.]/g, '');
      const suffix = el.textContent.replace(/[0-9.]/g, '').replace('+', '').replace('%', '').trim();
      const hasPlus = el.textContent.includes('+');
      const hasPercent = el.textContent.includes('%');
      const hasx = el.textContent.includes('x');
      el.dataset.prefix = '';
      el.dataset.suffix = hasPercent ? '%' : hasPlus ? '+' : hasx ? 'x' : suffix;
      animateCounter(el, parseFloat(raw));
      statsObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-value, .expertise-number').forEach(el => {
  statsObserver.observe(el);
});

/* --- Active nav link on scroll --- */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a[href^="#"]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) current = section.getAttribute('id');
  });
  navItems.forEach(item => {
    item.style.color = '';
    if (item.getAttribute('href') === `#${current}`) {
      item.style.color = 'var(--text-primary)';
    }
  });
}, { passive: true });
