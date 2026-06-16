import { useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div style={{ minHeight:'100vh', background:'#0a0806', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:24 }}>
      <div style={{ fontFamily:'Georgia,serif', fontSize:120, fontWeight:900, color:'rgba(201,147,58,0.08)', lineHeight:1, letterSpacing:'-0.04em' }}>404</div>
      <div style={{ fontFamily:'Georgia,serif', fontSize:18, color:'rgba(245,237,224,0.4)', letterSpacing:'0.2em', textTransform:'uppercase' }}>Page Not Found</div>
      <button
        onClick={() => navigate('/')}
        style={{ marginTop:16, padding:'12px 32px', background:'transparent', border:'1px solid rgba(201,147,58,0.4)', color:'#c9933a', fontFamily:'Georgia,serif', fontSize:12, letterSpacing:'0.25em', textTransform:'uppercase', cursor:'pointer', transition:'all 0.2s' }}
      >
        Back to Home
      </button>
    </div>
  )
}