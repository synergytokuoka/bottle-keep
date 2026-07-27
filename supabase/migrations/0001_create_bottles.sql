-- ボトルキープ管理: bottles テーブルと RLS ポリシー
-- Supabase ダッシュボードの SQL Editor で実行してください
-- (このプロジェクトが保持する anon/publishable key だけではテーブル作成はできないため、手動実行が必要です)

create table if not exists public.bottles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  customer_name text not null,
  bottle_type text not null,
  photo text,
  shelf_row text not null,
  shelf_col text not null,
  remaining_note text not null default '満タン',
  registered_at date not null default current_date,
  created_at timestamptz not null default now()
);

create index if not exists bottles_user_id_idx on public.bottles (user_id);

alter table public.bottles enable row level security;

create policy "Users can view their own bottles"
  on public.bottles for select
  using (auth.uid() = user_id);

create policy "Users can insert their own bottles"
  on public.bottles for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own bottles"
  on public.bottles for update
  using (auth.uid() = user_id);

create policy "Users can delete their own bottles"
  on public.bottles for delete
  using (auth.uid() = user_id);
