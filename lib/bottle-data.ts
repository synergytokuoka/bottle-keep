export type Bottle = {
  id: string
  customerName: string
  bottleType: string
  photo?: string // ボトル写真の data URL（任意）
  shelfRow: string // A〜D
  shelfCol: string // 1〜5
  registeredAt: string // YYYY-MM-DD
  remainingNote: string
}

export const SHELF_ROWS = ['A', 'B', 'C', 'D'] as const
export const SHELF_COLS = ['1', '2', '3', '4', '5'] as const

export const shelfLabel = (bottle: Pick<Bottle, 'shelfRow' | 'shelfCol'>) =>
  `${bottle.shelfRow}-${bottle.shelfCol}`
