import { NextApiRequest, NextApiResponse } from 'next';
import { put, list } from '@vercel/blob';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { title, appData } = req.body;

    const publicApp = {
      id: generateAppId(),
      title,
      theme: appData.config.theme,
      layout: appData.config.layout,
      description: appData.description,
      thumbnail: await generateThumbnail(appData),
      files: appData.files,
      createdAt: new Date().toISOString(),
      featured: false
    };

    // Save to Vercel Blob
    const blob = await put(`apps/${publicApp.id}.json`, JSON.stringify(publicApp), {
      access: 'public'
    });

    // Update public apps list
    const appsListBlob = await put('public-apps.json', 
      JSON.stringify(await getUpdatedAppsList(publicApp)), {
      access: 'public'
    });

    res.status(200).json({
      success: true,
      appId: publicApp.id,
      url: blob.url
    });

  } catch (error) {
    console.error('Save error:', error);
    res.status(500).json({ error: 'Failed to save app' });
  }
}

async function getUpdatedAppsList(newApp) {
  try {
    const currentList = await fetch(`${process.env.VERCEL_URL}/public-apps.json`);
    const apps = await currentList.json();
    return [newApp, ...apps].slice(0, 50); // Keep latest 50 apps
  } catch {
    return [newApp];
  }
}

async function generateThumbnail(appData) {
  // Generate a simple SVG thumbnail based on theme/layout
  const { theme, layout } = appData.config;
  const colors = {
    minimal: '#f8f9fa',
    playful: '#ff6b9d', 
    professional: '#3b82f6',
    artistic: '#f59e0b',
    techy: '#10b981'
  };

  return `data:image/svg+xml,${encodeURIComponent(`
    <svg width="200" height="120" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="120" fill="${colors[theme]}"/>
      <text x="100" y="60" text-anchor="middle" fill="white" font-size="14" font-family="Arial">
        ${appData.title}
      </text>
    </svg>
  `)}`;
}

function generateAppId() {
  return Math.random().toString(36).substring(2, 15);
}
