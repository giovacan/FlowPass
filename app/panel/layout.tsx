'use client'
import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useFlowPassAuth } from '@/lib/useFlowPassAuth'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'

const NAV = [
  { href: '/panel', label: 'Dashboard', icon: '🏠', exact: true },
  { href: '/panel/alumnos', label: 'Alumnos', icon: '👥' },
  { href: '/panel/pagos', label: 'Pagos', icon: '💳' },
  { href: '/panel/asistencia', label: 'Asistencia', icon: '✅' },
  { href: '/panel/ajustes', label: 'Ajustes', icon: '⚙️' },
]

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  const auth_ = useFlowPassAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (auth_.redirectTo) router.replace(auth_.redirectTo)
  }, [auth_.redirectTo, router])

  if (!auth_.ready) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0B0908' }}>
        <div style={{ color: '#D4A547', fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: '0.2em' }}>CARGANDO...</div>
      </div>
    )
  }

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0B0908', color: '#E8DCC4', fontFamily: "'Manrope', system-ui, sans-serif" }}>
      {/* Sidebar */}
      <aside style={{ width: 220, borderRight: '1px solid rgba(232,220,196,0.14)', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh' }}>
        <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(232,220,196,0.14)' }}>
          <div style={{ fontFamily: "'Big Shoulders Display', sans-serif", fontWeight: 900, fontSize: 18, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {auth_.negocioNombre || 'FlowPass'}
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#574E40', marginTop: 4 }}>
            {auth_.userName}
          </div>
        </div>

        <nav style={{ flex: 1, padding: '12px 0' }}>
          {NAV.map(item => (
            <Link key={item.href} href={item.href}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 20px',
                color: isActive(item.href, item.exact) ? '#E8DCC4' : '#574E40',
                background: isActive(item.href, item.exact) ? 'rgba(232,220,196,0.07)' : 'transparent',
                borderLeft: isActive(item.href, item.exact) ? '3px solid #D4A547' : '3px solid transparent',
                textDecoration: 'none', fontSize: 14, fontWeight: 600,
                transition: 'all .15s',
              }}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(232,220,196,0.14)' }}>
          <button onClick={() => signOut(auth).then(() => router.replace('/login'))}
            style={{ appearance: 'none', background: 'transparent', border: 'none', color: '#574E40', cursor: 'pointer', fontSize: 12, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.14em', textTransform: 'uppercase', padding: 0 }}>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflow: 'auto' }}>{children}</main>
    </div>
  )
}
