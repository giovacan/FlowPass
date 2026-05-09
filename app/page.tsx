export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center" style={{ background: '#F8F9FA' }}>
      <div className="text-center">
        <h1 className="text-3xl font-bold" style={{ color: '#1a1a2e' }}>FlowPass</h1>
        <p className="mt-2 text-gray-500">Plataforma de gestión de membresías</p>
        <a href="/login" className="mt-6 inline-block px-6 py-3 rounded-xl text-white font-semibold"
          style={{ background: '#1a1a2e' }}>
          Iniciar sesión
        </a>
      </div>
    </main>
  )
}
