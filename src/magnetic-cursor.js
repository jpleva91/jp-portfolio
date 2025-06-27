// Magnetic cursor effect inspired by Sarah Drasner
export class MagneticCursor {
  constructor() {
    this.cursor = null;
    this.cursorInner = null;
    this.mouseX = window.innerWidth / 2;
    this.mouseY = window.innerHeight / 2;
    this.cursorX = window.innerWidth / 2;
    this.cursorY = window.innerHeight / 2;
    this.cursorInnerX = window.innerWidth / 2;
    this.cursorInnerY = window.innerHeight / 2;
    this.magneticElements = [];
    this.isVisible = false;
    
    this.init();
  }
  
  init() {
    // Create cursor elements
    this.cursor = document.createElement('div');
    this.cursor.className = 'magnetic-cursor';
    document.body.appendChild(this.cursor);
    
    this.cursorInner = document.createElement('div');
    this.cursorInner.className = 'magnetic-cursor-inner';
    document.body.appendChild(this.cursorInner);
    
    // Hide cursors initially
    this.cursor.style.opacity = '0';
    this.cursorInner.style.opacity = '0';
    
    // Hide default cursor
    document.body.classList.add('magnetic-cursor-active');
    
    // Track mouse movement
    document.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
      
      // Show cursor on first movement
      if (!this.isVisible) {
        this.isVisible = true;
        this.cursor.style.opacity = '1';
        this.cursorInner.style.opacity = '1';
        // Initialize position immediately
        this.cursorX = e.clientX;
        this.cursorY = e.clientY;
        this.cursorInnerX = e.clientX;
        this.cursorInnerY = e.clientY;
      }
    });
    
    // Hide cursor when mouse leaves window
    document.addEventListener('mouseleave', () => {
      this.cursor.style.opacity = '0';
      this.cursorInner.style.opacity = '0';
    });
    
    // Show cursor when mouse enters window
    document.addEventListener('mouseenter', () => {
      if (this.isVisible) {
        this.cursor.style.opacity = '1';
        this.cursorInner.style.opacity = '1';
      }
    });
    
    // Find all magnetic elements
    this.magneticElements = document.querySelectorAll('.hover-lift, .btn-primary, .btn-secondary, .nav-link, a, button');
    
    // Add hover effects
    this.magneticElements.forEach(el => {
      el.addEventListener('mouseenter', () => this.onElementHover(el));
      el.addEventListener('mouseleave', () => this.onElementLeave(el));
      el.addEventListener('mousemove', (e) => this.onElementMove(e, el));
    });
    
    // Start animation loop
    this.animate();
  }
  
  animate() {
    // Smooth cursor following
    const speed = 0.15;
    this.cursorX += (this.mouseX - this.cursorX) * speed;
    this.cursorY += (this.mouseY - this.cursorY) * speed;
    
    const innerSpeed = 0.08;
    this.cursorInnerX += (this.mouseX - this.cursorInnerX) * innerSpeed;
    this.cursorInnerY += (this.mouseY - this.cursorInnerY) * innerSpeed;
    
    // Apply transforms with translate for better performance
    this.cursor.style.transform = `translate(${this.cursorX - 20}px, ${this.cursorY - 20}px)`;
    this.cursorInner.style.transform = `translate(${this.cursorInnerX - 4}px, ${this.cursorInnerY - 4}px)`;
    
    requestAnimationFrame(() => this.animate());
  }
  
  onElementHover(element) {
    this.cursor.classList.add('hover');
    this.cursorInner.classList.add('hover');
    
    // Add magnetic effect class to element
    element.classList.add('magnetic-active');
  }
  
  onElementLeave(element) {
    this.cursor.classList.remove('hover');
    this.cursorInner.classList.remove('hover');
    
    // Remove magnetic effect and reset transform
    element.classList.remove('magnetic-active');
    element.style.transform = '';
  }
  
  onElementMove(e, element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate distance from center
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    
    // Apply magnetic pull
    const strength = 0.3;
    const translateX = deltaX * strength;
    const translateY = deltaY * strength;
    
    element.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) scale(1.05)`;
  }
}

// Initialize on DOM load
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on desktop
    if (window.innerWidth > 768) {
      new MagneticCursor();
    }
  });
}