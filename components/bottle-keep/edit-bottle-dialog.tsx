'use client'

import { Save } from 'lucide-react'
import type { Bottle } from '@/lib/bottle-data'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { BottleFormFields } from './bottle-form-fields'

type EditBottleDialogProps = {
  bottle: Bottle
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (id: string, data: Omit<Bottle, 'id' | 'registeredAt'>) => Promise<void>
}

export function EditBottleDialog({ bottle, open, onOpenChange, onSave }: EditBottleDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle className="mb-5">ボトル情報を編集</DialogTitle>
        <BottleFormFields
          // ボトルが切り替わったときに入力状態をリセットするためのkey
          key={bottle.id}
          initialValues={bottle}
          onSubmit={(data) => onSave(bottle.id, data)}
          onSuccess={() => onOpenChange(false)}
          submitLabel="変更を保存する"
          submittingLabel="保存中..."
          submitIcon={<Save className="size-5" />}
          idPrefix="edit-"
        />
      </DialogContent>
    </Dialog>
  )
}
