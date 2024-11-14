const API_HOST = process.env.VITE_BACKEND_URL || 'https://api.dun.wtf';

const TOKEN = localStorage.getItem('token');
const HEADERS = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${TOKEN}`,
};

export async function apiRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
  try {
    const res = await fetch(API_HOST + '/api/' + url, { headers: HEADERS, ...options });
    if (!res.ok) {
      throw new Error('HTTP error, status = ' + res.status);
    }

    return await res.json();
  } catch (e) {
    console.error('Fetch error: ', e);
    throw e;
  }
}