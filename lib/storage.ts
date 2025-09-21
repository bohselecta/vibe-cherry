import { put, list, del } from '@vercel/blob';

export async function saveApp(appData: any) {
  const appId = generateAppId();
  
  const publicApp = {
    id: appId,
    ...appData,
    createdAt: new Date().toISOString(),
    featured: false
  };

  // Save to Vercel Blob
  const blob = await put(`apps/${appId}.json`, JSON.stringify(publicApp), {
    access: 'public'
  });

  return { appId, url: blob.url, app: publicApp };
}

export async function getPublicApps() {
  try {
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

    return apps.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error('Error fetching public apps:', error);
    return [];
  }
}

export async function deleteApp(appId: string) {
  try {
    await del(`apps/${appId}.json`);
    return true;
  } catch (error) {
    console.error('Error deleting app:', error);
    return false;
  }
}

function generateAppId() {
  return Math.random().toString(36).substring(2, 15);
}
