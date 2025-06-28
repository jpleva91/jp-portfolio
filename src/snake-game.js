export class SnakeGame {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.gridSize = 20;
    this.tileCount = 20;
    this.tileSize = 400 / this.tileCount;
    
    this.snake = [{ x: 10, y: 10 }];
    this.velocity = { x: 0, y: 0 };
    this.apple = { x: 15, y: 15 };
    this.score = 0;
    this.gameRunning = false;
    this.gameLoop = null;
    
    this.init();
  }

  init() {
    this.createGameModal();
    this.setupControls();
    this.startGame();
  }

  createGameModal() {
    // Create modal backdrop
    this.backdrop = document.createElement('div');
    this.backdrop.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center animate-fade-in';
    
    // Create game container
    const container = document.createElement('div');
    container.className = 'bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 animate-scale-in';
    container.innerHTML = `
      <div class="text-center mb-4">
        <h2 class="text-2xl font-bold mb-2">Snake Game 🐍</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-4">Use arrow keys or WASD to move</p>
        <div class="flex justify-center gap-4 mb-4">
          <div class="text-lg font-semibold">Score: <span id="snake-score" class="text-primary-600">0</span></div>
          <button id="snake-restart" class="px-4 py-1 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors">
            Restart
          </button>
          <button id="snake-close" class="px-4 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors">
            Close
          </button>
        </div>
      </div>
      <canvas id="snake-canvas" width="400" height="400" class="border-2 border-gray-300 dark:border-gray-600 rounded-lg"></canvas>
      <p class="text-center mt-4 text-sm text-gray-500 dark:text-gray-400">
        High Score: <span id="snake-highscore">${this.getHighScore()}</span>
      </p>
    `;
    
    this.backdrop.appendChild(container);
    document.body.appendChild(this.backdrop);
    
    // Get canvas and context
    this.canvas = document.getElementById('snake-canvas');
    this.ctx = this.canvas.getContext('2d');
    
    // Setup buttons
    document.getElementById('snake-restart').addEventListener('click', () => this.restart());
    document.getElementById('snake-close').addEventListener('click', () => this.close());
    
    // Close on backdrop click
    this.backdrop.addEventListener('click', (e) => {
      if (e.target === this.backdrop) {
        this.close();
      }
    });
  }

  setupControls() {
    const handleKey = (e) => {
      if (!this.gameRunning) return;
      
      // Prevent scrolling
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key)) {
        e.preventDefault();
      }
      
      // Arrow keys and WASD
      switch(e.key) {
        case 'ArrowUp':
        case 'w':
          if (this.velocity.y === 0) {
            this.velocity = { x: 0, y: -1 };
          }
          break;
        case 'ArrowDown':
        case 's':
          if (this.velocity.y === 0) {
            this.velocity = { x: 0, y: 1 };
          }
          break;
        case 'ArrowLeft':
        case 'a':
          if (this.velocity.x === 0) {
            this.velocity = { x: -1, y: 0 };
          }
          break;
        case 'ArrowRight':
        case 'd':
          if (this.velocity.x === 0) {
            this.velocity = { x: 1, y: 0 };
          }
          break;
      }
    };
    
    this.keyHandler = handleKey;
    document.addEventListener('keydown', this.keyHandler);
  }

  startGame() {
    this.gameRunning = true;
    this.gameLoop = setInterval(() => this.update(), 100);
  }

  update() {
    if (!this.gameRunning) return;
    
    // Move snake
    const head = { ...this.snake[0] };
    head.x += this.velocity.x;
    head.y += this.velocity.y;
    
    // Check walls
    if (head.x < 0 || head.x >= this.tileCount || head.y < 0 || head.y >= this.tileCount) {
      this.gameOver();
      return;
    }
    
    // Check self collision
    for (let segment of this.snake) {
      if (head.x === segment.x && head.y === segment.y) {
        this.gameOver();
        return;
      }
    }
    
    // Add new head
    this.snake.unshift(head);
    
    // Check apple
    if (head.x === this.apple.x && head.y === this.apple.y) {
      this.score++;
      document.getElementById('snake-score').textContent = this.score;
      this.generateApple();
    } else {
      // Remove tail if no apple eaten
      this.snake.pop();
    }
    
    this.draw();
  }

  draw() {
    // Clear canvas
    this.ctx.fillStyle = '#1a1a1a';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw grid
    this.ctx.strokeStyle = '#2a2a2a';
    this.ctx.lineWidth = 1;
    for (let i = 0; i <= this.tileCount; i++) {
      const pos = i * this.tileSize;
      this.ctx.beginPath();
      this.ctx.moveTo(pos, 0);
      this.ctx.lineTo(pos, this.canvas.height);
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.moveTo(0, pos);
      this.ctx.lineTo(this.canvas.width, pos);
      this.ctx.stroke();
    }
    
    // Draw snake
    this.ctx.fillStyle = '#10B981';
    this.snake.forEach((segment, index) => {
      // Make head slightly different
      if (index === 0) {
        this.ctx.fillStyle = '#059669';
      } else {
        this.ctx.fillStyle = '#10B981';
      }
      this.ctx.fillRect(
        segment.x * this.tileSize + 1,
        segment.y * this.tileSize + 1,
        this.tileSize - 2,
        this.tileSize - 2
      );
    });
    
    // Draw apple
    this.ctx.fillStyle = '#EF4444';
    this.ctx.beginPath();
    this.ctx.arc(
      this.apple.x * this.tileSize + this.tileSize / 2,
      this.apple.y * this.tileSize + this.tileSize / 2,
      this.tileSize / 3,
      0,
      Math.PI * 2
    );
    this.ctx.fill();
  }

  generateApple() {
    do {
      this.apple = {
        x: Math.floor(Math.random() * this.tileCount),
        y: Math.floor(Math.random() * this.tileCount)
      };
    } while (this.snake.some(segment => segment.x === this.apple.x && segment.y === this.apple.y));
  }

  gameOver() {
    this.gameRunning = false;
    clearInterval(this.gameLoop);
    
    // Update high score
    const highScore = this.getHighScore();
    if (this.score > highScore) {
      localStorage.setItem('snakeHighScore', this.score.toString());
      document.getElementById('snake-highscore').textContent = this.score;
    }
    
    // Show game over
    setTimeout(() => {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      this.ctx.fillStyle = 'white';
      this.ctx.font = 'bold 36px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('Game Over!', this.canvas.width / 2, this.canvas.height / 2 - 20);
      
      this.ctx.font = '24px Arial';
      this.ctx.fillText(`Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 20);
      
      if (this.score > highScore) {
        this.ctx.fillStyle = '#10B981';
        this.ctx.font = '20px Arial';
        this.ctx.fillText('New High Score!', this.canvas.width / 2, this.canvas.height / 2 + 60);
      }
    }, 100);
  }

  restart() {
    // Reset game state
    this.snake = [{ x: 10, y: 10 }];
    this.velocity = { x: 0, y: 0 };
    this.score = 0;
    document.getElementById('snake-score').textContent = '0';
    this.generateApple();
    
    // Restart game loop
    clearInterval(this.gameLoop);
    this.gameRunning = true;
    this.gameLoop = setInterval(() => this.update(), 100);
    this.draw();
  }

  close() {
    this.gameRunning = false;
    clearInterval(this.gameLoop);
    document.removeEventListener('keydown', this.keyHandler);
    this.backdrop.remove();
  }

  getHighScore() {
    return parseInt(localStorage.getItem('snakeHighScore') || '0');
  }
}

// Add CSS animation classes
const style = document.createElement('style');
style.textContent = `
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes scale-in {
    from { 
      opacity: 0;
      transform: scale(0.9);
    }
    to { 
      opacity: 1;
      transform: scale(1);
    }
  }
  
  .animate-fade-in {
    animation: fade-in 0.2s ease-out;
  }
  
  .animate-scale-in {
    animation: scale-in 0.3s ease-out;
  }
`;
document.head.appendChild(style);