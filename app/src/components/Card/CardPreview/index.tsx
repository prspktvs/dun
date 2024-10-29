import { isEmpty } from 'lodash'
import { ICard, IUser } from '../../../types/Card'
import { Image, Avatar, AvatarGroup } from '@mantine/core'
import TaskPreview from '../../Task/TaskPreview'
import { MessageIcon, UpdateIcon } from '../../icons'
import ProjectUsers from '../../User/ProjectUsers'
import { useMemo } from 'react'
import { formatDistanceToNow } from 'date-fns'
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
        ?.slice(0, MAX_IMAGES)
        ?.map((file) => file.url) ?? [],
    [card?.files],
  )

  const countChats = card?.chatIds?.length || 0
  const tasks = card?.tasks
  const createdAt = new Date(card.createdAt)
  const relativeTime = formatDistanceToNow(createdAt, { addSuffix: true })

  return (
    <div
      className='h-[23.125rem] p-7 overflow-hidden border-r-1 border-border-color hover:cursor-pointer'
      onClick={onClick}
    >
      <div className='flex flex-col h-full'>
        <div className='flex items-center justify-between mb-2'>
          <div className='text-xs text-gray-500 font-monaspace'>{relativeTime}</div>{' '}
          {/* Отображаем относительное время */}
          <div className='flex gap-x-2'>
            <MessageIcon count={countChats} />
            <UpdateIcon count={0} />
          </div>
        </div>
        <div className='flex-shrink-0'>
          {card.title && (
            <div className='h-[62px] w-full flex-col justify-start items-start gap-3 inline-flex'>
              <div
                className="self-stretch text-[#46434e] text-xl font-medium font-['Rubik'] leading-7 overflow-hidden"
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {card.title}
              </div>
            </div>
          )}
        </div>
        <div className='flex-grow overflow-hidden'>
          {!isEmpty(tasks) ? (
            <div className='flex flex-col gap-3'>
              <div className='col-span-3 overflow-hidden'>
                {tasks.slice(0, MAX_TASKS).map((task) => (
                  <div
                    key={'prevtask-' + task.id}
                    className='h-[46px] py-1 justify-start items-start gap-2 inline-flex'
                  >
                    <div className='w-4 h-4 justify-center items-center flex'>
                      <div className='w-4 h-4 pl-[1.6px] pr-[1.23px] pt-[1.6px] pb-[1.3px] justify-center items-center inline-flex'>
                        <i className='ri-checkbox-line text-14' />
                      </div>
                    </div>
                    <div className='grow shrink basis-0'>
                      <span className="text-[#46434e] text-sm font-normal font-['Rubik'] leading-[18.9px]">
                        {task.title}
                      </span>
                      <span className="text-[#46434e] text-sm font-semibold font-['Rubik'] leading-[18.9px]">
                        @{task.assignedTo}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              {tasks.length > MAX_TASKS && (
                <span className='ml-3 flex items-center h-full underline text-sm'>
                  +{tasks.length - MAX_TASKS}
                </span>
              )}
            </div>
          ) : (
            <div className='flex-grow overflow-hidden'>
              {card.description.map((line, index) => (
                <div
                  key={'description-' + line + index}
                  className="text-[#46434e] text-sm font-normal font-['Rubik'] leading-tight overflow-hidden"
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {line}
                </div>
              ))}
            </div>
          )}
        </div>
        {imageUrls.length > 0 && (
          <div className='mt-auto w-full'>
            <div className='h-[56px] w-full pr-2 bg-white rounded-sm justify-start items-center gap-1 inline-flex'>
              <div className='justify-start items-center flex w-full'>
                {imageUrls.slice(0, MAX_IMAGES).map((url, index) => (
                  <img
                    key={index}
                    className='w-14 h-14 relative rounded-sm border border-[#efefef]'
                    src={url}
                  />
                ))}
                {imageUrls.length > MAX_IMAGES && (
                  <div className='w-14 h-14 bg-white rounded-sm border border-[#efefef] justify-center items-center flex'>
                    <span className="text-[#46434e] text-sm font-normal font-['Monaspace Argon Var']">
                      +{imageUrls.length - MAX_IMAGES}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
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
