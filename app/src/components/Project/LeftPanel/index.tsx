import { useState, useEffect, useMemo } from 'react'

import { useAuth } from '../../../context/AuthContext'
import { getAllUserProject } from '../../../services'
import { useProject } from '../../../context/ProjectContext'
import ProjectUsers from '../../User/ProjectUsers'
import ProjectSettingsModal from '../ProjectSettingsModal'
import { ProjectSelector } from './ProjectSelector'
import { Navigation } from './Navigation'
import { TasksList } from './TasksList'
import { ITask } from '../../../types/Task'
import { IProject } from '../../../types/Project'

function LeftPanel() {
  const [isSettingsOpened, setSettingsOpened] = useState(false)
  const [projects, setProjects] = useState<IProject[]>([])

  const { tasks, cards, project } = useProject()
  const { user } = useAuth()

  const cardsTitles = useMemo(
    () =>
      cards.reduce((acc, card) => {
        acc[card.id] = card.title
        return acc
      }, {}),
    [cards],
  )

  const groupedTasksById = useMemo(() => Object.groupBy(tasks, (task) => task.card_id), [tasks])

  useEffect(() => {
    getAllUserProject(user.id).then((data) => setProjects(data))
  }, [])

  const projectCount = projects.length
  const otherProjectsCount = Math.max(0, projectCount - 1)

  return (
    <aside className='flex flex-col items-center h-screen gap-1 w-80 border-r-1 border-border-color'>
      <ProjectSelector projects={projects} otherProjectsCount={otherProjectsCount} />
      <section className='flex items-center justify-center w-full h-14 border-b-1 border-border-color'>
        <ProjectUsers />
      </section>
      <Navigation
        isSettingsOpened={isSettingsOpened}
        onSettingsOpen={() => setSettingsOpened(true)}
      />
      <TasksList tasks={tasks} groupedTasksById={groupedTasksById} cardsTitles={cardsTitles} />
      <ProjectSettingsModal opened={isSettingsOpened} onClose={() => setSettingsOpened(false)} />
    </aside>
  )
}

export default LeftPanel
