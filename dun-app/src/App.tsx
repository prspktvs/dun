import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProjectPage from './pages/Project'
import HomePage from './pages/Home'
import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'

export default function App() {
  return (
    <MantineProvider>
      <BrowserRouter>
        <Routes>
          <Route index path='/' element={<HomePage />} />
          <Route path=':id' element={<ProjectPage />} />
          <Route path=':id/cards/:cardId' element={<ProjectPage />} />
          <Route path='*' />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  )
}
