import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { id } = await params

    const intercession = await prisma.intercessionPost.findUnique({
      where: { id },
    })

    if (!intercession) {
      return NextResponse.json(
        { error: 'Intercessão não encontrada' },
        { status: 404 }
      )
    }

    // Converter images de string JSON para array
    const intercessionWithParsedImages = {
      ...intercession,
      images: JSON.parse(intercession.images),
    }

    return NextResponse.json({ intercession: intercessionWithParsedImages }, { status: 200 })
  } catch (error) {
    console.error('Erro ao buscar intercessão:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar intercessão' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { id } = await params
    const { title, description, date, images, published } = await request.json()

    // Garantir que images seja sempre uma string JSON
    const imagesStr = typeof images === 'string' ? images : JSON.stringify(images)

    const intercession = await prisma.intercessionPost.update({
      where: { id },
      data: { 
        title,
        description,
        date: new Date(date),
        images: imagesStr,
        published 
      },
    })

    return NextResponse.json({ intercession }, { status: 200 })
  } catch (error) {
    console.error('Erro ao atualizar intercessão:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar intercessão' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { id } = await params
    const { published } = await request.json()

    const intercession = await prisma.intercessionPost.update({
      where: { id },
      data: { published },
    })

    return NextResponse.json({ intercession }, { status: 200 })
  } catch (error) {
    console.error('Erro ao atualizar intercessão:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar intercessão' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { id } = await params

    await prisma.intercessionPost.delete({
      where: { id },
    })

    return NextResponse.json(
      { message: 'Intercessão excluída com sucesso' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erro ao excluir intercessão:', error)
    return NextResponse.json(
      { error: 'Erro ao excluir intercessão' },
      { status: 500 }
    )
  }
}
