import { Tabs, Button, Textarea } from '@mantine/core'
import { useState } from 'react'
import { IProject } from '../../types/Project'
import { createProject } from '../../services/project'

interface ICreateProjectProps {
  projectId: string
}

const CreateProject = (props: ICreateProjectProps) => {
  const [activeTab, setActiveTab] = useState<string>('first')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')

  const onContinue = () => setActiveTab('second')

  const onCreate = async () => {
    const project: Partial<IProject> = {
      id: props.projectId,
      title,
      description,
      tags: tags.split(',').map((tag) => tag.trim().toLowerCase()),
    }

    const res = await createProject(project)
    window.location.reload(false)
  }

  return (
    <div className='h-screen w-screen flex items-center justify-center'>
      <Tabs color='gray' defaultValue='first' value={activeTab} onChange={setActiveTab}>
        <Tabs.List grow>
          <Tabs.Tab value='first'>1</Tabs.Tab>
          <Tabs.Tab value='second'>2</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value='first' className='w-[600px] h-[300px]'>
          <input
            className='block mt-10 align-middle text-[32px] outline-none'
            placeholder='Type project name'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className='block mt-1 align-middle text-[20px] outline-none'
            placeholder='Description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button
            className='mt-20'
            fullWidth
            radius={0}
            variant='filled'
            color='#464646'
            onClick={onContinue}
          >
            Continue
          </Button>
        </Tabs.Panel>

        <Tabs.Panel value='second' className='w-[600px] h-[300px]'>
          <Textarea
            size='md'
            className='mt-20'
            minRows={6}
            radius='xs'
            label='Add tags'
            placeholder='Input placeholder'
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
          <Button
            className='mt-20'
            fullWidth
            radius={0}
            variant='filled'
            color='#464646'
            onClick={onCreate}
          >
            Dun
          </Button>
        </Tabs.Panel>
      </Tabs>
    </div>
  )
}

export default CreateProject
