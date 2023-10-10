import { Button } from '@mantine/core'
import React from 'react'
import { genId } from '../../utils'
import { useNavigate } from 'react-router-dom'

function HomePage() {
  const navigate = useNavigate()
  return (
    <div className='w-full flex flex-col items-center justify-center'>
      <h1>Create your first project</h1>
      <Button
        variant='filled'
        color='rgba(36, 36, 36, 1)'
        w={350}
        size='lg'
        onClick={() => (window.location.href = `/${genId()}`)}
        radius='xs'
      >
        Let's start
      </Button>
    </div>
  )
}

export default HomePage
