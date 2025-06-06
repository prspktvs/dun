import { addDoc, collection, doc, getDoc, getDocs, limit, query, updateDoc, where } from 'firebase/firestore'
import { nanoid } from 'nanoid'

import { db } from '../config/firebase'
import { ITeamMember } from '../types/User'
import { UserRole } from '../constants/roles.constants'

export interface ProjectInvite {
  id: string
  projectId: string
  role: 'viewer' | 'editor'
  createdAt: Date
  expiresAt: Date
  used: boolean
  usedBy?: {
    userId: string
    usedAt: Date
  }
}

export const updateRole = async (
  projectId: string,
  userId: string,
  newRole: UserRole
): Promise<void> => {
  try {
    const projectRef = doc(db, 'projects', projectId)
    const project = await getDoc(projectRef)
    
    if (!project.exists()) {
      throw new Error('Project not found')
    }

    const projectData = project.data()
    const users = projectData.users || []
    
    const userIndex = users.findIndex((u: any) => u.id === userId)
    if (userIndex === -1) {
      throw new Error('User not found in project')
    }

    users[userIndex] = {
      ...users[userIndex],
      role: newRole
    }

    await updateDoc(projectRef, {
      users: users
    })
  } catch (error) {
    console.error('Error updating user role:', error)
    throw new Error('Failed to update user role')
  }
}

export const getLatestProjectInvite = async (projectId: string): Promise<ProjectInvite | null> => {
  const invitesRef = collection(db, 'invites')
  const q = query(
    invitesRef, 
    where('projectId', '==', projectId),
    where('used', '==', false),
    where('expiresAt', '>', new Date()),
    limit(1)
  )
  
  const snapshot = await getDocs(q)
  return snapshot.empty ? null : (snapshot.docs[0].data() as ProjectInvite)
}

export const createProjectInvite = async (
  projectId: string, 
  role: 'viewer' | 'editor'
): Promise<ProjectInvite> => {

  const existingInvite = await getLatestProjectInvite(projectId)
  if (existingInvite) {
    return existingInvite
  }


  const invite: ProjectInvite = {
    id: nanoid(20),
    projectId,
    role,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    used: false
  }

  const invitesRef = collection(db, 'invites')
  await addDoc(invitesRef, invite)

  return invite
}

export const processInvite = async (inviteId: string, userId: string): Promise<ProjectInvite> => {
  const invitesRef = collection(db, 'invites')
  const q = query(invitesRef, where('id', '==', inviteId))
  const snapshot = await getDocs(q)

  if (snapshot.empty) {
    throw new Error('Invalid invite link')
  }

  const invite = snapshot.docs[0].data() as ProjectInvite

  if (invite.used) {
    throw new Error('This invite link has already been used')
  }

  if (new Date() > new Date(invite.expiresAt)) {
    throw new Error('This invite link has expired')
  }

  await updateDoc(snapshot.docs[0].ref, {
    used: true,
    usedBy: {
      userId,
      usedAt: new Date()
    }
  })

  return invite
}

export const removeUserFromProject = async (
  projectId: string,
  userIdToRemove: string,
  currentUserId: string
): Promise<void> => {
  try {
    const projectRef = doc(db, 'projects', projectId)
    const project = await getDoc(projectRef)
    
    if (!project.exists()) {
      throw new Error('Project not found')
    }

    const projectData = project.data()
    const users = (projectData.users || []) as ITeamMember[]
    
    const userToRemove = users.find((u: ITeamMember) => u.id === userIdToRemove)
    const currentUser = users.find((u: ITeamMember) => u.id === currentUserId)

    if (!userToRemove) {
      throw new Error('User not found in project')
    }

    if (!currentUser) {
      throw new Error('Current user not found in project')
    }

    if (currentUser.role !== 'owner' && currentUser.role !== 'admin') {
      throw new Error('You do not have permission to remove users')
    }

    if (userToRemove.role === 'owner') {
      throw new Error('Cannot remove the project owner')
    }

    if (currentUser.role !== 'owner' && userToRemove.role === 'admin') {
      throw new Error('Admins can only remove editors and viewers')
    }

    const updatedUsers = users.filter((u: ITeamMember) => u.id !== userIdToRemove)

    await updateDoc(projectRef, {
      users: updatedUsers
    })
  } catch (error) {
    console.error('Error removing user:', error)
    throw error
  }
}