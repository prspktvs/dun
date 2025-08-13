import { getFirestore, collection, doc, deleteDoc, setDoc, getDoc, getDocs } from 'firebase/firestore'

import { IProject } from '../types/Project'
import { ITeamMember } from '../types/User'
import { db } from '../config/firebase'
import { ROLES } from '../constants/roles.constants'

export const addUserToProject = async (projectId: string, user: Partial<ITeamMember>) => {
  try {
    if (!projectId || !user) return null
    const projectRef = doc(collection(db, 'projects'), projectId)
    const snap = await getDoc(projectRef)
    const data = snap.data()

  const isUserFound = data?.users?.find((u: any) => u.id === user.id)
    if (isUserFound) return console.log('User already exists in project')

  const newUser = { ...user, role: (user as unknown as ITeamMember)?.role ?? ROLES.VIEWER }
  const newUsers = data?.users?.length > 0 ? [...(data?.users ?? []), newUser] : [{ ...newUser, role: ROLES.OWNER }]
  const initialVisibility = data && 'visibility' in data ? undefined : 'private'
  await setDoc(projectRef, { users: newUsers, ...(initialVisibility ? { visibility: initialVisibility } : {}) }, { merge: true })
  } catch (e) {
    console.error(e)
    return null
  }
}

export const createProject = async (project: Partial<IProject>) => {
  try {
    const projectId = project.id
    if (!projectId) throw new Error('project.id is required')
    const projectRef = doc(collection(db, 'projects'), projectId)
  await setDoc(projectRef, { visibility: 'private', ...project })

  return { ...project, id: projectId }

  } catch (e) {
    console.error(e)
    return null
  }
}

export const updateProject = async (project: Partial<IProject>) => {
  try {
    const projectRef = doc(collection(db, 'projects'), project.id)
  await setDoc(projectRef, project, { merge: true })
  return project

  } catch (e) {
    console.error(e)
    return null
  }
}

export const deleteProject = async (projectId: string) => {
  try {
    const projectRef = doc(collection(db, 'projects'), projectId)
    await deleteDoc(projectRef)

  } catch (e) {
    console.error(e)
    return null
  }
}

export const getAllUserProject = async (userId: string) => {
  try {
    const projectsRef = collection(db, 'projects')
    const snap = await getDocs(projectsRef)
    const projects: IProject[] = []
    snap.forEach((doc) => {
      const { users } = doc.data() as any
      if (users) {
        const user = users.find((user: any) => user.id === userId)
        if (user) projects.push({ ...(doc.data() as any), id: doc.id } as IProject)
      }
    })
    return projects
  } catch (e) {
    console.error(e)
    return null
  }
}

export const getProject = async (projectId: string): Promise<IProject | null> => {
  try {
    const projectRef = doc(collection(db, 'projects'), projectId)
    const snap = await getDoc(projectRef)
    if (snap.exists()) {
      return { ...snap.data(), id: snap.id } as IProject
    }
    return null
  } catch (e) {
    console.error(e)
    return null
  }
}
