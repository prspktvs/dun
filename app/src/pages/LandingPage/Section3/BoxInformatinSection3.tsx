import React from 'react'
import clsx from 'clsx'

interface IFeatureCard {
  firstMessage: string
  secondMessage: string
}

interface IFeatureCardProps extends IFeatureCard {
  index: number
}

function BoxInformatinSection3({ firstMessage, secondMessage, index }: IFeatureCardProps) {
  const isEven = index % 2 === 0
  return (
    <>
      <div>
        <div
          className={clsx(
            'w-[781px] h-[81px] flex justify-around items-center border-b-2 border-black',
            isEven ? 'bg-paper' : 'bg-[#F5F0EB]',
          )}
        >
          <p className='w-[310px] text-sm font-monaspace'>{firstMessage}</p>
          <svg
            width='41'
            height='7'
            viewBox='0 0 41 7'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              id='Arrow 4'
              d='M40.5 3.5L35.5 6.38675V0.613249L40.5 3.5ZM0.5 3L36 3V4L0.5 4L0.5 3Z'
              fill='#25222C'
            />
          </svg>
          <p className='w-[310px] text-sm font-monaspace'>{secondMessage}</p>
        </div>
      </div>
    </>
  )
}

export default BoxInformatinSection3
