"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

const testimonials = [
  {
    id: 1,
    name: "Madison",
    role: "Gamer",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    content:
      "Spylt keeps me focused during marathon gaming sessions. The caffeine hit is clean and the crash is non-existent!",
  },
  {
    id: 2,
    name: "Alexander",
    role: "Streamer",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    content:
      "Been streaming for 8+ hours daily and Spylt is my go-to energy boost. Love the flavors and the clean energy!",
  },
  {
    id: 3,
    name: "Jamal",
    role: "eSports Pro",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    content:
      "My reaction time improved within minutes of having Spylt. It's now part of my pre-tournament ritual.",
  },
  {
    id: 4,
    name: "Sophia",
    role: "Content Creator",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    content:
      "The protein snacks are perfect for my long editing sessions. Great taste and keeps me full without the sugar crash.",
  },
  {
    id: 5,
    name: "Tyler",
    role: "Developer",
    image:
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    content:
      "Spylt Focus Gum helps me stay in the zone during coding sprints. It's subtle but effective.",
  },
];

export default function Testimonials() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const testimonialRefs = useRef([]);

  // Reset refs when component mounts
  useEffect(() => {
    testimonialRefs.current = [];
  }, []);

  // Add testimonial elements to the refs array
  const addToRefs = (el) => {
    if (el && !testimonialRefs.current.includes(el)) {
      testimonialRefs.current.push(el);
    }
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Animate the background text
    gsap.from(headingRef.current.children, {
      y: 100,
      opacity: 0,
      stagger: 0.2,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    });

    // Create a timeline for the testimonials
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 30%",
        end: "bottom 70%",
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        pinSpacing: true,
      },
    });

    // Initial position of cards (hidden below)
    gsap.set(testimonialRefs.current, {
      y: 200,
      opacity: 0,
      scale: 0.8,
    });

    // Animate each testimonial card
    testimonialRefs.current.forEach((card, index) => {
      // Add to timeline: rise up, then move to final position
      tl.to(
        card,
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: "power2.out",
        },
        index * 0.2
      ) // Stagger the animations
        .to(
          card,
          {
            x: (index - 2) * 180, // Center the cards, then offset
            duration: 0.5,
            ease: "power1.inOut",
          },
          index * 0.2 + 0.5
        );
    });

    return () => {
      // Clean up animations
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className="relative bg-black h-[130vh] overflow-hidden"
    >
      {/* Background text */}
      <div
        ref={headingRef}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <h2 className="text-right text-8xl sm:text-9xl md:text-[12rem] font-extrabold text-white/10 leading-none tracking-tighter pr-6 mt-20">
          WHAT'S
        </h2>
        <h2 className="text-left text-8xl sm:text-9xl md:text-[12rem] font-extrabold text-white/10 leading-none tracking-tighter pl-6">
          EVERYONE
        </h2>
        <h2 className="text-right text-8xl sm:text-9xl md:text-[12rem] font-extrabold text-[#e1a14e] leading-none tracking-tighter pr-6">
          TALKING
        </h2>
      </div>

      {/* Container for testimonial cards */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 w-full max-w-screen-xl z-10">
        <div className="flex justify-center items-center h-screen">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              ref={addToRefs}
              className="absolute bg-[#111] border-2 border-[#16db65]/30 rounded-2xl w-[300px] shadow-xl overflow-hidden transform transition-all duration-500 mx-2"
            >
              <div className="relative">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-full h-56 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-[#16db65] flex items-center justify-center text-black text-sm font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <span className="ml-2 text-white font-bold">
                      {testimonial.name}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <p className="text-gray-300 text-sm mb-3">
                  {testimonial.content}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-[#16db65] text-xs font-semibold">
                    {testimonial.role}
                  </span>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className="w-3 h-3 text-[#16db65]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Button */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center z-10">
        <button className="bg-[#e1a14e] hover:bg-[#e1a14e]/90 text-black font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 relative overflow-hidden group">
          <span className="relative z-10">EXPLORE ALL</span>
          <span className="absolute inset-0 h-full w-0 bg-white/20 transition-all duration-300 group-hover:w-full"></span>
        </button>
      </div>
    </div>
  );
}
