import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Pegar orações de hoje
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const prayersToday = await prisma.prayer.count({
      where: {
        createdAt: {
          gte: today,
        },
      },
    })

    // Total de orações
    const prayersTotal = await prisma.prayer.count()

    // Intercessões publicadas
    const intercessionsPublished = await prisma.intercessionPost.count({
      where: {
        published: true,
      },
    })

    return NextResponse.json(
      {
        prayersToday,
        prayersTotal,
        intercessionsPublished,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar estatísticas' },
      { status: 500 }
    )
  }
}
