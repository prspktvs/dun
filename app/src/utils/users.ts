import { addDoc, collection, doc, getDoc, getDocs, limit, query, updateDoc, where } from 'firebase/firestore'

import { db } from '../config/firebase'
import { ITeamMember } from '../types/User'
import { UserRole } from '../constants/roles.constants'
import { generateInviteLink } from '.'

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
    const updatedInviteUrl = generateInviteLink(projectId)

    await updateDoc(projectRef, {
      users: updatedUsers,
      inviteUrl: updatedInviteUrl
    })
  } catch (error) {
    console.error('Error removing user:', error)
    throw error
  }
}