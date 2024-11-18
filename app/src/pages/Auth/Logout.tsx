import React from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'

export default function Logout() {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  React.useEffect(() => {
    signOut().then(() => navigate('/login'))
  }, [])

  return null
}
