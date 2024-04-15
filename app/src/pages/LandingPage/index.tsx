import React from 'react'
import Logo from '../../components/ui/Logo'
import LineSection from './LineSection/LineSection'
import Section2 from './Section2/CardsSection2'
import Section3 from './Section3/Section3'
import DualSectionBox from './DualSectionBox/DualSectionBox'
import Footer from './Footer/Footer'

function LandingPage() {
  return (
    <div className='h-screen w-full overflow-x-hidden'>
      {/* Header */}
      <div className='border-2 m-6 border-black'>
        <div className='flex justify-between items-center border-b-2 bg-[#C5D4D2] h-14 border-black '>
          <div className='border-border-color pl-5 text-4xl text-center  text-black'>
            <Logo />
          </div>
          <div className='h-full flex items-center p-5 border-l-2 border-black'>
            <svg
              width='30'
              height='23'
              viewBox='0 0 30 23'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <line x1='0.5' y1='1' x2='29.5' y2='1' stroke='black' />
              <line x1='0.5' y1='8' x2='29.5' y2='8' stroke='black' />
              <line x1='0.5' y1='15' x2='29.5' y2='15' stroke='black' />
              <line x1='0.5' y1='22' x2='29.5' y2='22' stroke='black' />
            </svg>
          </div>
        </div>

        {/* section-1 */}
        <div className='w-full flx flex-col '>
          <div className='w-[922.5px] h-[420.5px] mx-auto my-[69px]'>
            <img src='./DUN-Hero 1.jpg' />
          </div>
          <DualSectionBox
            title={'Zero in on the important stuff '}
            desc={
              "Hey buddy, count on DUN to make your life easier! We've smoothed out work processes and made team and customer communication a walk in the park for you."
            }
            btnTitle={"Let's Dive In for free"}
          />
        </div>
        <div>
          <LineSection />
        </div>
        {/* section-2 */}
        <div className='flex  w-full '>
          <p className='uppercase text-[40px] m-5'>Let's ramp up that productivity</p>
          <p className='text-sm w-[393px] ml-auto mr-5 '>
            DUN's the go-to service for sorting out your work processes and keeping those projects
            in check. Plus, it lets you chat it up with your team and customers all in one place.
            Think of DUN as your go-to app for getting down to some serious "focused work".
          </p>
        </div>
        <Section2 />
        <LineSection />
        {/* section-3 */}
        <Section3 />
        <LineSection />
        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}

export default LandingPage
