import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function AdminDashboard() {
  const { admin, logout } = useAuth()
  const navigate = useNavigate()
  const handleLogout = () => { logout(); navigate('/the-bills-manage/login') }

  return (
    <div style={{ minHeight:'100vh', background:'#0a0806', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:24 }}>
      <div style={{ fontFamily:'Georgia,serif', fontSize:32, color:'#c9933a', letterSpacing:'0.2em', textTransform:'uppercase' }}>Dashboard</div>
      <div style={{ color:'rgba(245,237,224,0.4)', fontSize:14 }}>{admin?.email}</div>
      <button onClick={handleLogout} style={{ padding:'10px 28px', background:'#c9933a', color:'#0a0806', border:'none', fontFamily:'Georgia,serif', fontSize:12, letterSpacing:'0.2em', textTransform:'uppercase', cursor:'pointer' }}>Logout</button>
    </div>
  )
}