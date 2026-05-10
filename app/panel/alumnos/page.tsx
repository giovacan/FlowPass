'use client'
import { useEffect, useState } from 'react'
import { useFlowPassAuth } from '@/lib/useFlowPassAuth'
import { suscribirAlumnos, guardarAlumno, deleteAlumno, type AlumnoDoc, type Grado } from '@/lib/firestore'

const GRADOS: Grado[] = ['blanco', 'azul', 'morado', 'cafe', 'negro']

const ESTADO_BADGE: Record<string, string> = {
  al_corriente: 'fp-badge fp-badge-green',
  por_vencer:   'fp-badge fp-badge-yellow',
  vencido:      'fp-badge fp-badge-red',
}
const ESTADO_LABEL: Record<string, string> = {
  al_corriente: 'Al corriente',
  por_vencer:   'Por vencer',
  vencido:      'Vencido',
}

const EMPTY: Omit<AlumnoDoc, 'id' | 'creado'> = {
  nombre: '', apellido: '', telefono: '', email: '', fotoUrl: '',
  grado: 'blanco', subcategoria: 'bjj', fechaInscripcion: new Date().toISOString().slice(0, 10),
  fechaVencimiento: '', estadoPago: 'al_corriente', activo: true, notas: '',
}

export default function AlumnosPage() {
  const { tenantId, ready } = useFlowPassAuth()
  const [alumnos, setAlumnos] = useState<AlumnoDoc[]>([])
  const [buscar, setBuscar] = useState('')
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!tenantId) return
    return suscribirAlumnos(tenantId, setAlumnos)
  }, [tenantId])

  if (!ready) return null

  const filtrados = alumnos.filter(a =>
    `${a.nombre} ${a.apellido}`.toLowerCase().includes(buscar.toLowerCase())
  )

  function abrirNuevo() { setForm(EMPTY); setEditId(null); setModal(true) }
  function abrirEditar(a: AlumnoDoc) {
    setForm({ nombre: a.nombre, apellido: a.apellido, telefono: a.telefono, email: a.email, fotoUrl: a.fotoUrl, grado: a.grado, subcategoria: a.subcategoria, fechaInscripcion: a.fechaInscripcion, fechaVencimiento: a.fechaVencimiento, estadoPago: a.estadoPago, activo: a.activo, notas: a.notas })
    setEditId(a.id)
    setModal(true)
  }

  async function guardar() {
    if (!form.nombre.trim() || !tenantId) return
    setSaving(true)
    await guardarAlumno(tenantId, form, editId || undefined)
    setSaving(false)
    setModal(false)
  }

  async function eliminar(id: string) {
    if (!tenantId || !confirm('¿Eliminar alumno?')) return
    await deleteAlumno(tenantId, id)
  }

  return (
    <div className="fp-fade-in" style={{ padding: '36px 40px', maxWidth: 1100 }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 8 }}>Gestión</div>
          <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 48, letterSpacing: '0.02em', color: '#fff', lineHeight: 1, margin: 0 }}>Alumnos</h1>
        </div>
        <button onClick={abrirNuevo} className="fp-btn fp-btn-primary">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nuevo alumno
        </button>
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

      {/* Table */}
      <div className="fp-card" style={{ overflow: 'hidden' }}>
        <table className="fp-table">
          <thead>
            <tr>
              {['Alumno', 'Disciplina', 'Cinturón', 'Estado pago', 'Vence', ''].map(h => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtrados.map(a => (
              <tr key={a.id}>
                <td>
                  <div style={{ fontWeight: 600, color: '#fff' }}>{a.nombre} {a.apellido}</div>
                  {a.telefono && <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 3 }}>{a.telefono}</div>}
                </td>
                <td style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{a.subcategoria}</td>
                <td>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: a.grado === 'blanco' ? '#e5e5e5' : a.grado === 'azul' ? '#3b82f6' : a.grado === 'morado' ? '#a855f7' : a.grado === 'cafe' ? '#92400e' : '#111', border: '1px solid rgba(255,255,255,0.15)', flexShrink: 0 }} />
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, color: 'rgba(255,255,255,0.45)', textTransform: 'capitalize' }}>{a.grado}</span>
                  </div>
                </td>
                <td>
                  <span className={ESTADO_BADGE[a.estadoPago] || 'fp-badge fp-badge-blue'}>
                    {ESTADO_LABEL[a.estadoPago] || a.estadoPago}
                  </span>
                </td>
                <td style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
                  {a.fechaVencimiento || '—'}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => abrirEditar(a)} className="fp-btn fp-btn-ghost" style={{ padding: '6px 14px', fontSize: 12 }}>Editar</button>
                    <button onClick={() => eliminar(a.id)} className="fp-btn fp-btn-danger" style={{ padding: '6px 12px', fontSize: 12 }}>✕</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtrados.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: '48px 0', textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontFamily: "'JetBrains Mono',monospace", fontSize: 11, letterSpacing: '0.14em' }}>
                  {buscar ? 'Sin resultados' : 'Sin alumnos registrados'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Count */}
      {alumnos.length > 0 && (
        <div style={{ marginTop: 12, fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.08em' }}>
          {filtrados.length} alumno{filtrados.length !== 1 ? 's' : ''} · {alumnos.filter(a => a.activo).length} activos
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fp-modal-overlay" onClick={e => { if (e.target === e.currentTarget) setModal(false) }}>
          <div className="fp-modal" style={{ maxWidth: 560 }}>
            <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 32, letterSpacing: '0.04em', color: '#fff', margin: '0 0 28px' }}>
              {editId ? 'Editar alumno' : 'Nuevo alumno'}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {([['Nombre', 'nombre'], ['Apellido', 'apellido'], ['Teléfono', 'telefono'], ['Email', 'email']] as [string, keyof typeof form][]).map(([label, key]) => (
                <label key={key}>
                  <span className="fp-label">{label}</span>
                  <input className="fp-input" value={form[key] as string} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} />
                </label>
              ))}
              <label>
                <span className="fp-label">Cinturón / Grado</span>
                <select className="fp-input" value={form.grado} onChange={e => setForm(p => ({ ...p, grado: e.target.value as Grado }))}>
                  {GRADOS.map(g => <option key={g} value={g} style={{ background: '#18181D' }}>{g}</option>)}
                </select>
              </label>
              <label>
                <span className="fp-label">Disciplina</span>
                <select className="fp-input" value={form.subcategoria} onChange={e => setForm(p => ({ ...p, subcategoria: e.target.value }))}>
                  {['bjj', 'muay-thai', 'boxeo', 'mma', 'defensa', 'kids'].map(d => (
                    <option key={d} value={d} style={{ background: '#18181D' }}>{d}</option>
                  ))}
                </select>
              </label>
              <label>
                <span className="fp-label">Fecha inscripción</span>
                <input className="fp-input" type="date" value={form.fechaInscripcion} onChange={e => setForm(p => ({ ...p, fechaInscripcion: e.target.value }))} />
              </label>
              <label>
                <span className="fp-label">Estado de pago</span>
                <select className="fp-input" value={form.estadoPago} onChange={e => setForm(p => ({ ...p, estadoPago: e.target.value as any }))}>
                  <option value="al_corriente" style={{ background: '#18181D' }}>Al corriente</option>
                  <option value="por_vencer"   style={{ background: '#18181D' }}>Por vencer</option>
                  <option value="vencido"       style={{ background: '#18181D' }}>Vencido</option>
                </select>
              </label>
              <label>
                <span className="fp-label">Fecha vencimiento</span>
                <input className="fp-input" type="date" value={form.fechaVencimiento} onChange={e => setForm(p => ({ ...p, fechaVencimiento: e.target.value }))} />
              </label>
              <label style={{ gridColumn: '1 / -1' }}>
                <span className="fp-label">Notas</span>
                <textarea className="fp-input" style={{ height: 80, resize: 'vertical' }} value={form.notas} onChange={e => setForm(p => ({ ...p, notas: e.target.value }))} />
              </label>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 28 }}>
              <button onClick={guardar} disabled={saving} className="fp-btn fp-btn-primary">
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
              <button onClick={() => setModal(false)} className="fp-btn fp-btn-ghost">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
