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
    ?.slice(0, 2)
    ?.map((file) => file.url)
  const imagesCount = imageUrls ? imageUrls.length : 0
  const tasks = card?.tasks?.slice(0, 3)
  const createdAt = new Date(card.createdAt.seconds * 1000)
  const day = createdAt.getDate()
  const month = months[createdAt.getMonth()]
  const hours = createdAt.getHours() < 10 ? '0' + createdAt.getHours() : createdAt.getHours()
  const minutes =
    createdAt.getMinutes() < 10 ? '0' + createdAt.getMinutes() : createdAt.getMinutes()

  return (
    <div
      className='w-full h-72 p-3 overflow-hidden card-border hover:cursor-pointer'
      onClick={onClick}
    >
      <div className='flex items-center justify-between'>
        <div className='text-xs text-gray-500'>{`${day} ${month} at ${hours}:${minutes}`}</div>
      </div>
      <div className='text-xl font-semibold'>{card.title}</div>
      <div className='col-span-3'>
        {!isEmpty(tasks)
          ? tasks?.map((task) => <TaskPreview key={'prevtask-' + task.id} task={task} />)
          : card?.description?.map((line) => (
              <div key={'description-' + line} className='text-sm'>
                {line}
              </div>
            ))}
      </div>
      <div className='grid grid-cols-5 mt-5'>
        {!isEmpty(imageUrls) ? (
          <div className='flex col-span-2'>
            {imagesCount === 1 ? (
              <Image radius='md' className='w-20 h-20 object-cover' src={imageUrls[0]} alt='' />
            ) : (
              imageUrls?.map((url) => (
                <Image key={'image-' + url} radius='md' className='w-20' src={url} alt='' />
              ))
            )}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default CardPreview
