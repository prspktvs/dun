import { Avatar, AvatarProps } from '@mantine/core'
import React from 'react'
import firebase from 'firebase/compat/app'

import { IUser } from '../../types/User'

type UserType = IUser | firebase.User

const AvatarDun = React.forwardRef<HTMLDivElement, { user: UserType; size?: AvatarProps['size'] }>(
  ({ user, size = 36 }, ref) => {
    if (!user) {
      return (
        <Avatar
          ref={ref}
          size={size}
          color='blue'
          radius={3}
          style={{ border: '1.5px solid black' }}
        >
          <span className='pt-1 font-monaspace text-black'>U</span>
        </Avatar>
      )
    }

    const name = ('name' in user ? user.name : user.displayName) || ''
    const nameParts = name.split(' ')
    const initials =
      nameParts.length > 1
        ? `${nameParts[0][0] ?? ''}${nameParts[1][0] ?? ''}`
        : (nameParts[0][0] ?? 'U')

    const avatarUrl =
      'avatarUrl' in user && typeof user.avatarUrl === 'string' && user.avatarUrl
        ? user.avatarUrl
        : 'photoURL' in user && typeof user.photoURL === 'string' && user.photoURL
          ? user.photoURL
          : null

    const color = 'color' in user && user.color ? user.color : 'blue'
    const displayName = name || 'User'

    return (
      <Avatar
        ref={ref}
        size={size}
        src={avatarUrl}
        alt={displayName}
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
