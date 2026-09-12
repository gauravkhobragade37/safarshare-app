// Give the service worker access to Firebase Messaging.
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker with YOUR REAL CONFIG
firebase.initializeApp({
  apiKey: "AIzaSyAdv9cNM-CIYEigks0OysevRlavcFEm1UM",
  authDomain: "safarshare-7fc91.firebaseapp.com",
  projectId: "safarshare-7fc91",
  storageBucket: "safarshare-7fc91.firebasestorage.app",
  messagingSenderId: "838587520163",
  appId: "1:838587520163:web:8b84c6954939093a61db16"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification?.title || 'SafarShare Alert';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new update on SafarShare.',
    icon: 'https://cdn-icons-png.flaticon.com/512/1048/1048313.png' // Default Car Icon
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// 🛡️ FIX: Ignore Firebase / Firestore network requests in Service Worker cache to prevent TypeError
self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  if (url.includes('firestore.googleapis.com') || url.includes('firebase') || url.includes('googleapis.com')) {
    return; // इन्हें सर्विस वर्कर बाईपास कर देगा और कोई क्रैश नहीं होगा
  }
});
