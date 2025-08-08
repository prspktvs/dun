import { useRef, useState, useEffect } from 'react'

import { GoogleLogo } from '../../components/icons'
import { AuthButton } from '../../components/ui/buttons/AuthButton'
import { useAuth } from '../../context/AuthContext'

export const Frame = (): JSX.Element => {
  const { signInWithGoogle } = useAuth()
  const [activeImageIndex, setActiveImageIndex] = useState(1)
  const carouselRef = useRef<HTMLDivElement>(null)

  const images = [
    { src: '/assets/landing/kanban.jpg', alt: 'Kanban board' },
    { src: '/assets/landing/topics.jpg', alt: 'Topics view' },
    { src: '/assets/landing/editor.jpg', alt: 'Editor view' },
  ]

  useEffect(() => {
    if (carouselRef.current) {
      const containerWidth = carouselRef.current.scrollWidth
      const viewportWidth = carouselRef.current.clientWidth
      const scrollPosition = (containerWidth - viewportWidth) / 2
      carouselRef.current.scrollLeft = scrollPosition
    }
  }, [])

  const handleDotClick = (index: number) => {
    setActiveImageIndex(index)
    if (carouselRef.current) {
      const child = carouselRef.current.children[index] as HTMLElement
      child?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    }
  }

  const handleImageClick = (index: number) => {
    handleDotClick(index)
  }

  return (
    <div className='flex flex-col items-center gap-[30px] mt-24 md:mt-32'>
      <div className='inline-flex flex-col items-center gap-5 md:gap-[30px] relative flex-[0_0_auto]'>
        <p className='relative w-fit m-0 font-national font-normal text-[44px] md:text-[80px] text-center tracking-[0] leading-[48.40px] md:leading-[88.0px]'>
          The simplest app <br />
          to handle all your projects
        </p>

        <p className='relative w-fit font-national font-normal text-black text-lg lg:text-xl tracking-[0] leading-[27.0px] whitespace-nowrap m-0'>
          Designed for small teams doing big work
        </p>
      </div>

      <div className='w-[300px] flex flex-col gap-4 items-center'>
        <AuthButton
          className='bg-white border-black text-black font-rubik'
          onClick={signInWithGoogle}
          icon={<GoogleLogo />}
        >
          Sign up with Google
        </AuthButton>
      </div>

      <img
        className='relative w-[198px] h-[35.69px] select-none'
        alt='Group'
        src='/assets/landing/more-about.svg'
      />

      <div className='flex flex-col items-center gap-8 w-full'>
        <div className='relative w-full overflow-hidden'>
          <div
            ref={carouselRef}
            className='image-carousel flex snap-x snap-mandatory gap-10 overflow-x-auto scrollbar-hide'
            style={{ paddingLeft: '10vw', paddingRight: '10vw' }}
          >
            {images.map((image, index) => (
              <div
                key={index}
                className='snap-center flex-shrink-0 cursor-pointer transition-all duration-300 flex flex-col items-center gap-4'
                style={{ width: '80vw', maxWidth: '1200px' }}
                onClick={() => handleImageClick(index)}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className='shadow-2xl w-full h-auto object-cover'
                />
              </div>
            ))}
          </div>
        </div>
        <div className='flex gap-3 mt-2'>
          {images.map((_, idx) => (
            <button
              key={idx}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                idx === activeImageIndex ? 'bg-purple-600' : 'bg-gray-300'
              }`}
              onClick={() => handleDotClick(idx)}
            />
          ))}
        </div>
      </div>

      <div className='flex flex-col md:flex-row items-stretch gap-px relative self-stretch w-full flex-[0_0_auto] bg-variable-collection-landing-logo-text-buttons-strokes border-t border-black'>
        <div className='w-full md:w-auto md:flex-1 px-16 md:px-5 lg:px-16 border-b md:border-b-0 md:border-r border-black bg-[#faf9f6] flex-col justify-between items-center gap-1 inline-flex overflow-hidden'>
          <div className='flex flex-col items-center justify-start gap-5 pt-10'>
            <img
              className='w-[247px] h-[196px] select-none'
              alt='Problem 50 tabs'
              src='./assets/landing/comparison-left.svg'
            />

            <div className='flex flex-col items-start gap-2.5 relative flex-[0_0_auto]'>
              <div className='relative w-[202px] m-0 font-monaspace font-semibold text-variable-collection-landing-logo-text-buttons-strokes text-xl tracking-[0] leading-[30px]'>
                Before Dun
              </div>
              <ul className='relative w-fit m-0 font-monaspace font-normal text-variable-collection-landing-logo-text-buttons-strokes text-sm lg:text-lg tracking-[0] leading-[27.2px]'>
                <li>← Slack → Trello → Notion → Gmail → </li>
                <li>→ Gmail → Notion ← Trello ← Slack ←</li>
              </ul>

              <ul className='relative w-fit m-0 font-monaspace font-normal text-variable-collection-landing-logo-text-buttons-strokes text-sm lg:text-lg tracking-[0] leading-[27.2px]'>
                <li>❌ Constantly switching apps, losing focus</li>
                <li>❌ Paying for too many subscriptions</li>
                <li>❌ Too busy organizing to get work done</li>
                <li>❌ Endless copy-pasting</li>
              </ul>
            </div>
          </div>

          <div className='h-[100px] pb-10'></div>
        </div>

        <div className='w-full md:w-auto md:flex-1 px-16 md:px-5 lg:px-16 bg-[#faf9f6] flex-col justify-between items-center gap-1 inline-flex overflow-hidden'>
          <div className='flex flex-col items-center justify-start gap-5 pt-10'>
            <img
              className='w-[228px] h-[196px] select-none'
              alt='Solved problem'
              src='./assets/landing/comparison-right.svg'
            />

            <div className='flex flex-col items-start gap-2.5 relative flex-[0_0_auto]'>
              <div className='relative w-[202px] m-0 font-monaspace font-semibold text-variable-collection-landing-logo-text-buttons-strokes text-xl tracking-[0] leading-[30px]'>
                With Dun
              </div>

              <ul className='relative w-fit m-0 font-monaspace font-normal text-variable-collection-landing-logo-text-buttons-strokes text-sm lg:text-lg tracking-[0] leading-[27.2px]'>
                <li>Manage projects, tasks, and communication</li>
                <li>with your team and clients in one place</li>
              </ul>

              <ul className='relative w-fit m-0 font-monaspace font-normal text-variable-collection-landing-logo-text-buttons-strokes text-sm lg:text-lg tracking-[0] leading-[27.2px]'>
                <li>✅ All your work is structured by topics</li>
                <li>✅ Everything stays in context — always</li>
                <li>✅ Every task has a home, no floating to-dos</li>
                <li>✅ Topics organize, you get things done</li>
              </ul>
            </div>
          </div>

          <div className='w-[300px] pb-10'>
            <AuthButton
              className='bg-white border-black text-black'
              onClick={signInWithGoogle}
              icon={<GoogleLogo />}
            >
              Sign up with Google
            </AuthButton>
          </div>
        </div>
      </div>
    </div>
  )
}
