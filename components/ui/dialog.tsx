'use client'

import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { X } from 'lucide-react'

import { cn } from '@/lib/utils'

function Dialog(props: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogPortal(props: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogBackdrop({ className, ...props }: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-backdrop"
      className={cn('fixed inset-0 z-50 bg-black/60', className)}
      {...props}
    />
  )
}

function DialogContent({ className, children, ...props }: DialogPrimitive.Popup.Props) {
  return (
    <DialogPortal>
      <DialogBackdrop />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        className={cn(
          'fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-card p-6 shadow-lg outline-none',
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close
          aria-label="閉じる"
          className="absolute top-4 right-4 flex size-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          <X className="size-4" />
        </DialogPrimitive.Close>
      </DialogPrimitive.Popup>
    </DialogPortal>
  )
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn('font-serif text-lg font-semibold text-card-foreground', className)}
      {...props}
    />
  )
}

export { Dialog, DialogContent, DialogTitle }
