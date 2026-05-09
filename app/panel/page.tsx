'use client'
import { useEffect, useState } from 'react'
import { useFlowPassAuth } from '@/lib/useFlowPassAuth'
import { getAlumnos, getPagos } from '@/lib/firestore'

export default function Dashboard() {
  const { tenantId, negocioNombre, ready } = useFlowPassAuth()
  const [stats, setStats] = useState({ alumnos: 0, pagosHoy: 0, ingresosMes: 0, vencidos: 0 })

  useEffect(() => {
    if (!tenantId) return
    const mes = new Date().toISOString().slice(0, 7)
    Promise.all([
      getAlumnos(tenantId),
      getPagos(tenantId, mes),
    ]).then(([alumnos, pagos]) => {
      const hoy = new Date().toISOString().slice(0, 10)
      setStats({
        alumnos:     alumnos.filter(a => a.activo).length,
        pagosHoy:    pagos.filter(p => p.fecha === hoy).length,
        ingresosMes: pagos.reduce((s, p) => s + p.monto, 0),
        vencidos:    alumnos.filter(a => a.activo && a.estadoPago === 'vencido').length,
      })
    })
  }, [tenantId])

  if (!ready) return null

  const cards = [
    { label: 'Alumnos activos', value: stats.alumnos, color: '#3FA09A', icon: '👥' },
    { label: 'Pagos hoy', value: stats.pagosHoy, color: '#D4A547', icon: '💳' },
    { label: 'Ingresos del mes', value: `$${stats.ingresosMes.toLocaleString()}`, color: '#2E7D7A', icon: '💰' },
    { label: 'Pagos vencidos', value: stats.vencidos, color: '#B53825', icon: '⚠️' },
  ]

  return (
    <div style={{ padding: 40 }}>
      <div style={{ marginBottom: 40 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.2em', color: '#574E40', textTransform: 'uppercase', marginBottom: 8 }}>
          Panel de control
        </div>
        <h1 style={{ fontFamily: "'Big Shoulders Display', sans-serif", fontWeight: 900, fontSize: 48, textTransform: 'uppercase', margin: 0 }}>
          {negocioNombre || 'Dashboard'}
        </h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 48 }}>
        {cards.map(c => (
          <div key={c.label} style={{ background: '#15110D', border: '1px solid rgba(232,220,196,0.14)', padding: '28px 24px' }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>{c.icon}</div>
            <div style={{ fontFamily: "'Big Shoulders Display', sans-serif", fontWeight: 900, fontSize: 40, color: c.color, lineHeight: 1 }}>{c.value}</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#574E40', marginTop: 8 }}>{c.label}</div>
          </div>
        ))}
      </div>

      <div style={{ background: '#15110D', border: '1px solid rgba(232,220,196,0.14)', padding: 32 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.2em', color: '#D4A547', textTransform: 'uppercase', marginBottom: 20 }}>
          Accesos rápidos
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {[
            { href: '/panel/alumnos', label: 'Nuevo alumno', icon: '➕' },
            { href: '/panel/asistencia', label: 'Asistencia hoy', icon: '✅' },
            { href: '/panel/pagos', label: 'Registrar pago', icon: '💳' },
          ].map(a => (
            <a key={a.href} href={a.href}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '14px 20px', background: 'transparent', border: '1px solid rgba(232,220,196,0.28)', color: '#E8DCC4', textDecoration: 'none', fontFamily: "'Big Shoulders Display', sans-serif", fontWeight: 800, fontSize: 16, textTransform: 'uppercase', letterSpacing: '0.04em', transition: 'border-color .15s' }}>
              {a.icon} {a.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
