import { ITask } from '../../types/Task'
import { useState, useEffect, useMemo } from 'react'
import { isEmpty } from 'lodash'

import { useAuth } from '../../context/AuthContext'

import { useNavigate } from 'react-router-dom'
import { Menu } from '@mantine/core'
import { getAllUserProject } from '../../services'
import { genId } from '../../utils'
import { useProject } from '../../context/ProjectContext'
import clsx from 'clsx'
import TaskPreview from '../Task/TaskPreview'

interface ILeftPanelProps {
  projectId: string
  title: string
}

function LeftPanel({ projectId, title }: ILeftPanelProps) {
  const [isMenuOpened, setMenuOpened] = useState(false)
  const [projects, setProjects] = useState([])
  const navigate = useNavigate()

  const { tasks, cards } = useProject()

  const cardsTitles = useMemo(
    () =>
      cards.reduce((acc, card) => {
        acc[card.id] = card.title
        return acc
      }, {}),
    [cards],
  )
  const groupedTasksById = useMemo(() => Object.groupBy(tasks, (task) => task.card_id), [tasks])

  const { user } = useAuth()

  useEffect(() => {
    getAllUserProject(user.id).then((data) => setProjects(data))
  }, [])

  const goToProject = (id) => navigate(`/${id}`, { replace: true })

  return (
    <aside className='flex flex-col items-center gap-1 w-80 border-r-1 border-border-color h-screen'>
      <Menu
        shadow='md'
        width={280}
        offset={0}
        radius='md'
        onChange={(opened) => setMenuOpened(opened)}
      >
        <Menu.Target>
          <nav className=' border-border-color h-14 px-5 w-80 border-b-1 text-3xl  flex justify-between items-center hover:cursor-pointer hover:bg-gray-100'>
            <span className='font-rubik text-lg '>{title}</span>

            {isMenuOpened ? (
              <i className='ri-arrow-down-s-line text-2xl' />
            ) : (
              <i className='ri-arrow-right-s-line text-2xl' />
            )}
          </nav>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label className='text-md font-monaspace'>Your projects</Menu.Label>
          {projects.map((project, idx) => (
            <Menu.Item
              key={'prjx-' + idx}
              className='text-md font-rubik'
              onClick={() => goToProject(project.id)}
            >
              {project.title || 'Empty project'}
            </Menu.Item>
          ))}
          <div className='border-t-[2px] pt-1 mt-1'>
            <Menu.Item
              className='text-md font-rubik text-gray-500'
              onClick={() => (window.location.href = `/${genId()}`)}
            >
              Create new project
            </Menu.Item>
          </div>
        </Menu.Dropdown>
      </Menu>
      <div className='flex-1 w-full px-5 py-3 overflow-y-scroll pb-12'>
        <div
          className={clsx(
            ' border-black flex items-center justify-center w-40 h-6 border-1 mb-3',
            !isEmpty(tasks) ? 'bg-salad' : 'bg-gray-50',
          )}
        >
          <span className='text-12 font-normal font-monaspace'>
            {!isEmpty(tasks) ? 'New tasks for you' : 'No new tasks for you'}
          </span>
        </div>
        {Object.keys(groupedTasksById).map((cardId) => (
          <div key={'grouped-tasks-card-id-' + cardId}>
            <div className='text-14 font-bold'>{cardsTitles[cardId]}</div>
            {groupedTasksById[cardId].map((task, idx) => (
              <div
                key={'grouped-task-' + task.id}
                onClick={() => task?.cardPath && navigate(`/${task.cardPath}`, { replace: true })}
                className='rounded-md p-1 hover:cursor-pointer hover:bg-gray-100'
              >
                <TaskPreview task={task} />
              </div>
            ))}
            <div className='mb-5' />
          </div>
        ))}
      </div>
    </aside>
  )
}

export default LeftPanel
