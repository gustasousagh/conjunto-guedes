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
  })
  const [prayers, setPrayers] = useState<any[]>([])
  const [showOnlyForOthers, setShowOnlyForOthers] = useState(false)

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

  const getFilteredStats = () => {
    if (!showOnlyForOthers) {
      return stats
    }
    
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const forOthersPrayers = prayers.filter(p => p.prayerForOther)
    const forOthersToday = forOthersPrayers.filter(p => new Date(p.createdAt) >= today)
    
    return {
      prayersToday: forOthersToday.length,
      prayersTotal: forOthersPrayers.length,
      intercessionsPublished: stats.intercessionsPublished
    }
  }

  const displayStats = getFilteredStats()

  if (status === 'loading') {
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
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span>🙏</span>
                Pedidos de Oração Recebidos
              </h3>
              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard/nomes"
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:scale-105 shadow-lg"
                >
                  <span className="flex items-center gap-2">
                    <span>✨</span>
                    Modo galeria
                  </span>
                </Link>
            
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{displayStats.prayersToday}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Hoje</p>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{displayStats.prayersTotal}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total de Pedidos</p>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{displayStats.intercessionsPublished}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Intercessões Publicadas</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
              💡 {showOnlyForOthers ? 'Mostrando apenas orações feitas por outras pessoas' : 'Os pedidos de oração são enviados diretamente pelos fiéis através do site'}
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}
