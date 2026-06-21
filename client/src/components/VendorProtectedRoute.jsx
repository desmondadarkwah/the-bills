import { Navigate } from 'react-router-dom'
import { useVendorAuth } from '../context/VendorAuthContext'

function VendorProtectedRoute({ children }) {
  const { vendor, loading } = useVendorAuth()

  if (loading) {
    return (
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0a0806' }}>
        <div style={{ color:'#c9933a', fontFamily:'serif', fontSize:18, letterSpacing:'0.2em', textTransform:'uppercase' }}>Loading…</div>
      </div>
    )
  }

  if (!vendor) {
    return <Navigate to="/vendor/login" replace />
  }

  return children
}

export default VendorProtectedRoute