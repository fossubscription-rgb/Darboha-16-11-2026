import { Link } from 'react-router-dom'
import { useAdmin } from '../AdminContext'
import { StatusChip } from '../components/StatusChip'
import { PlaceEditor } from '../components/PlaceEditor'

export function SafetyQueue() {
  const { store } = useAdmin()
  const queue = store.places.filter((p) =>
    ['awaiting_safety', 'needs_changes', 'rejected'].includes(p.status),
  )

  return (
    <div>
      <div className="admin-crumb">Safety / Queue</div>
      <div className="admin-page-head">
        <div>
          <h1>Safety queue</h1>
          <p>Places waiting for review. Open read-only; edit Safety tab only.</p>
        </div>
      </div>
      <div className="admin-panel">
        {queue.length === 0 ? (
          <div className="admin-empty">Queue clear — nice work.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Owner</th>
                <th>Status</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {queue.map((p) => (
                <tr key={p.id}>
                  <td>
                    <Link to={`/admin/safety/places/${p.id}`}>{p.nameEn}</Link>
                  </td>
                  <td>{p.ownerLabel}</td>
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
  return (
    <div>
      <div className="admin-crumb">Safety / All places</div>
      <div className="admin-page-head">
        <div>
          <h1>All places</h1>
          <p>Glance list — open any place for Safety review.</p>
        </div>
      </div>
      <div className="admin-panel">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Owner</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {store.places.map((p) => (
              <tr key={p.id}>
                <td>
                  <Link to={`/admin/safety/places/${p.id}`}>{p.nameEn}</Link>
                </td>
                <td>{p.ownerLabel}</td>
                <td>
                  <StatusChip status={p.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function SafetyPlaceDetail({ id }: { id: string }) {
  return <PlaceEditor placeId={id} backTo="/admin/safety" />
}
