"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Navbar from "@/components/navbar";
import Link from "next/link";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

function OrderSuccessContent() {
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!sessionId) {
      router.push("/products");
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        // Verify session with backend
        const response = await fetch("/api/verify-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionId }),
        });

        const data = await response.json();

        if (data.order) {
          setOrderDetails(data.order);

          // Clear cart from localStorage
          localStorage.removeItem("grindFuelCart");
        } else {
          router.push("/products");
        }
      } catch (err) {
        console.error("Error fetching order details:", err);
        router.push("/products");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [sessionId, router]);

  if (loading) {
    return (
      <div className="container mx-auto py-32 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#16db65] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-xl text-gray-300">Loading your order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-16 px-4">
      <div className="max-w-2xl mx-auto bg-gray-900 p-8 rounded-xl">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-[#16db65] to-[#16db65] rounded-full flex items-center justify-center mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#16db65] to-[#16db65]">
            Order Confirmed!
          </h1>
          <p className="text-gray-300">
            Thank you for your purchase. Your order has been processed
            successfully.
          </p>
        </div>

        {orderDetails && (
          <div>
            <div className="border-t border-b border-gray-800 py-4 mb-6">
              <p className="text-gray-300 mb-1">Order ID:</p>
              <p className="font-mono font-medium text-[#16db65]">
                {orderDetails.id}
              </p>
            </div>

            <h2 className="text-xl font-bold mb-4 text-[#16db65]">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              {orderDetails.products.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <div>
                    <span className="font-medium text-white">{item.name}</span>
                    <p className="text-sm text-gray-400">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="font-bold text-[#16db65]">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-800 pt-4 mb-8">
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span className="font-medium">₹{orderDetails.total}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span>Shipping</span>
                <span className="font-medium">₹199</span>
              </div>
              <div className="flex justify-between text-xl">
                <span className="font-bold">Total</span>
                <span className="font-bold text-[#16db65]">
                  ₹{orderDetails.total + 199}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col items-center">
          <Link
            href="/products"
            className="inline-block bg-gradient-to-r from-[#16db65] to-[#16db65] hover:from-[#16db65] hover:to-[#16db65] text-white font-bold py-3 px-6 rounded-lg transition-all"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

// Loading fallback for the Suspense boundary
function OrderSuccessLoading() {
  return (
    <div className="container mx-auto py-32 px-4 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#16db65] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        <p className="text-xl text-gray-300">Preparing order information...</p>
      </div>
    </div>
  );
}

export default function OrderSuccess() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <Suspense fallback={<OrderSuccessLoading />}>
        <OrderSuccessContent />
      </Suspense>
    </div>
  );
}
