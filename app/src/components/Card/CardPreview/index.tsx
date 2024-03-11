import { isEmpty } from 'lodash'
import { ICard } from '../../../types/Card'
import { Image } from '@mantine/core'
import TaskPreview from '../../Task/TaskPreview'

interface ICardPreviewProps {
  card: ICard
  onClick: () => void
}

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

function CardPreview({ card, onClick }: ICardPreviewProps) {
  const imageUrls = card?.files
    ?.filter((file) => file.type === 'image')
    ?.slice(0, 5)
    ?.map((file) => file.url)
  const tasks = card?.tasks
  const createdAt = new Date(card.createdAt.seconds * 1000)
  const day = createdAt.getDate()
  const month = months[createdAt.getMonth()]
  const hours = createdAt.getHours() < 10 ? '0' + createdAt.getHours() : createdAt.getHours()
  const minutes =
    createdAt.getMinutes() < 10 ? '0' + createdAt.getMinutes() : createdAt.getMinutes()

  return (
    <div
      // className='w-full h-72 p-3 overflow-hidden border-r-2 border-[#A3A1A7]  hover:cursor-pointer'
      className='min-w-[23.75rem] max-w-[37.5rem] h-[23.125rem] p-3 overflow-hidden  border-r-2 border-b-2 border-[#A3A1A7]  hover:cursor-pointer'
      onClick={onClick}

     
    >
      <div className='flex items-center justify-between'>
        <div className='text-xs text-gray-500 font-monaspace'>{`${day} ${month} at ${hours}:${minutes}`}</div>
      </div>
      <div className='text-lg font-semibold font-rubik not-italic '>{card.title}</div>
      <div className='flex items-end'>
        <div className='col-span-3 overflow-hidden'>
          {!isEmpty(tasks)
            ? tasks
                ?.slice(0, 3)
                ?.map((task) => <TaskPreview key={'prevtask-' + task.id} task={task} />)
            : card?.description?.map((line) => (
                <div key={'description-' + line} className='text-sm'>
                  {line}
                </div>
              ))}
        </div>
        {tasks?.length > 4 ? (
          <span className='ml-3 flex items-center h-full font-semibold underline text-lg'>
            +{tasks.length - 4}
          </span>
        ) : null}
      </div>
      <div className='grid grid-cols-5 mt-5'>
        {!isEmpty(imageUrls) ? (
          <div className='flex col-span-2'>
            {imageUrls?.map((url) => (
              <Image key={'image-' + url} className='w-20' src={url} alt='' />
            ))}
            {card?.files?.length > 5 ? (
              <span className='ml-3 flex items-center h-full font-semibold underline text-lg'>
                +{card.files.length - 5}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default CardPreview
