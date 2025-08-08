import React from 'react'
import clsx from 'clsx'

interface IFeatureCard {
  title: string
  backgroundColor: string
  videoSrc: string
  backgroundImage: string
}

interface IFeatureCardProps extends IFeatureCard {
  index: number
}

function FeatureCard({
  title,
  backgroundColor,
  videoSrc,
  index,
  backgroundImage,
}: IFeatureCardProps) {
  const isEven = index % 2 === 0
  return (
    <div
      className={clsx(
        'w-full flex justify-between items-center',
        'h-[600px] md:h-[680px] xl:h-[760px]',
        'bg-paper',
        isEven ? 'lg:flex-row-reverse flex-col-reverse' : 'lg:flex-row flex-col-reverse',
      )}
    >
      {/* Left section */}
      <div
        style={{ backgroundImage }}
        className={clsx(
          'flex items-center justify-center w-full lg:w-1/2 h-full',
          'p-5 bg-gradient-to-b from-[#faf9f6] via-[#faf9f6] to-[#faf9f6]',
          'backdrop-blur-[1px]',
        )}
      >
        <div className='relative w-full h-full flex items-center justify-center'>
          <img
            src='./assets/landing/features-opacity.svg'
            className='absolute z-1 top-0 bottom-0 left-0 right-0 w-full h-full object-cover select-none'
          />
          <div
            className={clsx(
              'relative z-10 text-[#343434] font-monaspace',
              'text-base md:text-lg xl:text-xl',
              'md:max-w-[550px]',
              'leading-[27px] xl:leading-[30px]',
            )}
          >
            {title}
          </div>
        </div>
      </div>

      {/* Right section */}
      <div
        style={{ backgroundColor }}
        className={clsx(
          'w-full lg:w-1/2 h-full flex flex-col justify-center items-center border-black',
          isEven
            ? clsx('lg:border-r', index > 0 && 'border-t', index < 3 && 'border-b')
            : clsx('lg:border-l', index > 0 && 'border-t', index < 3 && 'border-b'),
        )}
      >
        <div className='flex flex-col items-center self-stretch justify-center h-full gap-1 pl-5 pr-10'>
          <video
            className={clsx(
              'rounded border border-[#a3a1a7] object-cover',
              'w-full max-w-[300px] md:max-w-[500px] aspect-12/10 m-5',
              'shadow-[8px_8px_0px_0px_rgba(197,212,210,1.00)]',
              'xl:shadow-[16px_16px_0px_0px_rgba(197,212,210,1.00)]',
            )}
            loop
            autoPlay
            muted
          >
            <source src={videoSrc} type='video/mp4' />
          </video>
        </div>
      </div>
    </div>
  )
}

export default FeatureCard
