"use client";
import { useEffect, useState, useRef } from "react";
import gsap from "gsap";

// Define section type for type safety
type Section = "home" | "about" | "products" | "policies" | "contact" | null;

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<Section>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);

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

  // Handle section hover effects
  const handleSectionHover = (section: Section) => {
    setActiveSection(section);
  };

  const handleSectionLeave = () => {
    setActiveSection(null);
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
        <div
          className="flex flex-col items-center relative z-20 cursor-pointer"
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
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-[#16db65] cursor-pointer"
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
      </nav>
    </div>
  );
}
