// Command Palette - Inspired by VS Code and Raycast
export class CommandPalette {
  constructor() {
    this.isOpen = false;
    this.selectedIndex = 0;
    this.searchQuery = '';
    this.commands = [];
    this.filteredCommands = [];
    
    this.initCommands();
    this.createUI();
    this.bindEvents();
  }
  
  initCommands() {
    this.commands = [
      // Navigation
      { id: 'home', title: 'Go to Home', icon: '🏠', action: () => this.navigateTo('#home'), category: 'Navigation' },
      { id: 'projects', title: 'View Projects', icon: '💼', action: () => this.navigateTo('#projects'), category: 'Navigation' },
      { id: 'resume', title: 'View Resume', icon: '📄', action: () => this.navigateTo('#resume'), category: 'Navigation' },
      { id: 'contact', title: 'Contact Me', icon: '✉️', action: () => this.navigateTo('#contact'), category: 'Navigation' },
      
      // Actions
      { id: 'download-resume', title: 'Download Resume PDF', icon: '⬇️', action: () => this.downloadResume(), category: 'Actions' },
      { id: 'copy-email', title: 'Copy Email Address', icon: '📧', action: () => this.copyToClipboard('jpleva91@gmail.com', 'Email copied!'), category: 'Actions' },
      { id: 'open-github', title: 'Open GitHub Profile', icon: '🐙', action: () => window.open('https://github.com/jpleva91', '_blank'), category: 'Actions' },
      { id: 'open-linkedin', title: 'Open LinkedIn Profile', icon: '💼', action: () => window.open('https://www.linkedin.com/in/jared-pleva', '_blank'), category: 'Actions' },
      
      // Projects
      { id: 'project-ai', title: 'View AI Platform Architect Project', icon: '🤖', action: () => this.scrollToProject('ai-platform'), category: 'Projects' },
      { id: 'project-viz', title: 'View Data Visualization Engine Project', icon: '📊', action: () => this.scrollToProject('data-viz'), category: 'Projects' },
      { id: 'project-mono', title: 'View Monorepo Modernization Project', icon: '🏗️', action: () => this.scrollToProject('monorepo'), category: 'Projects' },
      
      // Theme
      { id: 'toggle-theme', title: 'Toggle Dark/Light Theme', icon: '🌓', action: () => this.toggleTheme(), category: 'Theme' },
      { id: 'set-light', title: 'Set Light Theme', icon: '☀️', action: () => this.setTheme('light'), category: 'Theme' },
      { id: 'set-dark', title: 'Set Dark Theme', icon: '🌙', action: () => this.setTheme('dark'), category: 'Theme' },
      
      // Fun
      { id: 'surprise', title: 'Surprise Me!', icon: '🎉', action: () => this.surprise(), category: 'Fun' },
      { id: 'matrix', title: 'Enter the Matrix', icon: '💊', action: () => this.matrixMode(), category: 'Fun' },
    ];
    
    this.filteredCommands = [...this.commands];
  }
  
  createUI() {
    // Create overlay
    this.overlay = document.createElement('div');
    this.overlay.className = 'command-palette-overlay';
    this.overlay.innerHTML = `
      <div class="command-palette">
        <div class="command-palette-header">
          <input type="text" class="command-palette-input" placeholder="Type a command or search..." autocomplete="off">
          <div class="command-palette-hint">↑↓ Navigate • ↵ Select • ESC Close</div>
        </div>
        <div class="command-palette-results"></div>
      </div>
    `;
    
    document.body.appendChild(this.overlay);
    
    this.input = this.overlay.querySelector('.command-palette-input');
    this.results = this.overlay.querySelector('.command-palette-results');
  }
  
  bindEvents() {
    // Cmd+K or Ctrl+K to open
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        this.toggle();
      }
    });
    
    // Separate handler for when palette is open
    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        this.close();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.selectNext();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.selectPrevious();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        this.executeSelected();
      }
    });
    
    // Click outside to close
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.close();
      }
    });
    
    // Search input
    this.input.addEventListener('input', (e) => {
      this.searchQuery = e.target.value;
      this.filterCommands();
      this.renderResults();
    });
  }
  
  toggle() {
    this.isOpen ? this.close() : this.open();
  }
  
  open() {
    this.isOpen = true;
    this.overlay.classList.add('active');
    this.searchQuery = '';
    this.input.value = '';
    this.selectedIndex = 0;
    this.filterCommands();
    this.renderResults();
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Focus input after a small delay to ensure DOM is ready
    setTimeout(() => {
      this.input.focus();
    }, 50);
  }
  
  close() {
    this.isOpen = false;
    this.overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  filterCommands() {
    const query = this.searchQuery.toLowerCase();
    
    if (!query) {
      this.filteredCommands = [...this.commands];
    } else {
      this.filteredCommands = this.commands.filter(cmd => 
        cmd.title.toLowerCase().includes(query) ||
        cmd.category.toLowerCase().includes(query)
      );
    }
    
    // Reset selection if out of bounds
    if (this.selectedIndex >= this.filteredCommands.length) {
      this.selectedIndex = 0;
    }
  }
  
  renderResults() {
    if (this.filteredCommands.length === 0) {
      this.results.innerHTML = `
        <div class="command-palette-empty">
          No commands found for "${this.searchQuery}"
        </div>
      `;
      return;
    }
    
    // Group by category
    const grouped = this.filteredCommands.reduce((acc, cmd) => {
      if (!acc[cmd.category]) acc[cmd.category] = [];
      acc[cmd.category].push(cmd);
      return acc;
    }, {});
    
    let html = '';
    let index = 0;
    
    Object.entries(grouped).forEach(([category, commands]) => {
      html += `<div class="command-palette-category">${category}</div>`;
      
      commands.forEach(cmd => {
        const isSelected = index === this.selectedIndex;
        html += `
          <div class="command-palette-item ${isSelected ? 'selected' : ''}" data-index="${index}">
            <span class="command-palette-icon">${cmd.icon}</span>
            <span class="command-palette-title">${this.highlightMatch(cmd.title)}</span>
          </div>
        `;
        index++;
      });
    });
    
    this.results.innerHTML = html;
    
    // Add click handlers
    this.results.querySelectorAll('.command-palette-item').forEach((item, idx) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const index = parseInt(item.dataset.index);
        this.selectedIndex = index;
        // Use setTimeout to ensure the selection is registered
        setTimeout(() => this.executeSelected(), 0);
      });
      
      item.addEventListener('mouseenter', () => {
        this.selectedIndex = parseInt(item.dataset.index);
        this.renderResults();
      });
    });
  }
  
  highlightMatch(text) {
    if (!this.searchQuery) return text;
    
    const regex = new RegExp(`(${this.searchQuery})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }
  
  selectNext() {
    this.selectedIndex = (this.selectedIndex + 1) % this.filteredCommands.length;
    this.renderResults();
    this.scrollToSelected();
  }
  
  selectPrevious() {
    this.selectedIndex = (this.selectedIndex - 1 + this.filteredCommands.length) % this.filteredCommands.length;
    this.renderResults();
    this.scrollToSelected();
  }
  
  scrollToSelected() {
    const selectedElement = this.results.querySelector('.command-palette-item.selected');
    if (selectedElement) {
      selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }
  
  executeSelected() {
    const command = this.filteredCommands[this.selectedIndex];
    if (command) {
      this.close();
      try {
        command.action();
      } catch (error) {
        console.error('Command execution error:', error);
        this.showToast('❌ Command failed: ' + error.message);
      }
    }
  }
  
  // Command actions
  navigateTo(selector) {
    const element = document.querySelector(selector);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
  
  downloadResume() {
    const downloadBtn = document.getElementById('download-resume');
    if (downloadBtn) downloadBtn.click();
  }
  
  copyToClipboard(text, message) {
    navigator.clipboard.writeText(text).then(() => {
      this.showToast(message);
    });
  }
  
  scrollToProject(projectId) {
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
      if (card.textContent.toLowerCase().includes(projectId)) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        card.classList.add('highlight-pulse');
        setTimeout(() => card.classList.remove('highlight-pulse'), 2000);
      }
    });
  }
  
  toggleTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) themeToggle.click();
  }
  
  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }
  
  surprise() {
    const surprises = [
      () => this.showToast('🎉 You found the surprise command!'),
      () => this.matrixMode(),
      () => this.confetti(),
      () => this.showToast('🚀 To the moon!'),
    ];
    
    const surprise = surprises[Math.floor(Math.random() * surprises.length)];
    surprise();
  }
  
  matrixMode() {
    document.body.classList.add('matrix-mode');
    setTimeout(() => document.body.classList.remove('matrix-mode'), 5000);
    this.showToast('🔴💊 Welcome to the Matrix');
  }
  
  confetti() {
    // Simple confetti effect
    const colors = ['#0EA5E9', '#38BDF8', '#7DD3FC', '#F59E0B', '#10B981'];
    const confettiCount = 100;
    
    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDelay = Math.random() * 3 + 's';
      document.body.appendChild(confetti);
      
      setTimeout(() => confetti.remove(), 5000);
    }
  }
  
  showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'command-palette-toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}

// Initialize on DOM load
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    window.commandPalette = new CommandPalette();
  });
}