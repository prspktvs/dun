import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'
import { GoogleLogo, HideIcon, UnhideIcon, NewUserIcon, MailIcon } from '../icons'
import { Loader } from '../ui/Loader'
import { AuthButton } from '../ui/buttons/AuthButton'
import { genId, getRandomProjectRoute } from '../../utils'

type TabType = 'login' | 'signup' | 'verification' | 'forgot'

interface AuthFormProps {
  tab: 'login' | 'signup'
  setTab: (tab: TabType) => void
}

export function AuthForm({ tab, setTab }: AuthFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  })
  const [isLoading, setLoading] = useState(false)
  const [isPassHidden, setPassHidden] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()
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
        await loginWithEmailAndPassword({ email, password })
      } else {
        await registerWithEmailAndPassword({
          email,
          password,
          name,
          // TODO: implement project protection and only then redirect to project after sign up
          // cb: () => navigate(location.state?.from?.pathname ?? '/dashboard'),
          cb: () => navigate('/dashboard'),
        })
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
      <div className='h-[56px] w-full border p-1 md:border-l-0 md:border-r-0'>
        <button
          type='submit'
          disabled={isLoading}
          className='w-full h-full text-base text-white bg-btnBg font-monaspace divide-borders-gray'
        >
          {isLoading ? <Loader /> : tab === 'signup' ? 'Create' : 'Log in'}
        </button>
      </div>

      {/* Container for Forgot password/Terms and 'or' */}
      <div className='px-10'>
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
          <div className='mt-2 text-xs text-center sm:hidden'>
            <div className='text-[#47444F]'>By clicking 'Create' you agree to our</div>
            <button onClick={handleTermsClick} className='text-[#8774FF]'>
              Terms and Privacy Policy
            </button>
          </div>
        )}
      </div>

      <div className='flex flex-row h-md:flex-col gap-3 justify-center items-center'>
        <AuthButton onClick={signInWithGoogle} icon={<GoogleLogo className='w-6 h-6' />}>
          Continue with Google
        </AuthButton>

        {tab === 'signup' && (
          <AuthButton onClick={() => setTab('login')} icon={<MailIcon className='w-7 h-7' />}>
            Log in with email
          </AuthButton>
        )}
        {tab === 'login' && (
          <AuthButton onClick={() => setTab('signup')} icon={<NewUserIcon className='w-7 h-7' />}>
            Create account
          </AuthButton>
        )}
      </div>
    </form>
  )
}
