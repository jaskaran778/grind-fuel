// components/Background.jsx
"use client";
import React from "react";
import Image from "next/image";

export default function Background() {
  return (
    <div className="absolute inset-0 z-0">
      {/* Option 1: Background Image */}
      <Image
        src="/navbar/nav (5).jpg"
        alt="Background"
        fill
        style={{ objectFit: "cover" }}
        priority
      />

      {/* Option 2: Background Video (uncomment this if you prefer video) */}
      {/*
      <video 
        autoPlay 
        muted 
        loop 
        className="w-full h-full object-cover"
      >
        <source src="/your-background-video.mp4" type="video/mp4" />
      </video>
      */}
    </div>
  );
}
