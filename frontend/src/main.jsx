import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext' // 1. Import AuthProvider

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      {/* 2. Wrap the App with AuthProvider */}
      <AuthProvider> 
        <App />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)