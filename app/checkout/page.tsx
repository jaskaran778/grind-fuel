"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Navbar from "@/components/navbar";
import { loadStripe } from "@stripe/stripe-js";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

export default function Checkout() {
  const [cart, setCart] = useState([]);
  const [shippingDetails, setShippingDetails] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Get cart from localStorage
    const storedCart = localStorage.getItem("grindFuelCart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    } else {
      router.push("/products");
    }
  }, [router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("Please log in to complete your purchase");
        setLoading(false);
        return;
      }

      // Create order in Supabase
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          products: cart,
          total: calculateTotal(),
          shipping_address: shippingDetails,
          status: "pending",
        })
        .select()
        .single();

      if (orderError) {
        throw new Error(orderError.message);
      }

      // Create Stripe checkout session
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: orderData.id,
          items: cart.map((item) => ({
            ...item,
            price: item.price * 83, // Convert to rupees
          })),
          userId: user.id,
          shippingDetails: shippingDetails,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Checkout session creation failed:", data);
        throw new Error(data.error || "Failed to create checkout session");
      }

      if (!data.id) {
        throw new Error("Invalid session data received from server");
      }

      console.log("Redirecting to Stripe checkout with session ID:", data.id);

      // Redirect to Stripe checkout
      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe failed to load");

      const { error } = await stripe.redirectToCheckout({
        sessionId: data.id,
      });

      if (error) {
        console.error("Stripe redirect error:", error);
        throw new Error(error.message);
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError(err.message || "An error occurred during checkout");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="container mx-auto py-16 px-4">
        <h1 className="text-4xl font-bold mb-10 text-transparent bg-clip-text bg-[#16db65]">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Shipping Details Form */}
          <div className="bg-gray-900 p-8 rounded-xl">
            <h2 className="text-2xl font-bold mb-6 text-[#16db65]">
              Shipping Details
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={shippingDetails.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16db65]"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={shippingDetails.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16db65]"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={shippingDetails.address}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16db65]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={shippingDetails.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16db65]"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">
                    State/Province
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={shippingDetails.state}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16db65]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-1">
                    ZIP/Postal Code
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={shippingDetails.zipCode}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16db65]"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">Country</label>
                  <select
                    name="country"
                    value={shippingDetails.country}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16db65]"
                  >
                    <option value="IND">India</option>
                    {/* <option value="USA">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="AU">Australia</option> */}
                  </select>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-900/50 border border-red-800 rounded-lg text-red-300">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full mt-6 py-3 rounded-lg font-bold ${
                  loading
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-[#16db65] hover:bg-[#16db65] text-black"
                }`}
              >
                {loading ? "Processing..." : "Complete Purchase"}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-900 p-8 rounded-xl">
            <h2 className="text-2xl font-bold mb-6 text-[#16db65]">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between pb-4 border-b border-gray-800"
                >
                  <div>
                    <span className="font-medium text-white">{item.name}</span>
                    <p className="text-sm text-gray-400">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="font-bold text-[#16db65]">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-800">
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span className="font-medium">
                  ${calculateTotal().toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Shipping</span>
                <span className="font-medium">$5.00</span>
              </div>
              <div className="flex justify-between mb-6">
                <span>Tax (8%)</span>
                <span className="font-medium">
                  ${(calculateTotal() * 0.08).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-xl">
                <span className="font-bold">Total</span>
                <span className="font-bold text-[#16db65]">
                  ${(calculateTotal() + 5 + calculateTotal() * 0.08).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
