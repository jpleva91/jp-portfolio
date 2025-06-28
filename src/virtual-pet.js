export class VirtualPet {
  constructor() {
    this.name = 'Pixel';
    this.x = window.innerWidth - 100;
    this.y = window.innerHeight - 100;
    this.targetX = this.x;
    this.targetY = this.y;
    this.mood = 'happy'; // happy, sleepy, excited, curious
    this.isMoving = false;
    this.moveInterval = null;
    this.interactionCount = 0;
    
    this.frames = {
      idle: ['🐱', '😺'],
      happy: ['😸', '😹'],
      sleepy: ['😴', '😪'],
      excited: ['🙀', '😻'],
      curious: ['🙀', '😼'],
      walking: ['🐾', '🐈']
    };
    
    this.currentFrame = 0;
    this.animationInterval = null;
    
    this.init();
  }

  init() {
    this.createPet();
    this.startBehavior();
    this.setupInteractions();
  }

  createPet() {
    // Pet container
    this.petElement = document.createElement('div');
    this.petElement.id = 'virtual-pet';
    this.petElement.className = 'fixed z-40 cursor-pointer transition-all duration-300 select-none';
    this.petElement.style.left = this.x + 'px';
    this.petElement.style.top = this.y + 'px';
    
    // Pet body
    this.petBody = document.createElement('div');
    this.petBody.className = 'text-4xl transform hover:scale-110 transition-transform';
    this.petBody.textContent = this.frames.idle[0];
    
    // Speech bubble
    this.speechBubble = document.createElement('div');
    this.speechBubble.className = 'absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white dark:bg-gray-800 rounded-lg px-3 py-2 text-sm opacity-0 transition-opacity duration-300 whitespace-nowrap shadow-lg';
    this.speechBubble.innerHTML = `
      <div class="text-gray-900 dark:text-white"></div>
      <div class="absolute top-full left-1/2 transform -translate-x-1/2 -mt-2">
        <div class="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white dark:border-t-gray-800"></div>
      </div>
    `;
    
    // Name tag
    this.nameTag = document.createElement('div');
    this.nameTag.className = 'absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs bg-primary-600 text-white px-2 py-1 rounded';
    this.nameTag.textContent = this.name;
    
    this.petElement.appendChild(this.petBody);
    this.petElement.appendChild(this.speechBubble);
    this.petElement.appendChild(this.nameTag);
    
    document.body.appendChild(this.petElement);
    
    // Start idle animation
    this.startAnimation('idle');
  }

  startBehavior() {
    // Random movement
    this.moveInterval = setInterval(() => {
      if (Math.random() < 0.3) { // 30% chance to move
        this.randomMove();
      }
      
      // Random mood changes
      if (Math.random() < 0.1) { // 10% chance to change mood
        this.changeMood();
      }
    }, 5000);
    
    // Follow mouse occasionally
    document.addEventListener('mousemove', (e) => {
      if (Math.random() < 0.05 && !this.isMoving) { // 5% chance to follow mouse
        this.moveTowards(e.clientX, e.clientY, true);
      }
    });
  }

  setupInteractions() {
    // Click to pet
    this.petElement.addEventListener('click', () => {
      this.interact();
    });
    
    // Double click to feed
    this.petElement.addEventListener('dblclick', () => {
      this.feed();
    });
  }

  randomMove() {
    const margin = 100;
    const newX = margin + Math.random() * (window.innerWidth - margin * 2);
    const newY = margin + Math.random() * (window.innerHeight - margin * 2);
    
    this.moveTowards(newX, newY);
  }

  moveTowards(targetX, targetY, fast = false) {
    if (this.isMoving) return;
    
    this.isMoving = true;
    this.targetX = Math.max(50, Math.min(window.innerWidth - 50, targetX));
    this.targetY = Math.max(50, Math.min(window.innerHeight - 50, targetY));
    
    // Change to walking animation
    this.startAnimation('walking');
    
    const duration = fast ? 1000 : 2000;
    const startX = this.x;
    const startY = this.y;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      this.x = startX + (this.targetX - startX) * easeProgress;
      this.y = startY + (this.targetY - startY) * easeProgress;
      
      this.petElement.style.left = this.x + 'px';
      this.petElement.style.top = this.y + 'px';
      
      // Face direction of movement
      if (this.targetX < startX) {
        this.petElement.style.transform = 'scaleX(-1)';
      } else {
        this.petElement.style.transform = 'scaleX(1)';
      }
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.isMoving = false;
        this.startAnimation(this.mood);
      }
    };
    
    requestAnimationFrame(animate);
  }

  changeMood() {
    const moods = ['happy', 'sleepy', 'excited', 'curious'];
    const newMood = moods[Math.floor(Math.random() * moods.length)];
    
    if (newMood !== this.mood) {
      this.mood = newMood;
      this.startAnimation(this.mood);
      
      // Say something based on mood
      const messages = {
        happy: ['Purr purr! 💕', 'Life is good! 😊', 'I love this portfolio!'],
        sleepy: ['Yawn... 😴', 'Time for a nap...', 'Zzz...'],
        excited: ['Wow! 🎉', 'So exciting!', 'Let\'s play!'],
        curious: ['What\'s that? 🤔', 'Interesting...', 'Hmm...']
      };
      
      const message = messages[this.mood][Math.floor(Math.random() * messages[this.mood].length)];
      this.speak(message);
    }
  }

  interact() {
    this.interactionCount++;
    this.mood = 'happy';
    this.startAnimation('happy');
    
    const messages = [
      'Meow! 😸',
      'Thanks for the pets! 💕',
      'Purrrr... 😊',
      '*happy cat noises*',
      'You\'re the best! 😻'
    ];
    
    this.speak(messages[Math.floor(Math.random() * messages.length)]);
    
    // Unlock achievement
    if (this.interactionCount === 10 && window.unlockAchievement) {
      window.unlockAchievement('petlover');
    }
    
    // Jump animation
    this.petElement.style.transform = 'translateY(-20px)';
    setTimeout(() => {
      this.petElement.style.transform = 'translateY(0)';
    }, 300);
  }

  feed() {
    this.speak('Yum yum! 🐟 Thank you!');
    this.mood = 'excited';
    this.startAnimation('excited');
    
    // Create food animation
    const food = document.createElement('div');
    food.className = 'fixed text-2xl pointer-events-none z-50';
    food.textContent = '🐟';
    food.style.left = this.x + 'px';
    food.style.top = (this.y - 30) + 'px';
    food.style.transition = 'all 0.5s ease-out';
    
    document.body.appendChild(food);
    
    setTimeout(() => {
      food.style.transform = 'translateY(30px) scale(0)';
      food.style.opacity = '0';
    }, 100);
    
    setTimeout(() => food.remove(), 600);
  }

  speak(message) {
    const bubble = this.speechBubble.querySelector('div');
    bubble.textContent = message;
    this.speechBubble.style.opacity = '1';
    
    clearTimeout(this.speechTimeout);
    this.speechTimeout = setTimeout(() => {
      this.speechBubble.style.opacity = '0';
    }, 3000);
  }

  startAnimation(type) {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }
    
    const frames = this.frames[type] || this.frames.idle;
    this.currentFrame = 0;
    
    const updateFrame = () => {
      this.petBody.textContent = frames[this.currentFrame];
      this.currentFrame = (this.currentFrame + 1) % frames.length;
    };
    
    updateFrame();
    this.animationInterval = setInterval(updateFrame, 500);
  }

  sleep() {
    this.mood = 'sleepy';
    this.startAnimation('sleepy');
    this.speak('Time to sleep... 😴');
  }

  wake() {
    this.mood = 'happy';
    this.startAnimation('happy');
    this.speak('Good morning! ☀️');
  }
}

// Create pet instance
export const virtualPet = new VirtualPet();