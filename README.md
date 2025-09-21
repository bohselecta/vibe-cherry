# 🚀 Vibe App Maker

Create beautiful, AI-generated apps in seconds. No coding required, just pure creativity.

## ✨ Features

- **🤖 AI-Powered Generation** - Uses Anthropic API to create complete, working apps
- **🎨 Apple Glass 2025 Design** - Translucent, beautiful, modern aesthetics
- **⚡ Instant Everything** - Preview generated apps immediately
- **📦 Complete Projects** - Download runnable vibe-app stack projects
- **🌐 Public Gallery** - Share and discover amazing apps
- **🔒 Security First** - Ephemeral API keys, content filtering

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- Vercel account
- Anthropic API key

### Installation

```bash
# Clone the repository
git clone https://github.com/bohselecta/vibe-cherry.git
cd vibe-cherry

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your ANTHROPIC_API_KEY to .env.local

# Run development server
npm run dev
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Add environment variables in Vercel dashboard
# ANTHROPIC_API_KEY=your_key_here
# BLOB_READ_WRITE_TOKEN=your_token_here
```

## 🎯 How It Works

1. **Describe Your Idea** - Users enter their app concept or use the ideation questionnaire
2. **Choose Theme & Layout** - Select from 5 themes and 4 layout options
3. **AI Generation** - Anthropic API creates complete, working applications
4. **Instant Preview** - See your app running immediately
5. **Download & Share** - Get complete project files or save to public gallery

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom glass effects
- **AI**: Anthropic Claude API
- **Storage**: Vercel Blob
- **Deployment**: Vercel Edge Functions
- **Generated Apps**: Bun + Hono + React stack

## 📁 Project Structure

```
vibe-app-maker/
├── components/
│   └── VibeAppMaker.tsx    # Main app component
├── pages/
│   ├── api/
│   │   ├── generate-app.ts # Anthropic API integration
│   │   ├── save-app.ts     # Public gallery storage
│   │   ├── download-app.ts # Generate ZIP downloads
│   │   └── public-apps.ts  # Fetch public apps
│   └── index.tsx           # Home page
├── lib/
│   ├── anthropic.ts        # API client
│   ├── storage.ts          # Vercel Blob integration
│   └── app-generator.ts    # Vibe app generation
└── styles/
    └── globals.css         # Global styles
```

## 🎨 Generated App Features

Each generated app includes:

- **Complete Project Structure** - Ready to run with `bun run dev`
- **Vibe Design System** - VibeCard, VibeButton, VibeGrid components
- **Theme System** - 5 beautiful themes (minimal, playful, professional, artistic, techy)
- **Deployment Configs** - Cloudflare Pages, Tauri desktop, Vercel
- **Development Tools** - TypeScript, Tailwind, hot reload

## 🔒 Security

- **Ephemeral API Keys** - Destroyed after each generation
- **Content Filtering** - Anthropic's built-in safety guardrails
- **Rate Limiting** - Vercel's built-in protection
- **Public Gallery Moderation** - Simple approval system

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Anthropic](https://anthropic.com) for the amazing Claude API
- [Vercel](https://vercel.com) for the incredible deployment platform
- [Tailwind CSS](https://tailwindcss.com) for the beautiful styling system

---

**Made with ❤️ for the Anthropic community**

*Create beautiful apps in seconds, not hours.*
