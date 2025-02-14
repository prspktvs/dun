import React from 'react'
import Rectangles from '/assets/landing/rectangles.svg'
import Squares from '/assets/landing/squares.svg'
import Plaid from '/assets/landing/plaid.svg'
import Lines from '/assets/landing/lines.svg'
import FeatureCard from './FeatureCard'

interface IFeatureCard {
  title: string
  backgroundColor: string
  image: React.ReactNode
  backgroundImage: string
}

const FEATURES: IFeatureCard[] = [
  {
    title: '',
    backgroundColor: '#cbb9cf',
    image: (
      <img
        className='w-10/12 md:w-[499px]'
        src='./assets/landing/image 177.svg'
        alt='description-image'
      />
    ),
    backgroundImage: `url('./assets/landing/feature description2.svg')`,
  },
  {
    title:
      'Organize discussions around specific content to avoid getting lost in endless spammy chats',
    backgroundColor: '#f5cbbc',
    image: (
      <img
        className='w-10/12 md:w-[499px]'
        src='./assets/landing/image 178.svg'
        alt='description-image'
      />
    ),
    backgroundImage: `url('./assets/landing/Group 15.svg')`,
  },
  {
    title: 'Sharing option is always available, as well as making it private again',
    backgroundColor: '#fff5d2',
    image: (
      <img
        className='w-10/12 md:w-[499px]'
        src='./assets/landing/image 179).svg'
        alt='description-image'
      />
    ),
    backgroundImage: `url(${Plaid})`,
  },
  {
    title:
      'Tap a task in your left bar to quickly access its full context and details. Stop worrying about',
    backgroundColor: '#afb5d4',
    image: (
      <img
        className='w-10/12 md:w-[499px]'
        src='./assets/landing/Frame 1056.svg'
        alt='description-image'
      />
    ),
    backgroundImage: `url('./assets/landing/Group 19.svg')`,
  },
]

function Section2() {
  return (
    <>
      <div className='w-full h-[98px] p-5 bg-[#faf9f6] justify-start items-center gap-[195px] inline-flex'>
        <div className="text-[#343434] text-[58px] font-normal font-['National Park '] leading-[57.60px]">
          Features
        </div>
      </div>

      <div className='flex items-start justify-around overflow-hidden border-t border-b border-black'>
        <div className='w-full md:w-1/2 h-full p-5 bg-[#faf9f6] flex-col justify-start items-start inline-flex overflow-hidden md:border-r border-black'>
          <div className='self-stretch text-[#343434] text-xl font-normal font-monaspace leading-normal'>
            Each Topic is a note for sharing, discussion, brainstorming. Customize Topic's
            accessability to fit your purpose.
          </div>
        </div>
        <div className='hidden md:flex w-1/2 h-full p-5 bg-[#faf9f6] flex-col justify-start items-start overflow-hidden'>
          <div className='self-stretch text-[#343434] text-xl font-normal font-monaspace leading-normal'>
            You can organize your topics into different workspaces by projects or any way you like.
          </div>
        </div>
      </div>

      <div className='relative w-full bg-[#c5d4d2] p-10 overflow-hidden border-b  border-black'>        <div className='relative w-full h-full' style={{ paddingBottom: '56.25%' }}>
          <img
            className='absolute top-0 left-0 object-cover w-full h-full'
            alt='Frame'
            src='/assets/landing/Frame 1051 1.png'
          />
        </div>
      </div>

      <div>
        <div className='w-full'>
          {FEATURES.map((item, index) => (
            <FeatureCard key={'feature-' + index} index={index} {...item} />
          ))}
        </div>
      </div>
    </>
  )
}

export default Section2
