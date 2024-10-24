const API_HOST = process.env.VITE_BACKEND_URL || 'https://api.dun.wtf';

// Получаем токен и UID из localStorage
const token = localStorage.getItem('token');
const uid = localStorage.getItem('uid'); // Предполагаем, что UID уже сохранен в localStorage

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
};

export async function apiRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
  try {
    const res = await fetch(API_HOST + '/api/' + url, { headers, ...options });
    if (!res.ok) {
      throw new Error('HTTP error, status = ' + res.status);
    }

    return await res.json();
  } catch (e) {
    console.error('Fetch error: ', e);
    throw e;
  }
}

// Пример использования UID
console.log("User UID from localStorage:", uid);

