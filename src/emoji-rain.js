export class EmojiRain {
  constructor() {
    this.emojis = ['🌟', '⭐', '✨', '💫', '🌈', '🎉', '🎊', '🎯', '🚀', '💡', '⚡', '🔥', '💎', '🎨', '🎮', '🏆'];
    this.isRaining = false;
    this.rainInterval = null;
    this.drops = [];
  }

  start(duration = 5000, intensity = 'medium') {
    if (this.isRaining) return;
    
    this.isRaining = true;
    const delays = {
      light: 200,
      medium: 100,
      heavy: 50,
      storm: 25
    };
    
    const delay = delays[intensity] || 100;
    
    // Create emoji drops
    this.rainInterval = setInterval(() => {
      this.createDrop();
    }, delay);
    
    // Stop after duration
    setTimeout(() => this.stop(), duration);
    
    // Show notification
    this.showNotification(`${this.getRandomEmoji()} Emoji rain started!`);
  }

  stop() {
    if (!this.isRaining) return;
    
    this.isRaining = false;
    clearInterval(this.rainInterval);
    
    // Let existing drops finish falling
    setTimeout(() => {
      this.drops.forEach(drop => drop.remove());
      this.drops = [];
    }, 3000);
  }

  createDrop() {
    const drop = document.createElement('div');
    drop.className = 'emoji-drop fixed text-2xl pointer-events-none z-50';
    drop.style.left = Math.random() * window.innerWidth + 'px';
    drop.style.top = '-50px';
    drop.style.animation = `emoji-fall ${3 + Math.random() * 2}s linear`;
    drop.style.fontSize = (20 + Math.random() * 20) + 'px';
    drop.textContent = this.getRandomEmoji();
    
    // Add rotation
    const rotation = Math.random() * 360;
    drop.style.transform = `rotate(${rotation}deg)`;
    
    document.body.appendChild(drop);
    this.drops.push(drop);
    
    // Remove when animation completes
    drop.addEventListener('animationend', () => {
      drop.remove();
      const index = this.drops.indexOf(drop);
      if (index > -1) {
        this.drops.splice(index, 1);
      }
    });
  }

  getRandomEmoji() {
    return this.emojis[Math.floor(Math.random() * this.emojis.length)];
  }

  celebrate() {
    // Special celebration mode
    const celebrationEmojis = ['🎉', '🎊', '🎈', '🎆', '🎇', '✨', '🌟', '💖'];
    const originalEmojis = [...this.emojis];
    this.emojis = celebrationEmojis;
    
    this.start(3000, 'heavy');
    
    // Restore original emojis
    setTimeout(() => {
      this.emojis = originalEmojis;
    }, 3000);
  }

  showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-6 py-3 rounded-lg shadow-lg z-50';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.transition = 'opacity 0.5s';
      notification.style.opacity = '0';
      setTimeout(() => notification.remove(), 500);
    }, 2000);
  }

  // Create animation styles
  static init() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes emoji-fall {
        0% {
          transform: translateY(0) rotate(0deg);
          opacity: 1;
        }
        90% {
          opacity: 1;
        }
        100% {
          transform: translateY(calc(100vh + 100px)) rotate(360deg);
          opacity: 0;
        }
      }
      
      .emoji-drop {
        will-change: transform;
        animation-timing-function: linear;
      }
    `;
    document.head.appendChild(style);
  }
}

// Initialize styles
EmojiRain.init();

// Export instance
export const emojiRain = new EmojiRain();