'use client'

import { useEffect, useMemo, useState } from 'react'
import { PackageOpen, PlusCircle, Wine } from 'lucide-react'
import { shelfLabel, type Bottle } from '@/lib/bottle-data'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/components/auth/auth-provider'
import { deleteBottle, fetchBottles, insertBottle, updateBottle } from '@/lib/supabase/bottles'
import { SearchBar } from './search-bar'
import { RegisterForm } from './register-form'
import { BottleCard } from './bottle-card'

export function BottleManager() {
  const { user } = useAuth()
  const [bottles, setBottles] = useState<Bottle[]>([])
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  // ログイン中ユーザーのボトル一覧をSupabaseから取得する（SELECT）
  // RLSにより自分が登録したボトルのみが返ってくる
  useEffect(() => {
    if (!user) return
    setIsLoading(true)
    fetchBottles()
      .then(setBottles)
      .catch((err) => setLoadError(err instanceof Error ? err.message : 'ボトルの取得に失敗しました'))
      .finally(() => setIsLoading(false))
  }, [user])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return bottles
    return bottles.filter((b) => {
      const haystack = [
        b.customerName,
        b.bottleType,
        shelfLabel(b),
        b.remainingNote,
      ]
        .join(' ')
        .toLowerCase()
      return haystack.includes(q)
    })
  }, [bottles, query])

  // 新規ボトルを登録する（INSERT）。誰が登録したかを記録するため user_id を一緒に渡す
  const handleAdd = async (data: Omit<Bottle, 'id' | 'registeredAt'>) => {
    if (!user) return
    const created = await insertBottle(data, user.id)
    setBottles((prev) => [created, ...prev])
  }

  // 既存ボトルの情報を更新する（UPDATE）
  const handleUpdate = async (id: string, data: Omit<Bottle, 'id' | 'registeredAt'>) => {
    const updated = await updateBottle(id, data)
    setBottles((prev) => prev.map((b) => (b.id === id ? updated : b)))
  }

  // ボトルを削除する（DELETE）。失敗した場合は画面上の一覧を元に戻す（楽観的更新のロールバック）
  const handleDelete = async (id: string) => {
    const previous = bottles
    setBottles((prev) => prev.filter((b) => b.id !== id))
    try {
      await deleteBottle(id)
    } catch {
      setBottles(previous)
    }
  }

  return (
    <Tabs defaultValue="register">
      <TabsList>
        <TabsTrigger value="register">
          <PlusCircle aria-hidden="true" className="size-4" />
          新しいボトルを登録
        </TabsTrigger>
        <TabsTrigger value="list">
          <Wine aria-hidden="true" className="size-4" />
          キープ中のボトル
          <span className="text-xs opacity-80">({bottles.length})</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="register">
        <div className="mx-auto max-w-md">
          <RegisterForm onAdd={handleAdd} />
        </div>
      </TabsContent>

      <TabsContent value="list" className="flex flex-col gap-6">
        <SearchBar value={query} onChange={setQuery} resultCount={filtered.length} />

        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-serif text-lg font-semibold text-foreground">
            <Wine aria-hidden="true" className="size-5 text-primary" />
            キープ中のボトル
          </h2>
          <span className="rounded-full border border-border bg-card px-3 py-1 text-sm text-muted-foreground">
            全 {bottles.length} 本
          </span>
        </div>

        {loadError && <p className="text-sm text-destructive">{loadError}</p>}

        {isLoading ? (
          <p className="py-16 text-center text-sm text-muted-foreground">読み込み中...</p>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((bottle) => (
              <BottleCard key={bottle.id} bottle={bottle} onUpdate={handleUpdate} onDelete={handleDelete} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
            <PackageOpen aria-hidden="true" className="size-10 text-muted-foreground/60" />
            <p className="font-medium text-foreground">該当するボトルが見つかりません</p>
            <p className="text-sm text-muted-foreground">
              検索条件を変えるか、新しいボトルを登録してください。
            </p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}
