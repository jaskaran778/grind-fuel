"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
// Create a global variable to handle cart state
let globalCartOpen = false;

export default function Cart() {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState([]);
  const cartRef = useRef(null);
  const router = useRouter();

  // Load cart items when component mounts or cart data changes
  useEffect(() => {
    const loadCartItems = () => {
      try {
        const cart = JSON.parse(localStorage.getItem("grindFuelCart") || "[]");
        console.log("Loading cart items:", cart);
        setItems(cart);
      } catch (err) {
        console.error("Error loading cart:", err);
        setItems([]);
      }
    };

    // Load items initially
    loadCartItems();

    // Handle direct cart toggle
    const handleToggleCart = () => {
      console.log("Toggle cart event received");
      setIsOpen((prev) => !prev);
    };

    // Handle open cart request
    const handleOpenCart = () => {
      console.log("Open cart event received");
      setIsOpen(true);
    };

    // Handle cart storage updates
    const handleStorageChange = () => {
      console.log("Storage change detected");
      loadCartItems();
    };

    // Add all event listeners
    window.addEventListener("toggleCart", handleToggleCart);
    window.addEventListener("openCart", handleOpenCart);
    window.addEventListener("cartUpdated", handleStorageChange);

    // On mount, check URL for 'cart=open' param to open cart
    if (
      typeof window !== "undefined" &&
      window.location.search.includes("cart=open")
    ) {
      setIsOpen(true);
    }

    return () => {
      window.removeEventListener("toggleCart", handleToggleCart);
      window.removeEventListener("openCart", handleOpenCart);
      window.removeEventListener("cartUpdated", handleStorageChange);
    };
  }, []);

  // Handle cart animation with CSS transitions
  useEffect(() => {
    if (cartRef.current) {
      if (isOpen) {
        cartRef.current.style.transform = "translateX(0)";
      } else {
        cartRef.current.style.transform = "translateX(100%)";
      }
    }
  }, [isOpen]);

  // Update quantity of an item
  const updateQuantity = (id, newQuantity) => {
    const updatedItems = items
      .map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
      .filter((item) => item.quantity > 0);

    setItems(updatedItems);
    localStorage.setItem("grindFuelCart", JSON.stringify(updatedItems));

    // Dispatch custom event for cart updates
    window.dispatchEvent(new CustomEvent("cartUpdated"));
  };

  // Calculate total price
  const totalPrice = items.reduce((sum, item) => {
    const price =
      typeof item.price === "number"
        ? item.price
        : parseFloat((item.price || "0").toString().replace(/[^0-9.]/g, ""));
    return sum + price * item.quantity;
  }, 0);

  const removeFromCart = async (productId) => {
    const newCart = items.filter((item) => item.id !== productId);
    setItems(newCart);

    // Save to localStorage
    localStorage.setItem("grindFuelCart", JSON.stringify(newCart));

    // Update in Supabase
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("carts").upsert({
        user_id: user.id,
        products: newCart,
        updated_at: new Date(),
      });
    }
  };

  const proceedToCheckout = () => {
    // Save cart to local storage for checkout page
    localStorage.setItem("grindFuelCart", JSON.stringify(items));
    router.push("/checkout");
  };

  return (
    <div
      ref={cartRef}
      className="fixed top-0 right-0 w-[350px] md:w-[400px] h-full bg-black border-l border-[#16db65]/30 z-103 shadow-2xl transition-transform duration-300 ease-in-out"
      style={{ transform: "translateX(100%)" }}
    >
      <div className="h-full flex flex-col p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Your Cart</h2>
          <button
            className="text-white hover:text-[#16db65]"
            onClick={() => setIsOpen(false)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Cart items */}
        {items.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center">
            <svg
              className="w-16 h-16 text-gray-600 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <p className="text-gray-400 text-center">Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="flex-grow overflow-y-auto space-y-4 mb-6 scrollbar-hide">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex border-b border-gray-800 pb-4"
                >
                  <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0 bg-gray-800">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name || "Product image"}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/images/placeholder.png";
                          e.currentTarget.onerror = null;
                        }}
                      />
                    )}
                    {!item.image && (
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                        <span className="text-gray-500 text-xs">No image</span>
                      </div>
                    )}
                  </div>
                  <div className="ml-4 flex-grow">
                    <h3 className="text-white font-medium">{item.name}</h3>
                    <p className="text-gray-400 text-sm">
                      ₹
                      {typeof item.price === "number"
                        ? item.price
                        : parseFloat(
                            (item.price || "0")
                              .toString()
                              .replace(/[^0-9.]/g, "")
                          )}
                    </p>
                    <div className="flex items-center mt-2">
                      <button
                        className="w-6 h-6 bg-gray-800 text-white flex items-center justify-center rounded-full"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        -
                      </button>
                      <span className="mx-2 text-white">{item.quantity}</span>
                      <button
                        className="w-6 h-6 bg-gray-800 text-white flex items-center justify-center rounded-full"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between items-end">
                    <button
                      onClick={() => updateQuantity(item.id, 0)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                    <span className="text-[#16db65] font-medium">
                      ₹
                      {(typeof item.price === "number"
                        ? item.price
                        : parseFloat(
                            (item.price || "0")
                              .toString()
                              .replace(/[^0-9.]/g, "")
                          )) * item.quantity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-800 pt-4">
              <div className="flex justify-between mb-4">
                <span className="text-gray-400">Subtotal</span>
                <span className="text-white font-medium">₹{totalPrice}</span>
              </div>
              <button
                className="w-full bg-[#16db65] text-black py-3 rounded-md font-bold hover:bg-opacity-90 transition-colors"
                onClick={proceedToCheckout}
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </div>

      <style jsx global>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        /* Hide scrollbar for IE, Edge and Firefox */
        .scrollbar-hide {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
    </div>
  );
}
