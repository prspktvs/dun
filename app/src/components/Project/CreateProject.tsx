import { Tabs, Button, Textarea, TagsInput } from '@mantine/core'
import { useState } from 'react'

import { IProject } from '../../types/Project'
import { createProject } from '../../services'
import { useAuth } from '../../context/AuthContext'
import { IUser } from '../../types/User.d.ts'
import Logo from '../ui/Logo'

interface ICreateProjectProps {
  projectId: string
}

const CreateProject = (props: ICreateProjectProps) => {
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
    <div className='h-screen w-screen flex flex-col md:grid md:grid-cols-4 md:grid-rows-4 md:divide-x-[1px] md:divide-y-[1px] md:divide-gray-border '>
      <div className='h-[60px] pl-4 pr-[15px] bg-[#edebf3] w-full text-black  border-b flex justify-start items-center '>
        <Logo />
      </div>
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
      <Tabs
        className='col-start-2 col-end-4 row-start-2 row-end-4 md:p-7'
        color='gray'
        defaultValue='first'
        value={activeTab}
        onChange={setActiveTab}
      >
        <Tabs.Panel value='first'>
          <textarea
            className='block resize-none align-middle text-2xl font-monaspace border-none w-full placeholder-slate-400 text-[#47444F]pl-4 pr-[15px] pt-8 pb-6 '
            placeholder='Type new project title'
            value={title}
            name='title'
            onChange={handleInputChange}
          ></textarea>

          <textarea
            className='resize-none mt-6 text-sm font-monaspace border-none w-full h-[188px] placeholder-slate-400 text-[#47444F] leading-tight'
            placeholder='Description'
            value={description}
            name='description'
            onChange={handleInputChange}
          ></textarea>
          <Button
            className='mt-6 font-monaspace font-thin text-[#A3A1A7] h-12'
            fullWidth
            radius={0}
            variant='filled'
            color='#343434'
            onClick={onCreate}
            disabled={isTitleEmpty}
          >
            Create
          </Button>
        </Tabs.Panel>
      </Tabs>
    </div>
  )
}

export default CreateProject
