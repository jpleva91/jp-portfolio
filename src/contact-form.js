import { analytics } from './analytics.js';

export class ContactForm {
  constructor() {
    this.form = document.getElementById('contact-form');
    this.submitButton = this.form?.querySelector('button[type="submit"]');
    this.apiUrl = import.meta.env.PROD 
      ? 'https://jp-portfolio-jared-plevas-projects.vercel.app/api/contact'
      : '/api/contact';
    
    this.init();
  }

  init() {
    if (!this.form) return;
    
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    
    // Add real-time validation
    this.form.querySelectorAll('input, textarea').forEach(field => {
      field.addEventListener('blur', () => this.validateField(field));
      field.addEventListener('input', () => this.clearError(field));
    });
  }

  validateField(field) {
    const value = field.value.trim();
    const name = field.getAttribute('name');
    
    // Remove any existing error
    this.clearError(field);
    
    // Check required
    if (!value) {
      this.showError(field, `${this.capitalize(name)} is required`);
      return false;
    }
    
    // Email validation
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        this.showError(field, 'Please enter a valid email address');
        return false;
      }
    }
    
    // Message length validation
    if (name === 'message' && value.length < 10) {
      this.showError(field, 'Message must be at least 10 characters');
      return false;
    }
    
    return true;
  }

  showError(field, message) {
    field.classList.add('border-red-500', 'focus:ring-red-500');
    
    // Create or update error message
    let errorEl = field.parentElement.querySelector('.error-message');
    if (!errorEl) {
      errorEl = document.createElement('p');
      errorEl.className = 'error-message text-red-500 text-sm mt-1';
      field.parentElement.appendChild(errorEl);
    }
    errorEl.textContent = message;
  }

  clearError(field) {
    field.classList.remove('border-red-500', 'focus:ring-red-500');
    const errorEl = field.parentElement.querySelector('.error-message');
    if (errorEl) {
      errorEl.remove();
    }
  }

  async handleSubmit(e) {
    e.preventDefault();
    
    // Validate all fields
    const fields = this.form.querySelectorAll('input, textarea');
    let isValid = true;
    
    fields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });
    
    if (!isValid) {
      this.showNotification('Please fix the errors above', 'error');
      return;
    }
    
    // Get form data
    const formData = new FormData(this.form);
    const data = Object.fromEntries(formData);
    
    // Show loading state
    this.setLoading(true);
    
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to send message');
      }
      
      // Success!
      this.showNotification(result.message || 'Message sent successfully!', 'success');
      this.form.reset();
      analytics.trackCTA('Contact Form Success');
      
      // Show success animation
      this.showSuccessAnimation();
      
    } catch (error) {
      console.error('Contact form error:', error);
      this.showNotification(
        error.message || 'Failed to send message. Please try again or email directly.',
        'error'
      );
      analytics.trackCTA('Contact Form Error');
    } finally {
      this.setLoading(false);
    }
  }

  setLoading(loading) {
    if (loading) {
      this.submitButton.disabled = true;
      this.submitButton.innerHTML = `
        <svg class="animate-spin h-5 w-5 mr-2 inline" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Sending...
      `;
    } else {
      this.submitButton.disabled = false;
      this.submitButton.innerHTML = 'Send Message';
    }
  }

  showNotification(message, type = 'info') {
    // Remove any existing notification
    const existing = document.querySelector('.contact-notification');
    if (existing) existing.remove();
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `contact-notification fixed top-4 right-4 px-6 py-4 rounded-lg shadow-lg z-50 transform transition-all duration-300 ${
      type === 'success' ? 'bg-green-500 text-white' : 
      type === 'error' ? 'bg-red-500 text-white' : 
      'bg-blue-500 text-white'
    }`;
    notification.style.transform = 'translateX(400px)';
    
    notification.innerHTML = `
      <div class="flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          ${type === 'success' ? 
            '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>' :
            type === 'error' ?
            '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>' :
            '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>'
          }
        </svg>
        <span>${message}</span>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      notification.style.transform = 'translateX(400px)';
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }

  showSuccessAnimation() {
    const formContainer = this.form.parentElement;
    formContainer.style.position = 'relative';
    
    // Create success overlay
    const overlay = document.createElement('div');
    overlay.className = 'absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10 rounded-lg';
    overlay.innerHTML = `
      <div class="text-center">
        <div class="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-scale-in">
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h3 class="text-2xl font-bold text-gray-800 mb-2">Message Sent!</h3>
        <p class="text-gray-600">I'll get back to you soon.</p>
      </div>
    `;
    
    formContainer.appendChild(overlay);
    
    // Remove after 3 seconds
    setTimeout(() => {
      overlay.classList.add('opacity-0', 'transition-opacity', 'duration-500');
      setTimeout(() => overlay.remove(), 500);
    }, 3000);
  }

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

// Initialize contact form
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new ContactForm());
  } else {
    new ContactForm();
  }
}