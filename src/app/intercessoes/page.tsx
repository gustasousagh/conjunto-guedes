'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface IntercessionPost {
  id: string
  title: string
  description: string
  date: string
  images: string[]
}

export default function IntercessoesPage() {
  const [posts, setPosts] = useState<IntercessionPost[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPost, setSelectedPost] = useState<IntercessionPost | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/intercessions')
      if (response.ok) {
        const data = await response.json()
        setPosts(data.posts)
      }
    } catch (error) {
      console.error('Erro ao buscar intercessões:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  const openModal = (post: IntercessionPost) => {
    setSelectedPost(post)
    setCurrentImageIndex(0)
  }

  const closeModal = () => {
    setSelectedPost(null)
    setCurrentImageIndex(0)
  }

  const nextImage = () => {
    if (selectedPost) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedPost.images.length)
    }
  }

  const prevImage = () => {
    if (selectedPost) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedPost.images.length - 1 : prev - 1
      )
    }
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
              <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-xl">✝️</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
                    Conjunto Guedes
                  </h1>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Muro das Orações</p>
                </div>
              </Link>
              
              <Link 
                href="/"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/50 hover:bg-white/80 dark:bg-gray-800/50 dark:hover:bg-gray-800/80 transition-all shadow-md text-xs font-medium text-gray-700 dark:text-gray-200"
              >
                <span>🙏</span>
                <span>Fazer Pedido</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Intro Section */}
          <div className="text-center mb-10 space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full shadow-xl mb-2">
              <span className="text-3xl">🕊️</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              Momentos de Intercessão
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Registros dos nossos encontros de oração, onde nos reunimos para interceder e buscar a presença de Deus.
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-20">
              <div className="animate-spin inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando momentos de oração...</p>
            </div>
          )}

          {/* Posts Grid */}
          {!loading && posts.length === 0 && (
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-12 text-center border border-white/20">
              <span className="text-6xl mb-4 block">📖</span>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Nenhuma intercessão registrada ainda.
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                Em breve teremos registros dos nossos encontros de oração.
              </p>
            </div>
          )}

          {!loading && posts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => openModal(post)}
                  className="group cursor-pointer bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl overflow-hidden shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
                >
                  {/* Imagem Principal */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={post.images[0]}
                      alt={post.title}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    
                    {/* Badge de múltiplas fotos */}
                    {post.images.length > 1 && (
                      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <span>📸</span>
                        {post.images.length}
                      </div>
                    )}
                    
                    {/* Data */}
                    <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-900 dark:text-white">
                      {formatDate(post.date)}
                    </div>
                  </div>

                  {/* Conteúdo */}
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                      {post.description}
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm font-medium">
                      <span>Ver mais</span>
                      <span>→</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Modal de Detalhes */}
        {selectedPost && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <div
              className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Carrossel de Imagens */}
              <div className="relative h-[400px]">
                <Image
                  src={selectedPost.images[currentImageIndex]}
                  alt={selectedPost.title}
                  fill
                  unoptimized
                  className="object-cover"
                />
                
                {/* Navegação do Carrossel */}
                {selectedPost.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all"
                    >
                      ←
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all"
                    >
                      →
                    </button>
                    
                    {/* Indicadores */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {selectedPost.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === currentImageIndex
                              ? 'bg-white w-6'
                              : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
                
                {/* Botão Fechar */}
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
                >
                  ✕
                </button>
              </div>

              {/* Conteúdo do Modal */}
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">🕊️</span>
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                    {formatDate(selectedPost.date)}
                  </span>
                </div>
                
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {selectedPost.title}
                </h2>
                
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {selectedPost.description}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="border-t border-white/20 backdrop-blur-sm bg-white/20 dark:bg-gray-900/20 mt-12">
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
