/**
 * Dr. Felipe Bertucci — Oftalmologista (Londrina/PR)
 * JavaScript de Interatividade, Motion & Acessibilidade
 */

document.addEventListener('DOMContentLoaded', () => {
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ==========================================================================
     1. Header Scroll State
     ========================================================================== */
  const header = document.getElementById('header');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  /* ==========================================================================
     2. Mobile Menu Drawer (Acessível com Teclado e Trava de Scroll)
     ========================================================================== */
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerClose = document.getElementById('drawerClose');
  const drawerLinks = document.querySelectorAll('.drawer-link, .btn-drawer-cta');

  function openDrawer() {
    if (!mobileDrawer || !mobileToggle) return;
    mobileDrawer.classList.add('is-open');
    mobileDrawer.removeAttribute('inert');
    mobileToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    if (drawerClose) drawerClose.focus();
  }

  function closeDrawer() {
    if (!mobileDrawer || !mobileToggle) return;
    mobileDrawer.classList.remove('is-open');
    mobileDrawer.setAttribute('inert', '');
    mobileToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    mobileToggle.focus();
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.contains('is-open');
      if (isOpen) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });
  }

  if (drawerClose) {
    drawerClose.addEventListener('click', closeDrawer);
  }

  drawerLinks.forEach((link) => {
    link.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer && mobileDrawer.classList.contains('is-open')) {
      closeDrawer();
    }
  });

  /* ==========================================================================
     3. Bending Marquee (Inclinação Dinâmica ao Scroll)
     ========================================================================== */
  const marqueeSection = document.querySelector('.marquee-section');
  if (marqueeSection && !isReducedMotion) {
    let lastScrollY = window.scrollY;
    let marqueeTimeout;

    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      // Calcular inclinação baseada na velocidade, limitada entre -2.8deg e 1.8deg
      const tilt = Math.max(Math.min(-0.5 + delta * 0.08, 1.8), -2.8);
      marqueeSection.style.transform = `rotate(${tilt}deg) skewX(${tilt * 0.4}deg)`;

      clearTimeout(marqueeTimeout);
      marqueeTimeout = setTimeout(() => {
        marqueeSection.style.transform = 'rotate(-0.5deg) skewX(0deg)';
      }, 140);
    }, { passive: true });
  }

  /* ==========================================================================
     4. FAQ Accordion (Acessível WCAG)
     ========================================================================== */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const trigger = item.querySelector('.faq-trigger');
    const panel = item.querySelector('.faq-panel');

    if (!trigger || !panel) return;

    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

      // Fechar outros itens abertos para manter visual limpo
      faqItems.forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.classList.remove('is-open');
          const otherTrigger = otherItem.querySelector('.faq-trigger');
          const otherPanel = otherItem.querySelector('.faq-panel');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
          if (otherPanel) otherPanel.hidden = true;
        }
      });

      // Alternar o item clicado
      if (isExpanded) {
        item.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
        panel.hidden = true;
      } else {
        item.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
        panel.hidden = false;
      }
    });
  });

  /* ==========================================================================
     5. Luz Progressiva da Jornada (Timeline Progress)
     ========================================================================== */
  const journeySection = document.getElementById('jornada');
  const timelineProgress = document.getElementById('timelineProgress');
  const journeySteps = document.querySelectorAll('.journey-step');

  if (journeySection && journeySteps.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          journeySteps.forEach((step, index) => {
            setTimeout(() => {
              step.classList.add('is-active');
            }, (index + 1) * 250);
          });
          if (timelineProgress) {
            timelineProgress.style.width = '100%';
          }
        }
      });
    }, { threshold: 0.25 });

    observer.observe(journeySection);
  }

  /* ==========================================================================
     6. GSAP 3 & ScrollTrigger (Animações de Scroll com Fallback Seguro)
     ========================================================================== */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && !isReducedMotion) {
    gsap.registerPlugin(ScrollTrigger);

    // Hero entrance suave
    gsap.from('.hero-portrait-wrap', {
      opacity: 0,
      scale: 0.92,
      duration: 1,
      ease: 'power3.out'
    });

    gsap.from('.hero-title, .hero-subhead, .hero-actions', {
      opacity: 0,
      y: 30,
      duration: 0.9,
      stagger: 0.15,
      ease: 'power3.out',
      delay: 0.2
    });

    // Cards de especialidade com scroll reveal
    const revealCards = document.querySelectorAll('[data-reveal]');
    if (revealCards.length > 0) {
      gsap.from(revealCards, {
        scrollTrigger: {
          trigger: '.specialties-grid',
          start: 'top 80%',
          once: true
        },
        opacity: 0,
        y: 40,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power3.out'
      });
    }

    // Seção Sobre
    if (document.querySelector('.about-container')) {
      gsap.from('.about-frame', {
        scrollTrigger: {
          trigger: '.about-container',
          start: 'top 75%',
          once: true
        },
        opacity: 0,
        x: -40,
        duration: 0.9,
        ease: 'power3.out'
      });

      gsap.from('.about-content-col', {
        scrollTrigger: {
          trigger: '.about-container',
          start: 'top 75%',
          once: true
        },
        opacity: 0,
        x: 40,
        duration: 0.9,
        ease: 'power3.out',
        delay: 0.1
      });
    }

    // Location Card
    if (document.querySelector('.location-card')) {
      gsap.from('.location-card', {
        scrollTrigger: {
          trigger: '.location-card',
          start: 'top 80%',
          once: true
        },
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out'
      });
    }
  }
});
