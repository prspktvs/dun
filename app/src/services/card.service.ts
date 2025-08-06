import {
  getFirestore,
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  arrayUnion,
  updateDoc,
} from 'firebase/firestore'

import { ICard } from '../types/Card'
import { IFile } from '../types/File'
import { genId } from '../utils'
import { db } from '../config/firebase'
import { apiRequest } from '../utils/api'

const BACKEND_URL = process.env.VITE_BACKEND_URL || 'https://api.dun.wtf'

export const getCardById = async (cardId: string): Promise<ICard | null> => {
  if (!cardId) return null
  
  const res = await apiRequest<ICard>(`cards/${cardId}`)
  return res
}

export const createCard = async (projectId: string, card: Partial<ICard>): Promise<ICard | null> => {
  if (!projectId) return null


  const res = await apiRequest<ICard>(`cards`, { 
    method: 'POST',
    body: JSON.stringify({ ...card, projectId })
  })

  return res
}

export const updateCard = async (
  card: Partial<ICard>,
): Promise<ICard | null> => {
  if (!card.id) return null

  const res = await apiRequest<ICard>(`cards/${card.id}`, {
    method: 'PATCH', 
    body: JSON.stringify(card)
  })


  return res
}

export const removeCard = async (cardId: string) => {
  if (!cardId) return null

  await apiRequest(`cards/${cardId}`, { method: 'DELETE' })
}

export const getProjectCards = async (projectId: string, sortedBy = 'created'): Promise<ICard[]> => {
  if (!projectId) return []
  
  const res = await apiRequest<ICard[]>(`cards?projectId=${projectId}&sort=${sortedBy}`)
  return res
}

export const shareCard = async (cardId: string, userIds: string[]) => {
  if (!cardId) return null

  await apiRequest(`cards/${cardId}/share`, {
    method: 'POST',
    body: JSON.stringify({ userIds })
  })
}

export const unshareCard = async (cardId: string, userId: string) => {
  if (!cardId || !userId) return null

  await apiRequest(`cards/${cardId}/share/${userId}`, {
    method: 'DELETE',
  })
}


export const getCardFiles = async (cardId: string): Promise<IFile[]> => {
  if (!cardId) return []
  
  try {
    const res = await apiRequest<IFile[]>(`cards/${cardId}/files`)
    return res || []
  } catch (error) {
    console.error('Error getting card files:', error)
    return []
  }
}

export const addFilesToCard = async (cardId: string, files: IFile[]): Promise<{ files: IFile[], addedCount: number } | null> => {
  if (!cardId || !files || files.length === 0) return null
  
  try {
    const res = await apiRequest<{ files: IFile[], addedCount: number }>(`cards/${cardId}/files`, {
      method: 'POST',
      body: JSON.stringify({ files })
    })
    return res
  } catch (error) {
    console.error('Error adding files to card:', error)
    return null
  }
}

export const removeFileFromCard = async (cardId: string, fileId: string): Promise<boolean> => {
  if (!cardId || !fileId) return false
  
  try {
    await apiRequest(`cards/${cardId}/files/${fileId}`, {
      method: 'DELETE'
    })
    return true
  } catch (error) {
    console.error('Error removing file from card:', error)
    return false
  }
}