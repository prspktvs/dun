import React, { useState } from 'react'

import { Tab } from '../../pages/Auth/Login'
import { GoogleLogo, HideIcon, UnhideIcon } from '../icons'
import { useAuth } from '../../context/AuthContext'
import { notifyError } from '../../utils/notifications'
import { FILL_ALL_FIELDS_MESSAGE } from '../../constants/messages'
import ButtonDun from '../ui/buttons/ButtonDun'
import { Loader } from '../ui/Loader'

interface IAuthTabsProps {
  tab: string
  setTab: React.Dispatch<React.SetStateAction<Tab>>
}

function LeftTab({
  isSignUp,
  setTab,
}: {
  isSignUp: boolean
  setTab: React.Dispatch<React.SetStateAction<Tab>>
}) {
  const toggleTab = () => setTab(isSignUp ? 'login' : 'signup')
  return (
    <div className='hidden w-1/2 sm:flex h-fit'>
      <div className='flex-col flex-1 hidden text-lg sm:flex font-monaspace'>
        <div className='mt-5 ml-8'>
          <div>Hey there!</div>
          <div className='w-[400px] mt-6 h-[30px]'>
            {isSignUp
              ? 'Awesome to have you here. Let’s get you signed up so the fun can begin. Ready?'
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

function AuthForm({ tab, setTab }: IAuthTabsProps) {
  const [isLoading, setLoading] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [isPassHidden, setPassHidden] = useState<boolean>(true)

  const {
    loginWithEmailAndPassword,
    registerWithEmailAndPassword,
    signInWithGoogle,
    forgotPassword,
  } = useAuth()

  const login = async () => {
    if (!email || !password) return notifyError(FILL_ALL_FIELDS_MESSAGE)
    setLoading(true)

    await loginWithEmailAndPassword({ email, password })

    setEmail('')
    setPassword('')
    setLoading(false)
  }

  const signUp = async () => {
    if (!email || !password || !name) return notifyError(FILL_ALL_FIELDS_MESSAGE)
    setLoading(true)

    await registerWithEmailAndPassword({ email, password, name, cb: () => setTab('verification') })

    setEmail('')
    setName('')
    setPassword('')
    setLoading(false)
  }

  if (tab === 'verification') {
    return (
      <>
        <div className='flex flex-col items-center justify-center p-6 text-xs font-monaspace'>
          <div className='w-full h-full'>
            We sent an email to <span className='text-[#8379BD]'>{email}</span> to verify.
          </div>
          <div className='w-full mt-1'>Please click on the "Verify email" button to continue.</div>
          <div className='mt-9'>
            <p className='mb-3 font-semibold'> Not seeing the email? </p>
            <p>Please check your spam folder, resend email or contact us at dun@gmail.co.</p>
          </div>
        </div>
        <div className='p-1 border-t-1 divide-borders-gray'>
          <button
            onClick={() => setTab('login')}
            className='h-[35px] w-full bg-btnBg text-white font-monaspace cursor-pointer'
          >
            DUN
          </button>
        </div>
      </>
    )
  }

  if (tab === 'forgot') {
    return (
      <>
        <div className='w-full px-5 py-3 text-sm border-b-1 font-monaspace'>
          Please enter your email address.
        </div>
        <div className='flex border-b-1 font-monaspace'>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className='w-full pr-3 my-3 outline-none ml-7'
            placeholder='Email'
            type='email'
          />
        </div>
        <div className='p-1 border-b-1 divide-borders-gray'>
          <button
            onClick={() => forgotPassword(email)}
            className='h-[35px] w-full bg-btnBg text-white font-monaspace hover:cursor-pointer'
          >
            {isLoading ? <Loader /> : 'Reset password'}
          </button>
        </div>
        <div
          onClick={() => setTab('login')}
          className='mt-5 w-full text-center font-monaspace text-btnBg cursor-pointer'
        >
          Back to log in
        </div>
      </>
    )
  }

  return (
    <>
      <div className='hidden sm:block'>
        <div className='flex border-b-1 font-monaspace'>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className='w-full pr-3 my-3 outline-none ml-7'
            placeholder='Email'
            type='email'
          />

          {tab === 'signup' && (
            <span className='w-full border-l-1'>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className='my-3 outline-none ml-7'
                placeholder='Name'
              />
            </span>
          )}
        </div>
        <div className='flex items-center'>
          <input
            className='w-full my-3 outline-none ml-7 font-monaspace'
            placeholder='Password'
            type={isPassHidden ? 'password' : 'text'}
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <div
            className='flex items-center mr-12 cursor-pointer'
            onClick={() => setPassHidden((p) => !p)}
          >
            {isPassHidden ? <HideIcon /> : <UnhideIcon />}
          </div>
        </div>
        <div className='h-12 border-t-1 divide-borders-gray'>
          <ButtonDun onClick={tab === 'signup' ? signUp : login}>
            {isLoading ? <Loader /> : tab === 'signup' ? 'Continue' : 'Log in'}
          </ButtonDun>
        </div>
      </div>

      <div className='block w-full max-w-xs mx-auto overflow-hidden border border-gray-300 rounded-lg sm:hidden font-monaspace bg-body-color'>
        <div className='w-full border-b border-gray-300'>
          <input
            type='email'
            placeholder='Email'
            className='w-full p-3 outline-none bg-body-color text-primary-text'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {tab === 'signup' && (
          <div className='w-full border-b border-gray-300'>
            <input
              type='text'
              placeholder='Name'
              className='w-full p-3 outline-none bg-body-color text-primary-text'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}
        <div className='flex items-center w-full border-b border-gray-300'>
          <input
            type={isPassHidden ? 'password' : 'text'}
            placeholder='Password'
            className='w-full p-3 outline-none bg-body-color text-primary-text'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div
            className='flex items-center mr-3 cursor-pointer'
            onClick={() => setPassHidden((p) => !p)}
          >
            {isPassHidden ? <HideIcon /> : <UnhideIcon />}
          </div>
        </div>
        <div className='w-full'>
          <ButtonDun
            onClick={tab === 'signup' ? signUp : login}
            className='w-full p-3 font-semibold text-white bg-purple-600 hover:bg-purple-700'
          >
            {isLoading ? <Loader /> : tab === 'signup' ? 'Continue' : 'Log in'}
          </ButtonDun>
        </div>
      </div>
      <button
        onClick={() => setTab('forgot')}
        className='flex w-full items-center justify-end px-5 pt-1 font-monaspace bg-transparent cursor-pointer text-btnBg sm:border-t sm:divide-borders-gray'
      >
        Forgot password?
      </button>
      <div className='flex items-center justify-center w-full font-monaspace'>or</div>
      <div className='flex justify-center gap-x-3 font-medium text-[#47444F]'>
        <button
          className='z-50 flex items-center justify-center px-4 py-2 bg-white border gap-x-2 hover:cursor-pointer'
          onClick={signInWithGoogle}
        >
          <GoogleLogo />
          Continue with Google
        </button>
        {/* <button className='flex items-center justify-center px-4 bg-white border gap-x-2 hover:cursor-pointer'>
          <AppleLogo />
          Continue with Apple
        </button> */}
      </div>
    </>
  )
}

export default function AuthTabs(props: IAuthTabsProps) {
  const { tab, setTab } = props
  const isSignUp = tab === 'signup'
  const isVerification = tab === 'verification'
  const isForgot = tab === 'forgot'

  return (
    <div className='h-full'>
      <div className='flex h-full'>
        <LeftTab isSignUp={tab === 'signup' || tab === 'verification'} setTab={setTab} />
        <div className='flex-1 h-full border-l-1'>
          <div className='w-full h-[54px] flex items-center justify-center text-xl px-7 font-monospace sm:border-b divide-borders-gray font-monaspace my-[40px] sm:my-0'>
            {isVerification
              ? 'Email verification'
              : isSignUp
                ? 'Create account'
                : isForgot
                  ? 'Forgot password'
                  : 'Log in'}
          </div>
          <AuthForm tab={tab} setTab={setTab} />
        </div>
      </div>
    </div>
  )
}
