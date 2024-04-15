import React from 'react'
import BoxInformatinSection3 from './BoxInformatinSection3'
import DualSectionBox from '../DualSectionBox/DualSectionBox'

function Section3() {
  return (
    <>
      <div className="w-full h-[760px] flex justify-between flex-col  bg-[url('./bgSection3.svg')] bg-no-repeat bg-cover border-t-2  ">
        <div className='flex justify-around items-center mt-[79px] '>
          <img src='./leftMouse.svg' />
          <div className='border-t-2 border-l-2 border-r-2 border-black'>
            <BoxInformatinSection3
              firstMessage={'Hey buddy, ever find yourself lost in the chaos of 50 open tabs?'}
              secondMessage={'Let DUN set you free from the focus-switching tab dance'}
            />
            <BoxInformatinSection3
              firstMessage={'Exhausted from monthly bills?'}
              secondMessage={"DUN's got an all-in-one solution at a great price!"}
            />
            <BoxInformatinSection3
              firstMessage={'Missing key info?'}
              secondMessage={"DUN's got your back with a global search!"}
            />
            <BoxInformatinSection3
              firstMessage={'Drowning in notifications from various sources?'}
              secondMessage={"With DUN, you won't miss the important ones!"}
            />
            <BoxInformatinSection3
              firstMessage={'Tired of a broken phone and copy-paste headaches?'}
              secondMessage={'Just send one link with all the goods!'}
            />
          </div>
          <img src='./rightMouse.svg' />
        </div>
        <DualSectionBox
          title={'Hey pal, consider it solved!'}
          desc={
            'During our research, the team pinpointed a list of challenges tied to existing services. We made these hurdles the foundation of our design principles and crafted a revamped product.'
          }
          btnTitle={'check it!'}
        />
      </div>
    </>
  )
}

export default Section3
