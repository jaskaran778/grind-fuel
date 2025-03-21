import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = headers();
  const signature = headersList.get("stripe-signature") || "";

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session;

      // Update order status in database
      if (session.metadata?.orderId) {
        await supabase
          .from("orders")
          .update({
            status: "paid",
            updated_at: new Date(),
          })
          .eq("id", session.metadata.orderId);

        // Clear the user's cart
        const paymentIntent = await stripe.paymentIntents.retrieve(
          session.payment_intent as string
        );

        if (paymentIntent.metadata?.userId) {
          await supabase
            .from("carts")
            .update({
              products: [],
              updated_at: new Date(),
            })
            .eq("user_id", paymentIntent.metadata.userId);
        }
      }
      break;

    case "payment_intent.payment_failed":
      const failedPaymentIntent = event.data.object as Stripe.PaymentIntent;

      // Update order status to failed
      if (failedPaymentIntent.metadata?.orderId) {
        await supabase
          .from("orders")
          .update({
            status: "failed",
            updated_at: new Date(),
          })
          .eq("id", failedPaymentIntent.metadata.orderId);
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
