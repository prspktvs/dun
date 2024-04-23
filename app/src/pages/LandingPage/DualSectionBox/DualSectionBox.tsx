import React from 'react'

function DualSectionBox({ title, desc, btnTitle }) {
  return (
    <div className='ml-[550px] flex flex-col border-t-2 border-l-2 border-black bg-[#FAF9F6]'>
      <p className='text-4xl uppercase leading-10 ml-5 '>{title}</p>

      <div className='grid grid-cols-2 items-center border-t-2 border-black gap-x-2.5 '>
        <p className='text-sm w-[458px] h-[68px] m-5 font-["MonaspaceArgon"]'>{desc}</p>

        <button className='bg-black w-[330px] h-[52px] m-5 text-white text-center text-sm lowercase justify-self-end'>
          {btnTitle}
        </button>
      </div>
    </div>
  )
}

export default DualSectionBox
