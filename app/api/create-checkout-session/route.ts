import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
  try {
    // Hardcode the base URL for now - this is a temporary fix
    // In production, you'd want to use environment variables or request headers
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    const body = await request.json();
    const { orderId, items, userId, shippingDetails } = body;

    console.log("Creating checkout session with:", {
      orderId,
      itemsCount: items.length,
      userId,
    });

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Invalid items data" },
        { status: 400 }
      );
    }

    // Get the order from Supabase
    const { data: order, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Create line items for Stripe - REMOVE IMAGES to avoid URL issues
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
          // Remove images to avoid URL issues
          description: item.description || "",
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents/paise
      },
      quantity: item.quantity,
    }));

    // Add shipping cost
    lineItems.push({
      price_data: {
        currency: "inr",
        product_data: {
          name: "Shipping",
          description: "Standard shipping",
        },
        unit_amount: 41500, // 415 INR
      },
      quantity: 1,
    });

    console.log(
      "Success URL:",
      `${baseUrl}/order-success?session_id={CHECKOUT_SESSION_ID}`
    );
    console.log("Cancel URL:", `${baseUrl}/checkout`);

    // Create Stripe checkout session with customer details
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${baseUrl}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout`,
      customer_email: shippingDetails?.email || undefined,
      shipping_address_collection: {
        allowed_countries: ["IN", "US", "CA", "GB"], // Add other countries as needed
      },
      billing_address_collection: "required",
      payment_intent_data: {
        capture_method: "automatic",
        setup_future_usage: "off_session",
      },
      metadata: {
        orderId: orderId,
        userId: userId,
      },
    });

    console.log("Session created:", session.id);
    return NextResponse.json({ id: session.id });
  } catch (err: any) {
    console.error("Error creating checkout session:", err);
    // Return detailed error for debugging
    return NextResponse.json(
      {
        error: err.message || "An error occurred",
        stack: err.stack,
        name: err.name,
      },
      { status: 500 }
    );
  }
}
