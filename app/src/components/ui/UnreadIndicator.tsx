import clsx from 'clsx'
import React from 'react'

export default function UnreadIndicator({
  count,
  size = 'md',
  className,
}: {
  count: number
  size?: 'sm' | 'md'
  className?: string
}) {
  if (count === 0) return null
  return (
    <div
      className={clsx(
        'bg-salad border-black flex items-center justify-center',
        size === 'sm' ? 'w-5 h-4 border-1' : 'w-7 h-7 border-[1.5px]',
        className,
      )}
    >
      <span className={clsx(size === 'sm' ? 'text-xs font-medium' : 'text-md font-medium')}>
        +{count}
      </span>
    </div>
  )
}
