import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// API route to get user data by ID (requires admin access)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, adminId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Verify that the requester is an admin
    const ADMIN_USER_ID = "48310edf-ea76-4109-9b32-e7700002e4ca";
    if (adminId !== ADMIN_USER_ID) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 403 }
      );
    }

    // Get user data using Supabase admin API
    const { data, error } = await supabase.auth.admin.getUserById(userId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data.user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return only the necessary user information
    return NextResponse.json({
      id: data.user.id,
      email: data.user.email,
      created_at: data.user.created_at,
    });
  } catch (err: any) {
    console.error("Error fetching user data:", err);
    return NextResponse.json(
      { error: err.message || "An error occurred" },
      { status: 500 }
    );
  }
}
