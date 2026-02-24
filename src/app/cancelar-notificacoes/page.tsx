'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function CancelarNotificacoesContent() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'already'>('loading')
  const [email, setEmail] = useState('')
  const [showReasonForm, setShowReasonForm] = useState(false)
  const [reason, setReason] = useState('')

  useEffect(() => {
    const emailParam = searchParams.get('email')
    const hashParam = searchParams.get('hash')

    if (!emailParam || !hashParam) {
      setStatus('error')
      return
    }

    setEmail(emailParam)
    checkStatus(emailParam, hashParam)
  }, [searchParams])

  const checkStatus = async (email: string, hash: string) => {
    try {
      const res = await fetch(`/api/unsubscribe?email=${encodeURIComponent(email)}&hash=${hash}`)
      const data = await res.json()

      if (data.alreadyUnsubscribed) {
        setStatus('already')
      } else {
        setShowReasonForm(true)
        setStatus('loading')
      }
    } catch (error) {
      setStatus('error')
    }
  }

  const handleUnsubscribe = async () => {
    const emailParam = searchParams.get('email')
    const hashParam = searchParams.get('hash')

    if (!emailParam || !hashParam) {
      setStatus('error')
      return
    }

    setStatus('loading')

    try {
      const res = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailParam,
          hash: hashParam,
          reason: reason || null,
        }),
      })

      const data = await res.json()

      if (data.success) {
        setStatus('success')
        setShowReasonForm(false)
      } else {
        setStatus('error')
      }
    } catch (error) {
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-pink-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-center">
          <div className="text-6xl mb-4">📧</div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Cancelar Notificações
          </h1>
          <p className="text-purple-100">
            Gerenciar suas preferências de email
          </p>
        </div>

        {/* Content */}
        <div className="p-8">
          {status === 'loading' && !showReasonForm && (
            <div className="text-center py-12">
              <div className="animate-spin inline-block w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Processando...</p>
            </div>
          )}

          {showReasonForm && (
            <div className="space-y-6">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Tem certeza que deseja cancelar?
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Você não receberá mais notificações quando respondermos seus pedidos de oração.
                    </p>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email: <span className="text-purple-600 dark:text-purple-400">{email}</span>
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Por que deseja cancelar? (opcional)
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Sua opinião nos ajuda a melhorar..."
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white placeholder-gray-400 resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleUnsubscribe}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors shadow-lg"
                >
                  Sim, cancelar notificações
                </button>
                <Link
                  href="/"
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-center"
                >
                  Voltar
                </Link>
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center py-12">
              <div className="text-6xl mb-6">✅</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Cancelamento confirmado!
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Você não receberá mais notificações por email do Conjunto Guedes.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mb-8">
                Você ainda pode fazer novos pedidos de oração a qualquer momento.
              </p>
              <Link
                href="/"
                className="inline-block px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
              >
                Ir para página inicial
              </Link>
            </div>
          )}

          {status === 'already' && (
            <div className="text-center py-12">
              <div className="text-6xl mb-6">ℹ️</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Já cancelado anteriormente
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Este email já estava na lista de cancelamento.<br/>
                Você não receberá notificações.
              </p>
              <Link
                href="/"
                className="inline-block px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
              >
                Ir para página inicial
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center py-12">
              <div className="text-6xl mb-6">❌</div>
              <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
                Erro ao processar
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Não foi possível processar sua solicitação.<br/>
                O link pode estar inválido ou expirado.
              </p>
              <Link
                href="/"
                className="inline-block px-8 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors shadow-lg"
              >
                Ir para página inicial
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function CancelarNotificacoesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-pink-900 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-center">
              <div className="text-6xl mb-4">📧</div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Cancelar Notificações
              </h1>
              <p className="text-purple-100">
                Gerenciar suas preferências de email
              </p>
            </div>
            <div className="p-8">
              <div className="text-center py-12">
                <div className="animate-spin inline-block w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <CancelarNotificacoesContent />
    </Suspense>
  )
}
