import React from 'react'

import { LeftTab } from './LeftTab'
import { AuthForm } from './AuthForm'
import { VerificationView } from './VerificationView'
import { ForgotPasswordView } from './ForgotPasswordView'

interface IAuthTabsProps {
  tab: 'login' | 'signup' | 'verification' | 'forgot'
  setTab: React.Dispatch<React.SetStateAction<'login' | 'signup' | 'verification' | 'forgot'>>
}

export default function AuthTabs({ tab, setTab }: IAuthTabsProps) {
  return (
    <div className='h-full'>
      <div className='flex h-full'>
        <LeftTab isSignUp={tab === 'signup' || tab === 'verification'} setTab={setTab} />

        <div className='flex-1 h-full border-l-1'>
          <div className='space-y-0'>
            <div
              className={`
              flex justify-center w-full px-10 text-[24px] sm:text-xl 
              font-semibold text-center sm:justify-start sm:text-left 
              sm:border-b divide-gray-border font-monaspace mt-12 
              sm:py-7 sm:my-0 
              ${tab === 'forgot' ? '' : 'mb-10 sm:mb-0'}
            `}
            >
              {tab === 'verification' && 'Email verification'}
              {tab === 'signup' && 'Create account'}
              {tab === 'forgot' && 'Reset password'}
              {tab === 'login' && 'Log in'}
            </div>

            {tab === 'verification' && <VerificationView setTab={setTab} />}
            {tab === 'forgot' && <ForgotPasswordView setTab={setTab} />}
            {(tab === 'login' || tab === 'signup') && <AuthForm tab={tab} setTab={setTab} />}
          </div>
        </div>
      </div>
    </div>
  )
}
