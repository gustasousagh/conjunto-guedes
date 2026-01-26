'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Prayer {
  id: string
  name: string | null
  prayerForOther: boolean
  otherPersonName: string | null
  createdAt: string
}

export default function NomesDoMesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [prayers, setPrayers] = useState<Prayer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchPrayers()
    }
  }, [session])

  const fetchPrayers = async () => {
    try {
      const res = await fetch('/api/admin/prayers')
      const data = await res.json()
      setPrayers(data.prayers || [])
    } catch (error) {
      console.error('Erro ao buscar orações:', error)
    } finally {
      setLoading(false)
    }
  }

  const getNamesThisMonth = () => {
    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    
    return prayers
      .filter(prayer => new Date(prayer.createdAt) >= firstDayOfMonth)
      .map(prayer => {
        const displayName = prayer.prayerForOther && prayer.otherPersonName 
          ? prayer.otherPersonName 
          : prayer.name || 'Anônimo'
        
        return {
          id: prayer.id,
          name: displayName,
          originalName: prayer.name || 'Anônimo',
          isPrayerForOther: prayer.prayerForOther,
          otherPersonName: prayer.otherPersonName,
          date: new Date(prayer.createdAt)
        }
      })
      .filter(item => item.name && item.name.trim().length > 0)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const names = getNamesThisMonth()

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

  if (!session) return null

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-pink-900" />
      
      <div className="fixed inset-0 opacity-20">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000" />
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
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-xl">✨</span>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                      Pessoas Orando Este Mês
                    </h1>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Intro */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full shadow-xl mb-4">
              <span className="text-3xl">🙏</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {names.length} {names.length === 1 ? 'Pessoa' : 'Pessoas'}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Foram lembradas em oração este mês
            </p>
          </div>

          {/* Cards de Nomes */}
          {names.length === 0 ? (
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-12 text-center border border-white/20">
              <span className="text-6xl mb-4 block">📭</span>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Nenhuma oração registrada este mês.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {names.map((item, index) => (
                <div
                  key={item.id}
                  className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-xl p-5 shadow-lg border border-white/20 hover:shadow-xl transition-all hover:scale-105 animate-fade-in"
                  style={{ 
                    animationDelay: `${index * 0.05}s`,
                    opacity: 0,
                    animation: 'fadeIn 0.5s ease-in forwards'
                  }}
                >
                  {/* Nome Principal */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                      <span className="text-xl">
                        {item.isPrayerForOther ? '👥' : '🙏'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                        {item.name}
                      </h3>
                      {item.isPrayerForOther && (
                        <p className="text-xs text-purple-600 dark:text-purple-400 mt-0.5">
                          Oração de: {item.originalName}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Data */}
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span>📅</span>
                    <span>{formatDate(item.date)}</span>
                  </div>

                  {/* Badge */}
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      item.isPrayerForOther
                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                        : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    }`}>
                      {item.isPrayerForOther ? 'Intercessão' : 'Oração Pessoal'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Mensagem Final */}
          {names.length > 0 && (
            <div className="mt-12 text-center">
              <div className="inline-block bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl px-8 py-4 border border-white/20">
                <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                  ✨ Todos são lembrados em oração ✨
                </p>
              </div>
            </div>
          )}
        </main>
      </div>

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
