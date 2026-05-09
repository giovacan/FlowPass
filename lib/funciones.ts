import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from './firebase'

export type ModuloId =
  | 'clases'
  | 'grados'
  | 'reportes'
  | 'comunicados'
  | 'acceso_qr'

export interface ModuloInfo {
  id:          ModuloId
  label:       string
  descripcion: string
  detalle:     string
  href?:       string
  emoji:       string
}

export const MODULOS: ModuloInfo[] = [
  {
    id:          'clases',
    label:       'Horarios de clases',
    descripcion: 'Programa clases y controla cupos',
    detalle:     'Define los horarios de cada clase, asigna instructor y controla el cupo máximo. Los alumnos ven los horarios disponibles.',
    href:        '/panel/clases',
    emoji:       '📅',
  },
  {
    id:          'grados',
    label:       'Grados y cinturones',
    descripcion: 'Registra el avance de cada alumno',
    detalle:     'Lleva el historial de grados de cada alumno: fecha de examen, grado obtenido y observaciones del instructor.',
    href:        '/panel/grados',
    emoji:       '🥋',
  },
  {
    id:          'reportes',
    label:       'Reportes',
    descripcion: 'Ingresos mensuales y estadísticas',
    detalle:     'Visualiza cuánto ingresaste cada mes, qué porcentaje de alumnos está al corriente y cuántos están por vencer.',
    href:        '/panel/reportes',
    emoji:       '📊',
  },
  {
    id:          'comunicados',
    label:       'Comunicados',
    descripcion: 'Mensajes a todos los alumnos',
    detalle:     'Envía avisos importantes a todos tus alumnos: cambios de horario, eventos, torneos o recordatorios de pago.',
    emoji:       '📣',
  },
  {
    id:          'acceso_qr',
    label:       'Control de acceso QR',
    descripcion: 'Registro de entrada con código QR',
    detalle:     'Cada alumno tiene un QR único. Al escanearlo en la entrada queda registrada su asistencia automáticamente.',
    emoji:       '🔐',
  },
]

export interface FuncionBase {
  label:       string
  descripcion: string
  emoji:       string
}

export const FUNCIONES_BASE: FuncionBase[] = [
  { emoji: '👥', label: 'Alumnos',          descripcion: 'Registro completo de alumnos con foto, grado y estado de pago.' },
  { emoji: '💳', label: 'Control de pagos', descripcion: 'Registra mensualidades y sabe quién está al corriente de un vistazo.' },
  { emoji: '✅', label: 'Asistencia',       descripcion: 'Marca la asistencia del día con un tap por alumno.' },
  { emoji: '⚙️', label: 'Ajustes',          descripcion: 'Configura tu academia: nombre, logo y mensualidad.' },
]

export type FuncionesConfig = Partial<Record<ModuloId, boolean>>

export async function getFunciones(tenantId: string): Promise<FuncionesConfig> {
  const snap = await getDoc(doc(db, 'tenants', tenantId, 'config', 'funciones'))
  return snap.exists() ? (snap.data() as FuncionesConfig) : {}
}

export async function setFuncion(tenantId: string, id: ModuloId, activo: boolean): Promise<void> {
  await setDoc(
    doc(db, 'tenants', tenantId, 'config', 'funciones'),
    { [id]: activo },
    { merge: true }
  )
}
