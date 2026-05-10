'use client'
import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { resolveTenant, getNegocio } from '@/lib/firestore'
import { type PlanId, type FeatureOverrides, type PaymentStatus, cuentaSuspendida } from '@/lib/plans'

export interface FlowPassAuthState {
  tenantId:      string
  uid:           string
  rol:           string
  negocioNombre: string
  subcategoria:  string
  userName:      string
  plan:          PlanId
  extraUsuarios: number
  extraSedes:    number
  overrides:     FeatureOverrides
  paymentStatus: PaymentStatus
  trialEndsAt:   string | null
  suspendido:    boolean
  ready:         boolean
  redirectTo:    string
}

const INITIAL: FlowPassAuthState = {
  tenantId: '', uid: '', rol: '', negocioNombre: '',
  subcategoria: '', userName: '', plan: 'negocio',
  extraUsuarios: 0, extraSedes: 0, overrides: {},
  paymentStatus: 'trial', trialEndsAt: null, suspendido: false,
  ready: false, redirectTo: '',
}

export function useFlowPassAuth(): FlowPassAuthState {
  const [state, setState] = useState<FlowPassAuthState>(INITIAL)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async user => {
      if (!user) {
        localStorage.removeItem('fp_tenant')
        setState(s => ({ ...s, redirectTo: '/login' }))
        return
      }

      try {
        const displayName = user.displayName?.split(' ')[0] || user.email?.split('@')[0] || 'Usuario'
        const urlTenant   = new URLSearchParams(window.location.search).get('tenant') || undefined
        const resolved    = await resolveTenant(user.uid, urlTenant)

        if (!resolved.tenantId) {
          localStorage.removeItem('fp_tenant')
          setState(s => ({ ...s, redirectTo: '/login' }))
          return
        }

        const tenantId = resolved.tenantId
        localStorage.setItem('fp_tenant', tenantId)

        const [studioSnap, negocio] = await Promise.all([
          getDoc(doc(db, 'studios', tenantId)).catch(() => null),
          getNegocio(tenantId).catch(() => ({ nombre: '', abierto: true, subcategoria: '' })),
        ])

        const studioData                   = studioSnap?.data() || {}
        const plan: PlanId                 = (['personal','negocio','cadena','elite'].includes(studioData.plan) ? studioData.plan : 'negocio') as PlanId
        const extraUsuarios                = studioData.extraUsuarios  ?? 0
        const extraSedes                   = studioData.extraSedes     ?? 0
        const overrides: FeatureOverrides  = studioData.featureOverrides ?? {}
        const paymentStatus: PaymentStatus = studioData.paymentStatus   ?? 'trial'
        const trialEndsAt: string | null   = studioData.trialEndsAt     ?? null
        const suspendido                   = cuentaSuspendida(paymentStatus, trialEndsAt)

        if ((negocio as any).onboardingCompletado === false) {
          setState(s => ({ ...s, redirectTo: '/onboarding' }))
          return
        }

        setState({
          tenantId,
          uid:           user.uid,
          rol:           resolved.rol,
          negocioNombre: negocio.nombre,
          subcategoria:  (negocio as any).subcategoria || '',
          userName:      displayName,
          plan,
          extraUsuarios,
          extraSedes,
          overrides,
          paymentStatus,
          trialEndsAt,
          suspendido,
          ready:         true,
          redirectTo:    suspendido ? '/suspendido' : '',
        })
      } catch {
        const cached = localStorage.getItem('fp_tenant')
        if (cached) {
          setState({
            tenantId:      cached,
            uid:           user.uid,
            rol:           'dueño',
            negocioNombre: '',
            subcategoria:  '',
            userName:      user.displayName?.split(' ')[0] || '',
            plan:          'negocio',
            extraUsuarios: 0,
            extraSedes:    0,
            overrides:     {},
            paymentStatus: 'trial',
            trialEndsAt:   null,
            suspendido:    false,
            ready:         true,
            redirectTo:    '',
          })
        } else {
          setState(s => ({ ...s, redirectTo: '/login' }))
        }
      }
    })
    return () => unsub()
  }, [])

  return state
}
