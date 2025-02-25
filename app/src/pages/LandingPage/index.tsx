import React from 'react'
import { Navigate } from 'react-router-dom'

import Logo from '../../components/ui/Logo'
import LineSection from './LineSection/LineSection'
import Section2 from './Section2'
import Section3 from './Section3'
import Footer from './Footer'
import { Frame } from './Frame'
import { useAuth } from '../../context/AuthContext'
import { genId } from '../../utils'
import { IUser } from '../../types/User'

// Компонент Header
const Header = () => {
  const navItems = ['About', 'Features', 'Made for You', 'Contacts']

  return (
    <header className='w-full h-14 overflow-hidden flex flex-row items-start justify-center gap-px border-b border-black bg-[#c5d4d2]'>
      {/* Logo */}
      <div className='grow shrink basis-0 md:grow-0 self-stretch flex flex-col items-start md:items-center justify-center px-2.5 md:px-5 lg:px-10 border-r-[1px] border-black'>
        {' '}
        <Logo />
      </div>

      {/* Navigation */}
      <nav className='items-center self-stretch justify-center flex-1 hidden gap-2 px-2 md:flex md:gap-10 md:px-10 '>
        {navItems.map((item) => (
          <div key={item} className='flex items-center justify-center pt-3 pb-2'>
            <span className='text-[#343434] text-base font-medium font-monaspace  uppercase whitespace-nowrap'>
              {item}
            </span>
          </div>
        ))}
      </nav>

      {/* Try for free button - desktop/tablet only */}
      <div className='hidden md:flex flex-col items-center self-stretch justify-center border-l border-black px-2.5 md:px-5 lg:px-10'>
        <div className='h-[50px] py-2 flex items-center justify-center'>
          <span className='text-[#343434] text-base font-semibold font-monaspace  whitespace-nowrap'>
            Try for free
          </span>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className='flex items-center self-stretch justify-center gap-1 w-14 md:hidden'>
        <img className='w-10 h-10' alt='Menu' src='./assets/landing/Sign in button.svg' />
      </div>
    </header>
  )
}

function LandingPage() {
  const { user } = useAuth()

  const redirectProjectId = (user as IUser)?.lastProjectId ? 'dashboard' : genId()
  if (user) return <Navigate to={`/${redirectProjectId}`} />

  return (
    <div className='h-screen w-full overflow-x-hidden bg-[#faf9f6]'>
      <div className='m-2 border border-black'>
        <Header />

        <main>
          <Frame />
          <LineSection />
          <Section2 />
          <LineSection />
          <Section3 />
          <LineSection />
        </main>

        <Footer />
      </div>
    </div>
  )
}

export default LandingPage
