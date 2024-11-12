import { Button } from '@mantine/core'
import clsx from 'clsx'
import React from 'react'

export default function ButtonDun({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode
  className?: string
  onClick: () => void
}) {
  return (
    <div className='flex items-center justify-center w-full h-full'>
      <Button
        className={clsx('font-monaspace bg-[#8279BD] hover:bg-[#8279BD] scale-button', className)}
        radius={0}
        variant='outline'
        color='#FFFFFF'
        onClick={onClick}
      >
        {children}
      </Button>
    </div>
  )
}
