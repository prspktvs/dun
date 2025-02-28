import React, { useEffect, useState } from 'react'
import { Button } from '@mantine/core'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'
import { AuthTabs } from '../../components/Auth'
import Logo from '../../components/ui/Logo'
import { logAnalytics } from '../../utils/analytics'
import { ANALYTIC_EVENTS } from '../../constants'

export type Tab = 'login' | 'signup' | 'forgot'

export default function AuthPage() {
  const [tab, setTab] = useState<Tab>('login')
  const { isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    logAnalytics(ANALYTIC_EVENTS.PAGE_OPEN, { page: 'login' })
  }, [])

  useEffect(() => {
    if (!isAuthenticated || loading) return

    navigate(-1)
  }, [isAuthenticated, loading])

  return (
    <div className='h-screen w-screen sm:grid sm:grid-cols-8 sm:grid-rows-12 sm:divide-x-[1px] sm:divide-y-[2px] flex flex-col'>
      <div className='hidden sm:row-span-2 sm:block' />
      <div className='hidden col-span-3 sm:row-span-2 sm:block' />
      <div className='hidden col-span-3 sm:row-span-2 sm:block' />
      <div className='hidden sm:row-span-2 sm:block' />

      <div />
      <div className='col-start-2 col-end-8 sm:row-start-3 sm:row-end-3 w-full bg-[#EDEBF3] h-[60px] sm:h-auto flex items-center pl-7 border-b divide-borders-gray'>
        <Logo className='w-[80px] h-[32px]' />
      </div>
      <div />

      <div className='hidden sm:row-span-7 sm:block' />
      <div className='col-start-2 col-end-8 sm:row-start-4 sm:row-end-11 '>
        <AuthTabs tab={tab} setTab={setTab} />
      </div>
      <div className='hidden sm:row-span-7 sm:block' />

      <div className='hidden sm:row-span-2 sm:block' />
      <div className='hidden col-span-3 sm:row-span-2 sm:block' />
      <div className='hidden col-span-3 sm:row-span-2 sm:block' />
      <div className='hidden sm:row-span-2 sm:block' />
    </div>
  )
}
