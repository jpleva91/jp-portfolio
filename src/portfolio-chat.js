export class PortfolioChat {
  constructor() {
    this.messages = [];
    this.isOpen = false;
    this.isLoading = false;
    this.apiUrl = import.meta.env.PROD 
      ? 'https://jp-portfolio-jared-plevas-projects.vercel.app/api/chat'
      : '/api/chat';
    
    this.init();
  }

  init() {
    // Create chat button
    this.createChatButton();
    
    // Create chat window
    this.createChatWindow();
    
    // Set up event listeners
    this.setupEventListeners();
  }

  createChatButton() {
    this.chatButton = document.createElement('button');
    this.chatButton.className = 'fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-all duration-300 z-50 group';
    this.chatButton.innerHTML = `
      <svg class="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
      </svg>
      <span class="absolute -top-2 -right-2 bg-green-500 text-xs px-2 py-1 rounded-full">AI</span>
    `;
    document.body.appendChild(this.chatButton);
  }

  createChatWindow() {
    this.chatWindow = document.createElement('div');
    this.chatWindow.className = 'fixed bottom-24 right-6 w-96 h-[500px] bg-white dark:bg-gray-800 rounded-lg shadow-2xl z-50 hidden flex flex-col';
    this.chatWindow.innerHTML = `
      <div class="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
        <h3 class="font-semibold">Chat with Jared's AI Assistant</h3>
        <button class="chat-close text-white hover:text-gray-200 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      
      <div class="flex-1 overflow-y-auto p-4 space-y-4" id="chat-messages">
        <div class="text-center text-gray-500 text-sm">
          <p>Ask me about Jared's experience, skills, or projects!</p>
          <p class="text-xs mt-2 text-gray-400">Powered by OpenAI GPT-4</p>
        </div>
      </div>
      
      <div class="p-4 border-t dark:border-gray-700">
        <form class="chat-form flex gap-2">
          <input 
            type="text" 
            class="chat-input flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Type your message..."
            autocomplete="off"
          />
          <button 
            type="submit" 
            class="chat-send bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </form>
      </div>
    `;
    document.body.appendChild(this.chatWindow);
    
    // Cache elements
    this.messagesContainer = this.chatWindow.querySelector('#chat-messages');
    this.chatForm = this.chatWindow.querySelector('.chat-form');
    this.chatInput = this.chatWindow.querySelector('.chat-input');
    this.chatSend = this.chatWindow.querySelector('.chat-send');
    this.chatClose = this.chatWindow.querySelector('.chat-close');
  }

  setupEventListeners() {
    // Toggle chat
    this.chatButton.addEventListener('click', () => this.toggleChat());
    this.chatClose.addEventListener('click', () => this.toggleChat());
    
    // Handle form submission
    this.chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.sendMessage();
    });
    
    // Handle enter key
    this.chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    this.chatWindow.classList.toggle('hidden');
    
    if (this.isOpen) {
      this.chatInput.focus();
      
      // Add welcome message if first time
      if (this.messages.length === 0) {
        this.addMessage("Hi! I'm Jared's AI assistant. I can tell you about his experience, skills, projects, and more. What would you like to know?", 'bot');
      }
    }
  }

  async sendMessage() {
    const message = this.chatInput.value.trim();
    if (!message || this.isLoading) return;
    
    // Add user message
    this.addMessage(message, 'user');
    this.messages.push({ role: 'user', content: message });
    
    // Clear input and disable
    this.chatInput.value = '';
    this.setLoading(true);
    
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: this.messages
        })
      });
      
      if (!response.ok) {
        if (response.status === 429) {
          const data = await response.json();
          throw new Error(`Rate limit exceeded. Try again after ${new Date(data.reset).toLocaleTimeString()}`);
        }
        throw new Error('Failed to get response');
      }
      
      // Handle streaming response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';
      const messageEl = this.addMessage('', 'bot');
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            
            try {
              const parsed = JSON.parse(data);
              if (parsed.choices?.[0]?.delta?.content) {
                assistantMessage += parsed.choices[0].delta.content;
                messageEl.textContent = assistantMessage;
                this.scrollToBottom();
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
      
      // Save assistant message
      this.messages.push({ role: 'assistant', content: assistantMessage });
      
    } catch (error) {
      console.error('Chat error:', error);
      this.addMessage(error.message || 'Sorry, I encountered an error. Please try again.', 'error');
    } finally {
      this.setLoading(false);
    }
  }

  addMessage(content, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `flex ${type === 'user' ? 'justify-end' : 'justify-start'}`;
    
    const messageBubble = document.createElement('div');
    messageBubble.className = `max-w-[80%] px-4 py-2 rounded-lg ${
      type === 'user' 
        ? 'bg-blue-600 text-white' 
        : type === 'error'
        ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }`;
    messageBubble.textContent = content;
    
    messageDiv.appendChild(messageBubble);
    this.messagesContainer.appendChild(messageDiv);
    this.scrollToBottom();
    
    return messageBubble;
  }

  scrollToBottom() {
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }

  setLoading(loading) {
    this.isLoading = loading;
    this.chatInput.disabled = loading;
    this.chatSend.disabled = loading;
    
    if (loading) {
      this.addTypingIndicator();
    } else {
      this.removeTypingIndicator();
    }
  }

  addTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator flex justify-start';
    indicator.innerHTML = `
      <div class="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
        <div class="flex space-x-2">
          <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
          <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
          <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
        </div>
      </div>
    `;
    this.messagesContainer.appendChild(indicator);
    this.scrollToBottom();
  }

  removeTypingIndicator() {
    const indicator = this.messagesContainer.querySelector('.typing-indicator');
    if (indicator) {
      indicator.remove();
    }
  }
}

// Initialize chat
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new PortfolioChat());
  } else {
    new PortfolioChat();
  }
}