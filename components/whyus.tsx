"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useRouter } from "next/navigation";

export default function WhyUs() {
  const router = useRouter();
  const headingRef = useRef(null);
  const lightningRefs = useRef([]);
  const featureRefs = useRef([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Animate lightning SVGs
    gsap.to(lightningRefs.current, {
      y: "random(-10, 10)",
      x: "random(-5, 5)",
      rotation: "random(-5, 5)",
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
      stagger: 0.2,
    });

    // Animate features on scroll
    featureRefs.current.forEach((feature, index) => {
      gsap.from(feature, {
        scrollTrigger: {
          trigger: feature,
          start: "top 80%",
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        delay: index * 0.2,
      });
    });

    // Heading animation
    gsap.from(headingRef.current, {
      duration: 1.2,
      opacity: 0,
      y: 30,
      ease: "power3.out",
    });
  }, []);

  // Add references to the lightning SVGs array
  const addLightningRef = (el) => {
    if (el && !lightningRefs.current.includes(el)) {
      lightningRefs.current.push(el);
    }
  };

  // Add references to the feature elements array
  const addFeatureRef = (el) => {
    if (el && !featureRefs.current.includes(el)) {
      featureRefs.current.push(el);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen py-20 relative overflow-hidden">
      {/* Background lightning SVGs */}
      <div
        ref={addLightningRef}
        className="absolute top-20 left-10 w-16 h-16 opacity-40"
      >
        <svg viewBox="0 0 24 24" fill="#16db65">
          <path d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <div
        ref={addLightningRef}
        className="absolute top-40 right-20 w-12 h-12 opacity-30"
      >
        <svg viewBox="0 0 24 24" fill="#16db65">
          <path d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <div
        ref={addLightningRef}
        className="absolute bottom-60 left-1/4 w-10 h-10 opacity-20"
      >
        <svg viewBox="0 0 24 24" fill="#16db65">
          <path d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>

      <div className="container mx-auto px-4">
        {/* Main Heading */}
        <div ref={headingRef} className="relative mb-24 text-center">
          <div className="bg-[#16db65] skew-x-12 h-20 w-5/6 mx-auto -rotate-1 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 -z-10"></div>
          <h1 className="text-7xl md:text-8xl font-black text-white font-heading tracking-tight leading-none relative z-10">
            WHY SETTLE?
          </h1>
          <h2 className="text-4xl md:text-5xl font-bold text-white font-heading mt-2 drop-shadow-glow">
            Power Up with GrindFuel!
          </h2>
        </div>

        {/* Three-column feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
          {/* Feature 1 */}
          <div
            ref={addFeatureRef}
            className="bg-black border-2 border-[#16db65] rounded-xl p-8 relative hover:bg-[#16db65]/10 transition-all duration-300"
          >
            <div className="bg-[#16db65] text-black p-2 inline-block rounded mb-4">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4 font-heading text-[#16db65]">
              ✅ High-Performance Formula
            </h3>
            <p className="text-gray-300">
              No junk, no fillers—just clean, effective ingredients designed for
              sustained energy and focus.
            </p>
          </div>

          {/* Feature 2 */}
          <div
            ref={addFeatureRef}
            className="bg-black border-2 border-[#16db65] rounded-xl p-8 relative hover:bg-[#16db65]/10 transition-all duration-300"
          >
            <div className="bg-[#16db65] text-black p-2 inline-block rounded mb-4">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.9 2-2V5c0-1.11-.89-2-2-2zm0 5h-2V5h2v3zM4 19h16v2H4z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4 font-heading text-[#16db65]">
              🌍 Science Meets Gaming
            </h3>
            <p className="text-gray-300">
              Developed with input from nutrition experts and gamers to optimize
              hydration, endurance, and alertness.
            </p>
          </div>

          {/* Feature 3 */}
          <div
            ref={addFeatureRef}
            className="bg-black border-2 border-[#16db65] rounded-xl p-8 relative hover:bg-[#16db65]/10 transition-all duration-300"
          >
            <div className="bg-[#16db65] text-black p-2 inline-block rounded mb-4">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4 font-heading text-[#16db65]">
              💨 Fast-Acting & Crash-Free
            </h3>
            <p className="text-gray-300">
              Instant energy without the crash. No sugar overload—just pure
              focus fuel.
            </p>
          </div>
        </div>

        {/* Who is this for section */}
        <div ref={addFeatureRef} className="mb-20">
          <h2 className="text-4xl font-bold mb-10 font-heading text-[#16db65] text-center">
            🎯 WHO IS THIS FOR?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-black/50 p-6 rounded-lg border-l-4 border-[#16db65]">
              <h3 className="text-xl font-bold mb-2 font-heading">🏆 Gamers</h3>
              <p className="text-gray-300">
                Stay sharp, react faster, and never lose momentum in intense
                matches.
              </p>
            </div>

            <div className="bg-black/50 p-6 rounded-lg border-l-4 border-[#16db65]">
              <h3 className="text-xl font-bold mb-2 font-heading">
                💪 Athletes
              </h3>
              <p className="text-gray-300">
                Hydrate and fuel up with precision—power through your workouts
                or competitions.
              </p>
            </div>

            <div className="bg-black/50 p-6 rounded-lg border-l-4 border-[#16db65]">
              <h3 className="text-xl font-bold mb-2 font-heading">
                🛠️ Hustlers & Creators
              </h3>
              <p className="text-gray-300">
                Work longer, think clearer, and keep the grind going—no midday
                crashes.
              </p>
            </div>
          </div>
        </div>

        {/* What's Inside Section */}
        <div ref={addFeatureRef} className="mb-20">
          <h2 className="text-4xl font-bold mb-10 font-heading text-[#16db65] text-center">
            🔬 WHAT'S INSIDE?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#16db65] to-[#16db65]/40 rounded-xl blur opacity-30 group-hover:opacity-60 transition-opacity"></div>
              <div className="relative bg-black p-6 rounded-xl border border-[#16db65]/50">
                <h3 className="text-xl font-bold mb-2 font-heading">
                  🏋️‍♂️ Hydration Boost
                </h3>
                <p className="text-gray-300">
                  Electrolytes + clean energy for peak endurance.
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#16db65] to-[#16db65]/40 rounded-xl blur opacity-30 group-hover:opacity-60 transition-opacity"></div>
              <div className="relative bg-black p-6 rounded-xl border border-[#16db65]/50">
                <h3 className="text-xl font-bold mb-2 font-heading">
                  🍪 Game Fuel Snacks
                </h3>
                <p className="text-gray-300">
                  Packed with protein & brain-boosting nutrients.
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#16db65] to-[#16db65]/40 rounded-xl blur opacity-30 group-hover:opacity-60 transition-opacity"></div>
              <div className="relative bg-black p-6 rounded-xl border border-[#16db65]/50">
                <h3 className="text-xl font-bold mb-2 font-heading">
                  🟢 Quick-Boost Gum
                </h3>
                <p className="text-gray-300">
                  Caffeine-powered focus—chew & go.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div ref={addFeatureRef} className="text-center">
          <h2 className="text-4xl font-bold mb-6 font-heading">
            Join the Movement. Fuel Your Grind.
          </h2>
          <button
            className="bg-[#16db65] hover:bg-[#16db65]/80 text-black font-bold py-4 px-10 rounded-full text-xl transition-all duration-300 relative overflow-hidden group"
            onClick={() => router.push("/products")}
          >
            <span className="relative z-10">Explore Our Products →</span>
            <span className="absolute inset-0 h-full w-0 bg-white/20 transition-all duration-300 group-hover:w-full"></span>
          </button>
        </div>
      </div>
    </div>
  );
}
