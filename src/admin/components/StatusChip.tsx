import type { FinanceStatus, PlaceStatus } from '../types'

const LABELS: Record<PlaceStatus | FinanceStatus, string> = {
  draft: 'Draft',
  awaiting_safety: 'Awaiting safety',
  ready: 'Ready',
  published: 'Published',
  rejected: 'Rejected',
  needs_changes: 'Needs changes',
  pending_approval: 'Pending approval',
  approved: 'Approved',
}

export function StatusChip({
  status,
}: {
  status: PlaceStatus | FinanceStatus
}) {
  return <span className={`admin-chip ${status}`}>{LABELS[status]}</span>
}
