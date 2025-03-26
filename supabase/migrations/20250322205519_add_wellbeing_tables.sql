-- Create table for wellbeing sessions
create table if not exists wellbeing_session (
  id uuid not null default gen_random_uuid() primary key,
  employee_id text not null references employee(e_id),
  created_at timestamp with time zone default now() not null,
  is_completed boolean default false,
  chat_summary text
);

-- Create index for quickly finding sessions by employee
create index if not exists idx_wellbeing_session_employee on wellbeing_session(employee_id);
create index if not exists idx_wellbeing_session_date on wellbeing_session(created_at);

-- Create table for wellbeing messages
create table if not exists wellbeing_message (
  id uuid not null default gen_random_uuid() primary key,
  session_id uuid not null references wellbeing_session(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  timestamp timestamp with time zone default now() not null
);

-- Create index for quickly retrieving messages by session
create index if not exists idx_wellbeing_message_session on wellbeing_message(session_id);
create index if not exists idx_wellbeing_message_timestamp on wellbeing_message(timestamp);

-- Set up Row Level Security (RLS)
alter table wellbeing_session enable row level security;
alter table wellbeing_message enable row level security;

-- Create policies for wellbeing_session
create policy "Users can view their own sessions"
  on wellbeing_session
  for select
  using (auth.uid() = employee_id::uuid or 
         exists (select 1 from employee where e_id = wellbeing_session.employee_id and e_role = 'HR'));

create policy "Users can insert their own sessions"
  on wellbeing_session
  for insert
  with check (auth.uid() = employee_id::uuid);

create policy "Users can update their own sessions"
  on wellbeing_session
  for update
  using (auth.uid() = employee_id::uuid or 
         exists (select 1 from employee where e_id = wellbeing_session.employee_id and e_role = 'HR'));

-- Create policies for wellbeing_message
create policy "Users can view messages from their sessions"
  on wellbeing_message
  for select
  using (exists (
    select 1 from wellbeing_session 
    where wellbeing_session.id = wellbeing_message.session_id and 
    (wellbeing_session.employee_id::uuid = auth.uid() or
     exists (select 1 from employee where e_id = wellbeing_session.employee_id and e_role = 'HR'))
  ));

create policy "Users can insert messages to their sessions"
  on wellbeing_message
  for insert
  with check (exists (
    select 1 from wellbeing_session 
    where wellbeing_session.id = wellbeing_message.session_id and 
    wellbeing_session.employee_id::uuid = auth.uid()
  ));
