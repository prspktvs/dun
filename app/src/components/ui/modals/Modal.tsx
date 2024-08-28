import { Modal as ModalMantine } from '@mantine/core'
import React from 'react'

export function Modal({
  children,
  opened,
  title,
  size = '60%',
  onClose,
  noHeader,
}: {
  children?: React.ReactNode
  opened: boolean
  title?: string
  size?: string
  noHeader?: boolean
  onClose: () => void
}) {
  return (
    <ModalMantine
      opened={opened}
      onClose={onClose}
      overlayProps={{
        backgroundOpacity: 0.6,
        blur: 3,
      }}
      centered
      padding={0}
      withCloseButton={!noHeader}
      title={noHeader ? '' : <span className='font-monaspace font-bold p-0 m-0'>{title}</span>}
      size={size}
      radius={0}
      styles={{
        header: {
          position: 'relative',
          marginLeft: 10,
          marginRight: 10,
          zIndex: 202,
        },
        content: {
          position: 'relative',
          backgroundColor: 'white',
          boxShadow: '14px 14px 0px 0px #C1BAD0',
          padding: 0,
          overflow: 'hidden',
        },
      }}
    >
      {children}
    </ModalMantine>
  )
}
