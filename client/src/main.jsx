import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#111827',
            color: '#f9fafb',
            border: '1px solid rgba(245, 158, 11, 0.15)',
            borderRadius: '10px',
          },
          success: {
            iconTheme: { primary: '#f59e0b', secondary: '#0a0e1a' },
          },
        }}
      />
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
