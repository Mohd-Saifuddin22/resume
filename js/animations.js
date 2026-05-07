/**
 * GSAP ScrollTrigger Animations
 * Scroll-based micro-animations and load animations
 */

(function() {
  'use strict';

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    // Show all elements immediately without animation
    document.querySelectorAll('.hero-name, .hero-tagline, .hero-cta, .hero-socials, .section-content, .skill-card, .experience-card, .project-card, .leadership-card, .education-card, .contact-item').forEach(function(el) {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  // Load GSAP and ScrollTrigger from CDN
  function loadGSAP() {
    return new Promise(function(resolve, reject) {
      var script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js';
      script.onload = function() {
        var scrollScript = document.createElement('script');
        scrollScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js';
        scrollScript.onload = function() {
          resolve();
        };
        scrollScript.onerror = reject;
        document.head.appendChild(scrollScript);
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  function initAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // Hero load animations - set immediately to avoid rendering issues
    var heroElements = document.querySelectorAll('.hero-name, .hero-tagline, .hero-cta, .hero-socials');
    heroElements.forEach(function(el) {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });

    // Section scroll animations - use set instead of from to avoid opacity stacking issues
    var sections = ['#skills', '#experience', '#projects', '#education', '#leadership', '#contact'];

    sections.forEach(function(sectionId) {
      var section = document.querySelector(sectionId);
      if (!section) return;

      var content = section.querySelector('.section-content');
      if (!content) return;

      // Reveal content without opacity animation to avoid rendering bugs
      content.style.opacity = '1';
      content.style.transform = 'none';

      // Stagger children
      var children = content.querySelectorAll('.skill-card, .experience-card, .project-card, .leadership-card, .education-card, .contact-item, .btn');
      if (children.length) {
        children.forEach(function(child) {
          child.style.opacity = '1';
          child.style.transform = 'none';
        });
      }
    });

    // Refresh ScrollTrigger after animations set up
    ScrollTrigger.refresh();
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      loadGSAP()
        .then(initAnimations)
        .catch(function(err) {
          console.warn('GSAP failed to load:', err);
        });
    });
  } else {
    loadGSAP()
      .then(initAnimations)
      .catch(function(err) {
        console.warn('GSAP failed to load:', err);
      });
  }
})();