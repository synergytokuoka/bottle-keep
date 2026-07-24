'use client'

import { useEffect, useMemo, useState } from 'react'
import { PackageOpen, PlusCircle, Wine } from 'lucide-react'
import { INITIAL_BOTTLES, shelfLabel, type Bottle } from '@/lib/bottle-data'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SearchBar } from './search-bar'
import { RegisterForm } from './register-form'
import { BottleCard } from './bottle-card'

const STORAGE_KEY = 'bottle-keep:bottles'

const today = () => {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

export function BottleManager() {
  const [bottles, setBottles] = useState<Bottle[]>(INITIAL_BOTTLES)
  const [query, setQuery] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)

  // 初回マウント時に保存済みデータを読み込む(SSRとのハイドレーション不整合を避けるため useEffect で実行)
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setBottles(JSON.parse(stored))
      }
    } catch {
      // 破損データは無視して初期値のまま
    }
    setIsLoaded(true)
  }, [])

  // 読み込み完了後、変更のたびに保存する(読み込み前に初期値で上書きしないよう isLoaded を待つ)
  useEffect(() => {
    if (!isLoaded) return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bottles))
  }, [bottles, isLoaded])

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

  const handleAdd = (data: Omit<Bottle, 'id' | 'registeredAt'>) => {
    setBottles((prev) => [
      { ...data, id: crypto.randomUUID(), registeredAt: today() },
      ...prev,
    ])
  }

  const handleDelete = (id: string) => {
    setBottles((prev) => prev.filter((b) => b.id !== id))
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

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((bottle) => (
              <BottleCard key={bottle.id} bottle={bottle} onDelete={handleDelete} />
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
