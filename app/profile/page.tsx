"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Navbar from "@/components/navbar";
import { motion } from "framer-motion";
import { User } from "@supabase/supabase-js";
import Link from "next/link";

// Define types for orders and products
interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  user_id: string;
  products: Product[];
  total: number;
  status: string;
  created_at: string;
  shipping_address?: any;
}

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState("orders");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Check for authentication changes (like sign-out)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_OUT" || !session) {
          // Redirect to home when signed out
          router.push("/");
        }
      }
    );

    const checkUser = async () => {
      try {
        const { data } = await supabase.auth.getUser();

        if (!data.user) {
          // Redirect to home if not logged in
          router.push("/");
          return;
        }

        setUser(data.user);

        // Fetch user's orders
        const { data: ordersData, error } = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", data.user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setOrders(ordersData || []);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Cleanup auth listener on unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    if (
      !window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setIsDeleting(true);
      setDeleteError("");

      const response = await fetch("/api/delete-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete account");
      }

      // Sign out and redirect to home
      await supabase.auth.signOut();
      router.push("/");
    } catch (error: any) {
      console.error("Error deleting account:", error);
      setDeleteError(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="container mx-auto py-32 px-4 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#16db65] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <p className="text-xl text-gray-300">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="container mx-auto py-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          {/* Profile Header */}
          <div className="mb-10 relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-900 to-black p-6 border border-gray-800">
            {/* Abstract background elements */}
            <div className="absolute -right-20 -top-20 w-40 h-40 rounded-full bg-[#16db65]/5 filter blur-xl"></div>
            <div className="absolute -left-10 -bottom-10 w-60 h-60 rounded-full bg-[#16db65]/5 filter blur-xl"></div>

            <div className="relative flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* User Avatar */}
              <div className="flex-shrink-0 w-24 h-24 rounded-full bg-[#16db65] flex items-center justify-center text-black text-4xl font-bold relative overflow-hidden border-4 border-gray-800 shadow-lg shadow-[#16db65]/10">
                {user?.email?.charAt(0).toUpperCase()}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 opacity-50"></div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl md:text-3xl font-bold mb-2 text-white">
                  {user?.email?.split("@")[0]}
                </h1>
                <p className="text-gray-400 mb-4">{user?.email}</p>

                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <div className="px-3 py-1 bg-gray-800 rounded-full text-xs text-[#16db65] border border-[#16db65]/30">
                    Member since{" "}
                    {new Date(
                      user?.created_at || Date.now()
                    ).toLocaleDateString()}
                  </div>
                  <div className="px-3 py-1 bg-gray-800 rounded-full text-xs text-[#16db65] border border-[#16db65]/30">
                    {orders.length} Orders
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="mb-8 border-b border-gray-800">
            <div className="flex overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveTab("orders")}
                className={`px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === "orders"
                    ? "border-[#16db65] text-[#16db65]"
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                Order History
              </button>
              <button
                onClick={() => setActiveTab("account")}
                className={`px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === "account"
                    ? "border-[#16db65] text-[#16db65]"
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                Account Settings
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 backdrop-blur-sm">
            {activeTab === "orders" && (
              <div className="p-6">
                <h2 className="text-xl font-bold mb-6 text-[#16db65]">
                  Your Orders
                </h2>

                {orders.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 opacity-30">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-400 mb-4">
                      You haven't placed any orders yet.
                    </p>
                    <Link
                      href="/products"
                      className="inline-block px-6 py-2 bg-[#16db65] text-black font-medium rounded-lg hover:bg-[#16db65]/90 transition-colors"
                    >
                      Shop Now
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="p-4 bg-black/50 rounded-lg border border-gray-800 hover:border-[#16db65]/50 transition-colors"
                      >
                        <div className="flex flex-col md:flex-row justify-between mb-4">
                          <div>
                            <p className="text-gray-400 text-xs mb-1">
                              Order ID
                            </p>
                            <p className="font-mono text-sm">{order.id}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-xs mb-1">Date</p>
                            <p className="font-mono text-sm">
                              {new Date(order.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-xs mb-1">Status</p>
                            <span
                              className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                order.status === "paid"
                                  ? "bg-green-900/50 text-green-400 border border-green-800/50"
                                  : order.status === "pending"
                                  ? "bg-yellow-900/50 text-yellow-400 border border-yellow-800/50"
                                  : "bg-red-900/50 text-red-400 border border-red-800/50"
                              }`}
                            >
                              {order.status.charAt(0).toUpperCase() +
                                order.status.slice(1)}
                            </span>
                          </div>
                          <div>
                            <p className="text-gray-400 text-xs mb-1">Total</p>
                            <p className="font-medium text-[#16db65]">
                              ₹{order.total}
                            </p>
                          </div>
                        </div>

                        <div className="border-t border-gray-800 pt-4 mt-4">
                          <p className="text-gray-400 text-xs mb-2">Products</p>
                          <div className="space-y-2">
                            {order.products.map((product, index) => (
                              <div
                                key={index}
                                className="flex justify-between items-center"
                              >
                                <div className="flex items-center">
                                  <span className="w-6 h-6 flex items-center justify-center bg-gray-800 rounded-full text-xs mr-2">
                                    {product.quantity}
                                  </span>
                                  <span className="text-sm">
                                    {product.name}
                                  </span>
                                </div>
                                <span className="text-sm">
                                  ₹{product.price * product.quantity}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "account" && (
              <div className="p-6">
                <h2 className="text-xl font-bold mb-6 text-[#16db65]">
                  Account Settings
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-white"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Email cannot be changed
                    </p>
                  </div>

                  {/* Danger Zone */}
                  <div className="mt-12 pt-6 border-t border-gray-800">
                    <h3 className="text-lg font-medium text-red-500 mb-4">
                      Danger Zone
                    </h3>

                    {deleteError && (
                      <div className="mb-4 p-3 bg-red-900/50 border border-red-800 rounded-lg text-red-300 text-sm">
                        {deleteError}
                      </div>
                    )}

                    <button
                      onClick={handleSignOut}
                      className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors mr-4"
                    >
                      Sign Out
                    </button>

                    <button
                      onClick={handleDeleteAccount}
                      disabled={isDeleting}
                      className={`px-4 py-2 ${
                        isDeleting
                          ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                          : "bg-red-900/50 hover:bg-red-900 text-red-300 border border-red-800"
                      } rounded-lg transition-colors`}
                    >
                      {isDeleting ? "Deleting..." : "Delete Account"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
