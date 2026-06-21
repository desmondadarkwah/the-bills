import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Wishlist from './pages/Wishlist'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import VendorRegister from './pages/VendorRegister'
import VendorLogin from './pages/VendorLogin'
import VendorDashboard from './pages/VendorDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import VendorProtectedRoute from './components/VendorProtectedRoute'
import NotFound from './pages/NotFound'
import VendorStorefront from './pages/VendorStorefront'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/wishlist" element={<Wishlist />} />

      <Route path="/shop/:id" element={<VendorStorefront />} />

      <Route path="/manage/login" element={<AdminLogin />} />
      <Route path="/manage" element={
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      } />

      <Route path="/vendor/register" element={<VendorRegister />} />
      <Route path="/vendor/login" element={<VendorLogin />} />
      <Route path="/vendor/dashboard" element={
        <VendorProtectedRoute>
          <VendorDashboard />
        </VendorProtectedRoute>
      } />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App