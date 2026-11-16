import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MarketingApp from './App'

const AdminApp = lazy(() => import('./admin/AdminApp'))

export default function RootApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MarketingApp />} />
        <Route
          path="/admin/*"
          element={
            <Suspense
              fallback={
                <div
                  style={{
                    minHeight: '100vh',
                    display: 'grid',
                    placeItems: 'center',
                    fontFamily: 'Figtree, sans-serif',
                    color: '#0c1f1a',
                  }}
                >
                  Loading admin…
                </div>
              }
            >
              <AdminApp />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
