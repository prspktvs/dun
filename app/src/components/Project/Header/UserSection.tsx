import UserPanel from '../../User/UserPanel'
import { User } from '../../../types/User'

interface UserSectionProps {
  user: User
}

export function UserSection({ user }: UserSectionProps) {
  return (
    <div className='flex items-center justify-center w-48 h-full py-2 border-l px-7 border-border-color'>
      <div className='flex items-center h-full p-5'>
        <UserPanel user={user} />
      </div>
    </div>
  )
}
