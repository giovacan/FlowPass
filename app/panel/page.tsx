'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useFlowPassAuth } from '@/lib/useFlowPassAuth'
import { getAlumnos, getPagos } from '@/lib/firestore'

export default function Dashboard() {
  const { tenantId, negocioNombre, userName, ready } = useFlowPassAuth()
  const [stats, setStats]   = useState({ alumnos: 0, pagosHoy: 0, ingresosMes: 0, vencidos: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!tenantId) return
    const mes = new Date().toISOString().slice(0, 7)
    Promise.all([getAlumnos(tenantId), getPagos(tenantId, mes)]).then(([alumnos, pagos]) => {
      const hoy = new Date().toISOString().slice(0, 10)
      setStats({
        alumnos:     alumnos.filter(a => a.activo).length,
        pagosHoy:    pagos.filter(p => p.fecha === hoy).length,
        ingresosMes: pagos.reduce((s, p) => s + p.monto, 0),
        vencidos:    alumnos.filter(a => a.activo && a.estadoPago === 'vencido').length,
      })
      setLoading(false)
    })
  }, [tenantId])

  if (!ready) return null

  const hora = new Date().getHours()
  const saludo = hora < 12 ? 'Buenos días' : hora < 19 ? 'Buenas tardes' : 'Buenas noches'
  const mesLabel = new Date().toLocaleDateString('es', { month: 'long', year: 'numeric' })

  const CARDS = [
    {
      label: 'Alumnos activos',
      value: stats.alumnos,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      color: '#60a5fa', bg: 'rgba(96,165,250,0.08)', border: 'rgba(96,165,250,0.15)',
      href: '/panel/alumnos',
    },
    {
      label: 'Ingresos del mes',
      value: `$${stats.ingresosMes.toLocaleString()}`,
      sub: mesLabel,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
      ),
      color: '#4ade80', bg: 'rgba(74,222,128,0.07)', border: 'rgba(74,222,128,0.14)',
      href: '/panel/pagos',
    },
    {
      label: 'Pagos hoy',
      value: stats.pagosHoy,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
        </svg>
      ),
      color: '#fbbf24', bg: 'rgba(251,191,36,0.07)', border: 'rgba(251,191,36,0.14)',
      href: '/panel/pagos',
    },
    {
      label: 'Pagos vencidos',
      value: stats.vencidos,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      ),
      color: stats.vencidos > 0 ? '#f87171' : '#4ade80',
      bg: stats.vencidos > 0 ? 'rgba(248,113,113,0.07)' : 'rgba(74,222,128,0.07)',
      border: stats.vencidos > 0 ? 'rgba(248,113,113,0.14)' : 'rgba(74,222,128,0.14)',
      href: '/panel/alumnos',
    },
  ]

  const ACCIONES = [
    { href: '/panel/alumnos',    label: 'Nuevo alumno',      desc: 'Registrar miembro',     icon: '＋' },
    { href: '/panel/asistencia', label: 'Lista de hoy',      desc: 'Marcar asistencia',     icon: '✓' },
    { href: '/panel/pagos',      label: 'Registrar pago',    desc: 'Cobrar mensualidad',    icon: '◇' },
  ]

  return (
    <div className="fp-fade-in" style={{ padding: '36px 40px', maxWidth: 1100 }}>

      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 8 }}>
          {saludo}, {userName} —
        </div>
        <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 52, letterSpacing: '0.02em', color: '#fff', lineHeight: 0.95, marginBottom: 6 }}>
          {negocioNombre || 'Dashboard'}
        </h1>
        <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.35)', fontWeight: 400 }}>
          {new Date().toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 36 }}>
        {CARDS.map(c => (
          <Link key={c.label} href={c.href} style={{ textDecoration: 'none' }}>
            <div className="fp-card" style={{ padding: '22px 22px', background: c.bg, borderColor: c.border, cursor: 'pointer', transition: 'transform .15s, border-color .15s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ color: c.color, opacity: 0.9 }}>{c.icon}</div>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' }}>↗</span>
              </div>
              {loading
                ? <div style={{ height: 36, width: 60, background: 'rgba(255,255,255,0.06)', borderRadius: 6, marginBottom: 8 }} />
                : <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 42, color: c.color, lineHeight: 1, letterSpacing: '0.02em', marginBottom: 6 }}>{c.value}</div>
              }
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>{c.label}</div>
              {c.sub && <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: 'rgba(255,255,255,0.2)', marginTop: 3, textTransform: 'capitalize' }}>{c.sub}</div>}
            </div>
          </Link>
        ))}
      </div>

      {/* Acciones rápidas */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9.5, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', marginBottom: 14 }}>
          Acciones rápidas
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
          {ACCIONES.map(a => (
            <Link key={a.href} href={a.href} style={{ textDecoration: 'none' }}>
              <div className="fp-card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', transition: 'all .15s' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(255,92,31,0.06)'; el.style.borderColor = 'rgba(255,92,31,0.2)' }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(255,255,255,0.04)'; el.style.borderColor = 'rgba(255,255,255,0.08)' }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(255,92,31,0.1)', border: '1px solid rgba(255,92,31,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF5C1F', fontSize: 15, flexShrink: 0 }}>
                  {a.icon}
                </div>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: '#fff', marginBottom: 2 }}>{a.label}</div>
                  <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.35)' }}>{a.desc}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  )
}
