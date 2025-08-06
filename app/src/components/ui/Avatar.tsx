import { Avatar, AvatarProps } from '@mantine/core'
import React from 'react'
import firebase from 'firebase/compat/app'

import { IUser } from '../../types/User'

type UserType = IUser | firebase.User

const AvatarDun = React.forwardRef<HTMLDivElement, { user: UserType; size?: AvatarProps['size'] }>(
  ({ user, size = 36 }, ref) => {
    const name = ('name' in user ? user.name : user.displayName)?.split(' ') || []
    const initials =
      name.length > 1 ? name[0].charAt(0) + name[1]?.charAt(0) : name[0]?.charAt(0) || 'U'
    const avatarUrl =
      'avatarUrl' in user ? user.avatarUrl : ((user as firebase.User).photoURL as string)
    const color = 'color' in user ? user.color : 'blue'
    const displayName = 'name' in user ? user.name : user.displayName

    return (
      <Avatar
        ref={ref}
        size={size}
        src={avatarUrl}
        alt={displayName || undefined}
        color={color}
        radius={3}
        style={{ border: '1.5px solid black' }}
      >
        <span className='pt-1 font-monaspace text-black'>{initials}</span>
      </Avatar>
    )
  },
)

export default AvatarDun
