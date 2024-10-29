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
        'block h-9 w-full text-left font-monaspace text-14 pl-1',
        isActive ? 'bg-[#EDEBF3] font-semibold' : 'bg-white font-normal',
        'hover:bg-[#EDEBF3] hover:font-semibold hover:cursor-pointer',
      )}
    >
      {children}
    </button>
  )
}
