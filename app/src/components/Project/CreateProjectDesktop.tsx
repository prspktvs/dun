import { Tabs, Button, Textarea } from '@mantine/core'
import { useState } from 'react'

import { IProject } from '../../types/Project'
import { createProject } from '../../services'
import { useAuth } from '../../context/AuthContext'
import { IUser } from '../../types/User.d.ts'
import Logo from '../ui/Logo'

interface ICreateProjectProps {
  projectId: string
}

const CreateProjectDesktop = (props: ICreateProjectProps) => {
  const [activeTab, setActiveTab] = useState<string>('first')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const isTitleEmpty = title.length === 0

  const { user } = useAuth()

  const onContinue = () => setActiveTab('second')

  const onCreate = async () => {
    const project: Partial<IProject> = {
      id: props.projectId,
      title,
      description,
      users: [user as IUser],
      tags: tags.map((tag) => tag.toLowerCase()),
    }
    const res = await createProject(project)
  }

  const handleInputChange = ({ target }) => {
    const { name, value } = target
    if (name === 'title') return setTitle(value)
    setDescription(value)
  }

  return (
    <div className='md:h-screen md:w-screen flex flex-col md:grid md:grid-cols-4 md:grid-rows-4 md:divide-x-[1px] md:divide-y-[1px] md:divide-borders-gray'>
      <div className='h-[60px] pl-4 pr-[15px] bg-[#edebf3] w-full text-black border-b flex justify-start items-center'>
        <Logo />
      </div>
      <>
        <div className='hidden md:block' />
        <div className='hidden md:col-span-2 md:block' />
        <div className='hidden md:block' />
        <div className='hidden md:row-span-2 md:block' />
        <div className='hidden md:row-span-2 md:block' />
        <div className='hidden md:block' />
        <div className='hidden md:col-span-2 md:block' />
        <div className='hidden md:block' />
        <div className='hidden md:block' />
        <div className='hidden md:block' />
        <div className='hidden md:block' />
        <div className='hidden md:block' />
        <div className='hidden md:block' />
        <div className='hidden md:block' />
      </>
      <Tabs
        className='col-start-2 col-end-4 row-start-2 row-end-4 md:p-7'
        color='white'
        defaultValue='first'
        value={activeTab}
        onChange={setActiveTab}
      >
        <Tabs.Panel value='first' className='flex flex-col'>
          <div className='flex-1'>
            <textarea
              className='block resize-none align-middle text-2xl font-monaspace border-none w-full placeholder-slate-400 text-[#47444F] pl-4 pr-[15px] pt-8 md:pb-6 '
              placeholder='Type new project title'
              value={title}
              name='title'
              onChange={handleInputChange}
            ></textarea>

            <textarea
              className='resize-none mt-6 text-sm font-monaspace border-none w-full h-[188px] pl-4 placeholder-slate-400 text-[#47444F] leading-tight'
              placeholder='Description'
              value={description}
              name='description'
              onChange={handleInputChange}
            ></textarea>
          </div>
          <Button
            className='flex h-12 mt-6 font-thin text-white font-monaspace'
            fullWidth
            radius={0}
            variant='filled'
            color='#8279bd'
            onClick={onCreate}
            disabled={isTitleEmpty}
          >
            Dun
          </Button>
        </Tabs.Panel>
      </Tabs>
    </div>
  )
}

export default CreateProjectDesktop
