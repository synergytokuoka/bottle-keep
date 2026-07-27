import { supabase } from './client'
import type { Bottle } from '@/lib/bottle-data'

// Supabase の bottles テーブルの行（スネークケース）の型
type BottleRow = {
  id: string
  customer_name: string
  bottle_type: string
  photo: string | null
  shelf_row: string
  shelf_col: string
  remaining_note: string
  registered_at: string
}

// DBの行（スネークケース）をアプリの Bottle 型（キャメルケース）に変換する
const rowToBottle = (row: BottleRow): Bottle => ({
  id: row.id,
  customerName: row.customer_name,
  bottleType: row.bottle_type,
  photo: row.photo ?? undefined,
  shelfRow: row.shelf_row,
  shelfCol: row.shelf_col,
  remainingNote: row.remaining_note,
  registeredAt: row.registered_at,
})

// ログイン中ユーザーのボトル一覧を取得する（SELECT）
// RLSにより自分が登録したボトルのみが返るため、user_id での絞り込みは不要
export async function fetchBottles(): Promise<Bottle[]> {
  const { data, error } = await supabase
    .from('bottles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data as BottleRow[]).map(rowToBottle)
}

// 新しいボトルを登録する（INSERT）
// 誰が登録したボトルかを記録するため user_id を必ず一緒に保存する
export async function insertBottle(
  bottle: Omit<Bottle, 'id' | 'registeredAt'>,
  userId: string,
): Promise<Bottle> {
  const { data, error } = await supabase
    .from('bottles')
    .insert({
      user_id: userId,
      customer_name: bottle.customerName,
      bottle_type: bottle.bottleType,
      photo: bottle.photo ?? null,
      shelf_row: bottle.shelfRow,
      shelf_col: bottle.shelfCol,
      remaining_note: bottle.remainingNote,
    })
    .select()
    .single()

  if (error) throw error
  return rowToBottle(data as BottleRow)
}

// 既存のボトル情報を更新する（UPDATE）
// RLSの更新ポリシーにより、自分が登録したボトル（user_id = auth.uid()）以外は更新できない
export async function updateBottle(
  id: string,
  bottle: Omit<Bottle, 'id' | 'registeredAt'>,
): Promise<Bottle> {
  const { data, error } = await supabase
    .from('bottles')
    .update({
      customer_name: bottle.customerName,
      bottle_type: bottle.bottleType,
      photo: bottle.photo ?? null,
      shelf_row: bottle.shelfRow,
      shelf_col: bottle.shelfCol,
      remaining_note: bottle.remainingNote,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return rowToBottle(data as BottleRow)
}

// ボトルを削除する（DELETE）
// RLSの削除ポリシーにより、自分が登録したボトル以外は削除できない
export async function deleteBottle(id: string): Promise<void> {
  const { error } = await supabase.from('bottles').delete().eq('id', id)
  if (error) throw error
}
