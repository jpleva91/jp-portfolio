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
});