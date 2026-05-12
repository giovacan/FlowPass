'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { getNegocio, type NegocioDoc } from '@/lib/firestore'

interface NegocioData extends NegocioDoc {
  abierto: boolean
}

export default function TenantPublicPage() {
  const pathname = usePathname()
  const tenantId = pathname.split('/').filter(Boolean)[0] ?? '_'

  const [negocio, setNegocio] = useState<NegocioData | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!tenantId || tenantId === '_') { setNotFound(true); setLoading(false); return }
    getNegocio(tenantId)
      .then(data => {
        if (!data.nombre) { setNotFound(true) } else { setNegocio(data) }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [tenantId])

  if (loading) return <LoadingScreen />
  if (notFound || !negocio) return <NotFoundScreen />

  return <TenantPage negocio={negocio} />
}

// ─── Loading ──────────────────────────────────────────────────────────────────

function LoadingScreen() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0F0F13' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ width: 36, height: 36, border: '3px solid rgba(255,92,31,0.2)', borderTopColor: '#FF5C1F', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
    </div>
  )
}

function NotFoundScreen() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0F0F13', color: '#fff', fontFamily: 'system-ui, sans-serif', flexDirection: 'column', gap: 12 }}>
      <p style={{ fontSize: 48, fontWeight: 700 }}>404</p>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Página no encontrada</p>
    </div>
  )
}

// ─── Página pública ───────────────────────────────────────────────────────────

function TenantPage({ negocio }: { negocio: NegocioData }) {
  const isDark = negocio.plantilla !== 'claro'
  const waLink = negocio.telefono
    ? `https://wa.me/${negocio.telefono.replace(/\D/g, '')}?text=Hola%2C+quiero+información+sobre+sus+clases`
    : '#'

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: var(--bg); color: var(--ink); font-family: 'Inter', system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
        :root {
          --bg:       ${isDark ? '#0F0F13' : '#F8F7F5'};
          --surface:  ${isDark ? '#18181D' : '#FFFFFF'};
          --ink:      ${isDark ? '#FFFFFF' : '#0F0F13'};
          --ink-dim:  ${isDark ? 'rgba(255,255,255,0.45)' : 'rgba(15,15,19,0.5)'};
          --line:     ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(15,15,19,0.08)'};
          --accent:   #FF5C1F;
          --accent-2: #E04510;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadein { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
        .fadein   { animation: fadein 0.7s ease both; }
        .fadein-2 { animation: fadein 0.7s 0.15s ease both; }
        .fadein-3 { animation: fadein 0.7s 0.3s ease both; }
      `}</style>

      {/* NAV */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: isDark ? 'rgba(15,15,19,0.85)' : 'rgba(248,247,245,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {negocio.logoUrl ? (
              <img src={negocio.logoUrl} alt={negocio.nombre} style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover' }} />
            ) : (
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: '#fff' }}>
                {negocio.nombre.charAt(0).toUpperCase()}
              </div>
            )}
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: '0.04em' }}>{negocio.nombre}</span>
          </div>
          <a href={waLink} target="_blank" rel="noopener noreferrer"
            style={{ background: 'var(--accent)', color: '#fff', padding: '9px 18px', borderRadius: 9, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}
          >
            Inscribirse
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '80px 24px', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(255,92,31,0.12), transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 720 }}>
          {negocio.logoUrl ? (
            <img src={negocio.logoUrl} alt={negocio.nombre} className="fadein" style={{ width: 96, height: 96, borderRadius: 20, objectFit: 'cover', marginBottom: 32, boxShadow: '0 0 0 1px var(--line)', display: 'block', marginInline: 'auto' }} />
          ) : (
            <div className="fadein" style={{ width: 96, height: 96, borderRadius: 20, background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32, marginInline: 'auto', boxShadow: '0 16px 40px rgba(255,92,31,0.2)' }}>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 52, color: '#fff', lineHeight: 1 }}>{negocio.nombre.charAt(0).toUpperCase()}</span>
            </div>
          )}
          <h1 className="fadein-2" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(52px, 10vw, 100px)', lineHeight: 0.92, letterSpacing: '0.02em', marginBottom: 24 }}>
            {negocio.nombre}
          </h1>
          <p className="fadein-3" style={{ fontSize: 18, color: 'var(--ink-dim)', lineHeight: 1.6, marginBottom: 40 }}>
            {negocio.subcategoria || 'Academia de fitness y bienestar'}
            {negocio.direccion && ` · ${negocio.direccion}`}
          </p>
          <div className="fadein-3" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={waLink} target="_blank" rel="noopener noreferrer"
              style={{ background: 'var(--accent)', color: '#fff', padding: '14px 28px', borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}
            >
              Quiero inscribirme
            </a>
            <a href="#info"
              style={{ background: 'transparent', color: 'var(--ink)', padding: '14px 28px', borderRadius: 12, fontSize: 15, fontWeight: 600, textDecoration: 'none', border: '1px solid var(--line)' }}
            >
              Ver información
            </a>
          </div>
        </div>
      </section>

      {/* INFO */}
      <section id="info" style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 16, padding: 32 }}>
            <div style={{ width: 44, height: 44, background: 'rgba(255,92,31,0.12)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, fontSize: 20 }}>💳</div>
            <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, marginBottom: 8, letterSpacing: '0.02em' }}>Membresía mensual</h3>
            {negocio.mensualidad > 0 ? (
              <>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 52, color: 'var(--accent)', lineHeight: 1 }}>
                  ${negocio.mensualidad.toLocaleString('es-MX')}
                </div>
                <div style={{ fontSize: 13, color: 'var(--ink-dim)', marginTop: 4 }}>MXN / mes</div>
              </>
            ) : (
              <div style={{ fontSize: 15, color: 'var(--ink-dim)' }}>Consulta en WhatsApp</div>
            )}
          </div>

          {negocio.telefono && (
            <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 16, padding: 32 }}>
              <div style={{ width: 44, height: 44, background: 'rgba(255,92,31,0.12)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, fontSize: 20 }}>📱</div>
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, marginBottom: 8, letterSpacing: '0.02em' }}>Contacto</h3>
              <a href={waLink} target="_blank" rel="noopener noreferrer" style={{ fontSize: 15, color: 'var(--accent)', textDecoration: 'none' }}>
                WhatsApp → {negocio.telefono}
              </a>
            </div>
          )}

          {negocio.direccion && (
            <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 16, padding: 32 }}>
              <div style={{ width: 44, height: 44, background: 'rgba(255,92,31,0.12)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, fontSize: 20 }}>📍</div>
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, marginBottom: 8, letterSpacing: '0.02em' }}>Ubicación</h3>
              <p style={{ fontSize: 15, color: 'var(--ink-dim)', lineHeight: 1.5 }}>{negocio.direccion}</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(44px, 8vw, 72px)', color: '#fff', marginBottom: 16, letterSpacing: '0.02em', lineHeight: 0.92 }}>
            Empieza hoy
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16, marginBottom: 32 }}>
            Contáctanos por WhatsApp para más información o para agendar tu primera clase.
          </p>
          <a href={waLink} target="_blank" rel="noopener noreferrer"
            style={{ background: '#fff', color: 'var(--accent)', padding: '16px 36px', borderRadius: 12, fontSize: 16, fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}
          >
            Escribir por WhatsApp
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid var(--line)', padding: '32px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontSize: 13, color: 'var(--ink-dim)' }}>{negocio.nombre}</span>
          <span style={{ fontSize: 11, color: 'var(--ink-dim)', fontFamily: 'monospace' }}>Powered by FlowPass</span>
        </div>
      </footer>
    </>
  )
}
