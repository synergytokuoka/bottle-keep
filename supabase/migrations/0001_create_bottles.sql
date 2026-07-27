-- ボトルキープ管理: bottles テーブルと RLS ポリシー
-- Supabase ダッシュボードの SQL Editor で実行してください
-- (このプロジェクトが保持する anon/publishable key だけではテーブル作成はできないため、手動実行が必要です)

create table if not exists public.bottles (
  id uuid primary key default gen_random_uuid(),         -- ボトルID（主キー）
  user_id uuid not null references auth.users (id) on delete cascade, -- 登録したユーザー（ログインユーザーが退会したらボトルも削除）
  customer_name text not null,                            -- お客様のお名前
  bottle_type text not null,                              -- ボトルの種類（銘柄など）
  photo text,                                              -- ボトルの写真（data URL。任意項目）
  shelf_row text not null,                                 -- 棚の番号（段）A〜D
  shelf_col text not null,                                 -- 棚の番号（列）1〜5
  remaining_note text not null default '満タン',             -- 残量メモ
  registered_at date not null default current_date,        -- 登録日
  created_at timestamptz not null default now()            -- 作成日時（並び替え用）
);

-- user_id での絞り込み・RLS判定を高速化するためのインデックス
create index if not exists bottles_user_id_idx on public.bottles (user_id);

-- 行単位セキュリティ（RLS）を有効化。これがないとポリシーを設定しても無効化される
alter table public.bottles enable row level security;

-- SELECT: 自分が登録したボトルのみ閲覧できる
create policy "Users can view their own bottles"
  on public.bottles for select
  using (auth.uid() = user_id);

-- INSERT: 自分の user_id としてしか登録できない（他人になりすまして登録できないようにする）
create policy "Users can insert their own bottles"
  on public.bottles for insert
  with check (auth.uid() = user_id);

-- UPDATE: 自分が登録したボトルのみ更新できる。
-- using = 更新対象として選択できる行の条件、with check = 更新後の内容が満たすべき条件。
-- 両方に auth.uid() = user_id を指定することで、更新時に user_id を他人のIDへ書き換える抜け道も防ぐ
create policy "Users can update their own bottles"
  on public.bottles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- DELETE: 自分が登録したボトルのみ削除できる
create policy "Users can delete their own bottles"
  on public.bottles for delete
  using (auth.uid() = user_id);
