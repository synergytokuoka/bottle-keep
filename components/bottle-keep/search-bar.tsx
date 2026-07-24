'use client'

import { Search, X } from 'lucide-react'

type SearchBarProps = {
  value: string
  onChange: (value: string) => void
  resultCount: number
}

export function SearchBar({ value, onChange, resultCount }: SearchBarProps) {
  return (
    <div className="w-full">
      <label htmlFor="bottle-search" className="sr-only">
        お客様名・ボトル名・棚番号で検索
      </label>
      <div className="relative">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
        />
        <input
          id="bottle-search"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="お客様名 ・ ボトル名 ・ 棚番号（例：A-1）で検索"
          className="h-14 w-full rounded-xl border border-border bg-card pl-12 pr-12 text-base text-card-foreground placeholder:text-muted-foreground/70 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            aria-label="検索をクリア"
            className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        )}
      </div>
      {value && (
        <p className="mt-2 pl-1 text-sm text-muted-foreground">
          {resultCount}件のボトルが見つかりました
        </p>
      )}
    </div>
  )
}
