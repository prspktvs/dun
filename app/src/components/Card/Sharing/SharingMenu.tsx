import { useCallback, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { SharingOption } from './SharingOption'

function SharingButton({
  children,
  onClick,
}: {
  children?: React.ReactNode
  onClick?: () => void
}) {
  return (
    <button
      className='flex-1 font-monaspace font-semibold text-16 text-btnBg py-3 hover:bg-btnBg/60 hover:text-white'
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export function SharingMenu({
  openFullSharingModal,
  updateSharingMode,
}: {
  openFullSharingModal: () => void
  updateSharingMode: (isPrivate: boolean) => void
}) {
  const [isPrivate, setPrivate] = useState(true)

  return (
    <div className='absolute top-14 right-1 w-[480px] bg-background border-1 border-borders-purple z-50'>
      <h1 className='text-xl px-3 py-1'>Set Up Sharing</h1>
      <SharingOption
        isActive={isPrivate}
        title='Private'
        description='Only you and selected users can view and edit this topic'
        onClick={() => setPrivate(true)}
      />
      <SharingOption
        isActive={!isPrivate}
        title='Share with everyone in this project'
        description='All new project members can view and edit this topic'
        onClick={() => setPrivate(false)}
      />
      <div className='flex border-t-1 border-borders-purple divide-x-1 divide-border-color'>
        <SharingButton onClick={openFullSharingModal}>Manage</SharingButton>
        <SharingButton onClick={() => updateSharingMode(isPrivate)}>OK</SharingButton>
      </div>
    </div>
  )
}
