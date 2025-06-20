import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import * as Sentry from '@sentry/react'
import '@mantine/core/styles.css'
import { lazy, Suspense, useEffect } from 'react'

import { AuthProvider } from './context/AuthContext'
import { EditorProvider } from './context/EditorContext'
import '@mantine/notifications/styles.css'
import './utils/push'
import ProtectedRoute from './components/Auth/ProtectedRoute'
import { logAnalytics } from './utils/analytics'
import { ANALYTIC_EVENTS } from './constants'
import { NotFound } from './pages/NotFound'
import { Loader } from './components/ui/Loader'

const Login = lazy(() => import('./pages/Auth/Login'))
const Logout = lazy(() => import('./pages/Auth/Logout'))
const LandingPage = lazy(() => import('./pages/LandingPage'))
const ProjectLayout = lazy(() =>
  import('./components/Project/Layout').then((m) => ({ default: m.ProjectLayout })),
)
const KanbanPage = lazy(() =>
  import('./pages/Project/Kanban').then((m) => ({ default: m.KanbanPage })),
)
const CardsPage = lazy(() =>
  import('./pages/Project/Cards').then((m) => ({ default: m.CardsPage })),
)
const CardPage = lazy(() => import('./pages/Project/Card').then((m) => ({ default: m.CardPage })))
const MyWorkPage = lazy(() =>
  import('./pages/Project/Work').then((m) => ({ default: m.MyWorkPage })),
)
const Dashboard = lazy(() => import('./pages/Project/Dashboard'))
const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions'))
const SettingPage = lazy(() =>
  import('./pages/Project/Settings').then((m) => ({ default: m.SettingPage })),
)

const LoadingFallback = () => (
  <div className='flex items-center justify-center h-screen'>
    <Loader />
  </div>
)

export default function App() {
  useEffect(() => {
    logAnalytics(ANALYTIC_EVENTS.PAGE_OPEN, { page: 'app' })
  }, [])

  return (
    <Sentry.ErrorBoundary fallback={<NotFound />}>
      <MantineProvider>
        <Notifications position='top-right' />
        <BrowserRouter>
          <AuthProvider>
            <EditorProvider>
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  <Route index path='/' element={<LandingPage />} />
                  <Route path='/login' element={<Login />} />
                  <Route path='/logout' element={<Logout />} />
                  <Route path='/terms-and-conditions' element={<TermsAndConditions />} />
                  <Route element={<ProtectedRoute />}>
                    <Route path='dashboard' element={<Dashboard />} />
                    <Route path=':id' element={<ProjectLayout />}>
                      <Route index element={<CardsPage />} />
                      <Route path='my-work' element={<MyWorkPage />} />
                      <Route path='settings' element={<SettingPage />} />
                      <Route path='kanban' element={<KanbanPage />} />
                      <Route path='cards/:cardId' element={<CardPage />} />
                      <Route path='cards/:cardId/chats/:chatId' element={<CardPage />} />
                    </Route>
                  </Route>
                  <Route path='*' element={<NotFound />} />
                </Routes>
              </Suspense>
            </EditorProvider>
          </AuthProvider>
        </BrowserRouter>
      </MantineProvider>
    </Sentry.ErrorBoundary>
  )
}
