import React from 'react'

import ButtonDun from '../components/ui/buttons/ButtonDun'

export const NotFound = () => {
  const goToDashboard = () => {
    window.location.href = '/dashboard'
  }

  return (
    <div className='h-screen w-screen grid grid-cols-1 grid-rows-1 md:grid-cols-8 md:grid-rows-4 relative bg-gray-50 divide-x-1 divide-y-1 divide-borders-purple '>
      <div />
      <div className='md:col-span-3 md:row-span-1' />
      <div className='md:col-span-3 md:row-span-1' />
      <div />

      <div className='md:row-span-2' />
      <div className='flex justify-center items-center p-6 md:col-span-3 md:row-span-2'>
        <div className='relative'>
          <img src='/assets/images/not-found.png' className='h-full w-full select-none' />
        </div>
      </div>
      <div className='flex flex-col justify-between p-6  md:col-span-3  md:row-span-2'>
        <div>
          <h1 className='text-4xl font-bold text-gray-700 mb-10 font-monaspace'>WTF?</h1>
          <p className='text-lg text-gray-600 mb-10 font-monaspace'>
            Lost page detected? Are you kidding me?
          </p>
        </div>
        <div className='h-14'>
          <ButtonDun onClick={goToDashboard}>Okay, take me back to my projects!</ButtonDun>
        </div>
      </div>
      <div className='md:row-span-2' />

      <div />
      <div className='md:col-span-3 md:row-span-1' />
      <div className='md:col-span-3 md:row-span-1' />
      <div />
    </div>
  )
}
