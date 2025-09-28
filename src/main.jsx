import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles.css'
import BibleStudyLMS from './BibleStudyLMS.jsx'
import { AuthProvider } from "./context/AuthContext";
function bootstrapTheme() {
  const stored = localStorage.getItem('theme')
  if (stored === 'dark') document.documentElement.classList.add('dark')
}
bootstrapTheme()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
     <AuthProvider>
    <BibleStudyLMS />
    </AuthProvider>
  </React.StrictMode>
)
