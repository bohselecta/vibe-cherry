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

async function createProjectZip(files) {
  // Simple zip creation (you'd use a proper zip library in production)
  const JSZip = require('jszip');
  const zip = new JSZip();

  // Add all project files
  Object.entries(files).forEach(([path, content]) => {
    zip.file(path, content);
  });

  return await zip.generateAsync({ type: 'nodebuffer' });
}
