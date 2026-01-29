import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

// GET - Buscar versículo
export async function GET() {
  try {
    const [verseText, verseRef] = await Promise.all([
      prisma.siteSettings.findUnique({ where: { key: 'verse_text' } }),
      prisma.siteSettings.findUnique({ where: { key: 'verse_reference' } })
    ])

    return NextResponse.json({
      verse: {
        text: verseText?.value || "Não andeis ansiosos por coisa alguma; antes em tudo sejam os vossos pedidos conhecidos diante de Deus pela oração e súplica com ações de graças.",
        reference: verseRef?.value || "Filipenses 4:6"
      }
    })
  } catch (error) {
    console.error('Erro ao buscar versículo:', error)
    return NextResponse.json({ error: 'Erro ao buscar versículo' }, { status: 500 })
  }
}

// POST - Atualizar versículo (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { text, reference } = await request.json()

    await Promise.all([
      prisma.siteSettings.upsert({
        where: { key: 'verse_text' },
        update: { value: text },
        create: { key: 'verse_text', value: text }
      }),
      prisma.siteSettings.upsert({
        where: { key: 'verse_reference' },
        update: { value: reference },
        create: { key: 'verse_reference', value: reference }
      })
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao atualizar versículo:', error)
    return NextResponse.json({ error: 'Erro ao atualizar versículo' }, { status: 500 })
  }
}
