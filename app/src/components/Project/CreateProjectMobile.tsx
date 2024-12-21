import { Button } from '@mantine/core'
import { useState } from 'react'

import { IProject } from '../../types/Project'
import { createProject } from '../../services'
import { useAuth } from '../../context/AuthContext'
import { IUser } from '../../types/User.d.ts'
import Logo from '../ui/Logo'

interface ICreateProjectProps {
  projectId: string
}

const CreateProjectMobile = ({ projectId }: ICreateProjectProps) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const isTitleEmpty = title.length === 0

  const { user } = useAuth()

  const onCreate = async () => {
    const project: Partial<IProject> = {
      id: projectId,
      title,
      description,
      users: [user as IUser],
      tags: tags.map((tag) => tag.toLowerCase()),
    }
    await createProject(project)
  }

  const handleInputChange = ({ target: { name, value } }) => {
    if (name === 'title') setTitle(value)
    else setDescription(value)
  }

  return (
    <div className='flex flex-col justify-between h-screen'>
      <div>
        <div className='py-[14px] bg-[#edebf3] text-black border-b flex pl-4 items-center'>
          <Logo />
        </div>
        <div className='pl-4 pr-[15px] mt-8'>
          <textarea
            className='h-[29px] text-2xl font-normal overflow-hidden font-monaspace border-none w-full placeholder-[#a3a1a7] text-[#46434e] resize-none'
            placeholder='Type new project title'
            value={title}
            name='title'
            onChange={handleInputChange}
          ></textarea>
          <textarea
            className='resize-none text-16 font-monaspace overflow-hidden border-none w-full placeholder-[#a3a1a7] text-[#46434e] leading-tight mt-6'
            placeholder='Description'
            value={description}
            name='description'
            onChange={handleInputChange}
            rows={1}
          ></textarea>
        </div>
      </div>
      <div className=' items-center justify-center p-1 bg-[#f9f9f9] border mb-3 mx-4'>
        <Button
          className='w-full h-12 font-thin text-white font-monaspace'
          fullWidth
          radius={0}
          variant='filled'
          color={isTitleEmpty ? '#969696' : '#8279bd'}
          onClick={onCreate}
         
        >
          Dun
        </Button>
      </div>
    </div>
  )
}

export default CreateProjectMobile
