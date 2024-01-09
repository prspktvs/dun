import { Avatar } from '@mantine/core'
import { IUser } from '../../types/User'

export default function UserPanel({ user }: { user: IUser }) {
  return (
    <div className='flex items-center gap-3 '>
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
      <span className=''>{user.name}</span>
    </div>
  )
}
