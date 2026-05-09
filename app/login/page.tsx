'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth'
import { auth, googleProvider } from '@/lib/firebase'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function loginGoogle() {
    setLoading(true); setError('')
    try {
      await signInWithPopup(auth, googleProvider)
      router.replace('/panel')
    } catch (e: any) {
      setError('No se pudo iniciar sesión con Google.')
    } finally { setLoading(false) }
  }

  async function loginEmail(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.replace('/panel')
    } catch {
      setError('Correo o contraseña incorrectos.')
    } finally { setLoading(false) }
  }

  const inp: React.CSSProperties = { width: '100%', background: '#0B0908', border: '1px solid rgba(232,220,196,0.28)', color: '#E8DCC4', padding: '14px 16px', fontSize: 15, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }

  return (
    <div style={{ minHeight: '100vh', background: '#0B0908', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: "'Manrope', system-ui, sans-serif", color: '#E8DCC4' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontFamily: "'Big Shoulders Display', sans-serif", fontWeight: 900, fontSize: 48, textTransform: 'uppercase', lineHeight: 0.9 }}>
            Flow<span style={{ color: '#B53825' }}>Pass</span>
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#574E40', marginTop: 10 }}>
            Panel de gestión
          </div>
        </div>

        <div style={{ background: '#15110D', border: '1px solid rgba(232,220,196,0.14)', padding: 36 }}>
          <button onClick={loginGoogle} disabled={loading}
            style={{ appearance: 'none', width: '100%', background: 'transparent', border: '1px solid rgba(232,220,196,0.28)', color: '#E8DCC4', padding: '14px 20px', cursor: 'pointer', fontSize: 15, fontFamily: "'Big Shoulders Display', sans-serif", fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <span>G</span> Continuar con Google
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(232,220,196,0.14)' }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.2em', color: '#574E40' }}>O</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(232,220,196,0.14)' }} />
          </div>

          <form onSubmit={loginEmail} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <label>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.2em', color: '#574E40', textTransform: 'uppercase', marginBottom: 8 }}>Correo</div>
              <input style={inp} type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </label>
            <label>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.2em', color: '#574E40', textTransform: 'uppercase', marginBottom: 8 }}>Contraseña</div>
              <input style={inp} type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </label>
            {error && <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#B53825', letterSpacing: '0.1em' }}>{error}</div>}
            <button type="submit" disabled={loading}
              style={{ appearance: 'none', background: '#B53825', border: '1px solid #B53825', color: '#E8DCC4', padding: '16px', fontFamily: "'Big Shoulders Display', sans-serif", fontWeight: 800, fontSize: 20, textTransform: 'uppercase', cursor: 'pointer', letterSpacing: '0.04em', opacity: loading ? 0.6 : 1 }}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
