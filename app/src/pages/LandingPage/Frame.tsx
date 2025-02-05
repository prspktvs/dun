import React from 'react'

export const Frame = (): JSX.Element => {
  return (
    <div className='flex flex-col items-center gap-[30px] mt-[60px]'>
      <div className='inline-flex flex-col items-center gap-[30px] relative flex-[0_0_auto]'>
        <p className="relative w-fit m-0 font-['National Park '] font-normal  text-[80px] text-center tracking-[0] leading-[88.0px]">
          The simplest app <br />
          to handle all your projects
        </p>

        <p className='relative w-fit font-monaspace font-normal text-black text-xl tracking-[0] leading-[27.0px] whitespace-nowrap m-0'>
          Designed for small teams doing big work
        </p>
      </div>

      <button className='w-[300px] h-[58px] px-6 py-3 bg-white border border-[#343434] justify-center items-center gap-3 inline-flex hover:bg-gray-50 transition-colors'>
        <img src='/assets/landing/state=default, device=web.svg' alt='Button Lading' />
      </button>

      <img
        className='relative w-[198px] h-[35.69px]'
        alt='Group'
        src='/assets/landing/Group 22.svg'
      />

      <div className='flex flex-col items-start gap-px relative self-stretch w-full flex-[0_0_auto]'>
        <div className='relative w-full min-h-[198px]'>
          <img
            className='object-cover w-full h-auto'
            alt='Frame'
            src='/assets/landing/Frame 1025.svg'
          />
        </div>

        <div className='flex items-start gap-px relative self-stretch w-full flex-[0_0_auto] bg-variable-collection-landing-logo-text-buttons-strokes border-t border-black'>
          <div className='flex flex-col items-center self-stretch flex-1 gap-1 px-16 py-0 border-r border-black grow bg-variable-collection-landing-bg1'>
            <div className='flex flex-col items-center gap-5 pt-10 pb-[30px] px-0 relative flex-1 grow'>
              <img className='w-[247px] h-[196px]' alt='Cat' src='/assets/landing/Cat-50tabs.svg' />

              <div className='flex flex-col w-[319px] items-start gap-2.5 relative flex-[0_0_auto]'>
                <div className='relative w-[202px] m-0 font-monaspace font-semibold text-variable-collection-landing-logo-text-buttons-strokes text-xl tracking-[0] leading-[30px]'>
                  Before Dun
                </div>

                <ul className='relative w-fit m-0 list-disc font-monaspace font-normal text-variable-collection-landing-logo-text-buttons-strokes text-base tracking-[0] leading-[27.2px]'>
                  <li>Losing focus with 50+ tabs</li>
                  <li>Overspending on subscriptions</li>
                  <li>Notification overload</li>
                  <li>Endless copy-pasting</li>
                </ul>
              </div>
            </div>
          </div>

          <div className='relative flex flex-col items-center justify-center flex-1 gap-1 px-16 py-0 grow bg-variable-collection-landing-bg1'>
            <div className='flex flex-col items-center justify-center gap-5 pt-10 pb-[60px] px-0 relative flex-1 grow'>
              <img
                className='w-[228px] h-[196px]'
                alt='Cat dun'
                src='/assets/landing/Cat-dun.svg'
              />

              <div className='flex flex-col w-[400px] items-center justify-center gap-[30px] relative flex-[0_0_auto]'>
                <div className='flex flex-col items-start gap-2.5 relative flex-[0_0_auto]'>
                  <div className='relative w-[202px] m-0 font-monaspace font-semibold text-variable-collection-landing-logo-text-buttons-strokes text-xl tracking-[0] leading-[30px]'>
                    With Dun
                  </div>

                  <ul className='relative w-fit m-0 list-disc  font-monaspace font-normal text-variable-collection-landing-logo-text-buttons-strokes text-base tracking-[0] leading-[27.2px]'>
                    <li>Everything in one place</li>
                    <li>All info organized by topics</li>
                    <li>No switching between multiple apps</li>
                    <li>No more info overload or stress</li>
                  </ul>
                </div>

                <button className='w-[300px] h-[58px] px-6 py-3 bg-white border border-[#343434] justify-center items-center gap-3 inline-flex hover:bg-gray-50 transition-colors'>
                  <img src='/assets/landing/state=default, device=web.svg' alt='Button Lading' />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
