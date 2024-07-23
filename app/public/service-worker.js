self.addEventListener('push', function(event) {
  const data = event.data.json();
  const { title, ...options } = data;
  console.log('push', title, options);

  event.waitUntil(
    self.registration.showNotification('DUN: '+title, options)
  );
});

self.addEventListener("notificationclick", (event) => {
  console.log("SW: On notification click: ", event.notification.tag);
  event.notification.close();

  // This looks to see if the current is already open and
  // focuses if it is
  event.waitUntil(
    clients
      .matchAll({
        type: "window",
      })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === "/" && "focus" in client) return client.focus();
        }
        if (clients.openWindow) return clients.openWindow("/");
      }),
  );
});

async function updateSubscription(event) {
  const subscription = await self.registration.pushManager
    .subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
    })

  fetch("/push/patch-subscription", {
    method: "PATCH",
    body: JSON.stringify({
      old: event.oldSubscription,
      current: subscription,
    }),
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/pushsubscriptionchange_event
 * Pushsubscriptionchange event listener.
 */
self.addEventListener("pushsubscriptionchange", (event) => {
  console.log("pushsubscriptionchange", event);
  event.waitUntil(updateSubscription(event).catch(console.error))
});
