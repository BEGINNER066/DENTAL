-- Little Dental World — Complete Database Schema & Row Level Security (RLS)
-- Sesuai Spesifikasi Dokumen Desain (Bab 8 & Bab 10)

create extension if not exists "pgcrypto";

-- 1. Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Caca',
  avatar_url text,
  role text not null default 'owner' check (role in ('owner', 'gift_admin')),
  weekly_study_target_mins integer not null default 300,
  animations_enabled boolean not null default true,
  gamification_enabled boolean not null default true,
  created_at timestamptz not null default now()
);

-- 2. Subjects (Mata kuliah)
create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  semester integer not null check (semester >= 1 and semester <= 14),
  discipline text not null, -- e.g. 'Ilmu Kedokteran Dasar', 'Ilmu Kedokteran Gigi Dasar', 'Ilmu Klinik', 'Ilmu Pendukung'
  name text not null,
  code text,
  color_accent text default '#F4C8D9',
  created_at timestamptz not null default now()
);

-- 3. Chapters & Subchapters (Bab / Subbab bertingkat via parent_id)
create table if not exists public.chapters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject_id uuid not null references public.subjects(id) on delete cascade,
  parent_id uuid references public.chapters(id) on delete cascade,
  title text not null,
  order_no integer not null default 1,
  is_studied boolean not null default false,
  needs_review boolean not null default false,
  confidence_level integer not null default 3 check (confidence_level between 1 and 5),
  created_at timestamptz not null default now()
);

-- 4. Materials (Materi dan lampiran)
create table if not exists public.materials (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  chapter_id uuid not null references public.chapters(id) on delete cascade,
  title text not null,
  description text,
  file_type text not null default 'pdf' check (file_type in ('pdf', 'image', 'document', 'presentation', 'link')),
  file_path text,
  source_url text,
  tags text[] not null default '{}',
  understanding_status text not null default 'not_started' check (understanding_status in ('not_started', 'studying', 'needs_review', 'understood')),
  created_at timestamptz not null default now()
);

-- 5. Bookmarks
create table if not exists public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  material_id uuid not null references public.materials(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, material_id)
);

-- 6. Notes (Catatan belajar)
create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject_id uuid references public.subjects(id) on delete set null,
  chapter_id uuid references public.chapters(id) on delete set null,
  title text not null,
  body text not null default '',
  tags text[] not null default '{}',
  attachment_url text,
  is_pinned boolean not null default false,
  is_archived boolean not null default false,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- 7. Tasks (Task Manager)
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject_id uuid references public.subjects(id) on delete set null,
  title text not null,
  description text,
  due_at timestamptz,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'todo' check (status in ('todo', 'in_progress', 'done', 'deferred')),
  reminder_at timestamptz,
  created_at timestamptz not null default now()
);

-- 8. Academic Calendar Events
create table if not exists public.calendar_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('kuliah', 'praktikum', 'skill_lab', 'fgd', 'ujian', 'deadline')),
  title text not null,
  starts_at timestamptz not null,
  ends_at timestamptz,
  location text,
  notes text,
  reminder_minutes integer,
  linked_task_id uuid references public.tasks(id) on delete set null,
  created_at timestamptz not null default now()
);

-- 9. FGD Sessions
create table if not exists public.fgd_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  topic text not null,
  meeting_at timestamptz not null,
  goal text,
  members text[] not null default '{}',
  trigger_questions text[] not null default '{}',
  discussion_points text[] not null default '{}',
  references_list text[] not null default '{}',
  summary text,
  prep_status text not null default 'preparing' check (prep_status in ('preparing', 'ready', 'completed')),
  created_at timestamptz not null default now()
);

-- 10. FGD Action Items (dapat dihubungkan langsung ke tasks via task_id)
create table if not exists public.fgd_actions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  session_id uuid not null references public.fgd_sessions(id) on delete cascade,
  task_id uuid references public.tasks(id) on delete set null,
  assignee text,
  description text not null,
  created_at timestamptz not null default now()
);

-- 11. Skill Lab Tracker
create table if not exists public.skill_labs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  category text,
  status text not null default 'not_started' check (status in ('not_started', 'practicing', 'needs_review', 'confident')),
  prep_checklist jsonb not null default '[]'::jsonb,
  practiced_at timestamptz,
  scheduled_at timestamptz,
  reflection text,
  created_at timestamptz not null default now()
);

-- 12. Quizzes
create table if not exists public.quizzes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject_id uuid references public.subjects(id) on delete set null,
  title text not null,
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- 13. Quiz Questions
create table if not exists public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  question_type text not null default 'mcq' check (question_type in ('mcq', 'true_false', 'flashcard')),
  prompt text not null,
  options jsonb not null default '[]'::jsonb,
  answer text not null,
  explanation text,
  material_id uuid references public.materials(id) on delete set null
);

-- 14. Quiz Attempts
create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  score integer not null,
  total_questions integer not null,
  weak_topics text[] not null default '{}',
  completed_at timestamptz not null default now()
);

-- 15. Study Sessions
create table if not exists public.study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject_id uuid references public.subjects(id) on delete set null,
  chapter_id uuid references public.chapters(id) on delete set null,
  started_at timestamptz not null default now(),
  duration integer not null default 25 -- minutes
);

-- 16. Diary Entries (STRICTLY PRIVATE - owner only)
create table if not exists public.diary_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text,
  body text not null,
  mood text,
  entry_date date not null default current_date,
  created_at timestamptz not null default now()
);

-- 17. Mood Entries (STRICTLY PRIVATE - owner only)
create table if not exists public.mood_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  mood text not null,
  note text,
  created_at timestamptz not null default now()
);

-- 18. Memories (Galeri kenangan)
create table if not exists public.memories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  caption text,
  file_path text not null,
  memory_date date not null default current_date,
  created_at timestamptz not null default now()
);

-- 19. Gift Messages & Surprise Box (Isolated Gift Admin Content - Bab 8)
create table if not exists public.gift_messages (
  id uuid primary key default gen_random_uuid(),
  recipient_user_id uuid references auth.users(id) on delete cascade,
  created_by uuid references auth.users(id) on delete set null,
  kind text not null default 'surprise' check (kind in ('surprise', 'letter_from_giver', 'daily_note')),
  title text not null,
  body text not null,
  unlock_at timestamptz,
  unlock_condition text,
  is_active boolean not null default true,
  is_opened boolean not null default false,
  created_at timestamptz not null default now()
);

-- 19b. Future Self Letters & Bucket List (Owner)
create table if not exists public.personal_letters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  body text not null,
  open_on date,
  created_at timestamptz not null default now()
);

create table if not exists public.bucket_list_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  category text default 'Personal',
  is_completed boolean not null default false,
  target_date date,
  created_at timestamptz not null default now()
);

-- 20. Playlists (Spotify Embed)
create table if not exists public.playlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  spotify_url text not null,
  category text not null default 'Focus' check (category in ('Focus', 'Calm', 'Happy', 'Late Night Study')),
  created_at timestamptz not null default now()
);

-- 21. Achievements (Gamifikasi sehat)
create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  badge_key text not null,
  earned_at timestamptz not null default now(),
  unique (user_id, badge_key)
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================
alter table public.profiles enable row level security;
alter table public.subjects enable row level security;
alter table public.chapters enable row level security;
alter table public.materials enable row level security;
alter table public.bookmarks enable row level security;
alter table public.notes enable row level security;
alter table public.tasks enable row level security;
alter table public.calendar_events enable row level security;
alter table public.fgd_sessions enable row level security;
alter table public.fgd_actions enable row level security;
alter table public.skill_labs enable row level security;
alter table public.quizzes enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.study_sessions enable row level security;
alter table public.diary_entries enable row level security;
alter table public.mood_entries enable row level security;
alter table public.memories enable row level security;
alter table public.gift_messages enable row level security;
alter table public.personal_letters enable row level security;
alter table public.bucket_list_items enable row level security;
alter table public.playlists enable row level security;
alter table public.achievements enable row level security;

-- Owner-only policies for all personal tables
create policy "profiles_owner" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "subjects_owner" on public.subjects for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "chapters_owner" on public.chapters for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "materials_owner" on public.materials for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "bookmarks_owner" on public.bookmarks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "notes_owner" on public.notes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "tasks_owner" on public.tasks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "calendar_events_owner" on public.calendar_events for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "fgd_sessions_owner" on public.fgd_sessions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "fgd_actions_owner" on public.fgd_actions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "skill_labs_owner" on public.skill_labs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "quizzes_owner" on public.quizzes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "quiz_questions_owner" on public.quiz_questions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "quiz_attempts_owner" on public.quiz_attempts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "study_sessions_owner" on public.study_sessions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "diary_entries_strict_owner" on public.diary_entries for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "mood_entries_strict_owner" on public.mood_entries for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "memories_owner" on public.memories for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "personal_letters_owner" on public.personal_letters for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "bucket_list_owner" on public.bucket_list_items for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "playlists_owner" on public.playlists for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "achievements_owner" on public.achievements for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Gift Messages: recipient (Caca) can read & mark opened; gift_admin can manage gift_messages ONLY (never diary/mood)
create policy "gift_messages_read_recipient" on public.gift_messages
  for select using (
    auth.uid() = recipient_user_id
    or auth.uid() = created_by
  );

create policy "gift_messages_update_recipient" on public.gift_messages
  for update using (auth.uid() = recipient_user_id or auth.uid() = created_by);

create policy "gift_messages_insert_admin" on public.gift_messages
  for insert with check (
    auth.uid() = created_by
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('gift_admin', 'owner')
    )
  );

create policy "gift_messages_delete_creator" on public.gift_messages
  for delete using (auth.uid() = created_by);

-- Private Storage Bucket Setup (jalankan di SQL editor Supabase)
insert into storage.buckets (id, name, public)
values ('private-files', 'private-files', false)
on conflict (id) do nothing;

create policy "private_files_owner_read" on storage.objects
  for select using (
    bucket_id = 'private-files'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "private_files_owner_insert" on storage.objects
  for insert with check (
    bucket_id = 'private-files'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "private_files_owner_delete" on storage.objects
  for delete using (
    bucket_id = 'private-files'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
