import { Menu } from '@mantine/core'

import ButtonDun from '../ui/buttons/ButtonDun'
import { SharingMenu } from './Sharing/SharingMenu'
import { ConfirmModal } from '../ui/modals/ConfirmModal'

interface CardHeaderProps {
  goBack: () => void
  canShareAndRemoveTopic: boolean
  openShareModal: () => void
  isFirstTimeViewed: boolean
  updateSharingMode: (isPrivate: boolean) => void
  setShowConfirmModal: (value: boolean) => void
  showConfirmModal: boolean
  onRemoveCard: () => void
}

const CardHeader: React.FC<CardHeaderProps> = ({
  goBack,
  canShareAndRemoveTopic,
  openShareModal,
  isFirstTimeViewed,
  updateSharingMode,
  setShowConfirmModal,
  showConfirmModal,
  onRemoveCard,
}) => (
  <div className='flex items-center justify-between h-14 border-b-1 border-borders-purple'>
    <div className='flex items-center justify-between h-full mx-3 grow'>
      <div className='text-sm md:underline font-monaspace hover:cursor-pointer' onClick={goBack}>
        {'<'} back to topics
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
          <Menu shadow='md' radius={0} width={200}>
            <Menu.Target>
              <i
                onClick={(e) => e.stopPropagation()}
                className='text-2xl cursor-pointer ri-more-2-fill'
              />
            </Menu.Target>

            <Menu.Dropdown className='shadow-[6px_6px_0px_0px_#C1BAD0]'>
              <Menu.Item
                onClick={(e) => {
                  e.stopPropagation()
                  setShowConfirmModal(true)
                }}
                className='text-red-600'
              >
                Remove topic
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
          <ConfirmModal
            message='Are you sure you want to remove this topic?'
            confirmText='Remove'
            onClose={() => setShowConfirmModal(false)}
            onConfirm={onRemoveCard}
            opened={showConfirmModal}
          />
        </div>
      )}
    </div>
  </div>
)

export default CardHeader
