import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { adminId } = body;

    // Verify that the requester is an admin
    const ADMIN_USER_ID = "48310edf-ea76-4109-9b32-e7700002e4ca";
    if (adminId !== ADMIN_USER_ID) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 403 }
      );
    }

    // Fetch all orders
    const { data: orders, error } = await supabase.from("orders").select("*");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log(`Retrieved ${orders?.length || 0} orders from database`);

    // Process orders to ensure products are properly parsed
    const processedOrders = orders.map((order) => {
      let parsedProducts = [];

      try {
        // If products is a string, try to parse it
        if (typeof order.products === "string") {
          parsedProducts = JSON.parse(order.products);
        }
        // If products is already an array, use it
        else if (Array.isArray(order.products)) {
          parsedProducts = order.products;
        }
        // If products is an object but not an array, wrap it in an array
        else if (order.products && typeof order.products === "object") {
          parsedProducts = [order.products];
        }
      } catch (e) {
        console.warn(`Failed to parse products for order ${order.id}:`, e);
        parsedProducts = [];
      }

      return {
        ...order,
        products: parsedProducts,
      };
    });

    // Return processed orders
    return NextResponse.json({
      orders: processedOrders,
      count: processedOrders.length,
    });
  } catch (err: any) {
    console.error("Error fetching orders:", err);
    return NextResponse.json(
      { error: err.message || "An error occurred" },
      { status: 500 }
    );
  }
}
