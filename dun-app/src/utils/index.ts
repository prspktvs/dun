export function genId(length = 20): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  return [...new Array(length)].map(() => chars[Math.floor(Math.random() * chars.length)]).join('')
}
