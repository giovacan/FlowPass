import TenantPublicPage from './TenantPublicPage'

export function generateStaticParams() {
  return [{ tenantId: '_' }]
}

export default function Page() {
  return <TenantPublicPage />
}
