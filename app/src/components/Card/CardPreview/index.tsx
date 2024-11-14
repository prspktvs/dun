import { isEmpty } from 'lodash'
import { Image, Avatar, AvatarGroup } from '@mantine/core'
import { useMemo } from 'react'
import { formatDistanceToNow } from 'date-fns'

import { ICard, IUser } from '../../../types/Card'
import TaskPreview from '../../Task/TaskPreview'
import { MessageIcon, UpdateIcon } from '../../icons'


const MAX_IMAGES = 4
const MAX_TASKS = 4

interface ICardPreviewProps {
  card: ICard
  onClick: () => void
}

function CardPreview({ card, onClick }: ICardPreviewProps) {
  const imageUrls = useMemo(
    () =>
      card?.files
        ?.filter((file) => file.type === 'image')
        .slice(0, MAX_IMAGES)
        .map((file) => file.url) ?? [],
    [card?.files],
  )

  const tasks = useMemo(() => card?.tasks?.slice(0, MAX_TASKS) ?? [], [card?.tasks])
  const taskCountExcess = (card?.tasks?.length || 0) - MAX_TASKS

  const createdAt = new Date(card.createdAt)
  const relativeTime = formatDistanceToNow(createdAt, { addSuffix: true })

  return (
    <div
      className='h-[23.125rem] p-7 overflow-hidden border-r-1 border-border-color hover:cursor-pointer'
      onClick={onClick}
    >
      <div className='flex flex-col h-full'>
        <div className='flex items-center justify-between mb-2'>
          <div className='text-xs text-gray-500 font-monaspace'>{relativeTime}</div>
          <div className='flex gap-x-2'>
            <MessageIcon count={card?.chatIds?.length || 0} />
            <UpdateIcon count={0} />
          </div>
        </div>
        <div className='text-lg font-semibold font-rubik not-italic mb-4'>{card.title}</div>

        {/* Tasks Preview */}
        <div className='flex-grow overflow-hidden'>
          {tasks.length > 0 ? (
            <div className='flex flex-col gap-3'>
              {tasks.map((task) => (
                <TaskPreview key={task.id} task={task} />
              ))}
              {taskCountExcess > 0 && (
                <span className='ml-3 flex items-center h-full underline text-sm'>
                  +{taskCountExcess}
                </span>
              )}
            </div>
          ) : (
            <div className='text-[#46434e] text-sm font-normal font-["Rubik"] leading-tight overflow-hidden'>
              {card.description?.slice(0, 2).join(' ')}
            </div>
          )}
        </div>

        {/* Images Preview */}
        {imageUrls.length > 0 && (
          <div className='mt-5 flex'>
            {imageUrls.map((url, idx) => (
              <Image key={url + idx} className='w-12' src={url} alt='' />
            ))}
            {card.files?.length > MAX_IMAGES && (
              <span className='ml-3 flex items-center h-full font underline text-sm'>
                +{card.files.length - MAX_IMAGES}
              </span>
            )}
          </div>
        )}

        {/* User Avatars */}
        <div className='mt-2 flex justify-start items-center gap-2'>
          <AvatarGroup>
            {(card.users as IUser[])?.map((user) => (
              <Avatar key={user.id} src={user.avatarUrl} alt={user.name} radius='xl' size='sm' />
            ))}
          </AvatarGroup>
        </div>
      </div>
    </div>
  )
}

export default CardPreview
