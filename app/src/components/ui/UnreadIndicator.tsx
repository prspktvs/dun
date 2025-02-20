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
        size === 'sm' ? 'w-5 h-4 border-1' : ' h-[19px] px-[3px]  border border-[#46434e]  gap-1 inline-flex overflow-hidden',
        className,
      )}
    >
      <span className={clsx(size === 'sm' ? 'text-xs font-medium' : 'w-[13px] h-[11px] text-[#46434e] text-[10px] font-normal')}>
        +{count}
      </span>
    </div>
  )
}
