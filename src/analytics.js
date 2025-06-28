// Analytics tracking helper
export class Analytics {
  constructor() {
    this.plausible = window.plausible || function() { 
      (window.plausible.q = window.plausible.q || []).push(arguments);
    };
  }

  // Track custom events
  track(eventName, props = {}) {
    if (typeof this.plausible === 'function') {
      this.plausible(eventName, { props });
    }
  }

  // Track navigation clicks
  trackNavClick(section) {
    this.track('Navigation Click', { section });
  }

  // Track CTA clicks
  trackCTA(action) {
    this.track('CTA Click', { action });
  }

  // Track feature usage
  trackFeature(feature) {
    this.track('Feature Used', { feature });
  }

  // Track chat interactions
  trackChat(action) {
    this.track('Chat Interaction', { action });
  }

  // Track project views
  trackProjectView(project) {
    this.track('Project View', { project });
  }

  // Track download
  trackDownload(file) {
    this.track('Download', { file });
  }

  // Track external link clicks
  trackExternalLink(url) {
    this.track('External Link', { url });
  }

  // Track scroll depth
  trackScrollDepth(percentage) {
    this.track('Scroll Depth', { depth: `${percentage}%` });
  }
}

// Initialize analytics
export const analytics = new Analytics();

// Track scroll depth
let maxScroll = 0;
const trackScroll = () => {
  const scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
  
  // Track 25%, 50%, 75%, 100% milestones
  if (scrollPercent > maxScroll) {
    maxScroll = scrollPercent;
    if ([25, 50, 75, 100].includes(scrollPercent)) {
      analytics.trackScrollDepth(scrollPercent);
    }
  }
};

// Debounce scroll tracking
let scrollTimeout;
window.addEventListener('scroll', () => {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(trackScroll, 100);
});

// Track time on page
const startTime = Date.now();
window.addEventListener('beforeunload', () => {
  const timeOnPage = Math.round((Date.now() - startTime) / 1000);
  analytics.track('Time on Page', { seconds: timeOnPage });
});