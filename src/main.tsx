import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

window.onerror = function (message, source, lineno, colno, error) {
  alert("Error: " + message + " at line " + lineno);
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
