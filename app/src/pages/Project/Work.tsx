import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { groupBy } from 'lodash'

import ButtonDun from '../../components/ui/buttons/ButtonDun'
import { genId } from '../../utils'
import { useProject } from '../../context/ProjectContext'
import TaskPreview from '../../components/Task/TaskPreview'
import { ITask, TaskPriority } from '../../types/Task.d.ts'
import { Minus, Plus } from '../../components/icons'
import { ROLES } from '../../constants/roles.constants'

function CardTasksPreview({ title, tasks }: { tasks: ITask[]; title: string }) {
  const [isOpen, setOpen] = useState(false)
  const navigate = useNavigate()

  const tasksCountByPriority = useMemo(
    () =>
      tasks.reduce((acc, task) => {
        if (!acc[task.priority]) acc[task.priority] = 0
        acc[task.priority]++
        return acc
      }, {}),
    [tasks],
  )

  const sortedTasks = useMemo(() => {
    const priorityOrder = {
      [TaskPriority.Urgent]: 1,
      [TaskPriority.High]: 2,
      [TaskPriority.Medium]: 3,
      [TaskPriority.Low]: 4,
      [TaskPriority.NoPriority]: 5,
    }

    return [...tasks].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
  }, [tasks])

  const urgentTasks = tasksCountByPriority?.[TaskPriority.Urgent] || 0
  const highTasks = tasksCountByPriority?.[TaskPriority.High] || 0
  const mediumTasks = tasksCountByPriority?.[TaskPriority.Medium] || 0
  const lowTasks = tasksCountByPriority?.[TaskPriority.Low] || 0

  const toggle = () => setOpen((prev) => !prev)

  return (
    <>
      <div className='flex items-center gap-2'>
        {isOpen ? (
          <Minus color='black' onClick={toggle} />
        ) : (
          <Plus color='black' onClick={toggle} />
        )}
        <span className='text-xl font-medium font-rubik hover:cursor-pointer' onClick={toggle}>
          {title}
        </span>
      </div>
      <div className='ml-8'>
        {isOpen ? (
          sortedTasks.map((task, idx) => (
            <div
              key={'grouped-task-' + task.id}
              onClick={() => task?.cardPath && navigate(`/${task.cardPath}`, { replace: true })}
              className='rounded-md p-1 hover:cursor-pointer hover:bg-gray-100'
            >
              <TaskPreview task={task} />
            </div>
          ))
        ) : (
          <div className='flex items-center gap-2'>
            {urgentTasks ? (
              <span className='text-14 text-priority-urgent'>
                {urgentTasks} {TaskPriority.Urgent}
              </span>
            ) : null}
            {highTasks ? (
              <span className='text-14 text-priority-high'>
                {highTasks} {TaskPriority.High}
              </span>
            ) : null}
            {mediumTasks ? (
              <span className='text-14 text-priority-medium'>
                {mediumTasks} {TaskPriority.Medium}
              </span>
            ) : null}
            {lowTasks ? (
              <span className='text-14 text-priority-low'>
                {lowTasks} {TaskPriority.Low}
              </span>
            ) : null}
          </div>
        )}
      </div>
      <div className='mb-2 pt-2 border-borders-purple border-b-1' />
    </>
  )
}

export function MyWorkPage() {
  const { id: projectId } = useParams()
  const navigate = useNavigate()
  const { optimisticCreateCard, tasks, cards, hasPermission, isOnboarding } = useProject()
  const canCreateCard = hasPermission(ROLES.EDITOR)

  const cardsTitles = useMemo(
    () =>
      cards.reduce((acc, card) => {
        acc[card.id] = card.title
        return acc
      }, {}),
    [cards],
  )
  const groupedTasksById = useMemo(() => groupBy(tasks, (task) => task.card_id), [tasks])

  const onCreateNewCard = async () => {
    const id = genId()

    await optimisticCreateCard({ id, title: '', chatIds: [], createdAt: new Date() })

    navigate(`/${projectId}/cards/${id}#new`, { replace: true })
  }

  if (isOnboarding) return <Navigate to={`/${projectId}`} replace />

  return (
    <div className='w-full h-full overflow-hidden pb-32'>
      <section className='border-borders-purple flex items-center h-14 '>
        <div className='h-full flex w-full justify-end border-b-1 border-borders-purple sm:gap-x-1 '>
          {canCreateCard && (
            <div className='h-full w-48 border-l-1 border-borders-purple'>
              <ButtonDun onClick={onCreateNewCard}>
                <span className='pr-1 text-xl font-thin'>+</span>Topic
              </ButtonDun>
            </div>
          )}
        </div>
      </section>

      <div className='px-10 py-5 overflow-y-scroll h-full w-2/3 overflow-hidden'>
        <div className='text-16 font-monaspace mb-2 border-b-1 border-borders-purple pb-2'>
          Tasks assigned to you
        </div>
        {Object.keys(groupedTasksById).map((cardId) => (
          <CardTasksPreview
            key={'grouped-tasks-card-id-' + cardId}
            title={cardsTitles[cardId]}
            tasks={groupedTasksById[cardId]}
          />
        ))}
      </div>
    </div>
  )
}
