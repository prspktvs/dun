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
        'w-full flex justify-around items-center h-[433px] border-black border-t-2 ',
        isEven ? 'flex-row' : 'flex-row-reverse',
      )}
    >
      <div
        style={{ backgroundImage }}
        className='w-full h-full justify-center items-center flex  bg-no-repeat bg-cover bg-center '
      >
        <div className='text-lg flex w-[391px] h-min font-["MonaspaceArgon"]'>{title}</div>
      </div>

      <div
        style={{ backgroundColor }}
        className={clsx(
          'w-full h-full flex justify-center items-center ',
          isEven ? 'border-black border-l-2' : 'border-black border-r-2',
        )}
      >
        {image}
      </div>
    </div>
  )
}

export default FeatureCard
