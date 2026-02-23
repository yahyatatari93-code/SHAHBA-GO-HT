import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// كود تشغيل التطبيق كـ PWA (تطبيق موبايل)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(() => {
      console.log('Service Worker Registered');
    });
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
