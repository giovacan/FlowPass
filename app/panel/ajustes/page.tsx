'use client'
import { useEffect, useState } from 'react'
import { useFlowPassAuth } from '@/lib/useFlowPassAuth'
import { getNegocio, guardarNegocio } from '@/lib/firestore'

export default function AjustesPage() {
  const { tenantId, ready } = useFlowPassAuth()
  const [form, setForm] = useState({ nombre: '', telefono: '', direccion: '' })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!tenantId) return
    getNegocio(tenantId).then(n => setForm({ nombre: n.nombre, telefono: n.telefono, direccion: n.direccion }))
  }, [tenantId])

  if (!ready) return null

  async function guardar() {
    if (!tenantId) return
    setSaving(true)
    await guardarNegocio(tenantId, form)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const inp: React.CSSProperties = { width: '100%', background: '#0B0908', border: '1px solid rgba(232,220,196,0.28)', color: '#E8DCC4', padding: '14px 16px', fontSize: 15, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }

  return (
    <div style={{ padding: 40 }}>
      <div style={{ marginBottom: 40 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.2em', color: '#574E40', textTransform: 'uppercase', marginBottom: 6 }}>Configuración</div>
        <h1 style={{ fontFamily: "'Big Shoulders Display', sans-serif", fontWeight: 900, fontSize: 48, textTransform: 'uppercase', margin: 0 }}>Ajustes</h1>
      </div>

      <div style={{ maxWidth: 560 }}>
        <div style={{ background: '#15110D', border: '1px solid rgba(232,220,196,0.14)', padding: 36, marginBottom: 24 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.2em', color: '#D4A547', textTransform: 'uppercase', marginBottom: 24 }}>
            Datos del negocio
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {([
              ['Nombre de la academia', 'nombre', 'text'],
              ['Teléfono / WhatsApp', 'telefono', 'tel'],
              ['Dirección', 'direccion', 'text'],
            ] as [string, keyof typeof form, string][]).map(([label, key, type]) => (
              <label key={key}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.2em', color: '#574E40', textTransform: 'uppercase', marginBottom: 8 }}>{label}</div>
                <input style={inp} type={type} value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} />
              </label>
            ))}
          </div>
          <button onClick={guardar} disabled={saving}
            style={{ appearance: 'none', marginTop: 28, background: '#B53825', border: '1px solid #B53825', color: '#E8DCC4', padding: '16px 32px', fontFamily: "'Big Shoulders Display', sans-serif", fontWeight: 800, fontSize: 20, textTransform: 'uppercase', cursor: 'pointer', opacity: saving ? 0.6 : 1, letterSpacing: '0.04em' }}>
            {saved ? '✓ Guardado' : saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>

        <div style={{ background: '#15110D', border: '1px solid rgba(232,220,196,0.14)', padding: 36 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.2em', color: '#574E40', textTransform: 'uppercase', marginBottom: 16 }}>Plan actual</div>
          <div style={{ fontFamily: "'Big Shoulders Display', sans-serif", fontWeight: 900, fontSize: 36, color: '#D4A547', textTransform: 'uppercase' }}>Basic</div>
          <p style={{ color: '#574E40', fontSize: 14, lineHeight: 1.6, marginTop: 12, marginBottom: 0 }}>
            Alumnos, pagos y asistencia incluidos. Actualiza a Pro en FlowStudio para desbloquear grados, reportes y acceso QR.
          </p>
        </div>
      </div>
    </div>
  )
}
