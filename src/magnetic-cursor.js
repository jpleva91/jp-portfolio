// Magnetic cursor effect inspired by Sarah Drasner
export class MagneticCursor {
  constructor() {
    this.cursor = null;
    this.cursorInner = null;
    this.mouseX = 0;
    this.mouseY = 0;
    this.cursorX = 0;
    this.cursorY = 0;
    this.cursorInnerX = 0;
    this.cursorInnerY = 0;
    this.magneticElements = [];
    
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
    
    // Hide default cursor
    document.body.classList.add('magnetic-cursor-active');
    
    // Track mouse movement
    document.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
      
      // Initialize cursor position on first move
      if (!this.cursorX && !this.cursorY) {
        this.cursorX = e.clientX;
        this.cursorY = e.clientY;
        this.cursorInnerX = e.clientX;
        this.cursorInnerY = e.clientY;
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
    
    // Apply transforms
    this.cursor.style.transform = `translate3d(${this.cursorX}px, ${this.cursorY}px, 0)`;
    this.cursorInner.style.transform = `translate3d(${this.cursorInnerX}px, ${this.cursorInnerY}px, 0)`;
    
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