import { Navigate, Outlet, useParams } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'

const ProtectedLayout = () => {
  const { id, cardId } = useParams()
  const { isAuthenticated, loading } = useAuth()

  const from = cardId ? `/${id}/cards/${cardId}` : `/${id}`
  if (!isAuthenticated && !loading) {
    return <Navigate to='/login' state={{ from }} />
  }
  return <Outlet />
}

export default ProtectedLayout
