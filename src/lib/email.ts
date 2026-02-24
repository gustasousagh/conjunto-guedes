import nodemailer from 'nodemailer'
import crypto from 'crypto'
import { prisma } from './prisma'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.SENHA_APP,
  },
})

// Função para criar um hash do email (para segurança na URL)
function createEmailHash(email: string): string {
  const secret = process.env.NEXTAUTH_SECRET || 'fallback-secret'
  return crypto
    .createHmac('sha256', secret)
    .update(email.toLowerCase())
    .digest('hex')
    .substring(0, 32)
}

interface SendPrayerResponseEmailParams {
  to: string
  name: string
  prayer: string
  response: string
}

export async function sendPrayerResponseEmail({
  to,
  name,
  prayer,
  response,
}: SendPrayerResponseEmailParams) {
  // Verificar se o email está na lista de cancelamento
  const unsubscribed = await prisma.emailUnsubscribe.findUnique({
    where: { email: to.toLowerCase() },
  })

  if (unsubscribed) {
    console.log('Email na lista de cancelamento, não enviando:', to)
    return { 
      success: false, 
      error: 'Email na lista de cancelamento',
      unsubscribed: true 
    }
  }

  const displayName = name || 'Irmão(ã)'
  const emailHash = createEmailHash(to)
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  const unsubscribeUrl = `${baseUrl}/cancelar-notificacoes?email=${encodeURIComponent(to)}&hash=${emailHash}`
  
  const mailOptions = {
    from: `"Conjunto Guedes" <${process.env.EMAIL}>`,
    to,
    subject: '🙏 Resposta ao seu pedido de oração - Conjunto Guedes',
    html: `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Resposta ao seu pedido de oração</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                      🙏 Conjunto Guedes
                    </h1>
                    <p style="margin: 10px 0 0; color: #e0e7ff; font-size: 16px;">
                      Resposta ao seu pedido de oração
                    </p>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                      Olá, <strong>${displayName}</strong>! 👋
                    </p>
                    
                    <p style="margin: 0 0 30px; color: #374151; font-size: 16px; line-height: 1.6;">
                      Recebemos seu pedido de oração e gostaríamos de compartilhar uma mensagem com você:
                    </p>

                    <!-- Prayer Request -->
                    <div style="background-color: #f9fafb; border-left: 4px solid #667eea; padding: 20px; margin-bottom: 30px; border-radius: 4px;">
                      <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px; font-weight: bold; text-transform: uppercase;">
                        Seu Pedido
                      </p>
                      <p style="margin: 0; color: #374151; font-size: 15px; line-height: 1.6; font-style: italic;">
                        "${prayer}"
                      </p>
                    </div>

                    <!-- Response -->
                    <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; margin-bottom: 30px; border-radius: 4px;">
                      <p style="margin: 0 0 10px; color: #1e40af; font-size: 14px; font-weight: bold; text-transform: uppercase;">
                        💬 Nossa Resposta
                      </p>
                      <p style="margin: 0; color: #1e3a8a; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">
${response}
                      </p>
                    </div>

                    <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                      Continuamos orando por você e por suas necessidades. Que Deus abençoe sua vida abundantemente! ✨
                    </p>

                    <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
                      <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6; text-align: center;">
                        <em>"Não andeis ansiosos por coisa alguma; antes em tudo sejam os vossos pedidos conhecidos diante de Deus pela oração e súplica com ações de graças."</em><br>
                        <strong>- Filipenses 4:6</strong>
                      </p>
                    </div>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0 0 15px; color: #6b7280; font-size: 14px;">
                      📧 Este é um email automático do sistema de orações
                    </p>
                    
                    <!-- Unsubscribe Button -->
                    <div style="margin: 20px 0;">
                      <a href="${unsubscribeUrl}" style="display: inline-block; padding: 12px 24px; background-color: #ef4444; color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 600; transition: background-color 0.3s;">
                        🔕 Não quero mais receber notificações
                      </a>
                    </div>
                    
                    <p style="margin: 15px 0 0; color: #9ca3af; font-size: 11px;">
                      Ao clicar no botão acima, você não receberá mais emails de notificação<br>
                      quando respondermos seus pedidos de oração.
                    </p>
                    
                    <p style="margin: 15px 0 0; color: #9ca3af; font-size: 12px;">
                      © ${new Date().getFullYear()} Conjunto Guedes. Todos os direitos reservados.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
    text: `
Olá, ${displayName}!

Recebemos seu pedido de oração e gostaríamos de compartilhar uma mensagem com você:

SEU PEDIDO:
"${prayer}"

NOSSA RESPOSTA:
${response}

Continuamos orando por você e por suas necessidades. Que Deus abençoe sua vida abundantemente!

"Não andeis ansiosos por coisa alguma; antes em tudo sejam os vossos pedidos conhecidos diante de Deus pela oração e súplica com ações de graças."
- Filipenses 4:6

---
Não quer mais receber notificações? Acesse: ${unsubscribeUrl}

Este é um email automático do sistema de orações do Conjunto Guedes.
© ${new Date().getFullYear()} Conjunto Guedes. Todos os direitos reservados.
    `,
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log('Email enviado:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Erro ao enviar email:', error)
    return { success: false, error }
  }
}
