// Advanced Sarah Drasner-style animations

// Initialize GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Custom cursor
class CustomCursor {
  constructor() {
    this.cursor = document.createElement('div');
    this.cursor.className = 'custom-cursor';
    this.cursorFollower = document.createElement('div');
    this.cursorFollower.className = 'custom-cursor-follower';
    
    document.body.appendChild(this.cursor);
    document.body.appendChild(this.cursorFollower);
    
    this.init();
  }
  
  init() {
    document.addEventListener('mousemove', (e) => {
      gsap.to(this.cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0
      });
      
      gsap.to(this.cursorFollower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15
      });
    });
    
    // Hover effects
    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', () => {
        this.cursor.classList.add('hover');
        this.cursorFollower.classList.add('hover');
      });
      
      el.addEventListener('mouseleave', () => {
        this.cursor.classList.remove('hover');
        this.cursorFollower.classList.remove('hover');
      });
    });
  }
}

// SVG Morph animations
function initSVGMorphing() {
  const morphPaths = document.querySelectorAll('.morph-path');
  
  morphPaths.forEach(path => {
    const originalPath = path.getAttribute('d');
    const morphPath = path.getAttribute('data-morph');
    
    gsap.timeline({ repeat: -1, yoyo: true })
      .to(path, {
        attr: { d: morphPath },
        duration: 3,
        ease: "power2.inOut"
      });
  });
}

// Text scramble effect
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#________';
    this.update = this.update.bind(this);
  }
  
  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => this.resolve = resolve);
    this.queue = [];
    
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }
    
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }
  
  update() {
    let output = '';
    let complete = 0;
    
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span class="scramble">${char}</span>`;
      } else {
        output += from;
      }
    }
    
    this.el.innerHTML = output;
    
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
  
  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

// Parallax layers
function initParallax() {
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  
  parallaxElements.forEach(el => {
    const speed = el.getAttribute('data-parallax') || 0.5;
    
    gsap.to(el, {
      y: () => window.innerHeight * speed,
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });
  });
}

// Magnetic buttons
function initMagneticButtons() {
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      gsap.to(btn, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.3,
        ease: "power2.out"
      });
    });
    
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.3,
        ease: "power2.out"
      });
    });
  });
}

// Reveal animations
function initRevealAnimations() {
  // Fade up animation
  gsap.utils.toArray('.fade-up').forEach(el => {
    gsap.from(el, {
      y: 100,
      opacity: 0,
      duration: 1,
      scrollTrigger: {
        trigger: el,
        start: "top 80%",
        once: true
      }
    });
  });
  
  // Scale animation
  gsap.utils.toArray('.scale-in').forEach(el => {
    gsap.from(el, {
      scale: 0.8,
      opacity: 0,
      duration: 1,
      scrollTrigger: {
        trigger: el,
        start: "top 80%",
        once: true
      }
    });
  });
  
  // Stagger children
  gsap.utils.toArray('.stagger-children').forEach(container => {
    const children = container.children;
    
    gsap.from(children, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      scrollTrigger: {
        trigger: container,
        start: "top 80%",
        once: true
      }
    });
  });
}

// Smooth scroll
function initSmoothScroll() {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false
  });
  
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  
  requestAnimationFrame(raf);
}

// 3D tilt effect
function init3DTilt() {
  VanillaTilt.init(document.querySelectorAll('.tilt'), {
    max: 25,
    speed: 400,
    glare: true,
    'max-glare': 0.5
  });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
  // Core animations
  new CustomCursor();
  initSVGMorphing();
  initParallax();
  initMagneticButtons();
  initRevealAnimations();
  
  // Text effects
  document.querySelectorAll('.scramble-text').forEach(el => {
    const scramble = new TextScramble(el);
    const phrases = el.getAttribute('data-phrases').split('|');
    let counter = 0;
    
    const next = () => {
      scramble.setText(phrases[counter]).then(() => {
        setTimeout(next, 2000);
      });
      counter = (counter + 1) % phrases.length;
    };
    
    next();
  });
  
  // Hover distortion effect
  document.querySelectorAll('.distort-hover').forEach(el => {
    el.addEventListener('mouseenter', () => {
      gsap.to(el, {
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out"
      });
    });
    
    el.addEventListener('mouseleave', () => {
      gsap.to(el, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      });
    });
  });
});

// Export functions for use in other scripts
export { TextScramble, initParallax, initMagneticButtons };