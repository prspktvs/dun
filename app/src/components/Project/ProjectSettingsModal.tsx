import { Button, CopyButton, Popover, Text } from '@mantine/core'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { debounce, isEmpty } from 'lodash'
import { useNavigate, useParams } from 'react-router-dom'
import clsx from 'clsx'

import ButtonDun from '../ui/buttons/ButtonDun'
import { useProject } from '../../context/ProjectContext'
import AvatarDun from '../ui/Avatar'
import { DUN_URL, ROUTES } from '../../constants'
import { deleteProject, updateProject } from '../../services/project.service'
import { Modal } from '../ui/modals/Modal'
import { ITeamMember, UserRole } from '../../types/User'

const ROLE_OPTIONS = [
  { value: 'viewer', label: 'Viewer' },
  { value: 'editor', label: 'Editor' },
  { value: 'admin', label: 'Admin' },
  { value: 'owner', label: 'Owner' },
]

export function TeamMember({ user }: { user: ITeamMember }) {
  const { role, hasPermission } = useProject()

  return (
    <div className='my-2 ml-3 flex items-center gap-3'>
      <AvatarDun user={user} size={40} />
      <div className='flex flex-col flex-1'>
        <span className='text-base font-medium'>{user.name}</span>
        <span className='text-sm text-gray-500'>{user.email}</span>
      </div>
      {/* <Select
        value={user.role}
        data={ROLE_OPTIONS}
        disabled={!hasPermission('owner')}
        onChange={(newRole) => {
          if (newRole) {
            // TODO: Implement role change
            console.log(`Changing ${user.name}'s role to ${newRole}`)
          }
        }}
        styles={{
          input: {
            width: '120px',
            border: 'none',
            backgroundColor: 'transparent',
            fontFamily: 'monospace',
          },
        }}
      /> */}
    </div>
  )
}

interface EditableFieldProps {
  value: string
  onChange: (value: string) => void
  placeholder: string
  className?: string
  isTitle?: boolean
}

function EditableField({ value, onChange, placeholder, className, isTitle }: EditableFieldProps) {
  const [showHint, setShowHint] = useState(false)

  return (
    <Popover opened={showHint} position='top-start' shadow='md' withArrow offset={0}>
      <Popover.Target>
        <input
          className={clsx(
            'font-rubik outline-none w-full bg-transparent cursor-pointer px-2 py-1 rounded hover:bg-gray-50 transition-colors',
            isTitle ? 'text-xl font-bold' : 'text-16',
            !value && 'text-gray-400',
            className,
          )}
          type='text'
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onMouseEnter={() => setShowHint(true)}
          onMouseLeave={() => setShowHint(false)}
          onFocus={() => setShowHint(false)}
        />
      </Popover.Target>

      <Popover.Dropdown
        className='border-borders-purple border-1 rounded-md bg-[#EDEBF3]'
        classNames={{
          dropdown: 'p-2',
          arrow: 'bg-[#EDEBF3] border-borders-purple border-1',
        }}
      >
        <Text size='xs' color='dimmed' className='font-monaspace'>
          Click to edit
        </Text>
      </Popover.Dropdown>
    </Popover>
  )
}

export function ProjectSettings({ onClose }: { onClose: () => void }) {
  const { id: projectId } = useParams()
  const { users, project, isLoading } = useProject()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [removeTitle, setRemoveTitle] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (isLoading) return

    setTitle(project.title)
    setDescription(project.description)
  }, [project?.title, project?.description, isLoading])

  const saveTitle = (title: string) => updateProject({ id: projectId, title })

  const saveDescription = (description: string) => updateProject({ id: projectId, description })

  const debouncedSaveTitle = useCallback(debounce(saveTitle, 2000), [projectId])
  const debouncedSaveDescription = useCallback(debounce(saveDescription, 2000), [projectId])

  const handleDelete = () => {
    if (!projectId) return
    deleteProject(projectId)
    navigate(ROUTES.DASHBOARD, { replace: true })
  }

  const onCloseWithSave = () => {
    saveTitle(title)
    saveDescription(description)
    onClose()
  }

  const projectUrl = useMemo(() => DUN_URL + `/${projectId}`, [projectId])

  return (
    <div className='flex flex-col h-full min-h-[600px]'>
      {/* Top section */}
      <div className='flex flex-col flex-none'>
        <div className='px-5'>
          <EditableField
            value={title}
            onChange={(value) => {
              setTitle(value)
              debouncedSaveTitle(value)
            }}
            placeholder='Type the title'
            isTitle
          />
        </div>
        <div className='px-5 mt-2'>
          <EditableField
            value={description}
            onChange={(value) => {
              setDescription(value)
              debouncedSaveDescription(value)
            }}
            placeholder='Type the description'
          />
        </div>

        <div className='flex mt-4 justify-between items-center h-14 border-y-1 border-borders-purple'>
          <div className='px-5 w-1/4 font-bold ml-3 font-monaspace'>Invite link</div>
          <div className='w-2/4 text-sm my-5 h-full border-x-1 border-borders-purple flex items-center px-3'>
            {projectUrl}
          </div>
          <div className='w-1/4 h-14'>
            <CopyButton value={projectUrl}>
              {({ copied, copy }) => (
                <ButtonDun className={copied ? 'opacity-80' : ''} onClick={copy}>
                  {copied ? 'Copied' : 'Copy'}
                </ButtonDun>
              )}
            </CopyButton>
          </div>
        </div>
      </div>

      {/* Team section - will stretch */}
      <div className='flex flex-col flex-1'>
        <div className='flex items-center justify-between h-14 border-b-1 border-borders-purple'>
          <span className='px-5 ml-3 font-bold font-monaspace'>Your team</span>
        </div>

        <div className='flex-1 px-5 overflow-y-auto'>
          {!isEmpty(users)
            ? users.map((user) => <TeamMember key={'ps-user-' + user.id} user={user} />)
            : null}
        </div>
      </div>

      {/* Delete section - will stay at bottom */}
      <div className='flex-none border-borders-purple border-t-1 border-b-1 flex items-center font-monaspace px-5'>
        <div className='flex-1 flex flex-col border-r-1 border-borders-purple'>
          <span className='text-12'>
            Type project title (<span className='font-bold'>{title}</span>) to delete it:
          </span>
          <input
            value={removeTitle}
            onChange={(e) => setRemoveTitle(e.target.value)}
            className='w-1/2 text-sm my-2 bg-transparent outline-none border-borders-purple border-1 px-3 py-1'
            placeholder={title}
          />
        </div>

        <Button
          onClick={handleDelete}
          className={clsx(
            'font-monaspace',
            removeTitle === title ? 'text-red-400' : 'text-[#969696]',
          )}
          radius={0}
          variant='transparent'
          color='red'
          bg='transparent'
          disabled={removeTitle !== title}
        >
          Delete project
        </Button>
      </div>
    </div>
  )
}

export function ProjectSettingsModal({
  opened,
  onClose,
}: {
  opened: boolean
  onClose: () => void
}) {
  return (
    <Modal opened={opened} onClose={onClose} title='Project settings'>
      <ProjectSettings onClose={onClose} />
    </Modal>
  )
}
