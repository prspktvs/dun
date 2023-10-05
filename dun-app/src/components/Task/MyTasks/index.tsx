import { ITask } from '../../../types/Task'
import { useState, useEffect } from 'react'
import { isEmpty } from 'lodash'
import { getAllUserTasks } from '../../../services/tasks'

interface IMyTasksProps {
  projectId: string
}

function MyTasks({ projectId }: IMyTasksProps) {
  const [tasks, setTasks] = useState([])

  const user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    getAllUserTasks(projectId, user).then((data) => setTasks(data))
  }, [])

  return (
    <div className='flex flex-col items-center gap-1'>
      <div className='w-full h-12 border bg-lime-300 rounded-md flex justify-center items-center'>
        Your Tasks
      </div>
      {!isEmpty(tasks)
        ? tasks.map((task) => (
            <div
              key={'task-' + task.id}
              className='flex items-center w-full h-12 border rounded-lg gap-1 overflow-hidden'
            >
              <input type='checkbox' checked={task.isDone} disabled />
              <div>{task.text}</div>
            </div>
          ))
        : null}
    </div>
  )
}

export default MyTasks
