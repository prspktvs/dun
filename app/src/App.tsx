import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom'
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'

import '@mantine/core/styles.css'
import { AuthProvider } from './context/AuthContext'
import Login from './pages/Auth/Login'
import Logout from './pages/Auth/Logout'
import { EditorProvider } from './context/EditorContext'
import LandingPage from './pages/LandingPage'
import '@mantine/notifications/styles.css'
import './utils/push'
import { ProjectLayout } from './components/Project/Layout'
import { CardsPage } from './pages/Project/Cards'
import { CardPage } from './pages/Project/Card'
import { MyWorkPage } from './pages/Project/Work'
import Dashboard from './pages/Project/Dashboard'
import ProtectedRoute from './components/Auth/ProtectedRoute'

export default function App() {
  return (
    <MantineProvider>
      <Notifications position='top-right' />
      <BrowserRouter>
        <AuthProvider>
          <EditorProvider>
            <Routes>
              <Route index path='/' element={<LandingPage />} />
              <Route path='/login' element={<Login />} />
              <Route path='/logout' element={<Logout />} />
              <Route element={<ProtectedRoute />}>
                <Route path='dashboard' element={<Dashboard />} />
                <Route path=':id' element={<ProjectLayout />}>
                  <Route index element={<CardsPage />} />
                  <Route path='my-work' element={<MyWorkPage />} />
                  <Route path='cards/:cardId' element={<CardPage />} />
                  <Route path='cards/:cardId/chats/:chatId' element={<CardPage />} />
                </Route>
              </Route>
            </Routes>
          </EditorProvider>
        </AuthProvider>
      </BrowserRouter>
    </MantineProvider>
  )
}
