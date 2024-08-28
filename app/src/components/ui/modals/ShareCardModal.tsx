import React from 'react'
import { Modal } from './Modal'

interface IShareCardModalProps {
  opened: boolean
  onClose: () => void
}

export function ShareCardModal({ onClose, opened }: IShareCardModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} noHeader size='md'>
      <div className='flex flex-col items-center justify-center'></div>
    </Modal>
  )
}
