import { Modal } from './Modal'
import { ShareTopicContent } from './ShareTopicContent'
import { ICard } from '../../../types/Card'

interface IShareProps {
  opened: boolean
  onClose: () => void
  card: ICard
}

export function ShareTopicModal({ opened, onClose, card }: IShareProps) {
  return (
    <Modal opened={opened} onClose={onClose} title='Share topic'>
      <ShareTopicContent card={card} onClose={onClose} />
    </Modal>
  )
}
