import ReactDOM from 'react-dom/client'
import * as Sentry from '@sentry/react'

import App from './App'
import './index.css'

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
  tracePropagationTargets: ['localhost', 'dun.wtf'],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<App />)
