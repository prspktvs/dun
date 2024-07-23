import React, { useState } from 'react'
import { Tab } from '../../pages/Auth/Login'
import Logo from '../ui/Logo'
import { AppleLogo, GoogleLogo, HideIcon, UnhideIcon } from '../icons'
import { useAuth } from '../../context/AuthContext'
import { Loader, LoadingOverlay } from '@mantine/core'
import { set } from 'lodash'
import { notifyError } from '../../utils/notifications'
import { FILL_ALL_FIELDS_MESSAGE } from '../../constants/messages'
import ButtonDun from '../ui/buttons/ButtonDun'

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
    <div className='flex h-fit w-1/2'>
      <div className='flex flex-col flex-1 font-monaspace text-lg'>
        <div className='ml-8 mt-5'>
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
        <div className='flex flex-col justify-center items-center p-6  font-monaspace text-xs'>
          <div className='w-full h-full'>
            We sent an email to <span className='text-[#8379BD]'>{email}</span> to verify.
          </div>
          <div className='w-full mt-1'>Please click on the "Verify email" button to continue.</div>
          <div className='mt-9'>
            <p className='font-semibold mb-3'> Not seeing the email? </p>
            <p>Please check your spam folder, resend email or contact us at dun@gmail.co.</p>
          </div>
        </div>
        <div className='p-1 border-t-1 divide-gray-border'>
          <button
            onClick={() => setTab('login')}
            className='h-[35px] w-full bg-[#8279BD] text-white font-monaspace cursor-pointer'
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
        <div className='w-full px-5 py-3 border-b-1 font-monaspace text-sm'>
          Please enter your email address.
        </div>
        <div className='flex border-b-1 font-monaspace'>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className='ml-7 my-3 outline-none w-full pr-3'
            placeholder='Email'
            type='email'
          />
        </div>
        <div className='p-1 border-b-1 divide-gray-border'>
          <button
            onClick={() => forgotPassword(email)}
            className='h-[35px] w-full bg-[#8279BD] text-white font-monaspace hover:cursor-pointer'
          >
            {isLoading ? <Loader color='rgba(255, 255, 255, 1)' /> : 'Reset password'}
          </button>
        </div>
        <div
          onClick={() => setTab('login')}
          className='mt-5 w-full text-center font-monaspace text-[#8279BD] cursor-pointer'
        >
          Back to log in
        </div>
      </>
    )
  }

  return (
    <>
      <div className='flex border-b-1 font-monaspace'>
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          className='ml-7 my-3 outline-none w-full pr-3'
          placeholder='Email'
          type='email'
        />

        {tab === 'signup' && (
          <span className='border-l-1 w-full'>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              className='ml-7 my-3 outline-none'
              placeholder='Name'
            />
          </span>
        )}
      </div>
      <div className='flex items-center'>
        <input
          className='ml-7 my-3 outline-none w-full font-monaspace'
          placeholder='Password'
          type={isPassHidden ? 'password' : 'text'}
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <div
          className='mr-12 flex items-center cursor-pointer'
          onClick={() => setPassHidden((p) => !p)}
        >
          {isPassHidden ? <HideIcon /> : <UnhideIcon />}
        </div>
      </div>
      <div className='h-14 border-t-1 divide-gray-border'>
        <ButtonDun onClick={tab === 'signup' ? signUp : login}>
          {isLoading ? (
            <Loader color='rgba(255, 255, 255, 1)' />
          ) : tab === 'signup' ? (
            'Continue'
          ) : (
            'Log in'
          )}
        </ButtonDun>
      </div>
      <button
        onClick={() => setTab('forgot')}
        className='flex w-full items-center justify-end px-5 border-t-1 pt-1 divide-gray-border font-monaspace bg-transparent cursor-pointer text-[#8279BD]'
      >
        Forgot password?
      </button>
      <div className='flex w-full items-center justify-center font-monaspace'>or</div>
      <div className='flex justify-center gap-x-3 font-medium text-[#47444F]'>
        <button
          className='flex px-4 py-2 border bg-white justify-center items-center gap-x-2 hover:cursor-pointer z-50'
          onClick={signInWithGoogle}
        >
          <GoogleLogo />
          Continue with Google
        </button>
        {/* <button className='px-4 bg-white border flex justify-center items-center gap-x-2 hover:cursor-pointer'>
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
        <div className='flex-1  border-l-1 h-full'>
          <div className='w-full h-[54px] flex items-center text-xl pl-7 font-monospace border-b-1 divide-gray-border font-monaspace'>
            {isVerification
              ? 'Email verification'
              : isSignUp
              ? 'Create an account'
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
