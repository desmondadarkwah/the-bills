import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { VendorAuthProvider } from './context/VendorAuthContext'
import { UserAuthProvider } from './context/UserAuthContext'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <VendorAuthProvider>
          <UserAuthProvider>
            <App />
          </UserAuthProvider>
        </VendorAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)