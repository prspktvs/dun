import { Avatar } from '@mantine/core'
import React from 'react'
import { IUser } from '../../types/User'

export default function AvatarDun({ user, size = 28 }: { user: IUser; size?: number }) {
  const name = user.name.split(' ')
  const initials = name.length > 1 ? name[0].charAt(0) + name[1]?.charAt(0) : name[0].charAt(0)
  return (
    <Avatar
      size={size}
      src={user.avatarUrl}
      alt={user.name}
      color={user.color}
      radius={3}
      style={{ border: '1.5px solid black' }}
    >
      <span className='pt-1 font-monaspace text-black'>{initials}</span>
    </Avatar>
  )
}
