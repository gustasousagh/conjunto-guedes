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
  response: string | null
  respondedAt: string | null
  createdAt: string
  source: string | null
  qrCodeGroup: {
    id: string
    name: string
    slug: string
    color: string
  } | null
}

interface QRCodeGroup {
  id: string
  name: string
  slug: string
  color: string
  active: boolean
}

export default function NomesDoMesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [prayers, setPrayers] = useState<Prayer[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPrayer, setSelectedPrayer] = useState<Prayer | null>(null)
  const [responseText, setResponseText] = useState('')
  const [saving, setSaving] = useState(false)
  const [qrCodeGroups, setQrCodeGroups] = useState<QRCodeGroup[]>([])
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)
  
  // Filtros
  const [filters, setFilters] = useState({
    thisMonth: true,
    unanswered: false,
    forOthers: false,
  })
  
  // Paginação
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [totalPrayers, setTotalPrayers] = useState(0)
  const itemsPerPage = 12

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchGroups()
    }
  }, [session])

  useEffect(() => {
    if (session) {
      setPrayers([])
      setPage(1)
      setHasMore(true)
      fetchPrayers(1, true)
    }
  }, [session, filters, selectedGroupId])

  const fetchGroups = async () => {
    try {
      const res = await fetch('/api/admin/qrcode-groups')
      const data = await res.json()
      setQrCodeGroups(data.groups || [])
    } catch (error) {
      console.error('Erro ao buscar grupos:', error)
    }
  }

  const fetchPrayers = async (pageNum: number, reset: boolean) => {
    try {
      if (pageNum === 1) {
        setLoading(true)
      } else {
        setLoadingMore(true)
      }

      const res = await fetch('/api/admin/prayers')
      const data = await res.json()
      
      let filtered = data.prayers || []
      
      // Ordenar do mais novo para o mais antigo
      filtered = filtered.sort((a: Prayer, b: Prayer) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      })
      
      // Aplicar filtros
      if (filters.thisMonth) {
        const now = new Date()
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        filtered = filtered.filter((p: Prayer) => new Date(p.createdAt) >= firstDayOfMonth)
      }
      
      if (filters.unanswered) {
        filtered = filtered.filter((p: Prayer) => !p.response)
      }
      
      if (filters.forOthers) {
        filtered = filtered.filter((p: Prayer) => p.prayerForOther)
      }
      
      // Filtrar por grupo de QR Code
      if (selectedGroupId) {
        filtered = filtered.filter((p: Prayer) => p.qrCodeGroup?.id === selectedGroupId)
      }
      
      // Salvar total antes de paginar
      setTotalPrayers(filtered.length)
      
      // Paginação
      const startIndex = (pageNum - 1) * itemsPerPage
      const endIndex = startIndex + itemsPerPage
      const paginatedData = filtered.slice(startIndex, endIndex)
      
      if (reset) {
        setPrayers(paginatedData)
      } else {
        setPrayers(prev => [...prev, ...paginatedData])
      }
      
      setHasMore(endIndex < filtered.length)
    } catch (error) {
      console.error('Erro ao buscar orações:', error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const toggleFilter = (filterName: 'thisMonth' | 'unanswered' | 'forOthers') => {
    setFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }))
  }

  // Scroll infinito
  useEffect(() => {
    const handleScroll = () => {
      if (loadingMore || !hasMore) return
      
      const scrolledToBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 500
      
      if (scrolledToBottom) {
        setPage(prev => prev + 1)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [loadingMore, hasMore])

  useEffect(() => {
    if (page > 1 && session) {
      fetchPrayers(page, false)
    }
  }, [page])

  const getProcessedPrayers = () => {
    return prayers
      .map(prayer => {
        const displayName = prayer.prayerForOther && prayer.otherPersonName 
          ? prayer.otherPersonName 
          : prayer.name || 'Anônimo'
        
        return {
          ...prayer,
          displayName,
          originalName: prayer.name || 'Anônimo',
          date: new Date(prayer.createdAt)
        }
      })
      .filter(item => item.displayName && item.displayName.trim().length > 0)
  }

  const openPrayerModal = (prayer: any) => {
    setSelectedPrayer(prayer)
    setResponseText(prayer.response || '')
  }

  const closePrayerModal = () => {
    setSelectedPrayer(null)
    setResponseText('')
  }

  const saveResponse = async () => {
    if (!selectedPrayer) return
    
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/prayers/${selectedPrayer.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ response: responseText }),
      })

      if (res.ok) {
        // Atualizar a lista local
        setPrayers(prev => prev.map(p => 
          p.id === selectedPrayer.id 
            ? { ...p, response: responseText, respondedAt: new Date().toISOString() }
            : p
        ))
        closePrayerModal()
      } else {
        alert('Erro ao salvar resposta')
      }
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao salvar resposta')
    } finally {
      setSaving(false)
    }
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
                      Pedidos de Oração Este Mês
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
          {/* Filtros */}
          <div className="mb-8 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Filtros Rápidos
              </h3>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <button
                  onClick={() => toggleFilter('thisMonth')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    filters.thisMonth
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                      : 'bg-white/60 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-800/80'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{filters.thisMonth ? '✓' : '○'}</span>
                    📅 Este Mês
                  </span>
                </button>

                <button
                  onClick={() => toggleFilter('unanswered')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    filters.unanswered
                      ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg'
                      : 'bg-white/60 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-800/80'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{filters.unanswered ? '✓' : '○'}</span>
                    ⏳ Sem Resposta
                  </span>
                </button>

                <button
                  onClick={() => toggleFilter('forOthers')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    filters.forOthers
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                      : 'bg-white/60 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-800/80'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{filters.forOthers ? '✓' : '○'}</span>
                    👥 Para Outros
                  </span>
                </button>
              </div>
            </div>

            {/* Filtro de Grupos de QR Code */}
            {qrCodeGroups.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    📱 Origem do Pedido
                  </h3>
                  {selectedGroupId && (
                    <button
                      onClick={() => setSelectedGroupId(null)}
                      className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    >
                      Limpar
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {qrCodeGroups.filter(g => g.active).map(group => (
                    <button
                      key={group.id}
                      onClick={() => setSelectedGroupId(selectedGroupId === group.id ? null : group.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                        selectedGroupId === group.id
                          ? 'text-white shadow-lg'
                          : 'bg-white/60 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-800/80'
                      }`}
                      style={{
                        backgroundColor: selectedGroupId === group.id ? group.color : undefined
                      }}
                    >
                      <span className="flex items-center gap-2">
                        <span>{selectedGroupId === group.id ? '✓' : '○'}</span>
                        {group.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Filtros */}
          <div className="mb-8 hidden">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Filtros
            </h3>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <button
                onClick={() => toggleFilter('thisMonth')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  filters.thisMonth
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'bg-white/60 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-800/80'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{filters.thisMonth ? '✓' : '○'}</span>
                  📅 Este Mês
                </span>
              </button>

              <button
                onClick={() => toggleFilter('unanswered')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  filters.unanswered
                    ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg'
                    : 'bg-white/60 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-800/80'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{filters.unanswered ? '✓' : '○'}</span>
                  ⏳ Sem Resposta
                </span>
              </button>

              <button
                onClick={() => toggleFilter('forOthers')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  filters.forOthers
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                    : 'bg-white/60 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-800/80'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{filters.forOthers ? '✓' : '○'}</span>
                  👥 Para Outros
                </span>
              </button>
            </div>
          </div>

          {/* Intro */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full shadow-xl mb-4">
              <span className="text-3xl">🙏</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {totalPrayers} {totalPrayers === 1 ? 'Pedido' : 'Pedidos'}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {filters.thisMonth ? 'Este mês' : 'Total'} • {filters.unanswered ? 'Aguardando resposta' : 'Todos os status'}
            </p>
          </div>

          {/* Cards de Nomes */}
          {(() => {
            const processedPrayers = getProcessedPrayers();
            if (processedPrayers.length === 0 && !loading) {
              return (
                <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-12 text-center border border-white/20">
                  <span className="text-6xl mb-4 block">📭</span>
                  <p className="text-gray-600 dark:text-gray-300 text-lg">
                    Nenhuma oração encontrada com os filtros selecionados.
                  </p>
                </div>
              );
            }
            
            return (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {processedPrayers.map((item: any, index: number) => (
                  <div
                    key={item.id}
                    onClick={() => openPrayerModal(item)}
                    className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-xl p-5 shadow-lg border border-white/20 hover:shadow-xl transition-all hover:scale-105 cursor-pointer"
                  >
                    {/* Nome Principal */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                        <span className="text-xl">
                          {item.prayerForOther ? '👥' : '🙏'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                          {item.displayName}
                        </h3>
                        {item.prayerForOther && (
                          <p className="text-xs text-purple-600 dark:text-purple-400 mt-0.5">
                            Oração de: {item.originalName}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Prévia do Pedido */}
                    <div className="mb-3">
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                        {item.prayer}
                      </p>
                    </div>

                    {/* Status da Resposta */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      {item.response ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                          ✅ Respondido
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300">
                          ⏳ Aguardando
                        </span>
                      )}
                    </div>

                    {/* Data */}
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <span>📅</span>
                      <span>{formatDate(item.date)}</span>
                    </div>

                    {/* Badge */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        item.prayerForOther
                          ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                          : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      }`}>
                        {item.prayerForOther ? 'Intercessão' : 'Oração Pessoal'}
                      </span>
                      
                      {/* Badge do Grupo de QR Code */}
                      {item.qrCodeGroup && (
                        <span 
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white"
                          style={{ backgroundColor: item.qrCodeGroup.color }}
                        >
                          📱 {item.qrCodeGroup.name}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Loading More */}
              {loadingMore && (
                <div className="text-center py-8">
                  <div className="animate-spin inline-block w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full"></div>
                  <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">Carregando mais...</p>
                </div>
              )}

              {/* Fim dos resultados */}
              {!hasMore && processedPrayers.length > 0 && (
                <div className="text-center py-8">
                  <div className="inline-block bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/20">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      ✨ Todos os pedidos foram carregados
                    </p>
                  </div>
                </div>
              )}
              </>
            );
          })()}
        </main>
      </div>

      {/* Modal de Detalhes e Resposta */}
      {selectedPrayer && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closePrayerModal}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 sm:p-8">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {selectedPrayer.displayName}
                  </h2>
                  {selectedPrayer.prayerForOther && (
                    <p className="text-sm text-purple-600 dark:text-purple-400">
                      Oração de: {selectedPrayer.originalName}
                    </p>
                  )}
                  {selectedPrayer.email && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      📧 {selectedPrayer.email}
                    </p>
                  )}
                </div>
                <button
                  onClick={closePrayerModal}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  <span className="text-2xl">✕</span>
                </button>
              </div>

              {/* Pedido de Oração */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <span>🙏</span>
                  Pedido de Oração
                </h3>
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {selectedPrayer.prayer}
                  </p>
                </div>
              </div>

              {/* Data */}
              <div className="mb-6 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <span>📅</span>
                <span>{formatDate(selectedPrayer.date)}</span>
              </div>

              {/* Resposta */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <span>💬</span>
                  Sua Resposta
                  {selectedPrayer.respondedAt && (
                    <span className="text-xs text-green-600 dark:text-green-400">
                      ✓ Respondido em {new Date(selectedPrayer.respondedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </h3>
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Digite sua resposta aqui..."
                  rows={5}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none"
                />
              </div>

              {/* Botões */}
              <div className="flex gap-3">
                <button
                  onClick={saveResponse}
                  disabled={saving}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {saving ? 'Salvando...' : 'Salvar Resposta'}
                </button>
                <button
                  onClick={closePrayerModal}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}