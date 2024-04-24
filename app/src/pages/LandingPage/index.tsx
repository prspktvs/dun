import React from 'react'
import Logo from '../../components/ui/Logo'
import LineSection from './LineSection/LineSection'
import Section2 from './Section2'
import Section3 from './Section3'
import DualSectionBox from './DualSectionBox/DualSectionBox'
import Footer from './Footer'
import { Hamburger } from './Icons'

function LandingPage() {
  return (
    <div className='h-screen w-full overflow-x-hidden bg-[#F5F0EB]'>
      {/* Header */}
      <div className='border-2 m-6 border-black'>
        <div className='flex justify-between items-center border-b-2 bg-[#C5D4D2] h-14 border-black '>
          <div className='border-border-color pl-5 text-4xl text-center  text-black'>
            <Logo />
          </div>
          <button className='h-full flex items-center p-5 border-l-2 border-black bg-[#C5D4D2] hover:cursor-pointer hover:bg-[#d8e6e4]'>
            <Hamburger />
          </button>
        </div>

        {/* section-1 */}
        <div className='w-full flex flex-col bg-paper'>
          <div className='w-[922.5px] h-[420.5px] mx-auto my-[69px]'>
            <img src='./DUN-Hero 1.jpg' />
          </div>
          <DualSectionBox
            title='Zero in on the important stuff '
            desc="Hey buddy, count on DUN to make your life easier! We've smoothed out work processes and made team and customer communication a walk in the park for you."
            btnTitle="Let's Dive In for free"
          />
        </div>
        <div>
          <LineSection />
        </div>
        {/* section-2 */}
        <div className='grid grid-cols-2 bg-paper'>
          <div className='uppercase text-[40px] h-[108px] m-5 w-full'>
            Let's ramp up that productivity
          </div>
          <div className='text-md w-[550px] justify-self-end m-6 font-monaspace'>
            DUN's the go-to service for sorting out your work processes and keeping those projects
            in check. Plus, it lets you chat it up with your team and customers all in one place.
            Think of DUN as your go-to app for getting down to some serious "focused work".
          </div>
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
