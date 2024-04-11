import React from 'react'

function DualSectionBox() {
  return (
    <div className='ml-[550px] flex flex-col border-t-2 border-l-2'>
      <p className='text-4xl uppercase leading-10 ml-5'>Zero in on the important stuff</p>

      <div className='flex items-center border-t-2 '>
        <p className='text-sm ml-5 w-[468px] h-[54px] mr-3.5'>
          Hey buddy, count on DUN to make your life easier! We've smoothed out work processes and
          made team and customer communication a walk in the park for you.
        </p>

        <div className='bg-black w-[330px] mr-8'>
          <p className='text-white text-center text-sm lowercase'>Let's Dive In for free</p>
        </div>
      </div>
    </div>
  )
}

export default DualSectionBox
