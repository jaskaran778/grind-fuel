import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Simple helper for getting user by ID with service role
export async function getUserById(userId: string) {
  try {
    const { data, error } = await supabase.auth.admin.getUserById(userId);

    if (error) {
      console.error("Error getting user:", error);
      return null;
    }

    return data.user;
  } catch (err) {
    console.error("Error in getUserById:", err);
    return null;
  }
}

export async function GET() {
  try {
    // Check if the users table exists
    const { error: checkError } = await supabase
      .from("users")
      .select("id")
      .limit(1);

    // If table doesn't exist, create it directly via SQL
    if (checkError && checkError.message.includes("does not exist")) {
      // Create users table directly with SQL
      const { error: createTableError } = await supabase.rpc("exec_sql", {
        sql_string: `
            CREATE TABLE IF NOT EXISTS public.users (
              id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
              email TEXT NOT NULL,
              role TEXT NOT NULL DEFAULT 'user',
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
            );
            
            -- Set up Row Level Security (RLS)
            ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
            
            -- Create policies
            DO $$ 
            BEGIN
              IF NOT EXISTS (
                SELECT FROM pg_policies WHERE tablename = 'users' AND policyname = 'Users can view their own data'
              ) THEN
                CREATE POLICY "Users can view their own data" ON public.users
                  FOR SELECT USING (auth.uid() = id);
              END IF;
              
              IF NOT EXISTS (
                SELECT FROM pg_policies WHERE tablename = 'users' AND policyname = 'Admin users can view all data'
              ) THEN
                CREATE POLICY "Admin users can view all data" ON public.users
                  FOR SELECT USING (
                    EXISTS (
                      SELECT 1 FROM public.users 
                      WHERE id = auth.uid() AND role = 'admin'
                    )
                  );
              END IF;
            END $$;
          `,
      });

      if (createTableError) {
        // If the RPC function doesn't exist or fails, try simpler approach
        console.warn(
          "RPC function for SQL execution failed, trying direct SQL query",
          createTableError
        );

        // This is a simpler approach that might work in more environments
        const { error: directSqlError } = await supabase.rpc(
          "create_users_table_simple",
          {}
        );

        if (directSqlError) {
          console.warn(
            "All SQL approaches failed, will try to continue anyway",
            directSqlError
          );
        }
      }
    }

    // Get current authenticated user
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (!data.user) {
      return NextResponse.json({ error: "No user found" }, { status: 404 });
    }

    // For this implementation, we'll make the specified user an admin
    // This is for demonstration purposes only
    const ADMIN_USER_ID = "48310edf-ea76-4109-9b32-e7700002e4ca";
    let isAdmin = data.user.id === ADMIN_USER_ID;

    try {
      // Try to check if user exists in users table
      const { data: existingUser, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", data.user.id)
        .single();

      if (userError && userError.message.includes("No rows found")) {
        // User doesn't exist in the users table, try to insert
        const { error: insertError } = await supabase.from("users").insert({
          id: data.user.id,
          email: data.user.email,
          role: "admin", // Make every user an admin for this demo
        });

        if (insertError) {
          console.warn("Could not insert user into users table", insertError);
        }
      }
    } catch (err) {
      console.warn("Error checking/creating user", err);
    }

    return NextResponse.json({
      success: true,
      isAdmin: isAdmin,
      user: {
        id: data.user.id,
        email: data.user.email,
        role: "admin", // For simplicity, we'll just return admin as the role
      },
    });
  } catch (err: any) {
    console.error("Error setting up admin:", err);
    return NextResponse.json(
      { error: err.message || "An error occurred" },
      { status: 500 }
    );
  }
}
