import type { Metadata } from 'next'
import Link from 'next/link'
import { Logo } from '@/components/logo'
import { buildMetadata, siteConfig } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Términos de Servicio',
  description:
    'Términos de servicio de Atenea, la plataforma de gestión segura de API keys para desarrolladores.',
  alternates: {
    canonical: `${siteConfig.url}/terms`,
  },
  openGraph: {
    type: 'website',
    url: `${siteConfig.url}/terms`,
  },
})

export default function TermsPage() {
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
        <h1 className="text-4xl font-bold mb-4">Términos de Servicio</h1>
        <p className="text-[#94A3B8] mb-8">Última actualización: 1 de enero de 2026</p>

        <div className="space-y-8 text-[#94A3B8] leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-[#F8FAFC] mb-4">1. Aceptación de los Términos</h2>
            <p>
              Al acceder y utilizar Atenea (&quot;el Servicio&quot;), usted acepta estar sujeto a estos Términos de Servicio.
              Si no está de acuerdo con alguna parte de estos términos, no puede acceder al Servicio.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#F8FAFC] mb-4">2. Descripción del Servicio</h2>
            <p>
              Atenea es una plataforma de gestión de claves API que permite a los desarrolladores almacenar,
              organizar y compartir claves API de forma segura. El Servicio incluye encriptación AES-256,
              control de acceso basado en roles y auditoría de actividades.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#F8FAFC] mb-4">3. Cuentas de Usuario</h2>
            <p className="mb-4">
              Para utilizar el Servicio, usted debe crear una cuenta proporcionando información precisa y completa.
              Usted es responsable de mantener la confidencialidad de su cuenta y contraseña.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Usted es responsable de todas las actividades que ocurran bajo su cuenta</li>
              <li>Debe notificarnos inmediatamente sobre cualquier uso no autorizado</li>
              <li>No debe compartir sus credenciales de acceso con terceros</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#F8FAFC] mb-4">4. Uso Aceptable</h2>
            <p className="mb-4">Usted acepta no utilizar el Servicio para:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Violación de leyes o regulaciones aplicables</li>
              <li>Envío de malware o código malicioso</li>
              <li>Intentos de acceso no autorizado a otros sistemas</li>
              <li>Interferencia con el funcionamiento del Servicio</li>
              <li>Recopilación de datos de otros usuarios sin su consentimiento</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#F8FAFC] mb-4">5. Propiedad Intelectual</h2>
            <p>
              El Servicio y su contenido original, características y funcionalidad son propiedad de Atenea
              y están protegidos por derechos de autor, marcas registradas y otras leyes de propiedad intelectual.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#F8FAFC] mb-4">6. Privacidad</h2>
            <p>
              Su uso del Servicio también está regido por nuestra{' '}
              <Link href="/privacy" className="text-amber-400 hover:text-amber-300 underline underline-offset-4">
                Política de Privacidad
              </Link>
              . Al utilizar el Servicio, usted consiente las prácticas descritas en esa política.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#F8FAFC] mb-4">7. Limitación de Responsabilidad</h2>
            <p>
              En ningún caso Atenea será responsable por daños indirectos, incidentales, especiales,
              consecuentes o punitivos, incluyendo pero no limitado a pérdida de datos, uso, u otras pérdidas intangibles.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#F8FAFC] mb-4">8. Modificaciones</h2>
            <p>
              Nos reservamos el derecho de modificar estos términos en cualquier momento.
              Las modificaciones entrarán en vigor inmediatamente después de su publicación.
              Su uso continuado del Servicio después de las modificaciones constituye su aceptación de los nuevos términos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#F8FAFC] mb-4">9. Contacto</h2>
            <p>
              Si tiene preguntas sobre estos Términos de Servicio, por favor contáctenos a través de
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
