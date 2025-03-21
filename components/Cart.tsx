"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Create a global variable to handle cart state
let globalCartOpen = false;

export default function Cart() {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState([]);
  const cartRef = useRef(null);
  const router = useRouter();

  // Load cart items when component mounts
  useEffect(() => {
    // Create a function to load cart items from localStorage
    const loadCartItems = () => {
      console.log("Loading cart items");
      const cart = JSON.parse(localStorage.getItem("grindFuelCart") || "[]");
      setItems(cart);
    };

    // Load items initially
    loadCartItems();

    // Function to handle storage events (for when cart is updated)
    const handleStorageUpdate = () => {
      console.log("Storage updated");
      loadCartItems();
    };

    // Function to toggle cart visibility
    const toggleCart = (e) => {
      console.log("Toggle cart event received");
      globalCartOpen = !globalCartOpen;
      setIsOpen(globalCartOpen);
    };

    // Function to open cart
    const openCart = () => {
      console.log("Open cart event received");
      globalCartOpen = true;
      setIsOpen(true);
    };

    // Add event listeners
    window.addEventListener("storage", handleStorageUpdate);
    window.addEventListener("toggleCart", toggleCart);
    window.addEventListener("openCart", openCart);

    // Clean up
    return () => {
      window.removeEventListener("storage", handleStorageUpdate);
      window.removeEventListener("toggleCart", toggleCart);
      window.removeEventListener("openCart", openCart);
    };
  }, []);

  // Handle cart animation
  useEffect(() => {
    console.log("Cart isOpen state:", isOpen);
    if (cartRef.current) {
      if (isOpen) {
        console.log("Opening cart with GSAP");
        gsap.to(cartRef.current, {
          x: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      } else {
        console.log("Closing cart with GSAP");
        gsap.to(cartRef.current, {
          x: "100%",
          duration: 0.3,
          ease: "power2.in",
        });
      }
    }
  }, [isOpen]);

  const updateQuantity = (id, newQuantity) => {
    const updatedItems = items
      .map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
      .filter((item) => item.quantity > 0);

    setItems(updatedItems);
    localStorage.setItem("grindFuelCart", JSON.stringify(updatedItems));
    window.dispatchEvent(new Event("storage"));
  };

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

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  return (
    <div
      ref={cartRef}
      className="fixed top-0 right-0 w-[350px] md:w-[400px] h-full bg-black border-l border-[#16db65]/30 z-50 transform translate-x-full shadow-2xl"
      style={{ translateX: "100%" }}
    >
      <div className="h-full flex flex-col p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Your Cart</h2>
          <button
            className="text-white hover:text-[#16db65]"
            onClick={() => {
              console.log("Close button clicked");
              setIsOpen(false);
              globalCartOpen = false;
            }}
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
            <div className="flex-grow overflow-y-auto space-y-4 mb-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex border-b border-gray-800 pb-4"
                >
                  <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0 bg-gray-800">
                    {item.image && (
                      <div className="relative w-full h-full">
                        <img
                          src={item.image}
                          alt={item.name || "Product image"}
                          className="w-full h-full object-cover"
                        />
                      </div>
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
                      $
                      {typeof item.price === "number"
                        ? item.price
                        : parseFloat(item.price.replace("$", ""))}
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
                      $
                      {(typeof item.price === "number"
                        ? item.price
                        : parseFloat(item.price.replace("$", ""))) *
                        item.quantity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-800 pt-4">
              <div className="flex justify-between mb-4">
                <span className="text-gray-400">Subtotal</span>
                <span className="text-white font-medium">
                  ${calculateTotal().toFixed(2)}
                </span>
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
    </div>
  );
}
