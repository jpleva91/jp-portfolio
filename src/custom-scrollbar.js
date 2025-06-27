// Custom Scrollbar with Progress Indicator
export class CustomScrollbar {
  constructor() {
    this.progressBar = null;
    this.scrollPercentage = 0;
    this.init();
  }
  
  init() {
    this.createProgressBar();
    this.bindEvents();
    this.updateProgress();
  }
  
  createProgressBar() {
    // Create progress bar at top of page
    this.progressBar = document.createElement('div');
    this.progressBar.className = 'scroll-progress-bar';
    this.progressBar.innerHTML = `
      <div class="progress-fill"></div>
      <div class="progress-glow"></div>
    `;
    
    document.body.appendChild(this.progressBar);
    
    this.progressFill = this.progressBar.querySelector('.progress-fill');
    this.progressGlow = this.progressBar.querySelector('.progress-glow');
  }
  
  bindEvents() {
    // Update on scroll
    let ticking = false;
    
    const updateOnScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          this.updateProgress();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', updateOnScroll);
    window.addEventListener('resize', updateOnScroll);
  }
  
  updateProgress() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrolled = window.scrollY;
    
    this.scrollPercentage = (scrolled / documentHeight) * 100;
    this.scrollPercentage = Math.min(100, Math.max(0, this.scrollPercentage));
    
    // Update progress bar
    this.progressFill.style.width = `${this.scrollPercentage}%`;
    this.progressGlow.style.width = `${this.scrollPercentage}%`;
    
    // Add/remove classes based on scroll position
    if (this.scrollPercentage > 0) {
      this.progressBar.classList.add('visible');
    } else {
      this.progressBar.classList.remove('visible');
    }
    
    if (this.scrollPercentage >= 99) {
      this.progressBar.classList.add('complete');
    } else {
      this.progressBar.classList.remove('complete');
    }
  }
}

// Custom scrollbar styles (will be injected)
const customScrollbarStyles = `
  /* Custom Scrollbar */
  ::-webkit-scrollbar {
    width: 12px;
    height: 12px;
  }
  
  ::-webkit-scrollbar-track {
    background: #f3f4f6;
    border-radius: 6px;
  }
  
  ::-webkit-scrollbar-thumb {
    background: #0ea5e9;
    border-radius: 6px;
    border: 2px solid #f3f4f6;
    transition: background 0.3s;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: #0284c7;
  }
  
  ::-webkit-scrollbar-thumb:active {
    background: #0369a1;
  }
  
  /* Dark theme scrollbar */
  [data-theme="dark"]::-webkit-scrollbar-track {
    background: #1a1a1a;
  }
  
  [data-theme="dark"]::-webkit-scrollbar-thumb {
    background: #00ffff;
    border-color: #1a1a1a;
  }
  
  [data-theme="dark"]::-webkit-scrollbar-thumb:hover {
    background: #00e5e5;
  }
  
  [data-theme="dark"]::-webkit-scrollbar-thumb:active {
    background: #00cccc;
  }
  
  /* Firefox scrollbar */
  * {
    scrollbar-width: thin;
    scrollbar-color: #0ea5e9 #f3f4f6;
  }
  
  [data-theme="dark"] * {
    scrollbar-color: #00ffff #1a1a1a;
  }
`;

// Initialize on DOM load
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    new CustomScrollbar();
    
    // Inject scrollbar styles
    const styleEl = document.createElement('style');
    styleEl.textContent = customScrollbarStyles;
    document.head.appendChild(styleEl);
  });
}