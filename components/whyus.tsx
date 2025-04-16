"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function WhyUs() {
  const router = useRouter();
  const headingRef = useRef(null);
  const lightningRefs = useRef([]);
  const featureRefs = useRef([]);
  const [activePhase, setActivePhase] = useState(0);
  const [flippedCard, setFlippedCard] = useState(null);
  const [hoveredIngredient, setHoveredIngredient] = useState(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Set a small delay to ensure DOM is fully rendered
    const animationTimeout = setTimeout(() => {
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

      // Animate features with more reliable trigger settings
      featureRefs.current.forEach((feature, index) => {
        gsap.from(feature, {
          scrollTrigger: {
            trigger: feature,
            start: "top bottom-=50", // Trigger earlier - when element top reaches 50px before bottom of viewport
            end: "bottom top+=50",
            toggleActions: "play none none reverse", // Play on enter, reverse on exit
            once: false, // Don't just fire once
            // markers: process.env.NODE_ENV === "development", // Show markers in dev mode for debugging
          },
          y: 80,
          opacity: 0,
          duration: 1,
          delay: index * 0.2,
          ease: "power3.out",
        });
      });

      // Heading animation - with fail-safe
      if (headingRef.current) {
        gsap.from(headingRef.current, {
          duration: 1.2,
          opacity: 0,
          y: 30,
          ease: "power3.out",
        });
      }
    }, 200); // Small delay to ensure DOM is ready

    // Force refresh ScrollTrigger when the component mounts
    ScrollTrigger.refresh();

    // Cycle through energy boost phases
    const phaseInterval = setInterval(() => {
      setActivePhase((prev) => (prev + 1) % 3);
    }, 3000);

    return () => {
      clearInterval(phaseInterval);
      clearTimeout(animationTimeout);
      ScrollTrigger.getAll().forEach((t) => t.kill());
      gsap.killTweensOf(lightningRefs.current);
    };
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

  const handleCardFlip = (index) => {
    setFlippedCard(flippedCard === index ? null : index);
  };

  const phases = [
    {
      title: "Phase 1: Instant Hydration Boost 💧",
      description:
        "Electrolytes activate within seconds, hydrating and preparing your body for peak performance.",
    },
    {
      title: "Phase 2: Sustained Focus & Endurance 🔥",
      description:
        "Our proprietary blend maintains peak mental clarity and physical stamina for hours of intense activity.",
    },
    {
      title: "Phase 3: Zero Crash + Long-Lasting Energy ⚡",
      description:
        "Unlike competitors, GrindFuel provides a smooth comedown with no jitters or energy crashes.",
    },
  ];

  const audienceCards = [
    {
      title: "🎮 Gamers",
      frontDescription: "Reaction time matters. Level up your play.",
      backDescription:
        "Stay sharp, react faster, and dominate matches with sustained mental clarity.",
      image: "/why (1).jpg",
    },
    {
      title: "💪 Athletes",
      frontDescription: "Push limits. Break records.",
      backDescription:
        "Hydrate and fuel with precision—power through workouts and competitions.",
      image: "/why (2).jpg",
    },
    {
      title: "🛠️ Creators & Hustlers",
      frontDescription: "Create longer. Think clearer.",
      backDescription:
        "Work longer, think clearer, and keep the grind going—no midday crashes.",
      image: "/creator.jpg",
    },
  ];

  const ingredients = [
    {
      title: "🏋️‍♂️ Hydration Boost",
      description:
        "Electrolytes + clean energy for peak endurance and cellular hydration.",
      details:
        "Perfectly balanced sodium, potassium, and magnesium complex for optimal absorption.",
    },
    {
      title: "🍪 Game Fuel Snacks",
      description:
        "Packed with protein & brain-boosting nutrients for extended sessions.",
      details:
        "Plant-based proteins with nootropic compounds to enhance cognitive function.",
    },
    {
      title: "🟢 Quick-Boost Gum",
      description:
        "Caffeine-powered focus—chew & go for instant mental clarity.",
      details:
        "100mg caffeine per piece, combined with L-theanine for smooth, jitter-free energy.",
    },
  ];

  return (
    <div className="bg-black text-white min-h-screen py-20 relative overflow-hidden">
      {/* Dynamic particle background */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="relative w-full h-full">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute bg-[#16db65] rounded-full animate-pulse"
              style={{
                width: `${Math.random() * 8 + 2}px`,
                height: `${Math.random() * 8 + 2}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.3,
                animationDuration: `${Math.random() * 4 + 3}s`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
      </div>

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

      <div className="container mx-auto px-4 relative z-10">
        {/* Main Heading - KEEPING THE SAME AS REQUESTED */}
        <div ref={headingRef} className="relative mb-24 text-center">
          <div className="bg-[#16db65] skew-x-12 h-20 w-5/6 mx-auto -rotate-1 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 -z-10"></div>
          <h1 className="text-7xl md:text-8xl font-black text-white font-heading tracking-tight leading-none relative z-10">
            WHY SETTLE?
          </h1>
          <h2 className="text-4xl md:text-5xl font-bold text-white font-heading mt-2 drop-shadow-glow">
            Power Up with GrindFuel!
          </h2>
        </div>

        {/* Hero Section with Holographic Card UI */}
        <div ref={addFeatureRef} className="mb-32 relative">
          <div className="glass-card relative overflow-hidden backdrop-blur-sm rounded-2xl border border-[#16db65]/30 shadow-[0_0_15px_rgba(22,219,101,0.3)]">
            <div className="absolute inset-0 bg-gradient-to-br from-black/80 to-black/60 z-0"></div>
            <div className="relative z-10 p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                <div>
                  <h3 className="text-3xl md:text-4xl font-bold mb-5 font-heading text-[#16db65]">
                    Elevate Your Performance
                  </h3>
                  <p className="text-xl text-gray-300 mb-8">
                    GrindFuel isn't just another energy drink. It's a complete
                    performance system designed by gamers, athletes, and
                    hustlers for peak mental and physical output.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <span className="inline-block py-2 px-4 rounded-full bg-[#16db65]/10 border border-[#16db65]/30 text-[#16db65]">
                      No Crash
                    </span>
                    <span className="inline-block py-2 px-4 rounded-full bg-[#16db65]/10 border border-[#16db65]/30 text-[#16db65]">
                      Clean Ingredients
                    </span>
                    <span className="inline-block py-2 px-4 rounded-full bg-[#16db65]/10 border border-[#16db65]/30 text-[#16db65]">
                      Mental Clarity
                    </span>
                    <span className="inline-block py-2 px-4 rounded-full bg-[#16db65]/10 border border-[#16db65]/30 text-[#16db65]">
                      Sustained Energy
                    </span>
                  </div>
                </div>
                <div className="relative h-[300px] md:h-[400px] flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-64 h-64 rounded-full bg-[#16db65]/20 animate-pulse"></div>
                  </div>
                  <div className="relative transform hover:scale-105 transition-transform duration-500">
                    <Image
                      src="/images/drinks (2).png"
                      alt="GrindFuel Product"
                      width={300}
                      height={400}
                      className="object-contain drop-shadow-[0_0_15px_rgba(22,219,101,0.6)]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Energy Boost Phases - Interactive Experience */}
        <div ref={addFeatureRef} className="mb-32">
          <h2 className="text-4xl font-bold mb-14 font-heading text-center text-[#16db65]">
            THE GRINDFUEL EXPERIENCE
          </h2>

          <div className="relative px-4">
            {/* Horizontal energy line */}
            <div className="absolute left-0 right-0 top-24 h-1 bg-gradient-to-r from-[#16db65]/20 via-[#16db65] to-[#16db65]/20"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {phases.map((phase, index) => (
                <div
                  key={index}
                  className={`relative transition-all duration-500 ${
                    activePhase === index ? "scale-105 z-10" : "opacity-70"
                  }`}
                  onClick={() => setActivePhase(index)}
                >
                  {/* Phase node */}
                  <div className="flex justify-center mb-8">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        activePhase === index
                          ? "bg-[#16db65] shadow-[0_0_20px_rgba(22,219,101,0.8)]"
                          : "bg-[#16db65]/40"
                      }`}
                    >
                      <span className="text-black font-bold">{index + 1}</span>
                    </div>
                  </div>

                  {/* Phase content card */}
                  <div
                    className={`h-full p-6 rounded-xl backdrop-blur-sm transition-all duration-500 ${
                      activePhase === index
                        ? "bg-black/70 border-2 border-[#16db65] shadow-[0_5px_15px_rgba(22,219,101,0.3)]"
                        : "bg-black/40 border border-[#16db65]/20"
                    }`}
                  >
                    <h3 className="text-xl font-bold mb-3 font-heading text-[#16db65]">
                      {phase.title}
                    </h3>
                    <p className="text-gray-300">{phase.description}</p>

                    {/* Visual indicator */}
                    <div
                      className={`mt-4 h-1 bg-[#16db65] rounded-full transition-all duration-700 ${
                        activePhase === index ? "w-full" : "w-1/3"
                      }`}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Energy pulses */}
            {activePhase !== null && (
              <div className="absolute inset-0 pointer-events-none">
                <div
                  className={`absolute top-24 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                  w-4 h-4 rounded-full bg-[#16db65] animate-ping opacity-75`}
                  style={{ left: `${activePhase * 50 + 25}%` }}
                ></div>
              </div>
            )}
          </div>
        </div>

        {/* Who is this for - Card flip section */}
        <div ref={addFeatureRef} className="mb-32">
          <h2 className="text-4xl font-bold mb-14 font-heading text-center text-[#16db65]">
            🎯 WHO IS THIS FOR?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {audienceCards.map((card, index) => (
              <div
                key={index}
                className={`relative h-[350px] perspective-1000 cursor-pointer ${
                  flippedCard === index ? "z-20" : "z-10"
                }`}
                onClick={() => handleCardFlip(index)}
              >
                <div
                  className={`absolute inset-0 transition-all duration-700 backface-visibility-hidden transform ${
                    flippedCard === index
                      ? "rotate-y-180 opacity-0"
                      : "rotate-y-0 opacity-100"
                  }`}
                >
                  {/* Front of card */}
                  <div className="absolute inset-0 rounded-xl overflow-hidden border-2 border-[#16db65]">
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/90 z-10"></div>
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end">
                      <h3 className="text-2xl font-bold mb-2 font-heading text-[#16db65]">
                        {card.title}
                      </h3>
                      <p className="text-white text-lg">
                        {card.frontDescription}
                      </p>
                      <p className="text-[#16db65] mt-4 font-bold">
                        Click to learn more ↗
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className={`absolute inset-0 transition-all duration-700 backface-visibility-hidden transform ${
                    flippedCard === index
                      ? "rotate-y-0 opacity-100"
                      : "rotate-y-180 opacity-0"
                  }`}
                >
                  {/* Back of card */}
                  <div className="absolute inset-0 bg-[#16db65] rounded-xl p-8 flex flex-col justify-center">
                    <h3 className="text-2xl font-bold mb-4 font-heading text-black">
                      {card.title}
                    </h3>
                    <p className="text-black text-lg font-medium mb-6">
                      {card.backDescription}
                    </p>
                    <p className="text-black/70 mt-auto italic">
                      Tap to flip back
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What's Inside - Hover to reveal */}
        {/* <div ref={addFeatureRef} className="mb-20">
          <h2 className="text-4xl font-bold mb-14 font-heading text-center text-[#16db65]">
            🔬 WHAT'S INSIDE?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ingredients.map((ingredient, idx) => (
              <div
                key={idx}
                className="relative group"
                onMouseEnter={() => setHoveredIngredient(idx)}
                onMouseLeave={() => setHoveredIngredient(null)}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-r from-[#16db65] to-[#16db65]/40 rounded-xl blur transition-opacity ${
                    hoveredIngredient === idx ? "opacity-60" : "opacity-30"
                  }`}
                ></div>
                <div className="relative bg-black p-6 rounded-xl border border-[#16db65]/50 h-full transition-transform duration-300 hover:scale-105">
                  <h3 className="text-xl font-bold mb-2 font-heading">
                    {ingredient.title}
                  </h3>
                  <p className="text-gray-300 mb-4">{ingredient.description}</p>

                  <div
                    className={`overflow-hidden transition-all duration-1000 ${
                      hoveredIngredient === idx
                        ? "max-h-40 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="pt-4 border-t border-[#16db65]/30">
                      <p className="text-[#16db65] font-medium">
                        {ingredient.details}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div> */}

        {/* CTA Section - KEEPING THE SAME AS REQUESTED */}
        <div ref={addFeatureRef} className="text-center">
          <h2 className="text-4xl font-bold mb-6 font-heading">
            Join the Movement. Fuel Your Grind.
          </h2>
          <button
            className="bg-[#16db65] hover:bg-[#16db65]/80 text-black font-bold py-4 px-10 rounded-full text-xl transition-all duration-300 relative overflow-hidden group cursor-pointer"
            onClick={() => router.push("/products")}
          >
            <span className="relative z-10 ">Explore Our Products →</span>
            <span className="absolute inset-0 h-full w-0 bg-white/20 transition-all duration-300 group-hover:w-full"></span>
          </button>
        </div>
      </div>
    </div>
  );
}
