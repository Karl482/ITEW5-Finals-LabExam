import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { registerServiceWorker } from './serviceWorkerRegistration';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register service worker with update handling
registerServiceWorker({
  onSuccess: () => {
    console.log('Service worker registered successfully');
    console.log('App is ready for offline use');
  },
  onUpdate: () => {
    console.log('New content is available; please refresh');
    // You can show a notification to the user here
  },
  onOfflineReady: () => {
    console.log('App is ready to work offline');
  },
  onNeedRefresh: () => {
    console.log('New content available, click to refresh');
    // You can show a prompt to the user to refresh the page
  }
});
