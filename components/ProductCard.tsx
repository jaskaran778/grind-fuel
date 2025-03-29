"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";

export default function ProductCard({ product, onAddToCart }) {
  const cardRef = useRef(null);

  // Hover effect with GSAP
  useEffect(() => {
    const card = cardRef.current;

    card.addEventListener("mouseenter", () => {
      gsap.to(card, {
        y: -10,
        scale: 1.05,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
        duration: 0.3,
      });
    });

    card.addEventListener("mouseleave", () => {
      gsap.to(card, {
        y: 0,
        scale: 1,
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
        duration: 0.3,
      });
    });

    return () => {
      card.removeEventListener("mouseenter", () => {});
      card.removeEventListener("mouseleave", () => {});
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden transition-all duration-300 shadow-lg"
    >
      <div className="h-48 relative overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-[#16db65]">{product.name}</h3>
          <span className="bg-[#16db65] text-black px-2 py-1 rounded-full text-sm font-bold">
            ₹{product.price}
          </span>
        </div>
        <p className="text-gray-300 mb-4 text-sm">{product.description}</p>
        <button
          onClick={onAddToCart}
          className="w-full bg-[#16db65] hover:bg-[#16db65] text-black font-bold py-2 px-4 rounded-lg transition-all"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
