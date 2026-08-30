import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

window.addEventListener('error', (event) => {
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `<div style="color: red; padding: 20px; font-family: sans-serif; word-break: break-all;"><b>Runtime Error:</b><br/>${event.message} at ${event.filename}:${event.lineno}</div>`;
  }
});

window.addEventListener('unhandledrejection', (event) => {
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `<div style="color: red; padding: 20px; font-family: sans-serif; word-break: break-all;"><b>Unhandled Promise Rejection:</b><br/>${event.reason}</div>`;
  }
});

try {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );
  }
} catch (error: any) {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `<div style="color: red; padding: 20px; font-family: sans-serif; word-break: break-all;"><b>Mount Error:</b><br/>${error.message}</div>`;
  }
}
