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
        'w-full flex justify-around items-center lg:h-[433px] sm:h-[800px] h-[800px] bg-paper',
        isEven
          ? 'lg:flex-row-reverse sm:flex-col-reverse flex-col-reverse'
          : 'lg:flex-row sm:flex-col-reverse flex-col-reverse',
      )}
    >
      <div
        style={{ backgroundImage }}
        className='flex items-center justify-center w-full h-full bg-center bg-no-repeat bg-cover'
      >
        <div className='text-base flex sm:w-[391px] ml-6 h-min font-monaspace text-center sm:text-left'>
          {title}
        </div>
      </div>

      <div
        style={{ backgroundColor }}
        className={clsx(
          'w-full h-full flex flex-col justify-center items-center border-black',
          isEven
            ? clsx('lg:border-r', index > 0 && 'border-t', index < 3 && 'border-b')
            : clsx('lg:border-l', index > 0 && 'border-t', index < 3 && 'border-b'),
        )}
      >
        {image}
      </div>
    </div>
  )
}

export default FeatureCard
