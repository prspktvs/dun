import { collection, getDocs } from 'firebase/firestore'
import { ref, set } from 'firebase/database'

import { db, realtimeDb } from '../config/firebase'

export const migrateProjectMembership = async () => {
  try {
    const projectsCollection = collection(db, 'projects')
    const projectsSnapshot = await getDocs(projectsCollection)
    
    let migratedProjects = 0
    let migratedUsers = 0

    for (const projectDoc of projectsSnapshot.docs) {
      const projectData = projectDoc.data()
      const projectId = projectDoc.id
      const users = projectData.users || []

      if (users.length > 0) {
        const membersRef = ref(realtimeDb, `projects/${projectId}/members`)
        const membersData: { [userId: string]: boolean } = {}
        
        users.forEach((user: any) => {
          if (user.id) {
            membersData[user.id] = true
            migratedUsers++
          }
        })

        await set(membersRef, membersData)


        for (const user of users) {
          if (user.id) {
            const userProjectRef = ref(realtimeDb, `userProjects/${user.id}/${projectId}`)
            await set(userProjectRef, true)
          }
        }

        migratedProjects++
      }
    }

    return {
      success: true,
      migratedProjects,
      migratedUsers,
      message: `Migrated ${migratedProjects} projects with ${migratedUsers} user memberships`
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'Migration failed'
    }
  }
}

export const checkMigrationStatus = async () => {
  try {
    const projectsCollection = collection(db, 'projects')
    const projectsSnapshot = await getDocs(projectsCollection)
    
    let totalProjects = 0
    let totalUsers = 0
    let migratedProjects = 0

    for (const projectDoc of projectsSnapshot.docs) {
      const projectData = projectDoc.data()
      const projectId = projectDoc.id
      const users = projectData.users || []
      
      totalProjects++
      totalUsers += users.length

 
      const membersRef = ref(realtimeDb, `projects/${projectId}/members`)
      try {
        const snapshot = await membersRef.once('value')
        if (snapshot.exists()) {
          migratedProjects++
        }
      } catch (e) {
     
      }
    }

    return {
      totalProjects,
      totalUsers,
      migratedProjects,
      migrationComplete: migratedProjects === totalProjects,
      percentage: totalProjects > 0 ? Math.round((migratedProjects / totalProjects) * 100) : 0
    }
  } catch (error) {
    return {
      error: error.message,
      migrationComplete: false
    }
  }
}

/**
 * Use:
 * 
 * Run migration script
 * const result = await migrateProjectMembership()
 * console.log(result)
 *
 * Check status
 * const status = await checkMigrationStatus()
 * console.log(status)
 */
