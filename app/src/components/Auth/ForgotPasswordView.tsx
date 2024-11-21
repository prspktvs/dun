import React, { useState } from 'react'

import { useAuth } from '../../context/AuthContext'
import { Loader } from '../ui/Loader'

interface ForgotPasswordViewProps {
  setTab: (tab: 'login' | 'signup' | 'verification' | 'forgot') => void
}

export function ForgotPasswordView({ setTab }: ForgotPasswordViewProps) {
  const [email, setEmail] = useState('')
  const [isLoading, setLoading] = useState(false)
  const { resetPassword } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await resetPassword(email)
      // Можно добавить уведомление об успехе
      setTab('login')
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Заголовок */}
      <div className='w-full px-5 py-3 text-sm border-b-1 font-monaspace'>
        Please enter your email address.
      </div>

      {/* Email input */}
      <div className='flex border-b-1 font-monaspace'>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='w-full pr-3 my-3 outline-none ml-7'
          placeholder='Email'
          type='email'
        />
      </div>

      {/* Submit button */}
      <div className='p-1 border-b-1'>
        <button type='submit' className='h-[35px] w-full bg-[#8279BD] text-white font-monaspace'>
          {isLoading ? <Loader /> : 'Reset password'}
        </button>
      </div>

      {/* Back to login */}
      <div
        onClick={() => setTab('login')}
        className='mt-5 w-full text-center font-monaspace text-[#8279BD] cursor-pointer'
      >
        Back to login
      </div>
    </form>
  )
}
