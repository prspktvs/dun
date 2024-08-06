import { useNavigate, useParams } from 'react-router-dom'
import ButtonDun from '../../components/ui/buttons/ButtonDun'
import { genId } from '../../utils'
import { useProject } from '../../context/ProjectContext'
import { useMemo, useState } from 'react'
import TaskPreview from '../../components/Task/TaskPreview'
import { ITask } from '../../types/Task'
import { Minus, Plus } from '../../components/icons'

function CardTasksPreview({ title, tasks }: { tasks: ITask[]; title: string }) {
  const [isOpen, setOpen] = useState(false)
  const navigate = useNavigate()

  const toggle = () => setOpen((prev) => !prev)

  return (
    <>
      <div className='flex items-center gap-2'>
        {isOpen ? (
          <Minus color='black' onClick={toggle} />
        ) : (
          <Plus color='black' onClick={toggle} />
        )}
        <span className='text-xl font-medium font-rubik'>{title}</span>
      </div>
      {isOpen &&
        tasks.map((task, idx) => (
          <div
            key={'grouped-task-' + task.id}
            onClick={() => task?.cardPath && navigate(`/${task.cardPath}`, { replace: true })}
            className='rounded-md p-1 hover:cursor-pointer hover:bg-gray-100'
          >
            <TaskPreview task={task} />
          </div>
        ))}
      <div className='mb-5' />
    </>
  )
}

export function MyWorkPage() {
  const { id: projectId } = useParams()
  const navigate = useNavigate()
  const { optimisticCreateCard, tasks, cards } = useProject()

  const cardsTitles = useMemo(
    () =>
      cards.reduce((acc, card) => {
        acc[card.id] = card.title
        return acc
      }, {}),
    [cards],
  )
  const groupedTasksById = useMemo(() => Object.groupBy(tasks, (task) => task.card_id), [tasks])

  const onCreateNewCard = async () => {
    const id = genId()

    await optimisticCreateCard({ id, title: '', chatIds: [], createdAt: new Date() })

    navigate(`/${projectId}/cards/${id}`, { replace: true })
  }
  return (
    <div className='w-full h-full overflow-hidden pb-32'>
      <section className='border-border-color flex items-center h-14 '>
        <div className='h-full flex w-full justify-end border-b-1 border-border-color sm:gap-x-1 '>
          <div className='h-full w-48 border-l-1 border-border-color'>
            <ButtonDun onClick={onCreateNewCard}>
              <span className='pr-1 text-xl font-thin'>+</span>Topic
            </ButtonDun>
          </div>
        </div>
      </section>

      <div className='px-10 py-5 overflow-y-scroll h-full'>
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
