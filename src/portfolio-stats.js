export class PortfolioStats {
  constructor() {
    this.stats = {
      commits: 1337,
      coffee: 42,
      bugs: 404,
      projects: 23,
      lines: 80085,
      deploys: 99
    };
    
    this.isVisible = false;
    this.updateInterval = null;
    this.init();
  }

  init() {
    this.createUI();
  }

  createUI() {
    // Stats widget
    this.widget = document.createElement('div');
    this.widget.id = 'portfolio-stats';
    this.widget.className = 'fixed bottom-20 left-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 z-40 transition-all duration-500 transform -translate-x-full opacity-0';
    this.widget.innerHTML = `
      <h3 class="text-lg font-bold mb-3 text-gray-900 dark:text-white flex items-center gap-2">
        <span>📊</span> Live Portfolio Stats
      </h3>
      <div class="grid grid-cols-2 gap-3 text-sm">
        <div class="stat-item">
          <div class="text-gray-600 dark:text-gray-400">Commits Today</div>
          <div class="text-2xl font-bold text-primary-600" data-stat="commits">0</div>
        </div>
        <div class="stat-item">
          <div class="text-gray-600 dark:text-gray-400">Coffee Consumed</div>
          <div class="text-2xl font-bold text-amber-600" data-stat="coffee">0</div>
        </div>
        <div class="stat-item">
          <div class="text-gray-600 dark:text-gray-400">Bugs Squashed</div>
          <div class="text-2xl font-bold text-green-600" data-stat="bugs">0</div>
        </div>
        <div class="stat-item">
          <div class="text-gray-600 dark:text-gray-400">Projects Built</div>
          <div class="text-2xl font-bold text-purple-600" data-stat="projects">0</div>
        </div>
        <div class="stat-item">
          <div class="text-gray-600 dark:text-gray-400">Lines of Code</div>
          <div class="text-2xl font-bold text-blue-600" data-stat="lines">0</div>
        </div>
        <div class="stat-item">
          <div class="text-gray-600 dark:text-gray-400">Deployments</div>
          <div class="text-2xl font-bold text-red-600" data-stat="deploys">0</div>
        </div>
      </div>
      <div class="mt-3 text-xs text-gray-500 dark:text-gray-400 italic">
        * Stats may be slightly exaggerated 😉
      </div>
    `;
    
    document.body.appendChild(this.widget);
  }

  toggle() {
    this.isVisible = !this.isVisible;
    
    if (this.isVisible) {
      this.show();
    } else {
      this.hide();
    }
  }

  show() {
    this.widget.classList.remove('-translate-x-full', 'opacity-0');
    this.widget.classList.add('translate-x-0', 'opacity-100');
    
    // Animate numbers counting up
    this.animateStats();
    
    // Start random updates
    this.startUpdates();
  }

  hide() {
    this.widget.classList.add('-translate-x-full', 'opacity-0');
    this.widget.classList.remove('translate-x-0', 'opacity-100');
    
    // Stop updates
    this.stopUpdates();
  }

  animateStats() {
    Object.entries(this.stats).forEach(([key, target]) => {
      const element = this.widget.querySelector(`[data-stat="${key}"]`);
      let current = 0;
      const increment = target / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString();
      }, 20);
    });
  }

  startUpdates() {
    // Random stat updates for fun
    this.updateInterval = setInterval(() => {
      const stats = Object.keys(this.stats);
      const randomStat = stats[Math.floor(Math.random() * stats.length)];
      
      // Increment random stat
      if (randomStat === 'coffee') {
        this.stats[randomStat]++;
      } else if (randomStat === 'bugs') {
        this.stats[randomStat] = Math.max(0, this.stats[randomStat] + (Math.random() > 0.7 ? -1 : 1));
      } else if (randomStat === 'lines') {
        this.stats[randomStat] += Math.floor(Math.random() * 100);
      } else {
        this.stats[randomStat] += Math.random() > 0.8 ? 1 : 0;
      }
      
      // Update display with animation
      const element = this.widget.querySelector(`[data-stat="${randomStat}"]`);
      element.style.transform = 'scale(1.2)';
      element.textContent = this.stats[randomStat].toLocaleString();
      
      setTimeout(() => {
        element.style.transform = 'scale(1)';
      }, 300);
      
    }, 3000);
  }

  stopUpdates() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  // Fun methods to manually update stats
  drinkCoffee() {
    this.stats.coffee++;
    this.updateStat('coffee');
    this.showToast('☕ Coffee consumed!');
  }

  squashBug() {
    this.stats.bugs++;
    this.updateStat('bugs');
    this.showToast('🐛 Bug squashed!');
  }

  ship() {
    this.stats.deploys++;
    this.updateStat('deploys');
    this.showToast('🚀 Deployed to production!');
  }

  updateStat(stat) {
    const element = this.widget.querySelector(`[data-stat="${stat}"]`);
    if (element) {
      element.textContent = this.stats[stat].toLocaleString();
      element.style.transform = 'scale(1.3)';
      setTimeout(() => {
        element.style.transform = 'scale(1)';
      }, 300);
    }
  }

  showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.remove('translate-x-full');
    }, 100);
    
    setTimeout(() => {
      toast.classList.add('translate-x-full');
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  }
}

// Create instance
export const portfolioStats = new PortfolioStats();