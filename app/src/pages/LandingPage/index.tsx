import React from 'react'
import Logo from '../../components/ui/Logo'
import LineSection from './LineSection/LineSection'
import Section2 from './Section2'
import Section3 from './Section3'
import DualSectionBox from './DualSectionBox/DualSectionBox'
import Footer from './Footer'
import { Hamburger } from '../../components/icons'
import { useAuth } from '../../context/AuthContext'
import { Navigate } from 'react-router-dom'

function LandingPage() {
  const { user } = useAuth()

  if (user && user?.lastProjectId) return <Navigate to={`/${user.lastProjectId}`} />

  return (
    <div className='h-screen w-full overflow-x-hidden bg-[#F5F0EB]'>
      {/* Header */}
      <div className='border-2 m-6 border-black'>
        <div className='flex justify-between items-center border-b-1 bg-[#C5D4D2] h-14 border-black '>
          <div className='border-border-color pl-5 text-4xl text-center  text-black'>
            <Logo />
          </div>
          <button className='h-full flex items-center p-5 border-l-1 border-black bg-[#C5D4D2] hover:cursor-pointer hover:bg-[#d8e6e4]'>
            <Hamburger />
          </button>
        </div>

        {/* section-1 */}
        <div className='w-full flex flex-col bg-paper '>
          <div className='w-full mx-auto md:my-[79px]   sm:flex sm:justify-center sm:items-center sm:border-b-1 md:border-b-0 border-black'>
            <img
              className='sm:w-[500px] lg:w-[922.5px] sm:mb-7 lg:h-[420.5px] w-full mt-4'
              src='./assets/landing/dun-hero.jpg'
            />
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
        <div className='grid lg:grid-cols-2 bg-paper sm:grid-cols-1'>
          <div className='uppercase text-[40px] lg:h-[108px] m-5 sm:w-full'>
            Let's ramp up that productivity
          </div>
          <div className='text-md lg:w-[550px] md:justify-self-end lg:m-6 font-monaspace sm:mx-5 sm:mb-5 ml-3 '>
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
