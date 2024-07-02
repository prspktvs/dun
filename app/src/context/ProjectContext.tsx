import { createContext, useContext, useEffect, useState } from 'react'
import { ITask } from '../types/Task'
import { useAuth } from './AuthContext'
import { getAllUserProject, getAllUserTasks } from '../services'
import { collectionGroup, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '../config/firebase'
import { extractCardPath } from '../utils'
import { updateUser } from '../services/user.service'

export type ProjectContext = {
  tasks: ITask[]
}

export const ProjectProvider = ({
  projectId,
  children,
}: {
  projectId: string
  children: React.ReactNode
}) => {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<ITask[]>([])

  useEffect(() => {
    async function bootstrap() {
      const data = await getAllUserTasks(projectId, user)
      setTasks(data)

      const updatedUser = { ...user, lastProjectId: projectId }
      await updateUser(updatedUser)
    }

    bootstrap()
  }, [projectId])

  useEffect(() => {
    if (!projectId || !user) return

    const q = query(collectionGroup(db, 'tasks'), where('users', 'array-contains', user.id))

    const unsubscribe = onSnapshot(q, (snapshots) => {
      const newTasks: ITask[] = []

      snapshots.forEach(
        (snap) =>
          snap.ref.path.includes(`projects/${projectId}`) &&
          newTasks.push({ ...snap.data(), cardPath: extractCardPath(snap.ref.path) }),
      )

      setTasks(newTasks)
    })

    return () => unsubscribe()
  }, [projectId, user])

  const contextValue: ProjectContext = {
    tasks,
  }
  return <ProjectContext.Provider value={contextValue}>{children}</ProjectContext.Provider>
}

export const ProjectContext = createContext<ProjectContext | undefined>(undefined)

export const useProject = (): ProjectContext => {
  const context = useContext(ProjectContext)
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider')
  }
  return context
}
