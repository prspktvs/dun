import { CopyButton } from '@mantine/core'
import { Modal } from './Modal'
import ButtonDun from '../buttons/ButtonDun'
import { useParams } from 'react-router-dom'
import { DUN_URL } from '../../../constants'
import { isEmpty } from 'lodash'
import { useProject } from '../../../context/ProjectContext'
import AvatarDun from '../Avatar'
import { useEffect, useMemo, useState } from 'react'
import { IUser } from '../../../types/User'
import { ICard } from '../../../types/Card'
import { shareCard, unshareCard } from '../../../services/card.service'
import { ConfirmModal } from './ConfirmModal'

interface IShareProps {
  opened: boolean
  onClose: () => void
  card: ICard
}

export function ShareTopicModal({ opened, onClose, card }: IShareProps) {
  const { id: projectId, cardId } = useParams()
  const { users, updateCard } = useProject()
  const [confirmOpened, setConfirmOpened] = useState(false)

  const [sharedUsers, unsharedUsers] = useMemo(() => {
    return users.reduce(
      (acc: [IUser[], IUser[]], user: IUser) => {
        if (card.users?.includes(user.id) || card.author === user.id) {
          acc[0].push(user)
        } else {
          acc[1].push(user)
        }
        return acc
      },
      [[], []] as [IUser[], IUser[]],
    )
  }, [users, card.users, card.author])

  const onShare = (userId: IUser['id']) => {
    shareCard(cardId as string, [userId])
    updateCard({ ...card, users: [...card.users, userId] })
  }
  const onShareAll = () => {
    shareCard(
      cardId as string,
      unsharedUsers.map((user) => user.id),
    )
    updateCard({ ...card, users: [...card.users, ...unsharedUsers.map((user) => user.id)] })
    setConfirmOpened(false)
  }
  const onUnshare = (userId: IUser['id']) => {
    unshareCard(cardId as string, userId)
    updateCard({ ...card, users: card.users?.filter((id) => id !== userId) })
  }

  const copyUrl = DUN_URL + `/${projectId}/cards/${cardId}`
  return (
    <Modal opened={opened} onClose={onClose} title='Share topic'>
      <div className='flex mt-4 justify-between items-center h-14 border-y-1 border-border-color'>
        <div className='px-5 w-1/4 font-bold ml-3 font-monaspace'>Invite link</div>
        <div className='w-2/4 text-sm my-5 h-full border-x-1 border-border-color flex items-center px-3'>
          {copyUrl}
        </div>
        <div className='w-1/4 h-14'>
          <CopyButton value={copyUrl}>
            {({ copied, copy }) => (
              <ButtonDun className={copied ? 'opacity-80' : ''} onClick={copy}>
                {copied ? 'Copied' : 'Copy'}
              </ButtonDun>
            )}
          </CopyButton>
        </div>
      </div>
      <div className='flex items-center justify-between h-14 border-b-1 border-border-color'>
        <span className='px-5 ml-3 font-bold font-monaspace'>Members</span>
      </div>
      <div className='px-5 py-3 max-h-[300px] flex flex-col overflow-y-scroll'>
        {!isEmpty(sharedUsers)
          ? sharedUsers.map((user, index) => (
              <div
                key={'ps-user-' + user.id}
                className='my-2 ml-3 flex items-center justify-between'
              >
                <div className='flex items-center gap-3'>
                  <AvatarDun user={user} size={40} />
                  <div className='flex flex-col'>
                    <span className='text-base font-medium '>{user.name}</span>
                    <span className='text-sm '>{user.email}</span>
                  </div>
                </div>
                <div>
                  {user.id === card.author ? (
                    <span className='font-bold text-black font-monaspace'>Owner</span>
                  ) : (
                    <span
                      className='font-bold text-red-400 font-monaspace hover:cursor-pointer'
                      onClick={() => onUnshare(user.id)}
                    >
                      Remove
                    </span>
                  )}
                </div>
              </div>
            ))
          : null}
      </div>
      {!isEmpty(unsharedUsers) ? (
        <>
          <div className='flex items-center justify-between h-14 border-y-1 border-border-color'>
            <span className='px-5 ml-3 font-bold font-monaspace'>Your team</span>
            <span
              className='px-5 ml-3 font-bold text-[#8279BD] font-monaspace hover:cursor-pointer'
              onClick={() => setConfirmOpened(true)}
            >
              Share with all
            </span>
            <ConfirmModal
              confirmText='Share'
              message='Are you sure you want to share this topic with all your team members?'
              onClose={() => setConfirmOpened(false)}
              onConfirm={onShareAll}
              opened={confirmOpened}
            />
          </div>
          <div className='px-5 py-3 max-h-[300px] flex flex-col overflow-y-scroll'>
            {unsharedUsers.map((user, index) => (
              <div
                key={'ps-user-' + user.id}
                className='my-2 ml-3 flex items-center justify-between'
              >
                <div className='flex items-center gap-3'>
                  <AvatarDun user={user} size={40} />
                  <div className='flex flex-col'>
                    <span className='text-base font-medium '>{user.name}</span>
                    <span className='text-sm '>{user.email}</span>
                  </div>
                </div>
                <span
                  className='font-bold text-[#8279BD] font-monaspace hover:cursor-pointer'
                  onClick={() => onShare(user.id)}
                >
                  Share
                </span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className='flex items-center justify-between h-14 border-t-1 border-border-color'>
          <span className='px-5 ml-3 font-bold font-monaspace'>
            All your team is following this topic
          </span>
        </div>
      )}
    </Modal>
  )
}
