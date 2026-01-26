'use client'

import { useState, useEffect } from 'react'
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

export default function MinhasOracoes() {
  const [email, setEmail] = useState('')
  const [prayers, setPrayers] = useState<Prayer[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSearched(true)

    try {
      const response = await fetch(`/api/prayers?email=${encodeURIComponent(email)}`)
      const data = await response.json()

      if (response.ok) {
        setPrayers(data.prayers)
      } else {
        setError(data.error || 'Erro ao buscar orações')
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-2xl">✝️</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
                    Conjunto Guedes
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Muro das Orações</p>
                </div>
              </Link>
              
              <Link 
                href="/"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 hover:bg-white/80 dark:bg-gray-800/50 dark:hover:bg-gray-800/80 transition-all shadow-md text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                <span>🙏</span>
                Novo Pedido
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {/* Intro Section */}
          <div className="text-center mb-12 space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full shadow-xl mb-4">
              <span className="text-4xl">📖</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Minhas Orações
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
              Acesse seus pedidos de oração digitando o email que você usou ao criar.
            </p>
          </div>

          {/* Search Form */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8 sm:p-10 border border-white/20 mb-8">
            <form onSubmit={handleSearch} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  Digite seu Email
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-gray-900 dark:text-white placeholder-gray-400"
                />
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
              >
                {loading ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Buscando...
                  </>
                ) : (
                  <>
                    <span>🔍</span>
                    Buscar Minhas Orações
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Results */}
          {searched && (
            <div className="space-y-6">
              {prayers.length === 0 ? (
                <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/20">
                  <span className="text-6xl mb-4 block">📭</span>
                  <p className="text-gray-600 dark:text-gray-300 text-lg">
                    Nenhuma oração encontrada com este email.
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                    Certifique-se de usar o mesmo email que usou ao criar seus pedidos.
                  </p>
                </div>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <p className="text-gray-700 dark:text-gray-300 font-semibold">
                      {prayers.length} {prayers.length === 1 ? 'oração encontrada' : 'orações encontradas'}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {prayers.map((prayer) => (
                      <div
                        key={prayer.id}
                        className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-2xl">🙏</span>
                            {prayer.name && (
                              <span className="font-semibold text-gray-900 dark:text-white">
                                {prayer.name}
                              </span>
                            )}
                            {prayer.prayerForOther && prayer.otherPersonName && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700">
                                <span>👥</span>
                                Orando por: {prayer.otherPersonName}
                              </span>
                            )}
                          </div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(prayer.createdAt)}
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                          {prayer.prayer}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-white/20 backdrop-blur-sm bg-white/20 dark:bg-gray-900/20 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © 2026 Conjunto Guedes. Feito com ❤️ para a glória de Deus.
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
