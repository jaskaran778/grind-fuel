"use client";
import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { createClient } from "@supabase/supabase-js";
import AuthModal from "./AuthModal";
import Image from "next/image";
import { User } from "@supabase/supabase-js";
import Link from "next/link";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

// Define section type for type safety
type Section = "home" | "about" | "products" | "policies" | "contact" | null;

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<Section>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [showSignOut, setShowSignOut] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Animate menu coming down
      gsap.to(menuRef.current, {
        y: 0,
        duration: 1.8,
        ease: "power4.out",
      });

      // Animate lines to form a cross
      gsap.to(line1Ref.current, {
        rotation: 50,
        y: 4,
        duration: 0.3,
        backgroundColor: "#fff",
      });
      gsap.to(line2Ref.current, {
        rotation: -50,
        y: -4,
        duration: 0.3,
        backgroundColor: "#fff",
      });
    } else {
      // Animate menu going up
      gsap.to(menuRef.current, {
        y: "-100%",
        duration: 1.2,
        ease: "power4.in",
      });

      // Animate cross back to lines
      gsap.to([line1Ref.current, line2Ref.current], {
        rotation: 0,
        y: 0,
        duration: 0.3,
        backgroundColor: "#16db65",
      });
    }
  }, [isOpen]);

  // Check if user is logged in
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }
      }
    );

    // Get initial user
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();

    // Get cart item count from localStorage
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("grindFuelCart") || "[]");
      setCartItemCount(cart.reduce((total, item) => total + item.quantity, 0));
    };

    updateCartCount();
    window.addEventListener("storage", updateCartCount);

    return () => {
      authListener.subscription.unsubscribe();
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  // Handle section hover effects
  const handleSectionHover = (section: Section) => {
    setActiveSection(section);
  };

  const handleSectionLeave = () => {
    setActiveSection(null);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setShowSignOut(false);

    // Clear cart if needed
    localStorage.removeItem("grindFuelCart");
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  // Get initials from email
  const getInitials = (email) => {
    if (!email) return "?";
    return email.charAt(0).toUpperCase();
  };

  return (
    <div className="flex flex-col relative z-999">
      {/* Full screen menu */}
      <div
        ref={menuRef}
        className="fixed top-0 left-0 w-full h-screen z-10 transform -translate-y-full flex bg-black"
      >
        <div className="w-1/2 p-16 flex flex-col items-center justify-center">
          <ul className="space-y-2 w-full text-7xl font-bold">
            <li
              className={`w-full text-center transition-colors duration-500 cursor-pointer ${
                activeSection && activeSection !== "home"
                  ? "text-gray-600"
                  : "text-[#16db65]"
              }`}
              onMouseEnter={() => handleSectionHover("home")}
              onMouseLeave={handleSectionLeave}
              onClick={() => {
                window.location.href = "/";
              }}
            >
              Home
            </li>
            <li
              className={`w-full text-center transition-colors duration-500 cursor-pointer ${
                activeSection && activeSection !== "about"
                  ? "text-gray-600"
                  : "text-[#16db65]"
              }`}
              onMouseEnter={() => handleSectionHover("about")}
              onMouseLeave={handleSectionLeave}
              onClick={() => {
                window.location.href = "/about";
              }}
            >
              About
            </li>
            <li
              className={`w-full text-center transition-colors duration-500 cursor-pointer ${
                activeSection && activeSection !== "products"
                  ? "text-gray-600"
                  : "text-[#16db65]"
              }`}
              onMouseEnter={() => handleSectionHover("products")}
              onMouseLeave={handleSectionLeave}
              onClick={() => {
                window.location.href = "/products";
              }}
            >
              Products
            </li>
            <li
              className={`w-full text-center transition-colors duration-500 cursor-pointer ${
                activeSection && activeSection !== "policies"
                  ? "text-gray-600"
                  : "text-[#16db65]"
              }`}
              onMouseEnter={() => handleSectionHover("policies")}
              onMouseLeave={handleSectionLeave}
              onClick={() => {
                window.location.href = "/policies";
              }}
            >
              Policies
            </li>
            <li
              className={`w-full text-center transition-colors duration-500 cursor-pointer ${
                activeSection && activeSection !== "contact"
                  ? "text-gray-600"
                  : "text-[#16db65]"
              }`}
              onMouseEnter={() => handleSectionHover("contact")}
              onMouseLeave={handleSectionLeave}
              onClick={() => {
                window.location.href = "/contact";
              }}
            >
              Contact
            </li>
          </ul>
        </div>

        <div className="w-1/2 flex items-center justify-center overflow-hidden bg-gray-900 relative">
          <img
            src="/logo/logo2.png"
            alt="Logo"
            className="w-auto h-auto max-w-full max-h-full object-contain"
          />
        </div>
      </div>

      <nav className="fixed top-0 left-0 right-0 flex items-center justify-between p-8 z-20">
        {/* Logo on the left */}
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">
            <img
              src="/logo/logo2.png"
              alt="logo"
              className="w-10 h-10 cursor-pointer"
              onClick={() => {
                window.location.href = "/";
              }}
            />
          </h1>
        </div>

        {/* Menu lines in the center */}
        <div
          className="flex flex-col items-center relative z-20 cursor-pointer mx-auto"
          onClick={() => setIsOpen(!isOpen)}
          onMouseMove={(e) => {
            if (isOpen) return; // Don't move when menu is open

            const container = e.currentTarget;
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            const distance = Math.sqrt(x * x + y * y);

            // Only move if mouse is within reasonable distance
            const maxDistance = 10000;
            // Increased movement factor from 10 to 5 (smaller divisor = more movement)
            const moveX = distance < maxDistance ? x / 0.8 : 0;
            // Added vertical movement
            const moveY = distance < maxDistance ? y / 0.8 : 0;

            const lines = container.querySelectorAll("div");
            lines.forEach((line, index) => {
              // First line moves more horizontally, second line moves more vertically
              const xOffset = index === 0 ? moveX : moveX * 0.8;
              const yOffset = index === 0 ? moveY * 0.8 : moveY;

              line.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
              line.style.transition =
                distance < maxDistance
                  ? "transform 0.1s ease"
                  : "transform 0.5s ease";
            });
          }}
          onMouseLeave={(e) => {
            if (isOpen) return; // Don't reset when menu is open

            const lines = e.currentTarget.querySelectorAll("div");
            lines.forEach((line) => {
              line.style.transform = "translate(0, 0)";
              line.style.transition = "transform 0.5s ease";
            });
          }}
        >
          <div
            ref={line1Ref}
            className="w-12 h-1 bg-[#16db65] mb-2 origin-center"
          ></div>
          <div
            ref={line2Ref}
            className="w-12 h-0.5 bg-[#16db65] origin-center"
          ></div>
        </div>

        {/* User info and cart on the right */}
        <div className="flex items-center space-x-4">
          {/* User Circle with Initials */}
          <div className="relative">
            {user ? (
              <div
                className="relative"
                onMouseEnter={() => setShowSignOut(true)}
                onMouseLeave={() => setShowSignOut(false)}
              >
                <div className="w-10 h-10 rounded-full bg-[#16db65] flex items-center justify-center text-black font-bold cursor-pointer">
                  {getInitials(user.email)}
                </div>

                {/* Sign Out Button - Shows on Hover */}
                {showSignOut && (
                  <div className="absolute right-0 mt-2 bg-gray-900 py-2 px-4 rounded-md shadow-lg z-50">
                    <button
                      onClick={handleSignOut}
                      className="whitespace-nowrap text-white hover:text-[#16db65] transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>

          <button
            onClick={() => {
              console.log("Cart button clicked");
              // Dispatch a custom event to toggle the cart
              const toggleEvent = new CustomEvent("toggleCart");
              window.dispatchEvent(toggleEvent);
            }}
            className="relative p-2 text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-[#16db65]"
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
          </button>
        </div>
      </nav>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={(user: User) => setUser(user)}
      />
    </div>
  );
}
