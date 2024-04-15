import React from 'react'

function DualSectionBox({title, desc, btnTitle}) {
  return (
    <div className='ml-[550px] flex flex-col border-t-2 border-l-2 border-black bg-[#FAF9F6]'>
      <p className='text-4xl uppercase leading-10 ml-5'>{title}</p>

      <div className='flex items-center border-t-2 border-black'>
        <p className='text-sm ml-5 w-[468px] h-[54px] mr-3.5'>
          {desc}
        </p>

        <div className='bg-black w-[330px] mr-8'>
          <p className='text-white text-center text-sm lowercase'>{btnTitle}</p>
        </div>
      </div>
    </div>
  )
}

export default DualSectionBox
