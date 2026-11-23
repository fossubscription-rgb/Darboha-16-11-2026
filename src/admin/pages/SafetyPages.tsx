import { Link } from 'react-router-dom'
import { useAdmin } from '../AdminContext'
import { useAdminLocale } from '../AdminLocale'
import { StatusChip } from '../components/StatusChip'
import { PlaceEditor } from '../components/PlaceEditor'

export function SafetyQueue() {
  const { store } = useAdmin()
  const { t } = useAdminLocale()
  const queue = store.places.filter((p) =>
    ['awaiting_safety', 'needs_changes', 'rejected'].includes(p.status),
  )

  return (
    <div>
      <div className="admin-crumb">{t.safety.crumbQueue}</div>
      <div className="admin-page-head">
        <div>
          <h1>{t.safety.titleQueue}</h1>
          <p>{t.safety.ledeQueue}</p>
        </div>
      </div>
      <div className="admin-panel">
        {queue.length === 0 ? (
          <div className="admin-empty">{t.safety.emptyQueue}</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>{t.common.name}</th>
                <th>{t.common.whoseWork}</th>
                <th>{t.common.status}</th>
                <th>{t.common.updated}</th>
              </tr>
            </thead>
            <tbody>
              {queue.map((p) => (
                <tr key={p.id}>
                  <td>
                    <Link to={`/admin/safety/places/${p.id}`}>{p.nameEn}</Link>
                  </td>
                  <td>
                    <span className="admin-owner-pill">{p.ownerLabel}</span>
                  </td>
                  <td>
                    <StatusChip status={p.status} />
                  </td>
                  <td>{new Date(p.updatedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export function SafetyAllPlaces() {
  const { store } = useAdmin()
  const { t } = useAdminLocale()
  return (
    <div>
      <div className="admin-crumb">{t.safety.crumbAll}</div>
      <div className="admin-page-head">
        <div>
          <h1>{t.safety.titleAll}</h1>
          <p>{t.safety.ledeAll}</p>
        </div>
      </div>
      <div className="admin-panel">
        {store.places.length === 0 ? (
          <div className="admin-empty">{t.safety.emptyAll}</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>{t.common.name}</th>
                <th>{t.common.whoseWork}</th>
                <th>{t.common.status}</th>
              </tr>
            </thead>
            <tbody>
              {store.places.map((p) => (
                <tr key={p.id}>
                  <td>
                    <Link to={`/admin/safety/places/${p.id}`}>
                      {p.nameEn || t.common.untitled}
                    </Link>
                  </td>
                  <td>
                    <span className="admin-owner-pill">{p.ownerLabel}</span>
                  </td>
                  <td>
                    <StatusChip status={p.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export function SafetyPlaceDetail({ id }: { id: string }) {
  return <PlaceEditor placeId={id} backTo="/admin/safety" />
}
