import { Button } from '@mantine/core'
import clsx from 'clsx'
import React from 'react'

interface IButtonDunProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
}

export default function ButtonDun({ children, className, onClick, ...props }: IButtonDunProps) {
  return (
    <div className='flex items-center justify-center w-full h-full'>
      <Button
        className={clsx('font-monaspace bg-btnBg hover:bg-btnBg scale-button', className)}
        radius={0}
        variant='outline'
        color='#FFFFFF'
        onClick={onClick}
        {...props}
      >
        {children}
      </Button>
    </div>
  )
}
