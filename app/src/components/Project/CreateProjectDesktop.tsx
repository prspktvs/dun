import { Tabs, Button, Textarea } from '@mantine/core'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'

import { IProject } from '../../types/Project'
import { createProject, getAllUserProject } from '../../services'
import { useAuth } from '../../context/AuthContext'
import { IUser } from '../../types/User.d.ts'
import Logo from '../ui/Logo'

interface ICreateProjectProps {
  projectId: string
}

const CreateProjectDesktop = (props: ICreateProjectProps) => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<string>('first')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [projects, setProjects] = useState<IProject[]>([])
  const isTitleEmpty = title.length === 0
  const { user } = useAuth()
  const isNewUser = !user?.lastProjectId

  useEffect(() => {
    if (!user) return
    getAllUserProject(user.id).then((data) => setProjects(data as IProject[]))
  }, [user?.id])

  const goToDashboard = () => navigate('/dashboard')

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
          <div className='flex gap-3'>
            {!isNewUser && (
              <Button
                className='mt-6 font-monaspace font-thin text-[#47444F] h-12 border-[#47444F] hover:text-[#47444F]'
                fullWidth
                radius={0}
                variant='outline'
                onClick={goToDashboard}
              >
                Cancel
              </Button>
            )}
            <Button
              className={clsx(
                'mt-6 font-monaspace font-thin h-12',
                isTitleEmpty ? 'text-[#A3A1A7]' : 'text-white',
              )}
              fullWidth
              radius={0}
              variant='filled'
              color='#8379BD'
              onClick={onCreate}
              disabled={isTitleEmpty}
            >
              Dun
            </Button>
          </div>
        </Tabs.Panel>
      </Tabs>
    </div>
  )
}

export default CreateProjectDesktop
