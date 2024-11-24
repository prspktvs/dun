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
    <div className='h-screen w-screen sm:grid sm:grid-cols-8 sm:grid-rows-12 sm:divide-x-[1px] sm:divide-y-[2px] flex flex-col'>
      <div className='hidden row-span-2 sm:row-span-3 sm:block' />
      <div className='hidden col-span-3 row-span-2 sm:row-span-3 sm:block' />
      <div className='hidden col-span-3 row-span-2 sm:row-span-3 sm:block' />
      <div className='hidden row-span-2 sm:row-span-3 sm:block' />

      <div />
      <div className='col-start-2 col-end-8 row-start-3 row-end-3 sm:row-start-4 sm:row-end-4 w-full bg-[#EDEBF3] h-[60px] sm:h-auto flex items-center pl-7 border-b divide-gray-border'>
        <Logo className='w-[80px] h-[32px]' />
      </div>
      <div />

      <div className='hidden row-span-7 sm:row-span-5 sm:block' />
      <div className='col-start-2 col-end-8 row-start-4 row-end-11 sm:row-start-5 sm:row-end-10 '>
        <AuthTabs tab={tab} setTab={setTab} />
      </div>
      <div className='hidden row-span-7 sm:row-span-5 sm:block' />

      <div className='hidden row-span-2 sm:row-span-3 sm:block' />
      <div className='hidden col-span-3 row-span-2 sm:row-span-3 sm:block' />
      <div className='hidden col-span-3 row-span-2 sm:row-span-3 sm:block' />
      <div className='hidden row-span-2 sm:row-span-3 sm:block' />
    </div>
  )
}
