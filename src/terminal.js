// Terminal Easter Egg
export class Terminal {
  constructor() {
    this.isOpen = false;
    this.history = [];
    this.historyIndex = -1;
    this.commands = this.initCommands();
    this.currentDirectory = '~/portfolio';
    
    this.init();
  }
  
  init() {
    this.createTerminal();
    this.bindEvents();
  }
  
  initCommands() {
    return {
      help: {
        description: 'Show available commands',
        execute: () => this.showHelp()
      },
      about: {
        description: 'About Jared Pleva',
        execute: () => this.showAbout()
      },
      skills: {
        description: 'List technical skills',
        execute: () => this.showSkills()
      },
      projects: {
        description: 'Show recent projects',
        execute: () => this.showProjects()
      },
      contact: {
        description: 'Display contact information',
        execute: () => this.showContact()
      },
      resume: {
        description: 'Download resume',
        execute: () => this.downloadResume()
      },
      clear: {
        description: 'Clear terminal',
        execute: () => this.clearTerminal()
      },
      exit: {
        description: 'Close terminal',
        execute: () => this.close()
      },
      ls: {
        description: 'List directory contents',
        execute: () => this.listDirectory()
      },
      pwd: {
        description: 'Print working directory',
        execute: () => this.printWorkingDirectory()
      },
      whoami: {
        description: 'Display current user',
        execute: () => this.whoami()
      },
      matrix: {
        description: 'Enter the Matrix',
        execute: () => this.matrixMode()
      },
      sudo: {
        description: 'Nice try',
        execute: () => this.sudo()
      }
    };
  }
  
  createTerminal() {
    this.terminal = document.createElement('div');
    this.terminal.className = 'terminal-container';
    this.terminal.innerHTML = `
      <div class="terminal">
        <div class="terminal-header">
          <div class="terminal-buttons">
            <span class="terminal-button close" onclick="window.terminal?.close()"></span>
            <span class="terminal-button minimize"></span>
            <span class="terminal-button maximize"></span>
          </div>
          <div class="terminal-title">jpleva@portfolio:~</div>
        </div>
        <div class="terminal-body">
          <div class="terminal-output"></div>
          <div class="terminal-input-line">
            <span class="terminal-prompt">jpleva@portfolio:~$ </span>
            <input type="text" class="terminal-input" spellcheck="false" autocomplete="off">
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(this.terminal);
    
    this.output = this.terminal.querySelector('.terminal-output');
    this.input = this.terminal.querySelector('.terminal-input');
    this.inputLine = this.terminal.querySelector('.terminal-input-line');
  }
  
  bindEvents() {
    // Open terminal with backtick
    document.addEventListener('keydown', (e) => {
      if (e.key === '`') {
        e.preventDefault();
        this.toggle();
      }
    });
    
    // Terminal input
    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.executeCommand(this.input.value);
        this.input.value = '';
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.navigateHistory(-1);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.navigateHistory(1);
      } else if (e.key === 'Tab') {
        e.preventDefault();
        this.autocomplete();
      }
    });
    
    // Click to focus
    this.terminal.addEventListener('click', () => {
      if (this.isOpen) this.input.focus();
    });
  }
  
  toggle() {
    this.isOpen ? this.close() : this.open();
  }
  
  open() {
    this.isOpen = true;
    this.terminal.classList.add('active');
    this.input.focus();
    
    if (this.output.innerHTML === '') {
      this.writeLine('Welcome to JP Terminal v1.0.0');
      this.writeLine('Type "help" for available commands');
      this.writeLine('');
    }
    
    // Unlock achievement
    if (window.unlockAchievement) {
      window.unlockAchievement('hacker');
    }
  }
  
  close() {
    this.isOpen = false;
    this.terminal.classList.remove('active');
  }
  
  executeCommand(cmd) {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) return;
    
    // Add to history
    this.history.push(trimmedCmd);
    this.historyIndex = this.history.length;
    
    // Echo command
    this.writeLine(`$ ${trimmedCmd}`, 'command');
    
    // Parse command
    const [command, ...args] = trimmedCmd.split(' ');
    
    if (this.commands[command]) {
      this.commands[command].execute(args);
    } else {
      this.writeLine(`Command not found: ${command}`, 'error');
      this.writeLine('Type "help" for available commands');
    }
  }
  
  writeLine(text, className = '') {
    const line = document.createElement('div');
    line.className = `terminal-line ${className}`;
    line.innerHTML = text;
    this.output.appendChild(line);
    
    // Scroll to bottom
    this.terminal.querySelector('.terminal-body').scrollTop = this.terminal.querySelector('.terminal-body').scrollHeight;
  }
  
  showHelp() {
    this.writeLine('Available commands:');
    Object.entries(this.commands).forEach(([cmd, info]) => {
      this.writeLine(`  <span class="command-name">${cmd}</span> - ${info.description}`);
    });
  }
  
  showAbout() {
    this.writeLine('');
    this.writeLine('<span class="highlight">Jared Pleva</span>');
    this.writeLine('Staff/Principal Engineer • Platform Architect');
    this.writeLine('');
    this.writeLine('Senior Software Engineer with 10+ years of experience');
    this.writeLine('Specializing in AI platforms, enterprise architecture, and modern web development');
    this.writeLine('Master\'s in AI/ML (2025) | B.S. Computer Information Systems');
    this.writeLine('');
  }
  
  showSkills() {
    this.writeLine('');
    this.writeLine('<span class="highlight">Technical Skills:</span>');
    this.writeLine('');
    this.writeLine('Languages:     TypeScript, JavaScript, C#, Python, SQL');
    this.writeLine('Frontend:      Angular, React, Vue, Nx, D3.js, GSAP');
    this.writeLine('Backend:       .NET Core, Node.js, Express, GraphQL');
    this.writeLine('AI/ML:         LLMs, Claude API, Prompt Engineering, TensorFlow');
    this.writeLine('Cloud:         Azure, AWS, Docker, Kubernetes');
    this.writeLine('Tools:         Git, VS Code, Nx, Webpack, Vite');
    this.writeLine('');
  }
  
  showProjects() {
    this.writeLine('');
    this.writeLine('<span class="highlight">Recent Projects:</span>');
    this.writeLine('');
    this.writeLine('1. AI Platform Architect - Agentic AI workflows with LLMs');
    this.writeLine('2. Monorepo Modernization - Enterprise Nx architecture');
    this.writeLine('3. Data Visualization Engine - D3.js migration strategy');
    this.writeLine('');
    this.writeLine('Type "open [number]" to learn more about a project');
  }
  
  showContact() {
    this.writeLine('');
    this.writeLine('<span class="highlight">Contact Information:</span>');
    this.writeLine('');
    this.writeLine('Email:     jpleva91@gmail.com');
    this.writeLine('LinkedIn:  linkedin.com/in/jared-pleva');
    this.writeLine('GitHub:    github.com/jpleva91');
    this.writeLine('Location:  Remote');
    this.writeLine('');
  }
  
  downloadResume() {
    this.writeLine('Downloading resume...');
    const downloadBtn = document.getElementById('download-resume');
    if (downloadBtn) {
      downloadBtn.click();
      this.writeLine('Resume downloaded successfully!', 'success');
      
      // Unlock achievement
      if (window.unlockAchievement) {
        window.unlockAchievement('scholar');
      }
    }
  }
  
  clearTerminal() {
    this.output.innerHTML = '';
  }
  
  listDirectory() {
    this.writeLine('');
    this.writeLine('total 12');
    this.writeLine('drwxr-xr-x  2 jpleva jpleva 4096 Jun 27 10:00 <span class="directory">projects</span>');
    this.writeLine('drwxr-xr-x  2 jpleva jpleva 4096 Jun 27 10:00 <span class="directory">skills</span>');
    this.writeLine('-rw-r--r--  1 jpleva jpleva 2048 Jun 27 10:00 resume.pdf');
    this.writeLine('-rw-r--r--  1 jpleva jpleva 1024 Jun 27 10:00 contact.txt');
    this.writeLine('');
  }
  
  printWorkingDirectory() {
    this.writeLine(this.currentDirectory);
  }
  
  whoami() {
    this.writeLine('jpleva');
  }
  
  matrixMode() {
    this.writeLine('Entering the Matrix...', 'success');
    document.body.classList.add('matrix-mode');
    setTimeout(() => {
      document.body.classList.remove('matrix-mode');
      this.writeLine('Welcome back to reality', 'success');
    }, 5000);
  }
  
  sudo() {
    this.writeLine('[sudo] password for jpleva: ', 'error');
    setTimeout(() => {
      this.writeLine('Nice try! This incident will be reported.', 'error');
    }, 1000);
  }
  
  navigateHistory(direction) {
    const newIndex = this.historyIndex + direction;
    if (newIndex >= 0 && newIndex < this.history.length) {
      this.historyIndex = newIndex;
      this.input.value = this.history[this.historyIndex];
    } else if (newIndex >= this.history.length) {
      this.historyIndex = this.history.length;
      this.input.value = '';
    }
  }
  
  autocomplete() {
    const currentValue = this.input.value;
    const matches = Object.keys(this.commands).filter(cmd => 
      cmd.startsWith(currentValue)
    );
    
    if (matches.length === 1) {
      this.input.value = matches[0];
    } else if (matches.length > 1) {
      this.writeLine(`$ ${currentValue}`, 'command');
      this.writeLine(matches.join('  '));
    }
  }
}

// Initialize globally
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    window.terminal = new Terminal();
  });
}