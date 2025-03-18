"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/navbar";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import Footer from "@/components/footer";

export default function About() {
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const opacitySection2 = useTransform(scrollYProgress, [0.1, 0.2], [0, 1]);
  const opacitySection3 = useTransform(scrollYProgress, [0.3, 0.4], [0, 1]);
  const opacitySection4 = useTransform(scrollYProgress, [0.5, 0.6], [0, 1]);
  const opacitySection5 = useTransform(scrollYProgress, [0.7, 0.8], [0, 1]);

  useEffect(() => {
    setIsLoaded(true);

    // Power-up sound effect could go here
    // const powerUpSound = new Audio('/sounds/power-up.mp3');
    // powerUpSound.volume = 0.4;
    // powerUpSound.play();
  }, []);

  const targetAudience = [
    {
      icon: "🎮",
      title: "GAMERS",
      description: "Sharpen reflexes, maintain focus, dominate the leaderboard",
    },
    {
      icon: "💪",
      title: "ATHLETES",
      description: "Maximize endurance, accelerate recovery, push your limits",
    },
    {
      icon: "💼",
      title: "HUSTLERS",
      description: "Sustain productivity, defeat burnout, achieve more",
    },
    {
      icon: "🌙",
      title: "NIGHT OWLS",
      description: "Stay alert, maintain clarity, own the night",
    },
    {
      icon: "🎨",
      title: "CREATORS",
      description: "Fuel creativity, overcome blocks, bring visions to life",
    },
  ];

  const productFeatures = [
    {
      title: "HYDRATION INFUSED WITH PERFORMANCE",
      description:
        "Electrolytes, vitamins, and minerals that optimize neural pathways and muscle function",
      icon: "💧",
    },
    {
      title: "SNACKS THAT POWER MOVES",
      description:
        "Protein-packed, nutrient-dense fuel designed for sustained energy and quick thinking",
      icon: "🍫",
    },
    {
      title: "CLEAN ENERGY WITHOUT THE CRASH",
      description:
        "Natural caffeine, L-theanine, and adaptogens for smooth energy that lasts",
      icon: "⚡",
    },
    {
      title: "FOCUS AMPLIFIERS",
      description:
        "Nootropic compounds that enhance concentration and reaction time",
      icon: "🔬",
    },
    {
      title: "RECOVERY ACCELERATORS",
      description:
        "Specialized formulas that reduce downtime and keep you in the game longer",
      icon: "🔄",
    },
  ];

  return (
    <div
      className="bg-black text-white min-h-screen overflow-x-hidden"
      ref={containerRef}
    >
      <Navbar />

      {/* Energy pulse background effect */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-black">
          <div className="absolute inset-0 bg-gradient-to-b from-green-900/10 via-black to-black"></div>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-green-300 to-green-500 animate-pulse"></div>
        </div>
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-green-500 rounded-full filter blur-[100px] opacity-20 animate-pulse"></div>
        <div
          className="absolute top-1/3 -right-20 w-60 h-60 bg-green-400 rounded-full filter blur-[100px] opacity-10 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="z-10 max-w-5xl mx-auto"
        >
          <div className="flex justify-center mb-8">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 bg-green-500 rounded-full opacity-20 animate-ping"></div>
              <div className="relative flex items-center justify-center w-24 h-24 bg-black border-2 border-green-400 rounded-full shadow-lg shadow-green-500/20">
                <span className="text-4xl">⚡</span>
              </div>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-200">
              ABOUT GRINDFUEL
            </span>
            <span className="block text-2xl md:text-3xl mt-2 text-green-400 animate-pulse">
              POWERING THE UNSTOPPABLE
            </span>
          </h1>

          <div className="inline-block mb-8 border border-green-500/30 rounded-lg px-6 py-2 bg-green-500/5">
            <div className="flex items-center space-x-2 text-green-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="font-mono font-bold tracking-wide">
                SYSTEM STATUS: PEAK PERFORMANCE
              </span>
            </div>
          </div>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
            <span className="text-green-400 font-semibold">
              FUELING THE RELENTLESS
            </span>{" "}
            SINCE DAY ZERO
          </p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1.5 }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-green-400 animate-bounce"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </motion.div>
        </motion.div>
      </section>

      {/* What Drives Us Section */}
      <motion.section
        style={{ opacity: opacitySection2 }}
        className="relative py-20 px-4"
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-transparent rounded-xl -z-10"></div>
              <div className="bg-black border border-green-500/30 p-6 rounded-xl shadow-lg shadow-green-500/10">
                <h2 className="text-3xl font-bold mb-2 flex items-center">
                  <span className="text-green-400 mr-3">🔥</span>
                  WHAT DRIVES US?
                </h2>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  You're not just here to play—you're here to{" "}
                  <span className="text-green-400 font-bold">dominate</span>. At
                  GrindFuel, we believe that every second counts, every move
                  matters, and every game, workout, or grind session is a
                  battlefield.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Your energy should be as limitless as your ambition. That's
                  why we engineered a lineup of high-performance hydration,
                  snacks, and energy boosters designed to{" "}
                  <span className="text-green-400 font-bold">
                    keep you in the zone—no crashes, no compromises.
                  </span>
                </p>
              </div>
            </div>

            <div className="md:w-1/2 relative h-80 md:h-96">
              {/* Placeholder for a gaming/energy drink image */}
              <div className="absolute inset-0 bg-gradient-to-tr from-green-500/30 via-green-400/10 to-transparent rounded-xl">
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-xl"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-8xl">🎮</div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/80 rounded-b-xl">
                  <div className="h-1.5 w-full bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-400 to-green-300 w-[85%] rounded-full animate-pulse"></div>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-green-400 font-mono">
                    <span>ENERGY LEVEL</span>
                    <span>85%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Built For Section */}
      <motion.section
        style={{ opacity: opacitySection3 }}
        className="py-20 px-4 relative"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black via-green-900/10 to-black -z-10"></div>

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="inline-block text-3xl font-bold mb-4 pb-2 border-b-2 border-green-400">
              <span className="text-white">BUILT FOR THE ONES WHO GO </span>
              <span className="text-green-400">BEYOND</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {targetAudience.map((audience, index) => (
              <motion.div
                key={audience.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-black border border-green-500/30 rounded-xl p-6 shadow-lg hover:shadow-green-500/20 hover:border-green-400 transition-all duration-300 group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {audience.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-green-400">
                  {audience.title}
                </h3>
                <p className="text-gray-400 text-sm">{audience.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              You don't stop, and neither should your fuel. Whether you're in an
              intense ranked match, pushing through a brutal gym session, or
              pulling an all-night to chase your next big win, GrindFuel is the
              difference between{" "}
              <span className="text-gray-500">good enough</span> and{" "}
              <span className="text-green-400 font-bold">unstoppable</span>.
            </p>

            <p className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto">
              Each formula is crafted to sustain{" "}
              <span className="text-green-400 font-bold">
                focus, endurance, and peak performance
              </span>{" "}
              without the artificial junk that drags you down. Think
              lightning-fast reflexes, laser-sharp concentration, and the
              endurance to{" "}
              <span className="text-green-400 font-bold">
                outlast and outplay
              </span>
              .
            </p>
          </div>
        </div>
      </motion.section>

      {/* The GrindFuel Formula Section */}
      <motion.section
        style={{ opacity: opacitySection4 }}
        className="py-20 px-4 relative"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-2">
              <span className="text-white">THE GRINDFUEL </span>
              <span className="text-green-400">FORMULA</span>
            </h2>
            <p className="text-xl text-gray-400">MORE THAN A BOOST</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {productFeatures.map((feature, index) => (
              <div key={feature.title} className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-green-500/10 to-transparent rounded-lg -z-10"></div>
                <div className="bg-black border border-green-500/30 rounded-lg p-6 h-full flex flex-col">
                  <div className="text-3xl mb-4">{feature.icon}</div>
                  <h3 className="text-sm font-bold mb-3 text-green-400 leading-tight">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm flex-grow">
                    {feature.description}
                  </p>

                  <div className="mt-4 h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-400 rounded-full"
                      style={{ width: `${100 - index * 5}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Mission Section */}
      <motion.section
        style={{ opacity: opacitySection5 }}
        className="py-20 px-4 relative"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-green-900/5 to-black -z-10"></div>

        <div className="max-w-4xl mx-auto bg-black border border-green-500/30 rounded-xl p-8 md:p-12 shadow-lg shadow-green-500/10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-green-300"></div>

          <h2 className="text-3xl font-bold mb-6 flex items-center">
            <span className="text-green-400 mr-3">🚀</span>
            OUR MISSION: FUEL THE GRIND, DEFY THE LIMITS
          </h2>

          <p className="text-gray-300 mb-6 leading-relaxed">
            GrindFuel isn't just a brand—it's a movement. We stand for those who
            refuse to back down, who chase greatness in every game, every set,
            every grind session. We're here to fuel the future legends, the
            late-night warriors, the elite performers.
          </p>

          <div className="bg-green-500/5 border border-green-500/30 rounded-lg p-6 mb-8">
            <p className="text-xl text-center font-bold text-white">
              If you're ready to break limits, power up, and stay ahead—welcome
              to GrindFuel.
            </p>
          </div>

          <p className="text-gray-300 leading-relaxed">
            <span className="text-green-400 font-bold">
              This isn't just energy.
            </span>{" "}
            This is endurance. This is focus. This is the fuel for the
            unstoppable.
          </p>

          <div className="mt-12 space-y-4 font-mono text-sm">
            <div className="flex items-center space-x-2 text-green-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>SYSTEM CHECK: ALL LEVELS MAXED</span>
            </div>
            <div className="flex items-center space-x-2 text-green-400">
              <div
                className="w-2 h-2 bg-green-400 rounded-full animate-pulse"
                style={{ animationDelay: "0.5s" }}
              ></div>
              <span>GRINDFUEL STATUS: ACTIVATED</span>
            </div>
            <div className="flex items-center space-x-2 text-green-400">
              <div
                className="w-2 h-2 bg-green-400 rounded-full animate-pulse"
                style={{ animationDelay: "1s" }}
              ></div>
              <span>NOW LOADING: YOUR NEXT MOVE</span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <section className="py-20 px-4 text-center relative">
        <div className="max-w-3xl mx-auto">
          <div className="inline-block mb-8 animate-pulse">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L4 6V12L12 16L20 12V6L12 2Z"
                stroke="#4ade80"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4 12V18L12 22L20 18V12"
                stroke="#4ade80"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 22V16"
                stroke="#4ade80"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 16L4 12"
                stroke="#4ade80"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 16L20 12"
                stroke="#4ade80"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h2 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-200">
            READY TO POWER UP?
          </h2>

          <p className="text-xl text-gray-300 mb-10">
            Join the ranks of the unstoppable. Experience the GrindFuel
            difference.
          </p>

          <a
            href="/products"
            className="inline-block bg-black border-2 border-green-400 text-green-400 py-4 px-10 rounded-md text-lg font-bold hover:bg-green-400/10 transition-colors duration-300 group relative overflow-hidden"
          >
            <span className="absolute inset-0 w-0 bg-green-400/10 transition-all duration-500 ease-out group-hover:w-full"></span>
            <span className="relative flex items-center justify-center">
              EXPLORE PRODUCTS
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </span>
          </a>
        </div>
        <div className="mt-24">
          <Footer />
        </div>
      </section>

      {/* Add required styles */}
      <style jsx global>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        @keyframes gradientFlow {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animate-pulse {
          animation: pulse 2s infinite;
        }

        .bg-gradient-animate {
          background-size: 200% 200%;
          animation: gradientFlow 5s ease infinite;
        }
      `}</style>
    </div>
  );
}
