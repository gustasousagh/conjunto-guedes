'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface QRCodeGroup {
  id: string
  name: string
  slug: string
  description: string | null
  color: string
  active: boolean
  createdAt: string
  _count: {
    prayers: number
  }
}

export default function QRCodeGroupsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [groups, setGroups] = useState<QRCodeGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingGroup, setEditingGroup] = useState<QRCodeGroup | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#6366f1'
  })
  const [saving, setSaving] = useState(false)

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

  const fetchGroups = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/qrcode-groups')
      const data = await res.json()
      setGroups(data.groups || [])
    } catch (error) {
      console.error('Erro ao buscar grupos:', error)
    } finally {
      setLoading(false)
    }
  }

  const openModal = (group?: QRCodeGroup) => {
    if (group) {
      setEditingGroup(group)
      setFormData({
        name: group.name,
        description: group.description || '',
        color: group.color
      })
    } else {
      setEditingGroup(null)
      setFormData({
        name: '',
        description: '',
        color: '#6366f1'
      })
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingGroup(null)
    setFormData({ name: '', description: '', color: '#6366f1' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const url = editingGroup
        ? `/api/admin/qrcode-groups/${editingGroup.id}`
        : '/api/admin/qrcode-groups'
      
      const method = editingGroup ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (res.ok) {
        await fetchGroups()
        closeModal()
      } else {
        alert(data.error || 'Erro ao salvar grupo')
      }
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao salvar grupo')
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = async (group: QRCodeGroup) => {
    try {
      const res = await fetch(`/api/admin/qrcode-groups/${group.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !group.active })
      })

      if (res.ok) {
        await fetchGroups()
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
    }
  }

  const deleteGroup = async (group: QRCodeGroup) => {
    if (!confirm(`Tem certeza que deseja deletar o grupo "${group.name}"?`)) {
      return
    }

    try {
      const res = await fetch(`/api/admin/qrcode-groups/${group.id}`, {
        method: 'DELETE'
      })

      const data = await res.json()

      if (res.ok) {
        await fetchGroups()
      } else {
        alert(data.error || 'Erro ao deletar grupo')
      }
    } catch (error) {
      console.error('Erro ao deletar grupo:', error)
      alert('Erro ao deletar grupo')
    }
  }

  const copyQRCodeURL = (group: QRCodeGroup) => {
    const url = `${window.location.origin}?from=${group.slug}`
    navigator.clipboard.writeText(url)
    alert('URL copiada! Use esta URL para gerar o QR Code')
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
      <div className="fixed inset-0 bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900" />
      
      <div className="fixed inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000" />
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
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-xl">📱</span>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                      Grupos de QR Codes
                    </h1>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Gerencie as origens dos pedidos
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => openModal()}
                className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-700 hover:to-blue-700 transition shadow-lg flex items-center gap-2"
              >
                <span>➕</span>
                Novo Grupo
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Grupos */}
          {groups.length === 0 ? (
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-12 text-center border border-white/20">
              <span className="text-6xl mb-4 block">📱</span>
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-4">
                Nenhum grupo criado ainda
              </p>
              <button
                onClick={() => openModal()}
                className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-700 hover:to-blue-700 transition shadow-lg"
              >
                Criar Primeiro Grupo
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groups.map((group) => (
                <div
                  key={group.id}
                  className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all"
                >
                  {/* Header com cor */}
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center shadow-md flex-shrink-0"
                      style={{ backgroundColor: group.color }}
                    >
                      <span className="text-2xl">📱</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                        {group.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                        ?from={group.slug}
                      </p>
                    </div>
                  </div>

                  {/* Descrição */}
                  {group.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      {group.description}
                    </p>
                  )}

                  {/* Estatísticas */}
                  <div className="flex items-center gap-2 mb-4 text-sm">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium">
                      🙏 {group._count.prayers} orações
                    </span>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-medium ${
                      group.active
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}>
                      {group.active ? '✓ Ativo' : '○ Inativo'}
                    </span>
                  </div>

                  {/* Ações */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyQRCodeURL(group)}
                      className="flex-1 px-3 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-sm font-semibold rounded-lg hover:from-cyan-700 hover:to-blue-700 transition"
                      title="Copiar URL para QR Code"
                    >
                      📋 Copiar URL
                    </button>
                    <button
                      onClick={() => openModal(group)}
                      className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => toggleActive(group)}
                      className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                      title={group.active ? 'Desativar' : 'Ativar'}
                    >
                      {group.active ? '⏸️' : '▶️'}
                    </button>
                    <button
                      onClick={() => deleteGroup(group)}
                      className="px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm font-semibold rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition"
                      title="Deletar"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Modal Criar/Editar */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {editingGroup ? 'Editar Grupo' : 'Novo Grupo'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Nome do Grupo *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Igreja Central"
                    required
                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Descrição
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Ex: QR Codes distribuídos na igreja"
                    rows={3}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Cor de Identificação
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-20 h-12 rounded-lg cursor-pointer border-2 border-gray-300 dark:border-gray-600"
                    />
                    <input
                      type="text"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      placeholder="#6366f1"
                      className="flex-1 px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-700 hover:to-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {saving ? 'Salvando...' : editingGroup ? 'Salvar Alterações' : 'Criar Grupo'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
