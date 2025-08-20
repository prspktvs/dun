import { collection, doc, deleteDoc, setDoc, getDoc, getDocs } from 'firebase/firestore'

import { IProject } from '../types/Project'
import { ITeamMember } from '../types/User'
import { db } from '../config/firebase'
import { ROLES } from '../constants/roles.constants'
import { logAnalytics } from '../utils/analytics'
import { ANALYTIC_EVENTS } from '../constants/analytics.constants'

interface MinimalUser { id: string }
function hasId(obj: unknown): obj is MinimalUser {
  return typeof obj === 'object' && obj !== null && 'id' in obj && typeof (obj as { id?: unknown }).id === 'string'
}

export const addUserToProject = async (projectId: string, user: Partial<ITeamMember>) => {
  try {
    if (!projectId || !user) return null
    const projectRef = doc(collection(db, 'projects'), projectId)
    const snap = await getDoc(projectRef)
    const data = snap.data()

  const isUserFound = Array.isArray(data?.users) && data.users.some((u: unknown) => hasId(u) && u.id === user.id)
    if (isUserFound) return null

  const newUser = { ...user, role: (user as unknown as ITeamMember)?.role ?? ROLES.VIEWER }
  const newUsers = data?.users?.length > 0 ? [...(data?.users ?? []), newUser] : [{ ...newUser, role: ROLES.OWNER }]
  const initialVisibility = data && 'visibility' in data ? undefined : 'private'
  await setDoc(projectRef, { users: newUsers, ...(initialVisibility ? { visibility: initialVisibility } : {}) }, { merge: true })
  logAnalytics(ANALYTIC_EVENTS.PROJECT_MEMBER_ADDED, { project_id: projectId, user_id: user.id })
  } catch { return null }
}

export const createProject = async (project: Partial<IProject>) => {
  try {
    const projectId = project.id
    if (!projectId) throw new Error('project.id is required')
    const projectRef = doc(collection(db, 'projects'), projectId)
    await setDoc(projectRef, { visibility: 'private', ...project })
    logAnalytics(ANALYTIC_EVENTS.PROJECT_CREATED, { project_id: projectId })
    return { ...project, id: projectId }
  } catch { return null }
}

export const updateProject = async (project: Partial<IProject>) => {
  try {
    const projectRef = doc(collection(db, 'projects'), project.id)
    await setDoc(projectRef, project, { merge: true })
    return project
  } catch { return null }
}

export const deleteProject = async (projectId: string) => {
  try {
    const projectRef = doc(collection(db, 'projects'), projectId)
    await deleteDoc(projectRef)
    logAnalytics(ANALYTIC_EVENTS.PROJECT_DELETED, { project_id: projectId })
  } catch { return null }
}

export const getAllUserProject = async (userId: string) => {
  try {
    const projectsRef = collection(db, 'projects')
    const snap = await getDocs(projectsRef)
    const projects: IProject[] = []
    snap.forEach((d) => {
  const data = d.data() as Record<string, unknown>
      const users = data?.users || []
  if (Array.isArray(users) && users.some((u) => hasId(u) && u.id === userId)) {
        projects.push({ ...data, id: d.id } as IProject)
      }
    })
    return projects
  } catch { return null }
}

export const getProject = async (projectId: string): Promise<IProject | null> => {
  try {
    const projectRef = doc(collection(db, 'projects'), projectId)
    const snap = await getDoc(projectRef)
    if (snap.exists()) return { ...snap.data(), id: snap.id } as IProject
    return null
  } catch { return null }
}
