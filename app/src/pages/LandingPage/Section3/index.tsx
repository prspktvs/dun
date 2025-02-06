import React from 'react'
import clsx from 'clsx'

import BoxInformatinSection3 from './BoxInformatinSection3'
import DualSectionBox from '../DualSectionBox/DualSectionBox'

import GridSvg from '/assets/landing/grid.svg'

import { DownArrow } from '../../../components/icons'

function Section3() {
  return (
    <>
      <div className='w-full h-[98px] p-5 bg-[#faf9f6] justify-between items-center inline-flex'>
        <div className="text-[#343434] text-5xl font-normal font-['National Park '] leading-[57.60px]">
          Get things DONE with DUN
        </div>
        <div className='text-[#343434] text-lg font-normal font-monaspace leading-[27px]'>
          Use internally and with your clients
        </div>
      </div>
      <div
        style={{ backgroundImage: `` }}
        className={clsx('w-full flex flex-col bg-no-repeat bg-cover bg-paper border-t-1')}
      >
        <div className='flex flex-col items-center justify-around'>
          <div className='flex justify-between w-full border-t-1'>
            <div className='relative flex items-center w-1/2'>
              <img
                src='./assets/landing/Cloud.svg'
                className='w-full translate-y-2 sm:mb-8 md:mb-0' // Добавлен класс translate-y-2 для смещения вниз на 2 пикселя и w-full для растяжения на всю ширину
              />
              <div className='absolute flex items-center justify-center w-full h-full'>
                <div className='text-[#555555] text-lg font-normal font-monaspace leading-[28.80px] text-left'>
                  <ul className='list-disc list-inside'>
                    <li>Software & design agencies</li>
                    <li>Freelancers & independent creators</li>
                    <li>Content creators</li>
                    <li>Social media managers & Digital marketing</li>
                  </ul>
                  <p className='my-2'>&nbsp;</p>
                  <ul className='list-disc list-inside'>
                    <li>Architects and interior designers</li>
                    <li>Fashion designers and apparel brands</li>
                    <li>Tutors & Students</li>
                    <li>Nonprofits and volunteer organizations</li>
                  </ul>
                  <p className='my-2'>&nbsp;</p>
                  <ul className='list-disc list-inside'>
                    <li>Startup teams</li>
                    <li>E-commerce businesses</li>
                    <li>Legal and financial advisory teams</li>
                    <li>Consultants & Specialists</li>
                    <li>Event & Project Planners</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className='flex items-center justify-center w-1/2 border-l border-black'>
              <img
                src='./assets/landing/relax.svg'
                className='w-full translate-y-2 sm:mb-8 md:mb-0'
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Section3
