import type { ReactNode } from 'react'
import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import { AdminProvider, useAdmin } from './AdminContext'
import { roleHome } from './auth'
import { Shell } from './components/Shell'
import { Gate } from './pages/Gate'
import { DaMyPlaces, DaPlaceDetail, DaTeamPlaces } from './pages/DaPages'
import {
  SafetyAllPlaces,
  SafetyPlaceDetail,
  SafetyQueue,
} from './pages/SafetyPages'
import {
  CfoDraftEditor,
  CfoDrafts,
  CfoPublishedGlance,
  CfoSponsors,
} from './pages/CfoPages'
import {
  CeoActivity,
  CeoAnalytics,
  CeoFinance,
  CeoOverview,
  CeoPlaceDetail,
  CeoPlaces,
  CeoTeam,
  CeoWaitlist,
} from './pages/CeoPages'
import type { RoleKey } from './types'
import './admin.css'

function RequireRole({
  allow,
  children,
}: {
  allow: RoleKey[]
  children: ReactNode
}) {
  const { session } = useAdmin()
  if (!session) return <Navigate to="/admin" replace />
  if (!allow.includes(session.roleKey)) {
    return <Navigate to={roleHome(session.roleKey)} replace />
  }
  return children
}

function DaPlaceRoute() {
  const { id } = useParams()
  return <DaPlaceDetail id={id!} />
}

function SafetyPlaceRoute() {
  const { id } = useParams()
  return <SafetyPlaceDetail id={id!} />
}

function CeoPlaceRoute() {
  const { id } = useParams()
  return <CeoPlaceDetail id={id!} />
}

function AdminRoutes() {
  return (
    <Routes>
      <Route index element={<Gate />} />
      <Route
        element={
          <RequireRole allow={['da1', 'da2', 'ceo', 'safety', 'cfo']}>
            <Shell />
          </RequireRole>
        }
      >
        <Route
          path="da"
          element={
            <RequireRole allow={['da1', 'da2']}>
              <DaMyPlaces />
            </RequireRole>
          }
        />
        <Route
          path="da/team"
          element={
            <RequireRole allow={['da1', 'da2']}>
              <DaTeamPlaces />
            </RequireRole>
          }
        />
        <Route
          path="da/places/:id"
          element={
            <RequireRole allow={['da1', 'da2']}>
              <DaPlaceRoute />
            </RequireRole>
          }
        />

        <Route
          path="safety"
          element={
            <RequireRole allow={['safety']}>
              <SafetyQueue />
            </RequireRole>
          }
        />
        <Route
          path="safety/places"
          element={
            <RequireRole allow={['safety']}>
              <SafetyAllPlaces />
            </RequireRole>
          }
        />
        <Route
          path="safety/places/:id"
          element={
            <RequireRole allow={['safety']}>
              <SafetyPlaceRoute />
            </RequireRole>
          }
        />

        <Route
          path="cfo"
          element={
            <RequireRole allow={['cfo']}>
              <CfoDrafts />
            </RequireRole>
          }
        />
        <Route
          path="cfo/drafts/:id"
          element={
            <RequireRole allow={['cfo']}>
              <CfoDraftEditor />
            </RequireRole>
          }
        />
        <Route
          path="cfo/published"
          element={
            <RequireRole allow={['cfo']}>
              <CfoPublishedGlance />
            </RequireRole>
          }
        />
        <Route
          path="cfo/sponsors"
          element={
            <RequireRole allow={['cfo']}>
              <CfoSponsors />
            </RequireRole>
          }
        />

        <Route
          path="ceo"
          element={
            <RequireRole allow={['ceo']}>
              <CeoOverview />
            </RequireRole>
          }
        />
        <Route
          path="ceo/places"
          element={
            <RequireRole allow={['ceo']}>
              <CeoPlaces />
            </RequireRole>
          }
        />
        <Route
          path="ceo/places/:id"
          element={
            <RequireRole allow={['ceo']}>
              <CeoPlaceRoute />
            </RequireRole>
          }
        />
        <Route
          path="ceo/finance"
          element={
            <RequireRole allow={['ceo']}>
              <CeoFinance />
            </RequireRole>
          }
        />
        <Route
          path="ceo/team"
          element={
            <RequireRole allow={['ceo']}>
              <CeoTeam />
            </RequireRole>
          }
        />
        <Route
          path="ceo/activity"
          element={
            <RequireRole allow={['ceo']}>
              <CeoActivity />
            </RequireRole>
          }
        />
        <Route
          path="ceo/analytics"
          element={
            <RequireRole allow={['ceo']}>
              <CeoAnalytics />
            </RequireRole>
          }
        />
        <Route
          path="ceo/waitlist"
          element={
            <RequireRole allow={['ceo']}>
              <CeoWaitlist />
            </RequireRole>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  )
}

export default function AdminApp() {
  return (
    <div className="admin-root">
      <AdminProvider>
        <AdminRoutes />
      </AdminProvider>
    </div>
  )
}
