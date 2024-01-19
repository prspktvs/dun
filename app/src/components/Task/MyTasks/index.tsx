import { ITask } from '../../../types/Task'
import { useState, useEffect } from 'react'
import { isEmpty } from 'lodash'
import { getAllUserTasks } from '../../../services/tasks'
import { useAuth } from '../../../context/AuthContext'
import TaskPreview from '../TaskPreview'
import { useNavigate } from 'react-router-dom'
import { Menu } from '@mantine/core'
import { getAllUserProject } from '../../../services/project'

interface IMyTasksProps {
  projectId: string
  title: string
}

function MyTasks({ projectId, title }: IMyTasksProps) {
  const [tasks, setTasks] = useState([])
  const [isMenuOpened, setMenuOpened] = useState(false)
  const [projects, setProjects] = useState([])
  const navigate = useNavigate()

  const { user } = useAuth()

  useEffect(() => {
    getAllUserTasks(projectId, user).then((data) => setTasks(data))
    getAllUserProject(user.id).then((data) => setProjects(data))
  }, [])

  const goToProject = (id) => navigate(`/${id}`, { replace: true })

  return (
    <div className='flex flex-col items-center gap-1 w-80 border-r-2 border-gray-border'>
      <Menu
        shadow='md'
        width={280}
        offset={0}
        radius='md'
        onChange={(opened) => setMenuOpened(opened)}
      >
        <Menu.Target>
          <div className='px-5 w-80 h-20 border-b-2 text-3xl border-gray-border flex justify-between items-center hover:cursor-pointer hover:bg-gray-100'>
            <span className='font-rubik'>{title}</span>
            {isMenuOpened ? (
              <i className='ri-arrow-down-s-line text-2xl' />
            ) : (
              <i className='ri-arrow-right-s-line text-2xl' />
            )}
          </div>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label className='text-lg font-monaspace'>Your projects</Menu.Label>
          {projects.map((project, idx) => (
            <Menu.Item
              key={'prjx-' + idx}
              className='text-lg font-rubik'
              onClick={() => goToProject(project.id)}
            >
              {project.title}
            </Menu.Item>
          ))}
        </Menu.Dropdown>
      </Menu>
      <div className='w-full px-5 py-3'>
        <div className='flex items-center text-xl mb-3 font-monaspace'>
          What to do • {tasks.length}
        </div>
        {!isEmpty(tasks) ? (
          tasks.map((task, idx) => (
            <div
              key={'my-task-' + idx}
              onClick={() => navigate(`/${task?.cardPath}`, { replace: true })}
              className='rounded-md p-1 hover:cursor-pointer hover:bg-gray-100'
            >
              <TaskPreview task={task} />
            </div>
          ))
        ) : (
          <div className='text-gray-400'>No tasks found</div>
        )}
      </div>
    </div>
  )
}

export default MyTasks
