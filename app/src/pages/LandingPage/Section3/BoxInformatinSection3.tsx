import React from 'react'

function BoxInformatinSection3({ firstMessage, secondMessage }) {
  return (
    <>
      <div>
        <div className='w-[781px] h-[81px] flex justify-around items-center border-b-2 border-black bg-[#FAF9F6]'>
          <p className='w-[310px] text-sm'>{firstMessage}</p>
          <svg
            width='41'
            height='7'
            viewBox='0 0 41 7'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              id='Arrow 4'
              d='M40.5 3.5L35.5 6.38675V0.613249L40.5 3.5ZM0.5 3L36 3V4L0.5 4L0.5 3Z'
              fill='#25222C'
            />
          </svg>
          <p className='w-[310px] text-sm'>{secondMessage}</p>
        </div>
      </div>
    </>
  )
}

export default BoxInformatinSection3
