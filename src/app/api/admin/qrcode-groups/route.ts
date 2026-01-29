import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

// GET - Listar todos os grupos
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const groups = await prisma.qRCodeGroup.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { prayers: true }
        }
      }
    })

    return NextResponse.json({ groups })
  } catch (error) {
    console.error('Erro ao buscar grupos:', error)
    return NextResponse.json({ error: 'Erro ao buscar grupos' }, { status: 500 })
  }
}

// POST - Criar novo grupo
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { name, description, color } = await request.json()

    // Gerar slug a partir do nome
    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    const group = await prisma.qRCodeGroup.create({
      data: {
        name,
        slug,
        description,
        color: color || '#6366f1',
        active: true
      }
    })

    return NextResponse.json({ group })
  } catch (error: any) {
    console.error('Erro ao criar grupo:', error)
    
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Já existe um grupo com este nome' }, { status: 400 })
    }
    
    return NextResponse.json({ error: 'Erro ao criar grupo' }, { status: 500 })
  }
}
