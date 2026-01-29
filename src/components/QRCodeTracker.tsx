'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function QRCodeTracker() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const from = searchParams.get('from')
    
    if (from) {
      // Salvar no localStorage
      localStorage.setItem('prayer_source', from)
      
      // Opcional: registrar no console para debug
      console.log('🔍 Origem detectada:', from)
    }
  }, [searchParams])

  return null // Componente invisível
}
