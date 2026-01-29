import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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
    const { response } = await request.json()

    const updatedPrayer = await prisma.prayer.update({
      where: { id },
      data: {
        response,
        respondedAt: response ? new Date() : null,
      },
    })

    return NextResponse.json({ prayer: updatedPrayer })
  } catch (error) {
    console.error('Erro ao atualizar resposta:', error)
    return NextResponse.json({ error: 'Erro ao atualizar resposta' }, { status: 500 })
  }
}
