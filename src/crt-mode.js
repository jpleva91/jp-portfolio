export class CRTMode {
  constructor() {
    this.isActive = false;
    this.init();
  }

  init() {
    this.createStyles();
    this.createToggleButton();
  }

  createStyles() {
    const style = document.createElement('style');
    style.id = 'crt-styles';
    style.textContent = `
      .crt-mode {
        position: relative;
        overflow: hidden;
      }
      
      .crt-mode::before {
        content: "";
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: 
          repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.15),
            rgba(0, 0, 0, 0.15) 1px,
            transparent 1px,
            transparent 2px
          );
        pointer-events: none;
        z-index: 100;
        animation: crt-scanlines 8s linear infinite;
      }
      
      .crt-mode::after {
        content: "";
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(
          ellipse at center,
          rgba(0, 0, 0, 0) 0%,
          rgba(0, 0, 0, 0.2) 70%,
          rgba(0, 0, 0, 0.4) 100%
        );
        pointer-events: none;
        z-index: 101;
      }
      
      @keyframes crt-scanlines {
        0% {
          transform: translateY(0);
        }
        100% {
          transform: translateY(10px);
        }
      }
      
      .crt-mode * {
        text-shadow: 
          0 0 1px rgba(0, 255, 0, 0.8),
          0 0 2px rgba(0, 255, 0, 0.6),
          0 0 3px rgba(0, 255, 0, 0.4);
      }
      
      .crt-mode img,
      .crt-mode video,
      .crt-mode canvas {
        filter: contrast(1.1) brightness(1.1);
      }
      
      .crt-flicker {
        animation: crt-flicker 0.15s infinite;
      }
      
      @keyframes crt-flicker {
        0%, 100% {
          opacity: 1;
        }
        50% {
          opacity: 0.95;
        }
      }
      
      .crt-mode.green-phosphor {
        filter: sepia(1) hue-rotate(90deg) saturate(2) contrast(1.2);
      }
      
      .crt-mode.amber-phosphor {
        filter: sepia(1) saturate(2) contrast(1.2);
      }
      
      /* Curve effect for full retro */
      .crt-curve .crt-mode::before,
      .crt-curve .crt-mode::after {
        border-radius: 50% / 3%;
        transform: scale(1.05);
      }
      
      /* Static noise effect */
      .crt-static::before {
        content: "";
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" /></filter><rect width="100%" height="100%" filter="url(%23noise)" opacity="0.02"/></svg>');
        pointer-events: none;
        z-index: 102;
        opacity: 0.03;
        animation: crt-static 0.5s steps(10) infinite;
      }
      
      @keyframes crt-static {
        0%, 100% {
          transform: translate(0, 0);
        }
        10% {
          transform: translate(-1%, -1%);
        }
        20% {
          transform: translate(1%, 1%);
        }
        30% {
          transform: translate(-1%, 1%);
        }
        40% {
          transform: translate(1%, -1%);
        }
        50% {
          transform: translate(-1%, 0);
        }
        60% {
          transform: translate(1%, 0);
        }
        70% {
          transform: translate(0, -1%);
        }
        80% {
          transform: translate(0, 1%);
        }
        90% {
          transform: translate(1%, 1%);
        }
      }
    `;
    document.head.appendChild(style);
  }

  createToggleButton() {
    // Add CRT mode to command palette instead of a separate button
    if (window.commandPalette) {
      // Will be added through command palette
      return;
    }
  }

  toggle() {
    this.isActive = !this.isActive;
    if (this.isActive) {
      document.body.classList.add('crt-mode', 'crt-curve', 'green-phosphor');
      setTimeout(() => {
        document.body.classList.add('crt-static');
      }, 100);
      this.showNotification('📺 CRT Mode Activated');
    } else {
      document.body.classList.remove('crt-mode', 'crt-curve', 'green-phosphor', 'amber-phosphor', 'crt-static');
      this.showNotification('💻 Modern Mode Restored');
    }
  }

  setPhosphor(type) {
    document.body.classList.remove('green-phosphor', 'amber-phosphor');
    if (type && this.isActive) {
      document.body.classList.add(`${type}-phosphor`);
    }
  }

  showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 bg-black text-green-400 px-6 py-3 rounded shadow-lg z-50 font-mono';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.transition = 'opacity 0.5s';
      notification.style.opacity = '0';
      setTimeout(() => notification.remove(), 500);
    }, 2000);
  }
}

// Initialize CRT mode
export const crtMode = new CRTMode();