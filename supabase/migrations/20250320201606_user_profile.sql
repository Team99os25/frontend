-- Create a table for employee data
create table employee (
  id uuid not null default gen_random_uuid() primary key,
  e_name text not null,
  e_role text not null,
  email text not null unique,
  e_password text not null
);

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/database/postgres/row-level-security for more details.
alter table employee
    enable row level security;

create policy "Allow all users to insert their own data."
    on employee
    for insert
    with check (true);

create policy "Allow everyone to view employee data"
    on employee
    for select
    using (true);

--HR can update the data of the employees
create policy "HR can update employee data"
    on employee
    for update
    using (e_role = 'HR');