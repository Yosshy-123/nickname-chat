-- Add type column to messages table
alter table public.messages 
add column if not exists type text not null default 'message' 
check (type in ('message', 'nickname_change'));

-- Create index for message type
create index if not exists messages_type_idx on public.messages(type);
