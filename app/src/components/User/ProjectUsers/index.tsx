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
          ? users.map((user) => (
              <Tooltip key={'project-' + user.id} label={user.name} withArrow>
                <Avatar src={user.avatarUrl} alt={user.name} color={user.color} radius='xl'>
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
