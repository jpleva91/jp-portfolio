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
    downloadBtn.addEventListener('click', async () => {
      // Import the PDF generator
      const { generateResumePDF } = await import('./resume-pdf.js');
      generateResumePDF();
    });
  }
  
  // Fallback text download (keeping for reference)
  const downloadTextBtn = document.getElementById('download-resume-text');
  if (downloadTextBtn) {
    downloadTextBtn.addEventListener('click', () => {
      const resumeText = `JARED PLEVA
Staff/Principal Engineer • Platform Architect
jpleva91@gmail.com | linkedin.com/in/jared-pleva | github.com/jpleva91

SUMMARY
Senior Software Engineer with over 10 years of experience leading platform architecture, AI integrations, and cross-team technical initiatives across enterprise and government environments. Proven track record in building scalable monorepos, designing modern visualization systems, and prototyping cutting-edge agentic AI workflows. Passionate about transforming technical challenges into business value, mentoring engineers, and driving modernization efforts.

TECHNICAL HIGHLIGHTS
• Architecture & Platforms: Nx monorepos, micro-frontend architecture, modular library design, CI/CD pipelines, Angular 2–19, .NET Core
• AI/ML & Prototyping: Prompt engineering, LLM integrations (Claude, Mastra), agentic AI workflows, streaming AI pipelines
• Data & Visualization: D3.js, Highcharts, AG Grid, dynamic query builders, enterprise reporting solutions
• Cross-Functional Leadership: Team mentoring, architecture guidance, stakeholder communication, cross-team initiatives
• Business Impact: Cost reduction via technology migrations, enterprise tool adoption, modernization of legacy systems

PROFESSIONAL EXPERIENCE

INFICON — Senior Software Engineer | June 2022 – Present | Remote
• Architected and led greenfield development of a modern Nx monorepo platform for semiconductor enterprise reporting tools, defining scalable library structures, CI/CD pipelines, and versioning strategy adopted company-wide
• Designed and published reusable UI libraries, improving development velocity and consistency across multiple apps and teams
• Spearheaded prototyping of agentic AI workflows, integrating LLMs (Claude, Mastra) into real-time charting and grid solutions, influencing executive direction and securing client interest from major semiconductor partners
• Drove cost-saving initiatives by evaluating and implementing alternatives to Highcharts and AG Grid, reducing future licensing expenses while modernizing visualization capabilities
• Acted as a cross-team technical leader, providing architectural guidance, tooling improvements, and mentorship to developers across multiple initiatives
• Managed CI/CD integration and NPM package publishing for shared UI libraries, standardizing component reuse and maintaining version control discipline across teams

USDA — Senior Software Engineer | March 2021 – June 2022
• Led the strategic modernization of USDA's federal land conservation contracting system, migrating a legacy Internet Explorer platform to a modern architecture compatible with Google Chrome, ensuring regulatory compliance and securing long-term maintainability
• Served as technical lead across multiple modernization initiatives, designing full-stack solutions with .NET, Angular, and complex SQL procedures to replace aging systems
• Led architecture and platform upgrades, including micro-frontend integrations and Nx monorepo adoption, enabling modular deployments and parallel team development
• Assumed DevOps ownership, defining Git workflows, cherry-pick deployments, and collaborating directly with solutions architects to ensure reliable delivery in regulated environments
• Delivered significant process improvements, reducing manual deployment errors and accelerating development velocity in highly controlled federal contexts

Workd — Software Engineer IV | January 2018 – March 2021
• Led core platform development for enterprise CRM and ERP systems, designing a dynamic query builder enabling non-technical users to retrieve complex datasets, significantly enhancing product flexibility and client satisfaction
• Co-led the full redesign of Workd's platform UX, collaborating closely with product designers to align engineering practices with modern usability standards
• Architected inventory management solutions and an integrated email templating system, directly contributing to increased client adoption and eventual product acquisition by a major RV dealership enterprise
• Worked across the full stack with Angular, .NET, and Node.js to deliver scalable SaaS solutions for diverse industries

Mike Shaw Automotive Group — Internet Sales Director / BI Developer | November 2010 – August 2017
• Managed a 30-person sales team while simultaneously designing and implementing custom business intelligence dashboards to track sales pipelines, financial performance, and marketing effectiveness
• Designed and implemented a scalable analytics system adopted across multiple dealerships nationwide, standardizing operational reporting and performance analysis
• Led digital marketing strategies, inventory management, CRM optimizations, and cross-department process improvements, demonstrating a unique blend of technical and business leadership
• Partnered with external software vendors to architect a sales and finance analytics tool that was later deployed across multiple automotive retail locations

EDUCATION
• Master of Science, Artificial Intelligence & Machine Learning (2025) — CSU Global
• Bachelor of Science, Computer Information Systems — Metropolitan State University of Denver
• Software Engineering Immersive — General Assembly`;

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