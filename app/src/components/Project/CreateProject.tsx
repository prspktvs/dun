import { Tabs, Button, Textarea, TagsInput } from '@mantine/core'
import { useState } from 'react'
import { IProject } from '../../types/Project'
import { createProject } from '../../services'

interface ICreateProjectProps {
  projectId: string
}

const CreateProject = (props: ICreateProjectProps) => {
  const [activeTab, setActiveTab] = useState<string>('first')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const isTitleEmpty = title.length === 0

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
  const handleInputChange = ({ target }) => {
    const { name, value } = target
    if (name === 'title') return setTitle(value)
    setDescription(value)
  }

  return (
    <div className='h-screen w-screen grid grid-cols-4 grid-rows-4 divide-x-[1px] divide-y-[1px] divide-gray-border'>
      <div />
      <div className='col-span-2' />
      <div />
      <div className='row-span-2' />
      <div className='row-span-2' />
      <div />
      <div className='col-span-2' />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <Tabs
        className='col-start-2 row-start-2 col-end-4 row-end-4 p-7'
        color='gray'
        defaultValue='first'
        value={activeTab}
        onChange={setActiveTab}
      >
        {/* <Tabs.List grow>
          <Tabs.Tab value='first'>1</Tabs.Tab>
          <Tabs.Tab value='second'>2</Tabs.Tab>
        </Tabs.List> */}

        {/* <Tabs.Panel ba value='first' className='w-[600px] h-[300px] '> */}
        <Tabs.Panel value='first'>
          {/* <input
            className='block align-middle text-xl font-monaspace border-none w-full placeholder-slate-400 text-[#47444F]'
            placeholder='Type new project title'
            value={title}
            name='title'
            // onChange={(e) => setTitle(e.target.value)}
            onChange={handleInputChange}
          /> */}
          <textarea
            className='block resize-none align-middle text-xl font-monaspace border-none w-full placeholder-slate-400 text-[#47444F]'
            placeholder='Type new project title'
            value={title}
            name='title'
            // onChange={(e) => setTitle(e.target.value)}
            onChange={handleInputChange}
          ></textarea>

          <textarea
            className='resize-none mt-6 text-sm font-monaspace border-none w-full h-[188px] placeholder-slate-400 text-[#47444F] leading-tight'
            placeholder='Description'
            value={description}
            name='description'
            // onChange={(e) => setDescription(e.target.value)}
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

        {/* <Tabs.Panel value='second' className='w-[600px] h-[300px]'>
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
        </Tabs.Panel> */}
      </Tabs>
    </div>
  )
}

export default CreateProject
