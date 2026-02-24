import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

// Função para criar um hash do email (para segurança na URL)
function createEmailHash(email: string): string {
  const secret = process.env.NEXTAUTH_SECRET || 'fallback-secret'
  return crypto
    .createHmac('sha256', secret)
    .update(email.toLowerCase())
    .digest('hex')
    .substring(0, 32)
}

// Verificar se o hash corresponde ao email
function verifyEmailHash(email: string, hash: string): boolean {
  return createEmailHash(email) === hash
}

export async function POST(request: NextRequest) {
  try {
    const { email, hash, reason } = await request.json()

    if (!email || !hash) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
    }

    // Verificar se o hash é válido para este email
    if (!verifyEmailHash(email, hash)) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 403 })
    }

    // Verificar se já está na lista
    const existing = await prisma.emailUnsubscribe.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existing) {
      return NextResponse.json({ 
        success: true, 
        message: 'Email já estava na lista de cancelamento' 
      })
    }

    // Adicionar à lista de cancelamento
    await prisma.emailUnsubscribe.create({
      data: {
        email: email.toLowerCase(),
        reason: reason || null,
      },
    })

    return NextResponse.json({ 
      success: true,
      message: 'Você não receberá mais notificações por email'
    })
  } catch (error) {
    console.error('Erro ao processar cancelamento:', error)
    return NextResponse.json({ error: 'Erro ao processar solicitação' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const email = searchParams.get('email')
    const hash = searchParams.get('hash')

    if (!email || !hash) {
      return new NextResponse('Parâmetros inválidos', { status: 400 })
    }

    // Verificar se o hash é válido
    if (!verifyEmailHash(email, hash)) {
      return new NextResponse('Token inválido', { status: 403 })
    }

    // Verificar se já está cancelado
    const existing = await prisma.emailUnsubscribe.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existing) {
      return NextResponse.json({ 
        alreadyUnsubscribed: true,
        email 
      })
    }

    return NextResponse.json({ 
      alreadyUnsubscribed: false,
      email,
      hash
    })
  } catch (error) {
    console.error('Erro ao verificar cancelamento:', error)
    return NextResponse.json({ error: 'Erro ao processar solicitação' }, { status: 500 })
  }
}

// Exportar função para criar o hash (para usar em outros lugares)
export { createEmailHash }
