"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import Link from "next/link";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

// Define interfaces for type safety
interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  user_id: string;
  user_email?: string;
  products: Product[];
  total: number;
  status: string;
  created_at: string;
  shipping_address?: any;
}

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<{ [key: string]: { email: string } }>({}); // Cache for user emails
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");
  const [updateLoading, setUpdateLoading] = useState<string | null>(null);
  const router = useRouter();

  // Verify user is authenticated and has admin role
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user is logged in
        const { data } = await supabase.auth.getUser();

        if (!data.user) {
          router.push("/");
          return;
        }

        setIsAuthenticated(true);

        // Only allow access to a specific admin user ID
        const ADMIN_USER_ID = "48310edf-ea76-4109-9b32-e7700002e4ca";

        if (data.user.id === ADMIN_USER_ID) {
          setIsAdmin(true);
          fetchOrders();
        } else {
          // Not the admin, redirect to home
          console.log("Access denied: Not the admin user");
          router.push("/");
        }
      } catch (error) {
        console.error("Authentication error:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Function to ensure products field is properly parsed
  const parseProducts = (order: any): Order => {
    let parsedProducts = [];

    try {
      // If products is a string, try to parse it
      if (typeof order.products === "string") {
        try {
          parsedProducts = JSON.parse(order.products);
        } catch (e) {
          console.warn("Failed to parse products string:", order.products);
          parsedProducts = [];
        }
      }
      // If products is already an array, use it
      else if (Array.isArray(order.products)) {
        parsedProducts = order.products;
      }
      // If products is an object but not an array, wrap it in an array
      else if (order.products && typeof order.products === "object") {
        parsedProducts = [order.products];
      }
    } catch (err) {
      console.error("Error parsing products:", err);
      parsedProducts = [];
    }

    return {
      ...order,
      products: parsedProducts,
    };
  };

  // Fetch all orders from the database
  const fetchOrders = async () => {
    try {
      setLoading(true);
      console.log("Fetching orders via API...");

      // Get current user for admin verification
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error("User not authenticated");
      }

      // Use our dedicated API endpoint to fetch properly processed orders
      const response = await fetch("/api/admin/fetch-orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adminId: userData.user.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch orders");
      }

      const data = await response.json();
      console.log(`Received ${data.count} orders from API`);

      // If no orders exist yet, use empty array
      if (!data.orders || data.orders.length === 0) {
        setOrders([]);
        setLoading(false);
        return;
      }

      const ordersData = data.orders;

      // Create a simple map of user emails (we'll fetch proper ones later)
      const userEmails: { [key: string]: { email: string } } = {};

      // Process orders without waiting for user emails first
      const ordersWithPlaceholderEmails = ordersData.map((order: Order) => ({
        ...order,
        user_email: "Loading...", // Placeholder
      }));

      // Update UI immediately with placeholder emails
      setOrders(ordersWithPlaceholderEmails);

      // Fetch user emails for each order
      const userIds = [...new Set(ordersData.map((order) => order.user_id))];
      console.log("Unique user IDs:", userIds.length);

      // Get user data for each unique user ID using our API endpoint
      for (const userId of userIds) {
        try {
          const response = await fetch("/api/admin/get-user", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: userId,
              adminId: userData.user.id, // For verification
            }),
          });

          if (response.ok) {
            const user = await response.json();
            userEmails[userId] = { email: user.email || "Unknown" };
          } else {
            userEmails[userId] = { email: "Unknown" };
          }
        } catch (err) {
          console.warn(`Could not fetch user ${userId}:`, err);
          userEmails[userId] = { email: "Unknown" };
        }
      }

      // Update orders with actual user emails
      const ordersWithUserEmails = ordersData.map((order: Order) => ({
        ...order,
        user_email: userEmails[order.user_id]?.email || "Unknown",
      }));

      console.log("Final processed orders:", ordersWithUserEmails.length);
      setOrders(ordersWithUserEmails);
      setUsers(userEmails);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]); // Set empty array in case of error
    } finally {
      setLoading(false);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      setUpdateLoading(orderId);

      const { error } = await supabase
        .from("orders")
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      if (error) throw error;

      // Update local state
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      // In a real app, you would notify the user here
      // await notifyUser(orderId, newStatus);
    } catch (error) {
      console.error("Error updating order status:", error);
    } finally {
      setUpdateLoading(null);
    }
  };

  // Filter and sort orders
  const filteredOrders = orders.filter((order) => {
    console.log(
      "Filtering order:",
      order.id,
      "Status:",
      order.status,
      "Search term:",
      searchTerm
    );

    const searchIncludes = searchTerm
      ? order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.products &&
          Array.isArray(order.products) &&
          order.products.some(
            (p) =>
              p.name && p.name.toLowerCase().includes(searchTerm.toLowerCase())
          ))
      : true;

    const statusMatches = statusFilter ? order.status === statusFilter : true;

    const shouldInclude = searchIncludes && statusMatches;
    if (!shouldInclude) {
      console.log(
        "Order filtered out:",
        order.id,
        "searchIncludes:",
        searchIncludes,
        "statusMatches:",
        statusMatches
      );
    }

    return shouldInclude;
  });

  console.log(
    "Total orders:",
    orders.length,
    "Filtered orders:",
    filteredOrders.length
  );

  // Sort orders based on current sort setting
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    try {
      switch (sortBy) {
        case "date-asc":
          return (
            new Date(a.created_at || 0).getTime() -
            new Date(b.created_at || 0).getTime()
          );
        case "date-desc":
          return (
            new Date(b.created_at || 0).getTime() -
            new Date(a.created_at || 0).getTime()
          );
        case "total-asc":
          return (a.total || 0) - (b.total || 0);
        case "total-desc":
          return (b.total || 0) - (a.total || 0);
        default:
          return (
            new Date(b.created_at || 0).getTime() -
            new Date(a.created_at || 0).getTime()
          );
      }
    } catch (err) {
      console.error("Error sorting orders:", err);
      return 0;
    }
  });

  // Handle signout
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#16db65] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-xl text-gray-300">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md p-8 bg-gray-900 rounded-xl border border-gray-800">
          <h1 className="text-2xl font-bold text-red-500 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-300 mb-6">
            You don't have permission to access the admin panel.
          </p>
          <Link
            href="/"
            className="px-6 py-2 bg-[#16db65] text-black font-medium rounded-lg inline-block"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  // Admin panel
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Admin navbar */}
      <nav className="bg-gray-900 border-b border-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            {/* <div className="w-10 h-10 rounded-md bg-[#16db65] flex items-center justify-center text-black font-bold">
              A
            </div> */}
            <img src="/admin.svg" alt="Logo" className="w-10 h-10" />
            <h1 className="text-xl font-bold">Admin Panel</h1>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="text-gray-300 hover:text-[#16db65] transition-colors"
            >
              View Site
            </Link>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#16db65] mb-2">
              Order Management
            </h1>
            <p className="text-gray-400">View and manage all customer orders</p>
          </div>

          {/* Filters and search */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Search</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by ID, email, product..."
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16db65] text-white"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Filter by Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16db65] text-white"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16db65] text-white"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="total-desc">Highest Amount</option>
                <option value="total-asc">Lowest Amount</option>
              </select>
            </div>
          </div>

          {/* Orders table */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-black/50">
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Products
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {sortedOrders.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-6 px-4 text-center text-gray-400"
                      >
                        {orders.length === 0
                          ? "No orders found in the database"
                          : `No orders found matching your filters (${orders.length} total orders in database)`}
                      </td>
                    </tr>
                  ) : (
                    sortedOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="hover:bg-black/30 transition-colors"
                      >
                        <td className="py-4 px-4 whitespace-nowrap font-mono text-sm text-gray-300">
                          {order.id.slice(0, 8)}...
                        </td>
                        <td className="py-4 px-4">
                          {order.user_email || "Unknown"}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex flex-col space-y-1">
                            {order.products &&
                            Array.isArray(order.products) &&
                            order.products.length > 0 ? (
                              <>
                                {order.products
                                  .slice(0, 2)
                                  .map((product, idx) => (
                                    <div
                                      key={idx}
                                      className="text-sm text-gray-300"
                                    >
                                      {product?.name || "Unnamed Product"}
                                      {product?.quantity
                                        ? `x${product.quantity}`
                                        : ""}
                                    </div>
                                  ))}
                                {order.products.length > 2 && (
                                  <div className="text-xs text-gray-500">
                                    +{order.products.length - 2} more items
                                  </div>
                                )}
                              </>
                            ) : (
                              <div className="text-sm text-gray-500">
                                No product details
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4 font-medium text-[#16db65]">
                          ₹{order.total}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-400">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              order.status === "pending"
                                ? "bg-yellow-900/30 text-yellow-400 border border-yellow-800/50"
                                : order.status === "paid"
                                ? "bg-green-900/30 text-green-400 border border-green-800/50"
                                : order.status === "shipped"
                                ? "bg-blue-900/30 text-blue-400 border border-blue-800/50"
                                : order.status === "delivered"
                                ? "bg-purple-900/30 text-purple-400 border border-purple-800/50"
                                : "bg-red-900/30 text-red-400 border border-red-800/50"
                            }`}
                          >
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <select
                            value={order.status}
                            onChange={(e) =>
                              updateOrderStatus(order.id, e.target.value)
                            }
                            disabled={updateLoading === order.id}
                            className="w-full px-2 py-1 bg-gray-900 border border-gray-700 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#16db65] text-white"
                          >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="failed">Failed</option>
                          </select>
                          {updateLoading === order.id && (
                            <div className="w-4 h-4 border-2 border-[#16db65] border-t-transparent rounded-full animate-spin mt-2 mx-auto"></div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Orders summary */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
              <div className="text-gray-400 text-sm mb-1">Total Orders</div>
              <div className="text-2xl font-bold text-white">
                {orders.length}
              </div>
            </div>

            <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
              <div className="text-gray-400 text-sm mb-1">Pending Orders</div>
              <div className="text-2xl font-bold text-yellow-400">
                {orders.filter((o) => o.status === "pending").length}
              </div>
            </div>

            <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
              <div className="text-gray-400 text-sm mb-1">Delivered Orders</div>
              <div className="text-2xl font-bold text-purple-400">
                {orders.filter((o) => o.status === "delivered").length}
              </div>
            </div>

            <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
              <div className="text-gray-400 text-sm mb-1">
                Revenue (Paid Orders)
              </div>
              <div className="text-2xl font-bold text-[#16db65]">
                ₹
                {orders
                  .filter(
                    (o) =>
                      o.status === "paid" ||
                      o.status === "shipped" ||
                      o.status === "delivered"
                  )
                  .reduce((sum, order) => sum + order.total, 0)}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
