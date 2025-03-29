"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";

type Review = {
  id: number;
  name: string;
  role: string;
  rating: number;
  comment: string;
  avatar?: string;
  date: string;
};

const reviews: Review[] = [
  {
    id: 1,
    name: "Ryan Xiang",
    role: "Competitive Gamer",
    rating: 5,
    comment:
      "GrindFuel gives me the edge I need during tournaments. Clear focus without the jitters. My go-to for competition days.",
    avatar: "/reviews/avatar1.jpg",
    date: "2023-11-15",
  },
  {
    id: 2,
    name: "Elena Cortez",
    role: "Software Architect",
    rating: 5,
    comment:
      "When I need to debug complex systems at 3AM, GrindFuel keeps my mind sharp. The clean mental boost is unmatched.",
    avatar: "/reviews/avatar2.jpg",
    date: "2023-10-22",
  },
  {
    id: 3,
    name: "Jamal Williams",
    role: "Game Developer",
    rating: 4,
    comment:
      "Pulled an all-nighter to finish our game before launch. GrindFuel kept my code clean and bug-free until dawn.",
    avatar: "/reviews/avatar3.jpg",
    date: "2023-12-03",
  },
  {
    id: 4,
    name: "Aisha Khan",
    role: "E-sports Manager",
    rating: 5,
    comment:
      "My entire team swears by GrindFuel. We've seen measurable improvements in reaction time and decision making.",
    avatar: "/reviews/avatar4.jpg",
    date: "2023-09-18",
  },
  {
    id: 5,
    name: "David Mercer",
    role: "Cybersecurity Analyst",
    rating: 5,
    comment:
      "During 36-hour penetration tests, GrindFuel helps me stay alert and notice security vulnerabilities others miss.",
    avatar: "/reviews/avatar5.jpg",
    date: "2023-11-30",
  },
  {
    id: 6,
    name: "Sophia Zhang",
    role: "VR Designer",
    rating: 4,
    comment:
      "The clean energy from GrindFuel helps me design and test immersive VR experiences for hours without fatigue.",
    avatar: "/reviews/avatar6.jpg",
    date: "2023-10-05",
  },
];

const HolographicReviews: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  // Motion values for parallax effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Transform mouse position to limited range for subtle movement
  const xTransform = useTransform(x, [0, dimensions.width], [-5, 5]);
  const yTransform = useTransform(y, [0, dimensions.height], [-5, 5]);

  // Add spring physics for smoother movement
  const springX = useSpring(xTransform, { stiffness: 50, damping: 30 });
  const springY = useSpring(yTransform, { stiffness: 50, damping: 30 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  // Handle mouse movements for the entire container
  const handleContainerMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Calculate mouse position relative to container
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });

    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
  };

  // Handle the 3D tilt effect on individual card hover
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, id: number) => {
    setHoveredId(id);

    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;

    // Holographic effect - adjust the background position based on mouse
    const gradientX = (x / rect.width) * 100;
    const gradientY = (y / rect.height) * 100;
    card.style.backgroundPosition = `${gradientX}% ${gradientY}%`;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    setHoveredId(null);

    const card = e.currentTarget;
    card.style.transform =
      "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
    card.style.backgroundPosition = "center";
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < rating ? "text-[#16db65]" : "text-gray-600"}`}
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-black py-24 overflow-hidden"
      onMouseMove={handleContainerMouseMove}
    >
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute w-full h-full bg-gradient-to-br from-black via-gray-900 to-black opacity-80"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          {/* Grid lines */}
          <div className="grid grid-cols-12 h-full opacity-20">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="border-l border-[#16db65]/30 h-full"
              ></div>
            ))}
          </div>
          <div className="grid grid-rows-12 w-full h-full opacity-20">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="border-t border-[#16db65]/30 w-full"
              ></div>
            ))}
          </div>
        </div>

        {/* Floating particles - enhanced with more particles and smoother animations */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-[#16db65]"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.2,
                scale: Math.random() * 0.5 + 0.5,
              }}
              animate={{
                y: [0, Math.random() * -30 - 10, 0],
                opacity: [0.2, 0.6, 0.2],
                scale: [1, Math.random() * 0.5 + 1, 1],
              }}
              transition={{
                duration: Math.random() * 4 + 3,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "easeInOut",
              }}
            ></motion.div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            User <span className="text-[#16db65]">Testimonials</span>
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-[#16db65]/0 via-[#16db65] to-[#16db65]/0 mx-auto mb-6"></div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            See what our users are saying about the GrindFuel experience and how
            it's powering their performance.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          style={{
            x: springX,
            y: springY,
          }}
        >
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              className={`review-card relative ${
                hoveredId === review.id ? "z-20" : "z-10"
              }`}
              initial={{ opacity: 0, y: 50 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div
                className="relative h-full p-6 rounded-lg overflow-hidden transition-all duration-500 ease-out cursor-pointer"
                onMouseMove={(e) => handleMouseMove(e, review.id)}
                onMouseLeave={handleMouseLeave}
                style={{
                  background:
                    "linear-gradient(135deg, rgba(22,219,101,0.05) 0%, rgba(0,0,0,0.3) 50%, rgba(22,219,101,0.05) 100%)",
                  backgroundSize: "200% 200%",
                  backgroundPosition: "center",
                  boxShadow:
                    hoveredId === review.id
                      ? "0 0 25px rgba(22, 219, 101, 0.3), inset 0 0 15px rgba(22, 219, 101, 0.2)"
                      : "0 0 15px rgba(22, 219, 101, 0.2), inset 0 0 15px rgba(22, 219, 101, 0.1)",
                  backdropFilter: "blur(5px)",
                  border: "1px solid rgba(22, 219, 101, 0.2)",
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Holographic overlay */}
                <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-transparent via-[#16db65] to-transparent pointer-events-none blur-sm"></div>

                {/* Corner accents */}
                <div className="absolute top-0 right-0 w-10 h-1 bg-[#16db65]"></div>
                <div className="absolute top-0 right-0 w-1 h-10 bg-[#16db65]"></div>
                <div className="absolute bottom-0 left-0 w-10 h-1 bg-[#16db65]"></div>
                <div className="absolute bottom-0 left-0 w-1 h-10 bg-[#16db65]"></div>

                {/* Content */}
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      {review.avatar ? (
                        <div className="mr-3 relative">
                          <div className="w-12 h-12 rounded-full overflow-hidden border border-[#16db65]/40">
                            <img
                              src={`https://avatar.iran.liara.run/public/${Math.floor(
                                Math.random() * 100
                              )}`}
                              alt={review.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#16db65]/0 via-[#16db65]/20 to-transparent pointer-events-none"></div>
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mr-3 border border-[#16db65]/40">
                          <span className="text-[#16db65] font-bold text-lg">
                            {review.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <h4 className="text-white font-semibold text-lg">
                          {review.name}
                        </h4>
                        <p className="text-gray-400 text-sm">{review.role}</p>
                      </div>
                    </div>
                    <div className="bg-black/40 px-2 py-1 rounded text-xs text-gray-400 backdrop-blur-sm">
                      {new Date(review.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                      })}
                    </div>
                  </div>

                  <div className="flex mb-3">{renderStars(review.rating)}</div>

                  <p className="text-gray-300 mb-4 relative">
                    "{review.comment}"
                    <span className="absolute -left-3 top-0 text-3xl text-[#16db65]/20">
                      "
                    </span>
                    <span className="absolute -right-3 bottom-0 text-3xl text-[#16db65]/20">
                      "
                    </span>
                  </p>

                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                      Verified Purchase
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-[#16db65] hover:text-white transition-colors text-sm">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                          />
                        </svg>
                      </button>
                      <button className="text-gray-500 hover:text-white transition-colors text-sm">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Scan lines effect */}
                <div
                  className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-transparent opacity-20 pointer-events-none"
                  style={{ backgroundSize: "100% 4px" }}
                ></div>

                {/* Enhanced glow effect on hover */}
                <motion.div
                  className="absolute inset-0 rounded-lg pointer-events-none bg-gradient-to-tr from-[#16db65]/0 via-[#16db65]/10 to-[#16db65]/0"
                  animate={{
                    opacity: hoveredId === review.id ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                ></motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-16 text-center">
          <button className="px-8 py-3 rounded-lg bg-black border border-[#16db65] text-[#16db65] hover:bg-[#16db65]/10 transition-all duration-300 relative group">
            <span className="relative z-10">View All Reviews</span>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-[#16db65]/0 via-[#16db65]/20 to-[#16db65]/0 rounded-lg transition-opacity duration-300 pointer-events-none"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HolographicReviews;
