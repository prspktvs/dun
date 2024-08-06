import clsx from 'clsx'
import React from 'react'

export default function LeftPanelButton({
  children,
  isActive,
  onClick,
}: {
  children: React.ReactNode
  isActive?: boolean
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'block h-9 w-full text-left font-monaspace text-14 hover:cursor-pointer hover:bg-[#EDEBF3]',
        isActive ? 'bg-[#EDEBF3]' : 'bg-white',
      )}
    >
      {children}
    </button>
  )
}
