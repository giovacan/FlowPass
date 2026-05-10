'use client'
import { useEffect, useState } from 'react'
import { useFlowPassAuth } from '@/lib/useFlowPassAuth'
import { getAlumnos, toggleAsistencia, getAsistencia, type AlumnoDoc, type AsistenciaDoc } from '@/lib/firestore'

export default function AsistenciaPage() {
  const { tenantId, ready } = useFlowPassAuth()
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10))
  const [alumnos, setAlumnos] = useState<AlumnoDoc[]>([])
  const [asistencia, setAsistencia] = useState<AsistenciaDoc[]>([])
  const [buscar, setBuscar] = useState('')
  const [toggling, setToggling] = useState<string | null>(null)

  useEffect(() => {
    if (!tenantId) return
    getAlumnos(tenantId).then(list => setAlumnos(list.filter(a => a.activo)))
  }, [tenantId])

  useEffect(() => {
    if (!tenantId) return
    getAsistencia(tenantId, fecha).then(setAsistencia)
  }, [tenantId, fecha])

  if (!ready) return null

  const presentes = new Set(asistencia.map(a => a.alumnoId))
  const filtrados = alumnos.filter(a =>
    `${a.nombre} ${a.apellido}`.toLowerCase().includes(buscar.toLowerCase())
  )

  async function toggle(a: AlumnoDoc) {
    if (!tenantId) return
    setToggling(a.id)
    await toggleAsistencia(tenantId, a.id, `${a.nombre} ${a.apellido}`, fecha)
    const updated = await getAsistencia(tenantId, fecha)
    setAsistencia(updated)
    setToggling(null)
  }

  const pct = alumnos.length > 0 ? Math.round((presentes.size / alumnos.length) * 100) : 0

  return (
    <div className="fp-fade-in" style={{ padding: '36px 40px', maxWidth: 1100 }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 8 }}>Control de</div>
          <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 48, letterSpacing: '0.02em', color: '#fff', lineHeight: 1, margin: 0 }}>Asistencia</h1>
        </div>
        <input
          type="date"
          value={fecha}
          onChange={e => setFecha(e.target.value)}
          className="fp-input"
          style={{ width: 'auto' }}
        />
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 32 }}>
        {[
          { label: 'Presentes',   value: presentes.size,              color: '#4ade80' },
          { label: 'Ausentes',    value: alumnos.length - presentes.size, color: 'rgba(255,255,255,0.3)' },
          { label: 'Asistencia',  value: `${pct}%`,                   color: pct >= 75 ? '#4ade80' : pct >= 50 ? '#fbbf24' : '#f87171' },
        ].map(c => (
          <div key={c.label} className="fp-card" style={{ padding: '20px 22px' }}>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 40, color: c.color, lineHeight: 1, letterSpacing: '0.02em', marginBottom: 6 }}>{c.value}</div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)' }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ marginBottom: 20 }}>
        <input
          className="fp-input"
          style={{ maxWidth: 360 }}
          placeholder="Buscar alumno..."
          value={buscar}
          onChange={e => setBuscar(e.target.value)}
        />
      </div>

      {/* Grid de alumnos */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 8 }}>
        {filtrados.map(a => {
          const presente = presentes.has(a.id)
          const isLoading = toggling === a.id
          return (
            <button
              key={a.id}
              onClick={() => toggle(a)}
              disabled={isLoading}
              style={{
                appearance: 'none', cursor: isLoading ? 'wait' : 'pointer',
                background: presente ? 'rgba(74,222,128,0.07)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${presente ? 'rgba(74,222,128,0.3)' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: 12, padding: '16px 18px', textAlign: 'left',
                transition: 'all .15s', display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', gap: 12, opacity: isLoading ? 0.5 : 1,
              }}
              onMouseEnter={e => { if (!presente) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)' }}
              onMouseLeave={e => { if (!presente) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)' }}
            >
              <div>
                <div style={{ color: '#fff', fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{a.nombre} {a.apellido}</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>
                  {a.subcategoria} · {a.grado}
                </div>
              </div>
              <div style={{
                width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                background: presente ? 'rgba(74,222,128,0.15)' : 'transparent',
                border: `1.5px solid ${presente ? '#4ade80' : 'rgba(255,255,255,0.15)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: presente ? '#4ade80' : 'transparent', fontSize: 13, fontWeight: 700,
                transition: 'all .15s',
              }}>✓</div>
            </button>
          )
        })}
        {filtrados.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: '48px 0', textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontFamily: "'JetBrains Mono',monospace", fontSize: 11, letterSpacing: '0.14em' }}>
            Sin alumnos activos
          </div>
        )}
      </div>
    </div>
  )
}
