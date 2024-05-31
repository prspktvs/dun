import React from 'react'
import clsx from 'clsx'
import { RightArrow, DownArrow } from '../../../components/Project/Content/IconsCard'

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
            'lg:h-[81px] flex justify-around items-center border-b-2 border-black sm:flex-col md:flex-row flex-col',
            isEven ? 'bg-paper' : 'bg-[#F5F0EB]',
          )}
        >
          <p className='w-[310px] text-sm font-monaspace sm:ml-4 md:ml-0 ml-4 '>{firstMessage}</p>
          <div className='md:flex sm:hidden hidden'>
            <RightArrow />
          </div>
          <div className='mr-4 md:hidden'>
            <DownArrow />
          </div>

          <p className='w-[310px] text-sm font-monaspace ml-4'>{secondMessage}</p>
        </div>
      </div>
    </>
  )
}

export default BoxInformatinSection3
