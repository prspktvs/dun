import { ITask } from '../../../types/Task'
import { useState, useEffect } from 'react'
import { isEmpty } from 'lodash'
import { getAllUserTasks } from '../../../services'
import { useAuth } from '../../../context/AuthContext'
import TaskPreview from '../TaskPreview'
import { useNavigate } from 'react-router-dom'
import { Menu } from '@mantine/core'
import { getAllUserProject } from '../../../services'
import { genId } from '../../../utils'
import { useProject } from '../../../context/ProjectContext'

interface IMyTasksProps {
  projectId: string
  title: string
}

function MyTasks({ projectId, title }: IMyTasksProps) {
  const [isMenuOpened, setMenuOpened] = useState(false)
  const [projects, setProjects] = useState([])
  const navigate = useNavigate()

  const { tasks } = useProject()
  const { user } = useAuth()

  useEffect(() => {
    getAllUserProject(user.id).then((data) => setProjects(data))
  }, [])

  const goToProject = (id) => navigate(`/${id}`, { replace: true })

  return (
    <div className='flex flex-col items-center gap-1 w-80 border-r-1 border-border-color h-screen'>
      <Menu
        shadow='md'
        width={280}
        offset={0}
        radius='md'
        onChange={(opened) => setMenuOpened(opened)}
      >
        <Menu.Target>
          <div className=' border-border-color h-14 px-5 w-80 border-b-1 text-3xl  flex justify-between items-center hover:cursor-pointer hover:bg-gray-100'>
            <span className='font-rubik text-lg '>{title}</span>

            {isMenuOpened ? (
              <i className='ri-arrow-down-s-line text-2xl' />
            ) : (
              <i className='ri-arrow-right-s-line text-2xl' />
            )}
          </div>
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
      <div className='w-full px-5 py-3'>
        <div className='flex items-center text-sm mb-3 font-monaspace font-normal'>
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
