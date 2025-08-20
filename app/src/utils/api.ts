const API_HOST = process.env.VITE_BACKEND_URL || 'https://api.dun.wtf'

export async function apiRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(API_HOST + '/api/' + url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
    },
    ...options,
  })
  if (!res.ok) throw new Error('HTTP error, status = ' + res.status)
  return res.json()
}

export async function sendGreetingEmail(email: string, name?: string) {
  await apiRequest('mail/greeting', {
    method: 'POST',
    body: JSON.stringify({ email, name }),
  })
}