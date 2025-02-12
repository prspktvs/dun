import { Button, CopyButton } from '@mantine/core'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { debounce, isEmpty } from 'lodash'
import { useParams } from 'react-router-dom'
import clsx from 'clsx'

import ButtonDun from '../ui/buttons/ButtonDun'
import { useProject } from '../../context/ProjectContext'
import AvatarDun from '../ui/Avatar'
import { DUN_URL } from '../../constants'
import { deleteProject, updateProject } from '../../services/project.service'
import { Modal } from '../ui/modals/Modal'

export default function ProjectSettingsModal({
  opened,
  onClose,
}: {
  opened: boolean
  onClose: () => void
}) {
  const { id: projectId } = useParams()
  const { users, project, isLoading } = useProject()
  const [title, setTitle] = useState()
  const [description, setDescription] = useState()
  const [isTitleEditing, setIsTitleEditing] = useState(false)
  const [isDescriptionEditing, setIsDescriptionEditing] = useState(false)
  const [removeTitle, setRemoveTitle] = useState('')

  useEffect(() => {
    if (isLoading) return

    setTitle(project.title)
    setDescription(project.description)
  }, [project?.title, project?.description, isLoading])

  const saveTitle = (title: string) => updateProject({ id: projectId, title })

  const saveDescription = (description: string) => updateProject({ id: projectId, description })

  const debouncedSaveTitle = useCallback(debounce(saveTitle, 2000), [])
  const debouncedSaveDescription = useCallback(debounce(saveDescription, 2000), [])

  const handleDelete = () => deleteProject(projectId)

  const projectUrl = useMemo(() => DUN_URL + `/${projectId}`, [projectId])

  return (
    <Modal opened={opened} onClose={onClose} title='Project settings'>
      <div className='flex flex-col justify-between'>
        <div>
          <div className='px-5'>
            {isTitleEditing ? (
              <input
                className='font-bold font-rubik text-xl outline-none'
                type='text'
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                  debouncedSaveTitle(e.target.value)
                }}
                placeholder='Type the title'
                autoFocus
                onBlur={() => setIsTitleEditing(false)}
              />
            ) : (
              <span
                onClick={() => setIsTitleEditing(true)}
                className='font-bold font-rubik text-xl cursor-pointer'
              >
                {title}
              </span>
            )}
          </div>
          <div className='px-5'>
            {isDescriptionEditing ? (
              <input
                className='font-rubik text-16 outline-none'
                type='text'
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value)
                  debouncedSaveDescription(e.target.value)
                }}
                placeholder='Type the description'
                autoFocus
                onBlur={() => setIsDescriptionEditing(false)}
              />
            ) : (
              <span
                onClick={() => setIsDescriptionEditing(true)}
                className='font-rubik text-16 cursor-pointer'
              >
                {description}
              </span>
            )}
          </div>

          <div className='flex mt-4 justify-between items-center h-14 border-y-1 border-border-color'>
            <div className='px-5 w-1/4 font-bold ml-3 font-monaspace'>Invite link</div>
            <div className='w-2/4 text-sm my-5 h-full border-x-1 border-border-color flex items-center px-3'>
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

        <div className='flex items-center justify-between h-14 border-b-1 border-border-color'>
          <span className='px-5 ml-3 font-bold font-monaspace'>Your team</span>
        </div>

        <div className='px-5 max-h-[300px] flex flex-col overflow-y-scroll'>
          {!isEmpty(users)
            ? users.map((user, index) => (
                <div key={'ps-user-' + user.id} className='my-2 ml-3 flex items-center gap-3'>
                  <AvatarDun user={user} size={40} />
                  <div className='flex flex-col'>
                    <span className='text-base font-medium '>{user.name}</span>
                    <span className='text-sm '>{user.email}</span>
                  </div>
                </div>
              ))
            : null}
        </div>

        <div className='border-border-color border-t-1 flex items-center font-monaspace px-5'>
          <div className='flex-1 border-r-1 border-border-color'>
            <span className='text-12'>
              Type project title (<span className='font-bold'>{title}</span>) to delete it:
            </span>
            <input
              value={removeTitle}
              onChange={(e) => setRemoveTitle(e.target.value)}
              className='w-full text-sm my-2 bg-white outline-none'
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
    </Modal>
  )
}
