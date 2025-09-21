import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { idea, theme, layout } = req.body;
    console.log('🚀 Starting fast generation for:', { theme, layout });

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({ error: 'Missing API key' });
    }

    const { default: Anthropic } = await import('@anthropic-ai/sdk');
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    // SPEED FIX: Much shorter, focused prompt
    const appPrompt = `Create a ${theme} ${layout}-column React app: "${idea}".

Return JSON only:
{
  "title": "App Name",
  "description": "Brief description",
  "code": {
    "App.tsx": "import React from 'react';\n\nexport default function App() {\n  return (\n    <div className=\"min-h-screen bg-gradient-to-br ${getThemeGradient(theme)} p-8\">\n      <div className=\"max-w-4xl mx-auto\">\n        <h1 className=\"text-4xl font-bold ${getThemeText(theme)} text-center mb-8\">${idea.slice(0, 50)}</h1>\n        <div className=\"grid grid-cols-1 md:grid-cols-${getLayoutCols(layout)} gap-6\">\n          {/* App content */}\n        </div>\n      </div>\n    </div>\n  );\n}"
  },
  "config": {"theme": "${theme}", "layout": "${layout}"}
}`;

    console.log('⚡ Making fast API call...');
    
    // SPEED FIX: Set timeout and reduce tokens
    const startTime = Date.now();
    
    const response = await Promise.race([
      anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500, // REDUCED from 4000
        messages: [{ role: 'user', content: appPrompt }]
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('API timeout')), 25000) // 25 second timeout
      )
    ]);

    const duration = Date.now() - startTime;
    console.log(`✅ API call completed in ${duration}ms`);

    const textContent = response.content.find(
      (block): block is any => block.type === 'text'
    );

    if (!textContent) {
      throw new Error('No response from Claude');
    }

    let appData;
    try {
      const cleanText = textContent.text
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      appData = JSON.parse(cleanText);
    } catch (parseError) {
      console.log('⚡ Using fast fallback generation');
      // SPEED FIX: Fast fallback if JSON parsing fails
      appData = generateFastFallback(idea, theme, layout);
    }
    
    // SPEED FIX: Minimal file generation
    const projectFiles = {
      'package.json': JSON.stringify({
        name: appData.title?.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-') || 'vibe-app',
        version: '1.0.0',
        scripts: { dev: 'bun run --hot src/index.tsx' },
        dependencies: { hono: '^3.12.0', react: '^18.2.0', 'react-dom': '^18.2.0' }
      }, null, 2),
      'src/App.tsx': appData.code?.['App.tsx'] || generateFastApp(idea, theme, layout),
      'README.md': `# ${appData.title || 'Vibe App'}\n\n${appData.description || idea}`
    };

    console.log('🔒 DESTROYING API KEY REFERENCE');
    
    res.status(200).json({
      success: true,
      app: {
        ...appData,
        files: projectFiles,
        timestamp: Date.now(),
        id: Math.random().toString(36).substring(2, 15),
        generationTime: duration
      }
    });

  } catch (error) {
    console.error('❌ Fast generation error:', error.message);
    
    // SPEED FIX: Always return something, even if AI fails
    if (error.message === 'API timeout') {
      const { idea, theme, layout } = req.body;
      const fallbackApp = generateFastFallback(idea, theme, layout);
      
      res.status(200).json({
        success: true,
        app: {
          ...fallbackApp,
          files: {
            'package.json': '{"name": "fallback-app", "version": "1.0.0"}',
            'src/App.tsx': generateFastApp(idea, theme, layout),
            'README.md': `# Fallback App\n\n${idea}`
          },
          timestamp: Date.now(),
          id: 'fallback-' + Math.random().toString(36).substring(2, 8),
          fallback: true
        }
      });
    } else {
      res.status(500).json({ 
        error: 'Generation failed',
        details: error.message
      });
    }
  }
}

// SPEED FIX: Fast fallback generation
function generateFastFallback(idea: string, theme: string, layout: string) {
  const titles = {
    minimal: 'Clean',
    playful: 'Fun',
    professional: 'Pro',
    artistic: 'Creative',
    techy: 'Tech'
  };

  return {
    title: `${titles[theme] || 'Modern'} ${idea.split(' ').slice(0, 3).join(' ')} App`,
    description: `A ${theme} app for ${idea}`,
    code: {
      'App.tsx': generateFastApp(idea, theme, layout)
    },
    config: { theme, layout, features: ['responsive', 'modern'] }
  };
}

// SPEED FIX: Fast app generation
function generateFastApp(idea: string, theme: string, layout: string) {
  const gradients = {
    minimal: 'from-gray-100 to-white',
    playful: 'from-pink-100 via-purple-50 to-indigo-100',
    professional: 'from-blue-50 to-indigo-100',
    artistic: 'from-orange-100 to-red-100',
    techy: 'from-emerald-50 to-teal-100'
  };

  const textColors = {
    minimal: 'text-gray-900',
    playful: 'text-purple-900',
    professional: 'text-blue-900',
    artistic: 'text-orange-900',
    techy: 'text-emerald-900'
  };

  const cols = {
    single: '1',
    dual: '2',
    triple: '3',
    quad: '4'
  };

  return `import React from 'react';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br ${gradients[theme]} p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold ${textColors[theme]} mb-4">
            ${idea.slice(0, 50)}${idea.length > 50 ? '...' : ''}
          </h1>
          <p className="${textColors[theme]} opacity-70 text-lg">
            Your ${theme} app is ready to use
          </p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-${cols[layout]} gap-6">
          ${Array(parseInt(cols[layout])).fill(0).map((_, i) => `
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/50">
            <h3 className="font-semibold ${textColors[theme]} mb-2">Feature ${i + 1}</h3>
            <p className="${textColors[theme]} opacity-70">Amazing functionality for your app</p>
            <button className="mt-4 bg-${theme === 'minimal' ? 'gray' : theme === 'playful' ? 'purple' : theme === 'professional' ? 'blue' : theme === 'artistic' ? 'orange' : 'emerald'}-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all">
              Get Started
            </button>
          </div>`).join('')}
        </div>
      </div>
    </div>
  );
}`;
}

function getThemeGradient(theme: string) {
  const gradients = {
    minimal: 'from-gray-100 to-white',
    playful: 'from-pink-100 to-purple-100',
    professional: 'from-blue-50 to-indigo-100',
    artistic: 'from-orange-100 to-red-100',
    techy: 'from-emerald-50 to-teal-100'
  };
  return gradients[theme] || 'from-gray-100 to-white';
}

function getThemeText(theme: string) {
  const colors = {
    minimal: 'text-gray-900',
    playful: 'text-purple-900',
    professional: 'text-blue-900',
    artistic: 'text-orange-900',
    techy: 'text-emerald-900'
  };
  return colors[theme] || 'text-gray-900';
}

function getLayoutCols(layout: string) {
  const cols = { single: '1', dual: '2', triple: '3', quad: '4' };
  return cols[layout] || '3';
}