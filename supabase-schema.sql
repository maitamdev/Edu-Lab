-- ============================================================
-- EduLab – Supabase Schema Setup
-- Run this in Supabase Dashboard > SQL Editor
-- https://supabase.com/dashboard/project/ukdokqcgolarlsxrtiyi/sql/new
-- ============================================================

-- PART 1: Create Tables & RLS Policies
-- ============================================================

-- profiles (linked to auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  role text not null default 'student',
  avatar_url text,
  xp integer not null default 0,
  streak integer not null default 0,
  level integer not null default 1,
  last_active_at timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);
alter table public.profiles enable row level security;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- experiments catalog
create table if not exists public.experiments (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subject text not null,
  description text,
  icon text,
  difficulty text default 'beginner',
  created_at timestamp with time zone default now()
);
alter table public.experiments enable row level security;
create policy "Anyone can view experiments" on public.experiments for select using (true);

-- user_experiments (progress tracking, realtime)
create table if not exists public.user_experiments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  experiment_id uuid references public.experiments(id) on delete cascade,
  progress integer not null default 0,
  completed boolean default false,
  last_accessed_at timestamp with time zone default now(),
  created_at timestamp with time zone default now(),
  unique(user_id, experiment_id)
);
alter table public.user_experiments enable row level security;
create policy "Users can view own progress" on public.user_experiments for select using (auth.uid() = user_id);
create policy "Users can manage own progress" on public.user_experiments for all using (auth.uid() = user_id);
create policy "Users can insert own progress" on public.user_experiments for insert with check (auth.uid() = user_id);

-- notifications (realtime)
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  message text,
  read boolean default false,
  created_at timestamp with time zone default now()
);
alter table public.notifications enable row level security;
create policy "Users read own notifications" on public.notifications for select using (auth.uid() = user_id);
create policy "Users update own notifications" on public.notifications for update using (auth.uid() = user_id);

-- ============================================================
-- PART 2: Auto-create profile trigger on new signup
-- ============================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'student')
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- PART 3: Seed experiment catalog
-- ============================================================
insert into public.experiments (title, subject, description, icon) values
  ('Chuyển động ném xiên', 'Vật Lý', 'Khảo sát quỹ đạo ném xiên trong trọng trường', 'Atom'),
  ('Phản ứng oxi hóa khử', 'Hóa Học', 'Thí nghiệm oxi hóa khử cơ bản trong phòng lab', 'Beaker'),
  ('Quan sát tế bào thực vật', 'Sinh Học', 'Dùng kính hiển vi quan sát cấu trúc tế bào', 'Dna'),
  ('Cân bằng phương trình hóa học', 'Hóa Học', 'Cân bằng phương trình hóa học theo phương pháp ion', 'FlaskConical'),
  ('Định luật Ohm', 'Vật Lý', 'Khảo sát mối liên hệ U-I theo định luật Ohm', 'Atom'),
  ('Chu kỳ phân chia tế bào', 'Sinh Học', 'Các giai đoạn nguyên phân và giảm phân', 'Dna'),
  ('Lập trình Python cơ bản', 'Lập trình', 'Biến, hàm, vòng lặp trong Python', 'Code2'),
  ('Cảm ứng điện từ Faraday', 'Vật Lý', 'Thí nghiệm cảm ứng điện từ', 'Atom')
on conflict do nothing;

-- ============================================================
-- PART 4: Enable Realtime on tables
-- ============================================================
alter publication supabase_realtime add table public.profiles;
alter publication supabase_realtime add table public.user_experiments;
alter publication supabase_realtime add table public.notifications;
