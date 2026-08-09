import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendInvitationEmail({
  to,
  projectName,
  invitedBy,
  role,
  inviteUrl,
}: {
  to: string
  projectName: string
  invitedBy: string
  role: string
  inviteUrl: string
}) {
  try {
    await resend.emails.send({
      from: 'Atenea <noreply@cognilab.dev>',
      to,
      subject: `Invitación a ${projectName} en Atenea`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0A0E17; color: #F8FAFC;">
          <h1 style="color: #F59E0B; font-size: 24px;">Invitación a ${projectName}</h1>
          <p style="color: #94A3B8; font-size: 16px;">
            <strong>${invitedBy}</strong> te ha invitado como <strong>${role}</strong> al proyecto <strong>${projectName}</strong> en Atenea.
          </p>
          <p style="color: #94A3B8; font-size: 16px;">
            Para aceptar la invitación y acceder al proyecto, primero necesitas crear una cuenta con GitHub:
          </p>
          <a href="${inviteUrl}" style="display: inline-block; background-color: #F59E0B; color: #0A0E17; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 8px; margin: 20px 0;">
            Registrarse con GitHub
          </a>
          <p style="color: #64748B; font-size: 14px; margin-top: 30px;">
            Si no deseas aceptar esta invitación, puedes ignorar este correo electrónico.
          </p>
          <hr style="border-color: #1E293B; margin: 20px 0;">
          <p style="color: #64748B; font-size: 12px;">
            Este correo fue enviado por Atenea - Gestión de claves API segura.
          </p>
        </div>
      `,
    })
    return true
  } catch (error) {
    console.error('Error sending invitation email:', error)
    return false
  }
}
