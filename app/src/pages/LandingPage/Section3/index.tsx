import React from 'react'
import clsx from 'clsx'

const TextContent = () => (
  <div className='text-[#555555] text-lg font-normal font-monaspace leading-snug'>
    <div className='text-[#343434] text-xl font-semibold leading-[30px] pb-[15px] font-monaspace'>
      Dun is a good choice for:
    </div>
    <div>
      <ul className='list-disc list-inside'>
        <li>Software & design agencies</li>
        <li>Freelancers & independent creators</li>
        <li>Content creators</li>
        <li>Social media managers & Digital marketing</li>
      </ul>
      <br />
      <ul className='list-disc list-inside'>
        <li>Architects and interior designers</li>
        <li>Fashion designers and apparel brands</li>
        <li>Tutors & Students</li>
        <li>Nonprofits and volunteer organizations</li>
      </ul>
      <br />
      <ul className='list-disc list-inside'>
        <li>Startup teams</li>
        <li>E-commerce businesses</li>
        <li>Legal and financial advisory teams</li>
        <li>Consultants & Specialists</li>
        <li>Event & Project Planners</li>
      </ul>
    </div>
    <button className='w-[300px] h-[58px] bg-white justify-center inline-flex hover:bg-gray-50 transition-colors mt-4'>
      <img src='/assets/landing/state=default, device=web.svg' alt='Button Lading' />
    </button>
  </div>
)

function Section3() {
  return (
    <>
      {/* Header */}
      <div className='w-full h-[98px] p-5 bg-[#faf9f6] justify-between items-center inline-flex'>
        <div className="text-[#343434] text-5xl font-normal font-['National Park '] leading-[57.60px]">
          Get things DONE with DUN
        </div>
        <div className='text-[#343434] text-lg font-normal font-monaspace leading-[27px]'>
          Use internally and with your clients
        </div>
      </div>

      {/* Main content */}
      {/* Main content */}
      <div className={clsx('w-full flex flex-col bg-no-repeat bg-cover bg-paper border-t-1')}>
        <div className='flex flex-col items-center justify-around'>
          {/* Desktop images */}
          <div className='flex-row justify-between hidden w-full md:flex border-t-1'>
            {/* Left side with cloud image */}
            <div className='relative flex items-center w-1/2'>
              <img src='./assets/landing/Cloud.svg' className='w-full translate-y-2' alt='Cloud' />
              <div className='absolute flex-col justify-center h-full pl-5'>
                <TextContent />
              </div>
            </div>
            {/* Right side with relax image */}
            <div className='flex items-center justify-center w-1/2 border-l border-black'>
              <img src='./assets/landing/relax.svg' className='w-full translate-y-2' alt='Relax' />
            </div>
          </div>

          {/* Mobile image */}
          <div className='flex w-full md:hidden'>
            <img src='./assets/landing/Frame 1040.svg' className='w-full' alt='Mobile Frame' />
          </div>
        </div>

        {/* Mobile text content */}
        <div className='flex md:hidden bg-[#c5d4d2] p-5'>
          <TextContent />
        </div>
      </div>
    </>
  )
}

export default Section3
