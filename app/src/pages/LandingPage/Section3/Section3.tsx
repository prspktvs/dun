import React from 'react'
import BoxInformatinSection3 from './BoxInformatinSection3'
import DualSectionBox from '../DualSectionBox/DualSectionBox'

function Section3() {
  return (
    <>
      <div className='w-full h-[760px] flex justify-between flex-col '>
        <div className='flex justify-around items-center mt-[79px] '>
          <img src='./Frame 731.jpg' />
          <div className='border-t-2 border-l-2 border-r-2'>
            <BoxInformatinSection3 />
            <BoxInformatinSection3 />
            <BoxInformatinSection3 />
            <BoxInformatinSection3 />
            <BoxInformatinSection3 />
          </div>
          <img src='./Frame 731.jpg' />
        </div>
        <DualSectionBox />
      </div>
    </>
  )
}

export default Section3
