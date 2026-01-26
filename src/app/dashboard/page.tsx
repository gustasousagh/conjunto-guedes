'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState({
    prayersToday: 0,
    prayersTotal: 0,
    intercessionsPublished: 0,
    prayersSinceLastIntercession: 0,
    lastIntercessionDate: null as string | null,
    prayersForOthersTotal: 0,
    prayersForOthersToday: 0,
    uniquePrayersForOthersCount: 0,
  })
  const [prayers, setPrayers] = useState<any[]>([])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchStats()
      fetchPrayers()
    }
  }, [session])

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats')
      const data = await res.json()
      setStats(data)
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error)
    }
  }

  const fetchPrayers = async () => {
    try {
      const res = await fetch('/api/admin/prayers')
      const data = await res.json()
      setPrayers(data.prayers || [])
    } catch (error) {
      console.error('Erro ao buscar orações:', error)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Background com gradiente celestial */}
        <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900" />
        
        {/* Efeito de luz divina */}
        <div className="fixed inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        {/* Loading animado */}
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            {/* Ícone animado */}
            <div className="relative inline-flex items-center justify-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
                <span className="text-5xl">✝️</span>
              </div>
              <div className="absolute inset-0 w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full animate-ping opacity-75"></div>
            </div>
            
            {/* Texto */}
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400 mb-3">
              Carregando Dashboard
            </h2>
            
            {/* Barra de progresso animada */}
            <div className="w-64 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mx-auto">
              <div className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 animate-pulse">
              Preparando suas estatísticas...
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background com gradiente celestial */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900" />
      
      {/* Efeito de luz divina */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Conteúdo */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/20 backdrop-blur-sm bg-white/30 dark:bg-gray-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-xl">✝️</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
                    Dashboard Admin
                  </h1>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Bem-vindo, {session.user?.name}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Link 
                  href="/"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/50 hover:bg-white/80 dark:bg-gray-800/50 dark:hover:bg-gray-800/80 transition-all shadow-md text-xs font-medium text-gray-700 dark:text-gray-200"
                >
                  <span>🏠</span>
                  <span>Site</span>
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/80 hover:bg-red-600 transition-all shadow-md text-xs font-medium text-white"
                >
                  <span>🚪</span>
                  <span>Sair</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Intro */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Painel de Controle
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Gerencie o sistema de orações e intercessões
            </p>
          </div>

          {/* Gerenciar Intercessões */}
          <div className="mb-8">
            <Link
              href="/dashboard/intercessions"
              className="group block bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-2xl transition-all hover:scale-[1.01]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform">
                    📋
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Gerenciar Intercessões
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Veja, edite e publique posts de intercessão
                    </p>
                  </div>
                </div>
                <div className="text-gray-400 text-2xl group-hover:translate-x-1 transition-transform">
                  →
                </div>
              </div>
            </Link>
          </div>

          {/* Estatísticas de Orações */}
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span>🙏</span>
                Pedidos de Oração Recebidos
              </h3>
              <Link
                href="/dashboard/nomes"
                className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:scale-105 shadow-lg"
              >
                <span className="flex items-center gap-2">
                  <span>✨</span>
                  Modo galeria
                </span>
              </Link>
            </div>

            {/* Grid de estatísticas - Responsivo */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
              {/* Hoje */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl p-3 sm:p-4 border border-blue-200 dark:border-blue-700/50 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl sm:text-2xl">📅</span>
                  <p className="text-xs sm:text-sm font-medium text-blue-900 dark:text-blue-300">Hoje</p>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.prayersToday}</p>
                <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">pedidos</p>
              </div>

              {/* Total */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl p-3 sm:p-4 border border-purple-200 dark:border-purple-700/50 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl sm:text-2xl">📊</span>
                  <p className="text-xs sm:text-sm font-medium text-purple-900 dark:text-purple-300">Total</p>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.prayersTotal}</p>
                <p className="text-xs text-purple-700 dark:text-purple-400 mt-1">todo período</p>
              </div>

              {/* Desde última intercessão */}
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 rounded-xl p-3 sm:p-4 border border-amber-200 dark:border-amber-700/50 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl sm:text-2xl">⏱️</span>
                  <p className="text-xs sm:text-sm font-medium text-amber-900 dark:text-amber-300">Recentes</p>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-amber-600 dark:text-amber-400">{stats.prayersSinceLastIntercession}</p>
                <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">desde última</p>
              </div>

              {/* Intercessões publicadas */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-xl p-3 sm:p-4 border border-green-200 dark:border-green-700/50 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl sm:text-2xl">✅</span>
                  <p className="text-xs sm:text-sm font-medium text-green-900 dark:text-green-300">Publicadas</p>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">{stats.intercessionsPublished}</p>
                <p className="text-xs text-green-700 dark:text-green-400 mt-1">intercessões</p>
              </div>
            </div>

            {/* Estatísticas de orações para outras pessoas */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
              <h4 className="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <span>💝</span>
                Orações para Outras Pessoas
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 rounded-lg p-3 border border-pink-200 dark:border-pink-700/30">
                  <p className="text-lg sm:text-2xl font-bold text-pink-600 dark:text-pink-400">{stats.prayersForOthersToday}</p>
                  <p className="text-xs text-pink-700 dark:text-pink-400 mt-1">pedidos hoje</p>
                </div>
                <div className="bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-900/20 dark:to-rose-800/20 rounded-lg p-3 border border-rose-200 dark:border-rose-700/30">
                  <p className="text-lg sm:text-2xl font-bold text-rose-600 dark:text-rose-400">{stats.prayersForOthersTotal}</p>
                  <p className="text-xs text-rose-700 dark:text-rose-400 mt-1">total geral</p>
                </div>
                <div className="bg-gradient-to-br from-fuchsia-50 to-fuchsia-100 dark:from-fuchsia-900/20 dark:to-fuchsia-800/20 rounded-lg p-3 border border-fuchsia-200 dark:border-fuchsia-700/30">
                  <p className="text-lg sm:text-2xl font-bold text-fuchsia-600 dark:text-fuchsia-400">{stats.uniquePrayersForOthersCount}</p>
                  <p className="text-xs text-fuchsia-700 dark:text-fuchsia-400 mt-1">pessoas únicas</p>
                </div>
              </div>
            </div>

            {/* Info adicional */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-gray-600 dark:text-gray-400">
                <p className="flex items-center gap-1">
                  💡 Os pedidos são enviados pelos fiéis através do site
                </p>
                {stats.lastIntercessionDate && (
                  <p className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700/50 px-2 py-1 rounded">
                    📆 Última intercessão: {new Date(stats.lastIntercessionDate).toLocaleDateString('pt-BR')}
                  </p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
