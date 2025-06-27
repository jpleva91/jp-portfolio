// 3D Tilt Card Effect
export class TiltCards {
  constructor() {
    this.cards = [];
    this.init();
  }
  
  init() {
    // Find all project cards and other tiltable elements
    this.cards = document.querySelectorAll('.project-card, .card, .hover-lift');
    
    this.cards.forEach(card => {
      this.addTiltEffect(card);
    });
  }
  
  addTiltEffect(element) {
    // Add preserve-3d to parent container
    element.style.transformStyle = 'preserve-3d';
    element.style.transition = 'transform 0.15s ease-out';
    
    // Create inner glow element
    const glowEl = document.createElement('div');
    glowEl.className = 'tilt-glow';
    element.appendChild(glowEl);
    
    element.addEventListener('mouseenter', (e) => {
      element.style.transition = 'transform 0.15s ease-out';
    });
    
    element.addEventListener('mousemove', (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const percentX = (x - centerX) / centerX;
      const percentY = (y - centerY) / centerY;
      
      // Calculate rotation (max 15 degrees)
      const rotateX = -percentY * 15;
      const rotateY = percentX * 15;
      
      // Apply 3D transform
      element.style.transform = `
        perspective(1000px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        scale3d(1.05, 1.05, 1.05)
      `;
      
      // Move glow effect
      const glow = element.querySelector('.tilt-glow');
      if (glow) {
        glow.style.transform = `translate(${percentX * 30}px, ${percentY * 30}px)`;
        glow.style.opacity = '1';
      }
    });
    
    element.addEventListener('mouseleave', () => {
      element.style.transition = 'transform 0.5s ease-out';
      element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
      
      const glow = element.querySelector('.tilt-glow');
      if (glow) {
        glow.style.opacity = '0';
      }
    });
  }
}

// Initialize on DOM load
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    new TiltCards();
  });
}