import React from 'react'

interface LeftTabProps {
  isSignUp: boolean
  setTab: (tab: 'login' | 'signup') => void
}

export function LeftTab({ isSignUp, setTab }: LeftTabProps) {
  const toggleTab = () => setTab(isSignUp ? 'login' : 'signup')

  return (
    <div className='hidden w-1/2 sm:flex h-fit'>
      <div className='flex-col flex-1 hidden text-lg sm:flex font-monaspace'>
        <div className='m-10'>
          <div>Hey there!</div>

          <div className='mt-4'>
            {isSignUp
              ? "Awesome to have you here. Let's get you signed up so the fun can begin. Ready?"
              : "Welcome back, it's awesome to see you again."}
          </div>

          <div className='flex mt-40 font-medium'>
            <span>{isSignUp ? 'Already have an account?' : "Don't have an account?"}</span>
            <span className='ml-5 text-[#7b759b] cursor-pointer z-50' onClick={toggleTab}>
              {isSignUp ? 'Log in' : 'Sign up'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
