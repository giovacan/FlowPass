// ── Planes universales — aplican a todos los SaaS del ecosistema ─────────────
// Plan vive en studios/{id}.plan — todos los SaaS lo leen del mismo documento

export type PlanId = 'personal' | 'negocio' | 'cadena' | 'elite'

export type PaymentStatus = 'trial' | 'paid' | 'overdue' | 'suspended'

// ── Feature override — permite dar/quitar features individuales por negocio ──
export interface FeatureOverride {
  activo:   boolean
  hastaEl?: string   // ISO date YYYY-MM-DD — sin fecha = permanente
  nota?:    string   // "prueba gratuita", "acuerdo especial", "cortesía"
}

export type FeatureOverrides = Record<string, FeatureOverride>

// ── Definición de planes ──────────────────────────────────────────────────────
export interface PlanDef {
  id:            PlanId
  nombre:        string
  precio:        number | null   // null = cotización personalizada (Élite)
  descripcion:   string
  usuariosBase:  number | null   // null = ilimitado
  sedesBase:     number | null   // null = ilimitado
  precioUsuario: number | null   // costo por usuario adicional
  precioSede:    number | null   // costo por sede adicional
  maxUsuarios:   number | null   // null = sin límite
}

export const PLANES: Record<PlanId, PlanDef> = {
  personal: {
    id:            'personal',
    nombre:        'Personal',
    precio:        99,
    descripcion:   'Para una persona. Finanzas personales y herramientas individuales.',
    usuariosBase:  1,
    sedesBase:     1,
    precioUsuario: null,
    precioSede:    null,
    maxUsuarios:   1,
  },
  negocio: {
    id:            'negocio',
    nombre:        'Negocio',
    precio:        299,
    descripcion:   'Para negocios con equipo. Hasta 12 usuarios con costo por adicional.',
    usuariosBase:  5,
    sedesBase:     1,
    precioUsuario: 99,
    precioSede:    null,
    maxUsuarios:   12,
  },
  cadena: {
    id:            'cadena',
    nombre:        'Cadena',
    precio:        899,
    descripcion:   'Para negocios con múltiples sedes. 3 sedes incluidas, +$499 por sede extra.',
    usuariosBase:  null,
    sedesBase:     3,
    precioUsuario: null,
    precioSede:    499,
    maxUsuarios:   null,
  },
  elite: {
    id:            'elite',
    nombre:        'Élite',
    precio:        null,
    descripcion:   'Solución personalizada para operaciones grandes. Servidor dedicado, SLA y soporte directo.',
    usuariosBase:  null,
    sedesBase:     null,
    precioUsuario: null,
    precioSede:    null,
    maxUsuarios:   null,
  },
}

// ── Calcular precio mensual real según extras ─────────────────────────────────
export function calcularPrecio(
  planId: PlanId,
  extraUsuarios: number = 0,
  extraSedes: number = 0,
): number | null {
  const plan = PLANES[planId]
  if (plan.precio === null) return null   // Élite: cotización
  let total = plan.precio
  if (plan.precioUsuario) total += extraUsuarios * plan.precioUsuario
  if (plan.precioSede)    total += extraSedes    * plan.precioSede
  return total
}

// ── Resolver si un feature override está activo hoy ───────────────────────────
export function resolveOverride(override: FeatureOverride): boolean {
  if (!override.activo) return false
  if (override.hastaEl && new Date(override.hastaEl) < new Date()) return false
  return true
}

// ── Resolver si un feature está activo para un negocio ───────────────────────
// featuresDelPlan: mapa de features que el plan incluye por defecto (definido por cada SaaS)
export function resolveFeature(
  featureId: string,
  planIncluye: boolean,
  overrides: FeatureOverrides = {},
): boolean {
  const override = overrides[featureId]
  if (override) return resolveOverride(override)
  return planIncluye
}

// ── Helpers de estado de cuenta ───────────────────────────────────────────────
export function cuentaSuspendida(
  paymentStatus: PaymentStatus,
  trialEndsAt?: string | null,
): boolean {
  if (paymentStatus === 'suspended') return true
  if (paymentStatus === 'trial' && trialEndsAt) {
    return new Date(trialEndsAt) < new Date()
  }
  return false
}

export function diasRestantesTrial(trialEndsAt?: string | null): number | null {
  if (!trialEndsAt) return null
  return Math.ceil((new Date(trialEndsAt).getTime() - Date.now()) / 86_400_000)
}

export function diasParaVencimiento(nextBillingDate?: string | null): number | null {
  if (!nextBillingDate) return null
  return Math.ceil((new Date(nextBillingDate).getTime() - Date.now()) / 86_400_000)
}
