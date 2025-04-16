"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

// Define types for form fields
type FieldName = "name" | "email" | "message" | null;

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [scanline, setScanline] = useState(false);
  const [glitchText, setGlitchText] = useState(false);
  const [currentField, setCurrentField] = useState<FieldName>(null);
  const [cursorBlink, setCursorBlink] = useState(true);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  // Glitch effect for header
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchText(true);
      setTimeout(() => setGlitchText(false), 150);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Scanline effect
  useEffect(() => {
    const interval = setInterval(() => {
      setScanline((prev) => !prev);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Terminal cursor blink
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorBlink((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll message field when typing
  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollTop = messageRef.current.scrollHeight;
    }
  }, [formData.message]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    // Add terminal typing sound effect here if desired
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulate form submission with a delay
    setTimeout(() => {
      // 5% chance of simulated error for realism
      if (Math.random() < 0.05) {
        setError("ERROR: TRANSMISSION FAILED. RETRY SEQUENCE INITIATED.");
      } else {
        setSubmitted(true);
        setFormData({ name: "", email: "", message: "" });
      }
      setLoading(false);
    }, 1200); // Simulate network delay
  };

  return (
    <div className="bg-black min-h-screen text-white overflow-hidden">
      <Navbar />

      {/* CRT scanline effect */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-10 ">
        <div
          className={`w-full h-2 bg-green-400/30 absolute  ${
            scanline ? "top-0" : ""
          }`}
          style={{
            animation: "scanline 8s linear infinite",
            boxShadow: "0 0 15px rgba(0, 255, 123, 0.5)",
          }}
        ></div>
      </div>

      {/* Background grid with glow */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 255, 123, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 123, 0.2) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
          backgroundPosition: "center center",
          animation: "gridPulse 15s infinite",
        }}
      ></div>

      <div className="relative z-10 container mx-auto px-4 py-12 mt-12">
        {/* Glitchy header */}
        <div className="text-center mb-10 relative">
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-green-400/70 font-mono">
            [Connect with Us. Power Up Your Grind!]
          </div>

          <h1
            className={`text-5xl font-bold mb-6 inline-block ${
              glitchText ? "glitch-text" : ""
            }`}
            style={{
              fontFamily: "'Press Start 2P', monospace",
              color: "#00ff7b",
              textShadow:
                "0 0 10px rgba(0, 255, 123, 0.8), 0 0 20px rgba(0, 255, 123, 0.4)",
              letterSpacing: "1px",
              transform: glitchText ? "skew(-5deg)" : "none",
              transition: "transform 0.1s",
            }}
          >
            <span className="text-white/80">:</span>
            <span className="text-white/80">/</span>
            <span className="text-white/80">/</span>
            Contact-Us<span className="animate-pulse">_</span>
          </h1>

          <div className="flex justify-center items-center mb-2 space-x-2 text-xs text-green-400/80 font-mono">
            <div className="h-[2px] w-8 bg-green-400/60"></div>
            <p>ESTABLISHING ENCRYPTED CHANNEL...</p>
            <div className="h-[2px] w-8 bg-green-400/60"></div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto relative">
          {/* Terminal window frame */}
          <div className="absolute -top-6 left-0 right-0 h-6 bg-gradient-to-r from-green-900/20 via-green-400/30 to-green-900/20 rounded-t-md flex items-center px-3">
            <div className="w-3 h-3 rounded-full bg-red-500/80 mr-2"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80 mr-2"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80 mr-4"></div>
            {/* <div className="text-[10px] text-green-300/90 font-mono flex-1 text-center">SECURE-TRANSMISSION-MODULE</div> */}
          </div>

          <div className="relative rounded-md z-10 border border-green-400/70 bg-black shadow-lg overflow-hidden">
            {/* Terminal window inner shadow */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 to-transparent opacity-50 pointer-events-none"></div>

            {/* Subtle CRT flicker */}
            <div className="absolute inset-0 opacity-20 pointer-events-none animate-[flicker_5s_infinite]"></div>

            {/* Terminal content */}
            <div
              className="p-6 relative overflow-hidden"
              style={{
                background:
                  "linear-gradient(180deg, rgba(0,20,0,0.9) 0%, rgba(0,10,0,0.95) 100%)",
                boxShadow:
                  "inset 0 0 30px rgba(0, 0, 0, 0.8), 0 0 15px rgba(0, 255, 123, 0.5)",
              }}
            >
              {submitted ? (
                <div className="text-center py-10 animate-fadeIn space-y-6">
                  <div className="inline-block p-4 rounded-full bg-green-400/10 border-2 border-green-400/50 mb-6">
                    <svg
                      className="w-16 h-16 text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  </div>

                  <div className="space-y-2">
                    <h2
                      className="text-2xl font-bold text-green-400"
                      style={{
                        textShadow: "0 0 10px rgba(0, 255, 123, 0.5)",
                        fontFamily: "'Press Start 2P', monospace",
                      }}
                    >
                      TRANSMISSION SUCCESSFUL
                    </h2>

                    <div className="flex justify-center space-x-1 mt-2">
                      <div className="h-1 w-1 bg-green-400 rounded-full animate-ping"></div>
                      <div
                        className="h-1 w-1 bg-green-400 rounded-full animate-ping"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="h-1 w-1 bg-green-400 rounded-full animate-ping"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </div>

                  <div className="mx-auto max-w-md border border-green-400/40 rounded p-3 bg-black/30 font-mono text-sm text-gray-200/80 text-left">
                    <div className="text-green-400/90 mb-1">
                      {" "}
                      Connection status:
                    </div>
                    <div className="pl-4 mb-3">AWAITING_RESPONSE</div>
                    <div className="text-green-400/90 mb-1">
                      {" "}
                      Estimated response time:
                    </div>
                    <div className="pl-4">&lt; 24 HRS</div>
                  </div>

                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 bg-black border border-green-400 text-green-400 px-8 py-3 rounded-sm font-mono tracking-wider relative overflow-hidden group"
                    style={{
                      boxShadow: "0 0 10px rgba(0, 255, 123, 0.3)",
                    }}
                  >
                    <span className="absolute inset-0 w-0 bg-green-400/10 transition-all duration-300 group-hover:w-full"></span>
                    <span className="relative flex items-center justify-center">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        ></path>
                      </svg>
                      NEW TRANSMISSION
                    </span>
                  </button>
                </div>
              ) : (
                <>
                  {/* Command line style header */}
                  <div className="mb-6 font-mono text-xs text-green-400/70 border-b border-green-400/20 pb-2">
                    <div className="flex items-center space-x-2">
                      {/* <span>root@nexus</span>
                      <span className="text-gray-400">:</span>
                      <span className="text-blue-400">~/comms</span>
                      <span className="text-gray-400">$</span>
                      <span className="text-white/90"> init_transmission</span> */}
                    </div>
                  </div>

                  {/* Terminal style form */}
                  <form onSubmit={handleSubmit} className="space-y-6 relative">
                    <div className="form-group">
                      <label
                        htmlFor="name"
                        className="flex items-center text-green-400 mb-2 font-mono text-sm"
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          ></path>
                        </svg>
                        Full Name:
                      </label>
                      <div className="relative">
                        <div className="absolute left-0 top-0 bottom-0 w-6 flex items-center justify-center text-green-400 opacity-70">
                          &gt;
                        </div>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          onFocus={() => setCurrentField("name")}
                          onBlur={() => setCurrentField(null)}
                          required
                          className="w-full bg-black/50 border border-green-400/40 focus:border-green-400 rounded-none p-2 pl-8 text-white outline-none transition-all duration-300 focus:shadow-[0_0_15px_rgba(0,255,123,0.3)] font-mono text-sm"
                          style={{ caretColor: "#00ff7b" }}
                        />
                        {currentField === "name" && cursorBlink && (
                          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-2 bg-green-400/70"></span>
                        )}
                      </div>
                    </div>

                    <div className="form-group">
                      <label
                        htmlFor="email"
                        className="flex items-center text-green-400 mb-2 font-mono text-sm"
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          ></path>
                        </svg>
                        Email Address:
                      </label>
                      <div className="relative">
                        <div className="absolute left-0 top-0 bottom-0 w-6 flex items-center justify-center text-green-400 opacity-70">
                          &gt;
                        </div>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          onFocus={() => setCurrentField("email")}
                          onBlur={() => setCurrentField(null)}
                          required
                          className="w-full bg-black/50 border border-green-400/40 focus:border-green-400 rounded-none p-2 pl-8 text-white outline-none transition-all duration-300 focus:shadow-[0_0_15px_rgba(0,255,123,0.3)] font-mono text-sm"
                          style={{ caretColor: "#00ff7b" }}
                        />
                        {currentField === "email" && cursorBlink && (
                          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-2 bg-green-400/70"></span>
                        )}
                      </div>
                    </div>

                    <div className="form-group">
                      <label
                        htmlFor="message"
                        className="flex items-center text-green-400 mb-2 font-mono text-sm"
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          ></path>
                        </svg>
                        Message:
                      </label>
                      <div className="relative">
                        <div className="absolute left-0 top-0 h-6 w-6 flex items-center justify-center text-green-400 opacity-70">
                          &gt;
                        </div>
                        <textarea
                          ref={messageRef}
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          onFocus={() => setCurrentField("message")}
                          onBlur={() => setCurrentField(null)}
                          required
                          rows={6}
                          className="w-full bg-black/50 border border-green-400/40 focus:border-green-400 rounded-none p-2 pl-8 text-white outline-none transition-all duration-300 focus:shadow-[0_0_15px_rgba(0,255,123,0.3)] font-mono text-sm resize-none"
                          style={{ caretColor: "#00ff7b" }}
                        ></textarea>
                        {currentField === "message" && cursorBlink && (
                          <span className="absolute right-3 bottom-3 h-4 w-2 bg-green-400/70"></span>
                        )}
                      </div>
                    </div>

                    {error && (
                      <div className="relative overflow-hidden p-3 border-l-4 border-red-500 bg-red-500/10 font-mono text-sm text-red-400 animate-pulse">
                        <div className="absolute top-0 left-0 w-full h-full bg-red-500/5 animate-pulse"></div>
                        <div className="relative">
                          <span className="text-red-500 font-bold">!</span>{" "}
                          {error}
                        </div>
                      </div>
                    )}

                    <div className="relative pt-4 border-t border-green-400/20">
                      <div className="absolute left-0 top-4 font-mono text-xs text-green-400/60">
                        [EXECUTE]
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="ml-auto flex items-center justify-center bg-black border border-green-400/80 text-green-400 py-3 px-8 relative overflow-hidden group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/30 to-green-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 group-hover:animate-gradient-x"></div>

                        <div className="relative flex items-center">
                          {loading ? (
                            <>
                              <svg
                                className="animate-spin -ml-1 mr-3 h-4 w-4 text-green-400"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              <span className="font-mono text-sm tracking-wider">
                                INITIATING...
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="font-mono text-sm tracking-wider">
                                TRANSMIT_DATA
                              </span>
                              <svg
                                className="ml-2 w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                                ></path>
                              </svg>
                            </>
                          )}
                        </div>
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>

          {/* System status indicators */}
          <div className="mt-2 flex justify-between items-center px-1 text-[10px] text-green-400/60 font-mono">
            <div>SYS:ONLINE</div>
            <div className="flex items-center">
              <div className="h-1.5 w-1.5 rounded-full bg-green-400 mr-1 animate-pulse"></div>
              SECURE CONNECTION ACTIVE
            </div>
            <div>{new Date().toISOString().split("T")[0]}</div>
          </div>
        </div>
      </div>
      <Footer />

      {/* Add your necessary styles */}
      <style jsx global>{`
        @keyframes scanline {
          0% {
            top: -100%;
          }
          100% {
            top: 100%;
          }
        }

        @keyframes gridPulse {
          0%,
          100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.3;
          }
        }

        @keyframes flicker {
          0% {
            opacity: 0.2;
          }
          5% {
            opacity: 0.15;
          }
          10% {
            opacity: 0.2;
          }
          15% {
            opacity: 0.15;
          }
          20% {
            opacity: 0.2;
          }
          55% {
            opacity: 0.15;
          }
          60% {
            opacity: 0.2;
          }
          100% {
            opacity: 0.2;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes gradient-x {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 100% 50%;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s forwards;
        }

        .animate-gradient-x {
          animation: gradient-x 1.5s linear infinite;
          background-size: 200% 100%;
        }

        .glitch-text {
          position: relative;
        }

        .glitch-text:before,
        .glitch-text:after {
          content: "NEURAL-LINK _";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .glitch-text:before {
          left: 2px;
          text-shadow: -1px 0 #ff00de;
          clip: rect(24px, 550px, 90px, 0);
          animation: glitch-anim-2 3s infinite linear alternate-reverse;
        }

        .glitch-text:after {
          left: -2px;
          text-shadow: -1px 0 #00fff9;
          clip: rect(85px, 550px, 140px, 0);
          animation: glitch-anim 2.5s infinite linear alternate-reverse;
        }

        @keyframes glitch-anim {
          0% {
            clip: rect(11px, 9999px, 30px, 0);
          }
          5% {
            clip: rect(90px, 9999px, 140px, 0);
          }
          10% {
            clip: rect(38px, 9999px, 4px, 0);
          }
          15% {
            clip: rect(106px, 9999px, 74px, 0);
          }
          20% {
            clip: rect(24px, 9999px, 90px, 0);
          }
          25% {
            clip: rect(85px, 9999px, 140px, 0);
          }
          30% {
            clip: rect(38px, 9999px, 4px, 0);
          }
          35% {
            clip: rect(106px, 9999px, 74px, 0);
          }
          40% {
            clip: rect(24px, 9999px, 90px, 0);
          }
          45% {
            clip: rect(85px, 9999px, 140px, 0);
          }
          50% {
            clip: rect(38px, 9999px, 4px, 0);
          }
          55% {
            clip: rect(106px, 9999px, 74px, 0);
          }
          60% {
            clip: rect(24px, 9999px, 90px, 0);
          }
          65% {
            clip: rect(85px, 9999px, 140px, 0);
          }
          70% {
            clip: rect(38px, 9999px, 4px, 0);
          }
          75% {
            clip: rect(106px, 9999px, 74px, 0);
          }
          80% {
            clip: rect(24px, 9999px, 90px, 0);
          }
          85% {
            clip: rect(85px, 9999px, 140px, 0);
          }
          90% {
            clip: rect(38px, 9999px, 4px, 0);
          }
          95% {
            clip: rect(106px, 9999px, 74px, 0);
          }
          100% {
            clip: rect(11px, 9999px, 30px, 0);
          }
        }

        @keyframes glitch-anim-2 {
          0% {
            clip: rect(66px, 9999px, 90px, 0);
          }
          5% {
            clip: rect(36px, 9999px, 100px, 0);
          }
          10% {
            clip: rect(68px, 9999px, 94px, 0);
          }
          15% {
            clip: rect(6px, 9999px, 24px, 0);
          }
          20% {
            clip: rect(16px, 9999px, 64px, 0);
          }
          25% {
            clip: rect(36px, 9999px, 100px, 0);
          }
          30% {
            clip: rect(68px, 9999px, 94px, 0);
          }
          35% {
            clip: rect(6px, 9999px, 24px, 0);
          }
          40% {
            clip: rect(16px, 9999px, 64px, 0);
          }
          45% {
            clip: rect(36px, 9999px, 100px, 0);
          }
          50% {
            clip: rect(68px, 9999px, 94px, 0);
          }
          55% {
            clip: rect(6px, 9999px, 24px, 0);
          }
          60% {
            clip: rect(16px, 9999px, 64px, 0);
          }
          65% {
            clip: rect(36px, 9999px, 100px, 0);
          }
          70% {
            clip: rect(68px, 9999px, 94px, 0);
          }
          75% {
            clip: rect(6px, 9999px, 24px, 0);
          }
          80% {
            clip: rect(16px, 9999px, 64px, 0);
          }
          85% {
            clip: rect(36px, 9999px, 100px, 0);
          }
          90% {
            clip: rect(68px, 9999px, 94px, 0);
          }
          95% {
            clip: rect(6px, 9999px, 24px, 0);
          }
          100% {
            clip: rect(66px, 9999px, 90px, 0);
          }
        }
      `}</style>
    </div>
  );
}
