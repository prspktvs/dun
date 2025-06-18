import { DUN_URL } from '../constants'

export function genId(length = 20): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  return [...new Array(length)].map(() => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export const getRandomProjectRoute = () => `/${genId()}`

export const generateInviteLink = (projectId: string): string => DUN_URL + `/${projectId}?inviteToken=${genId(30)}`

export function extractCardPath(input: string): string | null {
  const regex = /([^\/]+)\/cards\/([^\/]+)/
  const match = input.match(regex)

  if (match) {
    const projectId = match[1]
    const cardId = match[2]

    return `${projectId}/cards/${cardId}`
  }

  return null
}

export function getWsUrl(url: string) {
  const protocol = url.includes('https') ? 'wss' : 'ws'
  return url.replace(/^https?:\/\//, `${protocol}://`)
}
