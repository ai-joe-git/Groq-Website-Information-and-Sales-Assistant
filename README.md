text
# Groq Website Information & Sales Assistant

![Groq Website Assistant](https://i.imgur.com/example-image.png)

A high-performance AI chatbot powered by Groq API that helps answer customer questions and drive sales. This lightweight, customizable solution easily integrates with any website and provides a natural, typing-effect response system.

## Features

- 💬 **Professional Chat Interface** - Beautiful, modern UI with dark mode support
- ⚡ **Groq API Integration** - Leverages Groq's ultra-fast LLM models
- ✨ **Typing Animation Effect** - Messages appear naturally, character by character
- 📱 **Fully Responsive** - Works on all devices
- 🔧 **Easily Customizable** - Adapt to your website's branding and needs
- 🌐 **Vercel Deployment Ready** - Quick deployment with API route included
- 🛡️ **Secure** - Protects your API keys

## Quick Start

### 1. Deploy the API to Vercel

1. Fork this repository
2. Deploy to [Vercel](https://vercel.com/new)
3. Add your Groq API key as an environment variable:
   - Name: `GROQ_API_KEY`
   - Value: Your Groq API key from [console.groq.com](https://console.groq.com)

### 2. Add to Your Website

Add this code to your website before the closing `</body>` tag:

<!-- Groq Website Assistant --> <script src="https://your-vercel-app.vercel.app/src/chat-widget.js"></script> <script> initGroqAssistant({ apiEndpoint: 'https://your-vercel-app.vercel.app/api/chat', companyName: 'Your Company', welcomeMessage: 'Hello! How can I help you today?', systemPrompt: `You are a helpful assistant for [Your Company]. Key information: - Product: [Your product] - Price: [Your pricing] Your job is to be helpful and informative.` }); </script>
text

That's it! The chat widget will appear on your website.

## Customization Options

You can customize the assistant with these options:

initGroqAssistant({
// Required
apiEndpoint: 'https://your-vercel-app.vercel.app/api/chat',

// Content
companyName: 'Your Company',
welcomeMessage: 'Hello! How can I help you today?',

// Appearance
theme: 'dark', // 'dark' or 'light'
position: 'right', // 'right' or 'left'
accentColor: '#2979ff',

// AI Behavior
model: 'llama-3.1-8b-instant', // or 'llama-3.3-70b-versatile'
systemPrompt: Detailed instructions for the AI assistant...
});

text

### Customizing the System Prompt

The system prompt defines how your AI assistant will behave. Here's a template for a sales-focused assistant:

systemPrompt: `You are the AI sales assistant for [Company Name].

Key product details:

[Product name]: [Brief description]

Key benefits: [List main benefits]

Pricing: [Price information]

Sales directives:

Identify customer needs

Recommend relevant products

Address objections with specific benefits

Guide users toward making a purchase

When users ask about purchasing, include this exact link:
https://your-website.com/order

Your job is to be helpful, informative, and gently persuasive.`

text

## Advanced Customization

### Custom Styling

You can add custom CSS to override any styling:

<style> .chat-button { background: #ff5722 !important; } .chat-header { background: linear-gradient(90deg, #ff5722, #ff9800) !important; } /* Add any custom styles here */ </style>
text

### Alternate Models

Choose the model that fits your needs:
- `llama-3.1-8b-instant`: Faster responses, good for most cases
- `llama-3.3-70b-versatile`: Higher quality, more capabilities, slightly slower

## Installation Examples

### Basic Example

<script src="https://your-vercel-app.vercel.app/src/chat-widget.js"></script> <script> initGroqAssistant({ apiEndpoint: 'https://your-vercel-app.vercel.app/api/chat', companyName: 'ABC Company', welcomeMessage: 'Hi there! How can I help you today?' }); </script>
text

### E-commerce Example

<script src="https://your-vercel-app.vercel.app/src/chat-widget.js"></script> <script> initGroqAssistant({ apiEndpoint: 'https://your-vercel-app.vercel.app/api/chat', companyName: 'Fashion Boutique', welcomeMessage: 'Welcome! Looking for something specific today?', theme: 'light', position: 'right', accentColor: '#d81b60', systemPrompt: `You are a shopping assistant for Fashion Boutique. Store information: - We sell premium clothing, accessories, and footwear - Free shipping on orders over $50 - 30-day returns policy Current promotions: - 20% off summer collection with code SUMMER20 Your job is to help customers find products and answer questions.` }); </script>

## Troubleshooting

### Chat widget not appearing
- Check browser console for errors
- Verify the script URL is correct
- Ensure `initGroqAssistant()` is called properly

### API errors
- Confirm your Groq API key is set correctly in Vercel
- Check the Function Logs in your Vercel dashboard
- Verify the API endpoint URL is correct

## Credits

- [Groq API](https://console.groq.com) for providing the LLM infrastructure
- Font Awesome for icons

## License

MIT License - See [LICENSE](LICENSE) file for details.
