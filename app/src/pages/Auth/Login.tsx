import React, { useEffect, useState } from 'react'
import { Button } from '@mantine/core'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'
import { AuthTabs } from '../../components/Auth'
import Logo from '../../components/ui/Logo'


export type Tab = 'login' | 'signup' | 'verification' | 'forgot'

export default function AuthPage() {
  const [tab, setTab] = useState<Tab>('login')
  const { isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!isAuthenticated || loading) return

    navigate(-1) // return back to the previous page
  }, [isAuthenticated, loading])

  return (
    <div className='h-screen w-screen grid grid-cols-8 grid-rows-12 divide-x-[1px] divide-y-[2px]'>
      <div className='row-span-2 h-md:row-span-3' />
      <div className='col-span-3 row-span-2 h-md:row-span-3' />
      <div className='col-span-3 row-span-2 h-md:row-span-3' />
      <div className='row-span-2 h-md:row-span-3' />

      <div />
      <div className='col-start-2 col-end-8 row-start-3 row-end-3 h-md:row-start-4 h-md:row-end-4 w-full bg-grayBg h-full flex items-center pl-7 border-b-1 divide-gray-border'>
        <Logo />
      </div>
      <div />

      <div className='row-span-7 h-md:row-span-5' />
      <div className='col-start-2 col-end-8 row-start-4 row-end-11 h-md:row-start-5 h-md:row-end-10'>
        <AuthTabs tab={tab} setTab={setTab} />
      </div>
      <div className='row-span-7 h-md:row-span-5' />

      <div className='row-span-2 h-md:row-span-3' />
      <div className='col-span-3 row-span-2 h-md:row-span-3' />
      <div className='col-span-3 row-span-2 h-md:row-span-3' />
      <div className='row-span-2 h-md:row-span-3' />
    </div>
  )
}
