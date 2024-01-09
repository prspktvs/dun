import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProjectPage from './pages/Project'
import HomePage from './pages/Home'
import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import { AuthProvider } from './context/AuthContext'
import Login from './pages/Auth/Login'
import ProtectedLayout from './layouts/ProtectedLayout'
import Logout from './pages/Auth/Logout'
import ChatProvider from './context/ChatContext/ChatProvider'

export default function App() {
  return (
    <MantineProvider>
      <BrowserRouter>
        <AuthProvider>
          <ChatProvider>
            <Routes>
              <Route index path='/' element={<HomePage />} />
              <Route path='/login' element={<Login />} />
              <Route path='/logout' element={<Logout />} />
              <Route path='*' />
              <Route element={<ProtectedLayout />}>
                <Route path=':id' element={<ProjectPage />} />
                <Route path=':id/cards/:cardId' element={<ProjectPage />} />
              </Route>
            </Routes>
          </ChatProvider>
        </AuthProvider>
      </BrowserRouter>
    </MantineProvider>
  )
}
