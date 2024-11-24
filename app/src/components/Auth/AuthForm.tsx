import React, { useState } from 'react'

import { useAuth } from '../../context/AuthContext'
import { GoogleLogo, HideIcon, UnhideIcon, NewUserIcon } from '../icons'
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
  const handleTermsClick = () => {
    console.log('Terms clicked - functionality not implemented yet')
    // TODO: Implement terms navigation when ready
  }
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
          <div className='flex border sm:border-0 font-monaspace'>
            <input
              name='name'
              value={formData.name}
              onChange={handleInputChange}
              className='w-full px-4 pr-3 my-3 outline-none sm:px-10'
              placeholder='Name'
              type='text'
            />
          </div>
        )}

        {/* Email input */}
        <div
          className={`flex border  -mt-[1px] sm:border-0 font-monaspace ${
            tab === 'signup' ? 'sm:border-l' : 'sm:col-span-2'
          }`}
        >
          <input
            name='email'
            value={formData.email}
            onChange={handleInputChange}
            className='w-full px-4 pr-3 my-3 outline-none sm:px-10'
            placeholder='Email'
            type='email'
          />
        </div>
      </div>
      {/* Password input */}
      <div className='flex border  -mt-[1px] sm:border-0 sm:border-t font-monaspace'>
        <input
          name='password'
          value={formData.password}
          onChange={handleInputChange}
          className='w-full px-4 pr-3 my-3 outline-none sm:px-10'
          placeholder='Password'
          type={isPassHidden ? 'password' : 'text'}
        />
        <div
          className='flex items-center mr-4 cursor-pointer'
          onClick={() => setPassHidden((p) => !p)}
        >
          {isPassHidden ? <HideIcon /> : <UnhideIcon />}
        </div>
      </div>

      {/* Submit button */}
      <div className='h-[56px] w-full border p-1  -mt-[1px]'>
        <button
          type='submit'
          disabled={isLoading}
          className='w-full h-full bg-[#8279BD] text-white font-monaspace text-base divide-gray-border'
        >
          {isLoading ? <Loader /> : tab === 'signup' ? 'Create' : 'Log in'}
        </button>
      </div>

      {/* Container for Forgot password/Terms and 'or' */}
      <div className='px-10 pb-7'>
        {/* Forgot password for login */}
        {tab === 'login' && (
          <div
            onClick={() => setTab('forgot')}
            className='text-sm text-right py-2 cursor-pointer text-[#7b759b]'
          >
            Forgot password?
          </div>
        )}

        {/* Mobile Terms for signup */}
        {tab === 'signup' && (
          <div className='mt-2 mb-2 text-xs text-center sm:hidden'>
            <div className='text-[#47444F]'>By clicking 'Create' you agree to our</div>
            <button onClick={handleTermsClick} className='text-[#8774FF]'>
              Terms and Privacy Policy
            </button>
          </div>
        )}

        {/* 'or' divider */}
        <div className='relative flex items-center justify-center w-full mt-5 text-center font-monaspace'>
          <span>or</span>
        </div>
      </div>

      {/* Google auth */}
      <div className='relative sm:row-start-5 h-[56px] '>
        <div className='p-1 '>
          <button
            type='button'
            onClick={signInWithGoogle}
            className='flex items-center justify-center w-full h-[56px] text-16 font-roboto px-4 py-2 border gap-[15px]'
          >
            <GoogleLogo className='w-6 h-6' />
            Continue with Google
          </button>
        </div>
      </div>

      {tab === 'login' && (
        <div className='relative sm:row-start-5 mt-1 h-[56px]'>
          <div className='p-1'>
            <button
              type='button'
              onClick={() => setTab('signup')}
              className='flex items-center justify-center w-full h-[56px] text-16 font-roboto px-4 py-2 border gap-[15px]'
            >
              <NewUserIcon className='w-7 h-7' />
              Create account
            </button>
          </div>
        </div>
      )}
    </form>
  )
}
