import * as Sentry from '@sentry/react'
import { Input, Textarea, TextInput } from '@mantine/core'
import { useEffect, useState } from 'react'

import { Modal } from './Modal'
import ButtonDun from '../buttons/ButtonDun'
import { useAuth } from '../../../context/AuthContext'

interface IFeedbackModalProps {
  opened: boolean
  onClose: () => void
}

export default function FeedbackModal({ opened, onClose }: IFeedbackModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      setName(user.name)
      setEmail(user.email)
    }
  }, [user?.name, user?.email])

  const handleFeedback = (e) => {
    e.preventDefault()
    console.log('Feedback:', { name, email, message })
    Sentry.captureFeedback({
      name,
      email,
      message,
    })

    setMessage('')

    onClose()
  }
  return (
    <Modal opened={opened} onClose={onClose} noHeader size='md'>
      <form
        className='flex flex-col items-center justify-center px-5 py-3'
        onSubmit={handleFeedback}
      >
        <div className='w-full text-md font-bold font-monaspace px-5 mb-5'>
          Your feedback is important to us. Please share your thoughts with us.
        </div>
        <TextInput
          className='w-full mb-3'
          label='Name'
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextInput
          className='w-full mb-3'
          label='Email'
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Textarea
          rows={5}
          resize='vertical'
          className='w-full'
          label='Message'
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className='flex mt-4 w-full h-12'>
          <ButtonDun type='submit'>Send</ButtonDun>
        </div>
        <button
          onClick={onClose}
          className='flex items-center justify-center w-full h-12 border-borders-purple'
        >
          <div className='font-bold font-monaspace text-[#E86D6D] text-sm'>Close</div>
        </button>
      </form>
    </Modal>
  )
}
