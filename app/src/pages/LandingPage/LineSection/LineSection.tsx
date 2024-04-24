import React from 'react'

function LineSection() {
  return (
    <div className='h-[120px] w-full border-t-2 bg-[#F5F0EB] border-b-2 border-t-2 border-[#25222C]'>
      <div>
        <svg width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'>
          <defs>
            <pattern id='stripes' patternUnits='userSpaceOnUse' width='40' height='20'>
              <line
                x1='0.5'
                y1='0'
                x2='0.5'
                y2='27'
                fill='none'
                stroke='#25222c'
                stroke-opacity='0.2'
              />
              <line
                x1='8.5'
                y1='0'
                x2='8.5'
                y2='16'
                fill='none'
                stroke='#25222c'
                stroke-opacity='0.2'
              />
              <line
                x1='16.5'
                y1='0'
                x2='16.5'
                y2='16'
                fill='none'
                stroke='#25222c'
                stroke-opacity='0.2'
              />
              <line
                x1='24.5'
                y1='0'
                x2='24.5'
                y2='16'
                fill='none'
                stroke='#25222c'
                stroke-opacity='0.2'
              />
              <line
                x1='32.5'
                y1='0'
                x2='32.5'
                y2='16'
                fill='none'
                stroke='#25222c'
                stroke-opacity='0.2'
              />
            </pattern>
          </defs>

          <rect width='100%' height='20' fill='url(#stripes)' />
        </svg>
      </div>
    </div>
  )
}

export default LineSection
