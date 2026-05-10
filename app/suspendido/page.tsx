'use client'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'

export default function SuspendidoPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', background: '#0F0F13' }}>
      <div style={{ width: '100%', maxWidth: 400, textAlign: 'center' }}>

        <div style={{ width: 64, height: 64, borderRadius: 16, background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>

        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 8 }}>
          FlowPass
        </div>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 42, letterSpacing: '0.04em', color: '#fff', lineHeight: 1, marginBottom: 16 }}>
          Cuenta pausada
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, marginBottom: 8 }}>
          Tu periodo de prueba ha terminado o tu suscripción está pendiente de pago.
        </p>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)', marginBottom: 36 }}>
          Contáctanos para reactivar tu cuenta.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <a
            href="mailto:hola@flowpass.mx?subject=Quiero reactivar mi cuenta"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '14px', borderRadius: 12, background: '#FF5C1F', color: '#fff', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}
          >
            Contactar soporte
          </a>
          <button
            onClick={() => signOut(auth).then(() => window.location.replace('/login'))}
            style={{ padding: '14px', borderRadius: 12, background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.45)', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}
          >
            Cerrar sesión
          </button>
        </div>

        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'rgba(255,255,255,0.15)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 40 }}>
          Powered by FlowStudio
        </p>
      </div>
    </div>
  )
}
