import { ICard } from '../../types/Card'
import { IUser } from '../../types/User'
import { useState, useRef, useEffect, useCallback } from 'react'
import { useDisclosure } from '@mantine/hooks'
import { Modal, Button, Input } from '@mantine/core'
import { useNavigate, useParams } from 'react-router-dom'
import Editor from '../Editor'
import { removeCard, saveOrCreateCard } from '../../services'
import Discussions from './Sections/Discussions'
import { useChats } from '../../context/ChatContext'
import clsx from 'clsx'
import Attachments from './Sections/Attachments'
import _debounce from 'lodash/debounce'
import Updates from './Sections/Updates'
import { FilePreviewProvider } from '../../context/FilePreviewContext'

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
  const inputRef = useRef<HTMLInputElement>(null)

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

  useEffect(() => {
    if (!title.length) inputRef.current?.focus()
  }, [])

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
      goBack()
    }
  }

  const goBack = () => {
    closeChat()
    navigate(`/${projectId}`)
  }

  return (
    <div className='w-full'>
      <div className='flex items-center justify-between h-14 border-b-2 border-border-color'>
        <div className='flex items-center mx-3 justify-between grow'>
          <div className='underline font-monaspace hover:cursor-pointer' onClick={goBack}>
            {'<'} Back to topics
          </div>
          <div className='flex gap-1'>
            <Button
              className='font-monaspace font-thin'
              radius={0}
              variant='outline'
              color='#464646'
              onClick={onRemoveCard}
            >
              Remove
            </Button>
            <Button
              className='font-monaspace font-thin'
              radius={0}
              color='#464646'
              onClick={() => onSave(title)}
            >
              Save
            </Button>
          </div>
        </div>
      </div>

      <div className='flex'>
        {/* Main content editor */}
        <div className='h-[calc(100vh_-_132px)] hide-scrollbar overflow-y-scroll w-full  z-20  mt-[20px] ml-[30px]'>
          <input
            className='block font-rubik align-middle text-[32px] overflow-hidden border-none ml-12 mb-6'
            placeholder='Type title'
            ref={inputRef}
            value={title}
            onChange={onTitleChange}
          />
          <Editor
            key={card.id} // using the key= prop will completely re-create the editor when the key changes
            projectId={projectId}
            card={card}
            users={users}
          />
        </div>
        {/* Card attachments, chats */}
        <div className='border-l-2 border-border-color w-full'>
          <div className='flex items-center justify-between h-14 border-b-2 border-border-color'>
            <div className='w-full grid grid-cols-3 h-full  divide-x-[1px] divide-gray-border border-border-color '>
              <div
                className={clsx(
                  'flex items-center justify-center font-monaspace ',
                  activeTab === 'discussions' ? 'bg-black text-white' : '',
                )}
                onClick={() => setActiveTab('discussions')}
              >
                Discussions • {unreadDiscussions}
              </div>
              <div
                className={clsx(
                  'flex items-center justify-center font-monaspace',
                  activeTab === 'attachments' ? 'bg-black text-white' : '',
                )}
                onClick={() => setActiveTab('attachments')}
              >
                Attachments • {card?.files?.length || 0}
              </div>
              <div
                className={clsx(
                  'flex items-center justify-center font-monaspace',
                  activeTab === 'updates' ? 'bg-black text-white' : '',
                )}
                onClick={() => setActiveTab('updates')}
              >
                Updates • 0
              </div>
            </div>
          </div>
          {
            {
              discussions: <Discussions users={users} />,
              attachments: <Attachments files={card.files} />,
              updates: <Updates />,
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

const CardWithPreview = (props: ICardProps) => {
  const { card } = props
  return (
    <FilePreviewProvider files={card?.files}>
      <Card {...props} />
    </FilePreviewProvider>
  )
}

export default CardWithPreview
