import React from 'react'
import { Navigate } from 'react-router-dom'

import Logo from '../../components/ui/Logo'
import { RulerSeparator } from './RulerSeparator'
import Features from './Features'
import TargetAudience from './Audience'
import Footer from './Footer'
import { Frame } from './Frame'
import { useAuth } from '../../context/AuthContext'
import { genId } from '../../utils'
import { IUser } from '../../types/User'

const NAVIGATION_ITEMS = [
  { name: 'About', id: 'about' },
  { name: 'Features', id: 'features' },
  { name: 'Made for You', id: 'made-for-you' },
  { name: 'Contacts', id: 'contacts' },
]

const Header = () => {
  return (
    <header className='w-full h-14 overflow-hidden flex flex-row items-start justify-center gap-px border-b border-black bg-[#c5d4d2]'>
      {/* Logo */}
      <div className='grow shrink basis-0 md:grow-0 self-stretch flex flex-col items-start md:items-center justify-center px-2.5 md:px-5 lg:px-10 border-r-[1px] border-black'>
        <Logo />
      </div>

      {/* Navigation */}
      <nav className='items-center self-stretch justify-center flex-1 hidden gap-2 px-2 md:flex md:gap-10 md:px-10'>
        {NAVIGATION_ITEMS.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className='flex items-center justify-center pt-3 pb-2 no-underline'
          >
            <span className='text-[#343434] hover:opacity-75 text-base font-medium font-monaspace uppercase whitespace-nowrap'>
              {item.name}
            </span>
          </a>
        ))}
      </nav>

      {/* Try for free button - desktop/tablet only */}
      <div className='hidden md:flex flex-col items-center self-stretch justify-center border-l border-black px-2.5 md:px-5 lg:px-10'>
        <a href={`/login`} className='h-[50px] py-2 flex items-center justify-center no-underline'>
          <span className='text-[#343434] hover:opacity-75 text-base font-semibold font-monaspace  whitespace-nowrap'>
            Try for free
          </span>
        </a>
      </div>
    </header>
  )
}

function LandingPage() {
  const { user } = useAuth()

  const redirectProjectId = (user as IUser)?.lastProjectId ? 'dashboard' : genId()
  if (user) return <Navigate to={`/${redirectProjectId}`} />

  return (
    <div className='h-screen w-full overflow-x-hidden scroll-smooth bg-[#faf9f6]'>
      <div className='m-2 border border-black'>
        <section id='about'>
          <Header />
          <Frame />
        </section>
        <RulerSeparator />
        <section id='features'>
          <Features />
        </section>
        <RulerSeparator />
        <section id='made-for-you'>
          <TargetAudience />
        </section>
        <RulerSeparator />

        <section id='contacts'>
          <Footer />
        </section>
      </div>
    </div>
  )
}

export default LandingPage
