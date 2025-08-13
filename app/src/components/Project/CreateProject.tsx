import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import clsx from 'clsx'
import React from 'react'
import { Button } from '@mantine/core'

import { useBreakpoint } from '../../hooks/useBreakpoint'
import { useAuth } from '../../context/AuthContext'
import { createProject } from '../../services'
import Logo from '../ui/Logo'
import { ROUTES } from '../../constants'
import { ITeamMember } from '../../types/User'
import { generateInviteLink } from '../../utils'
import { IProject } from '../../types/Project'

interface ICreateProjectProps {
  projectId: string
}

interface ProjectFormProps {
  title: string
  description: string
  visibility: 'private' | 'public'
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>,
  ) => void
  onToggleVisibility: () => void
  onCreate: () => void
  goToDashboard?: () => void
  isNewUser?: boolean
  isTitleEmpty: boolean
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  title,
  description,
  visibility,
  handleInputChange,
  onToggleVisibility,
  onCreate,
  goToDashboard,
  isNewUser,
  isTitleEmpty,
}) => {
  return (
    <form className='flex flex-col flex-1 h-full '>
      <div className='flex-1'>
        <input
          className='block resize-none align-middle text-2xl font-monaspace border-none w-full placeholder-slate-400 text-[#47444F] pl-4 pr-[15px] pt-8 mb-3'
          placeholder='Type new project title'
          value={title}
          name='title'
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !isTitleEmpty) {
              e.preventDefault()
              onCreate()
            }
          }}
        ></input>

        <textarea
          className='resize-none text-sm font-monaspace border-none w-full min-h-20 pl-4 placeholder-slate-400 text-[#47444F] leading-tight'
          placeholder='Description'
          value={description}
          name='description'
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !isTitleEmpty) {
              e.preventDefault()
              onCreate()
            }
          }}
        ></textarea>
        <div className='pl-4 mt-4'>
          <div className='text-sm font-monaspace mb-1'>Visibility</div>
          <div className='flex items-center gap-3'>
            <span className='text-sm'>{visibility === 'public' ? 'Public' : 'Private'}</span>
            <button
              type='button'
              aria-label='Toggle visibility'
              onClick={onToggleVisibility}
              className={clsx(
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                visibility === 'public' ? 'bg-[#8379BD]' : 'bg-gray-300',
              )}
            >
              <span
                className={clsx(
                  'absolute  h-5 w-5 rounded-full bg-white transition-all duration-200',
                  visibility === 'public' ? 'right-1' : 'left-1',
                )}
              />
            </button>
          </div>
          <div className='text-xs text-gray-500 mt-1'>
            {visibility === 'public'
              ? 'Anyone with the link can view'
              : 'Only invited members can access'}
          </div>
        </div>
      </div>
      <div className='flex flex-col h-full items-end gap-3 md:flex-row'>
        {!isNewUser && goToDashboard && (
          <Button
            className='mt-6 font-monaspace font-thin text-[#47444F] h-12 border-[#47444F] hover:text-[#47444F]'
            fullWidth
            radius={0}
            color='#47444F'
            variant='outline'
            onClick={goToDashboard}
          >
            Cancel
          </Button>
        )}
        <Button
          type='button'
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
    </form>
  )
}

export const CreateProject = (props: ICreateProjectProps) => {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [visibility, setVisibility] = useState<'private' | 'public'>('private')
  const { isMobile } = useBreakpoint()
  const { user } = useAuth()
  const isNewUser = !(user as any)?.lastProjectId

  const goToDashboard = () => navigate(ROUTES.DASHBOARD)

  const onCreate = async () => {
    const inviteUrl = generateInviteLink(props.projectId)
    const project: Partial<IProject> = {
      id: props.projectId,
      title: title.trim(),
      description,
      users: [{ ...user, role: 'owner' } as ITeamMember],
      tags: [],
      inviteUrl,
      visibility,
    }
    await createProject(project)
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    if (name === 'title') return setTitle(value)
    if (name === 'description') return setDescription(value)
    if (name === 'visibility') return setVisibility(value as 'private' | 'public')
  }

  return (
    <div
      className={clsx(
        isMobile
          ? 'flex flex-col justify-between h-screen'
          : 'md:h-screen md:w-screen flex flex-col md:grid md:grid-cols-4 md:grid-rows-4 md:divide-x-[1px] md:divide-y-[1px] md:divide-borders-gray',
      )}
    >
      {isMobile ? (
        <>
          <div>
            <div className='py-[14px] bg-[#edebf3] text-black border-b flex pl-4 items-center'>
              <Logo />
            </div>
            <div className='pl-4 pr-[15px] mt-8'>
              <ProjectForm
                title={title}
                description={description}
                visibility={visibility}
                handleInputChange={handleInputChange}
                onToggleVisibility={() =>
                  setVisibility((v) => (v === 'public' ? 'private' : 'public'))
                }
                onCreate={onCreate}
                goToDashboard={goToDashboard}
                isTitleEmpty={title.length === 0}
              />
            </div>
          </div>
        </>
      ) : (
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
          <div className='col-start-2 col-end-4 row-start-2 row-end-4 md:p-7'>
            <ProjectForm
              title={title}
              description={description}
              visibility={visibility}
              handleInputChange={handleInputChange}
              onToggleVisibility={() =>
                setVisibility((v) => (v === 'public' ? 'private' : 'public'))
              }
              onCreate={onCreate}
              goToDashboard={goToDashboard}
              isNewUser={isNewUser}
              isTitleEmpty={title.length === 0}
            />
          </div>
        </>
      )}
    </div>
  )
}
