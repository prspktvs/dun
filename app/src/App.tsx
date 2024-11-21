import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom'
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'

import '@mantine/core/styles.css'
import { AuthProvider } from './context/AuthContext'
import Login from './pages/Auth/Login'
import Logout from './pages/Auth/Logout'
import { ChatProvider } from './context/ChatContext'
import { EditorProvider } from './context/EditorContext'
import LandingPage from './pages/LandingPage'
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
          <EditorProvider>
            <Routes>
              <Route index path='/' element={<LandingPage />} />
              <Route path='/login' element={<Login />} />
              <Route path='/logout' element={<Logout />} />
              <Route path=':id' element={<ProjectLayoutWithProtection />}>
                <Route index element={<CardsPage />} />
                <Route path='my-work' element={<MyWorkPage />} />
                <Route path='cards/:cardId' element={<CardPage />} />
                <Route path='cards/:cardId/chats/:chatId' element={<CardPage />} />
              </Route>
            </Routes>
          </EditorProvider>
        </AuthProvider>
      </BrowserRouter>
    </MantineProvider>
  )
}
