import { getFirestore, collection, doc, addDoc, setDoc, getDoc, getDocs } from 'firebase/firestore'
import { IProject } from '../types/Project'
import { IUser } from '../types/User'
import { db } from '../config/firebase'

export const addUserToProject = async (projectId: string, user: IUser) => {
  try {
    if (!projectId || !user) return null
    const projectRef = doc(collection(db, 'projects'), projectId)
    const snap = await getDoc(projectRef)
    const { users } = snap.data()
    const newUsers = users ? [...users, user] : [user]
    await setDoc(projectRef, { users: newUsers }, { merge: true })
  } catch (e) {
    console.log(e)
    return null
  }
}

export const createProject = async (project: Partial<IProject>) => {
  try {
    const projectId = project.id
    const projectRef = doc(collection(db, 'projects'), projectId)
    const snap = await setDoc(projectRef, project)

    if (snap) return { ...project, id: projectId }

    return null
  } catch (e) {
    return null
  }
}

export const getAllUserProject = async (userId: string) => {
  try {
    const projectsRef = collection(db, 'projects')
    const snap = await getDocs(projectsRef)
    const projects: IProject[] = []
    snap.forEach((doc) => {
      const { users } = doc.data()
      if (users) {
        const user = users.find((user) => user.id === userId)
        if (user) projects.push({ ...doc.data(), id: doc.id })
      }
    })
    return projects
  } catch (e) {
    return null
  }
}
