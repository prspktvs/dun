import { isEmpty } from 'lodash'
import clsx from 'clsx'
import { useNavigate } from 'react-router-dom'

import TaskPreview from '../../Task/TaskPreview'
import { ITask } from '../../../types/Task'

interface TasksListProps {
  tasks: ITask[]
  groupedTasksById: Record<string, ITask[]>
  cardsTitles: Record<string, string>
}

export function TasksList({ tasks, groupedTasksById, cardsTitles }: TasksListProps) {
  const navigate = useNavigate()

  return (
    <section className='flex-1 w-full px-6 py-5 overflow-y-scroll'>
      <div
        className={clsx(
          'border border-[#46434e] flex items-center justify-center w-[140px] h-6 px-1.5 rounded mb-5',
          !isEmpty(tasks) ? 'bg-[#DBF7CA]' : 'bg-gray-50',
        )}
      >
        <span className='text-[10px] text-[#46434e] font-normal font-monaspace'>
          {!isEmpty(tasks) ? 'New tasks for you' : 'No new tasks for you'}
        </span>
      </div>

      {Object.keys(groupedTasksById).map((cardId) => (
        <div key={'grouped-tasks-card-id-' + cardId} className='mb-7'>
          <div className='text-[#46434e] text-sm font-bold mb-3'>{cardsTitles[cardId]}</div>
          {groupedTasksById[cardId].map((task) => (
            <div
              key={'grouped-task-' + task.id}
              onClick={() => task?.cardPath && navigate(`/${task.cardPath}`, { replace: true })}
              className='rounded-md py-2 px-1.5 hover:cursor-pointer hover:bg-gray-100'
            >
              <TaskPreview task={task} />
            </div>
          ))}
        </div>
      ))}

      <div className='text-[#8279bd] text-sm font-semibold font-monaspace pl-1'>+12</div>
    </section>
  )
}
