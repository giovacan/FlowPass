'use client'
import { useEffect, useState } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useFlowPassAuth } from '@/lib/useFlowPassAuth'
import { guardarNegocio, getNegocio } from '@/lib/firestore'

interface Plantilla {
  id:          string
  nombre:      string
  descripcion: string
  emoji:       string
  colores: {
    primary:    string
    background: string
    surface:    string
    secondary:  string
    gold:       string
    heroBg:     string
    fontHeading: string
  }
}

export default function TemasPage() {
  const { tenantId, plantillaId: plantillaActiva, ready } = useFlowPassAuth()
  const [plantillas, setPlantillas]   = useState<Plantilla[]>([])
  const [aplicando, setAplicando]     = useState<string | null>(null)
  const [aplicada, setAplicada]       = useState<string | null>(null)
  const [loading, setLoading]         = useState(true)

  useEffect(() => {
    const cargar = async () => {
      const snap = await getDocs(
        query(collection(db, 'plantillas'), where('sistemas', 'array-contains', 'flowpass'))
      )
      setPlantillas(snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })))
      setLoading(false)
    }
    cargar().catch(console.error)
  }, [])

  const aplicar = async (id: string) => {
    if (!tenantId || id === plantillaActiva) return
    setAplicando(id)
    try {
      await guardarNegocio(tenantId, { plantilla: id })
      setAplicada(id)
      setTimeout(() => {
        window.location.reload()
      }, 1200)
    } finally {
      setAplicando(null)
    }
  }

  if (!ready || loading) return null

  return (
    <div className="fp-fade-in" style={{ padding: '36px 40px', maxWidth: 900 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.18em',
          textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 8,
        }}>Personalización</div>
        <h1 style={{
          fontFamily: 'var(--fp-font-heading)', fontSize: 32, letterSpacing: '0.04em',
          color: '#fff', margin: 0,
        }}>Temas del panel</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13.5, marginTop: 8, lineHeight: 1.6 }}>
          Elige el estilo visual del panel y del perfil público de tu gimnasio.
        </p>
      </div>

      {/* Grid de plantillas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
        {plantillas.map(p => {
          const activa  = plantillaActiva === p.id || (!plantillaActiva && p.id === 'flowpass')
          const cargando = aplicando === p.id
          const exito    = aplicada === p.id

          return (
            <div key={p.id} style={{
              background: 'rgba(255,255,255,0.03)',
              border: activa
                ? `1.5px solid var(--fp-accent)`
                : '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16,
              overflow: 'hidden',
              transition: 'border-color .2s, transform .15s',
              position: 'relative',
            }}
              onMouseEnter={e => !activa && (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              {/* Badge activa */}
              {activa && (
                <div style={{
                  position: 'absolute', top: 12, right: 12, zIndex: 2,
                  background: 'var(--fp-accent)', color: '#fff',
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
                  fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase',
                  padding: '3px 9px', borderRadius: 20,
                }}>✓ Activa</div>
              )}

              {/* Preview del tema */}
              <div style={{
                height: 120, background: p.colores?.heroBg || p.colores?.background,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative', overflow: 'hidden',
              }}>
                {/* Mini sidebar simulado */}
                <div style={{
                  position: 'absolute', left: 0, top: 0, bottom: 0, width: 48,
                  background: p.colores?.background || '#0A0A0A',
                  borderRight: `1px solid ${p.colores?.primary}22`,
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  paddingTop: 10, gap: 8,
                }}>
                  <div style={{ width: 20, height: 20, background: p.colores?.primary, borderRadius: 4 }} />
                  {[1,2,3].map(i => (
                    <div key={i} style={{
                      width: 24, height: 4, borderRadius: 2,
                      background: i === 1 ? p.colores?.primary : 'rgba(255,255,255,0.12)',
                    }} />
                  ))}
                </div>
                {/* Contenido simulado */}
                <div style={{ marginLeft: 56, display: 'flex', flexDirection: 'column', gap: 6, flex: 1, padding: '0 12px' }}>
                  <div style={{ width: '60%', height: 10, borderRadius: 3, background: p.colores?.primary, opacity: .8 }} />
                  <div style={{ width: '40%', height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.2)' }} />
                  <div style={{ marginTop: 6, display: 'flex', gap: 6 }}>
                    {[1,2].map(i => (
                      <div key={i} style={{
                        flex: 1, height: 32, borderRadius: 6,
                        background: i === 1 ? `${p.colores?.surface}` : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${p.colores?.primary}33`,
                      }} />
                    ))}
                  </div>
                </div>
                {/* Emoji central */}
                <div style={{
                  position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
                  fontSize: 32, filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))',
                }}>{p.emoji}</div>
              </div>

              {/* Info */}
              <div style={{ padding: '16px 18px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 16 }}>{p.emoji}</span>
                  <span style={{ fontSize: 15, fontWeight: 700, color: '#fff', letterSpacing: -.2 }}>
                    {p.nombre}
                  </span>
                </div>
                <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5, margin: '0 0 14px' }}>
                  {p.descripcion}
                </p>

                {/* Swatches de color */}
                <div style={{ display: 'flex', gap: 5, marginBottom: 14 }}>
                  {[p.colores?.primary, p.colores?.secondary, p.colores?.gold, p.colores?.surface].filter(Boolean).map((c, i) => (
                    <div key={i} style={{
                      width: 16, height: 16, borderRadius: '50%',
                      background: c, border: '1px solid rgba(255,255,255,0.12)',
                    }} />
                  ))}
                </div>

                <button
                  onClick={() => aplicar(p.id)}
                  disabled={activa || cargando}
                  className={activa ? '' : 'fp-btn fp-btn-ghost'}
                  style={{
                    width: '100%', padding: '9px 0',
                    borderRadius: 9, fontSize: 12.5, fontWeight: 600,
                    cursor: activa ? 'default' : 'pointer',
                    background: activa ? 'rgba(255,255,255,0.04)' : undefined,
                    color: activa ? 'rgba(255,255,255,0.3)' : undefined,
                    border: activa ? '1px solid rgba(255,255,255,0.08)' : undefined,
                    fontFamily: 'inherit',
                    transition: 'all .15s',
                  }}
                >
                  {exito ? '✓ Aplicado — recargando…' : cargando ? 'Aplicando…' : activa ? 'Tema activo' : 'Aplicar tema'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
