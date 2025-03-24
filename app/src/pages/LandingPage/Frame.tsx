import { useRef, useState } from 'react'

import { GoogleLogo } from '../../components/icons'
import { AuthButton } from '../../components/ui/buttons/AuthButton'
import { useAuth } from '../../context/AuthContext'

export const Frame = (): JSX.Element => {
  const { signInWithGoogle } = useAuth()
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  const promoVideoRef = useRef<HTMLVideoElement>(null)
  const handleStartVideo = () => {
    if (!promoVideoRef.current) return

    promoVideoRef.current.play()
    promoVideoRef.current.controls = true
    setIsVideoPlaying(true)
  }
  return (
    <div className='flex flex-col items-center gap-[30px] mt-24 md:mt-32'>
      <div className='inline-flex flex-col items-center gap-5 md:gap-[30px] relative flex-[0_0_auto]'>
        <p className="relative w-fit m-0 font-['National Park '] font-normal text-[44px] md:text-[80px] text-center tracking-[0] leading-[48.40px] md:leading-[88.0px]">
          The simplest app <br />
          to handle all your projects
        </p>

        <p className='relative w-fit font-monaspace font-normal text-black text-lg lg:text-xl tracking-[0] leading-[27.0px] whitespace-nowrap m-0'>
          Designed for small teams doing big work
        </p>
      </div>

      <div className='w-[300px] flex flex-col gap-4 items-center'>
        <AuthButton
          className='bg-white border-black text-black'
          onClick={signInWithGoogle}
          icon={<GoogleLogo className='w-6 h-6' />}
        >
          Sign up with Google
        </AuthButton>

        <a
          href='https://www.producthunt.com/posts/dun?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-dun'
          target='_blank'
        >
          <img
            className='w-[290px]'
            src='https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=938482&theme=neutral&t=1742815798349'
            alt='Dun - The&#0032;simplest&#0032;app&#0032;for&#0032;small&#0032;team&#0032;collaboration | Product Hunt'
          />
        </a>
      </div>

      <img
        className='relative w-[198px] h-[35.69px] select-none'
        alt='Group'
        src='/assets/landing/more-about.svg'
      />

      <div className='flex flex-col items-start gap-px relative self-stretch w-full flex-[0_0_auto]'>
        <div className='relative w-full h-auto aspect-video'>
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
              <div className='bg-black/90 h-40 w-40 rounded-2xl flex items-center justify-center'>
                <i className='ri-play-fill text-white text-[100px]' />
              </div>
              <div className='bg-black/90 h-16 w-40 rounded-2xl flex items-center justify-center text-white text-lg font-monaspace font-semibold'>
                Watch demo
              </div>
            </div>
          )}
        </div>

        <div className='flex flex-col md:flex-row items-stretch gap-px relative self-stretch w-full flex-[0_0_auto] bg-variable-collection-landing-logo-text-buttons-strokes border-t border-black'>
          <div className='w-full md:w-auto md:flex-1 px-16 md:px-5 lg:px-16 border-b md:border-b-0 md:border-r border-black bg-[#faf9f6] flex-col justify-start items-center gap-1 inline-flex overflow-hidden'>
            <div className='flex flex-col items-center justify-start gap-5 pt-10 sm:pb-10'>
              <img
                className='w-[247px] h-[196px]  select-none'
                alt='Problem 50 tabs'
                src='./assets/landing/comparison-left.svg'
              />

              <div className='flex flex-col items-start gap-2.5 relative flex-[0_0_auto]'>
                <div className='relative w-[202px] m-0 font-monaspace font-semibold text-variable-collection-landing-logo-text-buttons-strokes text-xl tracking-[0] leading-[30px]'>
                  Before Dun
                </div>

                <ul className='relative w-fit m-0 list-disc font-monaspace font-normal text-variable-collection-landing-logo-text-buttons-strokes text-sm lg:text-lg tracking-[0] leading-[27.2px]'>
                  <li>Losing focus with 50+ tabs</li>
                  <li>Overspending on subscriptions</li>
                  <li>Notification overload</li>
                  <li>Endless copy-pasting</li>
                </ul>
              </div>
            </div>
          </div>

          <div className='w-full md:w-auto md:flex-1 px-16 md:px-5 lg:px-16 bg-[#faf9f6] flex-col justify-start items-center gap-1 inline-flex overflow-hidden'>
            <div className='flex flex-col items-center justify-start gap-5 pt-10 pb-10'>
              <img
                className='w-[228px] h-[196px] select-none'
                alt='Solved problem'
                src='./assets/landing/comparison-right.svg'
              />

              <div className='flex flex-col items-center justify-center gap-[30px] relative flex-[0_0_auto]'>
                <div className='flex flex-col items-start gap-2.5 relative flex-[0_0_auto]'>
                  <div className='relative w-[202px] m-0 font-monaspace font-semibold text-variable-collection-landing-logo-text-buttons-strokes text-xl tracking-[0] leading-[30px]'>
                    With Dun
                  </div>

                  <ul className='relative w-fit m-0 list-disc font-monaspace font-normal text-variable-collection-landing-logo-text-buttons-strokes text-sm lg:text-lg tracking-[0] leading-[27.2px]'>
                    <li>Everything in one place</li>
                    <li>All info organized by topics</li>
                    <li>No switching between multiple apps</li>
                    <li>No more info overload or stress</li>
                  </ul>
                </div>

                <div className='w-[300px]'>
                  <AuthButton
                    className='bg-white border-black text-black'
                    onClick={signInWithGoogle}
                    icon={<GoogleLogo className='w-6 h-6' />}
                  >
                    Sign up with Google
                  </AuthButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
