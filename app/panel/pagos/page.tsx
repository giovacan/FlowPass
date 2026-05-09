'use client'
import { useEffect, useState } from 'react'
import { useFlowPassAuth } from '@/lib/useFlowPassAuth'
import { getAlumnos, getPagos, registrarPago, type AlumnoDoc, type PagoDoc } from '@/lib/firestore'

const PLANES = [
  { id: 'iniciante', label: 'Iniciante', monto: 1200 },
  { id: 'guerrero', label: 'Guerrero', monto: 1800 },
  { id: 'aguila', label: 'Águila', monto: 2800 },
]

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
      alumnoId: form.alumnoId,
      alumnoNombre: alumno ? `${alumno.nombre} ${alumno.apellido}` : '',
      monto: form.monto,
      mes,
      fecha: new Date().toISOString().slice(0, 10),
      metodo: form.metodo as any,
      notas: form.notas,
    })
    setSaving(false)
    setModal(false)
    getPagos(tenantId, mes).then(setPagos)
  }

  const inp: React.CSSProperties = { width: '100%', background: '#0B0908', border: '1px solid rgba(232,220,196,0.28)', color: '#E8DCC4', padding: '12px 14px', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }

  return (
    <div style={{ padding: 40 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.2em', color: '#574E40', textTransform: 'uppercase', marginBottom: 6 }}>Control de</div>
          <h1 style={{ fontFamily: "'Big Shoulders Display', sans-serif", fontWeight: 900, fontSize: 48, textTransform: 'uppercase', margin: 0 }}>Pagos</h1>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <input type="month" value={mes} onChange={e => setMes(e.target.value)}
            style={{ ...inp, width: 'auto', maxWidth: 160 }} />
          <button onClick={() => setModal(true)}
            style={{ appearance: 'none', background: '#B53825', border: '1px solid #B53825', color: '#E8DCC4', padding: '14px 24px', fontFamily: "'Big Shoulders Display', sans-serif", fontWeight: 800, fontSize: 18, textTransform: 'uppercase', cursor: 'pointer', letterSpacing: '0.04em' }}>
            + Registrar pago
          </button>
        </div>
      </div>

      {/* Resumen */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 32 }}>
        {[
          { label: 'Total del mes', value: `$${total.toLocaleString()} MXN`, color: '#3FA09A' },
          { label: 'Pagos registrados', value: pagos.length, color: '#D4A547' },
          { label: 'Promedio por pago', value: pagos.length ? `$${Math.round(total / pagos.length).toLocaleString()}` : '—', color: '#2E7D7A' },
        ].map(c => (
          <div key={c.label} style={{ background: '#15110D', border: '1px solid rgba(232,220,196,0.14)', padding: '20px 20px' }}>
            <div style={{ fontFamily: "'Big Shoulders Display', sans-serif", fontWeight: 900, fontSize: 32, color: c.color }}>{c.value}</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#574E40', marginTop: 6 }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Lista */}
      <div style={{ border: '1px solid rgba(232,220,196,0.14)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#15110D' }}>
              {['Alumno', 'Plan', 'Monto', 'Método', 'Fecha', 'Notas'].map(h => (
                <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#574E40', fontWeight: 400, borderBottom: '1px solid rgba(232,220,196,0.14)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pagos.map((p, i) => (
              <tr key={p.id} style={{ borderTop: i > 0 ? '1px solid rgba(232,220,196,0.07)' : 'none' }}>
                <td style={{ padding: '14px 16px', fontWeight: 600 }}>{p.alumnoNombre}</td>
                <td style={{ padding: '14px 16px', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#D4A547' }}>{p.plan}</td>
                <td style={{ padding: '14px 16px', fontFamily: "'Big Shoulders Display', sans-serif", fontWeight: 800, fontSize: 22, color: '#3FA09A' }}>${p.monto.toLocaleString()}</td>
                <td style={{ padding: '14px 16px', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, textTransform: 'uppercase', color: '#8A7F6A' }}>{p.metodo}</td>
                <td style={{ padding: '14px 16px', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#574E40' }}>{p.fecha}</td>
                <td style={{ padding: '14px 16px', fontSize: 13, color: '#574E40' }}>{p.notas || '—'}</td>
              </tr>
            ))}
            {pagos.length === 0 && (
              <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center', color: '#574E40', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.14em' }}>SIN PAGOS EN ESTE MES</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(11,9,8,0.9)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: '#15110D', border: '1px solid rgba(232,220,196,0.2)', padding: 36, width: '100%', maxWidth: 480 }}>
            <div style={{ fontFamily: "'Big Shoulders Display', sans-serif", fontWeight: 900, fontSize: 28, textTransform: 'uppercase', marginBottom: 28 }}>Registrar pago</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <label>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.2em', color: '#574E40', textTransform: 'uppercase', marginBottom: 6 }}>Alumno</div>
                <select style={inp} value={form.alumnoId} onChange={e => setForm(p => ({ ...p, alumnoId: e.target.value }))}>
                  <option value="">— Selecciona —</option>
                  {alumnos.filter(a => a.activo).map(a => <option key={a.id} value={a.id}>{a.nombre} {a.apellido}</option>)}
                </select>
              </label>
              <label>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.2em', color: '#574E40', textTransform: 'uppercase', marginBottom: 6 }}>Plan de membresía</div>
                <select style={inp} value={form.plan} onChange={e => {
                  const plan = PLANES.find(p => p.id === e.target.value)
                  setForm(p => ({ ...p, plan: e.target.value, monto: plan?.monto ?? p.monto }))
                }}>
                  {PLANES.map(p => <option key={p.id} value={p.id}>{p.label} — ${p.monto.toLocaleString()}</option>)}
                </select>
              </label>
              <label>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.2em', color: '#574E40', textTransform: 'uppercase', marginBottom: 6 }}>Monto (MXN)</div>
                <input style={inp} type="number" value={form.monto} onChange={e => setForm(p => ({ ...p, monto: Number(e.target.value) }))} />
              </label>
              <label>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.2em', color: '#574E40', textTransform: 'uppercase', marginBottom: 6 }}>Método de pago</div>
                <select style={inp} value={form.metodo} onChange={e => setForm(p => ({ ...p, metodo: e.target.value }))}>
                  <option value="efectivo">Efectivo</option>
                  <option value="transferencia">Transferencia</option>
                  <option value="tarjeta">Tarjeta</option>
                </select>
              </label>
              <label>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.2em', color: '#574E40', textTransform: 'uppercase', marginBottom: 6 }}>Notas</div>
                <input style={inp} value={form.notas} onChange={e => setForm(p => ({ ...p, notas: e.target.value }))} placeholder="Opcional" />
              </label>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
              <button onClick={guardar} disabled={saving || !form.alumnoId}
                style={{ appearance: 'none', background: '#B53825', border: '1px solid #B53825', color: '#E8DCC4', padding: '14px 28px', fontFamily: "'Big Shoulders Display', sans-serif", fontWeight: 800, fontSize: 18, textTransform: 'uppercase', cursor: 'pointer', opacity: (!form.alumnoId || saving) ? 0.5 : 1 }}>
                {saving ? 'Guardando...' : 'Registrar'}
              </button>
              <button onClick={() => setModal(false)}
                style={{ appearance: 'none', background: 'transparent', border: '1px solid rgba(232,220,196,0.2)', color: '#8A7F6A', padding: '14px 20px', fontFamily: "'Big Shoulders Display', sans-serif", fontWeight: 800, fontSize: 18, textTransform: 'uppercase', cursor: 'pointer' }}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
