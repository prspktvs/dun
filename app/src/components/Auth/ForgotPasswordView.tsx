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
      <div className='w-full px-5 pt-3 text-sm text-center pb-7 font-monaspace '>
        STEP 1 Enter account email
      </div>

      {/* Email input */}
      <div className='flex mx-4 border h-14 font-monaspace'>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='w-full pr-3 my-3 ml-4 outline-none'
          placeholder='Email'
          type='email'
        />
      </div>

      {/* Submit button */}
      <div className='p-1 mx-4 border h-14'>
        <button type='submit' className='w-full h-full p-1 bg-[#8279BD] text-white font-monaspace'>
          {isLoading ? <Loader /> : 'Get a link'}
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
