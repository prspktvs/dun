import { Avatar, Tooltip } from '@mantine/core'
import { isEmpty } from 'lodash'
import { useMemo } from 'react'
import { useParams } from 'react-router-dom'

import AvatarDun from '../../ui/Avatar'
import { IUser } from '../../../types/User'

interface IUserListProps {
  users: IUser[]
}

function UserList({ users }: IUserListProps) {
  const { cardId } = useParams<{ cardId: string }>()
  const usersList = useMemo(() => users.slice(0, 6), [users])

  if (isEmpty(usersList)) return null

  const usersCount = users.length - 6

  return (
    <Tooltip.Group openDelay={200} closeDelay={100}>
      <Avatar.Group spacing={5}>
        {usersList.map((user, index) => (
          <Tooltip key={`avatar-${cardId}-${user.id}`} label={user.name} withArrow>
            <AvatarDun size={32} user={user} />
          </Tooltip>
        ))}
        {usersCount > 0 ? (
          <div className='relative -left-1 w-[32px] h-[32px] bg-[#47444F] text-white text-12 flex justify-center items-center rounded-sm font-monaspace border-1 border-black'>
            +{usersCount}
          </div>
        ) : null}
      </Avatar.Group>
    </Tooltip.Group>
  )
}

export default UserList
