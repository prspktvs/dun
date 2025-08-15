import { Button, CopyButton, Popover, Select, Switch, Text } from '@mantine/core'
import { useCallback, useEffect, useState } from 'react'
import { debounce, isEmpty } from 'lodash'
import { useNavigate, useParams } from 'react-router-dom'
import clsx from 'clsx'

import ButtonDun from '../ui/buttons/ButtonDun'
import { useProject } from '../../context/ProjectContext'
import AvatarDun from '../ui/Avatar'
import { ROUTES } from '../../constants'
import { deleteProject, updateProject } from '../../services/project.service'
import { Modal } from '../ui/modals/Modal'
import { ITeamMember, IUser } from '../../types/User'
import { leaveProject, removeUserFromProject, updateRole } from '../../utils/users'
import { ROLE_OPTIONS, ROLES, UserRole } from '../../constants/roles.constants'
import { useAuth } from '../../context/AuthContext'
import { KebabMenu } from '../ui/KebabMenu'

const getUserId = (user: IUser | { uid: string } | null): string | undefined => {
  if (!user) return undefined
  return 'id' in user ? user.id : user.uid
}

export function TeamMember({ user }: { user: ITeamMember }) {
  const { id: projectId } = useParams()
  const { user: currentUser } = useAuth()
  const { hasPermission, users, project } = useProject()

  const isPublicProject = Boolean(project?.visibility === 'public')

  const currentUserId = getUserId(currentUser)
  const currentProjectUser = users.find((u) => u.id === currentUserId)
  const currentUserRole = currentProjectUser?.role

  const isCurrentUser = user.id === currentUserId
  const isCurrentUserOwner = currentUserRole === ROLES.OWNER

  const isOwner = user.role === ROLES.OWNER
  const isAdmin = user.role === ROLES.ADMIN

  let roleOptions = ROLE_OPTIONS
  let canSelectRole = false

  if (currentUserRole === ROLES.OWNER) {
    roleOptions = ROLE_OPTIONS
    canSelectRole = !isCurrentUser
  } else if (currentUserRole === ROLES.ADMIN) {
    roleOptions = roleOptions.filter((opt) => opt.value !== ROLES.OWNER)
    canSelectRole = !isCurrentUser && !isOwner
  } else {
    canSelectRole = false
  }

  const canUpdateAndRemoveUser =
    hasPermission(ROLES.ADMIN) &&
    !isOwner &&
    !isCurrentUser &&
    !(isAdmin && currentUserRole === ROLES.ADMIN)

  return (
    <div className='ml-3 grid grid-cols-[auto_1fr_120px_40px] items-center gap-3'>
      <AvatarDun user={user} size={40} />

      <div className='flex flex-col min-w-0'>
        <span className='text-base font-medium truncate'>{user.name}</span>
        {!isPublicProject && <span className='text-sm text-gray-500 truncate'>{user.email}</span>}
      </div>

      {isOwner ? (
        <div className='font-monaspace text-14 text-left font-bold pl-3'>Owner</div>
      ) : (
        <Select
          value={user.role}
          data={roleOptions}
          readOnly={!canSelectRole}
          onChange={(newRole) => {
            if (newRole && canSelectRole) {
              if (newRole === ROLES.OWNER && isCurrentUserOwner) {
                updateRole(projectId as string, user.id, ROLES.OWNER)
              } else {
                updateRole(projectId as string, user.id, newRole as UserRole)
              }
            }
          }}
          rightSection={<i className='ri-arrow-down-s-line text-gray-500' />}
          classNames={{
            root: 'w-[100px]',
            input: clsx(
              'text-left font-monaspace text-md border-none bg-transparent font-bold',
              canSelectRole ? 'cursor-pointer' : 'cursor-default',
            ),
            dropdown: 'border-borders-purple border-1',
          }}
        />
      )}

      {canUpdateAndRemoveUser ? (
        <KebabMenu
          menuText='Remove user'
          confirmMessage='Are you sure you want to remove this user?'
          confirmText='Remove'
          onConfirm={() =>
            removeUserFromProject(projectId as string, user.id, getUserId(currentUser)!)
          }
        />
      ) : isCurrentUser && !isOwner ? (
        <KebabMenu
          menuText='Leave project'
          confirmMessage='Are you sure you want to leave this project?'
          confirmText='Leave'
          onConfirm={() => leaveProject(projectId as string, getUserId(currentUser)!)}
        />
      ) : (
        <div />
      )}
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

export function ProjectSettings({ onClose: _onClose }: { onClose: () => void }) {
  const { id: projectId } = useParams()
  const { users, project, isLoading, hasPermission } = useProject()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [visibility, setVisibility] = useState<'private' | 'public'>('private')
  const [removeTitle, setRemoveTitle] = useState('')
  const navigate = useNavigate()

  const inviteUrl = project?.inviteUrl || ''

  const canDeleteProject = hasPermission(ROLES.OWNER)
  const canEditTitleAndDescription = hasPermission(ROLES.ADMIN)
  const isOwner = hasPermission(ROLES.OWNER)
  const canInviteUsers = hasPermission(ROLES.ADMIN)

  useEffect(() => {
    if (isLoading) return

    setTitle(project?.title || '')
    setDescription(project?.description || '')
    setVisibility((project?.visibility as 'private' | 'public') || 'private')
  }, [project?.title, project?.description, isLoading])

  const saveTitle = useCallback(
    (title: string) => updateProject({ id: projectId, title }),
    [projectId],
  )

  const saveDescription = useCallback(
    (description: string) => updateProject({ id: projectId, description }),
    [projectId],
  )

  const [debouncedSaveTitle] = useState(() => debounce(saveTitle, 2000))
  const [debouncedSaveDescription] = useState(() => debounce(saveDescription, 2000))

  const handleDelete = () => {
    if (!projectId || !canDeleteProject) return
    deleteProject(projectId)
    navigate(ROUTES.DASHBOARD, { replace: true })
  }

  return (
    <div className='flex flex-col h-full'>
      <div>
        {canInviteUsers && (
          <div className='flex justify-between items-center h-14 border-b-1 border-borders-purple'>
            <div className='px-5 w-1/4 font-bold ml-3 font-monaspace'>Invite link</div>
            <div className='w-2/4 text-sm my-5 h-full border-x-1 border-borders-purple flex items-center px-3'>
              {inviteUrl}
            </div>
            <div className='w-1/4 h-14'>
              <CopyButton value={inviteUrl}>
                {({ copied, copy }) => (
                  <ButtonDun className={copied ? 'opacity-80' : ''} onClick={copy}>
                    {copied ? 'Copied' : 'Copy'}
                  </ButtonDun>
                )}
              </CopyButton>
            </div>
          </div>
        )}
        {isOwner && (
          <div className='px-9 py-2 border-b-1 border-borders-purple'>
            <div className='flex items-center justify-between'>
              <div className='flex flex-col'>
                <span className='w-1/4 font-bold font-monaspace'>Visibility</span>
                <span className='text-xs text-gray-500'>
                  {visibility === 'public'
                    ? 'Public — anyone with the link can view'
                    : 'Private — only invited members can access'}
                </span>
              </div>
              {isOwner ? (
                <div className='flex items-center gap-3'>
                  <span className='text-sm'>{visibility === 'public' ? 'Public' : 'Private'}</span>
                  <Switch
                    size='md'
                    color='#8379BD'
                    checked={visibility === 'public'}
                    onChange={(e) => {
                      const newVisibility = e.currentTarget.checked ? 'public' : 'private'
                      setVisibility(newVisibility)
                      if (projectId) updateProject({ id: projectId, visibility: newVisibility })
                    }}
                  />
                </div>
              ) : (
                <Text className='px-2 py-1'>{project?.visibility ?? 'private'}</Text>
              )}
            </div>
          </div>
        )}
        <div className='py-3'>
          <div className='px-5'>
            {canEditTitleAndDescription ? (
              <EditableField
                value={title}
                onChange={(value) => {
                  setTitle(value)
                  debouncedSaveTitle(value)
                }}
                placeholder='Type the title'
                isTitle
              />
            ) : (
              <Text className='text-xl font-bold px-2 py-1'>{title}</Text>
            )}
          </div>
          <div className='px-5 mt-2'>
            {canEditTitleAndDescription ? (
              <EditableField
                value={description}
                onChange={(value) => {
                  setDescription(value)
                  debouncedSaveDescription(value)
                }}
                placeholder='Type the description'
              />
            ) : (
              <Text className='px-2 py-1'>{description || 'No description'}</Text>
            )}
          </div>

          <div className='flex items-center justify-between h-14 border-t-1 border-borders-purple'>
            <span className='px-5 ml-3 font-bold font-monaspace'>{title} team</span>
          </div>
        </div>
      </div>

      <div className='flex-1 flex flex-col px-5 overflow-y-auto gap-4'>
        {!isEmpty(users)
          ? users.map((user) => <TeamMember key={'ps-user-' + user.id} user={user} />)
          : null}
      </div>

      {canDeleteProject && (
        <div className='border-borders-purple border-t-1 border-b-1 flex items-center font-monaspace px-5'>
          <div className='flex-1 flex flex-col border-r-1 border-borders-purple'>
            <input
              value={removeTitle}
              onChange={(e) => setRemoveTitle(e.target.value)}
              className='w-1/2 text-sm my-2 bg-transparent outline-none px-3 py-1'
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
      )}
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
