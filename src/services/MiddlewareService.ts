import axios from 'axios';

const middlewareClient = axios.create({
  baseURL: 'https://localhost:8443',
  headers: {
    'Content-Type': 'application/json'
  }
});

export interface Certificate {
  name: string;
  token: string;
}

export async function checkMiddlewareStatus(): Promise<boolean> {
  try {
    const response = await middlewareClient.get('/api/status');
    return response.status === 200;
  } catch (error) {
    console.error('Middleware service not available:', error);
    return false;
  }
}

export async function getCertificates(): Promise<string[] | undefined> {
  try {
    const response = await middlewareClient.get('/api/tokens');
    return response.data;
  } catch (error) {
    console.error('Failed to get certificates:', error);
  }
}

export async function getPublicKey(token: string): Promise<string | undefined> {
  try {
    const response = await middlewareClient.get(`/api/public-key?token=${token}`, {
      responseType: 'text',
      headers: {
        'Accept': 'text/plain'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to get public key:', error);
  }
}

export async function downloadDecrypted(
  fileId: number,
  tokenName: string,
): Promise<void> {
  const accessToken = localStorage.getItem('access_token')!;
  // call middleware, passing through your auth cookie / JWT
  const { data: blob, headers } = await middlewareClient.get(
    `/api/decrypt/file/${fileId}?token=${encodeURIComponent(tokenName)}`,
    {
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );

  // pull the filename back out of the Content-Disposition
  console.log('Headers:', JSON.stringify(headers, null, 2));
  const contentDisposition = headers['content-disposition']
  const filename = contentDisposition.split('; ')[1].replace('filename=', '').replaceAll('"', '')

  // download as usual
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
