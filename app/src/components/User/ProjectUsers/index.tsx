import { Avatar, Tooltip } from '@mantine/core'
import { isEmpty } from 'lodash'
import { IUser } from '../../../types/User'
import AvatarDun from '../../ui/Avatar'

interface IProjectUsersProps {
  users: IUser[]
}

function ProjectUsers({ users }: IProjectUsersProps) {
  return (
    <Tooltip.Group openDelay={200} closeDelay={100}>
      <Avatar.Group spacing='xs'>
        {!isEmpty(users)
          ? users.map((user, index) => (
              <Tooltip
                key={'project-' + user.id}
                label={index > 3 ? index + 1 : user.name}
                withArrow
              >
                <AvatarDun user={user} />
              </Tooltip>
            ))
          : null}
      </Avatar.Group>
    </Tooltip.Group>
  )
}

export default ProjectUsers
