'use client'

import { CalendarDays, Trash2, Wine } from 'lucide-react'
import { shelfLabel, type Bottle } from '@/lib/bottle-data'

type BottleCardProps = {
  bottle: Bottle
  onDelete: (id: string) => void
}

const formatDate = (iso: string) => {
  const [y, m, d] = iso.split('-')
  if (!y || !m || !d) return iso
  return `${y}年${Number(m)}月${Number(d)}日`
}

export function BottleCard({ bottle, onDelete }: BottleCardProps) {
  return (
    <article className="group relative flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:border-primary/60 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-serif text-lg font-semibold text-card-foreground">
            {bottle.customerName}
            <span className="ml-1 text-sm font-normal text-muted-foreground">様</span>
          </p>
          <div className="mt-1.5 flex items-center gap-1.5 text-muted-foreground">
            <Wine aria-hidden="true" className="size-4 shrink-0 text-accent" />
            <span className="truncate text-sm">{bottle.bottleType}</span>
          </div>
        </div>

        <span className="flex shrink-0 flex-col items-center rounded-lg border border-accent/40 bg-accent/10 px-3 py-1.5 text-accent">
          <span className="text-[10px] font-medium tracking-wide text-accent/80">棚番号</span>
          <span className="font-serif text-lg font-bold leading-none">{shelfLabel(bottle)}</span>
        </span>
      </div>

      <div className="rounded-lg bg-muted/60 px-3 py-2">
        <p className="text-xs font-medium text-muted-foreground">残量メモ</p>
        <p className="mt-0.5 text-sm text-card-foreground">{bottle.remainingNote}</p>
      </div>

      <div className="flex items-center justify-between border-t border-border/70 pt-3">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <CalendarDays aria-hidden="true" className="size-3.5" />
          <span>登録日：{formatDate(bottle.registeredAt)}</span>
        </div>
        <button
          type="button"
          onClick={() => onDelete(bottle.id)}
          aria-label={`${bottle.customerName}様のボトルを削除`}
          className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-destructive/15 hover:text-destructive"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </article>
  )
}
