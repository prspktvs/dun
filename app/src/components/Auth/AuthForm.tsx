import React, { useState } from 'react'

import { useAuth } from '../../context/AuthContext'
import { GoogleLogo, HideIcon, UnhideIcon } from '../icons'
import { Loader } from '../ui/Loader'

type TabType = 'login' | 'signup' | 'verification' | 'forgot'

interface AuthFormProps {
  tab: 'login' | 'signup'
  setTab: (tab: TabType) => void
}

export function AuthForm({ tab, setTab }: AuthFormProps) {
  // Состояния формы
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  })
  const [isLoading, setLoading] = useState(false)
  const [isPassHidden, setPassHidden] = useState(true)

  const { loginWithEmailAndPassword, registerWithEmailAndPassword, signInWithGoogle } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { email, password, name } = formData
      if (tab === 'login') {
        await loginWithEmailAndPassword(email, password)
      } else {
        await registerWithEmailAndPassword(email, password, name)
        setTab('verification')
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className='px-4 sm:px-0'>
      <div className='grid grid-cols-1 sm:grid-cols-2'>
        {/* Name input */}
        {tab === 'signup' && (
          <div className='flex border sm:border-0 sm:border-b-1 sm:border-r-1 font-monaspace'>
            <input
              name='name'
              value={formData.name}
              onChange={handleInputChange}
              className='w-full pr-3 my-3 outline-none'
              placeholder='Name'
              type='text'
            />
          </div>
        )}

        {/* Email input */}
        <div
          className={`flex border sm:border-0 -mt-[1px] sm:border-b-1 font-monaspace ${tab !== 'signup' ? 'sm:col-span-2' : ''}`}
        >
          <input
            name='email'
            value={formData.email}
            onChange={handleInputChange}
            className='w-full pr-3 my-3 outline-none'
            placeholder='Email'
            type='email'
          />
        </div>
      </div>
      {/* Password input */}
      <div className='flex border  font-monaspace -mt-[1px]'>
        <input
          name='password'
          value={formData.password}
          onChange={handleInputChange}
          className='w-full pr-3 my-3 outline-none'
          placeholder='Password'
          type={isPassHidden ? 'password' : 'text'}
        />
        <div className='cursor-pointer' onClick={() => setPassHidden(!isPassHidden)}>
          {isPassHidden ? <HideIcon /> : <UnhideIcon />}
        </div>
      </div>

      {/* Forgot password link */}
      {tab === 'login' && (
        <div
          onClick={() => setTab('forgot')}
          className='mt-2 text-sm text-right cursor-pointer text-[#7b759b]'
        >
          Forgot password?
        </div>
      )}

      {/* Submit button */}
      <button
        type='submit'
        disabled={isLoading}
        className='w-full h-[35px] mt-5 bg-[#8279BD] text-white font-monaspace'
      >
        {isLoading ? <Loader /> : tab === 'login' ? 'Log in' : 'Sign up'}
      </button>

      {/* Google auth */}
      <div className='relative'>
        <div className='absolute w-full text-center top-5'>or</div>
        <button
          type='button'
          onClick={signInWithGoogle}
          className='z-50 flex items-center justify-center w-full px-4 py-2 mt-10 bg-white border gap-x-2'
        >
          <GoogleLogo />
          Continue with Google
        </button>
      </div>
    </form>
  )
}
