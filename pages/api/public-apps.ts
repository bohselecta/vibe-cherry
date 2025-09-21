import { NextApiRequest, NextApiResponse } from 'next';
import { list } from '@vercel/blob';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get public apps list from Vercel Blob
    const { blobs } = await list({
      prefix: 'apps/',
      limit: 50
    });

    const apps = await Promise.all(
      blobs.map(async (blob) => {
        const response = await fetch(blob.url);
        return await response.json();
      })
    );

    res.status(200).json({
      success: true,
      apps: apps.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    });

  } catch (error) {
    console.error('Error fetching public apps:', error);
    res.status(500).json({ error: 'Failed to fetch public apps' });
  }
}
