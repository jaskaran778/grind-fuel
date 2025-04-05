-- Simple function to create users table
CREATE OR REPLACE FUNCTION create_users_table_simple()
RETURNS void AS $$
BEGIN
  -- Create users table if it doesn't exist
  CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
  );
  
  -- Set up Row Level Security (RLS)
  ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION create_users_table_simple TO anon, authenticated, service_role; 