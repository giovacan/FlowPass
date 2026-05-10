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
    getNegocio(tenantId).then(n => setForm({ nombre: n.nombre, telefono: n.telefono, direccion: n.direccion ?? '' }))
  }, [tenantId])

  if (!ready) return null

  async function guardar() {
    if (!tenantId) return
    setSaving(true)
    await guardarNegocio(tenantId, form)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="fp-fade-in" style={{ padding: '36px 40px', maxWidth: 1100 }}>

      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 8 }}>Configuración</div>
        <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 48, letterSpacing: '0.02em', color: '#fff', lineHeight: 1, margin: 0 }}>Ajustes</h1>
      </div>

      <div style={{ maxWidth: 560, display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Datos del negocio */}
        <div className="fp-card" style={{ padding: '28px 28px' }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9.5, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', marginBottom: 24 }}>
            Datos del negocio
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {([
              ['Nombre de la academia', 'nombre',    'text'],
              ['Teléfono / WhatsApp',   'telefono',  'tel'],
              ['Dirección',             'direccion', 'text'],
            ] as [string, keyof typeof form, string][]).map(([label, key, type]) => (
              <label key={key}>
                <span className="fp-label">{label}</span>
                <input
                  className="fp-input"
                  type={type}
                  value={form[key]}
                  onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                />
              </label>
            ))}
          </div>
          <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 14 }}>
            <button onClick={guardar} disabled={saving} className="fp-btn fp-btn-primary">
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>
            {saved && (
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, color: '#4ade80', letterSpacing: '0.08em' }}>
                ✓ Guardado
              </span>
            )}
          </div>
        </div>

        {/* Plan */}
        <div className="fp-card" style={{ padding: '28px 28px' }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9.5, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', marginBottom: 18 }}>
            Plan actual
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 38, color: '#fbbf24', letterSpacing: '0.04em', lineHeight: 1 }}>Basic</div>
            <span className="fp-badge fp-badge-yellow">Activo</span>
          </div>
          <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.4)', lineHeight: 1.65, margin: 0 }}>
            Alumnos, pagos y asistencia incluidos. Actualiza a Pro en FlowStudio para desbloquear grados, reportes y acceso QR.
          </p>
          <div style={{ marginTop: 20 }}>
            <a
              href="https://flowstudioya.web.app"
              target="_blank"
              rel="noopener noreferrer"
              className="fp-btn fp-btn-ghost"
              style={{ textDecoration: 'none', display: 'inline-flex' }}
            >
              Ver planes →
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}
