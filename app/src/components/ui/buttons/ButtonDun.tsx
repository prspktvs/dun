import { Button } from '@mantine/core'
import clsx from 'clsx'
import React from 'react'

interface IButtonDunProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: 'filled' | 'outline' | 'subtle'
  className?: string
}

export default function ButtonDun({
  children,
  className,
  onClick,
  variant = 'filled',
  ...props
}: IButtonDunProps) {
  return (
    <div className='flex items-center justify-center w-full h-full'>
      <Button
        classNames={{
          root: clsx('font-monaspace scale-button'),
        }}
        w='100%'
        h='100%'
        color='#8279BD'
        radius={0}
        variant={variant}
        onClick={onClick}
        {...props}
      >
        {children}
      </Button>
    </div>
  )
}
