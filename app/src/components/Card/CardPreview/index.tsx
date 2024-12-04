import { isEmpty } from 'lodash'
import { Image } from '@mantine/core'
import { useMemo } from 'react'
import { formatDistanceToNow } from 'date-fns'

import AvatarDun from '../../ui/Avatar'
import { useProject } from '../../../context/ProjectContext'
import { ICard } from '../../../types/Card'
import TaskPreview from '../../Task/TaskPreview'
import { MessageIcon, UpdateIcon } from '../../icons'

const MAX_IMAGES = 4
const MAX_TASKS = 4

interface ICardPreviewProps {
  card: ICard
  onClick: () => void
}

function CardPreview({ card, onClick }: ICardPreviewProps) {
  const { users: projectUsers } = useProject()
  const imageUrls = useMemo(
    () =>
      card?.files
        ?.filter((file) => file.type === 'image')
        .slice(0, MAX_IMAGES)
        .map((file) => file.url) ?? [],
    [card?.files],
  )

  const users = useMemo(
    () => projectUsers?.filter((user) => card.users?.includes(user.id)) ?? [],
    [card?.users, projectUsers],
  )

  const tasks = useMemo(() => card?.tasks?.slice(0, MAX_TASKS) ?? [], [card?.tasks])

  const taskCountExcess = (card?.tasks?.length || 0) - MAX_TASKS

  const createdAt = new Date(card.createdAt)
  const relativeTime = formatDistanceToNow(createdAt, { addSuffix: true })

  return (
    <div
      className='h-[23.125rem] p-7 overflow-hidden border-r-1 border-borders-purple hover:cursor-pointer'
      onClick={onClick}
    >
      <div className='flex flex-col h-full'>
        <div className='flex items-center justify-between mb-2'>
          <div className='text-xs text-gray-500 font-monaspace'>{relativeTime}</div>
          <div className='flex gap-x-2'>
            <MessageIcon count={card.chatIds.length} />
            <UpdateIcon count={0} />
          </div>
        </div>
        <div className='mb-4 text-lg not-italic font-semibold font-rubik'>{card.title}</div>
        {/* Tasks Preview */}
        <div className='flex-grow overflow-hidden'>
          {!isEmpty(tasks) ? (
            <div className='flex› flex-col gap-3'>
              {tasks?.map((task) => <TaskPreview key={task.id} task={task} />)}
              {taskCountExcess > 0 && (
                <span className='flex items-center h-full ml-3 text-sm underline'>
                  +{taskCountExcess}
                </span>
              )}
            </div>
          ) : (
            <div className='text-[#46434e] text-sm font-normal font-rubik leading-tight overflow-hidden'>
              {card.description?.slice(0, 2).join(' ')}
            </div>
          )}
        </div>
        {/* Images Preview */}
        {imageUrls.length > 0 && (
          <div className='flex mt-5'>
            {imageUrls.map((url, idx) => (
              <Image key={url + idx} className='w-12' src={url} alt='' />
            ))}
            {card.files?.length > MAX_IMAGES && (
              <span className='flex items-center h-full ml-3 text-sm underline font'>
                +{card.files.length - MAX_IMAGES}
              </span>
            )}
          </div>
        )}
        {/* User Avatars */}
        {/* TODO: make the display of avatars as in the design */}
        <div className='flex items-center justify-start gap-1 mt-2'>
          {!isEmpty(users)
            ? users?.map((user) => (
                <AvatarDun key={'card-user-' + card.id + user.id} user={user} size={28} />
              ))
            : null}
        </div>
      </div>
    </div>
  )
}
// TODO: Ask about this logic and confirm if it's correct for change it toAvatarDun component

export default CardPreview
