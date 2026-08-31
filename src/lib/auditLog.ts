import { getSupabaseAdmin, isSupabaseAdminConfigured } from './supabaseAdmin';
import type { Role } from './auth';

/**
 * Audit log writer for sensitive admin/super/kas actions.
 *
 * Logs go to the Supabase `audit_log` table (created by migration
 * `20260831_add_audit_log.sql`). Inserts are best-effort fire-and-forget:
 * the calling action MUST NOT be aborted by an audit failure — we swallow
 * errors after logging them.
 *
 * What to log:
 *   - User CRUD in /super (create / edit / soft-delete)
 *   - Admin CRUD in /admin (warta, roster, inventaris, khotbah, galeri mutations)
 *   - Kas mutations in /kas (create / update / delete transaction)
 *   - Auth events (failed login, lockout) — see lib/auth.ts
 *
 * What NOT to log here (privacy):
 *   - Read operations (SELECT)
 *   - Personal data contents (we log IDs + summary, not full bodies)
 *
 * Usage:
 *   await logAudit(req, {
 *     actor: user,
 *     action: 'warta.create',
 *     target: { table: 'announcements', id: data.id },
 *     summary: `Created announcement "${title}"`,
 *   });
 */

export type AuditAction =
  // user management
  | 'user.create'
  | 'user.update'
  | 'user.deactivate'
  | 'user.password_change'
  // admin CRUD
  | 'warta.create'
  | 'warta.update'
  | 'warta.delete'
  | 'warta.pin'
  | 'roster.create'
  | 'roster.update'
  | 'roster.delete'
  | 'inventory.update'
  | 'sermon.create'
  | 'sermon.update'
  | 'sermon.delete'
  | 'gallery.upload'
  | 'gallery.delete'
  | 'ministry_request.update'
  // kas
  | 'kas.create'
  | 'kas.update'
  | 'kas.delete'
  // auth
  | 'auth.login_success'
  | 'auth.login_failure'
  | 'auth.login_lockout'
  | 'auth.logout';

export interface AuditContext {
  /** Origin identifier — useful when the same action runs from multiple surfaces. */
  source?: 'web' | 'api' | 'cron';
  /** IP extracted from request headers (already-resolved). */
  ip?: string | null;
  /** UA header if relevant. */
  userAgent?: string | null;
}

export interface AuditEntry {
  /** The authenticated user performing the action. */
  actor: { id: string; username: string; roles: Role[] } | null;
  action: AuditAction;
  /** Free-form target descriptor — keep it small (table + id, no PII). */
  target?: { table?: string; id?: string; label?: string };
  /** Human-readable summary; safe to display in /super audit page. */
  summary: string;
  /** Arbitrary metadata (changeset, search filters, etc.). Avoid PII. */
  meta?: Record<string, unknown>;
  ctx?: AuditContext;
}

interface AuditLogRow {
  id?: string;
  actor_id: string | null;
  actor_username: string | null;
  actor_roles: string[] | null;
  action: string;
  target_table: string | null;
  target_id: string | null;
  summary: string;
  meta: Record<string, unknown> | null;
  ip: string | null;
  user_agent: string | null;
  source: string;
  created_at?: string;
}

/**
 * Write an audit log entry. Never throws — audit failure must not break the
 * underlying action. Returns true on success, false on any failure.
 */
export async function logAudit(entry: AuditEntry): Promise<boolean> {
  if (!isSupabaseAdminConfigured()) return false;
  const admin = getSupabaseAdmin();
  if (!admin) return false;

  const row: AuditLogRow = {
    actor_id: entry.actor?.id ?? null,
    actor_username: entry.actor?.username ?? null,
    actor_roles: entry.actor?.roles ?? null,
    action: entry.action,
    target_table: entry.target?.table ?? null,
    target_id: entry.target?.id ?? null,
    summary: entry.summary.slice(0, 500), // hard cap
    meta: entry.meta ?? null,
    ip: entry.ctx?.ip ?? null,
    user_agent: entry.ctx?.userAgent ? entry.ctx.userAgent.slice(0, 500) : null,
    source: entry.ctx?.source ?? 'api',
  };

  try {
    const { error } = await admin.from('audit_log').insert(row);
    if (error) {
      console.error('[auditLog] insert failed:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[auditLog] unexpected error:', err instanceof Error ? err.message : err);
    return false;
  }
}

/**
 * Extract a normalized AuditContext from a NextRequest.
 * Resolves IP from common proxy headers (Vercel sets x-forwarded-for).
 */
export function auditContextFromRequest(
  req: { headers: { get(name: string): string | null } },
  source: AuditContext['source'] = 'api',
): AuditContext {
  const fwd = req.headers.get('x-forwarded-for');
  const ip = (fwd ? fwd.split(',')[0]?.trim() : null) ?? req.headers.get('x-real-ip');
  return {
    source,
    ip,
    userAgent: req.headers.get('user-agent'),
  };
}