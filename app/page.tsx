import type { Metadata } from 'next'
import LandingPage from '@/components/landing-page'
import { buildMetadata, siteConfig } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Atenea — Gestión Segura de API Keys',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: `${siteConfig.url}/`,
  },
})

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  featureList: [
    'Encriptación AES-256',
    'Gestión de API keys por proyecto',
    'Ambientes (Dev, Staging, QA, Producción)',
    'Control de acceso y roles',
    'Colaboración en equipo',
    'Exportación a .env',
  ],
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingPage />
    </>
  )
}
