import type { Metadata } from 'next'
import LoginPage from '@/components/login-page'
import { buildMetadata, siteConfig } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Iniciar Sesión',
  description:
    'Inicia sesión con GitHub para acceder a tus API keys de forma segura en Atenea.',
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: `${siteConfig.url}/login`,
  },
  openGraph: {
    type: 'website',
    url: `${siteConfig.url}/login`,
  },
})

export default function Page() {
  return <LoginPage />
}
