import { Link, useNavigate } from 'react-router-dom'
import { useAdmin } from '../AdminContext'
import { useAdminLocale } from '../AdminLocale'
import { formatPlaceOwner } from '../constants'
import { StatusChip } from '../components/StatusChip'
import { PlaceEditor } from '../components/PlaceEditor'
import { blankPlace } from '../mockData'

export function DaMyPlaces() {
  const { session, store, savePlace } = useAdmin()
  const { t } = useAdminLocale()
  const navigate = useNavigate()
  if (!session) return null

  const mine = store.places.filter((p) => p.createdBy === session.memberId)

  async function create() {
    if (!session) return
    const place = blankPlace(
      session.memberId,
      formatPlaceOwner(session.displayName, session.roleKey),
    )
    place.ownerRoleKey = session.roleKey
    try {
      await savePlace(place, {
        activity: {
          action: 'place.created',
          summary: t.da.createdDraft,
        },
      })
      navigate(`/admin/da/places/${place.id}`)
    } catch (e) {
      alert(e instanceof Error ? e.message : t.common.createFailed)
    }
  }

  return (
    <div>
      <div className="admin-crumb">{t.da.crumbMine}</div>
      <div className="admin-page-head">
        <div>
          <h1>{t.da.titleMine}</h1>
          <p>{t.da.ledeMine}</p>
        </div>
        <button type="button" className="admin-btn" onClick={() => void create()}>
          {t.da.newPlace}
        </button>
      </div>
      <div className="admin-panel">
        {mine.length === 0 ? (
          <div className="admin-empty">{t.da.emptyMine}</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>{t.common.name}</th>
                <th>{t.common.whoseWork}</th>
                <th>{t.common.region}</th>
                <th>{t.common.status}</th>
                <th>{t.common.updated}</th>
              </tr>
            </thead>
            <tbody>
              {mine.map((p) => (
                <tr key={p.id}>
                  <td>
                    <Link to={`/admin/da/places/${p.id}`}>
                      {p.nameEn || t.common.untitled}
                    </Link>
                  </td>
                  <td>
                    <span className="admin-owner-pill">{p.ownerLabel}</span>
                  </td>
                  <td>{p.region || t.common.emDash}</td>
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
  const { t } = useAdminLocale()
  if (!session) return null
  const team = store.places.filter((p) => p.createdBy !== session.memberId)

  return (
    <div>
      <div className="admin-crumb">{t.da.crumbTeam}</div>
      <div className="admin-page-head">
        <div>
          <h1>{t.da.titleTeam}</h1>
          <p>{t.da.ledeTeam}</p>
        </div>
      </div>
      <div className="admin-panel">
        {team.length === 0 ? (
          <div className="admin-empty">{t.da.emptyTeam}</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>{t.common.name}</th>
                <th>{t.common.whoseWork}</th>
                <th>{t.common.status}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {team.map((p) => (
                <tr key={p.id}>
                  <td>
                    <Link to={`/admin/da/places/${p.id}`}>
                      {p.nameEn || t.common.untitled}
                    </Link>
                  </td>
                  <td>
                    <span className="admin-owner-pill">{p.ownerLabel}</span>
                  </td>
                  <td>
                    <StatusChip status={p.status} />
                  </td>
                  <td>
                    <Link
                      className="admin-btn secondary"
                      to={`/admin/da/places/${p.id}`}
                      style={{
                        display: 'inline-block',
                        padding: '0.35rem 0.7rem',
                        fontSize: '0.82rem',
                      }}
                    >
                      {t.common.edit}
                    </Link>
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

export function DaPlaceDetail({ id }: { id: string }) {
  return <PlaceEditor placeId={id} backTo="/admin/da" />
}
