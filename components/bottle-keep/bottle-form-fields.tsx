'use client'

import { useRef, useState } from 'react'
import { CheckCircle2, ImagePlus, X } from 'lucide-react'
import { SHELF_COLS, SHELF_ROWS, type Bottle } from '@/lib/bottle-data'

type BottleFormValues = Omit<Bottle, 'id' | 'registeredAt'>

type BottleFormFieldsProps = {
  // 新規登録では未指定（空欄スタート）、編集では対象ボトルの現在値を渡す
  initialValues?: BottleFormValues
  // 保存処理（Supabaseへの INSERT / UPDATE）は呼び出し側が担当する
  onSubmit: (data: BottleFormValues) => Promise<void>
  // 保存に成功した後の追加処理（編集ダイアログを閉じる、など）
  onSuccess?: () => void
  submitLabel: string
  submittingLabel: string
  submitIcon: React.ReactNode
  // 新規登録フォームでは保存後に入力欄を空に戻す。編集フォームでは不要（ダイアログごと閉じるため）
  resetAfterSubmit?: boolean
  // 同じページ内に複数のフォームが存在してもID衝突しないようにするための接頭辞
  idPrefix?: string
}

const fieldClass =
  'h-12 w-full rounded-lg border border-border bg-background px-3 text-base text-foreground placeholder:text-muted-foreground/60 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40'

// localStorage/DBの容量を圧迫しないよう、保存前にブラウザ内でリサイズ・圧縮する
const resizeImageToDataUrl = (file: File, maxSize = 800, quality = 0.82): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(reader.error)
    reader.onload = () => {
      const img = new Image()
      img.onerror = reject
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('canvas context unavailable'))
          return
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  })
}

export function BottleFormFields({
  initialValues,
  onSubmit,
  onSuccess,
  submitLabel,
  submittingLabel,
  submitIcon,
  resetAfterSubmit = false,
  idPrefix = '',
}: BottleFormFieldsProps) {
  const [customerName, setCustomerName] = useState(initialValues?.customerName ?? '')
  const [bottleType, setBottleType] = useState(initialValues?.bottleType ?? '')
  const [photo, setPhoto] = useState<string | undefined>(initialValues?.photo)
  const [shelfRow, setShelfRow] = useState<string>(initialValues?.shelfRow ?? 'A')
  const [shelfCol, setShelfCol] = useState<string>(initialValues?.shelfCol ?? '1')
  const [remainingNote, setRemainingNote] = useState(initialValues?.remainingNote ?? '')
  const [done, setDone] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const dataUrl = await resizeImageToDataUrl(file)
    setPhoto(dataUrl)
  }

  const handleRemovePhoto = () => {
    setPhoto(undefined)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customerName.trim() || !bottleType.trim()) return

    setError('')
    setIsSubmitting(true)
    try {
      await onSubmit({
        customerName: customerName.trim(),
        bottleType: bottleType.trim(),
        photo,
        shelfRow,
        shelfCol,
        remainingNote: remainingNote.trim() || '満タン',
      })

      if (resetAfterSubmit) {
        setCustomerName('')
        setBottleType('')
        setPhoto(undefined)
        if (fileInputRef.current) fileInputRef.current.value = ''
        setShelfRow('A')
        setShelfCol('1')
        setRemainingNote('')
        setDone(true)
        setTimeout(() => setDone(false), 2500)
      }
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存に失敗しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  const nameId = `${idPrefix}customerName`
  const typeId = `${idPrefix}bottleType`
  const photoId = `${idPrefix}bottlePhoto`
  const rowId = `${idPrefix}shelfRow`
  const colId = `${idPrefix}shelfCol`
  const noteId = `${idPrefix}remainingNote`

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor={nameId} className="text-sm font-medium text-muted-foreground">
          お客様の名前
        </label>
        <input
          id={nameId}
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="例：山田 太郎"
          required
          className={fieldClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={typeId} className="text-sm font-medium text-muted-foreground">
          ボトルの種類
        </label>
        <input
          id={typeId}
          type="text"
          value={bottleType}
          onChange={(e) => setBottleType(e.target.value)}
          placeholder="例：森伊蔵 720ml"
          required
          className={fieldClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={photoId} className="text-sm font-medium text-muted-foreground">
          ボトル（写真・任意）
        </label>
        <input
          ref={fileInputRef}
          id={photoId}
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="sr-only"
        />
        {photo ? (
          <div className="flex items-center gap-3 rounded-lg border border-border bg-background p-2">
            <img
              src={photo}
              alt="ボトルの写真プレビュー"
              className="size-16 shrink-0 rounded-md border border-border object-cover"
            />
            <button
              type="button"
              onClick={handleRemovePhoto}
              className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <X className="size-4" />
              写真を削除
            </button>
          </div>
        ) : (
          <label
            htmlFor={photoId}
            className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-background text-sm text-muted-foreground transition hover:border-primary hover:text-foreground"
          >
            <ImagePlus aria-hidden="true" className="size-4" />
            ボトルの写真を選択
          </label>
        )}
      </div>

      <fieldset className="flex flex-col gap-1.5">
        <legend className="mb-1.5 text-sm font-medium text-muted-foreground">棚の番号</legend>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor={rowId} className="sr-only">
              棚の段（A〜D）
            </label>
            <select
              id={rowId}
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
            <label htmlFor={colId} className="sr-only">
              棚の列（1〜5）
            </label>
            <select
              id={colId}
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
        <label htmlFor={noteId} className="text-sm font-medium text-muted-foreground">
          残量メモ（任意）
        </label>
        <input
          id={noteId}
          type="text"
          value={remainingNote}
          onChange={(e) => setRemainingNote(e.target.value)}
          placeholder="例：残り 7割 / ほぼ満タン"
          className={fieldClass}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 flex h-12 items-center justify-center gap-2 rounded-lg bg-primary font-medium text-primary-foreground transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary/50 active:scale-[0.99] disabled:opacity-60"
      >
        {done ? (
          <>
            <CheckCircle2 className="size-5" />
            登録しました
          </>
        ) : (
          <>
            {submitIcon}
            {isSubmitting ? submittingLabel : submitLabel}
          </>
        )}
      </button>
    </form>
  )
}
