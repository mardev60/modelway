# ModelWay

<div align="center">
  <img src="mw-client/public/logo.png" alt="ModelWay Logo" width="300"/>
  <p><em>One API, All AI Models</em></p>
</div>

## 📋 Overview

ModelWay is an AI model orchestration platform that provides a unified API for accessing multiple AI models from different providers. It solves the critical challenge of AI model reliability by automatically routing requests to alternative providers when your primary model is unavailable, ensuring continuous service without any code changes.

## 🌟 Why ModelWay?

- **Single API for Multiple Models**: Access GPT-4, Claude, Llama, and more through one standardized interface
- **Automatic Failover**: Never worry about downtime - if one provider is down, your requests are automatically routed to alternatives
- **Pay-As-You-Go**: No monthly fees or commitments - only pay for the API calls you make
- **Competitive Pricing**: Transparent token-based pricing with no markup
- **Performance Monitoring**: Track latency, uptime, and other metrics across different AI providers

## 🏗️ Architecture

The project consists of two main components:

### Backend (mw-server)

A NestJS server that handles:
- Unified API endpoint for all AI model interactions
- Intelligent request routing and failover mechanisms
- Provider health monitoring and availability tracking
- Usage quota management and billing
- Request history and analytics

### Frontend (mw-client)

An Angular application that provides:
- Dashboard for monitoring model performance and availability
- Interface for testing different models side-by-side
- Usage analytics and cost tracking
- API key management and documentation
- Account settings and billing information

## ✨ Key Features

- **Model Orchestration**: Automatically route requests to the best available model based on availability and performance
- **Unified API**: One consistent API format regardless of the underlying model provider
- **Provider Redundancy**: Maintain service continuity even when specific providers experience downtime
- **Performance Metrics**: Compare latency, token pricing, and reliability across providers
- **Usage Analytics**: Track your consumption and costs across different models
- **Test Environment**: Try different models before integrating them into your application

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (for data storage)
- Firebase account (for authentication)

### Backend Setup

1. Clone the repository
   ```bash
   git clone https://github.com/mardev60/modelway.git
   cd modelway/mw-server
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Configure environment variables
   ```bash
   cp .env.example .env
   # Edit the .env file with your API keys for different providers
   ```

4. Start the development server
   ```bash
   npm run start:dev
   ```

### Frontend Setup

1. Navigate to the client folder
   ```bash
   cd ../mw-client
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Configure environment variables
   ```bash
   # Edit the files in src/environments/ with your own values
   ```

4. Start the development application
   ```bash
   npm start
   ```

5. Access the application in your browser at `http://localhost:4200`

## 🔧 Technology Stack

### Backend
- **NestJS** - Efficient Node.js server-side framework
- **Firestore** - NoSQL database and ODM
- **Firebase Admin** - For authentication and user management
- **OpenAI SDK** - For interacting with OpenAI models

### Frontend
- **Angular** - Progressive front-end framework
- **TailwindCSS** - Utility-first CSS framework
- **Angular Fire** - Firebase integration for Angular
- **FontAwesome** - Icon library

## 📊 API Usage Example

```javascript
// Example API call using ModelWay
const response = await fetch('https://api.modelway.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: 'Tell me about AI orchestration.' }
    ]
  })
});

const data = await response.json();
console.log(data.choices[0].message.content);
```

## 📄 License

This project is licensed under the [MIT License](LICENSE).

## 👥 Contributors

- [Mardev60](https://github.com/mardev60)
- [Devbutant](https://github.com/devbutant)

## 📞 Contact

For questions or suggestions, please contact us at [contact@modelway.com](mailto:makil.uspn@gmail.com).

---

<div align="center">
  <p>Built with ❤️ by us for us</p>
</div> 