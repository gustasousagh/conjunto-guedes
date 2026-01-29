'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

interface IntercessionPost {
  id: string
  title: string
  description: string
  date: string
  images: string[]
  published: boolean
}

export default function EditIntercessionPage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    published: false,
  })
  const [images, setImages] = useState<string[]>([])
  const [imageInput, setImageInput] = useState('')
  const [intercessionId, setIntercessionId] = useState<string>('')

  useEffect(() => {
    // Resolve params e salva o ID
    const loadParams = async () => {
      const id = typeof params.id === 'string' ? params.id : params.id?.[0]
      if (id) {
        setIntercessionId(id)
      }
    }
    loadParams()
  }, [params])

  useEffect(() => {
    if (intercessionId) {
      fetchIntercession()
    }
  }, [intercessionId])

  const fetchIntercession = async () => {
    try {
      const res = await fetch(`/api/admin/intercessions/${intercessionId}`)
      const data = await res.json()
      
      if (res.ok && data.intercession) {
        const intercession = data.intercession
        setFormData({
          title: intercession.title,
          description: intercession.description,
          date: new Date(intercession.date).toISOString().split('T')[0],
          published: intercession.published,
        })
        // Converter string JSON para array
        let imgArray: string[] = []
        if (typeof intercession.images === 'string') {
          try {
            imgArray = JSON.parse(intercession.images)
          } catch {
            imgArray = []
          }
        } else if (Array.isArray(intercession.images)) {
          imgArray = intercession.images
        }
        setImages(imgArray)
      }
    } catch (error) {
      console.error('Erro ao buscar intercessão:', error)
    } finally {
      setLoadingData(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch(`/api/admin/intercessions/${intercessionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          images: JSON.stringify(images), // Converter array para string JSON
        }),
      })

      if (res.ok) {
        router.push('/dashboard/intercessions')
      } else {
        alert('Erro ao atualizar intercessão')
      }
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao atualizar intercessão')
    } finally {
      setLoading(false)
    }
  }

  const addImage = () => {
    if (imageInput.trim()) {
      setImages([...images, imageInput.trim()])
      setImageInput('')
    }
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  if (loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
        <div className="text-center">
          <div className="animate-spin inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    )
  }

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
                <Link href="/dashboard/intercessions" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  ← Voltar
                </Link>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-xl">✏️</span>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                      Editar Intercessão
                    </h1>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Atualizar informações</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <form
            onSubmit={handleSubmit}
            className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/20"
          >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                Título *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="Ex: Culto de Oração - Janeiro 2024"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                Descrição *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={5}
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none"
                placeholder="Descreva a intercessão realizada..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                Data *
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                Imagens
              </label>
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="url"
                    value={imageInput}
                    onChange={(e) => setImageInput(e.target.value)}
                    placeholder="Cole a URL da imagem aqui"
                    className="flex-1 px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  />
                  <button
                    type="button"
                    onClick={addImage}
                    className="px-6 py-3 bg-green-500/20 hover:bg-green-500/30 text-green-700 dark:text-green-300 rounded-lg font-semibold transition"
                  >
                    Adicionar
                  </button>
                </div>

                {images.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    {images.map((img, index) => (
                      <div
                        key={index}
                        className="relative group rounded-lg overflow-hidden border-2 border-white/20"
                      >
                        <Image
                        unoptimized
                          src={img}
                          width={100}
                          height={100}
                          alt={`Imagem ${index + 1}`}
                          className="w-full h-48 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition shadow-lg"
                        >
                          Remover
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  💡 Dica: Use serviços como Imgur, ImgBB ou Cloudinary para hospedar suas imagens e cole a URL aqui
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="published"
                checked={formData.published}
                onChange={(e) =>
                  setFormData({ ...formData, published: e.target.checked })
                }
                className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="published" className="font-semibold cursor-pointer text-gray-700 dark:text-gray-300">
                Publicado
              </label>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? 'Salvando...' : 'Salvar Alterações'}
              </button>
              <Link
                href="/dashboard/intercessions"
                className="px-8 py-4 bg-white/60 dark:bg-gray-700/60 hover:bg-white/80 dark:hover:bg-gray-700/80 text-gray-700 dark:text-gray-300 rounded-lg font-semibold transition text-center"
              >
                Cancelar
              </Link>
            </div>
          </div>
        </form>
        </main>
      </div>
    </div>
  )
}
