import { isEmpty } from 'lodash'
import { Image } from '@mantine/core'
import { useMemo } from 'react'
import { formatDistanceToNow } from 'date-fns'

import AvatarDun from '../../ui/Avatar'
import { useProject } from '../../../context/ProjectContext'
import { ICard } from '../../../types/Card'
import TaskPreview from '../../Task/TaskPreview'
import { MessageIcon, UpdateIcon } from '../../icons'
import UserList from '../../User/UserList'

const MAX_IMAGES = 4
const MAX_TASKS = 4

interface ICardPreviewProps {
  card: ICard
  onClick: () => void
}

function CardPreview({ card, onClick }: ICardPreviewProps) {
  const { users: projectUsers, getUnreadCardMessagesCount } = useProject()

  const imageUrls = useMemo(
    () =>
      card?.files
        ?.filter((file) => file.type === 'image')
        .slice(0, MAX_IMAGES)
        .map((file) => file.url) ?? [],
    [card?.files],
  )

  const users = useMemo(
    () =>
      (card.public
        ? projectUsers
        : projectUsers?.filter(
            (user) => card.users?.includes(user.id) || card.author === user.id,
          )) ?? [],
    [card.users, projectUsers, card.public],
  )

  const tasks = useMemo(() => card?.tasks?.slice(0, MAX_TASKS) ?? [], [card?.tasks])

  const taskCountExcess = (card?.tasks?.length || 0) - MAX_TASKS

  const createdAt = new Date(card.createdAt)
  const relativeTime = formatDistanceToNow(createdAt, { addSuffix: true })

  const unreadMessagesCount = getUnreadCardMessagesCount(card.id)

  return (
    <div
      className='h-[23.125rem] p-7 overflow-hidden border-r-1 border-borders-purple hover:cursor-pointer hidden md:flex'
      onClick={onClick}
    >
      <div className='flex flex-col h-full'>
        <div className='flex items-center justify-between mb-2'>
          <div className='text-xs text-gray-500 font-monaspace'>{relativeTime}</div>
          <div className='flex gap-x-2'>
            {unreadMessagesCount > 0 && <MessageIcon count={unreadMessagesCount} />}
            {/* <UpdateIcon count={0} /> */}
          </div>
        </div>
        <div className='text-lg not-italic font-semibold font-rubik'>{card.title}</div>
        {/* Tasks Preview */}
        <div className='flex-grow overflow-hidden my-2'>
          {!isEmpty(tasks) ? (
            <div className='flex› flex-col gap-3'>
              {tasks?.map((task) => <TaskPreview key={task.id} task={task} />)}
              {taskCountExcess > 0 && (
                <span className='flex items-center h-full ml-3 text-sm underline'>
                  +{taskCountExcess}
                </span>
              )}
            </div>
          ) : !isEmpty(card.description) ? (
            <div className='text-[#46434e] text-sm font-normal font-rubik leading-tight overflow-hidden'>
              {card.description?.map((text, id) => (
                <p key={'card-desc-' + card.id + '-' + id} className='py-[2px] m-0 truncate'>
                  {text}
                </p>
              ))}
            </div>
          ) : (
            <div className='flex h-full flex-col justify-center items-center'>
              <span className='font-monaspace text-[#969696] text-sm'>Empty topic</span>
              <span className='font-monaspace text-[#969696] text-sm'>
                Be the first, make your mark.
              </span>
            </div>
          )}
        </div>
        {/* Images Preview */}
        {imageUrls.length > 0 && (
          <div className='flex mb-2'>
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
        <UserList users={users} />
      </div>
    </div>
  )
}
// TODO: Ask about this logic and confirm if it's correct for change it toAvatarDun component

export default CardPreview
