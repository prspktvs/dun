import React from 'react'
import Logo from '../../../components/ui/Logo'

function Footer() {
  return (
    <>
      <div className='flex h-[361px] bg-[#C5D4D2] flex-col '>
        <div className='flex justify-around border-b-2  border-black'>
          <div className='flex-1 m-5'>
            <Logo />
          </div>
          <div className='border-l-2 border-r-2  border-black flex-1 '>
            <p className='m-5'>Dun@gmail.com</p>
          </div>
          <div className='flex-1'>
            <p className='m-5'>+358 942 550 354</p>
          </div>
        </div>

        <div className='flex justify-around border-b-2 border-t-2 border-black my-16 '>
          <div className='flex-1'>
            <p className='flex-1 text-xl ml-5 uppercase'>Got Questions, Buddy? Ask Away!</p>
          </div>
          {/* ////////////////// */}
          <div className='border-l-2 border-r-2  border-black flex-1 flex-col flex'>
            <div className='w-full border-b-2 border-black'>
              <input className='bg-[#C5D4D2] m-5' type='text' placeholder='name' />
            </div>
            <div className=''>
              <input className='bg-[#C5D4D2] m-5' type='text' placeholder='message' />
            </div>
          </div>
          {/* /////////////////////// */}
          <div className='flex-1 flex-col flex'>
            <div>
              <input className='bg-[#C5D4D2] m-5' type='text' placeholder='email' />
            </div>
            <div className='w-full text-center border-t-2  border-black'>
              <button className='w-[380px] h-[52px] bg-black text-white my-2.5'>
                Shoot Your Message to DUN
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Footer
