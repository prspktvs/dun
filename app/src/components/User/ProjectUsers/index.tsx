import { Avatar, Tooltip } from '@mantine/core'
import { isEmpty } from 'lodash'
import { useMemo } from 'react'

import { IUser } from '../../../types/User'
import AvatarDun from '../../ui/Avatar'
import { useProject } from '../../../context/ProjectContext'

function ProjectUsers() {
  const { users } = useProject()

  const usersList = useMemo(() => users.slice(0, 6), [users])
  const usersCount = users.length - 6

  return (
    <Tooltip.Group openDelay={200} closeDelay={100}>
      <Avatar.Group spacing={5}>
        {!isEmpty(usersList)
          ? usersList.map((user, index) => (
              <Tooltip key={'project-' + user.id} label={user.name} withArrow>
                <AvatarDun size={32} user={user} />
              </Tooltip>
            ))
          : null}
        {usersCount > 0 ? (
          <div className='relative -left-1 w-[32px] h-[32px] bg-[#47444F] text-white text-12 flex justify-center items-center rounded-sm font-monaspace border-1 border-black'>
            +{usersCount}
          </div>
        ) : null}
      </Avatar.Group>
    </Tooltip.Group>
  )
}

export default ProjectUsers
