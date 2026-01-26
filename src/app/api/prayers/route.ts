import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, prayer, prayerForOther, otherPersonName } = body

    if (!prayer || prayer.trim() === '') {
      return NextResponse.json(
        { error: 'O pedido de oração é obrigatório' },
        { status: 400 }
      )
    }

    const newPrayer = await prisma.prayer.create({
      data: {
        name: name || null,
        email: email || null,
        prayer: prayer.trim(),
        prayerForOther: prayerForOther || false,
        otherPersonName: otherPersonName || null,
      },
    })

    return NextResponse.json(
      { message: 'Pedido de oração enviado com sucesso', prayer: newPrayer },
      { status: 201 }
    )
  } catch (error) {
    console.error('Erro ao criar pedido de oração:', error)
    return NextResponse.json(
      { error: 'Erro ao processar pedido de oração' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { error: 'Email é obrigatório' },
        { status: 400 }
      )
    }

    const prayers = await prisma.prayer.findMany({
      where: {
        email: email,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ prayers }, { status: 200 })
  } catch (error) {
    console.error('Erro ao buscar orações:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar orações' },
      { status: 500 }
    )
  }
}
