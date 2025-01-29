import { Modal } from './Modal'
import { ShareTopicModalContent } from './ShareTopicModalContent'
import { ICard } from '../../../types/Card'

interface IShareProps {
  opened: boolean
  onClose: () => void
  card: ICard
}

export function ShareTopicModal({ opened, onClose, card }: IShareProps) {
  return (
    <Modal opened={opened} onClose={onClose} title='Share topic'>
      <ShareTopicModalContent card={card} onClose={onClose} />
    </Modal>
  )
}
