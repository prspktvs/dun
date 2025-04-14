import ReactDOM from 'react-dom/client'
import * as Sentry from '@sentry/react'

import App from './App'
import './index.css'

// Register a Service Worker.
navigator.serviceWorker
  .register('/sw.js')
  .then((registration) => {
    console.log('Service Worker registered with scope:', registration.scope)
    if (navigator.serviceWorker.controller) {
      console.log('Service Worker is controlling the page')
    } else {
      console.log('Service Worker is not controlling the page')
    }
  })
  .catch((error) => {
    console.error('Service Worker registration failed:', error)
  })

navigator.serviceWorker.addEventListener('message', (event) => {
  console.log('sw message', event.data)
  if (event.data.type === 'navigate') {
    window.location.href = event.data.url
  }
})

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
