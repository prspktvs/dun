import { isEmpty } from 'lodash'
import { ICard } from '../../../types/Card'
import { Image } from '@mantine/core'
import TaskPreview from '../../Task/TaskPreview'
import { Square, Circle } from '../../../components/Project/Content/IconsCard'
import ProjectUsers from '../../User/ProjectUsers'

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
    // <div

    //   className='min-w-[23.75rem] max-w-[37.5rem] h-[23.125rem] p-3 overflow-hidden  border-r-2 border-border-color  hover:cursor-pointer'
    //   onClick={onClick}
    // >
    <div
      className='h-[23.125rem] p-3 overflow-hidden  border-r-2 border-border-color  hover:cursor-pointer'
      onClick={onClick}
    >
      <div className='m-4'>
        <div className='flex items-center justify-between mb-2'>
          <div className='text-xs text-gray-500 font-monaspace'>{`${day} ${month} at ${hours}:${minutes}`}</div>
          <div className='flex gap-x-2'>
            <Square />
            <Circle />
          </div>
        </div>
        <div className='text-lg font-semibold font-rubik not-italic mb-4 '>{card.title}</div>
        <div className='flex items-end sm:max-w-[390px] md:max-w-[300px] lg:max-w-[450px]'>
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
            <span className='ml-3 flex items-center h-full underline text-sm'>
              +{tasks.length - 4}
            </span>
          ) : null}
        </div>
        {/* <div className='grid grid-cols-5 mt-5'> */}
        <div className='flex mt-5 sm:max-w-[390px] md:max-w-[300px] lg:max-w-[450px] '>
          {!isEmpty(imageUrls) ? (
            <div className='flex col-span-2 '>
              {imageUrls?.map((url, idx) => (
                <Image key={'image-' + url + '-' + idx} className='w-12' src={url} alt='' />
              ))}
              {card?.files?.length > 5 ? (
                <span className='ml-3 flex items-center h-full font underline text-sm ml-12'>
                  +{card.files.length - 5}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default CardPreview
