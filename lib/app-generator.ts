export interface AppData {
  title: string;
  description: string;
  components: string[];
  pages: string[];
  code: {
    'App.tsx': string;
    'components.tsx': string;
    'styles.css': string;
  };
  config: {
    theme: string;
    layout: string;
    features: string[];
  };
}

export function generateProjectFiles(appData: AppData) {
  const { title, description, config } = appData;
  const { theme, layout } = config;

  return {
    'package.json': generatePackageJson(title),
    'devbox.json': generateDevboxConfig(),
    'src/index.tsx': generateHonoServer(),
    'src/App.tsx': appData.code['App.tsx'] || generateReactApp(theme, layout),
    'src/components/index.ts': appData.code['components.tsx'] || generateVibeComponents(),
    'src/themes/themes.ts': generateThemeSystem(),
    'static/styles/globals.css': appData.code['styles.css'] || generateGlobalStyles(),
    'deploy/cloudflare.toml': generateCloudflareConfig(title),
    'deploy/tauri.conf.json': generateTauriConfig(title),
    'README.md': generateReadme(title, description, theme), // FIX: Pass theme parameter
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
    },
    devDependencies: {
      '@types/react': '^18.2.0',
      '@types/react-dom': '^18.2.0',
      'typescript': '^5.0.0'
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
        <link rel="stylesheet" href="/static/styles/globals.css">
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

function generateReactApp(theme: string, layout: string) {
  return `import React from 'react';
import { VibeCard, VibeButton, VibeGrid } from './components';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-900 mb-4">
            Your ${theme} App
          </h1>
          <p className="text-purple-700">
            Generated with ${layout} layout and beautiful design
          </p>
        </header>
        
        <VibeGrid columns="${layout}" gap="md">
          <VibeCard>
            <h3 className="font-semibold text-purple-900 mb-2">Feature 1</h3>
            <p className="text-purple-700 mb-4">Your app feature description</p>
            <VibeButton variant="primary">Get Started</VibeButton>
          </VibeCard>
          <VibeCard>
            <h3 className="font-semibold text-purple-900 mb-2">Feature 2</h3>
            <p className="text-purple-700 mb-4">Another great feature</p>
            <VibeButton variant="secondary">Learn More</VibeButton>
          </VibeCard>
          <VibeCard>
            <h3 className="font-semibold text-purple-900 mb-2">Feature 3</h3>
            <p className="text-purple-700 mb-4">Amazing functionality</p>
            <VibeButton variant="accent">Try It</VibeButton>
          </VibeCard>
        </VibeGrid>
      </div>
    </div>
  );
}`;
}

function generateVibeComponents() {
  return `import React from 'react';

export function VibeCard({ children, className = "" }) {
  return (
    <div className={\`bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-purple-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] \${className}\`}>
      {children}
    </div>
  );
}

export function VibeButton({ variant = 'primary', size = 'md', children, onClick, className = "" }) {
  const variants = {
    primary: 'bg-purple-600 text-white hover:bg-purple-700',
    secondary: 'bg-white text-purple-900 border border-purple-200 hover:bg-purple-50',
    accent: 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button 
      onClick={onClick}
      className={\`\${variants[variant]} \${sizes[size]} rounded-lg font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95 \${className}\`}
    >
      {children}
    </button>
  );
}

export function VibeGrid({ columns = 'triple', gap = 'md', children }) {
  const gridCols = {
    single: 'grid-cols-1',
    dual: 'grid-cols-1 md:grid-cols-2',
    triple: 'grid-cols-1 md:grid-cols-3',
    quad: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };
  
  const gaps = {
    sm: 'gap-3',
    md: 'gap-6',
    lg: 'gap-8'
  };

  return (
    <div className={\`grid \${gridCols[columns]} \${gaps[gap]}\`}>
      {children}
    </div>
  );
}`;
}

function generateThemeSystem() {
  return `export const VibeThemes = {
  minimal: {
    palette: 'from-slate-50 to-gray-100',
    primary: 'bg-black text-white hover:bg-gray-800',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
    accent: 'bg-gray-900 text-white hover:bg-gray-700',
    card: 'bg-white/80 backdrop-blur-sm border border-gray-200'
  },
  playful: {
    palette: 'from-pink-100 via-purple-50 to-indigo-100',
    primary: 'bg-gradient-to-r from-pink-500 to-purple-600 text-white',
    secondary: 'bg-white/90 text-purple-900 hover:bg-white',
    accent: 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white',
    card: 'bg-white/70 backdrop-blur-md border border-purple-200/50'
  },
  professional: {
    palette: 'from-blue-50 to-indigo-100',
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-white text-blue-900 hover:bg-blue-50',
    accent: 'bg-indigo-600 text-white hover:bg-indigo-700',
    card: 'bg-white/90 backdrop-blur-sm border border-blue-200'
  }
};`;
}

function generateGlobalStyles() {
  return `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.glass-effect {
  backdrop-filter: blur(16px);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}`;
}

function generateCloudflareConfig(title: string) {
  return `name = "${title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-')}"
main = "build/index.js"
compatibility_date = "2024-01-01"

[build]
command = "bun run build"`;
}

function generateTauriConfig(title: string) {
  return JSON.stringify({
    build: {
      beforeDevCommand: 'bun run dev',
      beforeBuildCommand: 'bun run build',
      devPath: 'http://localhost:3000',
      distDir: '../build'
    },
    package: {
      productName: title,
      version: '1.0.0'
    },
    tauri: {
      bundle: {
        identifier: `com.vibestack.${title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '')}`,
        targets: 'all'
      },
      windows: [{
        title: title,
        width: 1200,
        height: 800
      }]
    }
  }, null, 2);
}

// FIX: Add theme parameter to generateReadme function
function generateReadme(title: string, description: string, theme: string) {
  return `# ${title}

${description}

## Features

- ⚡ Lightning fast with Bun
- 🎨 Beautiful ${theme} theme
- 📱 Responsive design
- 🚀 One-command deployment

## Quick Start

\`\`\`bash
# Install Devbox
curl -fsSL https://get.jetpack.io/devbox | bash

# Start development
devbox run dev
\`\`\`

## Deployment

\`\`\`bash
# Build for production
devbox run build

# Deploy to Cloudflare Workers
devbox run deploy:edge

# Build desktop app
devbox run build:desktop
\`\`\`

## Built with VibeStack

This app was generated using the VibeStack framework - the fastest way to build beautiful, deployable apps.
`;
}

function generateGitignore() {
  return `node_modules/
.next/
.env.local
.env
build/
dist/
*.log
.DS_Store`;
}

function generateTSConfig() {
  return JSON.stringify({
    compilerOptions: {
      target: 'es2017',
      lib: ['dom', 'dom.iterable', 'es6'],
      allowJs: true,
      skipLibCheck: true,
      strict: true,
      forceConsistentCasingInFileNames: true,
      noEmit: true,
      esModuleInterop: true,
      module: 'esnext',
      moduleResolution: 'node',
      resolveJsonModule: true,
      isolatedModules: true,
      jsx: 'preserve',
      incremental: true
    },
    include: ['**/*.ts', '**/*.tsx'],
    exclude: ['node_modules']
  }, null, 2);
}

function generateTailwindConfig() {
  return `module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`;
}

// Keep the original function for backward compatibility
export async function generateVibeApp(appData: any) {
  const { theme, layout, title, description } = appData;

  return {
    // Core project files
    'package.json': generatePackageJson(title),
    'devbox.json': generateDevboxConfig(),
    'src/index.tsx': generateHonoServer(),
    'src/App.tsx': generateReactApp(theme, layout),
    'src/components/index.ts': generateVibeComponents(),
    'src/themes/themes.ts': generateThemeSystem(),
    'static/styles/globals.css': generateGlobalStyles(),
    
    // Deployment configs
    'deploy/cloudflare.toml': generateCloudflareConfig(title),
    'deploy/tauri.conf.json': generateTauriConfig(title),
    'README.md': generateReadme(title, description, theme),
    
    // Development helpers
    '.gitignore': generateGitignore(),
    'tsconfig.json': generateTSConfig(),
    'tailwind.config.js': generateTailwindConfig()
  };
}

export async function generateCompleteProject(appData: any) {
  return await generateVibeApp(appData);
}