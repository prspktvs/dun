import { ICard } from '../../types/Card'
import { IUser } from '../../types/User'
import { useState, useRef, useEffect, useCallback } from 'react'
import { useDisclosure } from '@mantine/hooks'
import { Modal, Button, Input } from '@mantine/core'
import { useNavigate, useParams } from 'react-router-dom'
import Editor from '../Editor'
import { removeCard, updateCard } from '../../services'
import Discussions from './Sections/Discussions'
import { useChats } from '../../context/ChatContext'
import clsx from 'clsx'
import Attachments from './Sections/Attachments'
import _debounce from 'lodash/debounce'
import Updates from './Sections/Updates'
import { FilePreviewProvider } from '../../context/FilePreviewContext'
import { useProject } from '../../context/ProjectContext'

interface ICardProps {
  card: ICard
  users: IUser[]
}

const Card = ({ card, users }: ICardProps) => {
  const { id: projectId = '' } = useParams()
  const { optimisticDeleteCard, optimisticUpdateCard } = useProject()
  const { closeChat, unreadChats } = useChats()

  const [title, setTitle] = useState(card.title)
  const [activeTab, setActiveTab] = useState<'discussions' | 'attachments' | 'updates'>(
    'discussions',
  )
  const inputRef = useRef<HTMLTextAreaElement>(null)

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
    const textarea = inputRef.current
    if (!textarea) return
    textarea.style.height = 'auto'
    const maxHeight = 144
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`
  }, [title])

  useEffect(() => {
    if (!title.length) inputRef.current?.focus()
  }, [])

  const onSaveTitle = (t) => optimisticUpdateCard({ ...card, title: t })

  const onDebouncedSave = useCallback(
    _debounce(async (title) => {
      await onSaveTitle(title)
    }, 1500),
    [],
  )

  const onRemoveCard = async () => {
    if (!card?.id) return

    if (confirm('Are you sure?')) {
      await optimisticDeleteCard(card.id)
      goBack()
    }
  }

  const goBack = () => {
    closeChat()
    navigate(`/${projectId}`)
  }

  return (
    <div className='w-[calc(100%_-_320px)]'>
      <div className='flex items-center justify-between h-14 border-b-1 border-border-color'>
        <div className='flex items-center mx-3 justify-between grow'>
          <div className='underline font-monaspace text-sm hover:cursor-pointer' onClick={goBack}>
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
              onClick={() => onSaveTitle(title)}
            >
              Save
            </Button>
          </div>
        </div>
      </div>

      <div className='flex'>
        {/* Main content editor */}
        <div className='h-[calc(100vh_-_132px)] w-full hide-scrollbar overflow-y-scroll overflow-x-hidden z-20 mt-[20px] ml-[30px]'>
          <textarea
            className='font-rubik align-middle h-auto min-h-[40px] text-[32px] border-none ml-12 mb-6 resize-none overflow-hidden w-[300px] md:w-3/4 lg:w-5/6'
            rows={1}
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
        <div className='border-l-1 border-border-color'>
          <div className='flex items-center justify-between h-14 border-b-1 border-border-color'>
            <div className='grid grid-cols-3 h-full  divide-x-[1px] divide-gray-border border-border-color w-[320px] lg:w-[400px] xl:w-[500px] 2xl:w-[600px]'>
              <div
                className={clsx(
                  'flex items-center justify-center font-monaspace text-xs lg:text-sm',
                  activeTab === 'discussions' ? 'bg-black text-white' : '',
                )}
                onClick={() => setActiveTab('discussions')}
              >
                Discussions • {unreadDiscussions}
              </div>
              <div
                className={clsx(
                  'flex items-center justify-center font-monaspace text-xs lg:text-sm',
                  activeTab === 'attachments' ? 'bg-black text-white' : '',
                )}
                onClick={() => setActiveTab('attachments')}
              >
                Attachments • {card?.files?.length || 0}
              </div>
              <div
                className={clsx(
                  'flex items-center justify-center font-monaspace text-xs lg:text-sm',
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
