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

    // Última intercessão publicada
    const lastIntercession = await prisma.intercessionPost.findFirst({
      where: {
        published: true,
      },
      orderBy: {
        date: 'desc',
      },
      select: {
        date: true,
      },
    })

    // Orações desde a última intercessão
    const prayersSinceLastIntercession = lastIntercession
      ? await prisma.prayer.count({
          where: {
            createdAt: {
              gte: lastIntercession.date,
            },
          },
        })
      : 0

    // Orações para outras pessoas (total)
    const prayersForOthersTotal = await prisma.prayer.count({
      where: {
        prayerForOther: true,
      },
    })

    // Orações para outras pessoas (hoje)
    const prayersForOthersToday = await prisma.prayer.count({
      where: {
        prayerForOther: true,
        createdAt: {
          gte: today,
        },
      },
    })

    // Pessoas únicas que pediram orações para outras pessoas
    const uniquePrayersForOthers = await prisma.prayer.findMany({
      where: {
        prayerForOther: true,
      },
      select: {
        name: true,
        email: true,
      },
      distinct: ['email'],
    })

    return NextResponse.json(
      {
        prayersToday,
        prayersTotal,
        intercessionsPublished,
        prayersSinceLastIntercession,
        lastIntercessionDate: lastIntercession?.date,
        prayersForOthersTotal,
        prayersForOthersToday,
        uniquePrayersForOthersCount: uniquePrayersForOthers.length,
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
