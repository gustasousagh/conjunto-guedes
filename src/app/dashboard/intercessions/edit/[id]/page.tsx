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
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">Editar Intercessão</h1>
          <Link
            href="/dashboard/intercessions"
            className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition text-center text-sm sm:text-base"
          >
            Voltar
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 text-white"
        >
          <div className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-xs sm:text-sm font-semibold mb-2">
                Título *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-white/50 text-sm sm:text-base"
                placeholder="Ex: Culto de Oração - Janeiro 2024"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold mb-2">
                Descrição *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={5}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-white/50 resize-none text-sm sm:text-base"
                placeholder="Descreva a intercessão realizada..."
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold mb-2">
                Data *
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white text-sm sm:text-base"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold mb-3">
                Imagens
              </label>
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="url"
                    value={imageInput}
                    onChange={(e) => setImageInput(e.target.value)}
                    placeholder="Cole a URL da imagem aqui"
                    className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-white/50 text-sm sm:text-base"
                  />
                  <button
                    type="button"
                    onClick={addImage}
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-green-500/30 hover:bg-green-500/50 rounded-lg font-semibold transition text-sm sm:text-base"
                  >
                    Adicionar
                  </button>
                </div>

                {images.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4">
                    {images.map((img, index) => (
                      <div
                        key={index}
                        className="relative group rounded-lg overflow-hidden"
                      >
                        <Image
                        unoptimized
                          src={img}
                          width={100}
                          height={100}
                          alt={`Imagem ${index + 1}`}
                          className="w-full h-40 sm:h-48 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 px-2 sm:px-3 py-1 bg-red-500 hover:bg-red-600 rounded-lg text-xs sm:text-sm font-semibold opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition"
                        >
                          Remover
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <p className="text-white/50 text-xs sm:text-sm">
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
                className="w-4 h-4 sm:w-5 sm:h-5 rounded border-white/20 bg-white/5 text-purple-600 focus:ring-2 focus:ring-purple-500"
              />
              <label htmlFor="published" className="font-semibold cursor-pointer text-sm sm:text-base">
                Publicado
              </label>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 sm:py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold rounded-lg hover:from-purple-600 hover:to-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {loading ? 'Salvando...' : 'Salvar Alterações'}
              </button>
              <Link
                href="/dashboard/intercessions"
                className="px-6 sm:px-8 py-3 sm:py-4 bg-white/10 hover:bg-white/20 rounded-lg font-semibold transition text-center text-sm sm:text-base"
              >
                Cancelar
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
