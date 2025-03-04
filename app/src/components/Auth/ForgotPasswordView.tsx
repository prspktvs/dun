import React, { useState } from 'react'

import { useAuth } from '../../context/AuthContext'
import { Loader } from '../ui/Loader'
import { AuthButton } from '../ui/buttons/AuthButton'
import { GoogleLogo, NewUserIcon, MailIcon } from '../icons'

interface ForgotPasswordViewProps {
  setTab: (tab: 'login' | 'signup' | 'verification' | 'forgot') => void
}

export function ForgotPasswordView({ setTab }: ForgotPasswordViewProps) {
  const [email, setEmail] = useState('')
  const [isLoading, setLoading] = useState(false)
  const { resetPassword, signInWithGoogle } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await resetPassword(email)
      // TODO: Add success notification
      setTab('login')
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='px-4 sm:px-0'>
      <div className='w-full px-5 pt-3 text-sm text-center pb-7 font-monaspace'>
        STEP 1 Enter account email
      </div>

      <div className='flex border h-14 font-monaspace'>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='w-full pr-3 my-3 ml-4 outline-none'
          placeholder='Email'
          type='email'
        />
      </div>

      <div className='p-1 mb-5 border h-14'>
        <button type='submit' className='w-full h-full p-1 bg-btnBg text-white font-monaspace'>
          {isLoading ? <Loader /> : 'Get a link'}
        </button>
      </div>

      <AuthButton onClick={signInWithGoogle} icon={<GoogleLogo className='w-6 h-6' />}>
        Continue with Google
      </AuthButton>

      <AuthButton
        onClick={() => setTab('login')}
        icon={<MailIcon className='w-7 h-7' />}
        className='mt-1'
      >
        Log in with email
      </AuthButton>

      <AuthButton
        onClick={() => setTab('signup')}
        icon={<NewUserIcon className='w-7 h-7' />}
        className='mt-1'
      >
        Create account
      </AuthButton>
    </form>
  )
}
