'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function EditVersePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [verse, setVerse] = useState({ text: '', reference: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchVerse()
    }
  }, [session])

  const fetchVerse = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/verse')
      const data = await res.json()
      setVerse(data.verse)
    } catch (error) {
      console.error('Erro ao buscar versículo:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      const res = await fetch('/api/admin/verse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(verse)
      })

      if (res.ok) {
        setMessage('✅ Versículo atualizado com sucesso!')
      } else {
        setMessage('❌ Erro ao salvar versículo')
      }
    } catch (error) {
      console.error('Erro:', error)
      setMessage('❌ Erro ao salvar versículo')
    } finally {
      setSaving(false)
    }
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
      <div className="fixed inset-0 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-gray-900 dark:via-amber-900 dark:to-orange-900" />
      
      <div className="fixed inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/20 backdrop-blur-sm bg-white/30 dark:bg-gray-900/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/dashboard" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  ← Voltar
                </Link>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-xl">📖</span>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                      Editar Versículo
                    </h1>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Aparece na página inicial
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Formulário */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Texto do Versículo */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Texto do Versículo
                </label>
                <textarea
                  value={verse.text}
                  onChange={(e) => setVerse({ ...verse, text: e.target.value })}
                  placeholder="Digite o texto do versículo..."
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900 dark:text-white resize-none"
                />
              </div>

              {/* Referência */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Referência (Ex: João 3:16)
                </label>
                <input
                  type="text"
                  value={verse.reference}
                  onChange={(e) => setVerse({ ...verse, reference: e.target.value })}
                  placeholder="Ex: Filipenses 4:6"
                  required
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900 dark:text-white"
                />
              </div>

              {/* Preview */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  📱 Preview
                </h3>
                <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl px-6 py-4 shadow-lg border border-white/20">
                  <p className="text-sm text-gray-700 dark:text-gray-200 italic mb-2">
                    "{verse.text}"
                  </p>
                  <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                    {verse.reference}
                  </p>
                </div>
              </div>

              {/* Mensagem de retorno */}
              {message && (
                <div className={`p-4 rounded-xl ${
                  message.includes('✅')
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                    : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                }`}>
                  {message}
                </div>
              )}

              {/* Botão */}
              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 bg-gradient-to-r from-amber-600 to-yellow-600 text-white font-semibold rounded-lg hover:from-amber-700 hover:to-yellow-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {saving ? 'Salvando...' : '💾 Salvar Versículo'}
              </button>
            </form>
          </div>

          {/* Dica */}
          <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-700/30">
            <div className="flex gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">
                  Dica
                </h4>
                <p className="text-xs text-blue-700 dark:text-blue-400">
                  O versículo será exibido na parte inferior da página inicial, logo após o formulário de oração.
                  Escolha um versículo que inspire e encoraje as pessoas a orar.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
