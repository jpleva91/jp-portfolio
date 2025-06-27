// Skills Chart with D3.js
export class SkillsChart {
  constructor() {
    this.container = null;
    this.svg = null;
    this.width = 500;
    this.height = 500;
    this.radius = Math.min(this.width, this.height) / 2 - 60;
    this.initialized = false;
    
    this.skills = [
      { axis: "Angular/React", value: 0.95 },
      { axis: "TypeScript", value: 0.90 },
      { axis: ".NET Core", value: 0.85 },
      { axis: "AI/ML", value: 0.75 },
      { axis: "Architecture", value: 0.90 },
      { axis: "Cloud/DevOps", value: 0.80 },
      { axis: "Data Viz", value: 0.85 },
      { axis: "Leadership", value: 0.85 }
    ];
    
    this.init();
  }
  
  init() {
    // Wait for DOM
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }
  
  setup() {
    // Create container in the skills section
    const skillsSection = document.querySelector('#resume');
    if (!skillsSection) return;
    
    // Create chart container
    const chartSection = document.createElement('div');
    chartSection.className = 'skills-chart-section bg-white rounded-lg shadow-lg p-8 mb-8';
    chartSection.innerHTML = `
      <h3 class="text-2xl font-bold mb-6">Technical Proficiency</h3>
      <div class="skills-chart-container"></div>
    `;
    
    // Insert after technical skills
    const technicalSkills = skillsSection.querySelector('.bg-white:nth-child(3)');
    if (technicalSkills) {
      technicalSkills.parentNode.insertBefore(chartSection, technicalSkills.nextSibling);
    }
    
    this.container = chartSection.querySelector('.skills-chart-container');
    
    // Set up intersection observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.initialized) {
          this.initialized = true;
          this.createChart();
        }
      });
    }, { threshold: 0.5 });
    
    observer.observe(this.container);
  }
  
  createChart() {
    // Create SVG
    this.svg = d3.select(this.container)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('viewBox', `0 0 ${this.width} ${this.height}`)
      .style('max-width', '100%')
      .style('height', 'auto');
    
    const g = this.svg.append('g')
      .attr('transform', `translate(${this.width/2},${this.height/2})`);
    
    // Scales
    const angleSlice = Math.PI * 2 / this.skills.length;
    
    const rScale = d3.scaleLinear()
      .range([0, this.radius])
      .domain([0, 1]);
    
    // Grid lines
    const axisGrid = g.append('g').attr('class', 'axisWrapper');
    
    // Draw grid circles
    const levels = 5;
    for (let level = 0; level < levels; level++) {
      axisGrid.selectAll('.levels')
        .data([1])
        .enter()
        .append('circle')
        .attr('r', this.radius / levels * (level + 1))
        .style('fill', 'none')
        .style('stroke', '#ddd')
        .style('stroke-width', '1px')
        .style('opacity', 0)
        .transition()
        .duration(500)
        .delay(level * 100)
        .style('opacity', 0.7);
    }
    
    // Draw axis lines
    const axis = axisGrid.selectAll('.axis')
      .data(this.skills)
      .enter()
      .append('g')
      .attr('class', 'axis');
    
    axis.append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', (d, i) => rScale(1.1) * Math.cos(angleSlice * i - Math.PI/2))
      .attr('y2', (d, i) => rScale(1.1) * Math.sin(angleSlice * i - Math.PI/2))
      .style('stroke', '#ddd')
      .style('stroke-width', '1px')
      .style('opacity', 0)
      .transition()
      .duration(500)
      .delay((d, i) => i * 50)
      .style('opacity', 1);
    
    // Draw axis labels
    axis.append('text')
      .attr('class', 'legend')
      .style('font-size', '14px')
      .attr('text-anchor', 'middle')
      .attr('x', (d, i) => rScale(1.25) * Math.cos(angleSlice * i - Math.PI/2))
      .attr('y', (d, i) => rScale(1.25) * Math.sin(angleSlice * i - Math.PI/2))
      .text(d => d.axis)
      .style('opacity', 0)
      .transition()
      .duration(500)
      .delay((d, i) => i * 50 + 200)
      .style('opacity', 1);
    
    // Draw the radar area
    const radarLine = d3.lineRadial()
      .radius(d => rScale(d.value))
      .angle((d, i) => i * angleSlice)
      .curve(d3.curveLinearClosed);
    
    // Background area
    const blobWrapper = g.append('g').attr('class', 'radarWrapper');
    
    const radarArea = blobWrapper.selectAll('.radarArea')
      .data([this.skills])
      .enter()
      .append('path')
      .attr('class', 'radarArea')
      .attr('d', d => radarLine(d.map(p => ({...p, value: 0}))))
      .style('fill', '#0EA5E9')
      .style('fill-opacity', 0.2)
      .style('stroke', '#0EA5E9')
      .style('stroke-width', '2px')
      .transition()
      .duration(1000)
      .delay(500)
      .attr('d', radarLine);
    
    // Add dots
    blobWrapper.selectAll('.radarCircle')
      .data(this.skills)
      .enter()
      .append('circle')
      .attr('r', 4)
      .attr('cx', (d, i) => rScale(0) * Math.cos(angleSlice * i - Math.PI/2))
      .attr('cy', (d, i) => rScale(0) * Math.sin(angleSlice * i - Math.PI/2))
      .style('fill', '#0EA5E9')
      .style('fill-opacity', 0.8)
      .transition()
      .duration(1000)
      .delay((d, i) => 500 + i * 50)
      .attr('cx', (d, i) => rScale(d.value) * Math.cos(angleSlice * i - Math.PI/2))
      .attr('cy', (d, i) => rScale(d.value) * Math.sin(angleSlice * i - Math.PI/2));
    
    // Hover effects
    const tooltip = d3.select(this.container)
      .append('div')
      .attr('class', 'skills-tooltip')
      .style('opacity', 0);
    
    blobWrapper.selectAll('.radarInvisibleCircle')
      .data(this.skills)
      .enter()
      .append('circle')
      .attr('r', 8)
      .attr('cx', (d, i) => rScale(d.value) * Math.cos(angleSlice * i - Math.PI/2))
      .attr('cy', (d, i) => rScale(d.value) * Math.sin(angleSlice * i - Math.PI/2))
      .style('fill', 'transparent')
      .style('cursor', 'pointer')
      .on('mouseover', (event, d) => {
        tooltip.transition().duration(200).style('opacity', 0.9);
        tooltip.html(`${d.axis}: ${Math.round(d.value * 100)}%`)
          .style('left', (event.offsetX + 10) + 'px')
          .style('top', (event.offsetY - 28) + 'px');
      })
      .on('mouseout', () => {
        tooltip.transition().duration(500).style('opacity', 0);
      });
  }
}

// Initialize when D3 is loaded
if (typeof window !== 'undefined') {
  // Load D3.js if not already loaded
  if (!window.d3) {
    const script = document.createElement('script');
    script.src = 'https://d3js.org/d3.v7.min.js';
    script.onload = () => {
      new SkillsChart();
    };
    document.head.appendChild(script);
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      new SkillsChart();
    });
  }
}