import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ children }) {
  const { admin, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0a0806' }}>
        <div style={{ color:'#c9933a', fontFamily:'serif', fontSize:18, letterSpacing:'0.2em', textTransform:'uppercase' }}>Loading…</div>
      </div>
    )
  }

  if (!admin) {
    return <Navigate to="/the-bills-manage/login" replace />
  }

  return children
}

export default ProtectedRoute