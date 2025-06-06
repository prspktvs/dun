import { Menu } from '@mantine/core'
import { useState } from 'react'

import { ConfirmModal } from './modals/ConfirmModal'

interface IKebabMenuProps {
  menuWidth?: number
  confirmMessage: string
  confirmText: string
  onConfirm: () => void
  menuText: string
  withoutConfirm?: boolean
  menuClassName?: string
}

export const KebabMenu = ({
  menuWidth = 200,
  confirmMessage,
  confirmText,
  onConfirm,
  menuText,
  withoutConfirm = false,
  menuClassName = 'text-red-600',
}: IKebabMenuProps) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  return (
    <>
      <Menu shadow='md' radius={0} width={menuWidth}>
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
              if (withoutConfirm) {
                onConfirm()
                return
              }
              setShowConfirmModal(true)
            }}
            className={menuClassName}
          >
            {menuText}
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>

      <ConfirmModal
        message={confirmMessage}
        confirmText={confirmText}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={onConfirm}
        opened={showConfirmModal}
      />
    </>
  )
}
