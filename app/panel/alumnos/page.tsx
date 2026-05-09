'use client'
import { useEffect, useState } from 'react'
import { useFlowPassAuth } from '@/lib/useFlowPassAuth'
import { suscribirAlumnos, guardarAlumno, deleteAlumno, type AlumnoDoc, type Grado } from '@/lib/firestore'

const GRADOS: Grado[] = ['blanco', 'azul', 'morado', 'cafe', 'negro']
const GRADO_COLOR: Record<string, string> = {
  blanco: '#F5EFD9', azul: '#1F5E9E', morado: '#5E2E8C', cafe: '#5C3A1F', negro: '#0B0908',
}
const ESTADO_COLOR: Record<string, string> = {
  al_corriente: '#3FA09A', por_vencer: '#D4A547', vencido: '#B53825',
}

const EMPTY: Omit<AlumnoDoc, 'id' | 'creado'> = {
  nombre: '', apellido: '', telefono: '', email: '', fotoUrl: '',
  grado: 'blanco', subcategoria: 'bjj', fechaInscripcion: new Date().toISOString().slice(0,10),
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

  const inp: React.CSSProperties = { width: '100%', background: '#0B0908', border: '1px solid rgba(232,220,196,0.28)', color: '#E8DCC4', padding: '12px 14px', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }

  return (
    <div style={{ padding: 40 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.2em', color: '#574E40', textTransform: 'uppercase', marginBottom: 6 }}>Gestión</div>
          <h1 style={{ fontFamily: "'Big Shoulders Display', sans-serif", fontWeight: 900, fontSize: 48, textTransform: 'uppercase', margin: 0 }}>Alumnos</h1>
        </div>
        <button onClick={abrirNuevo} style={{ appearance: 'none', background: '#B53825', border: '1px solid #B53825', color: '#E8DCC4', padding: '14px 24px', fontFamily: "'Big Shoulders Display', sans-serif", fontWeight: 800, fontSize: 18, textTransform: 'uppercase', cursor: 'pointer', letterSpacing: '0.04em' }}>
          + Nuevo alumno
        </button>
      </div>

      <input placeholder="Buscar alumno..." value={buscar} onChange={e => setBuscar(e.target.value)}
        style={{ ...inp, maxWidth: 360, marginBottom: 24 }} />

      <div style={{ border: '1px solid rgba(232,220,196,0.14)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#15110D' }}>
              {['Alumno', 'Disciplina', 'Cinturón', 'Estado pago', 'Vence', ''].map(h => (
                <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#574E40', fontWeight: 400, borderBottom: '1px solid rgba(232,220,196,0.14)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtrados.map((a, i) => (
              <tr key={a.id} style={{ borderTop: i > 0 ? '1px solid rgba(232,220,196,0.07)' : 'none' }}>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ fontWeight: 600 }}>{a.nombre} {a.apellido}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#574E40', marginTop: 2 }}>{a.telefono}</div>
                </td>
                <td style={{ padding: '14px 16px', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#8A7F6A', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{a.subcategoria}</td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 16, height: 16, background: GRADO_COLOR[a.grado] || '#574E40', border: '1px solid rgba(232,220,196,0.2)', display: 'inline-block', flexShrink: 0 }} />
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#8A7F6A' }}>{a.grado}</span>
                  </div>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ background: ESTADO_COLOR[a.estadoPago] || '#574E40', color: '#0B0908', padding: '3px 10px', fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700 }}>
                    {a.estadoPago?.replace('_', ' ')}
                  </span>
                </td>
                <td style={{ padding: '14px 16px', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#574E40' }}>{a.fechaVencimiento || '—'}</td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => abrirEditar(a)} style={{ appearance: 'none', background: 'transparent', border: '1px solid rgba(232,220,196,0.2)', color: '#8A7F6A', padding: '6px 12px', cursor: 'pointer', fontSize: 12 }}>Editar</button>
                    <button onClick={() => eliminar(a.id)} style={{ appearance: 'none', background: 'transparent', border: '1px solid rgba(181,56,37,0.3)', color: '#B53825', padding: '6px 12px', cursor: 'pointer', fontSize: 12 }}>✕</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtrados.length === 0 && (
              <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center', color: '#574E40', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.14em' }}>SIN ALUMNOS</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(11,9,8,0.9)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: '#15110D', border: '1px solid rgba(232,220,196,0.2)', padding: 36, width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ fontFamily: "'Big Shoulders Display', sans-serif", fontWeight: 900, fontSize: 28, textTransform: 'uppercase', marginBottom: 28 }}>
              {editId ? 'Editar alumno' : 'Nuevo alumno'}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {([['Nombre', 'nombre'], ['Apellido', 'apellido'], ['Teléfono', 'telefono'], ['Email', 'email']] as [string, keyof typeof form][]).map(([label, key]) => (
                <label key={key}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.2em', color: '#574E40', textTransform: 'uppercase', marginBottom: 6 }}>{label}</div>
                  <input style={inp} value={form[key] as string} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} />
                </label>
              ))}
              <label>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.2em', color: '#574E40', textTransform: 'uppercase', marginBottom: 6 }}>Cinturón / Grado</div>
                <select style={inp} value={form.grado} onChange={e => setForm(p => ({ ...p, grado: e.target.value as Grado }))}>
                  {GRADOS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </label>
              <label>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.2em', color: '#574E40', textTransform: 'uppercase', marginBottom: 6 }}>Disciplina</div>
                <select style={inp} value={form.subcategoria} onChange={e => setForm(p => ({ ...p, subcategoria: e.target.value }))}>
                  {['bjj', 'muay-thai', 'boxeo', 'mma', 'defensa', 'kids'].map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </label>
              <label>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.2em', color: '#574E40', textTransform: 'uppercase', marginBottom: 6 }}>Fecha inscripción</div>
                <input style={inp} type="date" value={form.fechaInscripcion} onChange={e => setForm(p => ({ ...p, fechaInscripcion: e.target.value }))} />
              </label>
              <label>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.2em', color: '#574E40', textTransform: 'uppercase', marginBottom: 6 }}>Estado de pago</div>
                <select style={inp} value={form.estadoPago} onChange={e => setForm(p => ({ ...p, estadoPago: e.target.value as any }))}>
                  <option value="al_corriente">Al corriente</option>
                  <option value="por_vencer">Por vencer</option>
                  <option value="vencido">Vencido</option>
                </select>
              </label>
              <label style={{ gridColumn: '1 / -1' }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.2em', color: '#574E40', textTransform: 'uppercase', marginBottom: 6 }}>Notas</div>
                <textarea style={{ ...inp, height: 72, resize: 'vertical' }} value={form.notas} onChange={e => setForm(p => ({ ...p, notas: e.target.value }))} />
              </label>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
              <button onClick={guardar} disabled={saving}
                style={{ appearance: 'none', background: '#B53825', border: '1px solid #B53825', color: '#E8DCC4', padding: '14px 28px', fontFamily: "'Big Shoulders Display', sans-serif", fontWeight: 800, fontSize: 18, textTransform: 'uppercase', cursor: 'pointer', opacity: saving ? 0.6 : 1 }}>
                {saving ? 'Guardando...' : 'Guardar'}
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
