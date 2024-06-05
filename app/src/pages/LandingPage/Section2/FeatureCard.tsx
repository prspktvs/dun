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
        'w-full flex justify-around items-center lg:h-[433px] sm:h-[800px] h-[800px] border-black border-t-2 bg-paper',
        isEven
          ? 'lg:flex-row sm:flex-col flex-col'
          : 'lg:flex-row-reverse sm:flex-col-reverse flex-col-reverse',
      )}
    >
      <div
        style={{ backgroundImage }}
        className='w-full h-full justify-center items-center flex  bg-no-repeat bg-cover bg-center '
      >
        <div className='text-lg flex sm:w-[391px] ml-6 h-min font-monaspace text-center sm:text-left'>{title}</div>
      </div>

      <div
        style={{ backgroundColor }}
        className={clsx(
          'w-full  h-full flex justify-center items-center ',
          isEven
            ? 'border-black lg:border-l-2 lg:border-t-0 sm:border-t-2 border-t-2'
            : 'border-black lg:border-r-2 lg:border-b-0 sm:border-b-2 border-b-2',
        )}
      >
        {image}
      </div>
    </div>
  )
}

export default FeatureCard
