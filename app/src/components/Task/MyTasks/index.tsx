import { ITask } from '../../../types/Task'
import { useState, useEffect } from 'react'
import { isEmpty } from 'lodash'
import { getAllUserTasks } from '../../../services/tasks'

interface IMyTasksProps {
  projectId: string
}

const TaskPreview = ({ task }: { task: ITask }) => (
  <div className='flex items-center w-full h-12 border rounded-lg gap-1 px-1 overflow-hidden'>
    {task.isDone ? (
      <i className='ri-checkbox-line  text-lg' />
    ) : (
      <i className='ri-checkbox-blank-line text-lg' />
    )}
    <div>{task.text}</div>
  </div>
)

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
        ? tasks.map((task) => <TaskPreview key={'task-' + task.id} task={task} />)
        : null}
    </div>
  )
}

export default MyTasks
