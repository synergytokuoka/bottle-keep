'use client'

import { useState } from 'react'
import { CheckCircle2, PlusCircle } from 'lucide-react'
import { SHELF_COLS, SHELF_ROWS, type Bottle } from '@/lib/bottle-data'

type RegisterFormProps = {
  onAdd: (bottle: Omit<Bottle, 'id' | 'registeredAt'>) => void
}

const fieldClass =
  'h-12 w-full rounded-lg border border-border bg-background px-3 text-base text-foreground placeholder:text-muted-foreground/60 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40'

export function RegisterForm({ onAdd }: RegisterFormProps) {
  const [customerName, setCustomerName] = useState('')
  const [bottleType, setBottleType] = useState('')
  const [shelfRow, setShelfRow] = useState<string>('A')
  const [shelfCol, setShelfCol] = useState<string>('1')
  const [remainingNote, setRemainingNote] = useState('')
  const [done, setDone] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!customerName.trim() || !bottleType.trim()) return

    onAdd({
      customerName: customerName.trim(),
      bottleType: bottleType.trim(),
      shelfRow,
      shelfCol,
      remainingNote: remainingNote.trim() || '満タン',
    })

    setCustomerName('')
    setBottleType('')
    setShelfRow('A')
    setShelfCol('1')
    setRemainingNote('')
    setDone(true)
    setTimeout(() => setDone(false), 2500)
  }

  return (
    <section
      aria-labelledby="register-heading"
      className="rounded-2xl border border-border bg-card p-6 shadow-sm"
    >
      <div className="mb-5 flex items-center gap-2">
        <PlusCircle aria-hidden="true" className="size-5 text-accent" />
        <h2 id="register-heading" className="font-serif text-lg font-semibold text-card-foreground">
          新しいボトルを登録
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="customerName" className="text-sm font-medium text-muted-foreground">
            お客様の名前
          </label>
          <input
            id="customerName"
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="例：山田 太郎"
            required
            className={fieldClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="bottleType" className="text-sm font-medium text-muted-foreground">
            ボトルの種類
          </label>
          <input
            id="bottleType"
            type="text"
            value={bottleType}
            onChange={(e) => setBottleType(e.target.value)}
            placeholder="例：森伊蔵 720ml"
            required
            className={fieldClass}
          />
        </div>

        <fieldset className="flex flex-col gap-1.5">
          <legend className="mb-1.5 text-sm font-medium text-muted-foreground">棚の番号</legend>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label htmlFor="shelfRow" className="sr-only">
                棚の段（A〜D）
              </label>
              <select
                id="shelfRow"
                value={shelfRow}
                onChange={(e) => setShelfRow(e.target.value)}
                className={fieldClass}
              >
                {SHELF_ROWS.map((row) => (
                  <option key={row} value={row}>
                    {row}段
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="shelfCol" className="sr-only">
                棚の列（1〜5）
              </label>
              <select
                id="shelfCol"
                value={shelfCol}
                onChange={(e) => setShelfCol(e.target.value)}
                className={fieldClass}
              >
                {SHELF_COLS.map((col) => (
                  <option key={col} value={col}>
                    {col}番
                  </option>
                ))}
              </select>
            </div>
          </div>
          <p className="mt-1 text-xs text-muted-foreground/80">
            選択中の棚：
            <span className="ml-1 font-semibold text-accent">
              {shelfRow}-{shelfCol}
            </span>
          </p>
        </fieldset>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="remainingNote" className="text-sm font-medium text-muted-foreground">
            残量メモ（任意）
          </label>
          <input
            id="remainingNote"
            type="text"
            value={remainingNote}
            onChange={(e) => setRemainingNote(e.target.value)}
            placeholder="例：残り 7割 / ほぼ満タン"
            className={fieldClass}
          />
        </div>

        <button
          type="submit"
          className="mt-2 flex h-12 items-center justify-center gap-2 rounded-lg bg-primary font-medium text-primary-foreground transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary/50 active:scale-[0.99]"
        >
          {done ? (
            <>
              <CheckCircle2 className="size-5" />
              登録しました
            </>
          ) : (
            <>
              <PlusCircle className="size-5" />
              ボトルを登録する
            </>
          )}
        </button>
      </form>
    </section>
  )
}
