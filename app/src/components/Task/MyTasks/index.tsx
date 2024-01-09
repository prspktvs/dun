import { ITask } from '../../../types/Task'
import { useState, useEffect } from 'react'
import { isEmpty } from 'lodash'
import { getAllUserTasks } from '../../../services/tasks'
import { useAuth } from '../../../context/AuthContext'
import TaskPreview from '../TaskPreview'

interface IMyTasksProps {
  projectId: string
}

function MyTasks({ projectId }: IMyTasksProps) {
  const [tasks, setTasks] = useState([])

  const { user } = useAuth()

  useEffect(() => {
    getAllUserTasks(projectId, user).then((data) => setTasks(data))
  }, [])

  return (
    <div className='flex flex-col items-center gap-1 w-80 border-r-2 border-gray-border'>
      <div className='w-80 h-20 border-b-2 border-gray-border flex justify-center items-center'>
        Your Tasks
      </div>
      {!isEmpty(tasks)
        ? tasks.map((task) => <TaskPreview key={'mytask-' + task.id} task={task} />)
        : null}
    </div>
  )
}

export default MyTasks
