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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
        <div className="text-center">
          <div className="animate-spin inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900" />
      
      <div className="fixed inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/20 backdrop-blur-sm bg-white/30 dark:bg-gray-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/dashboard" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  ← Voltar
                </Link>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-xl">📖</span>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                      Intercessões
                    </h1>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{filteredIntercessions.length} intercessões</p>
                  </div>
                </div>
              </div>
              
              <Link
                href="/dashboard/intercessions/new"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition font-semibold shadow-lg text-sm"
              >
                <span>+</span>
                <span className="hidden sm:inline">Nova Intercessão</span>
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-6">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 sm:px-6 py-3 rounded-lg font-semibold transition ${
                filter === 'all'
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-lg'
                  : 'bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-800/80'
              }`}
            >
              Todas
              <span className="ml-2 px-2 py-1 bg-blue-500/20 rounded-full text-sm">
                {intercessions.length}
              </span>
            </button>
            <button
              onClick={() => setFilter('published')}
              className={`px-4 sm:px-6 py-3 rounded-lg font-semibold transition ${
                filter === 'published'
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-lg'
                  : 'bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-800/80'
              }`}
            >
              Publicadas
              <span className="ml-2 px-2 py-1 bg-green-500/20 rounded-full text-sm">
                {publishedCount}
              </span>
            </button>
            <button
              onClick={() => setFilter('draft')}
              className={`px-4 sm:px-6 py-3 rounded-lg font-semibold transition ${
                filter === 'draft'
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-lg'
                  : 'bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-800/80'
              }`}
            >
              Rascunhos
              <span className="ml-2 px-2 py-1 bg-orange-500/20 rounded-full text-sm">
                {draftCount}
              </span>
            </button>
          </div>

          {filteredIntercessions.length === 0 ? (
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-12 text-center border border-white/20">
              <span className="text-6xl mb-4 block">📖</span>
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-4">Nenhuma intercessão encontrada</p>
              <Link
                href="/dashboard/intercessions/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition font-semibold shadow-lg"
              >
                <span>+</span>
                Criar primeira intercessão
              </Link>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredIntercessions.map((intercession) => (
                <div
                  key={intercession.id}
                  className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                >
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                          {intercession.title}
                        </h2>
                        <span
                          className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                            intercession.published
                              ? 'bg-green-500/20 text-green-700 dark:text-green-300'
                              : 'bg-orange-500/20 text-orange-700 dark:text-orange-300'
                          }`}
                        >
                          {intercession.published ? 'Publicada' : 'Rascunho'}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-3 text-sm sm:text-base">
                        {intercession.description}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                        📅 {new Date(intercession.date).toLocaleDateString('pt-BR')}
                      </p>
                      {intercession.images.length > 0 && (
                        <div className="flex gap-2 mt-3">
                          {intercession.images.slice(0, 3).map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              alt={`Imagem ${idx + 1}`}
                              className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border-2 border-white/20"
                            />
                          ))}
                          {intercession.images.length > 3 && (
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 dark:bg-gray-700/40 rounded-lg flex items-center justify-center text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
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
                        className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-700 dark:text-blue-300 rounded-lg text-xs sm:text-sm font-semibold transition whitespace-nowrap"
                      >
                        {intercession.published ? 'Despublicar' : 'Publicar'}
                      </button>
                      <Link
                        href={`/dashboard/intercessions/edit/${intercession.id}`}
                        className="px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-700 dark:text-yellow-300 rounded-lg text-xs sm:text-sm font-semibold transition text-center"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => deleteIntercession(intercession.id)}
                        className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-700 dark:text-red-300 rounded-lg text-xs sm:text-sm font-semibold transition"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
