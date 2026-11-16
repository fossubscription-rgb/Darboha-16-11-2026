import { Link, useNavigate } from 'react-router-dom'
import { useAdmin } from '../AdminContext'
import { StatusChip } from '../components/StatusChip'
import { PlaceEditor } from '../components/PlaceEditor'
import { blankPlace } from '../mockData'
import { pushActivity, upsertPlace } from '../store'

export function DaMyPlaces() {
  const { session, store, updateStore } = useAdmin()
  const navigate = useNavigate()
  if (!session) return null

  const mine = store.places.filter((p) => p.createdBy === session.memberId)

  function create() {
    if (!session) return
    const actor = session
    const place = blankPlace(actor.memberId, actor.displayName)
    updateStore(
      pushActivity(
        upsertPlace(store, place),
        actor.displayName,
        'place.created',
        'Created a new draft place',
      ),
    )
    navigate(`/admin/da/places/${place.id}`)
  }

  return (
    <div>
      <div className="admin-crumb">Data Analyst / My places</div>
      <div className="admin-page-head">
        <div>
          <h1>My places</h1>
          <p>Create and edit your own places. Tabs: Basics · Access · Photos.</p>
        </div>
        <button type="button" className="admin-btn" onClick={create}>
          New place
        </button>
      </div>
      <div className="admin-panel">
        {mine.length === 0 ? (
          <div className="admin-empty">No places yet — create your first draft.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Region</th>
                <th>Status</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {mine.map((p) => (
                <tr key={p.id}>
                  <td>
                    <Link to={`/admin/da/places/${p.id}`}>
                      {p.nameEn || 'Untitled'}
                    </Link>
                  </td>
                  <td>{p.region || '—'}</td>
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

export function DaTeamPlaces() {
  const { session, store } = useAdmin()
  if (!session) return null
  const team = store.places.filter((p) => p.createdBy !== session.memberId)

  return (
    <div>
      <div className="admin-crumb">Data Analyst / Team places</div>
      <div className="admin-page-head">
        <div>
          <h1>Team places</h1>
          <p>Teammates’ places — view only.</p>
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
            {team.map((p) => (
              <tr key={p.id}>
                <td>
                  <Link to={`/admin/da/places/${p.id}`}>
                    {p.nameEn || 'Untitled'}
                  </Link>
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

export function DaPlaceDetail({ id }: { id: string }) {
  return <PlaceEditor placeId={id} backTo="/admin/da" />
}
