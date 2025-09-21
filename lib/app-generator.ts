// App Generator - Creates complete Vibe App project structure
export interface AppData {
  title: string;
  description: string;
  code: {
    'App.tsx': string;
    'styles.css'?: string;
    'components.tsx'?: string;
  };
  config: {
    theme: string;
    layout: string;
    features: string[];
  };
}

// Generate complete project files
export function generateProjectFiles(appData: AppData) {
  const projectName = appData.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
  
  return {
    'package.json': generatePackageJson(projectName),
    'src/App.tsx': appData.code['App.tsx'] || generateDefaultApp(appData),
    'src/components.tsx': appData.code['components.tsx'] || generateVibeComponents(appData),
    'src/styles.css': appData.code['styles.css'] || generateGlobalStyles(appData),
    'src/index.tsx': generateIndexFile(),
    'README.md': generateReadme(appData.title, appData.description, appData.config.theme),
    'vercel.json': generateVercelConfig(),
    '.gitignore': generateGitignore()
  };
}

// Generate package.json
function generatePackageJson(projectName: string) {
  return JSON.stringify({
    name: projectName,
    version: '1.0.0',
    description: 'A beautiful Vibe App',
    scripts: {
      dev: 'bun run --hot src/index.tsx',
      build: 'bun run build',
      start: 'bun run start'
    },
    dependencies: {
      'hono': '^3.12.0',
      'react': '^18.2.0',
      'react-dom': '^18.2.0'
    },
    devDependencies: {
      '@types/react': '^18.2.0',
      '@types/react-dom': '^18.2.0',
      'typescript': '^5.0.0'
    }
  }, null, 2);
}

// Generate default App component
function generateDefaultApp(appData: AppData) {
  return `import React from 'react';
import './styles.css';

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>${appData.title}</h1>
        <p>${appData.description}</p>
      </header>
      <main className="app-main">
        <div className="feature-grid">
          ${Array.from({ length: parseInt(appData.config.layout) || 3 }, (_, i) => `
          <div className="feature-card">
            <h3>Feature ${i + 1}</h3>
            <p>Amazing functionality for your app</p>
            <button className="cta-button">Get Started</button>
          </div>`).join('')}
        </div>
      </main>
    </div>
  );
}`;
}

// Generate Vibe components
function generateVibeComponents(appData: AppData) {
  return `import React from 'react';

export function Button({ children, onClick, variant = 'primary' }) {
  return (
    <button 
      className={\`btn btn-\${variant}\`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function Card({ children, title }) {
  return (
    <div className="card">
      {title && <h3 className="card-title">{title}</h3>}
      <div className="card-content">
        {children}
      </div>
    </div>
  );
}

export function Grid({ children, columns = 3 }) {
  return (
    <div className={\`grid grid-\${columns}\`}>
      {children}
    </div>
  );
}`;
}

// Generate theme system
function generateThemeSystem(theme: string) {
  const themes = {
    minimal: {
      primary: '#000000',
      secondary: '#666666',
      accent: '#007AFF',
      background: '#FFFFFF',
      surface: '#F5F5F5'
    },
    playful: {
      primary: '#8B5CF6',
      secondary: '#A78BFA',
      accent: '#F59E0B',
      background: '#FDF2F8',
      surface: '#FFFFFF'
    },
    professional: {
      primary: '#1E40AF',
      secondary: '#3B82F6',
      accent: '#059669',
      background: '#F8FAFC',
      surface: '#FFFFFF'
    },
    artistic: {
      primary: '#DC2626',
      secondary: '#F97316',
      accent: '#7C3AED',
      background: '#FEF3C7',
      surface: '#FFFFFF'
    },
    techy: {
      primary: '#059669',
      secondary: '#10B981',
      accent: '#3B82F6',
      background: '#ECFDF5',
      surface: '#FFFFFF'
    }
  };

  return themes[theme] || themes.minimal;
}

// Generate global styles
function generateGlobalStyles(appData: AppData) {
  const theme = generateThemeSystem(appData.config.theme);
  
  return `/* Vibe App Styles - ${appData.config.theme} Theme */
:root {
  --primary: ${theme.primary};
  --secondary: ${theme.secondary};
  --accent: ${theme.accent};
  --background: ${theme.background};
  --surface: ${theme.surface};
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  background: var(--background);
  color: var(--primary);
  line-height: 1.6;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  text-align: center;
  padding: 2rem;
  background: var(--surface);
  border-bottom: 1px solid rgba(0,0,0,0.1);
}

.app-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: var(--primary);
}

.app-header p {
  font-size: 1.2rem;
  color: var(--secondary);
}

.app-main {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.feature-card {
  background: var(--surface);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  border: 1px solid rgba(0,0,0,0.05);
  transition: transform 0.2s, box-shadow 0.2s;
}

.feature-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.feature-card h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--primary);
}

.feature-card p {
  color: var(--secondary);
  margin-bottom: 1.5rem;
}

.cta-button {
  background: var(--accent);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.cta-button:hover {
  background: var(--primary);
  transform: translateY(-1px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .app-header h1 {
    font-size: 2rem;
  }
  
  .app-main {
    padding: 1rem;
  }
  
  .feature-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}`;
}

// Generate index file
function generateIndexFile() {
  return `import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}`;
}

// Generate README
function generateReadme(title: string, description: string, theme: string) {
  return `# ${title}

${description}

## 🚀 Quick Start

\`\`\`bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build
\`\`\`

## 🎨 Theme

This app uses the **${theme}** theme with a modern, responsive design.

## 📁 Project Structure

\`\`\`
src/
├── App.tsx          # Main app component
├── components.tsx   # Reusable components
├── styles.css       # Global styles and theme
└── index.tsx        # App entry point
\`\`\`

## 🛠️ Built With

- **React** - UI framework
- **Hono** - Web framework
- **Bun** - Runtime and package manager
- **TypeScript** - Type safety

## 📄 License

MIT License - feel free to use this project for your own apps!
`;
}

// Generate Vercel config
function generateVercelConfig() {
  return JSON.stringify({
    version: 2,
    builds: [
      {
        src: "src/index.tsx",
        use: "@vercel/static"
      }
    ],
    routes: [
      {
        src: "/(.*)",
        dest: "/src/index.tsx"
      }
    ]
  }, null, 2);
}

// Generate gitignore
function generateGitignore() {
  return `# Dependencies
node_modules/
bun.lockb

# Production builds
dist/
build/

# Environment variables
.env
.env.local

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*`;
}

// Generate complete project (for download)
export async function generateCompleteProject(appData: AppData) {
  return generateProjectFiles(appData);
}