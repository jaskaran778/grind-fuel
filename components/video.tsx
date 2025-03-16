"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const BgVideo = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Ensure the video loops
    if (videoRef.current) {
      videoRef.current.loop = true;
      videoRef.current.muted = true;
      videoRef.current.play().catch((error) => {
        console.error("Video autoplay failed:", error);
      });
    }

    // GSAP animation for expanding circle on scroll
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 10%", // Start pinning when 10% of the container is in view
        end: "+=200%", // Pin for a full viewport height of scrolling
        scrub: 3, // Requires more scrolling for the animation to complete
        pin: true, // Pin the container
        pinSpacing: true, // Add space for the pinned element
        anticipatePin: 1, // Helps with smoother pinning
        markers: false, // Set to true for debugging
        onEnter: () => {
          console.log("Entered video section");
        },
        onLeaveBack: () => {
          console.log("Left video section (backward)");
        },
        onComplete: () => {
          console.log("Animation completed");
        },
      },
    });

    // Animation sequence - from small circle to full screen
    tl.fromTo(
      circleRef.current,
      {
        width: "120px",
        height: "120px",
        borderRadius: "50%",
        opacity: 0.8,
      },
      {
        width: "100vw",
        height: "100vh",
        borderRadius: "0%",
        opacity: 1,
        duration: 1,
        // ease: "power2.inOut",
      }
    );

    // Rotation animation for the text
    gsap.to(textRef.current, {
      rotation: 360,
      duration: 15,
      repeat: -1,
      ease: "linear",
    });

    return () => {
      // Clean up ScrollTrigger
      if (tl.scrollTrigger) {
        tl.scrollTrigger.kill();
      }
    };
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch((error) => {
          console.error("Video play failed:", error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div
      className="relative min-h-screen bg-black flex items-center justify-center overflow-hidden"
      ref={containerRef}
    >
      <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden">
        <div className="sticky top-0 h-screen w-full flex items-center justify-center">
          {/* Video Circle */}
          <div
            className="overflow-hidden transition-all duration-500 shadow-[0_0_30px_rgba(22,219,101,0.3)]"
            ref={circleRef}
            style={{ borderRadius: "50%" }}
          >
            <video
              ref={videoRef}
              className="w-full h-full object-cover scale-150"
              src="/drinkin.mp4"
              playsInline
              autoPlay
              loop
              muted
            />

            {/* Play Button */}
            <div
              className="absolute inset-0 flex items-center justify-center cursor-pointer"
              onClick={togglePlay}
            >
              <div className="bg-black/50 backdrop-blur-sm rounded-full p-6 border border-[#16db65]/30 transition-transform duration-300 hover:scale-110 hover:bg-black/70">
                <svg
                  className="w-16 h-16 text-[#16db65]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isPlaying ? (
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  ) : (
                    <path d="M8 5v14l11-7z" />
                  )}
                </svg>
              </div>
            </div>

            {/* Rotating Text */}
            <div
              ref={textRef}
              className="absolute inset-0 pointer-events-none flex items-center justify-center"
            >
              <div className="w-[200px] h-[200px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <svg viewBox="0 0 200 200" width="200" height="200">
                  <defs>
                    <path
                      id="textPath"
                      d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
                      fill="none"
                    />
                  </defs>
                  <text className="text-[#16db65] font-bold uppercase tracking-widest text-xl">
                    <textPath xlinkHref="#textPath" startOffset="0%">
                      PLAY VIDEO • PLAY VIDEO • PLAY VIDEO •
                    </textPath>
                  </text>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Second video circle - smaller and fixed in corner when scrolling past */}
      {/* <div
        className="fixed bottom-8 right-8 z-50 opacity-0"
        ref={(el) => {
          if (el) {
            gsap
              .timeline({
                scrollTrigger: {
                  trigger: containerRef.current,
                  start: "bottom 70%",
                  end: "bottom top",
                  scrub: true,
                  toggleActions: "play none none reverse",
                },
              })
              .fromTo(
                el,
                { opacity: 0, scale: 0.5 },
                { opacity: 1, scale: 1, duration: 0.5 }
              );
          }
        }}
      >
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#16db65] shadow-[0_0_15px_rgba(22,219,101,0.5)]">
          <video
            className="w-full h-full object-cover scale-150"
            src="/drinkin.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
        </div>
      </div> */}

      {/* Content to scroll through */}
      <div className="h-[200vh] w-full pointer-events-none"></div>
    </div>
  );
};

export default BgVideo;
