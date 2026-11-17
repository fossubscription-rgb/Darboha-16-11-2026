import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  deletePlaceApi,
  fetchAdminBundle,
  logActivityApi,
  logoutApi,
  setMemberPasswordApi,
  updateMemberMetaApi,
  upsertFinanceApi,
  upsertPlaceApi,
  upsertPlaceSafetyApi,
  type WaitlistRow,
} from './api'
import { readSession, writeSession } from './auth'
import { setAdminToken } from '../lib/supabase'
import type {
  FinanceDraft,
  FinanceStatus,
  Member,
  Place,
  Session,
} from './types'
import {
  daCanSubmit,
  safetyComplete,
  type AdminStore,
} from './store'

type Ctx = {
  session: Session | null
  setSession: (s: Session | null) => void
  store: AdminStore
  waitlist: WaitlistRow[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  savePlace: (
    place: Place,
    opts?: { withSafety?: boolean; activity?: { action: string; summary: string } },
  ) => Promise<void>
  removePlace: (
    id: string,
    activity?: { action: string; summary: string },
  ) => Promise<void>
  saveFinance: (
    draft: FinanceDraft,
    activity?: { action: string; summary: string },
  ) => Promise<void>
  setFinanceStatusRemote: (
    id: string,
    status: FinanceStatus,
    activity?: { action: string; summary: string },
  ) => Promise<void>
  saveMemberMeta: (id: string, patch: Partial<Member>) => Promise<void>
  saveMemberPassword: (id: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const emptyStore = (): AdminStore => ({
  members: [],
  places: [],
  finance: [],
  activity: [],
})

const AdminCtx = createContext<Ctx | null>(null)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<Session | null>(() =>
    readSession(),
  )
  const [store, setStore] = useState<AdminStore>(emptyStore)
  const [waitlist, setWaitlist] = useState<WaitlistRow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const setSession = useCallback((s: Session | null) => {
    writeSession(s)
    setAdminToken(s?.token ?? null)
    setSessionState(s)
    if (!s) {
      setStore(emptyStore())
      setWaitlist([])
    }
  }, [])

  const refresh = useCallback(async () => {
    if (!session) {
      setStore(emptyStore())
      setWaitlist([])
      return
    }
    setLoading(true)
    setError(null)
    try {
      const bundle = await fetchAdminBundle(session.roleKey)
      setStore({
        members: bundle.members,
        places: bundle.places,
        finance: bundle.finance,
        activity: bundle.activity,
      })
      setWaitlist(bundle.waitlist)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to load admin data'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [session])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const savePlace = useCallback(
    async (
      place: Place,
      opts?: {
        withSafety?: boolean
        activity?: { action: string; summary: string }
      },
    ) => {
      await upsertPlaceApi(place)
      if (opts?.withSafety) {
        await upsertPlaceSafetyApi(place, session!.memberId)
      }
      if (opts?.activity) {
        await logActivityApi(opts.activity.action, opts.activity.summary)
      }
      await refresh()
    },
    [refresh, session],
  )

  const removePlace = useCallback(
    async (
      id: string,
      activity?: { action: string; summary: string },
    ) => {
      await deletePlaceApi(id)
      if (activity) await logActivityApi(activity.action, activity.summary)
      await refresh()
    },
    [refresh],
  )

  const saveFinance = useCallback(
    async (
      draft: FinanceDraft,
      activity?: { action: string; summary: string },
    ) => {
      await upsertFinanceApi(draft)
      if (activity) await logActivityApi(activity.action, activity.summary)
      await refresh()
    },
    [refresh],
  )

  const setFinanceStatusRemote = useCallback(
    async (
      id: string,
      status: FinanceStatus,
      activity?: { action: string; summary: string },
    ) => {
      const existing = store.finance.find((f) => f.id === id)
      if (!existing) throw new Error('Draft not found')
      await upsertFinanceApi({
        ...existing,
        status,
        updatedAt: new Date().toISOString(),
      })
      if (activity) await logActivityApi(activity.action, activity.summary)
      await refresh()
    },
    [refresh, store.finance],
  )

  const saveMemberMeta = useCallback(
    async (id: string, patch: Partial<Member>) => {
      await updateMemberMetaApi(id, {
        jobTitle: patch.jobTitle,
        isActive: patch.isActive,
        displayName: patch.displayName,
      })
      await refresh()
    },
    [refresh],
  )

  const saveMemberPassword = useCallback(
    async (id: string, password: string) => {
      await setMemberPasswordApi(id, password)
      await refresh()
    },
    [refresh],
  )

  const logout = useCallback(async () => {
    await logoutApi()
    setSession(null)
  }, [setSession])

  const value = useMemo(
    () => ({
      session,
      setSession,
      store,
      waitlist,
      loading,
      error,
      refresh,
      savePlace,
      removePlace,
      saveFinance,
      setFinanceStatusRemote,
      saveMemberMeta,
      saveMemberPassword,
      logout,
    }),
    [
      session,
      setSession,
      store,
      waitlist,
      loading,
      error,
      refresh,
      savePlace,
      removePlace,
      saveFinance,
      setFinanceStatusRemote,
      saveMemberMeta,
      saveMemberPassword,
      logout,
    ],
  )

  return <AdminCtx.Provider value={value}>{children}</AdminCtx.Provider>
}

export function useAdmin() {
  const ctx = useContext(AdminCtx)
  if (!ctx) throw new Error('useAdmin outside provider')
  return ctx
}

export { daCanSubmit, safetyComplete }
