'use client'

import { LogOut } from 'lucide-react'
import { useAuth } from './auth-provider'

export function AccountMenu() {
  const { user, signOut } = useAuth()

  if (!user) return null

  return (
    <div className="flex items-center gap-3">
      <span className="hidden text-sm text-muted-foreground sm:inline">{user.email}</span>
      <button
        type="button"
        onClick={() => signOut()}
        className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
      >
        <LogOut aria-hidden="true" className="size-4" />
        ログアウト
      </button>
    </div>
  )
}
