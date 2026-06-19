import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Collections from '../components/Collections'
import About from '../components/About'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import Loader from '../components/Loader'
import WhatsAppButton from '../components/WhatsAppButton'
import { fetchSettings } from '../utils/api'

export default function Home() {
  const [settings, setSettings] = useState({})
  const [ready, setReady] = useState(false)

  useEffect(() => {
    fetchSettings()
      .then(setSettings)
      .catch(console.error)
      .finally(() => setReady(true))
  }, [])

  return (
    <div style={{ background:'#0a0806' }}>
      {!ready && <Loader />}
      <Navbar settings={settings} />
      <Hero settings={settings} />
      <Collections settings={settings} />
      <About settings={settings} />
      <Contact settings={settings} />
      <Footer settings={settings} />
      <WhatsAppButton />
    </div>
  )
}

