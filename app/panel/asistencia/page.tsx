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

  return (
    <div style={{ padding: 40 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.2em', color: '#574E40', textTransform: 'uppercase', marginBottom: 6 }}>Control de</div>
          <h1 style={{ fontFamily: "'Big Shoulders Display', sans-serif", fontWeight: 900, fontSize: 48, textTransform: 'uppercase', margin: 0 }}>Asistencia</h1>
        </div>
        <input type="date" value={fecha} onChange={e => setFecha(e.target.value)}
          style={{ background: '#0B0908', border: '1px solid rgba(232,220,196,0.28)', color: '#E8DCC4', padding: '12px 16px', fontSize: 14, fontFamily: 'inherit', outline: 'none' }} />
      </div>

      {/* Stat */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 32, flexWrap: 'wrap' }}>
        <div style={{ background: '#15110D', border: '1px solid rgba(232,220,196,0.14)', padding: '20px 28px' }}>
          <div style={{ fontFamily: "'Big Shoulders Display', sans-serif", fontWeight: 900, fontSize: 48, color: '#3FA09A', lineHeight: 1 }}>{presentes.size}</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#574E40', marginTop: 6 }}>Presentes hoy</div>
        </div>
        <div style={{ background: '#15110D', border: '1px solid rgba(232,220,196,0.14)', padding: '20px 28px' }}>
          <div style={{ fontFamily: "'Big Shoulders Display', sans-serif", fontWeight: 900, fontSize: 48, color: '#574E40', lineHeight: 1 }}>{alumnos.length - presentes.size}</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#574E40', marginTop: 6 }}>Ausentes</div>
        </div>
      </div>

      <input placeholder="Buscar alumno..." value={buscar} onChange={e => setBuscar(e.target.value)}
        style={{ background: '#0B0908', border: '1px solid rgba(232,220,196,0.28)', color: '#E8DCC4', padding: '12px 14px', fontSize: 14, fontFamily: 'inherit', outline: 'none', width: '100%', maxWidth: 360, marginBottom: 24, boxSizing: 'border-box' }} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 8 }}>
        {filtrados.map(a => {
          const presente = presentes.has(a.id)
          const loading = toggling === a.id
          return (
            <button key={a.id} onClick={() => toggle(a)} disabled={loading}
              style={{
                appearance: 'none', cursor: loading ? 'wait' : 'pointer',
                background: presente ? 'rgba(63,160,154,0.12)' : '#15110D',
                border: `1px solid ${presente ? '#3FA09A' : 'rgba(232,220,196,0.14)'}`,
                padding: '18px 20px', textAlign: 'left', transition: 'all .15s',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                opacity: loading ? 0.5 : 1,
              }}>
              <div>
                <div style={{ color: '#E8DCC4', fontWeight: 600, fontSize: 15 }}>{a.nombre} {a.apellido}</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#574E40', marginTop: 4 }}>
                  {a.subcategoria} · {a.grado}
                </div>
              </div>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                background: presente ? '#3FA09A' : 'transparent',
                border: `2px solid ${presente ? '#3FA09A' : 'rgba(232,220,196,0.2)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: presente ? '#0B0908' : 'transparent', fontSize: 16, fontWeight: 900,
              }}>✓</div>
            </button>
          )
        })}
        {filtrados.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: 40, textAlign: 'center', color: '#574E40', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.14em' }}>SIN ALUMNOS</div>
        )}
      </div>
    </div>
  )
}
