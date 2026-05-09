import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'FlowPass — Gestión de membresías',
  description: 'Plataforma de gestión para academias, gimnasios y escuelas.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  )
}
