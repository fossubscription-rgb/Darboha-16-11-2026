import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { readSession, writeSession } from './auth'
import type { Session } from './types'
import { loadStore, saveStore, type AdminStore } from './store'

type Ctx = {
  session: Session | null
  setSession: (s: Session | null) => void
  store: AdminStore
  updateStore: (next: AdminStore | ((prev: AdminStore) => AdminStore)) => void
}

const AdminCtx = createContext<Ctx | null>(null)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<Session | null>(() =>
    readSession(),
  )
  const [store, setStore] = useState<AdminStore>(() => loadStore())

  const setSession = useCallback((s: Session | null) => {
    writeSession(s)
    setSessionState(s)
  }, [])

  const updateStore = useCallback(
    (next: AdminStore | ((prev: AdminStore) => AdminStore)) => {
      setStore((prev) => {
        const value = typeof next === 'function' ? next(prev) : next
        saveStore(value)
        return value
      })
    },
    [],
  )

  const value = useMemo(
    () => ({ session, setSession, store, updateStore }),
    [session, setSession, store, updateStore],
  )

  return <AdminCtx.Provider value={value}>{children}</AdminCtx.Provider>
}

export function useAdmin() {
  const ctx = useContext(AdminCtx)
  if (!ctx) throw new Error('useAdmin outside provider')
  return ctx
}
