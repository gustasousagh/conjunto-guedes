import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

// PATCH - Atualizar grupo
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
    const { name, description, color, active } = await request.json()

    const updateData: any = {}
    
    if (name !== undefined) {
      updateData.name = name
      updateData.slug = name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
    }
    if (description !== undefined) updateData.description = description
    if (color !== undefined) updateData.color = color
    if (active !== undefined) updateData.active = active

    const group = await prisma.qRCodeGroup.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({ group })
  } catch (error) {
    console.error('Erro ao atualizar grupo:', error)
    return NextResponse.json({ error: 'Erro ao atualizar grupo' }, { status: 500 })
  }
}

// DELETE - Deletar grupo
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await params

    // Verificar se há orações vinculadas
    const count = await prisma.prayer.count({
      where: { qrCodeGroupId: id }
    })

    if (count > 0) {
      return NextResponse.json(
        { error: `Não é possível deletar. Existem ${count} orações vinculadas a este grupo.` },
        { status: 400 }
      )
    }

    await prisma.qRCodeGroup.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao deletar grupo:', error)
    return NextResponse.json({ error: 'Erro ao deletar grupo' }, { status: 500 })
  }
}
