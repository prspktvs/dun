import { Menu } from '@mantine/core'

import { useAuth } from '../../context/AuthContext'
import AvatarDun from '../ui/Avatar'
import NotificationBell from '../ui/NotificationBell'

export default function UserPanel() {
  const { signOut, user } = useAuth()

  if (!user) return null

  return (
    <div className='flex items-center gap-3'>
      <NotificationBell />
      <Menu shadow='md' radius={0} width={200}>
        <Menu.Target>
          <div className='flex items-center gap-3 hover:cursor-pointer '>
            <AvatarDun user={user} />
          </div>
        </Menu.Target>

        <Menu.Dropdown className='shadow-[6px_6px_0px_0px_#C1BAD0]'>
          <Menu.Label>{'name' in user ? user.name : user.displayName}</Menu.Label>
          <Menu.Item leftSection={<i className='ri-logout-box-r-line' />} onClick={signOut}>
            Log Out
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </div>
  )
}
