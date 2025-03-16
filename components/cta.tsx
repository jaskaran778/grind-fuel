"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";

export default function CTA() {
  const [email, setEmail] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const ctaRef = useRef(null);
  const glitchRef = useRef(null);

  // Handle email input change
  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your subscription logic here
    console.log("Email submitted:", email);
    // Reset the form
    setEmail("");
    // Show success message or animation
    triggerSuccessAnimation();
  };

  // Success animation
  const triggerSuccessAnimation = () => {
    gsap.to(ctaRef.current, {
      keyframes: {
        "0%": { scale: 1, boxShadow: "0 0 20px 0px #16db65" },
        "50%": { scale: 1.02, boxShadow: "0 0 40px 5px #16db65" },
        "100%": { scale: 1, boxShadow: "0 0 20px 0px #16db65" },
      },
      duration: 0.6,
      ease: "power2.out",
    });
  };

  // Random glitch effect
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (glitchRef.current) {
        gsap.to(glitchRef.current, {
          skewX: gsap.utils.random(-10, 10),
          opacity: gsap.utils.random(0.8, 1),
          duration: 0.1,
          onComplete: () => {
            gsap.to(glitchRef.current, {
              skewX: 0,
              opacity: 1,
              duration: 0.1,
            });
          },
        });
      }
    }, gsap.utils.random(3000, 5000));

    return () => clearInterval(glitchInterval);
  }, []);

  // Energy bar progress based on email length
  const energyProgress = email.length > 0 ? Math.min(email.length * 5, 100) : 0;

  return (
    <div className="w-full py-16 px-4 sm:px-6 lg:px-8 overflow-hidden relative bg-black">
      {/* Digital circuit lines */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute h-[1px] bg-gradient-to-r from-transparent via-[#16db65] to-transparent"
              style={{
                top: `${gsap.utils.random(0, 100)}%`,
                left: 0,
                width: `${gsap.utils.random(20, 80)}%`,
                opacity: gsap.utils.random(0.3, 0.7),
                transform: `translateX(${i % 2 === 0 ? "0" : "20%"})`,
              }}
            />
          ))}
          {[...Array(10)].map((_, i) => (
            <div
              key={i + 10}
              className="absolute w-[1px] bg-gradient-to-b from-transparent via-[#16db65] to-transparent"
              style={{
                left: `${gsap.utils.random(0, 100)}%`,
                top: 0,
                height: `${gsap.utils.random(20, 80)}%`,
                opacity: gsap.utils.random(0.3, 0.7),
                transform: `translateY(${i % 2 === 0 ? "0" : "20%"})`,
              }}
            />
          ))}
        </div>
      </div>

      <div
        ref={ctaRef}
        className="max-w-4xl mx-auto rounded-3xl p-8 md:p-10 lg:p-12 relative overflow-hidden transition-all duration-300"
        style={{
          background: "linear-gradient(145deg, #0a0a0a 0%, #121212 100%)",
          boxShadow: "0 0 20px 0px #16db65",
        }}
      >
        {/* Decorative elements - holographic chips */}
        <div className="absolute -left-12 -top-10 opacity-70">
          <div className="w-40 h-40 rounded-lg transform rotate-12 border border-[#16db65]/30 bg-black/50 backdrop-blur-md flex items-center justify-center">
            <div className="w-20 h-20 border border-[#16db65]/50 rounded relative overflow-hidden">
              <div className="absolute inset-2 bg-[#16db65]/10 rounded"></div>
              <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 gap-[1px]">
                {[...Array(16)].map((_, i) => (
                  <div key={i} className="bg-[#16db65]/20 rounded-sm"></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="absolute -right-10 -bottom-10 opacity-70">
          <div className="w-32 h-32 rounded-full transform -rotate-12 border border-[#16db65]/30 bg-black/50 backdrop-blur-md flex items-center justify-center">
            <div className="w-16 h-16 border border-[#16db65]/50 rounded-full relative overflow-hidden">
              <div className="absolute inset-2 bg-[#16db65]/10 rounded-full"></div>
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-[1px]">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="bg-[#16db65]/20 rounded-full"></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scan lines effect */}
        <div className="absolute inset-0 pointer-events-none opacity-5">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-full h-[1px] bg-white"
              style={{ top: `${i * 5}%` }}
            />
          ))}
        </div>

        <div className="relative z-10">
          {/* Main heading with glitch effect */}
          <h2
            ref={glitchRef}
            className="text-center text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 text-white"
            style={{ textShadow: "0 0 15px rgba(22, 219, 101, 0.7)" }}
          >
            <span className="block">POWER UP YOUR</span>
            <span className="block text-[#16db65]">FIRST ORDER</span>
            <span className="block relative">
              <span
                className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-[#16db65] opacity-70"
                style={{ clipPath: "inset(0 0 50% 0)" }}
              >
                GET 15% OFF
              </span>
              GET 15% OFF
            </span>
          </h2>

          <p className="text-center text-gray-300 mb-8 max-w-xl mx-auto tracking-wide">
            Join the movement. Get exclusive access to energy-boosting deals &
            early drops.
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-4 md:space-y-0 md:flex md:items-center md:gap-4 max-w-2xl mx-auto relative"
          >
            {/* Energy bar that fills as typing */}
            <div
              className="absolute left-0 bottom-0 h-[2px] bg-[#16db65]"
              style={{
                width: `${energyProgress}%`,
                transition: "width 0.3s ease",
              }}
            ></div>

            <div className="flex-grow relative group">
              <input
                type="email"
                value={email}
                onChange={handleChange}
                placeholder="Enter your access code (email)"
                required
                className="w-full px-4 py-4 rounded-lg bg-black/70 border-2 border-[#16db65]/30 focus:border-[#16db65] text-white placeholder-gray-500 outline-none transition-all duration-300 text-base"
                style={{ boxShadow: "inset 0 0 10px rgba(22, 219, 101, 0.1)" }}
              />
              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-20 pointer-events-none bg-[#16db65] animate-pulse transition-opacity duration-300"></div>
            </div>

            <button
              type="submit"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="w-full md:w-auto px-8 py-4 rounded-lg bg-black relative overflow-hidden group transition-all duration-300 border-2 border-[#16db65] hover:bg-[#16db65]/10"
            >
              <span className="relative z-10 text-white font-bold tracking-wider group-hover:text-white transition-colors duration-300">
                ACTIVATE
              </span>

              {/* Button glow effect */}
              <span
                className={`absolute inset-0 bg-[#16db65]/20 scale-0 group-hover:scale-100 transition-transform duration-500 ease-out rounded-lg`}
              ></span>

              {/* Corner highlights */}
              <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#16db65]"></span>
              <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#16db65]"></span>
              <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#16db65]"></span>
              <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#16db65]"></span>
            </button>
          </form>

          <p className="text-center text-gray-500 text-xs mt-4">
            By activating, you agree to receive marketing emails. Unsubscribe
            anytime.
          </p>
        </div>
      </div>
    </div>
  );
}
