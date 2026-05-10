'use client'
import { useEffect, useState } from 'react'
import { useFlowPassAuth } from '@/lib/useFlowPassAuth'
import { getAlumnos, getPagos, registrarPago, type AlumnoDoc, type PagoDoc } from '@/lib/firestore'

const PLANES = [
  { id: 'iniciante', label: 'Iniciante', monto: 1200 },
  { id: 'guerrero',  label: 'Guerrero',  monto: 1800 },
  { id: 'aguila',    label: 'Águila',    monto: 2800 },
]

const METODO_BADGE: Record<string, string> = {
  efectivo:      'fp-badge fp-badge-green',
  transferencia: 'fp-badge fp-badge-blue',
  tarjeta:       'fp-badge fp-badge-yellow',
}

export default function PagosPage() {
  const { tenantId, ready } = useFlowPassAuth()
  const [mes, setMes] = useState(new Date().toISOString().slice(0, 7))
  const [pagos, setPagos] = useState<PagoDoc[]>([])
  const [alumnos, setAlumnos] = useState<AlumnoDoc[]>([])
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ alumnoId: '', plan: 'guerrero', monto: 1800, metodo: 'efectivo', notas: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!tenantId) return
    getAlumnos(tenantId).then(setAlumnos)
  }, [tenantId])

  useEffect(() => {
    if (!tenantId) return
    getPagos(tenantId, mes).then(setPagos)
  }, [tenantId, mes])

  if (!ready) return null

  const total = pagos.reduce((s, p) => s + p.monto, 0)

  async function guardar() {
    if (!form.alumnoId || !tenantId) return
    setSaving(true)
    const alumno = alumnos.find(a => a.id === form.alumnoId)
    await registrarPago(tenantId, {
      alumnoId:     form.alumnoId,
      alumnoNombre: alumno ? `${alumno.nombre} ${alumno.apellido}` : '',
      monto:        form.monto,
      plan:         form.plan,
      mes,
      fecha:        new Date().toISOString().slice(0, 10),
      metodo:       form.metodo as any,
      notas:        form.notas,
    })
    setSaving(false)
    setModal(false)
    getPagos(tenantId, mes).then(setPagos)
  }

  return (
    <div className="fp-fade-in" style={{ padding: '36px 40px', maxWidth: 1100 }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 8 }}>Control de</div>
          <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 48, letterSpacing: '0.02em', color: '#fff', lineHeight: 1, margin: 0 }}>Pagos</h1>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="month"
            value={mes}
            onChange={e => setMes(e.target.value)}
            className="fp-input"
            style={{ width: 'auto' }}
          />
          <button onClick={() => setModal(true)} className="fp-btn fp-btn-primary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Registrar pago
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 32 }}>
        {[
          { label: 'Total del mes',      value: `$${total.toLocaleString()}`,                                                                      color: '#4ade80' },
          { label: 'Pagos registrados',  value: pagos.length,                                                                                       color: '#60a5fa' },
          { label: 'Promedio por pago',  value: pagos.length ? `$${Math.round(total / pagos.length).toLocaleString()}` : '—',                       color: '#fbbf24' },
        ].map(c => (
          <div key={c.label} className="fp-card" style={{ padding: '20px 22px' }}>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 40, color: c.color, lineHeight: 1, letterSpacing: '0.02em', marginBottom: 6 }}>{c.value}</div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)' }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="fp-card" style={{ overflow: 'hidden' }}>
        <table className="fp-table">
          <thead>
            <tr>
              {['Alumno', 'Plan', 'Monto', 'Método', 'Fecha', 'Notas'].map(h => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pagos.map(p => (
              <tr key={p.id}>
                <td style={{ fontWeight: 600, color: '#fff' }}>{p.alumnoNombre}</td>
                <td style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{p.plan}</td>
                <td style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 26, color: '#4ade80', letterSpacing: '0.02em', lineHeight: 1 }}>${p.monto.toLocaleString()}</td>
                <td>
                  <span className={METODO_BADGE[p.metodo] || 'fp-badge fp-badge-blue'}>{p.metodo}</span>
                </td>
                <td style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{p.fecha}</td>
                <td style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>{p.notas || '—'}</td>
              </tr>
            ))}
            {pagos.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: '48px 0', textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontFamily: "'JetBrains Mono',monospace", fontSize: 11, letterSpacing: '0.14em' }}>
                  Sin pagos en este mes
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fp-modal-overlay" onClick={e => { if (e.target === e.currentTarget) setModal(false) }}>
          <div className="fp-modal" style={{ maxWidth: 480 }}>
            <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 32, letterSpacing: '0.04em', color: '#fff', margin: '0 0 28px' }}>
              Registrar pago
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <label>
                <span className="fp-label">Alumno</span>
                <select className="fp-input" value={form.alumnoId} onChange={e => setForm(p => ({ ...p, alumnoId: e.target.value }))}>
                  <option value="" style={{ background: '#18181D' }}>— Selecciona —</option>
                  {alumnos.filter(a => a.activo).map(a => (
                    <option key={a.id} value={a.id} style={{ background: '#18181D' }}>{a.nombre} {a.apellido}</option>
                  ))}
                </select>
              </label>
              <label>
                <span className="fp-label">Plan de membresía</span>
                <select className="fp-input" value={form.plan} onChange={e => {
                  const plan = PLANES.find(p => p.id === e.target.value)
                  setForm(p => ({ ...p, plan: e.target.value, monto: plan?.monto ?? p.monto }))
                }}>
                  {PLANES.map(p => (
                    <option key={p.id} value={p.id} style={{ background: '#18181D' }}>{p.label} — ${p.monto.toLocaleString()}</option>
                  ))}
                </select>
              </label>
              <label>
                <span className="fp-label">Monto (MXN)</span>
                <input className="fp-input" type="number" value={form.monto} onChange={e => setForm(p => ({ ...p, monto: Number(e.target.value) }))} />
              </label>
              <label>
                <span className="fp-label">Método de pago</span>
                <select className="fp-input" value={form.metodo} onChange={e => setForm(p => ({ ...p, metodo: e.target.value }))}>
                  <option value="efectivo"      style={{ background: '#18181D' }}>Efectivo</option>
                  <option value="transferencia" style={{ background: '#18181D' }}>Transferencia</option>
                  <option value="tarjeta"       style={{ background: '#18181D' }}>Tarjeta</option>
                </select>
              </label>
              <label>
                <span className="fp-label">Notas</span>
                <input className="fp-input" value={form.notas} onChange={e => setForm(p => ({ ...p, notas: e.target.value }))} placeholder="Opcional" />
              </label>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 28 }}>
              <button onClick={guardar} disabled={saving || !form.alumnoId} className="fp-btn fp-btn-primary">
                {saving ? 'Guardando...' : 'Registrar'}
              </button>
              <button onClick={() => setModal(false)} className="fp-btn fp-btn-ghost">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
