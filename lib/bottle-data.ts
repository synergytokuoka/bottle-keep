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

export const INITIAL_BOTTLES: Bottle[] = [
  {
    id: '1',
    customerName: '田中 誠',
    bottleType: '森伊蔵 720ml',
    shelfRow: 'A',
    shelfCol: '1',
    registeredAt: '2026-05-12',
    remainingNote: '残り 7割',
  },
  {
    id: '2',
    customerName: '佐藤 美咲',
    bottleType: '獺祭 純米大吟醸',
    shelfRow: 'A',
    shelfCol: '3',
    registeredAt: '2026-06-01',
    remainingNote: '残り 4割',
  },
  {
    id: '3',
    customerName: '鈴木 一郎',
    bottleType: '山崎 12年',
    shelfRow: 'B',
    shelfCol: '2',
    registeredAt: '2026-06-20',
    remainingNote: 'ほぼ満タン',
  },
  {
    id: '4',
    customerName: '高橋 直子',
    bottleType: '黒霧島 900ml',
    shelfRow: 'C',
    shelfCol: '5',
    registeredAt: '2026-07-02',
    remainingNote: '残りわずか（要連絡）',
  },
  {
    id: '5',
    customerName: '渡辺 健太',
    bottleType: '久保田 千寿',
    shelfRow: 'D',
    shelfCol: '4',
    registeredAt: '2026-07-10',
    remainingNote: '残り 6割',
  },
]
