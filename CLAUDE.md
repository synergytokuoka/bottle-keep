# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is **pnpm** (see `pnpm-lock.yaml` / `pnpm-workspace.yaml`). If `pnpm` isn't on PATH, run it via corepack: `corepack pnpm <command>`.

```bash
pnpm install       # install dependencies
pnpm dev           # start Next.js dev server (Turbopack) at http://localhost:3000
pnpm build         # production build
pnpm start         # run the production build
pnpm lint          # eslint .
```

There is no test suite configured in this project (no test script, no test framework installed).

### 環境変数

`.env`（gitignore 済み、リポジトリには含めない）に以下を設定する。値は `.env.example` を参照。

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

本番（GitHub Pages）ビルドでは、GitHub Actions の Secrets（`NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`）から `.github/workflows/deploy.yml` のビルドステップに渡している。

### Supabase スキーマ変更

`supabase/migrations/` に SQL を追記し、**Supabase ダッシュボードの SQL Editor で手動実行**する。このプロジェクトは anon/publishable key しか保持しておらず、DDL（テーブル作成等）を実行できる service_role key や Management API トークンがないため、Claude Code からスキーマ変更を直接適用することはできない。

## デプロイ先

https://synergytokuoka.github.io/bottle-keep/

GitHub Pages（リポジトリ `bottle-keep`）でのホスティングを想定。静的サイトとして配信するため、実際にデプロイする際は `next.config.mjs` に `output: 'export'` と `basePath: '/bottle-keep'` の設定、および対応するビルド・デプロイ用の GitHub Actions ワークフローの追加が必要（現時点では未設定）。

## 技術スタック

- **フレームワーク**: Next.js 16（App Router）+ React 19 + TypeScript 5.7
- **スタイリング**: Tailwind CSS v4（`@tailwindcss/postcss`）、`class-variance-authority` でバリアント管理、`clsx` + `tailwind-merge` を `lib/utils.ts` の `cn()` ヘルパーで合成
- **UIコンポーネント**: shadcn/ui（style: `base-nova`、base color: `neutral`）を土台に、プリミティブは `@base-ui/react` を使用
- **アイコン**: `lucide-react`
- **フォント**: Google Fonts の `Noto Sans JP`（本文）/ `Shippori Mincho`（見出し・serif、居酒屋テイスト用）
- **アナリティクス**: `@vercel/analytics`（本番環境でのみマウント）
- **パッケージマネージャ**: pnpm（`pnpm-lock.yaml` / `pnpm-workspace.yaml`）
- **認証・データ永続化**: Supabase（`@supabase/supabase-js`）。Auth（メール・パスワード）でログイン必須にし、ボトルデータは Postgres の `bottles` テーブルに user_id 単位で RLS 保護して保存（`supabase/migrations/`）
- **テスト**: 未導入（テストフレームワーク・テストスクリプトなし）

## コンポーネントの命名規約

- **ファイル名**: kebab-case（例: `bottle-manager.tsx`, `register-form.tsx`, `search-bar.tsx`, `bottle-card.tsx`）
- **コンポーネント（関数）名**: PascalCase で、ファイル名に対応させる（例: `bottle-manager.tsx` → `BottleManager`）
- **Propsの型**: `<コンポーネント名>Props` という命名（例: `RegisterFormProps`）
- **配置場所**:
  - 機能固有のコンポーネントは `components/<機能名>/` 配下（例: `components/bottle-keep/`）
  - 汎用・shadcn生成のUIプリミティブは `components/ui/` 配下
- **`lib/` 配下**: ファイル名は kebab-case（例: `bottle-data.ts`, `supabase/client.ts`）。型は PascalCase（例: `Bottle`）、定数は UPPER_SNAKE_CASE（例: `SHELF_ROWS`, `SHELF_COLS`）、関数は camelCase（例: `shelfLabel`, `cn`, `fetchBottles`）

## Git運用ルール

- **コードに変更を加えたら、その都度コミットし、GitHubにプッシュする。** 変更を溜め込まず、1つの作業がまとまったタイミングでこまめにコミット→プッシュする。
- コミットメッセージは変更内容が分かる簡潔な一文にする。
- プッシュ前に `git status` / `git diff` で意図しない差分（一時ファイルや大きなバイナリなど）が含まれていないか確認する。
- リモートリポジトリが未設定の場合は、先にGitHub上にリポジトリを作成し、`origin` として登録してからプッシュする。

## Architecture

This is a Next.js (App Router, Next 16 / React 19) app statically exported (`output: 'export'`) for GitHub Pages — there is no Next.js server/API route at runtime, so all auth and data access happens client-side directly against Supabase (Auth + Postgres via `@supabase/supabase-js`).

- `app/page.tsx` — page shell (header/footer chrome) that renders `AccountMenu` and wraps `BottleManager` in `RequireAuth`.
- `app/login/page.tsx`, `app/signup/page.tsx` — standalone client-rendered auth pages (simple email/password forms) calling `supabase.auth.signInWithPassword` / `supabase.auth.signUp` directly; both redirect to `/` if a session already exists, and `/signup` shows a "check your email" screen when Supabase requires email confirmation (i.e. `signUp` doesn't return a session immediately).
- `app/layout.tsx` — root layout; wraps `children` in `AuthProvider`; loads two Google fonts used for the izakaya theme (`Noto_Sans_JP` for body text, `Shippori_Mincho` for serif/heading text, exposed as CSS vars `--font-noto-sans-jp` / `--font-shippori-mincho`), and conditionally mounts `@vercel/analytics` only in production.
- `components/auth/auth-provider.tsx` — `AuthProvider` + `useAuth()` context exposing `{ user, session, isLoading, signOut }`, backed by `supabase.auth.getSession()` + `onAuthStateChange`.
- `components/auth/require-auth.tsx` — client-side route guard; while `isLoading` or with no `session` it shows a loading state and redirects to `/login` via `useRouter().replace` (no server middleware is possible under static export, so there's an unavoidable brief flash before redirect).
- `components/auth/account-menu.tsx` — header widget showing the logged-in user's email and a sign-out button.
- `lib/supabase/client.ts` — the browser Supabase client singleton, built from `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- `lib/supabase/bottles.ts` — the only data-access layer for the `bottles` table: `fetchBottles` / `insertBottle` / `updateBottle` / `deleteBottle`, plus the snake_case (DB row) ↔ camelCase (`Bottle`) mapper. RLS on the `bottles` table restricts rows to `auth.uid() = user_id` for every operation, so `fetchBottles` never filters by user explicitly and `updateBottle`/`deleteBottle` can't target another user's row even if a client sent one.
- `supabase/migrations/*.sql` — schema history; **must be run manually** in the Supabase SQL Editor (see Commands section above — no DDL-capable credentials are available to Claude Code in this repo).
- `lib/bottle-data.ts` — the domain model: the `Bottle` type, shelf position constants (`SHELF_ROWS` A–D × `SHELF_COLS` 1–5), and the `shelfLabel` helper.
- `components/bottle-keep/bottle-manager.tsx` — the stateful component that fetches the current user's bottles from Supabase on mount (via `useAuth()` for `user.id`) and owns the `bottles` array and search `query` in memory. It filters bottles for `SearchBar`, hands an async `onAdd` callback (calls `insertBottle` then prepends the returned row) to `RegisterForm`, an async `onUpdate` (calls `updateBottle` then replaces the row in place) and `onDelete` (optimistically removes the row locally, rolls back on failure) to each `BottleCard`.
- `components/bottle-keep/bottle-form-fields.tsx` — the shared `<form>` body (all fields + the canvas-based photo resize/compress logic) used by both `RegisterForm` and `EditBottleDialog`, so the two don't duplicate the image-handling logic. Takes `initialValues` (omitted for create, the existing `Bottle` for edit), `onSubmit`, and a `resetAfterSubmit` flag (true only for the register form — the edit dialog just closes instead of clearing).
- `components/bottle-keep/register-form.tsx` — thin wrapper: card chrome + heading around `BottleFormFields` in "create" mode.
- `components/bottle-keep/edit-bottle-dialog.tsx` — `Dialog` (see `components/ui/dialog.tsx`) wrapping `BottleFormFields` pre-filled with the target bottle; rendered per-card from `bottle-card.tsx`, which owns the dialog's open/closed state.
- `components/bottle-keep/search-bar.tsx`, `bottle-card.tsx` — presentational, driven entirely by props/callbacks from `BottleManager`; hold no persisted state other than `bottle-card.tsx`'s own edit-dialog-open boolean.
- `components/ui/` — shadcn-generated primitives (`button.tsx`, `tabs.tsx`, `dialog.tsx`), built on `@base-ui/react` primitives + `class-variance-authority` for variants, styled with Tailwind.

Path alias: `@/*` maps to the repo root (see `tsconfig.json`), matching the shadcn `aliases` config in `components.json` (style `base-nova`, base color `neutral`, Tailwind CSS v4 with `cssVariables: true`, icon library `lucide`).

`next.config.mjs` sets `output: 'export'`, `typescript.ignoreBuildErrors: true`, `images.unoptimized: true`, and conditionally sets `basePath`/`assetPrefix` to `/bottle-keep` only when `GITHUB_ACTIONS === 'true'` (so local dev/build stays at the site root).
