import React from 'react'
import { Navigate } from 'react-router-dom'

import Logo from '../../components/ui/Logo'
import LineSection from './LineSection/LineSection'
import Section2 from './Section2'
import Section3 from './Section3'
import DualSectionBox from './DualSectionBox/DualSectionBox'
import Footer from './Footer'
import { Frame } from './Frame'
import { useAuth } from '../../context/AuthContext'
import { IUser, User } from '../../types/user'

function LandingPage() {
  const { user } = useAuth()

  if (user && user?.lastProjectId) return <Navigate to={`/${user.lastProjectId}`} />

  return (
    <div className='h-screen w-full overflow-x-hidden bg-[#faf9f6'>
      {/* Header */}
      <div className='m-2 border border-black'>
        <div className='w-full h-[60px] justify-center items-start gap-px inline-flex overflow-hidden border-b border-black  bg-[#c5d4d2]'>
          <div className='inline-flex flex-col items-center self-stretch justify-center gap-1 px-10'>
            <Logo />
          </div>
          <div className='flex items-center self-stretch justify-center flex-1 gap-10 px-10 py-0 border-black grow bg-variable-collection-landing-green-main border-x'>
            <button className='all-[unset] box-border inline-flex items-center flex-[0_0_auto] gap-1 pt-3 pb-2 px-0 h-[50px] justify-center relative'>
              <div className='font-monaspace w-fit tracking-[0] text-base text-[#343434] font-medium leading-[normal] whitespace-nowrap relative'>
                About
              </div>
            </button>
            <button className='all-[unset] box-border inline-flex items-center flex-[0_0_auto] gap-1 pt-3 pb-2 px-0 h-[50px] justify-center relative'>
              <div className='font-monaspace w-fit tracking-[0] text-base text-[#343434] font-medium leading-[normal] whitespace-nowrap relative'>
                Features
              </div>
            </button>
            <button className='all-[unset] box-border inline-flex items-center flex-[0_0_auto] gap-1 pt-3 pb-2 px-0 h-[50px] justify-center relative'>
              <div className='font-monaspace w-fit tracking-[0] text-base text-[#343434] font-medium leading-[normal] whitespace-nowrap relative'>
                Made for You
              </div>
            </button>
            <button className='all-[unset] box-border inline-flex items-center flex-[0_0_auto] gap-1 pt-3 pb-2 px-0 h-[50px] justify-center relative'>
              <div className='font-monaspace w-fit tracking-[0] text-base text-[#343434] font-medium leading-[normal] whitespace-nowrap relative'>
                Contacts
              </div>
            </button>
          </div>
          <div className='inline-flex flex-col items-center self-stretch justify-center gap-1 px-10'>
            <div className='h-[50px] py-2 justify-center items-center gap-1 inline-flex'>
              <div className='font-semibold text-primary-text text-16 font-monaspace'>
                Try for free
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Frame />

        <div>
          <LineSection />
        </div>
        {/* section-2 */}
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
