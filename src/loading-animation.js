// Loading Animation
export class LoadingAnimation {
  constructor() {
    this.loader = null;
    this.hasLoaded = sessionStorage.getItem('jp-loaded');
    
    // Only show loader on first visit this session
    if (!this.hasLoaded) {
      this.init();
    }
  }
  
  init() {
    // Create loader HTML
    this.createLoader();
    
    // Animate on load
    window.addEventListener('load', () => {
      setTimeout(() => {
        this.animateOut();
      }, 1500);
    });
  }
  
  createLoader() {
    this.loader = document.createElement('div');
    this.loader.className = 'loading-screen';
    this.loader.innerHTML = `
      <div class="loader-content">
        <div class="jp-logo">
          <span class="letter letter-j">J</span>
          <span class="letter letter-p">P</span>
        </div>
        <div class="loader-progress">
          <div class="progress-bar"></div>
        </div>
        <div class="loader-text">Loading portfolio...</div>
      </div>
    `;
    
    document.body.appendChild(this.loader);
    
    // Prevent scroll during loading
    document.body.style.overflow = 'hidden';
    
    // Animate progress bar
    setTimeout(() => {
      const progressBar = this.loader.querySelector('.progress-bar');
      progressBar.style.width = '100%';
    }, 100);
  }
  
  animateOut() {
    // Add exit animation class
    this.loader.classList.add('loading-complete');
    
    // Animate letters
    const letters = this.loader.querySelectorAll('.letter');
    letters.forEach((letter, index) => {
      letter.style.animation = `letterFlyOut 0.6s ${index * 0.1}s ease-in forwards`;
    });
    
    // Remove loader after animation
    setTimeout(() => {
      document.body.style.overflow = '';
      this.loader.remove();
      
      // Mark as loaded for this session
      sessionStorage.setItem('jp-loaded', 'true');
      
      // Trigger entrance animations
      this.triggerEntranceAnimations();
    }, 1000);
  }
  
  triggerEntranceAnimations() {
    // Add loaded class to body
    document.body.classList.add('loaded');
    
    // Trigger any entrance animations
    const animatedElements = document.querySelectorAll('.animate-on-load');
    animatedElements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('animate-in');
      }, index * 100);
    });
  }
}

// Initialize on DOM ready
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    new LoadingAnimation();
  });
}