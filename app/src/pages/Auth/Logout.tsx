import React from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Logout() {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  React.useEffect(() => {
    signOut().then(() => navigate('/login'))
  }, [])

  return null
}
