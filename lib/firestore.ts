import { doc, getDoc, collection, getDocs, setDoc, addDoc, updateDoc, deleteDoc, onSnapshot, serverTimestamp, query, where } from 'firebase/firestore'
import { db } from './firebase'

// ── Tenant helpers ────────────────────────────────────────────────────────────
export const tenantCol = (tenantId: string, col: string) =>
  collection(db, 'tenants', tenantId, col)

export const tenantDoc = (tenantId: string, col: string, docId: string) =>
  doc(db, 'tenants', tenantId, col, docId)

// ── Negocio ───────────────────────────────────────────────────────────────────
export interface NegocioDoc {
  nombre:               string
  telefono:             string
  logoUrl:              string
  direccion?:           string
  plantilla:            string
  subcategoria:         string
  mensualidad:          number
  onboardingCompletado: boolean
}

export async function guardarNegocio(tenantId: string, data: Partial<NegocioDoc>): Promise<void> {
  await setDoc(doc(db, 'tenants', tenantId, 'config', 'negocio'), data, { merge: true })
}

export async function getNegocio(tenantId: string): Promise<NegocioDoc & { abierto: boolean }> {
  const snap = await getDoc(doc(db, 'tenants', tenantId, 'config', 'negocio'))
  return snap.exists()
    ? { abierto: true, ...snap.data() as NegocioDoc }
    : { nombre: '', telefono: '', logoUrl: '', plantilla: '', subcategoria: '', mensualidad: 0, onboardingCompletado: false, abierto: true }
}

// ── Resolve tenant (igual que PanSystem) ─────────────────────────────────────
export async function resolveTenant(uid: string, urlTenant?: string): Promise<{ tenantId: string; rol: string }> {
  // 1. URL param explícito
  if (urlTenant) {
    const snap = await getDoc(doc(db, 'tenants', urlTenant, 'usuarios', uid))
    if (snap.exists()) return { tenantId: urlTenant, rol: snap.data().rol || 'dueño' }
  }

  // 2. Cache local
  const cached = typeof window !== 'undefined' ? localStorage.getItem('fp_tenant') : null
  if (cached) {
    const snap = await getDoc(doc(db, 'tenants', cached, 'usuarios', uid))
    if (snap.exists()) return { tenantId: cached, rol: snap.data().rol || 'dueño' }
  }

  // 3. Buscar en users/{uid}.studioIds
  const userSnap = await getDoc(doc(db, 'users', uid))
  if (userSnap.exists()) {
    const studioIds: string[] = userSnap.data().studioIds || []
    for (const sid of studioIds) {
      const appSnap = await getDoc(doc(db, 'studios', sid, 'apps', 'flowpass'))
      if (appSnap.exists()) {
        const usuSnap = await getDoc(doc(db, 'tenants', sid, 'usuarios', uid))
        if (usuSnap.exists()) return { tenantId: sid, rol: usuSnap.data().rol || 'dueño' }
      }
    }
  }

  return { tenantId: '', rol: '' }
}

// ── Alumnos ───────────────────────────────────────────────────────────────────
export type EstadoPago = 'al_corriente' | 'por_vencer' | 'vencido'
export type Grado = 'blanco' | 'amarillo' | 'naranja' | 'verde' | 'azul' | 'morado' | 'rojo' | 'cafe' | 'negro'

export interface AlumnoDoc {
  id:            string
  nombre:        string
  apellido:      string
  telefono:      string
  email:         string
  fotoUrl:       string
  grado:         Grado
  subcategoria:  string
  fechaInscripcion: string
  fechaVencimiento: string
  estadoPago:    EstadoPago
  activo:        boolean
  notas:         string
  creado:        any
}

export async function getAlumnos(tenantId: string): Promise<AlumnoDoc[]> {
  const snap = await getDocs(tenantCol(tenantId, 'alumnos'))
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as AlumnoDoc))
}

export async function setAlumno(tenantId: string, alumno: Omit<AlumnoDoc, 'id' | 'creado'>, id?: string): Promise<string> {
  if (id) {
    await setDoc(doc(db, 'tenants', tenantId, 'alumnos', id), alumno, { merge: true })
    return id
  }
  const ref = await addDoc(tenantCol(tenantId, 'alumnos'), { ...alumno, creado: serverTimestamp() })
  return ref.id
}

export async function deleteAlumno(tenantId: string, id: string): Promise<void> {
  await deleteDoc(doc(db, 'tenants', tenantId, 'alumnos', id))
}

// Aliases usados en páginas del panel
export const guardarAlumno = setAlumno

export function suscribirAlumnos(tenantId: string, cb: (alumnos: AlumnoDoc[]) => void): () => void {
  return onSnapshot(tenantCol(tenantId, 'alumnos'), snap => {
    cb(snap.docs.map(d => ({ id: d.id, ...d.data() } as AlumnoDoc)))
  })
}

// ── Pagos ─────────────────────────────────────────────────────────────────────
export interface PagoDoc {
  id:           string
  alumnoId:     string
  alumnoNombre: string
  monto:        number
  plan:         string
  mes:          string  // 'YYYY-MM'
  fecha:        string
  metodo:       'efectivo' | 'transferencia' | 'tarjeta'
  notas:        string
  creado:       any
}

export async function getPagos(tenantId: string, mes?: string): Promise<PagoDoc[]> {
  const col = tenantCol(tenantId, 'pagos')
  const q   = mes ? query(col, where('mes', '==', mes)) : col
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as PagoDoc))
}

export async function registrarPago(tenantId: string, pago: Omit<PagoDoc, 'id' | 'creado'>): Promise<string> {
  const ref = await addDoc(tenantCol(tenantId, 'pagos'), { ...pago, creado: serverTimestamp() })
  // Actualizar estado del alumno
  await updateDoc(doc(db, 'tenants', tenantId, 'alumnos', pago.alumnoId), {
    estadoPago:       'al_corriente',
    fechaVencimiento: proximoVencimiento(),
  })
  return ref.id
}

function proximoVencimiento(): string {
  const d = new Date()
  d.setMonth(d.getMonth() + 1)
  return d.toISOString().split('T')[0]
}

// ── Asistencia ────────────────────────────────────────────────────────────────
export interface AsistenciaDoc {
  id:          string
  alumnoId:    string
  alumnoNombre: string
  fecha:       string  // 'YYYY-MM-DD'
  creado:      any
}

export async function getAsistencia(tenantId: string, fecha: string): Promise<AsistenciaDoc[]> {
  const snap = await getDocs(query(tenantCol(tenantId, 'asistencia'), where('fecha', '==', fecha)))
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as AsistenciaDoc))
}

export async function toggleAsistencia(tenantId: string, alumnoId: string, alumnoNombre: string, fecha: string): Promise<void> {
  const snap = await getDocs(
    query(tenantCol(tenantId, 'asistencia'), where('alumnoId', '==', alumnoId), where('fecha', '==', fecha))
  )
  if (snap.empty) {
    await addDoc(tenantCol(tenantId, 'asistencia'), { alumnoId, alumnoNombre, fecha, creado: serverTimestamp() })
  } else {
    await deleteDoc(snap.docs[0].ref)
  }
}
