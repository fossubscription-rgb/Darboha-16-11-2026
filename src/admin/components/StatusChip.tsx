import type { FinanceStatus, PlaceStatus } from '../types'
import { useAdminLocale } from '../AdminLocale'

export function StatusChip({
  status,
}: {
  status: PlaceStatus | FinanceStatus
}) {
  const { t } = useAdminLocale()
  return <span className={`admin-chip ${status}`}>{t.status[status]}</span>
}
