import React from 'react'

import Logo from '../../components/ui/Logo'

function Footer() {
  return (
    <>
      <div className='flex md:h-[361px] bg-[#C5D4D2] flex-col '>
        <div className='flex justify-around border-b-2  border-black sm:flex-col md:flex-row'>
          <div className='flex-1 my-5 ml-5'>
            <Logo />
          </div>
          <div className='md:border-l-2 md:border-r-2 border-black flex-1'>
            <p className='m-5'>Dun@gmail.com</p>
          </div>
          <div className='flex-1'>
            <p className='m-5'>+358 942 550 354</p>
          </div>
        </div>

        <div className='flex justify-around border-b-2 border-t-2 border-black my-16 sm:flex-col md:flex-row '>
          <p className='flex-1 w-full text-xl ml-5 uppercase font-rubik'>
            Got Questions, Buddy? Ask Away!
          </p>

          {/* ////////////////// */}
          <div className='md:border-l-2 md:border-r-2  border-black flex-1 flex-col flex'>
            <div className='md:border-b-2 border-black sm:border-y-2 md:border-y-0'>
              <input className='bg-[#C5D4D2] m-5 font-monaspace' type='text' placeholder='name' />
            </div>
            <div>
              <input
                className='bg-[#C5D4D2] m-5 font-monaspace'
                type='text'
                placeholder='message'
              />
            </div>
          </div>
          {/* /////////////////////// */}
          <div className='flex-1 flex-col flex'>
            <div className='sm:border-t-2 md:border-t-0 border-black'>
              <input className='bg-[#C5D4D2] m-5 font-monaspace' type='text' placeholder='email' />
            </div>
            <div className='text-center border-t-2  border-black'>
              <button className='sm:w-[650px] md:w-[200px] lg:w-[410px] h-[52px] bg-black text-white my-2.5 font-monaspace hover:cursor-pointer hover:bg-gray-800'>
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
