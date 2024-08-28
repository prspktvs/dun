import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom'
import ProjectPage from './pages/Project'
import HomePage from './pages/Home'
import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import { AuthProvider } from './context/AuthContext'
import Login from './pages/Auth/Login'
import ProtectedLayout from './layouts/ProtectedLayout'
import Logout from './pages/Auth/Logout'
import { ChatProvider } from './context/ChatContext'
import { EditorProvider } from './context/EditorContext'
import LandingPage from './pages/LandingPage'
import { Notifications } from '@mantine/notifications'
import '@mantine/notifications/styles.css'
import './utils/push'
import { ProjectLayoutWithProtection } from './components/Project/Layout'
import { CardsPage } from './pages/Project/Cards'
import { CardPage } from './pages/Project/Card'
import { MyWorkPage } from './pages/Project/Work'

export default function App() {
  return (
    <MantineProvider>
      <Notifications position='top-right' />
      <BrowserRouter>
        <AuthProvider>
          <ChatProvider>
            <EditorProvider>
              <Routes>
                <Route index path='/' element={<LandingPage />} />
                <Route path='/login' element={<Login />} />
                <Route path='/logout' element={<Logout />} />
                <Route path=':id' element={<ProjectLayoutWithProtection />}>
                  <Route index element={<CardsPage />} />
                  <Route path='my-work' element={<MyWorkPage />} />
                  <Route path='cards/:cardId' element={<CardPage />} />
                </Route>
              </Routes>
            </EditorProvider>
          </ChatProvider>
        </AuthProvider>
      </BrowserRouter>
    </MantineProvider>
  )
}
