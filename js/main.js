/* ======================================================
   REDDY TOURS & TRAVELS — main.js
   Interactive behaviour: navbar, particles, reveal,
   booking form → WhatsApp, contact form → WhatsApp,
   mobile menu, toast notifications.
   ====================================================== */

'use strict';

const PHONE = '919860013081';
const WA_BASE = `https://wa.me/${PHONE}?text=`;

/* =============================================
   NAVBAR — scroll behaviour + mobile menu
   ============================================= */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  updateActiveNavLink();
}, { passive: true });

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

// Close mobile menu when a nav link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.scrollY + 120;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.id;
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) {
      link.classList.toggle('active', scrollY >= top && scrollY < top + height);
    }
  });
}

/* =============================================
   HERO PARTICLES
   ============================================= */
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const count = window.innerWidth < 768 ? 20 : 40;
  const colors = ['#ff6b00', '#ff2d2d', '#7c3aed', '#ffc13b', '#00c853'];

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    const size = Math.random() * 4 + 2;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      --dur: ${Math.random() * 8 + 5}s;
      --delay: ${Math.random() * -10}s;
    `;
    container.appendChild(p);
  }
}
createParticles();

/* =============================================
   SCROLL REVEAL ANIMATION
   ============================================= */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const delay = parseInt(el.dataset.delay || '0', 10);
      setTimeout(() => el.classList.add('visible'), delay);
      revealObserver.unobserve(el);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* =============================================
   TOAST NOTIFICATION
   ============================================= */
function showToast(msg = 'Opening WhatsApp for your booking...') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.querySelector('span').textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

/* =============================================
   QUICK BOOKING FORM → WhatsApp
   ============================================= */
function handleBooking(e) {
  e.preventDefault();
  const form = e.target;
  const data = new FormData(form);

  const service  = data.get('service')  || 'Not specified';
  const from     = data.get('from')     || '';
  const to       = data.get('to')       || '';
  const date     = data.get('date')     || '';
  const phone    = data.get('phone')    || '';

  const serviceLabel = form.querySelector(`select[name="service"] option[value="${service}"]`)?.textContent || service;

  const msg = `🚗 *Cab Booking Request — Reddy Tours & Travels*

📋 *Service:* ${serviceLabel}
📍 *From:* ${from}
🏁 *To:* ${to}
📅 *Date:* ${date}
📱 *Contact:* ${phone}

Please confirm availability and share the fare details. Thank you!`;

  const url = WA_BASE + encodeURIComponent(msg);
  showToast();
  setTimeout(() => window.open(url, '_blank'), 400);
  form.reset();
}

/* =============================================
   CONTACT ENQUIRY FORM → WhatsApp
   ============================================= */
function handleContactForm(e) {
  e.preventDefault();
  const form = e.target;
  const inputs = form.querySelectorAll('input, select, textarea');
  const name    = inputs[0].value.trim();
  const mobile  = inputs[1].value.trim();
  const service = inputs[2].options[inputs[2].selectedIndex]?.text || '';
  const desc    = inputs[3].value.trim();

  const msg = `📩 *Travel Enquiry — Reddy Tours & Travels*

👤 *Name:* ${name}
📱 *Mobile:* ${mobile}
🛎️ *Service:* ${service}
📝 *Requirement:* ${desc}

Kindly get back to me at your earliest convenience. Thank you!`;

  const url = WA_BASE + encodeURIComponent(msg);
  showToast('Sending your enquiry via WhatsApp...');
  setTimeout(() => window.open(url, '_blank'), 400);
  form.reset();
}

/* =============================================
   SMOOTH SCROLL — override for anchor links
   ============================================= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* =============================================
   COUNTER ANIMATION (stats in hero)
   ============================================= */
function animateCounter(el, target, suffix = '') {
  const duration = 1800;
  const start = performance.now();
  const isFloat = target % 1 !== 0;

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const value = isFloat
      ? (target * ease).toFixed(1)
      : Math.floor(target * ease);
    el.textContent = value + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const nums = entry.target.querySelectorAll('.stat-num');
      nums.forEach(num => {
        const raw = num.textContent.trim();
        const suffix = raw.replace(/[\d.]/g, '');
        const val = parseFloat(raw.replace(/[^\d.]/g, ''));
        if (!isNaN(val)) animateCounter(num, val, suffix);
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

/* =============================================
   SET MIN DATE on booking form to today
   ============================================= */
const dateInput = document.querySelector('input[type="date"]');
if (dateInput) {
  const today = new Date().toISOString().split('T')[0];
  dateInput.min = today;
  dateInput.value = today;
}

/* =============================================
   PARALLAX on hero bg (desktop only)
   ============================================= */
if (window.innerWidth > 768) {
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const heroGrad = document.querySelector('.hero-gradient');
        if (heroGrad && y < window.innerHeight) {
          heroGrad.style.transform = `translateY(${y * 0.3}px)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* =============================================
   TILT EFFECT on service cards (desktop)
   ============================================= */
if (window.innerWidth > 1024) {
  document.querySelectorAll('.service-card, .pkg-card, .why-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}
