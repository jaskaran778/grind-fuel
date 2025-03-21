"use client";

import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { createClient } from "@supabase/supabase-js";
import Navbar from "@/components/navbar";
import ProductCard from "@/components/ProductCard";
import Cart from "@/components/Cart";
import { products } from "@/data/products";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

// Add this function near the top of your component
const convertToRupees = (dollarPrice) => {
  // Using an approximate conversion rate of 83 INR to 1 USD
  return (dollarPrice * 83).toFixed(0);
};

export default function Products() {
  const [activeCategory, setActiveCategory] = useState("hydration");
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const heroRef = useRef(null);
  const productRefs = useRef([]);

  // GSAP animations
  useEffect(() => {
    // Hero animation
    gsap.from(heroRef.current, {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: "power3.out",
    });

    // Products staggered animation
    gsap.from(productRefs.current, {
      opacity: 0,
      y: 30,
      stagger: 0.1,
      duration: 0.6,
      ease: "power2.out",
      delay: 0.5,
    });
  }, [activeCategory]);

  useEffect(() => {
    // Load cart from localStorage on component mount
    const savedCart = localStorage.getItem("grindFuelCart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Cart functions
  const addToCart = (product) => {
    // Get current cart from localStorage
    const currentCart = JSON.parse(
      localStorage.getItem("grindFuelCart") || "[]"
    );

    // Check if product already exists in cart
    const existingProductIndex = currentCart.findIndex(
      (item) => item.id === product.id
    );

    // Convert price string to number if needed
    const price =
      typeof product.price === "number"
        ? product.price
        : parseFloat(product.price.toString().replace(/[^0-9.]/g, ""));

    // Create full product object with all required data
    const productWithData = {
      ...product,
      quantity: 1,
      price: price,
      image: product.image, // Make sure image is included
    };

    if (existingProductIndex >= 0) {
      // Product exists, increase quantity
      currentCart[existingProductIndex].quantity += 1;
    } else {
      // Product doesn't exist, add with quantity 1
      currentCart.push(productWithData);
    }

    // Save to localStorage
    localStorage.setItem("grindFuelCart", JSON.stringify(currentCart));

    // Show toast notification
    window.dispatchEvent(
      new CustomEvent("productAdded", {
        detail: { product: productWithData },
      })
    );

    // Open cart
    window.dispatchEvent(new CustomEvent("openCart"));

    // Force update other components
    window.dispatchEvent(new CustomEvent("cartUpdated"));

    // Update local cart state
    setCart(currentCart);
  };

  const filteredProducts = products.filter(
    (product) => product.category === activeCategory
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Hero Section */}
      <div
        ref={heroRef}
        className="relative h-[50vh] flex flex-col items-center justify-center overflow-hidden"
      >
        <div className="z-10 text-center px-4">
          <h1 className="text-6xl font-extrabold mb-4 text-transparent bg-clip-text bg-[#16db65]">
            Fuel Your Victory
          </h1>
          <p className="text-2xl mb-8 text-blue-100">Power. Focus. Dominate.</p>

          {/* Category Selection */}
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => setActiveCategory("hydration")}
              className={`px-6 py-3 rounded-full font-bold transition-all ${
                activeCategory === "hydration"
                  ? "bg-[#16db65] text-black"
                  : "bg-gray-800 text-[#16db65] hover:bg-gray-700"
              }`}
            >
              Hydration Boost
            </button>
            <button
              onClick={() => setActiveCategory("snacks")}
              className={`px-6 py-3 rounded-full font-bold transition-all ${
                activeCategory === "snacks"
                  ? "bg-[#16db65] text-black"
                  : "bg-gray-800 text-[#16db65] hover:bg-gray-700"
              }`}
            >
              Game Fuel Snacks
            </button>
            <button
              onClick={() => setActiveCategory("gum")}
              className={`px-6 py-3 rounded-full font-bold transition-all ${
                activeCategory === "gum"
                  ? "bg-[#16db65] text-black"
                  : "bg-gray-800 text-[#16db65] hover:bg-gray-700"
              }`}
            >
              Quick-Boost Gum
            </button>
          </div>
        </div>

        {/* Animated background */}
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-20"></div>
      </div>

      {/* Product Display Section */}
      <div className="container mx-auto py-16 px-4">
        <h2 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-[#16db65]">
          {activeCategory === "hydration" && "Hydration Boost Series"}
          {activeCategory === "snacks" && "Game Fuel Snacks"}
          {activeCategory === "gum" && "Quick-Boost Gum"}
        </h2>
        <p className="text-xl text-[#fff] mb-10">
          {activeCategory === "hydration" &&
            "For gamers who need long-lasting hydration and endurance."}
          {activeCategory === "snacks" &&
            "Designed for quick, high-energy snacking without interruptions."}
          {activeCategory === "gum" &&
            "For those who need a burst of energy without a drink."}
        </p>

        <div className="flex flex-col space-y-8">
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              ref={(el) => (productRefs.current[index] = el)}
            >
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden transition-all duration-300 shadow-lg hover:shadow-xl flex flex-col md:flex-row">
                <div className="md:w-1/3 h-64 md:h-80 relative overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
                </div>

                <div className="p-6 md:w-2/3 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-2xl font-bold text-[#16db65]">
                        {product.name}
                      </h3>
                      <span className="bg-[#16db65] text-black px-3 py-1.5 rounded-full text-base font-bold">
                        ₹{(product.price * 83).toFixed(0)}
                      </span>
                    </div>
                    <p className="text-gray-300 mb-6 text-lg">
                      {product.description}
                    </p>
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full md:w-auto self-end bg-[#16db65] hover:bg-[#16db65]/90 text-black font-bold py-3 px-6 rounded-lg transition-all cursor-pointer"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Component */}
      <Cart
        cart={cart}
        setCart={setCart}
        isOpen={isCartOpen}
        setIsOpen={setIsCartOpen}
        supabase={supabase}
      />
    </div>
  );
}
