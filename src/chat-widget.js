/**
 * Groq Website Information & Sales Assistant
 * A lightweight, customizable AI chatbot for websites
 * 
 * @version 1.0.0
 * @license MIT
 */

(function() {
  // Default configuration
  const defaultConfig = {
    apiEndpoint: '',
    companyName: 'AI Assistant',
    welcomeMessage: 'Hello! How can I help you today?',
    theme: 'dark',
    position: 'right',
    accentColor: '#2979ff',
    headerColor: '',
    model: 'llama-3.1-8b-instant',
    systemPrompt: `You are a helpful assistant for a website. Answer questions about the company, products, or services.`
  };

  // Store the conversation history
  let conversationHistory = [];
  
  // Store the active configuration
  let activeConfig = {};

  /**
   * Initialize the chat assistant
   * @param {Object} config - Configuration options
   */
  function initGroqAssistant(config) {
    // Merge provided config with defaults
    activeConfig = {...defaultConfig, ...config};
    
    // Validate required config
    if (!activeConfig.apiEndpoint) {
      console.error('Groq Website Assistant: apiEndpoint is required');
      return;
    }
    
    // Calculate header color if not provided
    if (!activeConfig.headerColor) {
      activeConfig.headerColor = activeConfig.accentColor;
    }
    
    // Load CSS
    loadStyles();
    
    // Load Font Awesome if needed
    if (!document.querySelector('link[href*="font-awesome"]')) {
      const fontAwesome = document.createElement('link');
      fontAwesome.rel = 'stylesheet';
      fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css';
      document.head.appendChild(fontAwesome);
    }
    
    // Create the chat widget
    createChatWidget();
    
    // Initialize the functionality
    initChatFunctionality();
  }
  
  /**
   * Load the required CSS styles
   */
  function loadStyles() {
    // First, check if the CSS is already loaded
    if (document.getElementById('groq-assistant-styles')) {
      return;
    }
    
    // Try to load from the same location as the script
    const scriptElement = document.querySelector('script[src*="chat-widget.js"]');
    let cssPath = 'chat-widget.css';
    
    if (scriptElement) {
      cssPath = scriptElement.src.replace('chat-widget.js', 'chat-widget.css');
    }
    
    // Create style element
    const style = document.createElement('style');
    style.id = 'groq-assistant-styles';
    
    // Chat Widget Base Styles
    style.textContent = `
    /* Chat Widget - Base Styles */
    .chat-widget {
      position: fixed;
      bottom: 20px;
      z-index: 1000;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
      display: block;
    }
    
    .chat-position-right {
      right: 20px;
    }
    
    .chat-position-left {
      left: 20px;
    }
    
    .chat-button {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
      font-size: 24px;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      transition: all 0.3s ease;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .chat-button:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
    }
    
    .chat-container {
      position: absolute;
      bottom: 80px;
      width: 350px;
      height: 500px;
      border-radius: 16px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transform: scale(0);
      opacity: 0;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
    }
    
    .chat-position-right .chat-container {
      right: 0;
      transform-origin: bottom right;
    }
    
    .chat-position-left .chat-container {
      left: 0;
      transform-origin: bottom left;
    }
    
    .chat-container.active {
      transform: scale(1);
      opacity: 1;
    }
    
    .chat-header {
      padding: 15px 20px;
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .chat-header h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
    }
    
    .close-chat {
      background: none;
      border: none;
      color: white;
      font-size: 16px;
      cursor: pointer;
    }
    
    .chat-messages {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
    }
    
    .message {
      margin-bottom: 15px;
      padding: 12px 15px;
      border-radius: 18px;
      max-width: 85%;
      line-height: 1.5;
      font-size: 14px;
      word-wrap: break-word;
      animation: fadeIn 0.3s ease;
    }
    
    .user-message {
      align-self: flex-end;
      border-bottom-right-radius: 4px;
    }
    
    .bot-message {
      align-self: flex-start;
      border-bottom-left-radius: 4px;
    }
    
    .bot-message p {
      margin: 0 0 10px 0;
    }
    
    .bot-message p:last-child {
      margin-bottom: 0;
    }
    
    .bot-message a {
      text-decoration: underline;
    }
    
    .bot-message ul, .bot-message ol {
      margin: 10px 0;
      padding-left: 20px;
    }
    
    .bot-message li {
      margin-bottom: 5px;
    }
    
    .chat-input {
      display: flex;
      padding: 15px;
    }
    
    .chat-input input {
      flex: 1;
      padding: 12px 15px;
      border-radius: 30px;
      font-size: 14px;
    }
    
    .chat-input input:focus {
      outline: none;
    }
    
    .chat-input button {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-left: 10px;
      cursor: pointer;
      transition: all 0.3s ease;
      border: none;
    }
    
    .chat-input button:hover {
      transform: translateY(-2px);
    }
    
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .typing-indicator {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      align-self: flex-start;
      padding: 8px 15px;
      border-radius: 18px;
      border-bottom-left-radius: 4px;
    }
    
    .typing-indicator span {
      height: 8px;
      width: 8px;
      border-radius: 50%;
      display: inline-block;
      margin: 0 1px;
      opacity: 0.8;
    }
    
    .typing-indicator span:nth-child(1) {
      animation: typing 1s infinite 0s;
    }
    
    .typing-indicator span:nth-child(2) {
      animation: typing 1s infinite 0.2s;
    }
    
    .typing-indicator span:nth-child(3) {
      animation: typing 1s infinite 0.4s;
    }
    
    @keyframes typing {
      0% {
        transform: translateY(0);
        opacity: 0.8;
      }
      50% {
        transform: translateY(-5px);
        opacity: 1;
      }
      100% {
        transform: translateY(0);
        opacity: 0.8;
      }
    }
    
    /* Custom scrollbar for chat messages */
    .chat-messages::-webkit-scrollbar {
      width: 6px;
    }
    
    .chat-messages::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.05);
    }
    
    .chat-messages::-webkit-scrollbar-thumb {
      border-radius: 10px;
    }
    
    /* Highlight specific links */
    .highlight-link {
      display: inline-block;
      padding: 8px 16px;
      border-radius: 20px;
      margin: 5px 0;
      font-weight: 500;
      text-decoration: none !important;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      transition: all 0.3s ease;
    }
    
    .highlight-link:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
    }
    
    /* Dark Theme */
    .chat-theme-dark .chat-container {
      background: rgba(30, 38, 50, 0.95);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .chat-theme-dark .user-message {
      background: #2979ff;
      color: white;
    }
    
    .chat-theme-dark .bot-message {
      background: rgba(255, 255, 255, 0.08);
      color: #ffffff;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .chat-theme-dark .chat-input {
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(20, 28, 40, 0.95);
    }
    
    .chat-theme-dark .chat-input input {
      background: rgba(30, 38, 50, 0.7);
      color: #ffffff;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .chat-theme-dark .chat-input input::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
    
    .chat-theme-dark .chat-input button {
      background: #2979ff;
      color: white;
    }
    
    .chat-theme-dark .chat-input button:hover {
      background: #5393ff;
    }
    
    .chat-theme-dark .typing-indicator {
      background: rgba(255, 255, 255, 0.05);
    }
    
    .chat-theme-dark .typing-indicator span {
      background: rgba(255, 255, 255, 0.7);
    }
    
    .chat-theme-dark .chat-messages::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.3);
    }
    
    .chat-theme-dark .chat-messages::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.5);
    }
    
    .chat-theme-dark .bot-message a {
      color: #75a7ff;
    }
    
    .chat-theme-dark .bot-message a:hover {
      color: #2979ff;
    }
    
    /* Light Theme */
    .chat-theme-light .chat-container {
      background: rgba(255, 255, 255, 0.95);
      border: 1px solid rgba(0, 0, 0, 0.1);
    }
    
    .chat-theme-light .user-message {
      background: #2979ff;
      color: white;
    }
    
    .chat-theme-light .bot-message {
      background: rgba(0, 0, 0, 0.05);
      color: #333333;
      border: 1px solid rgba(0, 0, 0, 0.05);
    }
    
    .chat-theme-light .chat-input {
      border-top: 1px solid rgba(0, 0, 0, 0.1);
      background: rgba(245, 245, 245, 0.95);
    }
    
    .chat-theme-light .chat-input input {
      background: rgba(255, 255, 255, 0.9);
      color: #333333;
      border: 1px solid rgba(0, 0, 0, 0.1);
    }
    
    .chat-theme-light .chat-input input::placeholder {
      color: rgba(0, 0, 0, 0.5);
    }
    
    .chat-theme-light .chat-input button {
      background: #2979ff;
      color: white;
    }
    
    .chat-theme-light .chat-input button:hover {
      background: #5393ff;
    }
    
    .chat-theme-light .typing-indicator {
      background: rgba(0, 0, 0, 0.05);
    }
    
    .chat-theme-light .typing-indicator span {
      background: rgba(0, 0, 0, 0.5);
    }
    
    .chat-theme-light .chat-messages::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.2);
    }
    
    .chat-theme-light .chat-messages::-webkit-scrollbar-thumb:hover {
      background: rgba(0, 0, 0, 0.3);
    }
    
    .chat-theme-light .bot-message a {
      color: #1565c0;
    }
    
    .chat-theme-light .bot-message a:hover {
      color: #2979ff;
    }
    
    /* Responsive Design */
    @media (max-width: 480px) {
      .chat-container {
        width: 300px;
      }
    }
    
    @media (max-width: 380px) {
      .chat-container {
        width: 280px;
      }
    }
    `;
    
    document.head.appendChild(style);
  }
  
  /**
   * Create the chat widget HTML
   */
  function createChatWidget() {
    const chatWidget = document.createElement('div');
    chatWidget.className = `chat-widget chat-theme-${activeConfig.theme} chat-position-${activeConfig.position}`;
    
    chatWidget.innerHTML = `
      <div class="chat-button" id="chat-button" style="background: ${activeConfig.accentColor}">
        <i class="fas fa-comment"></i>
      </div>
      <div class="chat-container" id="chat-container">
        <div class="chat-header" style="background: ${activeConfig.headerColor}">
          <h3>${activeConfig.companyName}</h3>
          <button class="close-chat" id="close-chat"><i class="fas fa-times"></i></button>
        </div>
        <div class="chat-messages" id="chat-messages">
          <div class="message bot-message">
            ${activeConfig.welcomeMessage}
          </div>
        </div>
        <div class="chat-input">
          <input type="text" id="user-input" placeholder="Type your message...">
          <button id="send-button" style="background: ${activeConfig.accentColor}">
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(chatWidget);
  }

  /**
   * Initialize chat functionality
   */
  function initChatFunctionality() {
    const chatButton = document.getElementById('chat-button');
    const chatContainer = document.getElementById('chat-container');
    const closeChat = document.getElementById('close-chat');
    const sendButton = document.getElementById('send-button');
    const userInput = document.getElementById('user-input');
    const chatMessages = document.getElementById('chat-messages');
    
    // Open chat window when button is clicked
    chatButton.addEventListener('click', () => {
      chatContainer.classList.add('active');
    });
    
    // Close chat window
    closeChat.addEventListener('click', () => {
      chatContainer.classList.remove('active');
    });
    
    // Send message function
    async function sendMessage() {
      const message = userInput.value.trim();
      if (!message) return;
      
      // Add user message to chat
      addMessage('user', message, false);
      userInput.value = '';
      
      // Add to conversation history
      conversationHistory.push({
        role: 'user',
        content: message
      });
      
      // Show typing indicator
      showTypingIndicator();
      
      try {
        // Call the API endpoint
        const response = await fetch(activeConfig.apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: message,
            history: conversationHistory,
            systemPrompt: activeConfig.systemPrompt,
            model: activeConfig.model
          })
        });
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Add to conversation history
        conversationHistory.push({
          role: 'assistant',
          content: data.response
        });
        
        // Remove typing indicator and display response
        removeTypingIndicator();
        addMessage('bot', data.response, true);
        
      } catch (error) {
        console.error('Error:', error);
        removeTypingIndicator();
        addMessage('bot', 'Sorry, I encountered an error. Please try again.', false);
      }
    }
    
    // Add message to chat
    function addMessage(sender, text, withTypingEffect = false) {
      const messageDiv = document.createElement('div');
      messageDiv.className = `message ${sender}-message`;
      
      if (withTypingEffect) {
        // Format the text with proper paragraphs and links
        const formattedText = formatMessageText(text);
        
        // Add empty paragraph to start with
        messageDiv.innerHTML = '';
        chatMessages.appendChild(messageDiv);
        
        // Apply typing effect
        typeMessage(messageDiv, formattedText, 0, 10);
      } else {
        // For user messages or error messages, display immediately
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
      }
      
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
// Format message text for better readability and make links clickable
function formatMessageText(text) {
  // Escape HTML (security measure)
  text = escapeHtml(text);
  
  // Replace URLs with clickable links but exclude trailing punctuation
  text = text.replace(
    /(https?:\/\/[^\s]+?)([.,;:!?])?(\s|$)/g,
    function(match, url, punctuation, trailing) {
      return '<a href="' + url + '" target="_blank" rel="noopener noreferrer">' + url + '</a>' + (punctuation || '') + trailing;
    }
  );
  
  // Add paragraph breaks for better readability
  text = text.replace(/\n/g, '<br>');
  
  // Wrap in paragraph tags if not already
  if (!text.startsWith('<p>')) {
    text = '<p>' + text;
  }
  
  if (!text.endsWith('</p>')) {
    text = text + '</p>';
  }
  
  return text;
}

    
    // Helper function to escape HTML
    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
    
    // Typing effect function
    function typeMessage(element, text, index, speed) {
      if (index < text.length) {
        element.innerHTML = text.substring(0, index + 1);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Handle HTML tags so they don't disrupt the typing effect
        if (text.charAt(index) === '<') {
          // Find the closing bracket of the tag
          const closeIndex = text.indexOf('>', index);
          if (closeIndex !== -1) {
            // Skip to after the tag
            index = closeIndex;
          }
        }
        
        setTimeout(function() {
          typeMessage(element, text, index + 1, speed);
        }, speed);
      }
    }
    
    // Show typing indicator
    function showTypingIndicator() {
      const indicatorDiv = document.createElement('div');
      indicatorDiv.className = 'typing-indicator';
      indicatorDiv.innerHTML = '<span></span><span></span><span></span>';
      indicatorDiv.id = 'typing-indicator';
      chatMessages.appendChild(indicatorDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Remove typing indicator
    function removeTypingIndicator() {
      const indicator = document.getElementById('typing-indicator');
      if (indicator) {
        indicator.remove();
      }
    }
    
    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    
    userInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
  }

  // Expose the initialization function globally
  window.initGroqAssistant = initGroqAssistant;
})();
