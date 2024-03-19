import { Avatar, Button, Menu } from '@mantine/core'
import { IUser } from '../../types/User'
import { useAuth } from '../../context/AuthContext'

export default function UserPanel({ user }: { user: IUser }) {
  const { signOut } = useAuth()
  return (
    <Menu shadow='md' radius='md' width={200}>
      <Menu.Target>
        <div className='flex items-center gap-3 hover:cursor-pointer '>
          <Avatar size={24} src={user.avatarUrl} alt={user.name} color={user.color} radius={0}>
            {user.name.at(0)}
          </Avatar>
          {/* <span className='font-monaspace'>{user.name}</span> */}
        </div>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>{user.name}</Menu.Label>
        <Menu.Item leftSection={<i className='ri-logout-box-r-line' />} onClick={signOut}>
          Log Out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
