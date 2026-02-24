import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json({ error: 'Email não fornecido' }, { status: 400 })
    }

    const unsubscribed = await prisma.emailUnsubscribe.findUnique({
      where: { email: email.toLowerCase() },
    })

    return NextResponse.json({ 
      unsubscribed: !!unsubscribed,
      email: email 
    })
  } catch (error) {
    console.error('Erro ao verificar status de cancelamento:', error)
    return NextResponse.json({ error: 'Erro ao verificar status' }, { status: 500 })
  }
}
