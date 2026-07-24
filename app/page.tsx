import { Wine } from 'lucide-react'
import { BottleManager } from '@/components/bottle-keep/bottle-manager'

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      {/* ヘッダー：暖簾をイメージした帯 */}
      <header className="border-b border-border bg-gradient-to-b from-card to-background">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-6 sm:px-6">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-primary/40 bg-primary/15 text-primary">
            <Wine aria-hidden="true" className="size-6" />
          </span>
          <div>
            <p className="font-serif text-xs tracking-[0.3em] text-accent">IZAKAYA BOTTLE KEEP</p>
            <h1 className="font-serif text-2xl font-bold tracking-wide text-foreground text-balance">
              ボトルキープ管理
            </h1>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <BottleManager />
      </div>

      <footer className="border-t border-border/60 py-6 text-center">
        <p className="text-xs text-muted-foreground">
          お客様のキープボトルを、名前・棚番号でかんたん管理
        </p>
      </footer>
    </main>
  )
}
