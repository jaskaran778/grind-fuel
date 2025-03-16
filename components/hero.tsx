"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Hero() {
  const fuelTheRef = useRef<HTMLDivElement>(null);
  const grindRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate the hero text on load
    const tl = gsap.timeline();

    tl.fromTo(
      fuelTheRef.current,
      { x: 500, opacity: 0 },
      { x: 0, opacity: 1, duration: 1.5, ease: "bounce.out" }
    );
    tl.fromTo(
      grindRef.current,
      { x: -500, opacity: 0 },
      { x: 0, opacity: 1, duration: 1.5, ease: "bounce.out" },
      "-=0.7" // Start slightly before the first animation finishes
    );
  }, []);

  return (
    <section className="w-full h-screen flex flex-col items-center justify-center bg-black overflow-hidden">
      <div className="container mx-auto px-4 w-full mt-22">
        <div className="flex flex-col items-center w-full">
          {/* FUEL THE - Hollow outline text */}
          <div ref={fuelTheRef} className="w-full text-center">
            <h1
              className="text-8xl md:text-9xl lg:text-[13rem] xl:text-[16rem] 2xl:text-[18rem] font-black tracking-tighter leading-none text-transparent w-full"
              style={{
                color: "transparent",
                textShadow: "none",
                WebkitTextStrokeWidth: "1px",
                WebkitTextStrokeColor: "#16db65",
                letterSpacing: "-0.05em",
              }}
            >
              FUEL THE
            </h1>
          </div>

          {/* GRIND - Solid filled text */}
          <div
            ref={grindRef}
            className="w-full text-center -mt-8 md:-mt-12 lg:-mt-16 xl:-mt-16"
          >
            <h1
              className="text-[26rem]  font-black tracking-tighter leading-none text-[#16db65] w-full"
              style={{ letterSpacing: "-0.05em" }}
            >
              GRIND
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}
