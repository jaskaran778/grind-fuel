"use client";

// Define a simple product interface
interface Product {
  id: string | number;
  name: string;
  price: number | string;
  image?: string;
  quantity?: number;
}

// Simplified Cart component that only handles product added event
export default function Cart() {
  // This file is kept as a stub to maintain compatibility
  // with any code that might try to use cart functionality
  // Only the toast notification will be shown on add to cart

  const dispatchProductAdded = (product: Product) => {
    const event = new CustomEvent("productAdded", {
      detail: { product },
    });
    window.dispatchEvent(event);
  };

  return null;
}
