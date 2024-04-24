import { genId } from '../../../utils'


function DualSectionBox({ title, desc, btnTitle }: {title: string, desc: string, btnTitle: string}) {
  const onCreateProject = () => window.location.href = `/${genId()}`

  return (
    <div className='ml-[550px] flex flex-col border-t-2 border-l-2 border-black bg-paper'>
      <p className='text-4xl uppercase leading-10 ml-5 '>{title}</p>

      <div className='grid grid-cols-2 items-center border-t-2 border-black gap-x-2.5 '>
        <p className='text-md w-full h-[68px] m-5 font-monaspace'>{desc}</p>

        <button className='bg-black w-[330px] h-[52px] m-5 text-white text-center text-sm lowercase justify-self-end font-monaspace hover:cursor-pointer hover:bg-gray-800' onClick={onCreateProject}>
          {btnTitle}
        </button>
      </div>
    </div>
  )
}

export default DualSectionBox
