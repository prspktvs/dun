import React from 'react'

function Section2() {
  return (
    <>
      <div className='h-[433px] grid grid-cols-2 w-full'>
        <div className=" flex justify-center items-center border-black border-t-2 border-r-2 bg-[url('./Rectangles.svg')] bg-no-repeat bg-cover">
          <p className='w-[330px] text-sm'>
            DUN gives each project its own space. Easy and efficient!
          </p>
        </div>
        <div className='bg-[#C5D4D2] flex justify-center items-center border-t-2 border-black'>
          <img className='w-[499px] h-[342px]' src='./image 131.jpg' />
        </div>
      </div>
      <div className='h-[433px] grid grid-cols-2 w-full'>
        <div className='bg-[#CBB9CF] flex justify-center items-center border-r-2 border-t-2 border-black'>
          <img className='w-[499px] h-[342px]' src='./image 132.jpg' />
        </div>
        <div className="flex justify-center items-center border-black bg-[url('./Squares.svg')] bg-no-repeat bg-cover border-t-2 ">
          <p className='w-[330px] text-sm'>
            One topic equals one neat spot for all files and info related to that case. <br />
            <br />
            P.S.Courtesy of DUN.
          </p>
        </div>
      </div>
      <div className='h-[433px] grid grid-cols-2 w-full'>
        <div className="flex justify-center items-center border-t-2 border-r-2 border-black bg-[url('./Lines.svg')] bg-no-repeat bg-cover">
          <p className='w-[330px] text-sm'>
            DUN gives each project its own space. Easy and efficient!
          </p>
        </div>
        <div className='bg-[#F5CBBC] flex justify-center items-center border-t-2 border-black'>
          <img className='w-[499px] h-[342px]' src='./image 133.jpg' />
        </div>
      </div>
      <div className='h-[433px] grid grid-cols-2 w-full'>
        <div className='bg-[#FFF5D2] flex justify-center items-center border-r-2 border-t-2 border-black'>
          <img className='w-[499px] h-[342px]' src='./image 134.jpg' />
        </div>
        <div className="flex justify-center items-center border-t-2 border-black bg-[url('./Plaid.svg')] bg-no-repeat bg-cover">
          <p className='w-[330px] text-sm'>
            Enjoy a clear and simple interface with DUN. No fuss, just straightforward ease!
          </p>
        </div>
      </div>
    </>
  )
}

export default Section2
