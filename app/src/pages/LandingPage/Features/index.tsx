import React, { useRef, useState } from 'react'

import FeatureCard from './FeatureCard'

interface IFeatureCard {
  title: string
  backgroundColor: string
  videoSrc: string
  backgroundImage: string
}

const FEATURES: IFeatureCard[] = [
  {
    title:
      'Everything related to a certain topic is always located in the same place - all chats, tasks, notes, docs, files and links',
    backgroundColor: '#cbb9cf',
    videoSrc:
      'https://firebasestorage.googleapis.com/v0/b/dun-imba.appspot.com/o/landing%2Ffeatures-video-1.mp4?alt=media',
    backgroundImage: `url('./assets/landing/features-rects.svg')`,
  },
  {
    title:
      'Organize discussions around specific content to avoid getting lost in endless spammy chats',
    backgroundColor: '#f5cbbc',
    videoSrc:
      'https://firebasestorage.googleapis.com/v0/b/dun-imba.appspot.com/o/landing%2Ffeatures-video-2.mp4?alt=media',
    backgroundImage: `url('./assets/landing/features-lines.svg')`,
  },
  {
    title: 'Sharing option is always available, as well as making it private again',
    backgroundColor: '#fff5d2',
    videoSrc:
      'https://firebasestorage.googleapis.com/v0/b/dun-imba.appspot.com/o/landing%2Ffeatures-video-3.mp4?alt=media',
    backgroundImage: `url('./assets/landing/features-plaid.svg')`,
  },
  {
    title:
      'Tap a task in your left bar to quickly access its full context and details. Stop worrying about',
    backgroundColor: '#afb5d4',
    videoSrc:
      'https://firebasestorage.googleapis.com/v0/b/dun-imba.appspot.com/o/landing%2Ffeatures-video-4.mp4?alt=media',
    backgroundImage: `url('./assets/landing/features-lines-back.svg')`,
  },
]

function Features() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const promoVideoRef = useRef<HTMLVideoElement>(null)

  const handleStartVideo = () => {
    if (!promoVideoRef.current) return

    promoVideoRef.current.play()
    promoVideoRef.current.controls = true
    setIsVideoPlaying(true)
  }

  return (
    <>
      <div className='w-full h-[98px] p-5 bg-[#faf9f6] justify-start items-center gap-[195px] inline-flex'>
        <div className='text-[#343434] text-4xl md:text-[58px] font-normal font-national leading-[57.60px]'>
          Features
        </div>
      </div>

      <div className='flex items-start justify-around overflow-hidden border-t border-b border-black'>
        <div className='w-full md:w-1/2 h-full p-8 bg-[#faf9f6] flex-col justify-center items-start inline-flex overflow-hidden '>
          <div className='max-w-[700px] text-[#343434] text-lg md:text-xl font-normal font-monaspace leading-normal '>
            You can organize your topics into different workspaces by projects or any way you like.
          </div>
        </div>
        <div className='hidden md:flex w-1/2 h-full p-8 bg-[#faf9f6] flex-col justify-center items-start overflow-hidden md:border-l border-black'>
          <div className='max-w-[700px] text-[#343434] text-lg md:text-xl font-normal font-monaspace leading-normal '>
            Each Topic is a note for sharing, discussion, brainstorming. Customize Topic's
            accessibility to fit your purpose.
          </div>
        </div>
      </div>

      <div className='relative w-full overflow-hidden border-b border-black'>
        <div className='relative w-full h-full aspect-video'>
          <video
            ref={promoVideoRef}
            className='object-cover w-full h-full'
            preload='none'
            poster='/assets/landing/promo.jpg'
          >
            <source
              src='https://firebasestorage.googleapis.com/v0/b/dun-imba.appspot.com/o/landing%2Fpromo.mp4?alt=media'
              type='video/mp4'
            />
          </video>

          {!isVideoPlaying && (
            <div
              className='absolute top-0 left-0 w-full h-full bg-opacity-10 flex flex-col gap-3 items-center justify-center cursor-pointer'
              onClick={handleStartVideo}
            >
              <div className='bg-black/90 h-32 w-32 md:h-40 md:w-40 rounded-2xl flex items-center justify-center'>
                <i className='ri-play-fill text-white text-7xl md:text-[100px]' />
              </div>
              <div className='bg-black/90 h-12 w-32 md:h-16 md:w-40 rounded-2xl flex items-center justify-center text-white text-base md:text-lg font-monaspace font-semibold'>
                Watch demo
              </div>
            </div>
          )}
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

export default Features
