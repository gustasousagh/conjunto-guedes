import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit')

    const posts = await prisma.intercessionPost.findMany({
      where: {
        published: true,
      },
      orderBy: {
        date: 'desc',
      },
      take: limit ? parseInt(limit) : undefined,
    })

    console.log('🔍 Busca de intercessões - Total encontrado:', posts.length)
    console.log('📊 Posts:', posts)

    // Converter images de string JSON para array
    const postsWithParsedImages = posts.map(post => ({
      ...post,
      images: JSON.parse(post.images),
    }))

    return NextResponse.json({ posts: postsWithParsedImages }, { status: 200 })
  } catch (error) {
    console.error('Erro ao buscar posts de intercessão:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar posts' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { title, description, date, images, published } = await request.json()

    if (!title || !description || !date) {
      return NextResponse.json(
        { error: 'Título, descrição e data são obrigatórios' },
        { status: 400 }
      )
    }

    const intercession = await prisma.intercessionPost.create({
      data: {
        title,
        description,
        date: new Date(date),
        images: JSON.stringify(images || []),
        published: published || false,
      },
    })

    return NextResponse.json({ intercession }, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar intercessão:', error)
    return NextResponse.json(
      { error: 'Erro ao criar intercessão' },
      { status: 500 }
    )
  }
}
