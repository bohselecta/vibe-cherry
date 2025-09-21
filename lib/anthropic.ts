import Anthropic from '@anthropic-ai/sdk';

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function generateAppWithAnthropic(idea: string, theme: string, layout: string) {
  const prompt = `Create a ${theme} themed React app with ${layout} column layout based on this idea: "${idea}".

Generate a complete vibe app following these rules:
- Use VibeCard, VibeButton, VibeGrid components
- Apply ${theme} theme
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
      { role: 'user', content: prompt }
    ]
  });

  return JSON.parse(response.content[0].text);
}
