"use client";

import { useState, useEffect } from "react";

export default function Toast() {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const handleProductAdded = (e) => {
      if (e.detail && e.detail.product) {
        setProduct(e.detail.product);
        setMessage(`${e.detail.product.name} added to cart!`);
        setIsVisible(true);

        // Hide toast after 3 seconds
        setTimeout(() => {
          setIsVisible(false);
        }, 3000);
      }
    };

    window.addEventListener("productAdded", handleProductAdded);

    return () => {
      window.removeEventListener("productAdded", handleProductAdded);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900 border border-[#16db65] text-white p-4 rounded-lg shadow-lg z-50 flex items-center">
      {product && product.image && (
        <div className="w-10 h-10 rounded-md overflow-hidden mr-3">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/images/placeholder.png";
              e.currentTarget.onerror = null;
            }}
          />
        </div>
      )}
      <p>{message}</p>
      <button
        onClick={() => setIsVisible(false)}
        className="ml-4 text-gray-400 hover:text-white"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
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
  );
}
