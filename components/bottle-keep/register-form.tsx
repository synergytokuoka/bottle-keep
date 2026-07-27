'use client'

import { PlusCircle } from 'lucide-react'
import type { Bottle } from '@/lib/bottle-data'
import { BottleFormFields } from './bottle-form-fields'

type RegisterFormProps = {
  onAdd: (bottle: Omit<Bottle, 'id' | 'registeredAt'>) => Promise<void>
}

export function RegisterForm({ onAdd }: RegisterFormProps) {
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

      <BottleFormFields
        onSubmit={onAdd}
        submitLabel="ボトルを登録する"
        submittingLabel="登録中..."
        submitIcon={<PlusCircle className="size-5" />}
        resetAfterSubmit
      />
    </section>
  )
}
