export class TecmoBowl {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.width = 600;
    this.height = 400;
    
    // Game state
    this.gameRunning = false;
    this.score = { lions: 0, bears: 0 };
    this.quarter = 1;
    this.timeLeft = 90; // seconds per quarter
    this.down = 1;
    this.yardsToGo = 10;
    this.fieldPosition = 20; // starting at own 20
    this.possession = 'lions'; // 'lions' or 'bears'
    
    // Team colors
    this.teamColors = {
      lions: { primary: '#0076B6', secondary: '#B0B7BC', name: 'LIONS' },
      bears: { primary: '#0B162A', secondary: '#C83803', name: 'BEARS' }
    };
    
    // Player state
    this.player = { x: 100, y: 200, speed: 3, hasBall: true };
    this.cpu = { x: 500, y: 200, speed: 2.5 };
    this.defenders = [];
    this.isRunning = false;
    this.selectedPlay = null;
    
    // Animation
    this.gameLoop = null;
    this.timer = null;
    
    this.init();
  }

  init() {
    this.createGameModal();
    this.setupControls();
    this.drawField(); // Show field immediately
  }

  createGameModal() {
    // Create modal backdrop
    this.backdrop = document.createElement('div');
    this.backdrop.className = 'fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center animate-fade-in';
    
    // Create game container
    const container = document.createElement('div');
    container.className = 'bg-gray-900 rounded-lg shadow-2xl p-4 animate-scale-in';
    container.innerHTML = `
      <div class="text-center mb-2">
        <h2 class="text-2xl font-bold text-white mb-1 font-mono">TECMO BOWL 🏈</h2>
        <div class="flex justify-between items-center text-white mb-2 px-4">
          <div class="text-sm">
            <span class="text-blue-400">LIONS</span>: <span id="lions-score">0</span>
          </div>
          <div class="text-sm">
            Q<span id="quarter">1</span> - <span id="time">1:30</span>
          </div>
          <div class="text-sm">
            <span class="text-orange-400">BEARS</span>: <span id="bears-score">0</span>
          </div>
        </div>
        <div id="game-status" class="text-sm text-green-400 mb-2 font-mono h-5"></div>
      </div>
      
      <canvas id="tecmo-canvas" width="600" height="400" class="border-2 border-gray-700 rounded bg-green-800"></canvas>
      
      <div id="game-instructions" class="mt-4 text-center text-white">
        <p class="text-lg font-bold mb-2">KICKOFF RETURN!</p>
        <p class="text-sm mb-1">⬆️⬇️⬅️➡️ or WASD to move</p>
        <p class="text-sm mb-1">SPACE for speed burst</p>
        <p class="text-sm mb-3">Return the kickoff for a touchdown!</p>
        <button id="start-game" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded font-mono text-lg transition-colors">
          START GAME
        </button>
      </div>
      
      <div class="flex justify-center gap-4 mt-4">
        <button id="tecmo-close" class="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors font-mono">
          QUIT GAME
        </button>
      </div>
    `;
    
    this.backdrop.appendChild(container);
    document.body.appendChild(this.backdrop);
    
    // Get canvas and context
    this.canvas = document.getElementById('tecmo-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false; // Pixel art style
    
    // Setup buttons
    document.getElementById('tecmo-close').addEventListener('click', () => this.close());
    document.getElementById('start-game').addEventListener('click', () => this.startKickoff());
  }

  setupControls() {
    const handleKey = (e) => {
      if (!this.isRunning) return;
      
      // Movement controls
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key)) {
        e.preventDefault();
      }
      
      switch(e.key) {
        case 'ArrowUp':
        case 'w':
          if (this.player.y > 20) this.player.y -= this.player.speed * 2;
          break;
        case 'ArrowDown':
        case 's':
          if (this.player.y < this.height - 20) this.player.y += this.player.speed * 2;
          break;
        case 'ArrowLeft':
        case 'a':
          if (this.player.x > 20) this.player.x -= this.player.speed * 2;
          break;
        case 'ArrowRight':
        case 'd':
          if (this.player.x < this.width - 20) this.player.x += this.player.speed * 2;
          break;
        case ' ':
          // Turbo/dodge
          this.player.speed = 5;
          setTimeout(() => { this.player.speed = 3; }, 500);
          break;
      }
    };
    
    this.keyHandler = handleKey;
    document.addEventListener('keydown', this.keyHandler);
  }

  createDefenders() {
    this.defenders = [];
    for (let i = 0; i < 5; i++) {
      this.defenders.push({
        x: 350 + Math.random() * 200,
        y: 50 + i * 60,
        speed: 1.5 + Math.random() * 0.5,
        angle: 0
      });
    }
  }

  startKickoff() {
    // Hide instructions
    document.getElementById('game-instructions').style.display = 'none';
    document.getElementById('game-status').textContent = 'KICKOFF RETURN!';
    
    // Unlock achievement
    if (window.unlockAchievement) {
      window.unlockAchievement('gamer');
    }
    
    // Reset game state
    this.isRunning = true;
    this.player.x = 60; // Start in end zone
    this.player.y = 200;
    this.player.hasBall = true;
    this.fieldPosition = 0;
    
    // Create kickoff coverage team
    this.createKickoffCoverage();
    
    // Start game
    this.startGameLoop();
  }
  
  createKickoffCoverage() {
    this.defenders = [];
    // Create a realistic kickoff coverage team
    for (let i = 0; i < 8; i++) {
      this.defenders.push({
        x: 350 + Math.random() * 100, // Spread across midfield
        y: 50 + (i * 40), // Different lanes
        speed: 2 + Math.random() * 0.8,
        angle: 0
      });
    }
  }

  startGameLoop() {
    this.gameRunning = true;
    this.gameLoop = requestAnimationFrame(() => this.update());
    
  }

  update() {
    if (!this.gameRunning) return;
    
    // Clear canvas
    this.drawField();
    
    // Update defenders AI
    this.defenders.forEach(defender => {
      const dx = this.player.x - defender.x;
      const dy = this.player.y - defender.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 5) {
        defender.x += (dx / distance) * defender.speed;
        defender.y += (dy / distance) * defender.speed;
      }
      
      // Check tackle
      if (distance < 15 && this.player.hasBall) {
        this.endPlay();
      }
    });
    
    // Draw everything
    this.drawPlayers();
    
    // Check touchdown
    if (this.player.x > this.width - 50 && this.player.hasBall) {
      this.touchdown();
    }
    
    if (this.gameRunning) {
      this.gameLoop = requestAnimationFrame(() => this.update());
    }
  }

  drawField() {
    // Green field
    this.ctx.fillStyle = '#2d5a2d';
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    // Yard lines
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = 2;
    
    for (let i = 0; i <= 10; i++) {
      const x = i * 60;
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.height);
      this.ctx.stroke();
      
      // Yard numbers
      if (i > 0 && i < 10) {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 20px monospace';
        this.ctx.textAlign = 'center';
        const yardNum = i < 6 ? i * 10 : (10 - i) * 10;
        this.ctx.fillText(yardNum, x, 30);
        this.ctx.fillText(yardNum, x, this.height - 10);
      }
    }
    
    // End zones
    this.ctx.fillStyle = '#1a4d1a';
    this.ctx.fillRect(0, 0, 60, this.height);
    this.ctx.fillRect(this.width - 60, 0, 60, this.height);
    
    // End zone text
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 16px monospace';
    this.ctx.save();
    this.ctx.translate(30, this.height / 2);
    this.ctx.rotate(-Math.PI / 2);
    this.ctx.textAlign = 'center';
    this.ctx.fillText('LIONS', 0, 0);
    this.ctx.restore();
    
    this.ctx.save();
    this.ctx.translate(this.width - 30, this.height / 2);
    this.ctx.rotate(Math.PI / 2);
    this.ctx.textAlign = 'center';
    this.ctx.fillText('BEARS', 0, 0);
    this.ctx.restore();
  }

  drawPlayers() {
    // Draw player (Lions blue)
    this.ctx.fillStyle = '#0076B6';
    this.ctx.fillRect(this.player.x - 10, this.player.y - 10, 20, 20);
    
    // Ball indicator
    if (this.player.hasBall) {
      this.ctx.fillStyle = '#8B4513';
      this.ctx.beginPath();
      this.ctx.arc(this.player.x, this.player.y - 15, 5, 0, Math.PI * 2);
      this.ctx.fill();
    }
    
    // Draw defenders (red)
    this.ctx.fillStyle = '#cc0000';
    this.defenders.forEach(defender => {
      this.ctx.fillRect(defender.x - 10, defender.y - 10, 20, 20);
    });
    
    // Draw player number
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 12px monospace';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('1', this.player.x, this.player.y + 4);
    
    this.defenders.forEach((defender, i) => {
      this.ctx.fillText((i + 2).toString(), defender.x, defender.y + 4);
    });
  }

  endPlay() {
    this.isRunning = false;
    this.gameRunning = false;
    cancelAnimationFrame(this.gameLoop);
    
    // Calculate yards gained
    const yardsGained = Math.floor((this.player.x - 60) / 6);
    document.getElementById('game-status').textContent = `TACKLED! ${yardsGained} yard return`;
    
    // Show try again
    setTimeout(() => {
      document.getElementById('game-instructions').style.display = 'block';
      document.getElementById('game-instructions').innerHTML = `
        <p class="text-lg font-bold mb-2 text-yellow-400">TACKLED!</p>
        <p class="text-sm mb-3">${yardsGained} yard return. Try again!</p>
        <button id="play-again" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded font-mono text-lg transition-colors">
          TRY AGAIN
        </button>
      `;
      document.getElementById('play-again').addEventListener('click', () => {
        document.getElementById('game-instructions').innerHTML = `
          <p class="text-lg font-bold mb-2">KICKOFF RETURN!</p>
          <p class="text-sm mb-1">⬆️⬇️⬅️➡️ or WASD to move</p>
          <p class="text-sm mb-1">SPACE for speed burst</p>
          <p class="text-sm mb-3">Return the kickoff for a touchdown!</p>
          <button id="start-game" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded font-mono text-lg transition-colors">
            START GAME
          </button>
        `;
        document.getElementById('start-game').addEventListener('click', () => this.startKickoff());
        this.drawField();
      });
    }, 1500);
  }

  touchdown() {
    this.isRunning = false;
    this.gameRunning = false;
    cancelAnimationFrame(this.gameLoop);
    
    this.score.lions += 7;
    document.getElementById('lions-score').textContent = this.score.lions;
    document.getElementById('game-status').textContent = 'TOUCHDOWN LIONS!!!';
    
    // Celebration animation
    let flash = 0;
    const celebrate = setInterval(() => {
      this.ctx.fillStyle = flash % 2 === 0 ? '#0076B6' : '#ffffff';
      this.ctx.font = 'bold 48px monospace';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('TOUCHDOWN!', this.width / 2, this.height / 2);
      flash++;
      
      if (flash > 10) {
        clearInterval(celebrate);
        // Show play again button
        this.showPlayAgain();
      }
    }, 200);
  }
  
  showPlayAgain() {
    document.getElementById('game-instructions').style.display = 'block';
    document.getElementById('game-instructions').innerHTML = `
      <p class="text-lg font-bold mb-2 text-green-400">TOUCHDOWN!</p>
      <p class="text-sm mb-3">Great return! Try again?</p>
      <button id="play-again" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded font-mono text-lg transition-colors">
        PLAY AGAIN
      </button>
    `;
    document.getElementById('play-again').addEventListener('click', () => {
      document.getElementById('game-instructions').innerHTML = `
        <p class="text-lg font-bold mb-2">KICKOFF RETURN!</p>
        <p class="text-sm mb-1">⬆️⬇️⬅️➡️ or WASD to move</p>
        <p class="text-sm mb-1">SPACE for speed burst</p>
        <p class="text-sm mb-3">Return the kickoff for a touchdown!</p>
        <button id="start-game" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded font-mono text-lg transition-colors">
          START GAME
        </button>
      `;
      document.getElementById('start-game').addEventListener('click', () => this.startKickoff());
      this.drawField();
    });
  }

  turnover() {
    document.getElementById('game-status').textContent = 'Turnover on downs!';
    this.possession = this.possession === 'player' ? 'cpu' : 'player';
    this.down = 1;
    this.yardsToGo = 10;
    this.fieldPosition = 100 - this.fieldPosition;
    
    setTimeout(() => {
      if (this.possession === 'cpu') {
        this.cpuPlay();
      } else {
        this.showPlaySelection();
      }
    }, 2000);
  }

  cpuPlay() {
    // Simple CPU simulation
    const gain = Math.floor(Math.random() * 15) - 2;
    this.fieldPosition += gain;
    
    if (this.fieldPosition >= 100) {
      this.score.cpu += 7;
      document.getElementById('cpu-score').textContent = this.score.cpu;
      document.getElementById('game-status').textContent = 'CPU TOUCHDOWN!';
      setTimeout(() => this.kickoff(), 2000);
    } else {
      document.getElementById('game-status').textContent = `CPU gains ${gain} yards`;
      setTimeout(() => this.cpuPlay(), 2000);
    }
  }

  kickoff() {
    this.fieldPosition = 20;
    this.down = 1;
    this.yardsToGo = 10;
    this.possession = 'player';
    this.showPlaySelection();
  }

  endQuarter() {
    this.quarter++;
    this.timeLeft = 90;
    
    if (this.quarter > 4) {
      this.endGame();
    } else {
      document.getElementById('quarter').textContent = this.quarter;
      document.getElementById('game-status').textContent = `End of Quarter ${this.quarter - 1}`;
    }
  }

  endGame() {
    clearInterval(this.timer);
    cancelAnimationFrame(this.gameLoop);
    
    const winner = this.score.player > this.score.cpu ? 'PLAYER WINS!' : 
                   this.score.cpu > this.score.player ? 'CPU WINS!' : 'TIE GAME!';
    
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 48px monospace';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('GAME OVER', this.width / 2, this.height / 2 - 40);
    
    this.ctx.font = 'bold 36px monospace';
    this.ctx.fillText(winner, this.width / 2, this.height / 2 + 20);
    
    this.ctx.font = '24px monospace';
    this.ctx.fillText(`${this.score.player} - ${this.score.cpu}`, this.width / 2, this.height / 2 + 60);
  }

  updateTime() {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    document.getElementById('time').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  getOrdinal(n) {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
  }

  close() {
    this.gameRunning = false;
    cancelAnimationFrame(this.gameLoop);
    clearInterval(this.timer);
    document.removeEventListener('keydown', this.keyHandler);
    this.backdrop.remove();
  }
}

// Add retro CSS
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