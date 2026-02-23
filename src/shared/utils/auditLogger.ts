import { getAmplifyClient } from '@/lib/amplifyClient'
import type { AuditAction, AuditResourceType } from '@/types'

interface LogAuditEventParams {
  userId: string
  userEmail: string
  action: AuditAction
  resourceType: AuditResourceType
  resourceId?: string
  metadata?: Record<string, string>
}

/**
 * Fire-and-forget audit event logger.
 * Never throws — errors are swallowed and logged to console only.
 */
export async function logAuditEvent(params: LogAuditEventParams): Promise<void> {
  try {
    const client = getAmplifyClient()
    await client.models.AuditLog.create({
      userId: params.userId,
      userEmail: params.userEmail,
      action: params.action,
      resourceType: params.resourceType,
      resourceId: params.resourceId,
      metadata: params.metadata ? JSON.stringify(params.metadata) : undefined,
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    console.error('[AuditLogger] Failed to write audit log:', err)
  }
}
