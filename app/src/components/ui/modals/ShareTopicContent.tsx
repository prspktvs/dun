import { useEffect, useMemo, useState } from 'react'
import { CopyButton } from '@mantine/core'
import { isEmpty } from 'lodash'
import { useParams } from 'react-router-dom'

import ButtonDun from '../buttons/ButtonDun'
import { DUN_URL } from '../../../constants'
import { useProject } from '../../../context/ProjectContext'
import AvatarDun from '../Avatar'
import { IUser } from '../../../types/User'
import { ICard } from '../../../types/Card'
import { shareCard, unshareCard } from '../../../services/card.service'
import { ConfirmModal } from './ConfirmModal'
import { SharingOption } from '../../Card/Sharing/SharingOption'
import { useBreakpoint } from '../../../hooks/useBreakpoint'

interface IShareTopicContentProps {
  card: ICard
  onClose: () => void
}

const InviteLinkSection = ({ copyUrl }: { copyUrl: string }) => (
  <div className='flex items-center justify-between mt-4 h-14 border-y-1 border-borders-purple'>
    <div className='flex items-center w-[calc(100%_-_120px)] h-full px-3 my-5 overflow-hidden text-sm truncate border-x-1 border-borders-purple'>
      {copyUrl}
    </div>
    <div style={{ width: '120px' }} className='h-14'>
      <CopyButton value={copyUrl}>
        {({ copied, copy }) => (
          <ButtonDun className={copied ? 'opacity-80' : ''} onClick={copy}>
            {copied ? 'Copied' : 'Copy'}
          </ButtonDun>
        )}
      </CopyButton>
    </div>
  </div>
)

const SharingOptions = ({
  isPrivate,
  togglePrivacy,
  setConfirmOpened,
  confirmOpened,
}: {
  isPrivate: boolean
  togglePrivacy: (isPrivate: boolean) => void
  setConfirmOpened: (opened: boolean) => void
  confirmOpened: boolean
}) => (
  <div className='flex w-full divide-x-1 divide-borders-purple border-b-1 border-borders-purple'>
    <SharingOption
      title='Private'
      description='Only you and selected users can view and edit this topic'
      onClick={() => togglePrivacy(true)}
      isActive={isPrivate}
    />
    <SharingOption
      title='Share with everyone in this project'
      description='All new project members can view and edit this topic'
      onClick={() => setConfirmOpened(true)}
      isActive={!isPrivate}
    />
    <ConfirmModal
      confirmText='Share'
      message='Are you sure you want to share this topic with all your team members?'
      onClose={() => setConfirmOpened(false)}
      onConfirm={() => togglePrivacy(false)}
      opened={confirmOpened}
    />
  </div>
)

const UserItem = ({
  user,
  onAction,
  actionLabel,
  isOwner,
}: {
  user: IUser
  onAction: () => void
  actionLabel: string
  isOwner: boolean
}) => (
  <div className='flex items-center justify-between my-2 ml-3'>
    <div className='flex items-center gap-3'>
      <AvatarDun user={user} size={40} />
      <div className='flex flex-col'>
        <span className='text-base font-medium '>{user.name}</span>
        <span className='text-sm '>{user.email}</span>
      </div>
    </div>
    <div>
      {isOwner ? (
        <span className='font-bold text-black font-monaspace'>Owner</span>
      ) : (
        <span
          className={`font-bold ${actionLabel === 'Remove' ? 'text-red-400' : 'text-btnBg'} font-monaspace hover:cursor-pointer`}
          onClick={onAction}
        >
          {actionLabel}
        </span>
      )}
    </div>
  </div>
)

const UserListSection = ({
  title,
  users,
  onAction,
  actionLabel,
  isOwnerCheck,
}: {
  title: string
  users: IUser[]
  onAction: (userId: IUser['id']) => void
  actionLabel: string
  isOwnerCheck: (user: IUser) => boolean
}) => (
  <>
    <div className='flex items-center justify-between h-14 border-y-1 border-borders-purple'>
      <span className='px-5 ml-3 font-bold font-monaspace'>{title}</span>
    </div>
    <div className='px-5 py-3 max-h-[300px] flex flex-col overflow-y-scroll'>
      {users.map((user) => (
        <UserItem
          key={user.id}
          user={user}
          onAction={() => onAction(user.id)}
          actionLabel={actionLabel}
          isOwner={isOwnerCheck(user)}
        />
      ))}
    </div>
  </>
)

export function ShareTopicContent({ card }: IShareTopicContentProps) {
  const { id: projectId, cardId } = useParams()
  const { users, updateCard, project, optimisticUpdateCard } = useProject()
  const [isPrivate, setIsPrivate] = useState(!card.public)
  const [confirmOpened, setConfirmOpened] = useState(false)

  useEffect(() => {
    setIsPrivate(!card.public)
  }, [card.public])

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

  const onUnshare = (userId: IUser['id']) => {
    unshareCard(cardId as string, userId)
    updateCard({ ...card, users: card.users?.filter((id) => id !== userId) })
  }

  const togglePrivacy = (_isPrivate: boolean) => {
    setIsPrivate(_isPrivate)
    optimisticUpdateCard({ ...card, public: !_isPrivate })
    setConfirmOpened(false)
  }

  const copyUrl = DUN_URL + `/${projectId}/cards/${cardId}`
  return (
    <>
      <InviteLinkSection copyUrl={copyUrl} />
      <SharingOptions
        isPrivate={isPrivate}
        togglePrivacy={togglePrivacy}
        setConfirmOpened={setConfirmOpened}
        confirmOpened={confirmOpened}
      />
      {isPrivate ? (
        <>
          <UserListSection
            title='Who has access'
            users={sharedUsers}
            onAction={onUnshare}
            actionLabel='Remove'
            isOwnerCheck={(user) => user.id === card.author}
          />
          {!isEmpty(unsharedUsers) ? (
            <UserListSection
              title={`${project.title} team`}
              users={unsharedUsers}
              onAction={onShare}
              actionLabel='Share'
              isOwnerCheck={() => false}
            />
          ) : (
            <div className='flex items-center justify-between h-14 border-t-1 border-borders-purple'>
              <span className='px-5 ml-3 font-bold font-monaspace'>
                All your team is following this topic
              </span>
            </div>
          )}
        </>
      ) : (
        <div className='overflow-y-scroll max-h-[400px] px-5'>
          {users.map((user) => (
            <UserItem
              key={user.id}
              user={user}
              onAction={() => {}}
              actionLabel=''
              isOwner={user.id === card.author}
            />
          ))}
        </div>
      )}
    </>
  )
}
