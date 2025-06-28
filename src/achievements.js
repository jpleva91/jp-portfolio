import { analytics } from './analytics.js';

export class AchievementSystem {
  constructor() {
    this.achievements = {
      explorer: { 
        id: 'explorer', 
        name: 'Explorer', 
        description: 'Visited all sections', 
        icon: '🗺️',
        unlocked: false 
      },
      scholar: { 
        id: 'scholar', 
        name: 'Scholar', 
        description: 'Downloaded resume', 
        icon: '🎓',
        unlocked: false 
      },
      gamer: { 
        id: 'gamer', 
        name: 'Gamer', 
        description: 'Played Tecmo Bowl', 
        icon: '🎮',
        unlocked: false 
      },
      nightowl: { 
        id: 'nightowl', 
        name: 'Night Owl', 
        description: 'Used dark theme', 
        icon: '🦉',
        unlocked: false 
      },
      socialite: { 
        id: 'socialite', 
        name: 'Socialite', 
        description: 'Clicked social links', 
        icon: '🤝',
        unlocked: false 
      },
      curious: { 
        id: 'curious', 
        name: 'Curious Cat', 
        description: 'Opened command palette', 
        icon: '🐱',
        unlocked: false 
      },
      hacker: { 
        id: 'hacker', 
        name: 'Hacker', 
        description: 'Found the terminal', 
        icon: '💻',
        unlocked: false 
      },
      completionist: { 
        id: 'completionist', 
        name: 'Completionist', 
        description: 'Unlocked all achievements', 
        icon: '🏆',
        unlocked: false 
      }
    };
    
    this.visitedSections = new Set();
    this.totalSections = 4; // home, projects, resume, contact
    
    this.loadProgress();
    this.init();
  }

  init() {
    this.createUI();
    this.trackSectionVisits();
    this.setupEventTracking();
  }

  createUI() {
    // Achievement notification container
    const notificationContainer = document.createElement('div');
    notificationContainer.id = 'achievement-notifications';
    notificationContainer.className = 'fixed top-20 right-4 z-50 pointer-events-none';
    document.body.appendChild(notificationContainer);
    
    // Achievement button
    const achievementBtn = document.createElement('button');
    achievementBtn.id = 'achievement-button';
    achievementBtn.className = 'fixed bottom-6 left-6 bg-yellow-500 text-white p-3 rounded-full shadow-lg hover:bg-yellow-600 transition-all duration-300 z-40';
    achievementBtn.innerHTML = `
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path>
      </svg>
      <span class="achievement-count absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">0</span>
    `;
    document.body.appendChild(achievementBtn);
    
    // Achievement modal
    achievementBtn.addEventListener('click', () => this.showAchievements());
  }

  trackSectionVisits() {
    // Use Intersection Observer to track section visits
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          this.visitedSections.add(sectionId);
          
          if (this.visitedSections.size === this.totalSections) {
            this.unlock('explorer');
          }
        }
      });
    }, { threshold: 0.5 });
    
    sections.forEach(section => observer.observe(section));
  }

  setupEventTracking() {
    // Track resume download
    const originalDownload = window.generateResumePDF;
    if (originalDownload) {
      window.generateResumePDF = (...args) => {
        this.unlock('scholar');
        return originalDownload.apply(window, args);
      };
    }
    
    // Track theme changes
    document.addEventListener('themeChanged', (e) => {
      if (e.detail === 'dark') {
        this.unlock('nightowl');
      }
    });
    
    // Track social links
    document.querySelectorAll('a[href*="linkedin"], a[href*="github"]').forEach(link => {
      link.addEventListener('click', () => {
        this.unlock('socialite');
      });
    });
  }

  unlock(achievementId) {
    const achievement = this.achievements[achievementId];
    if (!achievement || achievement.unlocked) return;
    
    achievement.unlocked = true;
    this.saveProgress();
    this.showNotification(achievement);
    this.updateCount();
    analytics.track('Achievement Unlocked', { achievement: achievementId });
    
    // Check for completionist
    const unlockedCount = Object.values(this.achievements).filter(a => a.unlocked && a.id !== 'completionist').length;
    if (unlockedCount === Object.keys(this.achievements).length - 1) {
      setTimeout(() => this.unlock('completionist'), 1000);
    }
  }

  showNotification(achievement) {
    const notification = document.createElement('div');
    notification.className = 'achievement-notification bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 mb-4 transform translate-x-full transition-transform duration-500 pointer-events-auto';
    notification.innerHTML = `
      <div class="flex items-center gap-3">
        <div class="text-3xl">${achievement.icon}</div>
        <div>
          <div class="font-bold text-gray-900 dark:text-white">Achievement Unlocked!</div>
          <div class="text-sm text-gray-600 dark:text-gray-300">${achievement.name}: ${achievement.description}</div>
        </div>
      </div>
    `;
    
    document.getElementById('achievement-notifications').appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.classList.remove('translate-x-full');
      notification.classList.add('translate-x-0');
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
      notification.classList.add('translate-x-full');
      setTimeout(() => notification.remove(), 500);
    }, 4000);
  }

  showAchievements() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
    
    const content = document.createElement('div');
    content.className = 'bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden';
    content.innerHTML = `
      <div class="p-6 border-b dark:border-gray-700">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Achievements</h2>
        <p class="text-gray-600 dark:text-gray-300 mt-1">
          ${Object.values(this.achievements).filter(a => a.unlocked).length} / ${Object.keys(this.achievements).length} unlocked
        </p>
      </div>
      <div class="p-6 overflow-y-auto max-h-[60vh]">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${Object.values(this.achievements).map(achievement => `
            <div class="achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'} 
                        bg-gray-50 dark:bg-gray-700 rounded-lg p-4 transition-all duration-300
                        ${achievement.unlocked ? '' : 'opacity-50 grayscale'}">
              <div class="flex items-center gap-3">
                <div class="text-3xl">${achievement.icon}</div>
                <div class="flex-1">
                  <div class="font-semibold text-gray-900 dark:text-white">${achievement.name}</div>
                  <div class="text-sm text-gray-600 dark:text-gray-300">${achievement.description}</div>
                </div>
                ${achievement.unlocked ? 
                  '<svg class="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>' :
                  '<svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"></path></svg>'
                }
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="p-4 border-t dark:border-gray-700 flex justify-end">
        <button class="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors">
          Close
        </button>
      </div>
    `;
    
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    // Close handlers
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.textContent === 'Close') {
        modal.remove();
      }
    });
  }

  updateCount() {
    const count = Object.values(this.achievements).filter(a => a.unlocked).length;
    document.querySelector('.achievement-count').textContent = count;
  }

  saveProgress() {
    const progress = Object.entries(this.achievements)
      .filter(([_, achievement]) => achievement.unlocked)
      .map(([id]) => id);
    localStorage.setItem('achievements', JSON.stringify(progress));
  }

  loadProgress() {
    const saved = localStorage.getItem('achievements');
    if (saved) {
      const unlockedIds = JSON.parse(saved);
      unlockedIds.forEach(id => {
        if (this.achievements[id]) {
          this.achievements[id].unlocked = true;
        }
      });
      this.updateCount();
    }
  }
}

// Export for other modules to trigger achievements
export const achievements = new AchievementSystem();

// Export functions for global access
if (typeof window !== 'undefined') {
  window.unlockAchievement = (id) => achievements.unlock(id);
  window.trackSectionVisit = (section) => achievements.trackSectionVisit(section);
}

// Make it globally available for easy unlocking
window.unlockAchievement = (id) => achievements.unlock(id);