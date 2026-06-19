import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Wishlist from './pages/Wishlist'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/manage/login" element={<AdminLogin />} />
      <Route path="/manage" element={
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App