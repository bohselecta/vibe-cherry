export async function generateVibeApp(appData: any) {
  const { theme, layout, title, description } = appData;

  return {
    // Core project files
    'package.json': generatePackageJson(title),
    'devbox.json': generateDevboxConfig(),
    'src/index.tsx': generateHonoServer(),
    'src/App.tsx': generateReactApp(appData),
    'src/components/index.ts': generateVibeComponents(theme),
    'src/themes/themes.ts': generateThemeSystem(),
    'static/styles/globals.css': generateGlobalStyles(theme),
    
    // Deployment configs
    'deploy/cloudflare.toml': generateCloudflareConfig(title),
    'deploy/tauri.conf.json': generateTauriConfig(title),
    'README.md': generateReadme(title, description),
    
    // Development helpers
    '.gitignore': generateGitignore(),
    'tsconfig.json': generateTSConfig(),
    'tailwind.config.js': generateTailwindConfig()
  };
}

function generatePackageJson(title: string) {
  return JSON.stringify({
    name: title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-'),
    version: '1.0.0',
    type: 'module',
    scripts: {
      dev: 'bun run --hot src/index.tsx',
      build: 'bun build src/index.tsx --outdir build --minify',
      preview: 'bun run build && bun run build/index.js'
    },
    dependencies: {
      hono: '^3.12.0',
      react: '^18.2.0',
      'react-dom': '^18.2.0',
      'lucide-react': '^0.263.1'
    }
  }, null, 2);
}

function generateDevboxConfig() {
  return JSON.stringify({
    packages: ['bun@1.0.0', 'sqlite@3.42.0'],
    shell: {
      init_hook: ['bun install'],
      scripts: {
        dev: 'bun run dev',
        build: 'bun run build',
        preview: 'bun run preview'
      }
    }
  }, null, 2);
}

function generateHonoServer() {
  return `import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { renderToString } from 'react-dom/server';
import App from './App';

const app = new Hono();

app.use('/static/*', serveStatic({ root: './' }));

app.get('/api/health', (c) => c.json({ status: 'ok', vibe: 'maximum' }));

app.get('*', (c) => {
  const html = renderToString(<App />);
  
  return c.html(\`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Vibe App</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>
        <div id="root">\${html}</div>
      </body>
    </html>
  \`);
});

export default {
  port: 3000,
  fetch: app.fetch,
};`;
}

function generateReactApp(appData: any) {
  return `import React from 'react';
import { VibeCard, VibeButton, VibeGrid } from './components';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-blue-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          ${appData.title || 'Your Vibe App'}
        </h1>
        <p className="text-white/70 text-center mb-12 max-w-2xl mx-auto">
          ${appData.description || 'A beautiful app generated with Vibe App Maker'}
        </p>
        
        <VibeGrid layout="${appData.config?.layout || 'triple'}">
          <VibeCard title="Feature 1" description="Amazing functionality" />
          <VibeCard title="Feature 2" description="Incredible features" />
          <VibeCard title="Feature 3" description="Outstanding performance" />
        </VibeGrid>
        
        <div className="text-center mt-12">
          <VibeButton>Get Started</VibeButton>
        </div>
      </div>
    </div>
  );
}`;
}

function generateVibeComponents(theme: string) {
  return `import React from 'react';

export function VibeCard({ title, description, children }) {
  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all">
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-white/70 mb-4">{description}</p>
      {children}
    </div>
  );
}

export function VibeButton({ children, onClick, ...props }) {
  return (
    <button 
      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:scale-105 transition-all"
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}

export function VibeGrid({ children, layout = 'triple' }) {
  const gridCols = {
    single: 'grid-cols-1',
    dual: 'grid-cols-2', 
    triple: 'grid-cols-3',
    quad: 'grid-cols-4'
  };
  
  return (
    <div className={\`grid \${gridCols[layout]} gap-6\`}>
      {children}
    </div>
  );
}`;
}

function generateThemeSystem() {
  return `export const themes = {
  minimal: {
    primary: '#f8f9fa',
    secondary: '#6c757d',
    accent: '#007bff'
  },
  playful: {
    primary: '#ff6b9d',
    secondary: '#4ecdc4', 
    accent: '#45b7d1'
  },
  professional: {
    primary: '#3b82f6',
    secondary: '#1e40af',
    accent: '#06b6d4'
  },
  artistic: {
    primary: '#f59e0b',
    secondary: '#ef4444',
    accent: '#8b5cf6'
  },
  techy: {
    primary: '#10b981',
    secondary: '#06b6d4',
    accent: '#8b5cf6'
  }
};`;
}

function generateGlobalStyles(theme: string) {
  return `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-black text-white;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}

@layer components {
  .glass-effect {
    @apply bg-white/5 backdrop-blur-xl border border-white/10;
  }
  
  .glass-hover {
    @apply hover:bg-white/10 hover:border-white/20 transition-all duration-300;
  }
  
  .gradient-text {
    @apply bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent;
  }
  
  .vibe-button {
    @apply px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 active:scale-95;
  }
  
  .vibe-card {
    @apply glass-effect rounded-2xl p-6 glass-hover;
  }
}`;
}

function generateCloudflareConfig(title: string) {
  return `[build]
command = "bun run build"
publish = "build"

[[env]]
name = "NODE_VERSION"
value = "18"`;
}

function generateTauriConfig(title: string) {
  return JSON.stringify({
    package: {
      productName: title,
      version: "1.0.0"
    },
    build: {
      distDir: "../build",
      devPath: "http://localhost:3000"
    },
    tauri: {
      allowlist: {
        all: false
      }
    }
  }, null, 2);
}

function generateReadme(title: string, description: string) {
  return `# ${title}

${description}

## Quick Start

\`\`\`bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build
\`\`\`

## Features

- ⚡ Lightning fast with Bun
- 🎨 Beautiful ${theme} theme
- 📱 Responsive design
- 🚀 One-command deployment

## Deployment

### Cloudflare Pages
\`\`\`bash
bun run build
# Deploy build/ folder to Cloudflare Pages
\`\`\`

### Tauri Desktop
\`\`\`bash
# Install Tauri CLI
cargo install tauri-cli

# Build desktop app
tauri build
\`\`\`

Generated with ❤️ by Vibe App Maker`;
}

function generateGitignore() {
  return `node_modules/
build/
dist/
.env
.env.local
.DS_Store
*.log`;
}

function generateTSConfig() {
  return JSON.stringify({
    compilerOptions: {
      target: "ES2020",
      lib: ["ES2020", "DOM", "DOM.Iterable"],
      allowJs: true,
      skipLibCheck: true,
      strict: true,
      forceConsistentCasingInFileNames: true,
      noEmit: true,
      esModuleInterop: true,
      module: "esnext",
      moduleResolution: "node",
      resolveJsonModule: true,
      isolatedModules: true,
      jsx: "react-jsx"
    },
    include: ["src/**/*"],
    exclude: ["node_modules"]
  }, null, 2);
}

function generateTailwindConfig() {
  return `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}`;
}

export async function generateCompleteProject(appData: any) {
  return await generateVibeApp(appData);
}
