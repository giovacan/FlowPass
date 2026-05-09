import { initializeApp, getApps } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey:            'AIzaSyBUnyYRleIK0qkyqAWLW04oZn6CZkAjh5s',
  authDomain:        'flowstudioya.firebaseapp.com',
  projectId:         'flowstudioya',
  storageBucket:     'flowstudioya.firebasestorage.app',
  messagingSenderId: '793231961557',
  appId:             '1:793231961557:web:731ce6eee2ac3dc46f215c',
}

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db   = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()
