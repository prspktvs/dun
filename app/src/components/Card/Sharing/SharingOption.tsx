import clsx from 'clsx'

import { SharingRadioIcon } from '../../icons'

interface SharingOptionProps {
  isActive: boolean
  onClick?: () => void
  title: string
  description: string
}

export function SharingOption({ isActive, onClick, title, description }: SharingOptionProps) {
  return (
    <div
      className={clsx(
        'border-border-color border-t-1 p-5 cursor-pointer',
        isActive && 'bg-[#EDEBF3]',
      )}
      onClick={isActive ? undefined : onClick}
    >
      <div className='flex justify-between items-center'>
        <span className='text-14 font-monaspace font-semibold'>{title}</span>
        <SharingRadioIcon checked={isActive} />
      </div>
      <span className='text-12 font-monaspace'>{description}</span>
    </div>
  )
}
