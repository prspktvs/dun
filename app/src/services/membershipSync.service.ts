import { ref, set, remove } from 'firebase/database'

import { realtimeDb } from '../config/firebase'

export const syncProjectMembership = async (projectId: string, members: { id: string; role: string }[]) => {
  try {
    const membersRef = ref(realtimeDb, `projects/${projectId}/members`)
    

    const realtimeMembers: { [userId: string]: boolean } = {}
    members.forEach(member => {
      realtimeMembers[member.id] = true
    })
    

    await set(membersRef, realtimeMembers)
    
    console.log(`Synchronized ${members.length} members for project ${projectId}`)
  } catch (error) {
    console.error('Error syncing project membership:', error)
    throw error
  }
}

export const addMemberToRealtimeProject = async (projectId: string, userId: string) => {
  try {
    const memberRef = ref(realtimeDb, `projects/${projectId}/members/${userId}`)
    await set(memberRef, true)
    

    const userProjectRef = ref(realtimeDb, `userProjects/${userId}/${projectId}`)
    await set(userProjectRef, true)
    
    console.log(`Added member ${userId} to project ${projectId}`)
  } catch (error) {
    console.error('Error adding member to realtime project:', error)
    throw error
  }
}

export const removeMemberFromRealtimeProject = async (projectId: string, userId: string) => {
  try {
    const memberRef = ref(realtimeDb, `projects/${projectId}/members/${userId}`)
    await remove(memberRef)
    
  
    const userProjectRef = ref(realtimeDb, `userProjects/${userId}/${projectId}`)
    await remove(userProjectRef)
    
    console.log(`Removed member ${userId} from project ${projectId}`)
  } catch (error) {
    console.error('Error removing member from realtime project:', error)
    throw error
  }
}

export const syncUserProjects = async (userId: string, projectIds: string[]) => {
  try {
    const userProjectsRef = ref(realtimeDb, `userProjects/${userId}`)
    
    const userProjects: { [projectId: string]: boolean } = {}
    projectIds.forEach(projectId => {
      userProjects[projectId] = true
    })
    
    await set(userProjectsRef, userProjects)
    
    console.log(`Synchronized ${projectIds.length} projects for user ${userId}`)
  } catch (error) {
    console.error('Error syncing user projects:', error)
    throw error
  }
}
