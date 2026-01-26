'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface IntercessionPost {
  id: string
  title: string
  description: string
  date: string
  images: string[]
  published: boolean
  createdAt: string
}

export default function IntercessionsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [intercessions, setIntercessions] = useState<IntercessionPost[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchIntercessions()
    }
  }, [session])

  const fetchIntercessions = async () => {
    try {
      const res = await fetch('/api/admin/intercessions')
      const data = await res.json()
      setIntercessions(data.intercessions || [])
    } catch (error) {
      console.error('Erro ao buscar intercessões:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteIntercession = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta intercessão?')) return

    try {
      const res = await fetch(`/api/admin/intercessions/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setIntercessions((prev) => prev.filter((i) => i.id !== id))
      } else {
        alert('Erro ao excluir intercessão')
      }
    } catch (error) {
      console.error('Erro ao excluir:', error)
      alert('Erro ao excluir intercessão')
    }
  }

  const togglePublished = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/intercessions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !currentStatus }),
      })

      if (res.ok) {
        setIntercessions((prev) =>
          prev.map((i) =>
            i.id === id ? { ...i, published: !currentStatus } : i
          )
        )
      }
    } catch (error) {
      console.error('Erro ao atualizar:', error)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const filteredIntercessions = intercessions.filter((i) => {
    if (filter === 'published') return i.published
    if (filter === 'draft') return !i.published
    return true
  })

  const publishedCount = intercessions.filter((i) => i.published).length
  const draftCount = intercessions.filter((i) => !i.published).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">Intercessões</h1>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition text-center"
            >
              Voltar
            </Link>
            <Link
              href="/dashboard/intercessions/new"
              className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition font-semibold text-center"
            >
              + Nova Intercessão
            </Link>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-6 sm:mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 sm:px-6 py-3 rounded-lg font-semibold transition ${
              filter === 'all'
                ? 'bg-white text-purple-900'
                : 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20'
            }`}
          >
            Todas
            <span className="ml-2 px-2 py-1 bg-purple-500/30 rounded-full text-sm">
              {intercessions.length}
            </span>
          </button>
          <button
            onClick={() => setFilter('published')}
            className={`px-4 sm:px-6 py-3 rounded-lg font-semibold transition ${
              filter === 'published'
                ? 'bg-white text-purple-900'
                : 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20'
            }`}
          >
            Publicadas
            <span className="ml-2 px-2 py-1 bg-green-500/30 rounded-full text-sm">
              {publishedCount}
            </span>
          </button>
          <button
            onClick={() => setFilter('draft')}
            className={`px-4 sm:px-6 py-3 rounded-lg font-semibold transition ${
              filter === 'draft'
                ? 'bg-white text-purple-900'
                : 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20'
            }`}
          >
            Rascunhos
            <span className="ml-2 px-2 py-1 bg-orange-500/30 rounded-full text-sm">
              {draftCount}
            </span>
          </button>
        </div>

        {filteredIntercessions.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 sm:p-12 text-center text-white">
            <p className="text-lg sm:text-xl mb-4">Nenhuma intercessão encontrada</p>
            <Link
              href="/dashboard/intercessions/new"
              className="inline-block px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition font-semibold"
            >
              Criar primeira intercessão
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6">
            {filteredIntercessions.map((intercession) => (
              <div
                key={intercession.id}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 text-white"
              >
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                      <h2 className="text-xl sm:text-2xl font-bold">
                        {intercession.title}
                      </h2>
                      <span
                        className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                          intercession.published
                            ? 'bg-green-500/30 text-green-200'
                            : 'bg-orange-500/30 text-orange-200'
                        }`}
                      >
                        {intercession.published ? 'Publicada' : 'Rascunho'}
                      </span>
                    </div>
                    <p className="text-white/70 mb-3 text-sm sm:text-base">
                      {intercession.description}
                    </p>
                    <p className="text-white/50 text-xs sm:text-sm">
                      Data: {new Date(intercession.date).toLocaleDateString('pt-BR')}
                    </p>
                    {intercession.images.length > 0 && (
                      <div className="flex gap-2 mt-3">
                        {intercession.images.slice(0, 3).map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`Imagem ${idx + 1}`}
                            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg"
                          />
                        ))}
                        {intercession.images.length > 3 && (
                          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-lg flex items-center justify-center text-xs sm:text-sm">
                            +{intercession.images.length - 3}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-3 lg:flex lg:flex-col gap-2 lg:ml-4">
                    <button
                      onClick={() =>
                        togglePublished(intercession.id, intercession.published)
                      }
                      className="px-3 sm:px-4 py-2 bg-blue-500/30 hover:bg-blue-500/50 rounded-lg text-xs sm:text-sm font-semibold transition whitespace-nowrap"
                    >
                      {intercession.published ? 'Despublicar' : 'Publicar'}
                    </button>
                    <Link
                      href={`/dashboard/intercessions/edit/${intercession.id}`}
                      className="px-3 sm:px-4 py-2 bg-yellow-500/30 hover:bg-yellow-500/50 rounded-lg text-xs sm:text-sm font-semibold transition text-center"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => deleteIntercession(intercession.id)}
                      className="px-3 sm:px-4 py-2 bg-red-500/30 hover:bg-red-500/50 rounded-lg text-xs sm:text-sm font-semibold transition"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
