import React from 'react'

import Logo from '../../components/ui/Logo'

function Footer() {
  return (
    <div className='w-full h-[137px] bg-[#343434] flex-col justify-start items-start gap-px inline-flex'>
      <div className='self-stretch h-[68px] justify-start items-start gap-px inline-flex'>
        <div className='grow shrink basis-0 self-stretch px-10 py-5 bg-[#c5d4d2] flex-col justify-start items-start gap-1 inline-flex'>
          <div className='w-[81.78px] h-[33px] relative'>
            <Logo />
          </div>
        </div>
        <div className='grow shrink basis-0 self-stretch px-10 py-5 bg-[#c5d4d2] flex-col justify-center items-start gap-1 inline-flex'>
          <div className="text-[#343434] text-lg font-normal font-['National Park '] uppercase leading-snug">
            Dun@gmail.com
          </div>
        </div>
        <div className='grow shrink basis-0 self-stretch px-10 py-5 bg-[#c5d4d2] justify-start items-center gap-3 flex'>
          <button className='overflow-hidden transition-opacity shrink-0 hover:opacity-80'>
            <img
              alt='Github'
              src='/assets/landing/Github-Logo-1--Streamline-Ultimate.svg.svg'
              className='w-full h-full'
            />
          </button>
          <button className='overflow-hidden transition-opacity shrink-0 hover:opacity-80'>
            <img
              alt='Twitter'
              src='/assets/landing/X-Logo-Twitter-Logo--Streamline-Ultimate.svg.svg'
              className='w-full h-full'
            />
          </button>
          <button className='overflow-hidden transition-opacity w- shrink-0 hover:opacity-80'>
            <img alt='LinkedIn' src='/assets/landing/Exclude.svg' className='w-full h-full' />
          </button>
        </div>
      </div>
      <div className='self-stretch h-[68px] px-10 py-2.5 bg-[#c5d4d2] justify-between items-center inline-flex'>
        <div className="text-[#343434] text-lg font-normal font-['National Park '] uppercase leading-snug">
          Terms & conditions
        </div>
        <div className="text-[#343434] text-lg font-normal font-['National Park '] leading-snug">
          ©2024 Perspektives
        </div>
      </div>
    </div>
  )
}

export default Footer
