import React from 'react'
import clsx from 'clsx'

// Добавляем хук для отслеживания ширины экрана
const useWindowWidth = () => {
  const [width, setWidth] = React.useState(window.innerWidth)

  React.useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return width
}

const TextContent = () => (
  <div className='text-[#555555] text-sm md:text-[1.5vw] lg:text-[1.2vw] xl:text-xl font-normal font-monaspace leading-snug w-[85%] mx-auto'>
    <div className='text-[#343434] text-sm md:text-[1.5vw] lg:text-[1.2vw] xl:text-xl font-semibold leading-[30px] pb-[15px] font-monaspace'>
      Dun is a good choice for:
    </div>
    <div className='flex flex-col gap-4'>
      <ul className='list-disc list-inside'>
        <li>Software & design agencies</li>
        <li>Freelancers & independent creators</li>
        <li>Content creators</li>
        <li>Social media managers & Digital marketing</li>
      </ul>
      <ul className='list-disc list-inside'>
        <li>Architects and interior designers</li>
        <li>Fashion designers and apparel brands</li>
        <li>Tutors & Students</li>
        <li>Nonprofits and volunteer organizations</li>
      </ul>
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
  const windowWidth = useWindowWidth()

  return (
    <>
      {/* Unified Header */}
      <div className='w-full bg-[#faf9f6]'>
        {windowWidth >= 1280 ? (
          // Desktop Header
          <div className='w-full h-[98px] p-5 flex justify-between items-center'>
            <div className="text-[#343434] text-5xl font-normal font-['National Park '] leading-[57.60px]">
              Get things DONE with DUN
            </div>
            <div className='text-[#343434] text-lg font-normal font-monaspace leading-[27px]'>
              Use internally and with your clients
            </div>
          </div>
        ) : (
          // Mobile Header
          <div className='h-[110px] px-2.5 py-5 flex-col justify-start items-start gap-[15px] flex'>
            <div className='self-stretch h-[70px] flex-col justify-start items-start flex'>
              <div className='text-[#343434] text-xs font-normal font-monaspace leading-none'>
                Use internally and with your clients
              </div>
              <div className="self-stretch text-[#343434] text-[40px] font-normal font-['National Park '] leading-[54px]">
                Get things DONE with DUN
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main content */}
      <div
        className={clsx(
          'w-full flex flex-col bg-no-repeat bg-cover bg-paper border-t  border-black',
        )}
      >
        <div className='flex flex-col items-center justify-around'>
          {/* Desktop images */}
          <div className='flex-row justify-between hidden w-full border-t md:flex'>
            {/* Left side with cloud image */}
            <div className='relative flex items-center w-1/2 md:h-[600px] lg:h-[697px] xl:h-[760px]'>
              <img
                src='./assets/landing/Cloud.svg'
                className='object-cover w-full h-full translate-y-2'
                alt='Cloud'
              />
              <div className='absolute inset-0 flex items-center justify-center'>
                <TextContent />
              </div>
            </div>
            {/* Right side with relax image */}
            <div className='flex items-center justify-center w-1/2 border-l border-black h-[390px] md:h-[600px] lg:h-[697px] xl:h-[760px]'>
              <img
                src='./assets/landing/relax.svg'
                className='object-cover w-full h-full translate-y-2'
                alt='Relax'
              />
            </div>
          </div>

          {/* Mobile image */}
          <div className='flex w-full border-b md:hidden'>
            <img src='./assets/landing/Frame 1040.svg' className='w-full' alt='Mobile Frame' />
          </div>
        </div>

        {/* Mobile text content */}
        <div className='flex md:hidden bg-[#FAF9F6] p-5'>
          <TextContent />
        </div>
      </div>
    </>
  )
}

export default Section3
