import { ICard } from '../../types/Card'
import { IUser } from '../../types/User'
import { useState, useRef, useEffect } from 'react'
import { useDisclosure } from '@mantine/hooks'
import { Modal, Button, Input } from '@mantine/core'
import { useNavigate, useParams } from 'react-router-dom'
import Editor from '../Editor'
import { removeCard, saveOrCreateCard } from '../../services/cards'
import CardPreview from './CardPreview'
import Discussions from './Sections/Discussions'
import { useChats } from '../../context/ChatContext/ChatContext'
import clsx from 'clsx'

interface ICardProps {
  card: ICard
  users: IUser[]
}

const Card = ({ card, users }: ICardProps) => {
  const { id: projectId = '' } = useParams()
  const [title, setTitle] = useState(card.title)
  const [activeTab, setActiveTab] = useState<'discussions' | 'attachments' | 'updates'>(
    'discussions',
  )

  const navigate = useNavigate()

  const onTitleChange = (e) => setTitle(e.target.value)

  const onSave = async () => {
    await saveOrCreateCard(projectId, { ...card, title })
  }

  const onRemoveCard = async () => {
    if (confirm('Are you sure?')) {
      await removeCard(projectId, card.id)
    }
  }

  const goBack = () => navigate(`/${projectId}`)

  return (
    <div className='w-full'>
      <div className='flex items-center justify-between h-20 border-b-2 border-gray-border'>
        <div className='flex items-center mx-3 justify-between grow'>
          <div className='underline hover:cursor-pointer' onClick={goBack}>
            {'<'} Back to topics
          </div>
          <Button radius={0} variant='outline' color='#464646' onClick={onSave}>
            Save
          </Button>
        </div>
        <div className='flex items-center h-full w-[600px]'>
          <div className='w-full grid grid-cols-3 h-full border-l-2 divide-x-2 divide-gray-border border-gray-border'>
            <div
              className={clsx(
                'flex items-center justify-center',
                activeTab === 'discussions' ? 'bg-black text-white' : '',
              )}
              onClick={() => setActiveTab('discussions')}
            >
              Discussions
            </div>
            <div
              className={clsx(
                'flex items-center justify-center',
                activeTab === 'attachments' ? 'bg-black text-white' : '',
              )}
              onClick={() => setActiveTab('attachments')}
            >
              Attachments
            </div>
            <div
              className={clsx(
                'flex items-center justify-center',
                activeTab === 'updates' ? 'bg-black text-white' : '',
              )}
              onClick={() => setActiveTab('updates')}
            >
              Updates
            </div>
          </div>
        </div>
      </div>

      <div className='flex'>
        {/* Main content editor */}
        <div className='h-[calc(100vh_-_164px)] pl-5 w-full z-20'>
          <input
            className='block ml-3 align-middle text-[32px] w-1/2 border-none'
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
              attachments: null,
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
