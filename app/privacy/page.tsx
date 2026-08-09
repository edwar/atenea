import type { Metadata } from 'next'
import Link from 'next/link'
import { Logo } from '@/components/logo'
import { buildMetadata, siteConfig } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Política de Privacidad',
  description:
    'Política de privacidad de Atenea. Cómo protegemos tus API keys con encriptación AES-256 y qué datos recopilamos.',
  alternates: {
    canonical: `${siteConfig.url}/privacy`,
  },
  openGraph: {
    type: 'website',
    url: `${siteConfig.url}/privacy`,
  },
})

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0A0E17] text-[#F8FAFC]">
      {/* Header */}
      <header className="border-b border-[#1E293B] bg-[#0A0E17]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <Logo size="md" />
            <span className="text-lg font-bold tracking-tight">Atenea</span>
          </Link>
          <Link href="/" className="text-sm text-[#94A3B8] hover:text-[#F8FAFC] transition-colors">
            Volver al inicio
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-4xl font-bold mb-4">Política de Privacidad</h1>
        <p className="text-[#94A3B8] mb-8">Última actualización: 1 de enero de 2026</p>

        <div className="space-y-8 text-[#94A3B8] leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-[#F8FAFC] mb-4">1. Información que Recopilamos</h2>
            <p className="mb-4">Recopilamos información que usted nos proporciona directamente:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong className="text-[#F8FAFC]">Información de cuenta:</strong> nombre, correo electrónico y foto de perfil de su cuenta de GitHub</li>
              <li><strong className="text-[#F8FAFC]">Claves API:</strong> los nombres y valores de las claves API que usted almacena en Atenea</li>
              <li><strong className="text-[#F8FAFC]">Datos de uso:</strong> información sobre cómo utiliza el Servicio</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#F8FAFC] mb-4">2. Cómo Usamos su Información</h2>
            <p className="mb-4">Utilizamos la información recopilada para:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Proveer y mantener el Servicio</li>
              <li>Mejorar la experiencia del usuario</li>
              <li>Enviar notificaciones relacionadas con su cuenta</li>
              <li>Proveer soporte técnico</li>
              <li>Proteger contra fraudes y uso no autorizado</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#F8FAFC] mb-4">3. Seguridad de los Datos</h2>
            <p className="mb-4">
              La seguridad de sus datos es nuestra prioridad. Implementamos las siguientes medidas:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong className="text-[#F8FAFC]">Encriptación AES-256:</strong> todas las claves API están encriptadas en reposo</li>
              <li><strong className="text-[#F8FAFC]">Transporte seguro:</strong> toda la comunicación utiliza HTTPS/TLS</li>
              <li><strong className="text-[#F8FAFC]">Autenticación segura:</strong> inicio de sesión a través de OAuth con GitHub</li>
              <li><strong className="text-[#F8FAFC]">Control de acceso:</strong> permisos basados en roles por proyecto</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#F8FAFC] mb-4">4. Compartición de Datos</h2>
            <p className="mb-4">
              No vendemos ni compartimos su información personal con terceros, excepto:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Con su consentimiento explícito</li>
              <li>Para cumplir con obligaciones legales</li>
              <li>Para proteger nuestros derechos legales</li>
              <li>Con proveedores de servicios que nos ayudan a operar el Servicio</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#F8FAFC] mb-4">5. Retención de Datos</h2>
            <p>
              Mantenemos su información personal mientras su cuenta esté activa o según sea necesario
              para proporcionar el Servicio. Si elimina su cuenta, eliminaremos sus datos personales
              de manera segura dentro de los 30 días.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#F8FAFC] mb-4">6. Sus Derechos</h2>
            <p className="mb-4">Usted tiene derecho a:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Acceder a su información personal</li>
              <li>Corregir datos inexactos</li>
              <li>Solicitar la eliminación de sus datos</li>
              <li>Oponerse al procesamiento de sus datos</li>
              <li>Solicitar la portabilidad de sus datos</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#F8FAFC] mb-4">7. Cookies</h2>
            <p>
              Utilizamos cookies y tecnologías similares para mantener su sesión activa y mejorar
              el Servicio. Puede configurar su navegador para rechazar cookies, pero esto podría
              afectar la funcionalidad del Servicio.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#F8FAFC] mb-4">8. Cambios en esta Política</h2>
            <p>
              Nos reservamos el derecho de actualizar esta política de privacidad en cualquier momento.
              Le notificaremos sobre cambios significativos publicando la nueva política en esta página
              y actualizando la fecha de &quot;Última actualización&quot;.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#F8FAFC] mb-4">9. Contacto</h2>
            <p>
              Si tiene preguntas sobre esta Política de Privacidad, por favor contáctenos a través de
              nuestro correo electrónico de soporte.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1E293B] py-8">
        <div className="mx-auto max-w-6xl px-6 text-center text-sm text-[#64748B]">
          © 2026 Atenea. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  )
}
