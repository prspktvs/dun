import { Input, Modal, Button } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useState } from 'react'
import { IUser } from '../../types/User'
import { genId } from '../../utils'
import { addUserToProject } from '../../services'

interface ICreateUserProps {
  projectId: string
}

function CreateUser({ projectId }: ICreateUserProps) {
  const [name, setName] = useState('')

  const createUser = async () => {
    const newUser: IUser = {
      id: genId(),
      name,
      color: '#' + Math.floor(Math.random() * 16777215).toString(16),
    }

    await addUserToProject(projectId, newUser)

    // window.location.href = `/${projectId}`
  }

  return (
    <div className='flex justify-center items-center h-screen w-screen'>
      <div className='mb-20 flex flex-col gap-3'>
        <div className='text-3xl'>What's your name</div>
        <input
          className='focus:border-none text-2xl'
          placeholder='Type your name'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button
          className='mt-10'
          fullWidth
          radius={0}
          variant='filled'
          color='#464646'
          onClick={createUser}
        >
          Continue
        </Button>
      </div>
    </div>
  )
}

export default CreateUser
