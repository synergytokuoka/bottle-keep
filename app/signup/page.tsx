'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { UserPlus, Wine } from 'lucide-react'
import { useAuth } from '@/components/auth/auth-provider'
import { supabase } from '@/lib/supabase/client'

const fieldClass =
  'h-12 w-full rounded-lg border border-border bg-background px-3 text-base text-foreground placeholder:text-muted-foreground/60 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40'

export default function SignupPage() {
  const router = useRouter()
  const { session, isLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [confirmationSent, setConfirmationSent] = useState(false)

  useEffect(() => {
    if (!isLoading && session) {
      router.replace('/')
    }
  }, [isLoading, session, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('パスワードが一致しません')
      return
    }

    setIsSubmitting(true)
    const { data, error: signUpError } = await supabase.auth.signUp({ email, password })
    setIsSubmitting(false)

    if (signUpError) {
      setError(signUpError.message)
      return
    }

    if (data.session) {
      router.replace('/')
      return
    }

    // メール確認が必要なプロジェクト設定の場合、セッションはまだ発行されない
    setConfirmationSent(true)
  }

  if (confirmationSent) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
        <section className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
          <h1 className="font-serif text-xl font-bold text-foreground">確認メールを送信しました</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {email} 宛に確認メールを送信しました。メール内のリンクを開いて登録を完了してください。
          </p>
          <Link
            href="/login"
            className="mt-6 inline-block font-medium text-primary hover:underline"
          >
            ログイン画面へ戻る
          </Link>
        </section>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <section className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <span className="flex size-12 items-center justify-center rounded-xl border border-primary/40 bg-primary/15 text-primary">
            <Wine aria-hidden="true" className="size-6" />
          </span>
          <h1 className="font-serif text-xl font-bold text-foreground">会員登録</h1>
          <p className="text-sm text-muted-foreground">新しいアカウントを作成します</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-muted-foreground">
              メールアドレス
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
              className={fieldClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium text-muted-foreground">
              パスワード
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="6文字以上"
              required
              minLength={6}
              autoComplete="new-password"
              className={fieldClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-muted-foreground">
              パスワード（確認）
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="もう一度入力"
              required
              minLength={6}
              autoComplete="new-password"
              className={fieldClass}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 flex h-12 items-center justify-center gap-2 rounded-lg bg-primary font-medium text-primary-foreground transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary/50 active:scale-[0.99] disabled:opacity-60"
          >
            <UserPlus className="size-5" />
            {isSubmitting ? '登録中...' : '会員登録する'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          すでにアカウントをお持ちの方は{' '}
          <Link href="/login" className="font-medium text-primary hover:underline">
            ログイン
          </Link>
        </p>
      </section>
    </main>
  )
}
