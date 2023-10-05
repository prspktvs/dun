import { ICard } from '../../types/Card'
import { IUser } from '../../types/User'
import { useState, useRef, useEffect } from 'react'
import { useDisclosure } from '@mantine/hooks'
import { Modal, Button, Input } from '@mantine/core'
import { useNavigate } from 'react-router-dom'
import Editor from '../Editor'
import { removeCard, saveOrCreateCard } from '../../services/cards'
import CardPreview from './CardPreview'

interface ICardProps {
  card: ICard
  projectId?: string
  cardOpenId: string
  users: IUser[]
}

const Card = ({ card, cardOpenId, projectId, users }: ICardProps) => {
  const [title, setTitle] = useState(card.title)

  const [opened, { open, close }] = useDisclosure(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (card.id === cardOpenId) open()
    else close()
  }, [cardOpenId])

  const onTitleChange = (e) => setTitle(e.target.value)

  const onSave = async () => {
    await saveOrCreateCard(projectId, { ...card, title })
    onClose()
  }

  const onRemoveCard = async () => {
    if (confirm('Are you sure?')) {
      await removeCard(projectId, card.id)
      onClose()
    }
  }

  const onOpen = () => {
    navigate(`/${projectId}/cards/${card.id}`, { replace: true })

    open()
  }

  const onClose = () => {
    close()

    navigate(`/${projectId}`, { replace: true })
  }

  return (
    <>
      <CardPreview onClick={onOpen} card={card} />
      <Modal
        opened={opened}
        onClose={onClose}
        withCloseButton={false}
        size='70%'
        zIndex={1}
        lockScroll
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <div className=''>
          {/* Title input */}
          <div className='flex justify-between items-center'>
            <input
              className='block ml-3 align-middle text-[32px] w-1/2 border-none'
              placeholder='Type title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Button variant='transparent' color='rgba(255, 89, 89, 1)' onClick={onRemoveCard}>
              Remove card
            </Button>
          </div>

          {/* Main content editor */}
          <div className='overflow-x-hidden overflow-y-scroll h-[550px] z-20'>
            <Editor projectId={projectId} card={card} users={users} />
          </div>

          {/* Footer */}
          <div className='mx-3 flex gap-5 justify-end'>
            {/* <div className='w-[250px]'>
							<Button radius={0} fullWidth variant='outline' color='#464646'>
								Connect with existing thread
							</Button>
						</div> */}
            <div className='w-[250px]'>
              <Button radius={0} fullWidth variant='filled' color='#464646' onClick={onSave}>
                Save
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default Card
