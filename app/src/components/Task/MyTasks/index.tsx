import { ITask } from '../../../types/Task'
import { useState, useEffect } from 'react'
import { isEmpty } from 'lodash'
import { getAllUserTasks } from '../../../services/tasks'
import { useAuth } from '../../../context/AuthContext'
import TaskPreview from '../TaskPreview'
import { useNavigate } from 'react-router-dom'

interface IMyTasksProps {
  projectId: string
  title: string
}

function MyTasks({ projectId, title }: IMyTasksProps) {
  const [tasks, setTasks] = useState([])
  const navigate = useNavigate()

  const { user } = useAuth()

  useEffect(() => {
    getAllUserTasks(projectId, user).then((data) => setTasks(data))
  }, [])

  return (
    <div className='flex flex-col items-center gap-1 w-80 border-r-2 border-gray-border'>
      <div className='w-80 h-20 border-b-2 text-3xl border-gray-border flex justify-center items-center'>
        {title}
      </div>
      <div className='w-full px-5 py-3'>
        <div className='flex items-center text-xl mb-3'>What to do • {tasks.length}</div>
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
