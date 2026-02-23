import { useQuery } from '@tanstack/react-query'
import { useMutation } from '@tanstack/react-query'
import { getAmplifyClient } from '@/lib/amplifyClient'
import { logAuditEvent } from '@/shared/utils/auditLogger'
import type { AuditLog, AuditAction, AuditResourceType } from '@/types'

const AUDIT_LOG_KEY = ['auditLogs'] as const

interface AmplifyAuditLogItem {
  id?: string | null
  organizationId?: string | null
  userId?: string | null
  userEmail?: string | null
  action?: string | null
  resourceType?: string | null
  resourceId?: string | null
  metadata?: string | number | boolean | object | null
  timestamp?: string | null
}

function parseMetadata(value: unknown): Record<string, string> | undefined {
  if (!value) return undefined
  let parsed = value
  while (typeof parsed === 'string') {
    try {
      parsed = JSON.parse(parsed)
    } catch {
      return undefined
    }
  }
  if (parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed)) {
    return parsed as Record<string, string>
  }
  return undefined
}

function mapAuditLog(item: AmplifyAuditLogItem): AuditLog {
  return {
    id: item.id as string,
    organizationId: item.organizationId ?? undefined,
    userId: item.userId as string,
    userEmail: item.userEmail as string,
    action: item.action as AuditAction,
    resourceType: item.resourceType as AuditResourceType,
    resourceId: item.resourceId ?? undefined,
    metadata: parseMetadata(item.metadata),
    timestamp: item.timestamp as string,
  }
}

interface AuditLogFilters {
  action?: AuditAction
  userId?: string
}

/** Query audit logs with optional filters. Returns latest 100 entries sorted by timestamp desc. */
export function useAuditLogList(filters?: AuditLogFilters) {
  return useQuery({
    queryKey: [...AUDIT_LOG_KEY, filters],
    queryFn: async () => {
      const client = getAmplifyClient()

      if (filters?.action) {
        const { data, errors } =
          await client.models.AuditLog.listAuditLogByActionAndTimestamp(
            { action: filters.action },
            { sortDirection: 'DESC', limit: 100 },
          )
        if (errors) throw new Error(errors[0].message)
        return data.map((item) => mapAuditLog(item as AmplifyAuditLogItem))
      }

      if (filters?.userId) {
        const { data, errors } =
          await client.models.AuditLog.listAuditLogByUserIdAndTimestamp(
            { userId: filters.userId },
            { sortDirection: 'DESC', limit: 100 },
          )
        if (errors) throw new Error(errors[0].message)
        return data.map((item) => mapAuditLog(item as AmplifyAuditLogItem))
      }

      const { data, errors } = await client.models.AuditLog.list({
        limit: 100,
      })
      if (errors) throw new Error(errors[0].message)
      const sorted = [...data].sort((a, b) => {
        const ta = (a as AmplifyAuditLogItem).timestamp ?? ''
        const tb = (b as AmplifyAuditLogItem).timestamp ?? ''
        return tb.localeCompare(ta)
      })
      return sorted.map((item) => mapAuditLog(item as AmplifyAuditLogItem))
    },
  })
}

interface LogActionInput {
  userId: string
  userEmail: string
  action: AuditAction
  resourceType: AuditResourceType
  resourceId?: string
  metadata?: Record<string, string>
}

/**
 * Fire-and-forget mutation hook to create an AuditLog entry.
 * Errors are swallowed — audit logging never blocks UI operations.
 */
export function useLogAction() {
  return useMutation({
    mutationFn: async (input: LogActionInput) => {
      await logAuditEvent(input)
    },
    onError: (err) => {
      console.error('[useLogAction] Audit log mutation failed:', err)
    },
  })
}
