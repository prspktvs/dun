import { Avatar, AvatarProps } from '@mantine/core'
import React from 'react'

import { IUser } from '../../types/User'

const AvatarDun = React.forwardRef<HTMLDivElement, { user: IUser; size?: AvatarProps['size'] }>(
  ({ user, size = 36 }, ref) => {
    const name = user?.name?.split(' ') || []
    const initials =
      name.length > 1 ? name[0].charAt(0) + name[1]?.charAt(0) : name[0]?.charAt(0) || 'U'
    return (
      <Avatar
        ref={ref}
        size={size}
        src={user?.avatarUrl}
        alt={user?.name}
        color={user?.color}
        radius={3}
        style={{ border: '1.5px solid black' }}
      >
        <span className='pt-1 font-monaspace text-black'>{initials}</span>
      </Avatar>
    )
  },
)

export default AvatarDun
