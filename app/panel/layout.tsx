'use client'
import React, { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useFlowPassAuth } from '@/lib/useFlowPassAuth'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'

const NAV = [
  { href: '/panel',            label: 'Inicio',     icon: '⊞', exact: true },
  { href: '/panel/alumnos',    label: 'Alumnos',    icon: '◈' },
  { href: '/panel/pagos',      label: 'Pagos',      icon: '◇' },
  { href: '/panel/asistencia', label: 'Asistencia', icon: '◉' },
  { href: '/panel/temas',      label: 'Temas',      icon: '◐' },
  { href: '/panel/ajustes',    label: 'Ajustes',    icon: '◎' },
]

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: color-mix(in srgb, var(--fp-accent) 25%, transparent); border-radius: 2px; }

  .fp-nav-link {
    display: flex; align-items: center; gap: 11px; padding: 10px 16px;
    margin: 1px 10px; border-radius: 9px; font-size: 13.5px; font-weight: 500;
    text-decoration: none; color: rgba(255,255,255,0.4); letter-spacing: 0.01em;
    transition: all .15s; border: 1px solid transparent;
  }
  .fp-nav-link:hover { color: rgba(255,255,255,0.8); background: rgba(255,255,255,0.05); }
  .fp-nav-link.active { color: #fff; background: var(--fp-accent-dim); border-color: color-mix(in srgb, var(--fp-accent) 18%, transparent); }
  .fp-nav-link.active .fp-nav-icon { color: var(--fp-accent); }
  .fp-nav-icon { font-size: 13px; width: 16px; text-align: center; flex-shrink: 0; transition: color .15s; }

  /* ── Cards ── */
  .fp-card {
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px;
  }

  /* ── Buttons ── */
  .fp-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 7px;
    padding: 9px 18px; border-radius: 9px; font-weight: 600; font-size: 13.5px;
    cursor: pointer; transition: all .15s; white-space: nowrap; font-family: inherit; border: none;
  }
  .fp-btn-primary { background: var(--fp-accent); color: #fff; }
  .fp-btn-primary:hover { filter: brightness(0.88); transform: translateY(-1px); }
  .fp-btn-primary:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }
  .fp-btn-ghost { background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.75); border: 1px solid rgba(255,255,255,0.1); }
  .fp-btn-ghost:hover { background: rgba(255,255,255,0.12); color: #fff; }
  .fp-btn-danger { background: rgba(181,56,37,0.15); color: #f87171; border: 1px solid rgba(181,56,37,0.25); }
  .fp-btn-danger:hover { background: rgba(181,56,37,0.25); }

  /* ── Inputs ── */
  .fp-input {
    width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
    border-radius: 9px; color: #fff; padding: 10px 13px; font-size: 14px;
    font-family: inherit; outline: none; transition: border-color .15s;
  }
  .fp-input:focus { border-color: color-mix(in srgb, var(--fp-accent) 45%, transparent); background: rgba(255,255,255,0.07); }
  .fp-input::placeholder { color: rgba(255,255,255,0.2); }
  .fp-label {
    display: block; font-size: 10.5px; font-weight: 600; letter-spacing: 0.08em;
    text-transform: uppercase; color: rgba(255,255,255,0.35); margin-bottom: 6px;
    font-family: 'JetBrains Mono', monospace;
  }

  /* ── Table ── */
  .fp-table { width: 100%; border-collapse: collapse; }
  .fp-table th {
    padding: 11px 16px; text-align: left; font-family: 'JetBrains Mono', monospace;
    font-size: 9.5px; letter-spacing: 0.14em; text-transform: uppercase;
    color: rgba(255,255,255,0.28); font-weight: 400; border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .fp-table td { padding: 13px 16px; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 13.5px; }
  .fp-table tr:last-child td { border-bottom: none; }
  .fp-table tbody tr { transition: background .1s; }
  .fp-table tbody tr:hover td { background: rgba(255,255,255,0.025); }

  /* ── Badge ── */
  .fp-badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
  .fp-badge-green  { background: rgba(34,197,94,0.12); color: #4ade80; border: 1px solid rgba(34,197,94,0.2); }
  .fp-badge-yellow { background: rgba(234,179,8,0.12); color: #fbbf24; border: 1px solid rgba(234,179,8,0.2); }
  .fp-badge-red    { background: rgba(239,68,68,0.12); color: #f87171; border: 1px solid rgba(239,68,68,0.2); }
  .fp-badge-blue   { background: rgba(99,102,241,0.12); color: #a5b4fc; border: 1px solid rgba(99,102,241,0.2); }

  /* ── Modal ── */
  .fp-modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.65); backdrop-filter: blur(6px);
    z-index: 200; display: flex; align-items: center; justify-content: center; padding: 24px;
    animation: fp-fade-in .15s ease;
  }
  .fp-modal {
    background: var(--fp-surface); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px;
    padding: 28px 32px; width: 100%; max-height: 90vh; overflow-y: auto;
    box-shadow: 0 32px 80px rgba(0,0,0,0.5);
  }

  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fp-fade-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  .fp-fade-in { animation: fp-fade-in .2s ease; }
`

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  const auth_ = useFlowPassAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (auth_.redirectTo) router.replace(auth_.redirectTo)
  }, [auth_.redirectTo, router])

  const themeStyle = Object.entries(auth_.cssVars)
    .map(([k, v]) => `${k}:${v}`)
    .join(';')
  const themeCss = `:root{${themeStyle}}`

  if (!auth_.ready) {
    return (
      <>
        <style>{css}</style>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--fp-bg, #0F0F13)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 32, height: 32, border: '2.5px solid var(--fp-accent-dim, rgba(255,92,31,0.2))', borderTopColor: 'var(--fp-accent, #FF5C1F)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase' }}>cargando</span>
          </div>
        </div>
      </>
    )
  }

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

  const initials = (auth_.negocioNombre || 'FP')
    .split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()

  return (
    <>
      <style>{css}</style>
      <style>{themeCss}</style>
      <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--fp-bg)', color: '#fff', fontFamily: 'var(--fp-font-body)' }}>

        {/* ── Sidebar ── */}
        <aside style={{ width: 228, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh', background: 'rgba(255,255,255,0.01)' }}>

          {/* Marca */}
          <div style={{ padding: '18px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 30, height: 30, background: 'var(--fp-accent)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontFamily: 'var(--fp-font-heading)', fontSize: 17, color: '#fff', lineHeight: 1 }}>F</span>
              </div>
              <div>
                <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 15, letterSpacing: '0.06em', color: '#fff', lineHeight: 1 }}>FlowPass</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8.5, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 2 }}>Panel</div>
              </div>
            </div>
          </div>

          {/* Negocio */}
          <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: 'var(--fp-hero-bg)', border: '1px solid color-mix(in srgb, var(--fp-accent) 25%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: 'var(--fp-font-heading)', fontSize: 13, color: '#fff', letterSpacing: '0.04em' }}>
              {initials}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{auth_.negocioNombre || 'Mi negocio'}</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 1 }}>{auth_.userName}</div>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: '8px 0' }}>
            {NAV.map(item => (
              <Link key={item.href} href={item.href}
                className={`fp-nav-link${isActive(item.href, item.exact) ? ' active' : ''}`}>
                <span className="fp-nav-icon">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Salir */}
          <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <button onClick={() => signOut(auth).then(() => router.replace('/login'))}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.25)', cursor: 'pointer', fontSize: 11.5, fontFamily: "'JetBrains Mono',monospace", letterSpacing: '0.1em', textTransform: 'uppercase', padding: 0, transition: 'color .15s', display: 'flex', alignItems: 'center', gap: 7 }}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.25)')}>
              ↪ Salir
            </button>
          </div>
        </aside>

        {/* ── Main ── */}
        <main style={{ flex: 1, overflow: 'auto' }}>{children}</main>
      </div>
    </>
  )
}
