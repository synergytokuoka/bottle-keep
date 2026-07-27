import { supabase } from './client'
import type { Bottle } from '@/lib/bottle-data'

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

export async function fetchBottles(): Promise<Bottle[]> {
  const { data, error } = await supabase
    .from('bottles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data as BottleRow[]).map(rowToBottle)
}

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

export async function deleteBottle(id: string): Promise<void> {
  const { error } = await supabase.from('bottles').delete().eq('id', id)
  if (error) throw error
}
