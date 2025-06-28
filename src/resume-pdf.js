// Resume PDF generator
export function generateResumePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  // Colors
  const primaryColor = [14, 165, 233]; // Tailwind primary-600
  const textColor = [55, 65, 81]; // Tailwind gray-700
  const headerColor = [17, 24, 39]; // Tailwind gray-900
  
  let yPosition = 20;
  const leftMargin = 20;
  const rightMargin = 190;
  const lineHeight = 7;
  const sectionGap = 10;
  
  // Helper functions
  const addText = (text, size, style = 'normal', color = textColor) => {
    doc.setFontSize(size);
    doc.setTextColor(...color);
    doc.setFont('helvetica', style);
    doc.text(text, leftMargin, yPosition);
    yPosition += lineHeight;
  };
  
  const addBullet = (text) => {
    // Check if we need a new page before adding bullet
    if (yPosition > 260) {
      doc.addPage();
      yPosition = 20;
    }
    
    const lines = doc.splitTextToSize(text, rightMargin - leftMargin - 10);
    doc.setFontSize(10);
    doc.setTextColor(...textColor);
    doc.text('•', leftMargin + 5, yPosition);
    doc.text(lines, leftMargin + 10, yPosition);
    yPosition += lines.length * 5 + 2;
  };
  
  const addSection = (title) => {
    yPosition += sectionGap;
    doc.setFontSize(14);
    doc.setTextColor(...primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text(title, leftMargin, yPosition);
    // Add underline
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    doc.line(leftMargin, yPosition + 2, rightMargin, yPosition + 2);
    yPosition += lineHeight + 3;
  };
  
  // Header
  doc.setFontSize(24);
  doc.setTextColor(...headerColor);
  doc.setFont('helvetica', 'bold');
  doc.text('JARED PLEVA', leftMargin, yPosition);
  yPosition += 10;
  
  doc.setFontSize(14);
  doc.setTextColor(...primaryColor);
  doc.text('Staff/Principal Engineer • Platform Architect', leftMargin, yPosition);
  yPosition += 8;
  
  doc.setFontSize(10);
  doc.setTextColor(...textColor);
  doc.text('jpleva91@gmail.com | linkedin.com/in/jared-pleva | github.com/jpleva91', leftMargin, yPosition);
  yPosition += lineHeight - 2;
  doc.text('Portfolio: jpleva91.github.io/jp-portfolio', leftMargin, yPosition);
  yPosition += lineHeight;
  
  // Summary
  addSection('SUMMARY');
  const summaryText = 'Senior Software Engineer with over 10 years of experience leading platform architecture, AI integrations, and cross-team technical initiatives across enterprise and government environments. Proven track record in building scalable monorepos, designing modern visualization systems, and prototyping cutting-edge agentic AI workflows. Passionate about transforming technical challenges into business value, mentoring engineers, and driving modernization efforts.';
  const summaryLines = doc.splitTextToSize(summaryText, rightMargin - leftMargin);
  doc.setFontSize(10);
  doc.setTextColor(...textColor);
  doc.text(summaryLines, leftMargin, yPosition);
  yPosition += summaryLines.length * 5;
  
  // Technical Highlights
  addSection('TECHNICAL HIGHLIGHTS');
  const skills = [
    'Architecture & Platforms: Nx monorepos, micro-frontend architecture, modular library design, CI/CD pipelines',
    'AI/ML & Prototyping: Prompt engineering, LLM integrations (Claude, Mastra), agentic AI workflows',
    'Data & Visualization: D3.js, Highcharts, AG Grid, dynamic query builders, enterprise reporting',
    'Cross-Functional Leadership: Team mentoring, architecture guidance, stakeholder communication',
    'Business Impact: Cost reduction via technology migrations, enterprise tool adoption, modernization'
  ];
  
  skills.forEach(skill => {
    addBullet(skill);
  });
  
  // Professional Experience
  addSection('PROFESSIONAL EXPERIENCE');
  
  // INFICON
  doc.setFontSize(12);
  doc.setTextColor(...headerColor);
  doc.setFont('helvetica', 'bold');
  doc.text('INFICON — Senior Software Engineer', leftMargin, yPosition);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('June 2022 – Present | Remote', rightMargin - 60, yPosition);
  yPosition += lineHeight;
  
  const inficonBullets = [
    'Architected and led greenfield development of modern Nx monorepo platform for semiconductor enterprise reporting tools, defining scalable library structures and CI/CD pipelines adopted company-wide',
    'Designed and published reusable UI libraries, improving development velocity and consistency across multiple apps and teams',
    'Spearheaded prototyping of agentic AI workflows, integrating LLMs into real-time charting solutions for enterprise clients',
    'Evaluated and implemented modern alternatives to Highcharts and AG Grid for improved performance and visualization',
    'Acted as cross-team technical leader, providing architectural guidance and mentorship across multiple initiatives'
  ];
  
  inficonBullets.forEach(bullet => {
    addBullet(bullet);
  });
  
  // Check if we need a new page before USDA section
  if (yPosition > 200) {
    doc.addPage();
    yPosition = 20;
  }
  
  // USDA
  yPosition += 5;
  doc.setFontSize(12);
  doc.setTextColor(...headerColor);
  doc.setFont('helvetica', 'bold');
  doc.text('USDA — Senior Software Engineer', leftMargin, yPosition);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('March 2021 – June 2022', rightMargin - 50, yPosition);
  yPosition += lineHeight;
  
  const usdaBullets = [
    'Led strategic modernization of federal land conservation system, migrating legacy IE platform to modern Chrome-compatible architecture',
    'Served as technical lead across multiple modernization initiatives, designing full-stack solutions with .NET, Angular, and SQL',
    'Led architecture upgrades including micro-frontend integrations and Nx monorepo adoption',
    'Assumed DevOps ownership, defining Git workflows and deployment strategies in regulated federal environments'
  ];
  
  usdaBullets.forEach(bullet => {
    addBullet(bullet);
  });
  
  // Workd
  yPosition += 5;
  doc.setFontSize(12);
  doc.setTextColor(...headerColor);
  doc.setFont('helvetica', 'bold');
  doc.text('Workd — Software Engineer IV', leftMargin, yPosition);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Jan 2018 – March 2021', rightMargin - 50, yPosition);
  yPosition += lineHeight;
  
  const workdBullets = [
    'Led core platform development for enterprise CRM/ERP systems, designing dynamic query builder for non-technical users',
    'Co-led full redesign of platform UX, aligning engineering practices with modern usability standards',
    'Architected inventory management and email templating systems, contributing to product acquisition'
  ];
  
  workdBullets.forEach(bullet => {
    addBullet(bullet);
  });
  
  // Check if we need a new page before Mike Shaw section
  if (yPosition > 180) {
    doc.addPage();
    yPosition = 20;
  }
  
  // Mike Shaw Automotive
  yPosition += 5;
  doc.setFontSize(12);
  doc.setTextColor(...headerColor);
  doc.setFont('helvetica', 'bold');
  doc.text('Mike Shaw Automotive — Internet Sales Director / BI Developer', leftMargin, yPosition);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Nov 2010 – Aug 2017', rightMargin - 45, yPosition);
  yPosition += lineHeight;
  
  const mikeShawBullets = [
    'Managed 30-person sales team while designing custom business intelligence dashboards for sales, finance, and marketing',
    'Designed and implemented scalable analytics system adopted across multiple dealerships nationwide',
    'Led digital marketing strategies, inventory management, CRM optimizations, and cross-department process improvements',
    'Partnered with vendors to architect sales and finance analytics tool deployed across multiple automotive retail locations'
  ];
  
  mikeShawBullets.forEach(bullet => {
    addBullet(bullet);
  });
  
  // Check if we need a new page before Education section
  if (yPosition > 200) {
    doc.addPage();
    yPosition = 20;
  }
  
  // Education
  addSection('EDUCATION');
  doc.setFontSize(11);
  doc.setTextColor(...headerColor);
  doc.setFont('helvetica', 'bold');
  doc.text('M.S. Artificial Intelligence & Machine Learning', leftMargin, yPosition);
  doc.setFont('helvetica', 'normal');
  doc.text(' — CSU Global (2025)', leftMargin + 95, yPosition);
  yPosition += 6;
  
  doc.setFont('helvetica', 'bold');
  doc.text('B.S. Computer Information Systems', leftMargin, yPosition);
  doc.setFont('helvetica', 'normal');
  doc.text(' — Metropolitan State University of Denver', leftMargin + 75, yPosition);
  yPosition += 6;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Software Engineering Immersive', leftMargin, yPosition);
  doc.setFont('helvetica', 'normal');
  doc.text(' — General Assembly', leftMargin + 65, yPosition);
  
  // Save the PDF
  doc.save('Jared_Pleva_Resume.pdf');
}