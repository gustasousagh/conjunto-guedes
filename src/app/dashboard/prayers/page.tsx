'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Prayer {
  id: string
  name: string | null
  email: string | null
  prayer: string
  prayerForOther: boolean
  otherPersonName: string | null
  createdAt: string
}

export default function PrayersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [prayers, setPrayers] = useState<Prayer[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'today' | 'week'>('all')
  const [showOnlyForOthers, setShowOnlyForOthers] = useState(false)
  const [showNamesAnimation, setShowNamesAnimation] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchPrayers()
    }
  }, [status])

  const fetchPrayers = async () => {
    try {
      const response = await fetch('/api/admin/prayers')
      if (response.ok) {
        const data = await response.json()
        setPrayers(data.prayers)
      }
    } catch (error) {
      console.error('Erro ao buscar orações:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filterPrayers = () => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

    return prayers.filter(prayer => {
      const prayerDate = new Date(prayer.createdAt)
      
      // Filtro de tempo
      let passesTimeFilter = true
      if (filter === 'today') {
        passesTimeFilter = prayerDate >= today
      } else if (filter === 'week') {
        passesTimeFilter = prayerDate >= weekAgo
      }
      
      // Filtro de "orando por outros"
      const passesOthersFilter = !showOnlyForOthers || prayer.prayerForOther
      
      return passesTimeFilter && passesOthersFilter
    })
  }
  
  // Obter nomes do mês atual
  const getNamesThisMonth = () => {
    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    
    return prayers
      .filter(prayer => new Date(prayer.createdAt) >= firstDayOfMonth)
      .map(prayer => {
        if (prayer.prayerForOther && prayer.otherPersonName) {
          return prayer.otherPersonName
        }
        return prayer.name || 'Anônimo'
      })
      .filter(name => name && name.trim().length > 0)
  }

  const filteredPrayers = filterPrayers()

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
        <div className="text-center">
          <div className="animate-spin inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando orações...</p>
        </div>
      </div>
    )
  }

  if (!session) return null

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
                <Link href="/dashboard" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  ← Voltar
                </Link>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-xl">🙏</span>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                      Pedidos de Oração
                    </h1>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{filteredPrayers.length} pedidos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Novos Botões de Ação */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setShowOnlyForOthers(!showOnlyForOthers)}
              className={`p-4 rounded-xl transition-all shadow-lg ${
                showOnlyForOthers
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white scale-105'
                  : 'bg-white/70 dark:bg-gray-800/70 text-gray-900 dark:text-white hover:scale-105'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl">👥</span>
                <div>
                  <p className="font-bold">Orações por Outros</p>
                  <p className="text-xs opacity-80">
                    {prayers.filter(p => p.prayerForOther).length} pedidos
                  </p>
                </div>
              </div>
            </button>
            
            <button
              onClick={() => setShowNamesAnimation(true)}
              className="p-4 rounded-xl transition-all shadow-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:scale-105"
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl">✨</span>
                <div>
                  <p className="font-bold">Ver Nomes do Mês</p>
                  <p className="text-xs opacity-80">
                    {getNamesThisMonth().length} pessoas
                  </p>
                </div>
              </div>
            </button>
          </div>

          {/* Filtros e Stats */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <button
              onClick={() => setFilter('all')}
              className={`p-4 rounded-xl transition-all ${
                filter === 'all'
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-white/70 dark:bg-gray-800/70 text-gray-900 dark:text-white hover:scale-105'
              }`}
            >
              <p className="text-2xl font-bold">{prayers.length}</p>
              <p className="text-xs mt-1 opacity-80">Todas</p>
            </button>
            <button
              onClick={() => setFilter('today')}
              className={`p-4 rounded-xl transition-all ${
                filter === 'today'
                  ? 'bg-green-600 text-white shadow-lg scale-105'
                  : 'bg-white/70 dark:bg-gray-800/70 text-gray-900 dark:text-white hover:scale-105'
              }`}
            >
              <p className="text-2xl font-bold">
                {prayers.filter(p => new Date(p.createdAt) >= new Date(new Date().setHours(0,0,0,0))).length}
              </p>
              <p className="text-xs mt-1 opacity-80">Hoje</p>
            </button>
            <button
              onClick={() => setFilter('week')}
              className={`p-4 rounded-xl transition-all ${
                filter === 'week'
                  ? 'bg-purple-600 text-white shadow-lg scale-105'
                  : 'bg-white/70 dark:bg-gray-800/70 text-gray-900 dark:text-white hover:scale-105'
              }`}
            >
              <p className="text-2xl font-bold">
                {prayers.filter(p => new Date(p.createdAt) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
              </p>
              <p className="text-xs mt-1 opacity-80">Última Semana</p>
            </button>
            <Link
              href="/dashboard/intercessions/new"
              className="p-4 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:scale-105 transition-all flex flex-col items-center justify-center shadow-lg"
            >
              <p className="text-2xl font-bold">➕</p>
              <p className="text-xs mt-1">Registrar Intercessão</p>
            </Link>
          </div>

          {/* Lista de Orações */}
          {filteredPrayers.length === 0 ? (
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-12 text-center border border-white/20">
              <span className="text-6xl mb-4 block">📭</span>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Nenhuma oração encontrada neste período.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPrayers.map((prayer) => (
                <div
                  key={prayer.id}
                  className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-2xl">🙏</span>
                      {prayer.name && (
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {prayer.name}
                        </span>
                      )}
                      {prayer.email && (
                        <span className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                          {prayer.email}
                        </span>
                      )}
                      {prayer.prayerForOther && prayer.otherPersonName && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700">
                          <span>👥</span>
                          Orando por: {prayer.otherPersonName}
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {formatDate(prayer.createdAt)}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                    {prayer.prayer}
                  </p>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Modal de Animação de Nomes */}
      {showNamesAnimation && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowNamesAnimation(false)}
        >
          <div 
            className="relative max-w-4xl w-full h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowNamesAnimation(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-xl transition-all"
            >
              ✕
            </button>
            
            <div className="h-full overflow-y-auto p-8 space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-white mb-2">🙏</h2>
                <h3 className="text-2xl font-bold text-white mb-1">
                  Pessoas Orando Este Mês
                </h3>
                <p className="text-white/60 text-sm">
                  {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                </p>
              </div>
              
              {getNamesThisMonth().map((name, index) => (
                <div
                  key={index}
                  className="text-center py-4 animate-fade-in"
                  style={{ 
                    animationDelay: `${index * 0.1}s`,
                    opacity: 0,
                    animation: 'fadeIn 0.5s ease-in forwards'
                  }}
                >
                  <p className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                    {name}
                  </p>
                </div>
              ))}
              
              <div className="text-center py-8">
                <p className="text-white/60 text-lg">
                  ✨ Todos são lembrados em oração ✨
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
