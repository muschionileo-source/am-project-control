'use client'

import { createContext, useContext, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

interface AuditContextType {
  logChange: (action: string, entityType: string, entityName: string, details?: string) => Promise<void>
}

const AuditContext = createContext<AuditContextType | null>(null)

export function AuditProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()

  const logChange = async (
    action: string,
    entityType: string,
    entityName: string,
    details?: string
  ) => {
    if (!user) return
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      user_name: user.name,
      action,
      entity_type: entityType,
      entity_name: entityName,
      details: details ?? '',
    })
  }

  return (
    <AuditContext.Provider value={{ logChange }}>
      {children}
    </AuditContext.Provider>
  )
}

export function useAudit() {
  const ctx = useContext(AuditContext)
  if (!ctx) throw new Error('useAudit must be used within AuditProvider')
  return ctx
}
