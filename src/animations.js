// Sarah Drasner-style advanced animations

// Placeholder for particle system - now handled by WebGL
function createParticleSystem() {
  // WebGL background handles this now
  console.log('Particle system initialized via WebGL');
}

// Intersection Observer for scroll animations
function setupScrollAnimations() {
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-stagger');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  });

  animatedElements.forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });
}

// Smooth scroll with parallax effect
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// Active nav state
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollY >= (sectionTop - 200)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('text-primary-600', 'font-bold');
      if (link.getAttribute('href').includes(current)) {
        link.classList.add('text-primary-600', 'font-bold');
      }
    });
  });
}

// Navbar background on scroll
function setupNavbarScroll() {
  const navbar = document.getElementById('navbar');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('bg-white', 'shadow-lg');
      navbar.classList.remove('bg-white/90');
    } else {
      navbar.classList.remove('bg-white', 'shadow-lg');
      navbar.classList.add('bg-white/90');
    }
  });
}

// Mouse parallax effect - now integrated with WebGL
function setupMouseParallax() {
  // Mouse tracking is now handled by WebGL shader
  console.log('Mouse parallax initialized via WebGL');
}

// Typewriter effect for hero text
function typewriterEffect() {
  const text = document.querySelector('h1');
  const originalText = text.textContent;
  text.textContent = '';
  text.style.opacity = '1';
  
  let index = 0;
  const type = () => {
    if (index < originalText.length) {
      text.textContent += originalText.charAt(index);
      index++;
      setTimeout(type, 50);
    }
  };
  
  setTimeout(type, 500);
}

// Initialize all animations
document.addEventListener('DOMContentLoaded', () => {
  createParticleSystem();
  setupScrollAnimations();
  setupSmoothScroll();
  updateActiveNav();
  setupNavbarScroll();
  setupMouseParallax();
  
  // Add CSS custom properties for dynamic animations
  const root = document.documentElement;
  
  window.addEventListener('mousemove', (e) => {
    root.style.setProperty('--mouse-x', e.clientX + 'px');
    root.style.setProperty('--mouse-y', e.clientY + 'px');
  });
  
  // Form handler
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);
      console.log('Form submission:', data);
      alert('Thank you for your message! I\'ll get back to you soon.');
      contactForm.reset();
    });
  }
});

// Export for use in other modules
export { createParticleSystem, setupScrollAnimations };