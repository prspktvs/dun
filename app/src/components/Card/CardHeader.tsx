import { useLocation, useParams } from 'react-router-dom'

import ButtonDun from '../ui/buttons/ButtonDun'
import { SharingMenu } from './Sharing/SharingMenu'
import { KebabMenu } from '../ui/KebabMenu'

interface CardHeaderProps {
  goBack: () => void
  canShareAndRemoveTopic: boolean
  openShareModal: () => void
  isFirstTimeViewed: boolean
  updateSharingMode: (isPrivate: boolean) => void
  onRemoveCard: () => void
}

const CardHeader: React.FC<CardHeaderProps> = ({
  goBack,
  canShareAndRemoveTopic,
  openShareModal,
  isFirstTimeViewed,
  updateSharingMode,
  onRemoveCard,
}) => {
  const { id: projectId = '' } = useParams()
  const location = useLocation()

  const isKanbanPrevious = location.state?.backTo === `/${projectId}/kanban`
  return (
    <div className='flex items-center justify-between h-14 border-b-1 border-borders-purple'>
      <div className='flex items-center justify-between h-full mx-3 grow'>
        <div className='text-sm md:underline font-monaspace hover:cursor-pointer' onClick={goBack}>
          {'<'} back to {isKanbanPrevious ? 'kanban' : 'topics'}
        </div>
        {canShareAndRemoveTopic && (
          <div className='flex items-center h-full gap-1'>
            <div className='relative hidden w-full h-full sm:block'>
              <ButtonDun onClick={openShareModal}>Share topic</ButtonDun>
              {isFirstTimeViewed && (
                <SharingMenu
                  openFullSharingModal={openShareModal}
                  updateSharingMode={updateSharingMode}
                />
              )}
            </div>
            <KebabMenu
              menuText='Remove topic'
              confirmMessage='Are you sure you want to remove this topic?'
              confirmText='Remove'
              onConfirm={onRemoveCard}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default CardHeader
