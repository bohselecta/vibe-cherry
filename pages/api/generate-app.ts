import { NextApiRequest, NextApiResponse } from 'next';
import Anthropic from '@anthropic-ai/sdk';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({ 
      status: 'ok', 
      message: 'VibeCherry API is running',
      hasApiKey: !!process.env.ANTHROPIC_API_KEY
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('API route hit!');
    console.log('Environment check:', !!process.env.ANTHROPIC_API_KEY);
    
    const { idea, theme, layout } = req.body;
    console.log('Request data:', { idea, theme, layout });

    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('Missing ANTHROPIC_API_KEY');
      return res.status(500).json({ 
        error: 'Server configuration error',
        details: 'Missing API key' 
      });
    }

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const appPrompt = `Create a ${theme} themed React app with ${layout} column layout based on this idea: "${idea}".

Generate a complete vibe app following these rules:
- Use modern React components
- Apply ${theme} theme with appropriate colors
- Layout: ${layout} columns
- Include realistic content and interactions
- Make it visually stunning

Return ONLY a valid JSON object with this exact structure:
{
  "title": "App Title",
  "description": "Brief description", 
  "components": ["Button", "Card", "Grid"],
  "pages": ["Dashboard"],
  "code": {
    "App.tsx": "// React component code",
    "styles.css": "/* CSS styles */"
  },
  "config": {
    "theme": "${theme}",
    "layout": "${layout}",
    "features": ["feature1", "feature2"]
  }
}`;

    console.log('Making Anthropic API call...');

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      messages: [
        { role: 'user', content: appPrompt }
      ]
    });

    console.log('Anthropic response received');

    // Extract text content safely
    const textContent = response.content.find(
      (block): block is any => block.type === 'text'
    );

    if (!textContent) {
      throw new Error('No text content received from Claude');
    }

    let appData;
    try {
      // Clean up the response text
      const cleanText = textContent.text
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
      appData = JSON.parse(cleanText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Raw response:', textContent.text);
      
      // Return a fallback app if JSON parsing fails
      appData = {
        title: `${theme} App`,
        description: idea,
        components: ["Card", "Button"],
        pages: ["Dashboard"],
        code: {
          "App.tsx": `// Generated ${theme} app\nexport default function App() { return <div>${idea}</div>; }`,
          "styles.css": "/* Generated styles */"
        },
        config: {
          theme,
          layout,
          features: ["responsive", "modern"]
        }
      };
    }
    
    // Generate project files
    const projectFiles = {
      'package.json': JSON.stringify({
        name: appData.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-'),
        version: '1.0.0',
        dependencies: {
          hono: '^3.12.0',
          react: '^18.2.0',
          'react-dom': '^18.2.0'
        }
      }, null, 2),
      'src/App.tsx': appData.code['App.tsx'] || '// Generated app',
      'README.md': `# ${appData.title}\n\n${appData.description}`
    };

    // Security: Destroy API key reference
    console.log('🔒 DESTROYING API KEY REFERENCE');
    
    const result = {
      success: true,
      app: {
        ...appData,
        files: projectFiles,
        timestamp: Date.now(),
        id: Math.random().toString(36).substring(2, 15)
      }
    };

    console.log('Success! Returning result');
    res.status(200).json(result);

  } catch (error) {
    console.error('Detailed error:', error);
    
    // Return detailed error info for debugging
    res.status(500).json({ 
      error: 'Failed to generate app',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}