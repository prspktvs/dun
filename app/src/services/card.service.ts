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
import { genId } from '../utils'
import { db } from '../config/firebase'
import { BACKEND_URL } from '../constants/app'

export const getCardById = async (cardId: string): Promise<ICard | null> => {
  try {
    if (!cardId) return null
    
    const res = await fetch(`${BACKEND_URL}/api/cards/${cardId}`)
    return await res.json()
  } catch (e) {
    console.error(e)
    return null
  }
}

export const createCard = async (projectId: string, card: Partial<ICard>): Promise<ICard | null> => {
  try {
    if (!projectId) return null

    const res = await fetch(`${BACKEND_URL}/api/cards`, {method: 'POST', headers: {
      'Content-Type': 'application/json',
    }, body: JSON.stringify({ ...card, projectId })})
    return await res.json()
    
  } catch (e) {
    console.error(e)
    return null
  }

}

export const updateCard = async (
  card: ICard,
): Promise<ICard | null> => {
  try {
    if (!card.id) return null

    const res = await fetch(`${BACKEND_URL}/api/cards/${card.id}`, {method: 'PATCH', headers: {
      'Content-Type': 'application/json',
    }, body: JSON.stringify(card)})

    return await res.json()
  } catch (e) {
    return null
  }
}

export const removeCard = async (cardId: string) => {
  try {
    if (!cardId) return null
    await fetch(`${BACKEND_URL}/api/cards/${cardId}`, { method: 'DELETE' })
  } catch (e) {
    console.error(e)
    return null
  }
}

export const getProjectCards = async (projectId: string): Promise<ICard[]> => {
  try {
    if (!projectId) return []
    const res = await fetch(`${BACKEND_URL}/api/cards?projectId=${projectId}`)
    return await res.json()
  } catch (e) {
    console.error(e)
    return []
  }
}
