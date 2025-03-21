"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useRouter } from "next/navigation";
// Product data - you would replace this with your actual data
const products = {
  hydration: [
    {
      id: 1,
      name: "Energy Surge",
      description: "Electrolyte-packed energy drink",
      price: "$3.99",
      image: "/images/grind-fuel products/drinks (1).png",
    },
    {
      id: 2,
      name: "Focus Flow",
      description: "Clean caffeine, zero crash",
      price: "$3.99",
      image: "/images/grind-fuel products/drinks (2).png",
    },
    {
      id: 3,
      name: "Hyper Hydrate",
      description: "Maximum hydration formula",
      price: "$4.29",
      image: "/images/grind-fuel products/drinks (3).png",
    },
    {
      id: 4,
      name: "Power Punch",
      description: "Fruit blast with B vitamins",
      price: "$3.99",
      image: "/images/grind-fuel products/drinks (4).png",
    },
    {
      id: 5,
      name: "Night Mode",
      description: "Gaming energy, all night long",
      price: "$4.49",
      image: "/images/grind-fuel products/drinks (5).png",
    },
  ],
  snacks: [
    {
      id: 6,
      name: "Protein Bytes",
      description: "20g protein, low carb snack bites",
      price: "$5.99",
      image: "/images/grind-fuel products/snacks (1).png",
    },
    {
      id: 7,
      name: "Focus Crunch",
      description: "Almond & dark chocolate protein bar",
      price: "$3.49",
      image: "/images/grind-fuel products/snacks (2).png",
    },
    {
      id: 8,
      name: "Brain Fuel",
      description: "Nootropic-infused nut mix",
      price: "$4.99",
      image: "/images/grind-fuel products/snacks (3).png",
    },
    {
      id: 9,
      name: "Power Cookies",
      description: "Protein-packed gaming fuel",
      price: "$6.99",
      image: "/images/grind-fuel products/snacks (4).png",
    },
    {
      id: 10,
      name: "Reaction Wafers",
      description: "Quick energy, great taste",
      price: "$4.49",
      image: "/images/grind-fuel products/snacks (5).png",
    },
  ],
  gums: [
    {
      id: 11,
      name: "Focus Chew",
      description: "Caffeine + L-theanine gum",
      price: "$3.99",
      image: "/images/grind-fuel products/gum (1).png",
    },
    {
      id: 12,
      name: "Reaction Boost",
      description: "Faster reaction time formula",
      price: "$4.29",
      image: "/images/grind-fuel products/gum (2).png",
    },
    {
      id: 13,
      name: "Brain Blast",
      description: "Nootropic-infused focus gum",
      price: "$3.99",
      image: "/images/grind-fuel products/gum (3).png",
    },
    {
      id: 14,
      name: "Mint Rush",
      description: "Refreshing energy kick",
      price: "$3.79",
      image: "/images/grind-fuel products/gum (4).png",
    },
    {
      id: 15,
      name: "Power Chew",
      description: "Long-lasting energy release",
      price: "$4.49",
      image: "/images/grind-fuel products/gum (5).png",
    },
  ],
};

export default function Featured() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("hydration");
  const scrollContainerRef = useRef(null);
  const cardsRef = useRef([]);
  const sectionRef = useRef(null);

  // Add to cart function
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
        : parseFloat(product.price.replace("$", ""));

    if (existingProductIndex >= 0) {
      // Product exists, increase quantity
      currentCart[existingProductIndex].quantity += 1;
    } else {
      // Product doesn't exist, add with quantity 1
      currentCart.push({
        ...product,
        quantity: 1,
        price: price,
      });
    }

    // Save updated cart to localStorage
    localStorage.setItem("grindFuelCart", JSON.stringify(currentCart));

    // Trigger storage event for other components to update
    window.dispatchEvent(new Event("storage"));

    // Create a custom event to open the cart
    const openCartEvent = new CustomEvent("openCart");
    window.dispatchEvent(openCartEvent);
  };

  // Reset refs array when category changes
  useEffect(() => {
    cardsRef.current = [];
  }, [activeCategory]);

  // Add card elements to the refs array
  const addToRefs = (el) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  // Initialize GSAP animations
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Animate cards
    if (cardsRef.current.length > 0) {
      // Clear any existing animations
      gsap.killTweensOf(cardsRef.current);

      // Create new animations
      gsap.fromTo(
        cardsRef.current,
        {
          y: 50,
          opacity: 0,
          rotationY: -5,
          rotationZ: gsap.utils.wrap([-3, 3]),
        },
        {
          y: 0,
          opacity: 1,
          rotationY: 0,
          rotationZ: gsap.utils.wrap([-2, 2]),
          stagger: 0.1,
          duration: 0.6,
          ease: "power2.out",
        }
      );
    }

    // Set up horizontal scroll animation with better control
    if (scrollContainerRef.current && sectionRef.current) {
      // Kill all existing ScrollTrigger instances to prevent conflicts
      ScrollTrigger.getAll().forEach((st) => st.kill());

      // Calculate dimensions
      const totalWidth = scrollContainerRef.current.scrollWidth;
      const viewportWidth = window.innerWidth;
      const scrollDistance = totalWidth - viewportWidth + 100; // Adding extra space

      // Create the scroll trigger animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          start: "top top",
          end: () => `+=${scrollDistance}`,
          scrub: 1,
          anticipatePin: 1,
          refreshPriority: 1,
          invalidateOnRefresh: true,
          onEnter: () => console.log("enter"),
          onLeave: () => console.log("leave"),
          onEnterBack: () => console.log("enter back"),
          onLeaveBack: () => console.log("leave back"),
          // markers: process.env.NODE_ENV === "development" ? true : false,
        },
      });

      tl.to(scrollContainerRef.current, {
        x: -scrollDistance,
        ease: "none",
      });

      return () => {
        // Clean up by killing all scroll triggers
        tl.kill();
        ScrollTrigger.getAll().forEach((st) => st.kill());
      };
    }
  }, [activeCategory, cardsRef.current.length]);

  return (
    <div ref={sectionRef} className="w-full h-screen bg-black overflow-hidden">
      <div className="h-screen flex flex-col justify-center items-start pt-20">
        <div className="container mx-auto mt-40 px-4">
          {/* Category Toggle Bar */}
          <div className="inline-flex bg-black/50 backdrop-blur-sm rounded-full p-1 border border-[#16db65]/30 mb-10 relative z-10">
            {["hydration", "snacks", "gums"].map((category) => (
              <button
                key={category}
                className={`px-6 py-2 rounded-full font-heading text-lg transition-all duration-300 cursor-pointer ${
                  activeCategory === category
                    ? "bg-[#16db65] text-black"
                    : "text-[#16db65] hover:bg-[#16db65]/10"
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          {/* Product Name Display */}
          <h2 className="text-4xl md:text-5xl font-bold text-white font-heading mb-6">
            {activeCategory === "hydration" && "Energy Drinks"}
            {activeCategory === "snacks" && "Game Fuel Snacks"}
            {activeCategory === "gums" && "Focus-Boost Gum"}
          </h2>

          {/* Products Horizontal Scroll - Using GSAP animation instead of manual scroll */}
          <div className="overflow-hidden w-full">
            <div ref={scrollContainerRef} className="flex gap-20 pl-20">
              {products[activeCategory].map((product, index) => (
                <div
                  key={product.id}
                  ref={addToRefs}
                  className="flex-shrink-0 w-[450px] md:w-[550px] rounded-xl overflow-hidden border-2 border-[#16db65] group transform transition-all duration-500"
                  style={{
                    transform: `rotate(${index % 2 === 0 ? "2deg" : "-2deg"})`,
                  }}
                >
                  <div className="relative overflow-hidden h-[500px]">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black to-transparent opacity-70"></div>
                    <div className="absolute bottom-0 left-0 w-full p-6">
                      <span className="bg-[#16db65] text-black text-sm font-bold px-4 py-2 rounded-full">
                        {product.price}
                      </span>
                      <h3 className="text-2xl font-bold text-white mt-4 font-heading">
                        {product.name}
                      </h3>
                      <p className="text-gray-300 text-lg mt-2 mb-4">
                        {product.description}
                      </p>

                      {/* Add to Cart Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent card click
                          addToCart(product);
                        }}
                        className="bg-[#16db65] hover:bg-[#16db65]/90 text-black px-4 py-2 rounded-full font-medium transition-colors duration-300 cursor-pointer"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                  <div className="p-6 flex justify-between items-center bg-black">
                    <button className="text-[#16db65] hover:underline font-medium text-lg">
                      Details
                    </button>
                    <button
                      className="bg-[#16db65]/20 hover:bg-[#16db65]/30 border border-[#16db65] rounded-full p-3 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click
                        addToCart(product);
                      }}
                    >
                      <svg
                        className="w-6 h-6 text-[#16db65]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
                          clipRule="evenodd"
                          fillRule="evenodd"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="flex justify-center mt-8">
            <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full border border-[#16db65]/30">
              <span className="text-gray-300 text-sm md:text-base font-medium">
                Scroll down to see more products
              </span>
              <span className="text-[#16db65]">
                <svg
                  className="w-6 h-6 animate-bounce"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center mt-6">
            <button
              className="inline-flex items-center bg-[#16db65] hover:bg-[#16db65]/90 text-black font-bold py-3 px-8 rounded-full transition-all group overflow-hidden relative cursor-pointer"
              onClick={() => router.push("/products")}
            >
              <span className="relative z-10">
                View All{" "}
                {activeCategory.charAt(0).toUpperCase() +
                  activeCategory.slice(1)}
              </span>
              <svg
                className="w-5 h-5 ml-2 relative z-10 transition-transform group-hover:translate-x-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="absolute inset-0 h-full w-0 bg-white/20 transition-all duration-300 group-hover:w-full"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
