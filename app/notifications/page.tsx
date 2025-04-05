"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Navbar from "@/components/navbar";
import { motion } from "framer-motion";
import { User } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

// Types for notifications
interface Notification {
  id: string;
  user_id: string;
  order_id: string;
  message: string;
  status: string;
  created_at: string;
  read: boolean;
}

export default function Notifications() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
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

    // Initial authentication check
    const checkUser = async () => {
      try {
        const { data } = await supabase.auth.getUser();

        if (!data.user) {
          // Redirect to home if not logged in
          router.push("/");
          return;
        }

        setUser(data.user);

        // Get user's orders to simulate notifications
        // In a real app, you would have a dedicated notifications table
        const { data: orders, error } = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", data.user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;

        // Create notifications from orders
        // This is a simulation - in production you'd have a real notifications table
        if (orders) {
          const mockNotifications = orders.map((order: any) => ({
            id: `notif-${order.id}`,
            user_id: order.user_id,
            order_id: order.id,
            message: `Your order #${order.id.slice(
              0,
              8
            )} status has been updated to ${order.status}`,
            status: order.status,
            created_at: order.created_at,
            read: false,
          }));

          setNotifications(mockNotifications);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "border-green-800/50 text-green-400 bg-green-900/20";
      case "pending":
        return "border-yellow-800/50 text-yellow-400 bg-yellow-900/20";
      case "shipped":
        return "border-blue-800/50 text-blue-400 bg-blue-900/20";
      case "delivered":
        return "border-purple-800/50 text-purple-400 bg-purple-900/20";
      case "failed":
        return "border-red-800/50 text-red-400 bg-red-900/20";
      default:
        return "border-gray-800/50 text-gray-400 bg-gray-900/20";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="container mx-auto py-32 px-4 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#16db65] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <p className="text-xl text-gray-300">
              Loading your notifications...
            </p>
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
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-[#16db65]">Notifications</h1>
            <p className="text-gray-400 mt-2">Stay updated on your orders</p>
          </div>

          <div className="bg-gray-900/50 rounded-xl border border-gray-800 backdrop-blur-sm overflow-hidden">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
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
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 01-6 0v-1m6 0H9"
                    />
                  </svg>
                </div>
                <p className="text-gray-400">
                  You don't have any notifications yet
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-800">
                {notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-4 hover:bg-gray-800/30 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-3">
                        <div
                          className={`mt-1 w-2 h-2 rounded-full bg-[#16db65] flex-shrink-0 ${
                            notification.read ? "opacity-0" : "opacity-100"
                          }`}
                        ></div>
                        <div>
                          <p className="text-gray-300">
                            {notification.message}
                          </p>
                          <div className="flex items-center mt-2 space-x-2">
                            <span
                              className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(
                                notification.status
                              )}`}
                            >
                              {notification.status.charAt(0).toUpperCase() +
                                notification.status.slice(1)}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(
                                notification.created_at
                              ).toLocaleDateString()}{" "}
                              at{" "}
                              {new Date(
                                notification.created_at
                              ).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
