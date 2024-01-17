import { ICard } from '../../types/Card'
import { IUser } from '../../types/User'
import { useState, useRef, useEffect, useCallback } from 'react'
import { useDisclosure } from '@mantine/hooks'
import { Modal, Button, Input } from '@mantine/core'
import { useNavigate, useParams } from 'react-router-dom'
import Editor from '../Editor'
import { removeCard, saveOrCreateCard } from '../../services/cards'
import CardPreview from './CardPreview'
import Discussions from './Sections/Discussions'
import { useChats } from '../../context/ChatContext/ChatContext'
import clsx from 'clsx'
import Attachments from './Sections/Attachments'
import _debounce from 'lodash/debounce'

interface ICardProps {
  card: ICard
  users: IUser[]
}

const Card = ({ card, users }: ICardProps) => {
  const { id: projectId = '' } = useParams()
  const [title, setTitle] = useState(card.title)
  const { closeChat, unreadChats } = useChats()
  const [activeTab, setActiveTab] = useState<'discussions' | 'attachments' | 'updates'>(
    'discussions',
  )

  const unreadDiscussions = unreadChats.reduce(
    (acc, chat) => (card.chatIds?.includes(chat.id) ? acc + chat.unreadCount : acc),
    0,
  )

  const navigate = useNavigate()

  const onTitleChange = (e) => {
    const val = e.target.value
    setTitle(val)

    onDebouncedSave(val)
  }

  const onSave = (t) => saveOrCreateCard(projectId, { ...card, title: t })

  const onDebouncedSave = useCallback(
    _debounce(async (title) => {
      await onSave(title)
    }, 1500),
    [],
  )

  const onRemoveCard = async () => {
    if (confirm('Are you sure?')) {
      await removeCard(projectId, card.id)
    }
  }

  const goBack = () => {
    closeChat()
    navigate(`/${projectId}`)
  }

  return (
    <div className='w-full'>
      <div className='flex items-center justify-between h-20 border-b-2 border-gray-border'>
        <div className='flex items-center mx-3 justify-between grow'>
          <div className='underline hover:cursor-pointer' onClick={goBack}>
            {'<'} Back to topics
          </div>
          <div className='flex gap-1'>
            <Button radius={0} variant='outline' color='#464646' onClick={onRemoveCard}>
              Remove
            </Button>
            <Button radius={0} color='#464646' onClick={() => onSave(title)}>
              Save
            </Button>
          </div>
        </div>
        <div className='flex items-center h-full w-[600px]'>
          <div className='w-full grid grid-cols-3 h-full border-l-2 divide-x-[1px] divide-gray-border border-gray-border'>
            <div
              className={clsx(
                'flex items-center justify-center',
                activeTab === 'discussions' ? 'bg-black text-white' : '',
              )}
              onClick={() => setActiveTab('discussions')}
            >
              Discussions • {unreadDiscussions}
            </div>
            <div
              className={clsx(
                'flex items-center justify-center',
                activeTab === 'attachments' ? 'bg-black text-white' : '',
              )}
              onClick={() => setActiveTab('attachments')}
            >
              Attachments • {card.files.length}
            </div>
            <div
              className={clsx(
                'flex items-center justify-center',
                activeTab === 'updates' ? 'bg-black text-white' : '',
              )}
              onClick={() => setActiveTab('updates')}
            >
              Updates • 0
            </div>
          </div>
        </div>
      </div>

      <div className='flex'>
        {/* Main content editor */}
        <div className='h-[calc(100vh_-_164px)] px-5 w-full z-20'>
          <input
            className='block align-middle text-[32px] w-full overflow-hidden border-none'
            placeholder='Type title'
            value={title}
            onChange={onTitleChange}
          />
          <Editor projectId={projectId} card={card} users={users} />
        </div>
        {/* Card attachments, chats */}
        <div className='min-w-[600px] border-l-2 border-gray-border'>
          {
            {
              discussions: <Discussions users={users} />,
              attachments: <Attachments files={card.files} />,
              updates: null,
            }[activeTab]
          }
        </div>
      </div>

      {/* Footer */}
      {/* <div className='mx-3 flex gap-5 justify-end'>
          <div className='w-[250px]'>
            <Button radius={0} fullWidth variant='filled' color='#464646' onClick={onSave}>
              Save
            </Button>
          </div>
        </div> */}
    </div>
  )
}

export default Card
