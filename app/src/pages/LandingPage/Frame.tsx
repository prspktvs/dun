import React from 'react'

import { GoogleLogo } from '../../components/icons'
import { AuthButton } from '../../components/ui/buttons/AuthButton'
import { useAuth } from '../../context/AuthContext'

export const Frame = (): JSX.Element => {
  const { signInWithGoogle } = useAuth()
  return (
    <div className='flex flex-col items-center gap-[30px] mt-10 md:mt-[60px]'>
      <div className='inline-flex flex-col items-center gap-5 md:gap-[30px] relative flex-[0_0_auto]'>
        <p className="relative w-fit m-0 font-['National Park '] font-normal text-[44px] md:text-[80px] text-center tracking-[0] leading-[48.40px] md:leading-[88.0px]">
          The simplest app <br />
          to handle all your projects
        </p>

        <p className='relative w-fit font-monaspace font-normal text-black text-lg lg:text-xl tracking-[0] leading-[27.0px] whitespace-nowrap m-0'>
          Designed for small teams doing big work
        </p>
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

      <img
        className='relative w-[198px] h-[35.69px] select-none'
        alt='Group'
        src='/assets/landing/more-about.svg'
      />

      <div className='flex flex-col items-start gap-px relative self-stretch w-full flex-[0_0_auto]'>
        <div className='relative w-full min-h-[198px]'>
          <img
            className='object-cover w-full h-auto select-none'
            alt='Dun watch demo video'
            src='/assets/landing/hero.jpg'
          />
        </div>

        <div className='flex flex-col md:flex-row items-stretch gap-px relative self-stretch w-full flex-[0_0_auto] bg-variable-collection-landing-logo-text-buttons-strokes border-t border-black'>
          <div className='w-full md:w-auto md:flex-1 px-16 md:px-5 lg:px-16 border-b md:border-b-0 md:border-r border-black bg-[#faf9f6] flex-col justify-start items-center gap-1 inline-flex overflow-hidden'>
            <div className='flex flex-col items-center justify-start gap-5 pt-10 sm:pb-10'>
              <img
                className='w-[247px] h-[196px]  select-none'
                alt='Problem 50 tabs cat'
                src='/assets/landing/cat-50tabs.svg'
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
                alt='Happy cat without problems'
                src='/assets/landing/cat-dun.svg'
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
