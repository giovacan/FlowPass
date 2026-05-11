import { getDoc, doc } from 'firebase/firestore'
import { db } from './firebase'

export interface FpTokens {
  accent:    string   // color principal del negocio
  accentDim: string   // versión más opaca para hover / fondo tenue
  bg:        string   // fondo oscuro del panel
  surface:   string   // tarjetas / modales
  heroBg:    string   // degradado identidad — CTA buttons
  fontHeading: string
  fontBody:    string
}

const FALLBACK: FpTokens = {
  accent:      '#FF5C1F',
  accentDim:   'rgba(255,92,31,0.12)',
  bg:          '#0F0F13',
  surface:     '#18181D',
  heroBg:      'linear-gradient(135deg, #FF5C1F 0%, #E04510 100%)',
  fontHeading: "'Bebas Neue', sans-serif",
  fontBody:    "'Inter', system-ui, sans-serif",
}

const _cache: Record<string, FpTokens> = {}

export async function getFpTokens(plantillaId?: string | null): Promise<FpTokens> {
  const pid = plantillaId || 'flowpass'
  if (_cache[pid]) return _cache[pid]

  try {
    const snap = await getDoc(doc(db, 'plantillas', pid))
    if (snap.exists()) {
      const d = snap.data() as any
      const c = d.colores || {}
      const primary = c.primary || c.accent || FALLBACK.accent
      const tokens: FpTokens = {
        accent:      primary,
        accentDim:   `${primary}1F`,
        bg:          c.background || c.bg || FALLBACK.bg,
        surface:     c.surface || c.card || FALLBACK.surface,
        heroBg:      c.heroBg || `linear-gradient(135deg, ${primary} 0%, ${c.secondary || primary} 100%)`,
        fontHeading: c.fontHeading ? `'${c.fontHeading}', sans-serif` : FALLBACK.fontHeading,
        fontBody:    c.fontBody    ? `'${c.fontBody}', system-ui, sans-serif` : FALLBACK.fontBody,
      }
      _cache[pid] = tokens
      return tokens
    }
  } catch { /* red o permisos — usar fallback */ }

  // plantilla no encontrada → fallback
  _cache[pid] = FALLBACK
  return FALLBACK
}

export function fpTokensToCSSVars(t: FpTokens): Record<string, string> {
  return {
    '--fp-accent':       t.accent,
    '--fp-accent-dim':   t.accentDim,
    '--fp-bg':           t.bg,
    '--fp-surface':      t.surface,
    '--fp-hero-bg':      t.heroBg,
    '--fp-font-heading': t.fontHeading,
    '--fp-font-body':    t.fontBody,
  }
}
