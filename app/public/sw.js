/* eslint-disable no-undef */
self.addEventListener('push', function (event) {
  const data = event.data.json()
  const { title, ...options } = data
  console.log('push', title, options)

  event.waitUntil(self.registration.showNotification('DUN: ' + title, options))
})

self.addEventListener('notificationclick', (event) => {
  console.log('SW: On notification click: ', event)
  const data = event.notification.data
  const url = [
    data.projectId ? `/${data.projectId}` : '/',
    data.projectId && data.cardId ? `/cards/${data.cardId}` : '',
    // @TODO: when routing for chats is ready
    // @eugeek data.projectId && data.cardId && data.chatId ? `/chats/${data.chatId}` : ""
  ].join('')

  event.notification.close()

  // This looks to see if the current is already open and
  // focuses if it is
  event.waitUntil(
    clients
      .matchAll({
        type: 'window',
      })
      .then((clientList) => {
        for (const client of clientList) {
          console.log('client', client, client.url)
          if ('focus' in client) {
            client.postMessage({
              type: 'navigate',
              url: url,
            })
            return client.focus()
          }
        }
        if (clients.openWindow) return clients.openWindow(url)
      }),
  )
})

async function updateSubscription(event) {
  const subscription = await self.registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
  })

  fetch('/push/patch-subscription', {
    method: 'PATCH',
    body: JSON.stringify({
      old: event.oldSubscription,
      current: subscription,
    }),
    headers: { 'Content-Type': 'application/json' },
  })
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/pushsubscriptionchange_event
 * Pushsubscriptionchange event listener.
 */
self.addEventListener('pushsubscriptionchange', (event) => {
  console.log('pushsubscriptionchange', event)
  event.waitUntil(updateSubscription(event).catch(console.error))
})
