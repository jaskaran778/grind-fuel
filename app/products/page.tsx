"use client";

import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import Navbar from "@/components/navbar";
import { products } from "@/data/products";
import { motion, AnimatePresence } from "framer-motion";
import { Tilt } from "react-tilt";
import { X } from "lucide-react";
import { Draggable } from "gsap/Draggable";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Define product interface
interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  quantity?: number;
}

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(Draggable, ScrollTrigger);
}

export default function Products() {
  const [activeCategory, setActiveCategory] = useState("hydration");
  const [cart, setCart] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const heroRef = useRef(null);
  const gridRef = useRef(null);
  const productRefs = useRef<any[]>([]);
  const sidebarRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isGlitching, setIsGlitching] = useState(false);
  const dataStreamRef = useRef<HTMLDivElement>(null);
  const glitchAreaRef = useRef<HTMLDivElement>(null);

  // Default tilt options
  const tiltOptions = {
    max: 25, // max tilt rotation (degrees)
    scale: 1.05, // scaling on hover
    speed: 1000, // speed of the animation
    glare: true,
    "max-glare": 0.5,
    perspective: 1000,
  };

  // GSAP animations
  useEffect(() => {
    // Hero animation
    gsap.from(heroRef.current, {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: "power3.out",
    });

    // Grid animation
    gsap.from(gridRef.current, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: "power2.out",
      delay: 0.3,
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

  // Animate sidebar when a product is selected
  useEffect(() => {
    if (selectedProduct && sidebarRef.current) {
      gsap.fromTo(
        sidebarRef.current,
        { x: "100%" },
        { x: 0, duration: 0.4, ease: "power2.out" }
      );
    }
  }, [selectedProduct]);

  // Initialize data stream background
  useEffect(() => {
    // Create data streams
    const createDataStream = () => {
      if (!dataStreamRef.current) return;

      // Clear previous streams
      dataStreamRef.current.innerHTML = "";

      // Number of streams depends on screen width
      const screenWidth = window.innerWidth;
      const numStreams = Math.floor(screenWidth / 60);

      for (let i = 0; i < numStreams; i++) {
        const stream = document.createElement("div");
        stream.className = "data-stream-column";
        stream.style.left = `${(i * 100) / numStreams}%`;
        stream.style.animationDuration = `${10 + Math.random() * 20}s`;
        stream.style.animationDelay = `${Math.random() * 5}s`;

        // Add random matrix-like characters
        const streamLength = 20 + Math.floor(Math.random() * 80);
        for (let j = 0; j < streamLength; j++) {
          const char = document.createElement("div");
          char.className = "data-stream-char";
          char.style.opacity = `${0.1 + Math.random() * 0.3}`;
          char.style.animationDuration = `${1 + Math.random() * 3}s`;

          // Choose character type
          const charType = Math.floor(Math.random() * 5);
          if (charType === 0) {
            // Binary
            char.textContent = Math.random() > 0.5 ? "1" : "0";
          } else if (charType === 1) {
            // Hex
            char.textContent = "0123456789ABCDEF"[
              Math.floor(Math.random() * 16)
            ];
          } else if (charType === 2) {
            // Symbols
            char.textContent = "!@#$%^&*()[]{}|;:<>,.?/"[
              Math.floor(Math.random() * 24)
            ];
          } else if (charType === 3) {
            // ASCII bars
            char.textContent = "░▒▓█▄▀■□"[Math.floor(Math.random() * 8)];
          } else {
            // Matrix-like characters
            char.textContent = String.fromCharCode(0x30a0 + Math.random() * 96);
          }

          stream.appendChild(char);
        }

        dataStreamRef.current.appendChild(stream);
      }
    };

    createDataStream();

    // Handle window resize
    const handleResize = () => {
      createDataStream();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Handle mouse movement for cursor glitch effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Cart functions
  const addToCart = (product: Product) => {
    // Get current cart from localStorage
    const currentCart = JSON.parse(
      localStorage.getItem("grindFuelCart") || "[]"
    );

    // Check if product already exists in cart
    const existingProductIndex = currentCart.findIndex(
      (item: Product) => item.id === product.id
    );

    // Convert price string to number if needed
    const price = product.price;

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

  // Close the detail sidebar
  const closeSidebar = () => {
    if (sidebarRef.current) {
      gsap.to(sidebarRef.current, {
        x: "100%",
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => setSelectedProduct(null),
      });
    }
  };

  // Product click handler for data transfer effect
  const handleProductClick = (productId: string) => {
    setIsGlitching(true);

    // Create glitch effect
    if (glitchAreaRef.current) {
      gsap.to(glitchAreaRef.current, {
        opacity: 0.7,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          gsap.to(glitchAreaRef.current, {
            opacity: 0,
            duration: 0.5,
            ease: "power2.out",
          });
        },
      });

      // Add temporary data transfer lines
      const lines = 15;
      for (let i = 0; i < lines; i++) {
        const line = document.createElement("div");
        line.className = "data-transfer-line";
        line.style.top = `${Math.random() * 100}%`;
        line.style.width = `${10 + Math.random() * 90}%`;
        line.style.left = `${Math.random() * 20}%`;
        line.style.opacity = `${0.3 + Math.random() * 0.7}`;
        line.style.height = `${1 + Math.random() * 2}px`;
        line.style.animationDuration = `${0.2 + Math.random() * 0.8}s`;

        glitchAreaRef.current.appendChild(line);

        // Remove after animation
        setTimeout(() => {
          if (glitchAreaRef.current && glitchAreaRef.current.contains(line)) {
            glitchAreaRef.current.removeChild(line);
          }
        }, 1000);
      }
    }

    setTimeout(() => {
      setIsGlitching(false);
    }, 800);

    // Original add to cart functionality
    addToCart(products.find((p) => p.id === productId)!);
  };

  // When you open the product details
  const openProductDetails = (productId: string) => {
    // Find the product in the products array
    const product = products.find((p) => p.id === productId);

    if (product) {
      setSelectedProduct(product);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen overflow-x-hidden">
      <Navbar />

      {/* Data stream background */}
      <div
        ref={dataStreamRef}
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden data-stream-container"
      ></div>

      {/* Glitch effect area that follows cursor */}
      <div
        ref={glitchAreaRef}
        className="fixed pointer-events-none z-10 glitch-area"
        style={{
          left: mousePosition.x - 100,
          top: mousePosition.y - 100,
          width: 200,
          height: 200,
          opacity: 0,
        }}
      ></div>

      {/* Hero Section */}
      <div
        ref={heroRef}
        className="relative  py-24 px-4 flex justify-center items-center min-h-[50vh]"
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
        {/* Remove or comment out:
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-20"></div>
        */}
      </div>

      {/* 3D Product Display Section - Enhance heading visibility */}
      <div className="container mx-auto py-16 px-4 relative z-10">
        <div className="heading-container mb-4">
          <h2 className="text-5xl font-extrabold mb-2 text-[#16db65] product-heading">
            {activeCategory === "hydration" && "Hydration Boost Series"}
            {activeCategory === "snacks" && "Game Fuel Snacks"}
            {activeCategory === "gum" && "Quick-Boost Gum"}
          </h2>
        </div>
        <br />
        <div className="subheading-container mb-10">
          <p className="text-2xl text-white font-medium">
            {activeCategory === "hydration" &&
              "For gamers who need long-lasting hydration and endurance."}
            {activeCategory === "snacks" &&
              "Designed for quick, high-energy snacking without interruptions."}
            {activeCategory === "gum" &&
              "For those who need a burst of energy without a drink."}
          </p>
        </div>

        {/* 3D Grid Layout */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              ref={(el) => (productRefs.current[index] = el)}
              className="relative"
            >
              <Tilt
                options={tiltOptions}
                className="h-full"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div
                  className={`h-full rounded-xl flex flex-col  
                  transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer border-2
                  ${
                    hoveredProduct === product.id
                      ? "border border-[#16db65]/40"
                      : "border border-gray-800"
                  }`}
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                  onClick={() => setSelectedProduct(product)}
                >
                  {/* Product Image Container with parallax effect */}
                  <div
                    className="w-full h-80 relative overflow-hidden rounded-t-xl"
                    style={{ transform: "translateZ(60px)" }}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>

                    {/* Product price tag */}
                    <div
                      className="absolute top-4 right-4 bg-[#16db65] text-black px-3 py-1.5 rounded-full text-base font-bold shadow-lg shadow-[#16db65]/20"
                      style={{ transform: "translateZ(20px)" }}
                    >
                      ₹{product.price.toFixed(0)}
                    </div>
                  </div>

                  {/* Product Info with 3D perspective */}
                  <div
                    className="p-6 flex flex-col justify-between flex-grow z-10"
                    style={{ transform: "translateZ(30px)" }}
                  >
                    <div>
                      <h3 className="text-2xl font-bold text-[#16db65] mb-2">
                        {product.name}
                      </h3>
                      <p className="text-gray-300 mb-4">
                        {product.description.substring(0, 100)}...
                      </p>
                    </div>

                    {/* View Details Button */}
                    <button
                      className="w-full bg-gray-800 hover:bg-gray-700 text-[#16db65] border border-[#16db65]/40 font-bold py-3 px-6 rounded-lg transition-all cursor-pointer mt-2 flex items-center justify-center"
                      style={{ transform: "translateZ(40px)" }}
                    >
                      <span>View Details</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Neon glow effect on hover */}
                  <div
                    className={`absolute inset-0 rounded-xl transition-opacity duration-300 pointer-events-none ${
                      hoveredProduct === product.id
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
                  >
                    {/* Corner accents */}
                    <div className="absolute top-0 right-0 w-8 h-px bg-[#16db65]"></div>
                    <div className="absolute top-0 right-0 w-px h-8 bg-[#16db65]"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-px bg-[#16db65]"></div>
                    <div className="absolute bottom-0 left-0 w-px h-8 bg-[#16db65]"></div>

                    {/* Subtle box shadow */}
                    <div className="absolute inset-0 rounded-xl shadow-[0_0_15px_rgba(22,219,101,0.15)] pointer-events-none"></div>
                  </div>
                </div>
              </Tilt>
            </div>
          ))}
        </div>
      </div>

      {/* Product Detail Sidebar */}
      <AnimatePresence>
        {selectedProduct && (
          <div
            ref={sidebarRef}
            className="fixed top-0 right-0 w-full md:w-1/2 lg:w-1/3 h-full bg-gray-900 shadow-2xl shadow-[#16db65]/10 border-l border-[#16db65]/20 z-102 transform translate-x-full"
          >
            <div
              className="h-full overflow-y-auto scrollbar-hide"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <div className="sticky top-0 bg-gray-900 z-10 p-4 flex justify-between items-center border-b border-[#16db65]/20">
                <h2 className="text-2xl font-bold text-[#16db65]">
                  Product Details
                </h2>
                <button
                  onClick={closeSidebar}
                  className="p-2 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6">
                {/* Product Hero Image */}
                <div className="relative h-96 mb-8 rounded-xl overflow-hidden">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <h1 className="text-3xl font-bold text-white">
                      {selectedProduct.name}
                    </h1>
                    <div className="flex items-center justify-between mt-2">
                      <div className="text-xs px-2 py-1 bg-[#16db65]/20 rounded border border-[#16db65]/40 text-[#16db65]">
                        {selectedProduct.category.toUpperCase()}
                      </div>
                      <div className="text-2xl font-bold text-[#16db65]">
                        ₹{selectedProduct.price}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product Description */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4 text-white">
                    Description
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {selectedProduct.description}
                  </p>

                  {/* Product Features */}
                  <div className="mt-6">
                    <h4 className="text-lg font-bold mb-3 text-white">
                      Key Features
                    </h4>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="text-[#16db65] mr-3">•</div>
                        <span>
                          Premium ingredients for maximum effectiveness
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="text-[#16db65] mr-3">•</div>
                        <span>
                          Scientifically formulated for enhanced focus and
                          endurance
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="text-[#16db65] mr-3">•</div>
                        <span>Great taste with no artificial aftertaste</span>
                      </li>
                      <li className="flex items-start">
                        <div className="text-[#16db65] mr-3">•</div>
                        <span>Perfect for long gaming sessions</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Nutritional Info */}
                <div className="mb-8 bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-xl font-bold mb-4 text-white">
                    Nutritional Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex justify-between border-b border-gray-700 pb-2">
                      <span className="text-gray-400">Calories</span>
                      <span className="font-medium">120 kcal</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-700 pb-2">
                      <span className="text-gray-400">Caffeine</span>
                      <span className="font-medium">150 mg</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-700 pb-2">
                      <span className="text-gray-400">Protein</span>
                      <span className="font-medium">5g</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-700 pb-2">
                      <span className="text-gray-400">Carbs</span>
                      <span className="font-medium">10g</span>
                    </div>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => handleProductClick(selectedProduct.id)}
                  className="w-full bg-[#16db65] hover:bg-[#16db65]/90 text-black font-bold py-4 px-6 rounded-lg transition-all cursor-pointer relative overflow-hidden group"
                >
                  <span className="relative z-10">ADD TO CART</span>
                  <span className="absolute inset-0 h-full w-0 bg-white/20 transition-all duration-300 group-hover:w-full"></span>
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Styles for the data stream effect */}
      <style jsx global>{`
        .data-stream-container {
          background-color: rgba(0, 0, 0, 0.85);
        }

        .data-stream-column {
          position: absolute;
          top: -100%;
          color: rgba(22, 219, 101, 0.5);
          font-family: monospace;
          font-size: 14px;
          line-height: 1.2;
          white-space: nowrap;
          text-align: center;
          animation: stream-flow linear infinite;
          font-weight: bold;
        }

        .data-stream-char {
          animation: stream-flicker steps(1) infinite;
          text-shadow: 0 0 8px rgba(22, 219, 101, 0.7);
        }

        @keyframes stream-flow {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(100vh);
          }
        }

        @keyframes stream-flicker {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
        }

        .glitch-area {
          background: radial-gradient(
            circle,
            rgba(22, 219, 101, 0.4) 0%,
            rgba(0, 0, 0, 0) 70%
          );
          mix-blend-mode: screen;
          backdrop-filter: hue-rotate(30deg);
          pointer-events: none;
        }

        .data-transfer-line {
          position: absolute;
          background: linear-gradient(
            90deg,
            rgba(22, 219, 101, 0),
            rgba(22, 219, 101, 0.8),
            rgba(22, 219, 101, 0)
          );
          transform: translateX(-100%);
          animation: data-transfer linear forwards;
          height: 3px !important;
        }

        @keyframes data-transfer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }

        /* Hover glitch effect for products */
        .product-card:hover::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            45deg,
            rgba(22, 219, 101, 0) 70%,
            rgba(22, 219, 101, 0.2) 75%,
            rgba(22, 219, 101, 0) 80%
          );
          z-index: 1;
          animation: glitch-sweep 1s linear infinite;
          pointer-events: none;
        }

        @keyframes glitch-sweep {
          0% {
            transform: translateX(-100%) skewX(-10deg);
          }
          100% {
            transform: translateX(200%) skewX(-10deg);
          }
        }

        /* Occasional glitch on product cards */
        .product-card.glitching::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background-color: rgba(22, 219, 101, 0.7);
          animation: random-glitch 0.3s steps(2) forwards;
          z-index: 2;
        }

        @keyframes random-glitch {
          0% {
            transform: translateY(0);
          }
          20% {
            transform: translateY(20px);
          }
          40% {
            transform: translateY(50px);
          }
          60% {
            transform: translateY(25px);
          }
          80% {
            transform: translateY(75px);
          }
          100% {
            transform: translateY(100px);
          }
        }

        /* Enhanced styles for product headings */
        .heading-container {
          position: relative;
          display: inline-block;
          padding: 0.5rem 1.5rem;
          background-color: rgba(0, 0, 0, 0.7);
          border-left: 4px solid #16db65;
          border-radius: 4px;
          margin-bottom: 1rem;
          box-shadow: 0 0 20px rgba(22, 219, 101, 0.3);
          z-index: 20;
        }

        .subheading-container {
          position: relative;
          display: inline-block;
          padding: 0.5rem 1.5rem;
          background-color: rgba(0, 0, 0, 0.7);
          border-left: 2px solid #16db65;
          border-radius: 4px;
          margin-bottom: 1.5rem;
          z-index: 20;
        }

        .product-heading {
          font-size: 3.5rem;
          font-weight: 900;
          letter-spacing: 1px;
          // text-shadow: 0 0 10px rgba(22, 219, 101, 0.8),
          //   0 0 20px rgba(22, 219, 101, 0.4);
          color: #16db65;
          position: relative;
          display: inline-block;
        }

        /* Create a subtle glow animation for the heading */
        .product-heading::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 4px;
          z-index: -1;
          animation: 2s ease-in-out infinite alternate;
        }

        // @keyframes heading-glow {
        //   0% {
        //     box-shadow: 0 0 5px rgba(22, 219, 101, 0.3);
        //   }
        //   100% {
        //     box-shadow: 0 0 15px rgba(22, 219, 101, 0.7);
        //   }
        // }
      `}</style>
    </div>
  );
}
