// components/Text.jsx
"use client";
import React from "react";

export default function Text() {
  return (
    <div className="absolute z-10 text-center">
      <h1 className="text-6xl font-bold mb-4 text-white">
        Paint Reveal Effect
      </h1>
      <p className="text-xl text-white">
        Move your mouse to reveal the background
      </p>
    </div>
  );
}
