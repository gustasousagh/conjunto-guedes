'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    prayer: '',
    prayerForOther: false,
    otherPersonName: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [currentSlide, setCurrentSlide] = useState(0)
  const [recentPosts, setRecentPosts] = useState<any[]>([])
  const [verse, setVerse] = useState({
    text: "Não andeis ansiosos por coisa alguma; antes em tudo sejam os vossos pedidos conhecidos diante de Deus pela oração e súplica com ações de graças.",
    reference: "Filipenses 4:6"
  })

  useEffect(() => {
    // Buscar versículo
    fetch('/api/admin/verse')
      .then(res => res.json())
      .then(data => {
        if (data.verse) {
          setVerse(data.verse)
        }
      })
      .catch(err => console.error('Erro ao buscar versículo:', err))

    // Buscar posts recentes
    fetch('/api/intercessions?limit=1')
      .then(res => res.json())
      .then(data => {
        console.log('📸 Dados da última intercessão:', data)
        if (data.posts && data.posts.length > 0) {
          console.log('✅ Intercessão encontrada:', data.posts[0])
          console.log('🖼️ Imagens:', data.posts[0].images)
          setRecentPosts(data.posts)
        } else {
          console.log('⚠️ Nenhuma intercessão encontrada')
        }
      })
      .catch(err => console.error('Erro ao buscar posts:', err))
  }, [])

  // Imagens do carrossel - usa TODAS as fotos da última intercessão
  const carouselImages = recentPosts.length > 0 && recentPosts[0] && recentPosts[0].images
    ? (() => {
        const latestPost = recentPosts[0]
        const images: any[] = []
        
        // A API já retorna images como array
        const imageArray = Array.isArray(latestPost.images) ? latestPost.images : []
        
        imageArray.forEach((img: string, index: number) => {
          if (img && typeof img === 'string' && img.trim().length > 0) {
            images.push({
              id: `${latestPost.id}-${index}`,
              url: img,
              alt: latestPost.title,
              date: new Date(latestPost.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
            })
          }
        })
        
        console.log('🎨 Imagens processadas para carrossel:', images)
        return images
      })()
    : []
  
  // Se não houver posts válidos, usa imagens de fallback
  const displayImages = carouselImages.length > 0 
    ? carouselImages 
    : [
        {
          url: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800&q=80',
          alt: 'Pessoas orando juntas',
          date: 'Em breve'
        },
        {
          url: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&q=80',
          alt: 'Mãos em oração',
          date: 'Em breve'
        },
        {
          url: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=800&q=80',
          alt: 'Comunidade em oração',
          date: 'Em breve'
        },
        {
          url: 'https://images.unsplash.com/photo-1583090318293-ebd145b2c63f?q=80&w=1435&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          alt: 'Momento de reflexão',
          date: 'Em breve'
        }
      ]

  useEffect(() => {
    if (displayImages.length === 0) return
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % displayImages.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [displayImages.length])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage('')

    try {
      // Pegar o source do localStorage
      const source = localStorage.getItem('prayer_source')
      
      const response = await fetch('/api/prayers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          source: source || null
        })
      })

      if (response.ok) {
        setMessage('Seu pedido de oração foi enviado! Deus abençoe você. 🙏')
        setFormData({ name: '', email: '', prayer: '', prayerForOther: false, otherPersonName: '' })
        
        // Limpar o source após o envio
        localStorage.removeItem('prayer_source')
      } else {
        setMessage('Erro ao enviar. Tente novamente.')
      }
    } catch (error) {
      setMessage('Erro ao enviar. Verifique sua conexão.')
    } finally {
      setIsSubmitting(false)
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
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-xl">✝️</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
                    Conjunto Quedes
                  </h1>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Muro das Orações</p>
                </div>
              </div>
              
              <Link 
                href="/minhas-oracoes"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/50 hover:bg-white/80 dark:bg-gray-800/50 dark:hover:bg-gray-800/80 transition-all shadow-md text-xs font-medium text-gray-700 dark:text-gray-200"
              >
                <span>📖</span>
                <span className="hidden sm:inline">Ver Minhas Orações</span>
                <span className="sm:hidden">Minhas Orações</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Carrossel */}
          {displayImages.length > 0 && (
            <Link href="/intercessoes" className="block mb-6 relative h-48 sm:h-56 rounded-2xl overflow-hidden shadow-2xl group cursor-pointer">
              {displayImages.map((image, index) => {
                // Safety check para garantir URL válida
                if (!image.url || typeof image.url !== 'string' || image.url.trim().length === 0) {
                  return null
                }
                return (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ${
                      index === currentSlide ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={image.alt}
                      fill
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                
                {/* Data */}
                <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-gray-900 dark:text-white">
                  📅 {image.date}
                </div>
                
                {/* Título e Badge */}
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-bold text-lg drop-shadow-lg mb-2">{image.alt}</p>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 bg-blue-600/80 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
                      🕊️ Intercessão
                    </span>
                    <span className="text-white/80 text-xs group-hover:text-white transition-colors">
                      Clique para ver mais →
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
          {/* Indicadores */}
          <div className="absolute bottom-4 right-4 flex gap-2 z-10">
            {displayImages.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault()
                  setCurrentSlide(index)
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentSlide
                    ? 'bg-white w-6'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Ir para slide ${index + 1}`}
              />
            ))}
          </div>
        </Link>
        )}

          {/* Intro Section */}
          <div className="text-center mb-8 space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full shadow-xl mb-2">
              <span className="text-3xl">🙏</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              Compartilhe seu Pedido
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
              Envie seu pedido de oração. Nosso Deus é fiel e poderoso para atender suas necessidades.
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400 bg-white/40 dark:bg-gray-800/40 rounded-full px-3 py-1.5 backdrop-blur-sm inline-flex">
              <span>🔒</span>
              <span>100% privado e confidencial</span>
            </div>
          </div>

          {/* Formulário */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8 border border-white/20">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nome (opcional) */}
              <div>
                <label htmlFor="name" className="block text-xs font-semibold text-gray-700 dark:text-gray-200 mb-1.5">
                  Seu Nome <span className="text-gray-400 font-normal">(opcional)</span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Como podemos te chamar?"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-gray-900 dark:text-white placeholder-gray-400"
                />
              </div>

              {/* Toggle: Oração para outra pessoa */}
              <div className="flex items-center justify-between p-3 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg border border-blue-200/50 dark:border-blue-700/50">
                <div className="flex items-center gap-2">
                  <span className="text-lg">👥</span>
                  <div>
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                      Oração para outra pessoa
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Você está fazendo um pedido por alguém
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ 
                    ...formData, 
                    prayerForOther: !formData.prayerForOther,
                    otherPersonName: !formData.prayerForOther ? formData.otherPersonName : ''
                  })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    formData.prayerForOther
                      ? 'bg-blue-600'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.prayerForOther ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Campo condicional: Nome da pessoa */}
              {formData.prayerForOther && (
                <div className="animate-in slide-in-from-top duration-300">
                  <label htmlFor="otherPersonName" className="block text-xs font-semibold text-gray-700 dark:text-gray-200 mb-1.5">
                    Nome da Pessoa <span className="text-blue-600 dark:text-blue-400">✨</span>
                  </label>
                  <input
                    type="text"
                    id="otherPersonName"
                    value={formData.otherPersonName}
                    onChange={(e) => setFormData({ ...formData, otherPersonName: e.target.value })}
                    placeholder="Por quem você está orando?"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-blue-200 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-900/20 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-gray-900 dark:text-white placeholder-gray-400"
                  />
                </div>
              )}

              {/* Email (opcional) */}
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-gray-700 dark:text-gray-200 mb-1.5">
                  Seu Email <span className="text-gray-400 font-normal">(opcional)</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Para você acessar suas orações depois"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-gray-900 dark:text-white placeholder-gray-400"
                />
              </div>

              {/* Pedido de Oração */}
              <div>
                <label htmlFor="prayer" className="block text-xs font-semibold text-gray-700 dark:text-gray-200 mb-1.5">
                  Seu Pedido de Oração <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="prayer"
                  required
                  value={formData.prayer}
                  onChange={(e) => setFormData({ ...formData, prayer: e.target.value })}
                  rows={5}
                  placeholder="Compartilhe seu coração com Deus... Ele está ouvindo 🕊️"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none text-gray-900 dark:text-white placeholder-gray-400"
                />
              </div>

              {/* Mensagem de retorno */}
              {message && (
                <div className={`p-4 rounded-xl ${message.includes('Erro') ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300' : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'}`}>
                  {message}
                </div>
              )}

              {/* Botão Submit */}
              <button
                type="submit"
                disabled={isSubmitting || !formData.prayer.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Enviando...
                  </>
                ) : (
                  <>
                    <span>🕊️</span>
                    Enviar Pedido de Oração
                  </>
                )}
              </button>

              {/* Nota de privacidade */}
              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                Suas orações são privadas. Apenas você pode vê-las se fornecer seu email. 
                Ninguém mais tem acesso, exceto a administração da igreja para fins de intercessão.
              </p>
            </form>
          </div>

          {/* Versículo */}
          <div className="mt-8 text-center">
            <div className="inline-block bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl px-6 py-4 shadow-lg border border-white/20">
              <p className="text-sm text-gray-700 dark:text-gray-200 italic mb-2">
                "{verse.text}"
              </p>
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                {verse.reference}
              </p>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-white/20 backdrop-blur-sm bg-white/20 dark:bg-gray-900/20 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © 2026 Conjunto Quedes. Feito com ❤️ para a glória de Deus.
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
