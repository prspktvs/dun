import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Button } from '@mantine/core'
import { AuthTabs } from '../../components/Auth'
import Logo from '../../components/ui/Logo'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

export type Tab = 'login' | 'signup' | 'verification' | 'forgot'

export default function AuthPage() {
  const [tab, setTab] = useState<Tab>('login')
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!user) return

    navigate(-1) // return back to the previous page
  }, [user])

  return (
    <div className='h-screen w-screen grid grid-cols-8 grid-rows-12 divide-x-[1px] divide-y-[2px]'>
      <div className='row-span-3' />
      <div className='col-span-3 row-span-3' />
      <div className='col-span-3 row-span-3' />
      <div className='row-span-3' />
      <div />
      <div className='col-start-2 col-end-8 row-start-4 row-end-4 w-full bg-[#EDEBF3] h-full flex items-center pl-7 border-b-2 divide-gray-border'>
        <Logo />
      </div>
      <div />
      <div className='row-span-5' />
      <div className='col-start-2 col-end-8 row-start-5 row-end-10'>
        <AuthTabs tab={tab} setTab={setTab} />
      </div>
      <div className='row-span-5' />
      <div className='row-span-1' />
      <div className='col-span-3 row-span-3' />
      <div className='col-span-3 row-span-3' />
      <div className='row-span-3' />
    </div>
  )
}
