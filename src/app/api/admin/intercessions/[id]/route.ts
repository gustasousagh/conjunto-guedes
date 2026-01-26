import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { published } = await request.json()

    const intercession = await prisma.intercessionPost.update({
      where: { id: params.id },
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
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    await prisma.intercessionPost.delete({
      where: { id: params.id },
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
