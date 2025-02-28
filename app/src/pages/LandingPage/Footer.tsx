import React from 'react'

import Logo from '../../components/ui/Logo'
import { DUN_EMAIL, ROUTES } from '../../constants'

function Footer() {
  const year = new Date().getFullYear()
  return (
    <div className='w-full h-[137px] bg-[#343434] flex-col justify-start items-start gap-px inline-flex'>
      <div className='self-stretch h-[68px] justify-start items-start gap-px inline-flex'>
        <div className='grow shrink basis-0 self-stretch px-10 py-5 bg-[#c5d4d2] flex-col justify-start items-start gap-1 inline-flex'>
          <div className='w-[81.78px] h-[33px] relative'>
            <Logo />
          </div>
        </div>
        <div className='grow shrink basis-0 self-stretch px-10 py-5 bg-[#c5d4d2] flex-col justify-center items-start gap-1 inline-flex'>
          <a
            href={`mailto:${DUN_EMAIL}`}
            target='_blank'
            rel='noreferrer'
            className="text-[#343434] text-lg font-normal font-['National Park '] uppercase leading-snug no-underline hover:opacity-75"
          >
            {DUN_EMAIL.toUpperCase()}
          </a>
        </div>
        <div className='grow shrink basis-0 self-stretch px-10 py-5 bg-[#c5d4d2] justify-start items-center gap-3 flex'>
          <a
            href='https://github.com/prspktvs/dun'
            target='_blank'
            rel='noreferrer'
            className='overflow-hidden transition-opacity shrink-0 hover:opacity-80'
          >
            <img
              alt='Github'
              src='/assets/landing/logo-github.svg'
              className='w-full h-full select-none'
            />
          </a>
          <a
            href='https://x.com/prspktvs'
            target='_blank'
            rel='noreferrer'
            className='overflow-hidden transition-opacity shrink-0 hover:opacity-80'
          >
            <img
              alt='Twitter'
              src='/assets/landing/logo-x.svg'
              className='w-full h-full select-none'
            />
          </a>
          <a
            href='/'
            target='_blank'
            rel='noreferrer'
            className='overflow-hidden transition-opacity shrink-0 hover:opacity-80'
          >
            <img
              alt='Product Hunt'
              src='/assets/landing/logo-p.svg'
              className='w-full h-full select-none'
            />
          </a>
        </div>
      </div>
      <div className='self-stretch h-[68px] px-10 py-2.5 bg-[#c5d4d2] justify-between items-center inline-flex'>
        <a
          href={ROUTES.TERMS_AND_CONDITIONS}
          target='_blank'
          rel='noreferrer'
          className="text-[#343434] text-lg font-normal font-['National Park'] uppercase leading-snug no-underline hover:opacity-80"
        >
          Terms & conditions
        </a>
        <a
          href='https://p11.co'
          target='_blank'
          rel='noreferrer'
          className="text-[#343434] text-lg font-normal font-['National Park'] leading-snug  no-underline hover:opacity-80"
        >
          ©{year} Perspektives
        </a>
      </div>
    </div>
  )
}

export default Footer
