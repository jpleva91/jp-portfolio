// Simple form handler for contact form
document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);
      
      // Here you would normally send the data to a server
      // For now, we'll just log it and show an alert
      console.log('Form submission:', data);
      
      alert('Thank you for your message! I\'ll get back to you soon.');
      
      // Reset form
      contactForm.reset();
    });
  }
  
  // Add smooth scroll behavior for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
  
  // Add active class to current nav item
  const currentPage = window.location.pathname;
  document.querySelectorAll('nav a').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('text-primary-600', 'font-bold');
    }
  });
  
  // Download resume handler
  const downloadBtn = document.getElementById('download-resume');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      const resumeText = `JARED PLEVA
Staff/Principal Engineer • Platform Architect
jpleva91@gmail.com | linkedin.com/in/jared-pleva | github.com/jpleva91

SUMMARY
Senior Software Engineer with over 10 years of experience in full-stack development, platform architecture, and technical leadership across enterprise and startup environments. Deep expertise in Angular, .NET, and AI integration. Currently architecting UI monorepo and platform tooling strategies at INFICON. Targeting Staff Engineer, Principal Engineer, or Platform Architect roles where I can drive technical vision and mentor engineering teams.

TECHNICAL SKILLS
Languages & Frameworks: TypeScript, JavaScript, C#, Python, Angular (v2-19), .NET Core, Node.js
AI/ML & Data: RAG Pipelines, Claude API, LangChain, MastraAI, GPT + Elasticsearch
Tools & Platform: Git, Docker, AWS, Azure DevOps, Nx, Cypress
Frontend & UI: NGRX, D3.js, AG Grid, Highcharts, Tailwind CSS

PROFESSIONAL EXPERIENCE

INFICON | Senior Software Engineer | Remote | June 2022 – Present
• Led greenfield development of enterprise dashboard in Angular 19, Nx monorepo
• Built reusable Angular libraries for cross-team consumption
• Architected Prompt-to-Chart AI agent flows with streaming LLM integration
• Drove platform engineering proposals and cost-saving prototypes
• Delivered vendor migration strategies (Highcharts → D3.js)
• Mentored developers and shaped technical architecture decisions

Intellibridge | Senior Software Engineer | March 2021 – June 2022
• Modernized USDA finance applications with Angular/.NET/SQL stack
• Led full-stack development in SAFe Agile environment
• Managed cloud deployments and CI/CD pipelines

Workd | Software Engineer IV | Jan 2018 – March 2021
• Developed healthcare CRM and property management features
• Migrated legacy APIs from .NET to Node.js
• Led implementation of encryption and security protocols

EDUCATION
M.S. Artificial Intelligence & Machine Learning - Colorado State University Global (Expected Oct 2025)
B.S. Computer Information Systems - Metropolitan State University of Denver
Software Engineering Immersive - General Assembly, Denver`;

      // Create blob and download
      const blob = new Blob([resumeText], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Jared_Pleva_Resume.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    });
  }
});