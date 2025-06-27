// AI Chat Assistant with D3.js Visualization
export class AIChat {
  constructor() {
    this.isOpen = false;
    this.messages = [];
    this.isTyping = false;
    this.chartContainer = null;
    
    // Pre-defined responses and patterns
    this.responses = {
      greeting: [
        "Hi! I'm Jared's AI assistant. I can tell you about his experience, skills, and even show you some data visualizations!",
        "Hello! Ask me anything about Jared's background, or try 'show me a chart' to see some cool visualizations!"
      ],
      experience: {
        keywords: ['experience', 'work', 'job', 'career'],
        response: "Jared has over 10 years of experience in software engineering. He's currently a Senior Software Engineer at INFICON, where he leads platform architecture and AI integrations. Would you like me to visualize his career progression?"
      },
      skills: {
        keywords: ['skills', 'technologies', 'tech stack', 'languages'],
        response: "Jared specializes in Angular, TypeScript, .NET Core, and AI/ML. He's proficient in building scalable monorepos, data visualization with D3.js, and integrating LLMs. Want to see a skills comparison chart?"
      },
      projects: {
        keywords: ['projects', 'portfolio', 'work samples'],
        response: "His notable projects include AI Platform Architecture with agentic workflows, enterprise monorepo modernization, and data visualization engines. I can show you a timeline of his projects!"
      },
      education: {
        keywords: ['education', 'degree', 'school', 'university'],
        response: "Jared holds a B.S. in Computer Information Systems and is completing his M.S. in AI/ML (2025). He's passionate about continuous learning!"
      },
      contact: {
        keywords: ['contact', 'email', 'reach', 'hire'],
        response: "You can reach Jared at jpleva91@gmail.com or connect on LinkedIn. He's always open to discussing new opportunities!"
      },
      ai: {
        keywords: ['ai', 'artificial intelligence', 'ml', 'machine learning', 'llm'],
        response: "Jared has extensive experience with AI/ML, including prompt engineering, LLM integrations (Claude, GPT), and building agentic AI workflows. He's currently pursuing a Master's in AI/ML!"
      }
    };
    
    this.chartCommands = {
      'skills chart': () => this.createSkillsBarChart(),
      'career timeline': () => this.createCareerTimeline(),
      'tech distribution': () => this.createTechPieChart(),
      'experience years': () => this.createExperienceChart(),
      'project impact': () => this.createProjectImpactChart(),
      'growth trajectory': () => this.createGrowthChart(),
      'language proficiency': () => this.createLanguageChart()
    };
    
    this.init();
  }
  
  init() {
    this.createChatInterface();
    this.bindEvents();
    this.addMessage("Hello! I'm Jared's AI assistant. Ask me about his experience, skills, or say 'show me a chart' for visualizations!", 'bot');
  }
  
  createChatInterface() {
    this.container = document.createElement('div');
    this.container.className = 'ai-chat-container';
    this.container.innerHTML = `
      <button class="ai-chat-toggle">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
        </svg>
        <span class="chat-badge">AI</span>
      </button>
      
      <div class="ai-chat-window">
        <div class="chat-header">
          <h3>AI Assistant</h3>
          <button class="chat-close">×</button>
        </div>
        <div class="chat-messages"></div>
        <div class="chat-visualization"></div>
        <div class="chat-input-container">
          <input type="text" class="chat-input" placeholder="Ask about experience, skills, or 'show me a chart'...">
          <button class="chat-send">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
            </svg>
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(this.container);
    
    this.chatWindow = this.container.querySelector('.ai-chat-window');
    this.messagesContainer = this.container.querySelector('.chat-messages');
    this.chartContainer = this.container.querySelector('.chat-visualization');
    this.input = this.container.querySelector('.chat-input');
    this.toggleBtn = this.container.querySelector('.ai-chat-toggle');
    this.closeBtn = this.container.querySelector('.chat-close');
    this.sendBtn = this.container.querySelector('.chat-send');
  }
  
  bindEvents() {
    this.toggleBtn.addEventListener('click', () => this.toggle());
    this.closeBtn.addEventListener('click', () => this.close());
    this.sendBtn.addEventListener('click', () => this.sendMessage());
    
    this.input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });
  }
  
  toggle() {
    this.isOpen ? this.close() : this.open();
  }
  
  open() {
    this.isOpen = true;
    this.container.classList.add('active');
    this.input.focus();
  }
  
  close() {
    this.isOpen = false;
    this.container.classList.remove('active');
  }
  
  sendMessage() {
    const message = this.input.value.trim();
    if (!message) return;
    
    this.addMessage(message, 'user');
    this.input.value = '';
    
    // Process message
    setTimeout(() => this.processMessage(message), 500);
  }
  
  addMessage(text, sender) {
    const messageEl = document.createElement('div');
    messageEl.className = `chat-message ${sender}`;
    messageEl.innerHTML = `
      <div class="message-content">${text}</div>
    `;
    
    this.messagesContainer.appendChild(messageEl);
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }
  
  processMessage(message) {
    const lowerMessage = message.toLowerCase();
    
    // Check for chart commands
    for (const [command, action] of Object.entries(this.chartCommands)) {
      if (lowerMessage.includes(command) || lowerMessage.includes('chart') || lowerMessage.includes('show me')) {
        this.showTypingIndicator();
        setTimeout(() => {
          this.hideTypingIndicator();
          this.addMessage("Here's the visualization you requested:", 'bot');
          action();
        }, 1000);
        return;
      }
    }
    
    // Check for keyword matches
    for (const [key, data] of Object.entries(this.responses)) {
      if (key === 'greeting') continue;
      
      if (data.keywords.some(keyword => lowerMessage.includes(keyword))) {
        this.showTypingIndicator();
        setTimeout(() => {
          this.hideTypingIndicator();
          this.addMessage(data.response, 'bot');
        }, 1000);
        return;
      }
    }
    
    // Default response
    this.showTypingIndicator();
    setTimeout(() => {
      this.hideTypingIndicator();
      this.addMessage("I can tell you about Jared's experience, skills, projects, or education. Try asking 'show me a skills chart' for visualizations!", 'bot');
    }, 1000);
  }
  
  showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.innerHTML = '<span></span><span></span><span></span>';
    this.messagesContainer.appendChild(indicator);
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }
  
  hideTypingIndicator() {
    const indicator = this.messagesContainer.querySelector('.typing-indicator');
    if (indicator) indicator.remove();
  }
  
  // D3.js Chart Methods
  createSkillsBarChart() {
    this.clearChart();
    this.chartContainer.style.display = 'block';
    
    const data = [
      { skill: 'Angular/React', level: 95 },
      { skill: 'TypeScript', level: 90 },
      { skill: '.NET Core', level: 85 },
      { skill: 'AI/ML', level: 75 },
      { skill: 'D3.js', level: 85 },
      { skill: 'Cloud/DevOps', level: 80 }
    ];
    
    const margin = { top: 20, right: 20, bottom: 30, left: 100 };
    const width = 350 - margin.left - margin.right;
    const height = 250 - margin.top - margin.bottom;
    
    const svg = d3.select(this.chartContainer)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    const x = d3.scaleLinear()
      .domain([0, 100])
      .range([0, width]);
    
    const y = d3.scaleBand()
      .range([0, height])
      .domain(data.map(d => d.skill))
      .padding(0.1);
    
    // Bars
    svg.selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', 0)
      .attr('y', d => y(d.skill))
      .attr('width', 0)
      .attr('height', y.bandwidth())
      .attr('fill', '#0EA5E9')
      .transition()
      .duration(1000)
      .delay((d, i) => i * 100)
      .attr('width', d => x(d.level));
    
    // Labels
    svg.selectAll('.label')
      .data(data)
      .enter().append('text')
      .attr('class', 'label')
      .attr('x', d => x(d.level) + 5)
      .attr('y', d => y(d.skill) + y.bandwidth() / 2)
      .attr('dy', '.35em')
      .text(d => d.level + '%')
      .style('opacity', 0)
      .transition()
      .duration(500)
      .delay((d, i) => i * 100 + 1000)
      .style('opacity', 1);
    
    // Y axis
    svg.append('g')
      .call(d3.axisLeft(y))
      .style('font-size', '12px');
  }
  
  createCareerTimeline() {
    this.clearChart();
    this.chartContainer.style.display = 'block';
    
    const data = [
      { year: 2010, company: 'Mike Shaw', role: 'Sales/BI Dev' },
      { year: 2018, company: 'Workd', role: 'Software Eng IV' },
      { year: 2021, company: 'USDA', role: 'Senior SWE' },
      { year: 2022, company: 'INFICON', role: 'Senior SWE' }
    ];
    
    const width = 350;
    const height = 200;
    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    
    const svg = d3.select(this.chartContainer)
      .append('svg')
      .attr('width', width)
      .attr('height', height);
    
    const x = d3.scaleLinear()
      .domain([2010, 2024])
      .range([margin.left, width - margin.right]);
    
    // Timeline line
    svg.append('line')
      .attr('x1', x(2010))
      .attr('y1', height / 2)
      .attr('x2', x(2010))
      .attr('y2', height / 2)
      .attr('stroke', '#0EA5E9')
      .attr('stroke-width', 3)
      .transition()
      .duration(2000)
      .attr('x2', x(2024));
    
    // Add circles and labels
    const nodes = svg.selectAll('.node')
      .data(data)
      .enter().append('g')
      .attr('transform', d => `translate(${x(d.year)}, ${height / 2})`)
      .style('opacity', 0);
    
    nodes.append('circle')
      .attr('r', 8)
      .attr('fill', '#0EA5E9')
      .attr('stroke', 'white')
      .attr('stroke-width', 2);
    
    nodes.append('text')
      .attr('y', -20)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .text(d => d.company);
    
    nodes.append('text')
      .attr('y', 35)
      .attr('text-anchor', 'middle')
      .style('font-size', '10px')
      .style('fill', '#666')
      .text(d => d.year);
    
    nodes.transition()
      .duration(500)
      .delay((d, i) => i * 300 + 1000)
      .style('opacity', 1);
  }
  
  createTechPieChart() {
    this.clearChart();
    this.chartContainer.style.display = 'block';
    
    const data = [
      { tech: 'Frontend', value: 40 },
      { tech: 'Backend', value: 30 },
      { tech: 'AI/ML', value: 20 },
      { tech: 'DevOps', value: 10 }
    ];
    
    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2 - 20;
    
    const svg = d3.select(this.chartContainer)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);
    
    const color = d3.scaleOrdinal()
      .domain(data.map(d => d.tech))
      .range(['#0EA5E9', '#38BDF8', '#7DD3FC', '#BAE6FD']);
    
    const pie = d3.pie()
      .value(d => d.value);
    
    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(radius);
    
    const arcs = svg.selectAll('.arc')
      .data(pie(data))
      .enter().append('g')
      .attr('class', 'arc');
    
    arcs.append('path')
      .attr('d', d3.arc().innerRadius(0).outerRadius(0))
      .style('fill', d => color(d.data.tech))
      .transition()
      .duration(1000)
      .attrTween('d', function(d) {
        const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function(t) {
          return arc(interpolate(t));
        };
      });
    
    // Labels
    arcs.append('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('fill', 'white')
      .style('opacity', 0)
      .text(d => `${d.data.tech} ${d.data.value}%`)
      .transition()
      .duration(500)
      .delay(1000)
      .style('opacity', 1);
  }
  
  createExperienceChart() {
    this.clearChart();
    this.chartContainer.style.display = 'block';
    
    const currentYear = new Date().getFullYear();
    const data = [
      { category: 'Total Experience', years: currentYear - 2010 },
      { category: 'Senior Roles', years: currentYear - 2021 },
      { category: 'AI/ML Focus', years: 3 },
      { category: 'Architecture Lead', years: 4 }
    ];
    
    const margin = { top: 20, right: 20, bottom: 30, left: 120 };
    const width = 350 - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;
    
    const svg = d3.select(this.chartContainer)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    const x = d3.scaleLinear()
      .domain([0, Math.max(...data.map(d => d.years))])
      .range([0, width]);
    
    const y = d3.scaleBand()
      .range([0, height])
      .domain(data.map(d => d.category))
      .padding(0.2);
    
    // Gradient
    const gradient = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'bar-gradient')
      .attr('x1', '0%')
      .attr('x2', '100%');
    
    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#0EA5E9');
    
    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#38BDF8');
    
    // Bars
    svg.selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('x', 0)
      .attr('y', d => y(d.category))
      .attr('width', 0)
      .attr('height', y.bandwidth())
      .attr('fill', 'url(#bar-gradient)')
      .attr('rx', 4)
      .transition()
      .duration(1000)
      .delay((d, i) => i * 200)
      .attr('width', d => x(d.years));
    
    // Values
    svg.selectAll('.value')
      .data(data)
      .enter().append('text')
      .attr('x', d => x(d.years) + 5)
      .attr('y', d => y(d.category) + y.bandwidth() / 2)
      .attr('dy', '.35em')
      .text(d => `${d.years} years`)
      .style('font-size', '12px')
      .style('opacity', 0)
      .transition()
      .delay((d, i) => i * 200 + 1000)
      .style('opacity', 1);
    
    // Y axis
    svg.append('g')
      .call(d3.axisLeft(y))
      .style('font-size', '12px');
  }
  
  createProjectImpactChart() {
    this.clearChart();
    this.chartContainer.style.display = 'block';
    
    const data = [
      { project: 'AI Platform', impact: 90, color: '#10B981' },
      { project: 'Monorepo Architecture', impact: 95, color: '#0EA5E9' },
      { project: 'Data Visualization', impact: 85, color: '#8B5CF6' },
      { project: 'Legacy Modernization', impact: 88, color: '#F59E0B' }
    ];
    
    const width = 350;
    const height = 350;
    const innerRadius = 60;
    const outerRadius = Math.min(width, height) / 2 - 20;
    
    const svg = d3.select(this.chartContainer)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width/2},${height/2})`);
    
    const arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(d => innerRadius + (outerRadius - innerRadius) * d.impact / 100)
      .startAngle((d, i) => i * Math.PI / 2)
      .endAngle((d, i) => (i + 1) * Math.PI / 2 - 0.05);
    
    // Arcs
    svg.selectAll('.arc')
      .data(data)
      .enter().append('path')
      .attr('class', 'arc')
      .attr('d', d => arc({...d, impact: 0}))
      .style('fill', d => d.color)
      .style('opacity', 0.8)
      .transition()
      .duration(1000)
      .delay((d, i) => i * 200)
      .attr('d', arc);
    
    // Labels
    svg.selectAll('.label')
      .data(data)
      .enter().append('text')
      .attr('transform', (d, i) => {
        const angle = i * Math.PI / 2 + Math.PI / 4;
        const r = innerRadius + (outerRadius - innerRadius) * 0.5;
        return `translate(${r * Math.cos(angle)},${r * Math.sin(angle)})`;
      })
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('fill', 'white')
      .style('font-weight', 'bold')
      .text(d => d.project)
      .style('opacity', 0)
      .transition()
      .delay(1500)
      .style('opacity', 1);
    
    // Center text
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '.35em')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('Impact')
      .style('opacity', 0)
      .transition()
      .delay(2000)
      .style('opacity', 1);
  }
  
  createGrowthChart() {
    this.clearChart();
    this.chartContainer.style.display = 'block';
    
    const data = [
      { year: 2010, level: 20 },
      { year: 2014, level: 40 },
      { year: 2018, level: 65 },
      { year: 2021, level: 80 },
      { year: 2024, level: 95 }
    ];
    
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = 350 - margin.left - margin.right;
    const height = 250 - margin.top - margin.bottom;
    
    const svg = d3.select(this.chartContainer)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    const x = d3.scaleLinear()
      .domain(d3.extent(data, d => d.year))
      .range([0, width]);
    
    const y = d3.scaleLinear()
      .domain([0, 100])
      .range([height, 0]);
    
    // Area
    const area = d3.area()
      .x(d => x(d.year))
      .y0(height)
      .y1(d => y(d.level))
      .curve(d3.curveMonotoneX);
    
    // Gradient
    const gradient = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'area-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');
    
    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#0EA5E9')
      .attr('stop-opacity', 0.8);
    
    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#0EA5E9')
      .attr('stop-opacity', 0.1);
    
    // Draw area
    svg.append('path')
      .datum(data)
      .attr('fill', 'url(#area-gradient)')
      .attr('d', area)
      .style('opacity', 0)
      .transition()
      .duration(1500)
      .style('opacity', 1);
    
    // Line
    const line = d3.line()
      .x(d => x(d.year))
      .y(d => y(d.level))
      .curve(d3.curveMonotoneX);
    
    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#0EA5E9')
      .attr('stroke-width', 3)
      .attr('d', line)
      .attr('stroke-dasharray', function() { return this.getTotalLength(); })
      .attr('stroke-dashoffset', function() { return this.getTotalLength(); })
      .transition()
      .duration(2000)
      .attr('stroke-dashoffset', 0);
    
    // Dots
    svg.selectAll('.dot')
      .data(data)
      .enter().append('circle')
      .attr('cx', d => x(d.year))
      .attr('cy', d => y(d.level))
      .attr('r', 0)
      .attr('fill', '#0EA5E9')
      .transition()
      .duration(500)
      .delay((d, i) => i * 300 + 1000)
      .attr('r', 5);
    
    // Axes
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).tickFormat(d3.format('d')))
      .style('font-size', '12px');
    
    svg.append('g')
      .call(d3.axisLeft(y))
      .style('font-size', '12px');
    
    // Title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -5)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .text('Professional Growth');
  }
  
  createLanguageChart() {
    this.clearChart();
    this.chartContainer.style.display = 'block';
    
    const data = [
      { language: 'TypeScript', proficiency: 95, projects: 50 },
      { language: 'C#/.NET', proficiency: 85, projects: 30 },
      { language: 'Python', proficiency: 70, projects: 15 },
      { language: 'SQL', proficiency: 80, projects: 40 },
      { language: 'JavaScript', proficiency: 90, projects: 45 }
    ];
    
    const margin = { top: 20, right: 60, bottom: 40, left: 60 };
    const width = 350 - margin.left - margin.right;
    const height = 250 - margin.top - margin.bottom;
    
    const svg = d3.select(this.chartContainer)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    const x = d3.scaleLinear()
      .domain([0, 100])
      .range([0, width]);
    
    const y = d3.scaleLinear()
      .domain([0, 60])
      .range([height, 0]);
    
    const size = d3.scaleLinear()
      .domain([0, 100])
      .range([5, 20]);
    
    const color = d3.scaleOrdinal()
      .domain(data.map(d => d.language))
      .range(['#0EA5E9', '#38BDF8', '#7DD3FC', '#0284C7', '#0369A1']);
    
    // Bubbles
    const bubbles = svg.selectAll('.bubble')
      .data(data)
      .enter().append('g')
      .attr('class', 'bubble')
      .attr('transform', d => `translate(${x(d.proficiency)},${y(d.projects)})`);
    
    bubbles.append('circle')
      .attr('r', 0)
      .style('fill', d => color(d.language))
      .style('opacity', 0.7)
      .transition()
      .duration(1000)
      .delay((d, i) => i * 200)
      .attr('r', d => size(d.proficiency));
    
    // Labels
    bubbles.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '.35em')
      .style('font-size', '11px')
      .style('fill', 'white')
      .style('font-weight', 'bold')
      .text(d => d.language)
      .style('opacity', 0)
      .transition()
      .delay((d, i) => i * 200 + 1000)
      .style('opacity', 1);
    
    // Axes
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .style('font-size', '11px')
      .append('text')
      .attr('x', width / 2)
      .attr('y', 35)
      .style('text-anchor', 'middle')
      .style('fill', 'black')
      .style('font-size', '12px')
      .text('Proficiency %');
    
    svg.append('g')
      .call(d3.axisLeft(y))
      .style('font-size', '11px')
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -40)
      .style('text-anchor', 'middle')
      .style('fill', 'black')
      .style('font-size', '12px')
      .text('Projects');
  }
  
  clearChart() {
    this.chartContainer.innerHTML = '';
  }
}

// Load D3.js and initialize
if (typeof window !== 'undefined') {
  if (!window.d3) {
    const script = document.createElement('script');
    script.src = 'https://d3js.org/d3.v7.min.js';
    script.onload = () => {
      document.addEventListener('DOMContentLoaded', () => {
        new AIChat();
      });
    };
    document.head.appendChild(script);
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      new AIChat();
    });
  }
}