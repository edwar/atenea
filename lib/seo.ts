import type { Metadata } from 'next'

export const siteConfig = {
  name: 'Atenea',
  title: 'Atenea — Gestión Segura de API Keys',
  description:
    'Gestiona todas tus API keys de forma segura y organizada. Encriptación AES-256, control de acceso, colaboración en equipo y exportación a .env.',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  ogImage: '/opengraph-image',
  twitterHandle: '@atenea',
  keywords: [
    'API keys',
    'gestión de claves',
    'secretos',
    'encriptación AES-256',
    'vault',
    'seguridad',
    'desarrolladores',
    'SSO',
    'GitHub OAuth',
  ],
}

export function buildMetadata(overrides: Metadata = {}): Metadata {
  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: siteConfig.title,
      template: `%s — ${siteConfig.name}`,
    },
    description: siteConfig.description,
    keywords: siteConfig.keywords,
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    applicationName: siteConfig.name,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      type: 'website',
      locale: 'es_CO',
      url: siteConfig.url,
      siteName: siteConfig.name,
      title: siteConfig.title,
      description: siteConfig.description,
      images: [
        {
          url: `${siteConfig.url}${siteConfig.ogImage}`,
          width: 1200,
          height: 630,
          alt: siteConfig.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: siteConfig.title,
      description: siteConfig.description,
      images: [`${siteConfig.url}${siteConfig.ogImage}`],
      creator: siteConfig.twitterHandle,
    },
    icons: {
      icon: [
        { url: '/favicon.svg', type: 'image/svg+xml' },
        { url: '/icon.png', type: 'image/png', sizes: '32x32' },
        { url: '/apple-icon.png', type: 'image/png', sizes: '180x180' },
      ],
      shortcut: '/favicon.svg',
      apple: '/apple-icon.png',
    },
    manifest: '/manifest.json',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    ...overrides,
  }
}
