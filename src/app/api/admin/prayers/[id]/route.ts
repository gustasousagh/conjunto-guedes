import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendPrayerResponseEmail } from '@/lib/email'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await params
    const { response, notifyByEmail } = await request.json()

    // Buscar a oração atual para obter os dados necessários
    const currentPrayer = await prisma.prayer.findUnique({
      where: { id },
    })

    if (!currentPrayer) {
      return NextResponse.json({ error: 'Oração não encontrada' }, { status: 404 })
    }

    const updatedPrayer = await prisma.prayer.update({
      where: { id },
      data: {
        response,
        respondedAt: response ? new Date() : null,
        notifiedByEmail: false, // Será atualizado depois se o email for enviado
      },
    })

    // Se deve notificar por email e existe email
    if (notifyByEmail && currentPrayer.email && response) {
      const emailResult = await sendPrayerResponseEmail({
        to: currentPrayer.email,
        name: currentPrayer.name || 'Irmão(ã)',
        prayer: currentPrayer.prayer,
        response: response,
      })

      // Atualizar flag de notificação se email foi enviado com sucesso
      if (emailResult.success) {
        await prisma.prayer.update({
          where: { id },
          data: { notifiedByEmail: true },
        })
        
        return NextResponse.json({ 
          prayer: { ...updatedPrayer, notifiedByEmail: true },
          emailSent: true 
        })
      } else if ((emailResult as any).unsubscribed) {
        return NextResponse.json({ 
          prayer: updatedPrayer,
          emailSent: false,
          emailError: 'Esta pessoa cancelou o recebimento de notificações',
          unsubscribed: true
        })
      } else {
        return NextResponse.json({ 
          prayer: updatedPrayer,
          emailSent: false,
          emailError: 'Não foi possível enviar o email'
        })
      }
    }

    return NextResponse.json({ prayer: updatedPrayer, emailSent: false })
  } catch (error) {
    console.error('Erro ao atualizar resposta:', error)
    return NextResponse.json({ error: 'Erro ao atualizar resposta' }, { status: 500 })
  }
}
