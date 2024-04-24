import React from 'react'

import Logo from '../../components/ui/Logo'

function Footer() {
  return (
    <>
      <div className='flex h-[361px] bg-[#C5D4D2] flex-col '>
        <div className='flex justify-around border-b-2  border-black'>
          <div className='flex-1 my-5 ml-5'>
            <Logo />
          </div>
          <div className='border-l-2 border-r-2 border-black flex-1'>
            <p className='m-5'>Dun@gmail.com</p>
          </div>
          <div className='flex-1'>
            <p className='m-5'>+358 942 550 354</p>
          </div>
        </div>

        <div className='flex justify-around border-b-2 border-t-2 border-black my-16 '>
          <p className='flex-1 w-full text-xl ml-5 uppercase flex-1'>
            Got Questions, Buddy? Ask Away!
          </p>

          {/* ////////////////// */}
          <div className='border-l-2 border-r-2  border-black flex-1 flex-col flex'>
            <div className='border-b-2 border-black'>
              <input className='bg-[#C5D4D2] m-5' type='text' placeholder='name' />
            </div>
            <div>
              <input className='bg-[#C5D4D2] m-5' type='text' placeholder='message' />
            </div>
          </div>
          {/* /////////////////////// */}
          <div className='flex-1 flex-col flex'>
            <div>
              <input className='bg-[#C5D4D2] m-5' type='text' placeholder='email' />
            </div>
            <div className='text-center border-t-2  border-black'>
              <button className='w-[410px] h-[52px] bg-black text-white my-2.5 font-monaspace'>
                shoot your message to dun
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Footer
