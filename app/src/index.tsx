import ReactDOM from 'react-dom/client'
import * as Sentry from '@sentry/react'
// import { registerSW } from 'virtual:pwa-register'

import App from './App'
import './index.css'

// registerSW({ immediate: true })

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  integrations: [
    Sentry.feedbackIntegration({
      autoInject: false,
      colorScheme: 'system',
    }),
  ],
  tracePropagationTargets: ['localhost', 'dun.wtf'],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<App />)
