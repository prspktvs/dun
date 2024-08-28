import React from 'react'
import { Modal } from './Modal'

interface IConfirmModalProps {
  opened: boolean
  onClose: () => void
  onConfirm: () => void
  closeText?: string
  confirmText?: string
  message: string
}

export function ConfirmModal({
  onClose,
  onConfirm,
  opened,
  message,
  confirmText = 'Confirm',
  closeText = 'Cancel',
}: IConfirmModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} noHeader size='md'>
      <div className='flex flex-col items-center justify-center'>
        <div className='w-full text-md font-bold font-monaspace px-5 pt-3'>{message}</div>
        <div className='flex mt-4 border-border-color border-t-1 w-full'>
          <button
            onClick={onClose}
            className='flex items-center justify-center w-1/2 h-14 border-r-1 border-border-color'
          >
            <div className='font-bold font-monaspace text-[#E86D6D]'>{closeText}</div>
          </button>
          <button onClick={onConfirm} className='flex items-center justify-center w-1/2 h-14'>
            <div className='font-bold font-monaspace text-[#8279BD]'>{confirmText}</div>
          </button>
        </div>
      </div>
    </Modal>
  )
}
