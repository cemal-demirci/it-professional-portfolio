# IT Professional Portfolio & Tools

🚀 Modern, feature-rich IT professional portfolio and tools collection with 30+ professional tools, AI chatbots, and 3 deployment versions. Built with React 18, Vite, and Tailwind CSS.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://cemal.online)
[![React](https://img.shields.io/badge/React-18.3.1-blue?logo=react)](https://reactjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

### 🎨 Modern Design
- Clean, minimal, and fully responsive design
- Dark/Light theme with persistent preferences
- Smooth animations and transitions
- Mobile-first approach

### 🤖 AI-Powered Tools
- **Cemal AI** - Custom-branded AI using multiple providers:
  - Google Gemini API
  - Claude API (Anthropic)
  - ChatGPT API (OpenAI)
- **Premium AI Chatbots** - Advanced features:
  - 📸 Image Upload & Analysis (Gemini Vision API)
  - 🎤 Voice Recording (Web Speech API)
  - 🔊 Text-to-Speech Response Playback
  - 💾 Conversation History with Digital Passport
  - Image compression (10MB → ~1MB) with quality optimization
- **IT Question Bot** - Interactive IT support chatbot
- **Hardware Support Chat** - AI-powered hardware troubleshooting assistant
- **Event Analyzers** - AI-powered system log analysis tools
- IP-based rate limiting with Redis Cloud (Frankfurt)

> **Note**: While branded as "Cemal AI", the platform supports multiple AI model providers (Gemini, Claude, ChatGPT) for flexibility and redundancy.

### 🛠️ Professional IT Tools (30+)

#### Code Tools
- JSON Formatter & Validator
- Base64 Encoder/Decoder
- Regex Tester
- Code Minifier (JS, CSS, HTML)
- URL Encoder/Decoder

#### Security Tools
- Strong Password Generator
- Hash Generator (MD5, SHA-1, SHA-256, SHA-512, bcrypt)
- AES-256 Encryption/Decryption
- JWT Decoder & Validator
- SSL Certificate Checker

#### Text Tools
- Word Counter & Text Statistics
- Case Converter (Upper, Lower, Title, Camel, Snake)
- Markdown Editor with Live Preview
- Text Diff Viewer
- Lorem Ipsum Generator

#### Design Tools
- Color Picker with Palette Generator
- Gradient Generator
- CSS Box Shadow Generator
- Border Radius Generator

#### Network Tools
- IP Address Lookup (Geolocation, ASN, ISP)
- DNS Lookup (A, AAAA, MX, TXT, NS records)
- WHOIS Lookup
- Port Scanner
- Speed Test
- Subnet Calculator
- MAC Address Lookup
- Security Headers Checker

#### Windows Tools
- GUID/UUID Generator
- Windows Power Management Scripts
- Bloatware Removal Scripts
- System Optimization Tools

#### Utility Tools
- QR Code Generator
- Timestamp Converter
- UUID/GUID Generator
- Barcode Generator
- Unit Converter

#### PDF Tools
- PDF Merger
- PDF to Image Converter
- Image to PDF Converter
- PDF Compressor
- PDF Text Extractor (OCR with Tesseract.js)

### 🔐 Private Tools Section
- Password-protected section for authorized users
- **AI Hardware Support** - Interactive hardware troubleshooting assistant
- **System Event Analyzers** - Advanced log analysis tools
- **Technical Specifications** - Detailed hardware documentation
- **Configuration Guides** - System setup and optimization resources

### 📊 Real-Time Monitoring
- **Service Status Monitor** - Live uptime monitoring for critical services
- **Quick Speed Test** - Network speed testing widget
- Real-time API health checks

### 🌍 Internationalization
- English and Turkish language support
- Persistent language preference
- Dynamic content translation
- 100% coverage across all 7 pages and 62 tools

### 🎫 Digital Passport System
- Unique user identity (UUID-based)
- AI-style auto-generated usernames (e.g., CyberNinja#4A2F)
- Deterministic avatar colors and patterns
- Credit system with level progression (100 XP per level)
- Achievement unlocking (8 achievements)
- Conversation history (last 50 per bot)
- Import/export passport via UUID code

### 🔒 Privacy & Security
- Client-side processing for sensitive operations (encryption, hashing)
- No data sent to external servers for most tools
- GDPR-compliant cookie consent
- IP-based rate limiting for AI features
- Secure authentication for protected sections

### ⚡ Performance
- Deployed on Vercel Edge Network
- Redis Cloud (Frankfurt) for fast data access
- Optimized bundle size with code splitting
- Lazy loading for better performance

## 🏗️ Tech Stack

### Frontend
- **React 18.3.1** - UI library
- **Vite 7.x** - Build tool and dev server (latest)
- **Tailwind CSS 3.4.14** - Utility-first CSS framework
- **React Router 6** - Client-side routing
- **Lucide React** - Icon library

### Backend & Infrastructure
- **Vercel** - Hosting and serverless functions
- **Redis Cloud** - Rate limiting and message storage (Frankfurt region)
- **AI Model Providers** (Cemal AI):
  - Google Gemini API - Primary AI provider
  - Claude API (Anthropic) - Alternative provider
  - ChatGPT API (OpenAI) - Alternative provider

### Key Libraries
- **@google/generative-ai** - Gemini AI integration (Vision API)
- **crypto-js** - Encryption/decryption
- **qrcode** - QR code generation
- **markdown-it** - Markdown parsing
- **pdf-lib** - PDF manipulation
- **tesseract.js** - OCR for PDF text extraction
- **jspdf 3.x** - PDF generation (latest)
- **jwt-decode** - JWT token decoding
- **uuid** - Digital Passport ID generation
- **Web Speech API** - Voice recording and text-to-speech

## 🚀 Quick Start - Choose Your Version

We offer **3 deployment versions** to match your needs:

### 🟢 Version 1: Beginner (Minimal Setup)
**Perfect for**: Testing, personal use, no backend features
**Time**: 15 minutes
**Features**: All client-side tools work, no AI features

> **Note**: Includes time for cloning repository, installing dependencies (~10 min on average internet), and initial setup. Actual coding/configuration: ~3 min.

```bash
# 1. Clone and install
git clone https://github.com/cemal-demirci/it-professional-portfolio.git
cd it-professional-portfolio
npm install

# 2. Start development
npm run dev
# Visit: http://localhost:5173

# 3. Deploy (static only)
npm run build
# Upload 'dist' folder to any static host (Netlify, Vercel, GitHub Pages)
```

**✅ Works**: All text tools, calculators, generators, PDF tools
**❌ Doesn't work**: AI chatbots, rate limiting, contact form (requires backend)

---

### 🟡 Version 2: Intermediate (With AI)
**Perfect for**: Using AI features, small projects
**Time**: 1-2 hours
**Features**: AI chatbots + all tools

> **Realistic Time Breakdown**:
> - Repository setup & dependencies: 15 min
> - Getting Gemini API key: 10-15 min (account creation, verification)
> - Environment configuration: 10-15 min
> - Vercel deployment setup: 15-20 min
> - Testing AI features: 15-20 min
> - Troubleshooting: 10-30 min (environment variables, API keys)
> - **Total: 1-2 hours** for a working AI-powered deployment

```bash
# 1. Clone and install
git clone https://github.com/cemal-demirci/it-professional-portfolio.git
cd it-professional-portfolio
npm install

# 2. Get a free Gemini API key
# Visit: https://makersuite.google.com/app/apikey

# 3. Create .env file
cat > .env << EOF
VITE_GEMINI_API_KEY=your_gemini_api_key_here
EOF

# 4. Start development
npm run dev
# Visit: http://localhost:5173

# 5. Deploy to Vercel (free)
npm i -g vercel
vercel
# Add VITE_GEMINI_API_KEY in Vercel dashboard
```

**✅ Works**: All tools + AI chatbots (unlimited, no rate limiting)
**❌ Doesn't work**: Rate limiting, message storage (requires Redis)

---

### 🔴 Version 3: Professional (Full Stack)
**Perfect for**: Production, multiple users, full features
**Time**: 4-6 hours *(realistic estimate for complete production setup)*
**Features**: Everything enabled

> ⚠️ **Realistic Time Breakdown**:
> - Repository setup & dependencies: 15-20 min
> - Redis Cloud account & configuration: 30-45 min (signup, region selection, connection string)
> - Understanding environment variables: 20-30 min (reading docs, understanding each variable)
> - Setting up all API keys (Gemini, Redis, passwords): 25-35 min
> - Local development testing: 30-45 min
> - Vercel deployment & configuration: 30-45 min
> - Adding all environment variables to Vercel: 20-30 min
> - Testing all 60+ tools in production: 45-60 min
> - Debugging deployment issues: 30-60 min (CORS, API routes, Redis connection)
> - Fine-tuning and optimization: 20-30 min
> - **Total: 4-6 hours** for a complete, tested production deployment
>
> 📚 **If You're a Perfectionist** (like the author):
> - Reading through all source code: +3-4 hours
> - Understanding architecture & design patterns: +2-3 hours
> - Customizing colors, fonts, content: +2-3 hours
> - Testing different deployment providers: +1-2 hours
> - Adding custom features: +3-5 hours
> - **We spent months building this with 100+ hours of development**, so taking your time is completely normal! 😄

```bash
# 1. Clone and install
git clone https://github.com/cemal-demirci/it-professional-portfolio.git
cd it-professional-portfolio
npm install

# 2. Get API keys (5 min)
# - Gemini: https://makersuite.google.com/app/apikey
# - Redis: https://redis.com/try-free/ (or Railway for free built-in Redis)

# 3. Create .env file
cat > .env << EOF
# AI Features
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Backend (Redis)
REDIS_URL=redis://default:password@your-redis-host:port

# Optional Security
VITE_ADMIN_PASSWORD=your_admin_password
VITE_PRIVATE_SECTION_PASSWORD=your_password
AI_UNLIMITED_KEY=your_secret_key
VITE_AI_UNLIMITED_KEY=your_secret_key
EOF

# 4. Start development
npm run dev
# Visit: http://localhost:5173

# 5. Deploy to Railway (easiest for full-stack)
npm i -g @railway/cli
railway up
# Add environment variables in Railway dashboard
# Railway provides free Redis plugin!
```

**✅ Works**: Everything - AI, rate limiting, contact form, private section
**🎯 Best for**: Production deployment with multiple users

---

### 📋 Quick Comparison

| Feature | Beginner | Intermediate | Professional |
|---------|----------|--------------|--------------|
| All Tools | ✅ | ✅ | ✅ |
| AI Chatbots | ❌ | ✅ | ✅ |
| Rate Limiting | ❌ | ❌ | ✅ |
| Contact Form | ❌ | ❌ | ✅ |
| Private Section | ❌ | ❌ | ✅ |
| Credit System | ❌ | ❌ | ✅ |
| Setup Time | ~15 min | 1-2 hours | 4-6 hours |
| Cost | Free | Free | Free* |

*Railway/Vercel free tiers available

### Prerequisites (All Versions)
- Node.js 18+ (recommended: Node.js 20+)
- npm or yarn

## 📦 Build & Deployment

### Production Build

```bash
npm run build
```

Build artifacts will be in the `dist/` directory.

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel --prod
```

3. Configure environment variables in Vercel dashboard:
   - `VITE_GEMINI_API_KEY`
   - `REDIS_URL`
   - `AI_UNLIMITED_KEY`
   - `VITE_ADMIN_PASSWORD`
   - `VITE_PRIVATE_SECTION_PASSWORD`

### Deploy to Netlify

1. Install Netlify CLI:
```bash
npm i -g netlify-cli
```

2. Deploy:
```bash
netlify deploy --prod
```

3. Configure environment variables in Netlify dashboard or CLI:
```bash
netlify env:set VITE_GEMINI_API_KEY "your_key"
netlify env:set REDIS_URL "your_redis_url"
```

### Deploy to Railway

1. Install Railway CLI:
```bash
npm i -g @railway/cli
```

2. Deploy:
```bash
railway up
```

3. Configure environment variables:
```bash
railway variables set VITE_GEMINI_API_KEY="your_key"
railway variables set REDIS_URL="your_redis_url"
```

**Note**: Railway provides built-in Redis plugin - no external Redis needed!

### Deploy to Cloudflare Pages

1. Build the project:
```bash
npm run build
```

2. Deploy via Wrangler:
```bash
npx wrangler pages deploy dist
```

3. Configure environment variables in Cloudflare dashboard

**Note**: For serverless functions, you may need to adapt API routes to Cloudflare Workers format.

### Deploy with Docker

1. Create a `Dockerfile`:
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

2. Build and run:
```bash
docker build -t portfolio .
docker run -p 3000:3000 --env-file .env portfolio
```

### Self-Hosted Deployment

#### Nginx Configuration

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/portfolio/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # API routes (if using serverless functions)
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VITE_GEMINI_API_KEY` | Google Gemini API key for AI features | Yes (for AI) | - |
| `REDIS_URL` | Redis connection URL for rate limiting | Yes (for API) | - |
| `AI_UNLIMITED_KEY` | Secret key for unlimited AI requests | No | `change-this-secret` |
| `VITE_AI_UNLIMITED_KEY` | Frontend unlimited mode key | No | - |
| `VITE_ADMIN_PASSWORD` | Admin panel password | No | - |
| `VITE_PRIVATE_SECTION_PASSWORD` | Private section password | No | - |

### Getting API Keys

- **Gemini API Key**: Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
- **Claude API Key**: Visit [Anthropic Console](https://console.anthropic.com/)
- **ChatGPT API Key**: Visit [OpenAI Platform](https://platform.openai.com/api-keys)
- **Redis Cloud**: Sign up at [Redis Cloud](https://redis.com/try-free/) (Free tier available)
- **Alternative Redis**: You can use [Upstash Redis](https://upstash.com/), [Railway](https://railway.app/), or self-hosted Redis

## 📖 Project Structure

```
it-professional-portfolio/
├── api/                    # Vercel serverless functions
│   ├── messages.js        # Contact form handler
│   └── ratelimit.js       # AI rate limiting
├── public/                 # Static assets
│   ├── profile.jpg        # Profile photo
│   └── Cemal-Demirci-CV.pdf
├── src/
│   ├── components/        # React components
│   │   ├── Layout.jsx
│   │   ├── CommandPalette.jsx
│   │   ├── ServiceStatus.jsx
│   │   ├── QuickSpeedTest.jsx
│   │   └── ...
│   ├── pages/             # Page components
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── Tools.jsx
│   │   ├── JuniorIT.jsx
│   │   └── Settings.jsx
│   ├── tools/             # Tool implementations
│   │   ├── code/
│   │   ├── security/
│   │   ├── text/
│   │   ├── network/
│   │   ├── private/      # Password-protected tools
│   │   └── ...
│   ├── contexts/          # React contexts
│   │   └── LanguageContext.jsx
│   ├── utils/             # Utility functions
│   ├── services/          # API services
│   │   └── geminiService.js
│   └── App.jsx            # Root component
├── .env.example           # Environment variables template
├── package.json
├── tailwind.config.js
├── vite.config.js
└── vercel.json            # Vercel configuration
```

## 🎨 Customization

### Theme Colors

Edit `tailwind.config.js` to customize the color scheme:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          // ... customize colors
          900: '#1e3a8a',
        }
      }
    }
  }
}
```

### Site Settings

Configure site name, logo, and other settings through the admin panel at `/settings`.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

**Cemal Demirci**

- 🌐 Website: [cemal.online](https://cemal.online)
- 📧 Email: [me@cemal.online](mailto:me@cemal.online)
- 💼 LinkedIn: [linkedin.com/in/cemaldemirci](https://linkedin.com/in/cemaldemirci)
- 🐙 GitHub: [github.com/cemal-demirci](https://github.com/cemal-demirci)

## 🙏 Acknowledgments

- Vercel for hosting and serverless infrastructure
- Redis Cloud for fast data storage
- The React and Vite communities
- All open-source contributors
- Everyone who uses and contributes to this project

## 🔐 Security

For security concerns, please see [SECURITY.md](SECURITY.md) or contact me directly at [me@cemal.online](mailto:me@cemal.online).

---

**Built with ❤️ by Cemal Demirci**

*Powered by Cemal AI • React 18 • Vite • Tailwind CSS • Redis Cloud (Frankfurt) • Vercel Edge*
