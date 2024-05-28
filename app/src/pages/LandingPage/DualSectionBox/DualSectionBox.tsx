import { genId } from '../../../utils'

function DualSectionBox({
  title,
  desc,
  btnTitle,
}: {
  title: string
  desc: string
  btnTitle: string
}) {
  const onCreateProject = () => (window.location.href = `/${genId()}`)

  return (
    <div className='md:ml-[80px] lg:ml-[300px]  md:border-l-2  sm:border-l-0 flex flex-col md:border-t-2  border-black bg-paper '>
      <p className='text-4xl uppercase leading-10 ml-5 sm:mb-0 md:mb-6'>{title}</p>

      <div className='grid lg:grid-cols-2 items-center lg:border-t-2 border-black lg:gap-x-2.5 sm:border-t-0'>
        <p className='sm:w-10/12 text-sm sm:w-full h-[68px] m-5 font-monaspace md:w-11/12'>
          {desc}
        </p>

        <button
          className='sm:mt-0 bg-black lg:w-[330px] sm:w-11/12 h-[52px] m-5 text-white text-center text-sm lowercase lg:justify-self-end font-monaspace hover:cursor-pointer hover:bg-gray-800'
          onClick={onCreateProject}
        >
          {btnTitle}
        </button>
      </div>
    </div>
  )
}

export default DualSectionBox
