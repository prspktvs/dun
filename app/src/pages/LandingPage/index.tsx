import React from 'react'

import Logo from '../../components/ui/Logo'
import { RulerSeparator } from './RulerSeparator'
import Features from './Features'
import TargetAudience from './Audience'
import Footer from './Footer'
import { Frame } from './Frame'
import { useAuth } from '../../context/AuthContext'
import { Loader } from '../../components/ui/Loader'

const NAVIGATION_ITEMS = [
  { name: 'About', id: 'about' },
  { name: 'Features', id: 'features' },
  { name: 'Made for You', id: 'made-for-you' },
  { name: 'Contacts', id: 'contacts' },
]

export const LandingHeader = () => {
  const { user, loading: isLoading } = useAuth()
  return (
    <div className='fixed top-0 left-2 right-2 z-50'>
      <div className='h-2 bg-[#faf9f6]' />
      <header className='border-t-1 border-l-1 border-r-1 h-14 overflow-hidden flex flex-row items-start justify-center gap-px border-b border-black bg-[#c5d4d2] z-40'>
        {/* Logo */}
        <a
          href='/'
          className='grow shrink basis-0 md:grow-0 self-stretch flex flex-col items-start md:items-center justify-center px-2.5 md:px-5 lg:px-10 md:border-r-[1px] border-black no-underline'
        >
          <Logo />
        </a>

        {/* Navigation */}
        <nav className='items-center self-stretch justify-center flex-1 hidden gap-2 px-2 md:flex md:gap-10 md:px-10'>
          {NAVIGATION_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`/#${item.id}`}
              className='flex items-center justify-center pt-3 pb-2 no-underline'
            >
              <span className='text-[#343434] hover:opacity-75 text-base font-medium font-monaspace uppercase whitespace-nowrap'>
                {item.name}
              </span>
            </a>
          ))}
        </nav>

        <div className='md:flex flex-col items-center self-stretch justify-center md:border-l border-black px-2.5 md:px-5 lg:px-10'>
          <a
            href={user ? '/dashboard' : '/login'}
            className='h-[50px] py-2 flex items-center justify-center no-underline'
          >
            {isLoading ? (
              <div className='w-36'>
                <Loader color='gray' />
              </div>
            ) : (
              <span className='text-[#343434] w-36 text-center hover:opacity-75 text-base font-semibold font-monaspace  whitespace-nowrap'>
                {user ? 'Go to Dashboard' : 'Try for free'}
              </span>
            )}
          </a>
        </div>
      </header>
    </div>
  )
}

function LandingPage() {
  return (
    <div className='h-screen w-full overflow-x-hidden scroll-smooth bg-[#faf9f6]'>
      <div className='m-2 border border-black'>
        <section id='about'>
          <LandingHeader />
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
