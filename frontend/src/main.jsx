import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext' // Your import is correct!

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Wrap the App with the ThemeProvider */}
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)