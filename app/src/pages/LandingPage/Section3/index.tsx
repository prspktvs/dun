import React from 'react'
import BoxInformatinSection3 from './BoxInformatinSection3'
import DualSectionBox from '../DualSectionBox/DualSectionBox'
import backgroundSection3 from '/assets/bgSection3.svg'
import clsx from 'clsx'
import { DownArrow } from '../../../components/Project/Content/IconsCard'

interface IFeatureCard {
  firstMessage: string
  secondMessage: string
}

const FEATURES: IFeatureCard[] = [
  {
    firstMessage: 'Hey buddy, ever find yourself lost in the chaos of 50 open tabs?',
    secondMessage: 'Let DUN set you free from the focus-switching tab dance',
  },
  {
    firstMessage: 'Exhausted from monthly bills?',
    secondMessage: "DUN's got an all-in-one solution at a great price!",
  },
  {
    firstMessage: 'Missing key info?',
    secondMessage: "With DUN, you won't miss the important ones!",
  },
  {
    firstMessage: 'Drowning in notifications from various sources?',
    secondMessage: "With DUN, you won't miss the important ones!",
  },
  {
    firstMessage: 'Tired of a broken phone and copy-paste headaches?',
    secondMessage: 'Just send one link with all the goods!',
  },
]

function Section3() {
  return (
    <>
      <div
        style={{ backgroundImage: `url(${backgroundSection3})` }}
        className={clsx('w-full flex  flex-col bg-no-repeat bg-cover bg-paper border-t-2')}
      >
        <div className='flex flex-col justify-around items-center'>
          <div className='flex gap-x-72 sm:flex-col md:flex-row md:mt-10 flex-col'>
            <img src='./leftMouse.svg' />
            <div className='flex justify-center content-center my-4 md:hidden'>
              <DownArrow />
            </div>
            <img src='./rightMouse.svg' className='sm:mb-8 md:mb-0' />
          </div>

          <div className='w-full border-t-2  md:border-l-2 md:border-r-2 border-black flex md:mb-9  flex-col sm:w-full md:w-[720px] lg:w-[900px]'>
            {FEATURES.map((item, index) => (
              <BoxInformatinSection3 key={'feature-' + index} index={index} {...item} />
            ))}
          </div>
        </div>
        <DualSectionBox
          title={'Hey pal, consider it solved!'}
          desc={
            'During our research, the team pinpointed a list of challenges tied to existing services. We made these hurdles the foundation of our design principles and crafted a revamped product.'
          }
          btnTitle={'check it!'}
        />
      </div>
    </>
  )
}

export default Section3
