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
