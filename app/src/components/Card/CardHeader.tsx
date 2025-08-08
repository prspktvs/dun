import { useLocation, useParams } from 'react-router-dom'
import { isEmpty } from 'lodash'
import { useMemo } from 'react'

import ButtonDun from '../ui/buttons/ButtonDun'
import { SharingMenu } from './Sharing/SharingMenu'
import { KebabMenu } from '../ui/KebabMenu'
import UserList from '../User/UserList'
import { ICard, IUser } from '../../types'
import { useProject } from '../../context/ProjectContext'

interface CardHeaderProps {
  card?: ICard
  goBack: () => void
  canShareAndRemoveTopic: boolean
  openShareModal: () => void
  isFirstTimeViewed: boolean
  updateSharingMode: (isPrivate: boolean) => void
  onRemoveCard: () => void
}

const CardHeader: React.FC<CardHeaderProps> = ({
  card,
  goBack,
  canShareAndRemoveTopic,
  openShareModal,
  isFirstTimeViewed,
  updateSharingMode,
  onRemoveCard,
}) => {
  const { id: projectId = '' } = useParams()
  const { users: projectUsers } = useProject()

  const users = useMemo(
    () =>
      (card?.public
        ? projectUsers
        : projectUsers?.filter(
            (user) => card?.users?.includes(user.id) || card.author === user.id,
          )) ?? [],
    [card?.users, projectUsers, card?.public],
  )

  const location = useLocation()

  const isKanbanPrevious = location.state?.backTo === `/${projectId}/kanban`
  return (
    <div className='flex items-center justify-between h-14 border-b-1 border-borders-purple'>
      <div className='flex items-center justify-between h-full mx-2 grow'>
        <div className='text-sm md:underline font-monaspace hover:cursor-pointer' onClick={goBack}>
          {'<'} back to {isKanbanPrevious ? 'kanban' : 'topics'}
        </div>
        <div className='flex h-full items-center gap-2'>
          <UserList users={users} />
          {canShareAndRemoveTopic && (
            <div className='flex items-center h-full'>
              <div className='relative hidden w-full h-full sm:block border-x-1 border-borders-purple'>
                <ButtonDun onClick={openShareModal}>Share topic</ButtonDun>
                {isFirstTimeViewed && (
                  <SharingMenu
                    openFullSharingModal={openShareModal}
                    updateSharingMode={updateSharingMode}
                  />
                )}
              </div>
              <div className='h-full aspect-square flex items-center justify-center'>
                <KebabMenu
                  menuText='Remove topic'
                  confirmMessage='Are you sure you want to remove this topic?'
                  confirmText='Remove'
                  onConfirm={onRemoveCard}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CardHeader
