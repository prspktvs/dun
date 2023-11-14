import React from 'react'
import { useAuth } from '../../context/AuthContext'
import { Button } from '@mantine/core'

export default function Login() {
  const { signInWithGoogle } = useAuth()
  return (
    <div className='w-screen mt-20 flex flex-col items-center justify-center'>
      <h1>Log in</h1>
      <Button
        leftSection={<i className='ri-google-line text-2xl' />}
        color='black'
        onClick={signInWithGoogle}
      >
        Sign in with Google
      </Button>
    </div>
  )
}
