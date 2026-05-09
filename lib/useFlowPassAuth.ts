'use client'
import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { resolveTenant, getNegocio } from '@/lib/firestore'

export interface FlowPassAuthState {
  tenantId:      string
  uid:           string
  rol:           string
  negocioNombre: string
  subcategoria:  string
  userName:      string
  plan:          'basic' | 'pro'
  ready:         boolean
  redirectTo:    string
}

const INITIAL: FlowPassAuthState = {
  tenantId: '', uid: '', rol: '', negocioNombre: '',
  subcategoria: '', userName: '', plan: 'basic', ready: false, redirectTo: '',
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

        const plan: 'basic' | 'pro' = studioSnap?.data()?.plan === 'pro' ? 'pro' : 'basic'

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
          ready:         true,
          redirectTo:    '',
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
            plan:          'basic',
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
