import { NextApiRequest, NextApiResponse } from 'next';
import Anthropic from '@anthropic-ai/sdk';
import { generateVibeApp } from '../../lib/app-generator';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { idea, theme, layout } = req.body;

    // Generate app using Anthropic API
    const appPrompt = `Create a ${theme} themed React app with ${layout} column layout based on this idea: "${idea}".

Generate a complete vibe app following these rules:
- Use VibeCard, VibeButton, VibeGrid components
- Apply ${theme} theme (${getThemeDescription(theme)})
- Layout: ${layout} columns
- Include realistic content and interactions
- Make it visually stunning with modern design

Return a JSON object with:
{
  "title": "App Title",
  "description": "Brief description", 
  "components": ["list of components used"],
  "pages": ["list of pages"],
  "code": {
    "App.tsx": "complete React component code",
    "components.tsx": "design system components",
    "styles.css": "custom styles"
  },
  "config": {
    "theme": "${theme}",
    "layout": "${layout}",
    "features": ["list of features"]
  }
}`;

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      messages: [
        { role: 'user', content: appPrompt }
      ]
    });

    const appData = JSON.parse(response.content[0].text);
    
    // Generate complete project structure
    const projectFiles = await generateVibeApp(appData);

    // Security: Destroy API key reference
    console.log('🔒 DESTROYING API KEY REFERENCE');
    
    res.status(200).json({
      success: true,
      app: {
        ...appData,
        files: projectFiles,
        timestamp: Date.now(),
        id: generateAppId()
      }
    });

  } catch (error) {
    console.error('App generation error:', error);
    res.status(500).json({ error: 'Failed to generate app' });
  }
}

function getThemeDescription(theme: string) {
  const descriptions = {
    minimal: 'clean lines, lots of white space, subtle grays',
    playful: 'bright gradients, rounded corners, vibrant colors',
    professional: 'blues and whites, structured layout, corporate feel',
    artistic: 'creative colors, unique layouts, expressive design',
    techy: 'dark mode, neon accents, futuristic elements'
  };
  return descriptions[theme] || 'modern and clean';
}

function generateAppId() {
  return Math.random().toString(36).substring(2, 15);
}
