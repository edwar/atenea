import { ImageResponse } from 'next/og'
import { siteConfig } from '@/lib/seo'

export const alt = siteConfig.title
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0A0E17 0%, #111827 100%)',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Glow */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            height: 400,
            background: 'rgba(245, 158, 11, 0.12)',
            borderRadius: '50%',
            filter: 'blur(80px)',
          }}
        />
        {/* Grid pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.04,
            backgroundImage:
              'linear-gradient(rgba(248,250,252,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(248,250,252,0.5) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: 'linear-gradient(135deg, #FBBF24 0%, #D97706 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 32,
              fontWeight: 800,
              color: '#0A0E17',
            }}
          >
            A
          </div>
          <div
            style={{
              fontSize: 48,
              fontWeight: 800,
              color: '#F8FAFC',
              letterSpacing: '-0.02em',
            }}
          >
            Atenea
          </div>
        </div>
        {/* Headline */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 64,
            fontWeight: 800,
            color: '#F8FAFC',
            textAlign: 'center',
            lineHeight: 1.1,
            marginBottom: 16,
            letterSpacing: '-0.02em',
          }}
        >
          <span>Tus API keys, </span>
          <span style={{ color: '#F59E0B' }}>a salvo</span>
        </div>
        {/* Description */}
        <div
          style={{
            fontSize: 26,
            color: '#94A3B8',
            textAlign: 'center',
            maxWidth: 800,
            lineHeight: 1.4,
            padding: '0 48px',
          }}
        >
          Gestión segura de API keys con encriptación AES-256,
          control de acceso y colaboración en equipo.
        </div>
        {/* Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            marginTop: 32,
            padding: '12px 24px',
            borderRadius: 999,
            border: '1px solid rgba(245, 158, 11, 0.3)',
            background: 'rgba(245, 158, 11, 0.08)',
            color: '#F59E0B',
            fontSize: 20,
            fontWeight: 600,
          }}
        >
          <span>🔐</span>
          <span>Seguridad de nivel empresarial para desarrolladores</span>
        </div>
      </div>
    ),
    size,
  )
}
