import React from 'react'

import { ICard } from '../../../types/Card'
import { IUser } from '../../../types/User'
import Editor from '../../Editor'

interface UpdatesProps {
  projectId: string
  card: ICard
  users: IUser[]
}

const Updates: React.FC<UpdatesProps> = ({ projectId, card, users }) => {
  return (
    <div className='flex flex-col h-full'>
      <div className='flex-1'>
        <Editor projectId={projectId} card={card} users={users} />
      </div>
    </div>
  )
}

export default Updates
