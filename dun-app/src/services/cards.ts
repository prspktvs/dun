import { db } from './firebaseDatabase'
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
} from 'firebase/firestore'
import { ICard } from '../types/Card'
import { genId } from '../utils'

export const saveOrCreateCard = async (
  projectId: string,
  card: ICard = {},
): Promise<ICard | null> => {
  try {
    if (!projectId) return null

    if (!card.id && !card.createdAt) {
      card.id = genId()
      card.createdAt = new Date()
    }

    const projectRef = doc(collection(db, 'projects'), projectId)
    const cardRef = doc(collection(projectRef, 'cards'), card.id)
    const tasksRef = collection(cardRef, 'tasks')

    if (card.content) {
      const images = card.content
        .filter((block) => block.type === 'image')
        .map(({ props }) => ({ type: 'image', url: props.src }))

      await setDoc(cardRef, { files: images }, { merge: true })

      const tasks = card.content.filter((block) => block.type === 'task')

      const taskPromises = tasks.map((task) => setDoc(doc(tasksRef, task.id), task))
      await Promise.all([...taskPromises])
    }

    await setDoc(cardRef, card)

    return card
  } catch (e) {
    return null
  }
}

export const removeCard = async (projectId: string, cardId: string) => {
  try {
    if (!projectId || !cardId) return null
    await deleteDoc(doc(collection(db, 'projects', projectId, 'cards'), cardId))
  } catch (e) {
    console.error(e)
    return null
  }
}
