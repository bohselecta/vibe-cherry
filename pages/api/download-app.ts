import { NextApiRequest, NextApiResponse } from 'next';
import { generateCompleteProject } from '../../lib/app-generator';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { appData } = req.body;

    // Generate complete project with our vibe-app stack
    const projectFiles = await generateCompleteProject(appData);

    // Create ZIP file structure
    const zipData = await createProjectZip(projectFiles);

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${appData.title.replace(/[^a-zA-Z0-9]/g, '-')}-vibe-app.zip"`);
    
    res.send(zipData);

  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Failed to generate download' });
  }
}

async function createProjectZip(files: Record<string, string>) {
  // For now, return a simple text file with all the code
  // In production, you'd use a proper zip library like JSZip
  const projectContent = Object.entries(files)
    .map(([path, content]) => `\n\n=== ${path} ===\n${content}`)
    .join('');

  return Buffer.from(projectContent, 'utf8');
}
