-- This is a SQL function that will create the users table if it doesn't exist
-- You'll need to run this in the Supabase SQL Editor

create or replace function create_users_table()
returns void as $$
begin
  -- Check if the users table exists
  if not exists (
    select from information_schema.tables 
    where table_schema = 'public' and table_name = 'users'
  ) then
    -- Create the users table
    create table public.users (
      id uuid primary key references auth.users(id) on delete cascade,
      email text not null,
      role text not null default 'user',
      created_at timestamp with time zone default now() not null,
      updated_at timestamp with time zone default now() not null
    );

    -- Set up Row Level Security (RLS)
    alter table public.users enable row level security;

    -- Create policies
    create policy "Users can view their own data" 
      on public.users for select 
      using (auth.uid() = id);

    create policy "Admin users can view all data" 
      on public.users for select 
      using (
        exists (
          select 1 from public.users 
          where id = auth.uid() and role = 'admin'
        )
      );

    -- Allow public access to the RPC function
    grant execute on function create_users_table to anon, authenticated, service_role;
  end if;
end;
$$ language plpgsql;

-- Run the function to create the table
select create_users_table(); 