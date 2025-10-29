-- Create rooms table
create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamp with time zone default now()
);

-- Create messages table
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  nickname text not null,
  content text not null,
  created_at timestamp with time zone default now()
);

-- Create index for faster queries
create index if not exists messages_room_id_idx on public.messages(room_id);
create index if not exists messages_created_at_idx on public.messages(created_at desc);

-- Enable realtime for messages
alter publication supabase_realtime add table public.messages;
