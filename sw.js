// SafarShare Background Service Worker Engine
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Background Push & Hardware Vibration Notification
self.addEventListener('push', (event) => {
  let data = { title: 'SafarShare Alert', body: 'New trip or booking update available!' };
  if (event.data) {
    try {
      data = event.data.json();
    } catch(e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: 'https://cdn-icons-png.flaticon.com/512/3202/3202926.png',
    badge: 'https://cdn-icons-png.flaticon.com/512/3202/3202926.png',
    vibrate: [500, 150, 500, 150, 500], // 3 Strong Vibrations on screen-off
    requireInteraction: true,
    tag: 'safarshare-alert',
    renotify: true,
    data: { url: './index.html' }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('index.html') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('./index.html');
      }
    })
  );
});
