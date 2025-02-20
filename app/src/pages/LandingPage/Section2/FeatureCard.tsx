import React from 'react'
import clsx from 'clsx'

interface IFeatureCard {
  title: string
  backgroundColor: string
  image: React.ReactNode
  backgroundImage: string
}

interface IFeatureCardProps extends IFeatureCard {
  index: number
}

function FeatureCard({ title, backgroundColor, image, index, backgroundImage }: IFeatureCardProps) {
  const isEven = index % 2 === 0
  return (
    <div
      className={clsx(
        'w-full flex justify-around items-center',
        'h-[440px] md:h-[680px] xl:h-[760px]',
        'bg-paper',
        isEven
          ? 'lg:flex-row-reverse sm:flex-col-reverse flex-col-reverse'
          : 'lg:flex-row sm:flex-col-reverse flex-col-reverse',
      )}
    >
      {/* Left section */}
      <div
        style={{ backgroundImage }}
        className={clsx(
          'flex items-center justify-center w-full h-full',
          'p-5 bg-gradient-to-b from-[#faf9f6] via-[#faf9f6] to-[#faf9f6]',
          'backdrop-blur-[1px]',
        )}
      >
        <div
          className={clsx(
            'text-[#343434] font-monaspace',
            'text-base md:text-lg xl:text-xl',
            'md:w-[512px]',
            'leading-[27px] xl:leading-[30px]',
          )}
        >
          {title}
        </div>
      </div>

      {/* Right section */}
      <div
        style={{ backgroundColor }}
        className={clsx(
          'w-full h-full flex flex-col justify-center items-center border-black',
          isEven
            ? clsx('lg:border-r', index > 0 && 'border-t', index < 3 && 'border-b')
            : clsx('lg:border-l', index > 0 && 'border-t', index < 3 && 'border-b'),
        )}
      >
        <div className='flex flex-col items-center self-stretch justify-center h-full gap-1 pl-5 pr-10'>
          <div
            className={clsx(
              'rounded border border-[#a3a1a7]',
              'w-[333px] h-[261px]',
              'md:w-[512px] md:h-[418px]',
              'xl:w-[795px] xl:h-[622px]',
              'shadow-[8px_8px_0px_0px_rgba(197,212,210,1.00)]',
              'xl:shadow-[16px_16px_0px_0px_rgba(197,212,210,1.00)]',
            )}
          >
            {image}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeatureCard
