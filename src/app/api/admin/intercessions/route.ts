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

    const intercessions = await prisma.intercessionPost.findMany({
      orderBy: {
        date: 'desc',
      },
    })

    // Converter images de string JSON para array
    const interceptionsWithParsedImages = intercessions.map(post => ({
      ...post,
      images: JSON.parse(post.images),
    }))

    return NextResponse.json({ intercessions: interceptionsWithParsedImages }, { status: 200 })
  } catch (error) {
    console.error('Erro ao buscar intercessões:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar intercessões' },
      { status: 500 }
    )
  }
}
