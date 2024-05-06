import { Avatar, Tooltip } from '@mantine/core'
import { isEmpty } from 'lodash'
import { IUser } from '../../../types/User'

interface IProjectUsersProps {
  users: IUser[]
}

function ProjectUsers({ users }: IProjectUsersProps) {
  return (
    <Tooltip.Group openDelay={200} closeDelay={100}>
        <Avatar.Group spacing='sm'>
        {!isEmpty(users)
          ? users.map((user, index) => (
              <Tooltip key={'project-' + user.id} label={index > 3?index+1:user.name} withArrow>
                <Avatar
                  size={24}
                  src={user.avatarUrl}
                  alt={user.name}
                  color={user.color}
                  radius={0}
                  style={{ borderColor: 'black' }}
                >
                  {user.name.at(0)}
                </Avatar>
              </Tooltip>
            ))
          : null}
      </Avatar.Group>
    </Tooltip.Group>
  )
}

export default ProjectUsers
