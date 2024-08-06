// https://github.com/mdn/serviceworker-cookbook/blob/master/push-simple/index.js

// This function is needed because Chrome doesn't accept a base64 encoded string
// as value for applicationServerKey in pushManager.subscribe yet
// https://bugs.chromium.org/p/chromium/issues/detail?id=802280
function urlBase64ToUint8Array(base64String) {
  var padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  var base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')

  var rawData = window.atob(base64)
  var outputArray = new Uint8Array(rawData.length)

  for (var i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

// Register a Service Worker.
navigator.serviceWorker.register('/service-worker.js')

navigator.serviceWorker.addEventListener("message", (event) => {
  console.log('sw message', event.data);
  if (event.data.type === 'navigate') {
    window.location.href = event.data.url;
  }
});

const BACKEND_URL = process.env.VITE_BACKEND_URL || 'https://api.dun.wtf'

async function apiCall(url: string, token: string, method = 'GET', body?: string) {
  return fetch(BACKEND_URL + url, {
    method,
    body,
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
}

export async function registerForPushNotifications(token: string) {
  const result = await Notification.requestPermission()
  // console.log('registerForPushNotifications', token, result)
  if (result === 'granted') {
    const registration = await navigator.serviceWorker.ready;
    console.log('registration', registration);

    let subscription = await registration.pushManager.getSubscription();
    console.log('subscription', subscription);

    if (!subscription) {
      const response = await apiCall('/push/vapidPublicKey', token);
      const vapidPublicKey = await response.text();
      const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey,
      });
    }
    await apiCall('/push/register', token, 'POST', JSON.stringify({ subscription }));
  }
}

// @TODO
export async function unregisterForPushNotifications(token: string) {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  if (subscription) {
    await subscription.unsubscribe();
    await apiCall('/push/unregister', token, 'DELETE', JSON.stringify({ subscription }));
  }
}