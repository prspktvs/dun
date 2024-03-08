import { Tabs, Button, Textarea, TagsInput } from '@mantine/core'
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
  const [tags, setTags] = useState<string[]>([])

  const onContinue = () => setActiveTab('second')

  const onCreate = async () => {
    const project: Partial<IProject> = {
      id: props.projectId,
      title,
      description,
      tags: tags.map((tag) => tag.toLowerCase()),
    }
    const res = await createProject(project)
    // window.location.reload(false)
  }

  return (
    <div className='h-screen w-screen grid grid-cols-3 grid-rows-3 divide-x-[1px] divide-y-[1px] divide-gray-border'>
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <Tabs
        className='col-start-2 row-start-2 col-end-2 row-end-2 p-5 '
        color='gray'
        defaultValue='first'
        value={activeTab}
        onChange={setActiveTab}
      >
        <Tabs.List grow>
          <Tabs.Tab value='first'>1</Tabs.Tab>
          <Tabs.Tab value='second'>2</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value='first' className='w-[600px] h-[300px]'>
          <input
            className='block mt-10 align-middle text-[32px] font-monaspace border-none'
            placeholder='Type project name'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className='block mt-1 align-middle text-[20px] font-monaspace border-none'
            placeholder='Description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button
            className='mt-20 font-monaspace font-thin'
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
          <TagsInput
            className='font-monaspace mt-5'
            label='Add tags'
            value={tags}
            onChange={setTags}
            placeholder='Enter tag'
          />

          <Button
            className='mt-10 font-thin font-monaspace'
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
