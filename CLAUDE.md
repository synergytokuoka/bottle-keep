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
- **データ永続化**: バックエンド／DBなし。ブラウザの `localStorage`（キー `bottle-keep:bottles`）のみで完結するクライアント専用構成
- **テスト**: 未導入（テストフレームワーク・テストスクリプトなし）

## コンポーネントの命名規約

- **ファイル名**: kebab-case（例: `bottle-manager.tsx`, `register-form.tsx`, `search-bar.tsx`, `bottle-card.tsx`）
- **コンポーネント（関数）名**: PascalCase で、ファイル名に対応させる（例: `bottle-manager.tsx` → `BottleManager`）
- **Propsの型**: `<コンポーネント名>Props` という命名（例: `RegisterFormProps`）
- **配置場所**:
  - 機能固有のコンポーネントは `components/<機能名>/` 配下（例: `components/bottle-keep/`）
  - 汎用・shadcn生成のUIプリミティブは `components/ui/` 配下
- **`lib/` 配下**: ファイル名は kebab-case（例: `bottle-data.ts`）。型は PascalCase（例: `Bottle`）、定数は UPPER_SNAKE_CASE（例: `SHELF_ROWS`, `SHELF_COLS`, `INITIAL_BOTTLES`）、関数は camelCase（例: `shelfLabel`, `cn`）

## Git運用ルール

- **コードに変更を加えたら、その都度コミットし、GitHubにプッシュする。** 変更を溜め込まず、1つの作業がまとまったタイミングでこまめにコミット→プッシュする。
- コミットメッセージは変更内容が分かる簡潔な一文にする。
- プッシュ前に `git status` / `git diff` で意図しない差分（一時ファイルや大きなバイナリなど）が含まれていないか確認する。
- リモートリポジトリが未設定の場合は、先にGitHub上にリポジトリを作成し、`origin` として登録してからプッシュする。

## Architecture

This is a **client-only** Next.js (App Router, Next 16 / React 19) single-page app — there is no backend, API route, or database. All state lives in the browser.

- `app/page.tsx` — page shell (header/footer chrome) that renders `BottleManager`.
- `app/layout.tsx` — root layout; loads two Google fonts used for the izakaya theme (`Noto_Sans_JP` for body text, `Shippori_Mincho` for serif/heading text, exposed as CSS vars `--font-noto-sans-jp` / `--font-shippori-mincho`), and conditionally mounts `@vercel/analytics` only in production.
- `lib/bottle-data.ts` — the domain model: the `Bottle` type, shelf position constants (`SHELF_ROWS` A–D × `SHELF_COLS` 1–5), the `shelfLabel` helper, and `INITIAL_BOTTLES` seed data used as the fallback/default dataset.
- `components/bottle-keep/bottle-manager.tsx` — the single stateful component that owns the `bottles` array and search `query`. It filters bottles for `SearchBar`, hands an `onAdd` callback to `RegisterForm`, and renders the list via `BottleCard`. **Persistence:** on mount it loads saved bottles from `localStorage` (key `bottle-keep:bottles`) via `useEffect` (kept separate from the `useState` initializer to avoid an SSR/client hydration mismatch — the first client render must match the server-rendered `INITIAL_BOTTLES`), then a second `useEffect` writes to `localStorage` on every change, gated by an `isLoaded` flag so the initial load doesn't get clobbered before it completes.
- `components/bottle-keep/register-form.tsx`, `search-bar.tsx`, `bottle-card.tsx` — presentational children driven entirely by props/callbacks from `BottleManager`; they hold no persisted state of their own.
- `components/ui/` — shadcn-generated primitives (currently just `button.tsx`), built on `@base-ui/react` primitives + `class-variance-authority` for variants, styled with Tailwind.

Path alias: `@/*` maps to the repo root (see `tsconfig.json`), matching the shadcn `aliases` config in `components.json` (style `base-nova`, base color `neutral`, Tailwind CSS v4 with `cssVariables: true`, icon library `lucide`).

`next.config.mjs` sets `typescript.ignoreBuildErrors: true` and `images.unoptimized: true`.
