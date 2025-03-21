"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Link from "next/link";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef<HTMLDivElement>(null);
  const contentLayerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Three.js variables
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particlesRef = useRef<THREE.Object3D[]>([]);
  const textBoundsRef = useRef<{
    top: number;
    bottom: number;
    left: number;
    right: number;
  } | null>(null);
  const frameIdRef = useRef<number | null>(null);
  const orbModelRef = useRef<THREE.Group | null>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);

  useEffect(() => {
    // Initialize ScrollTrigger for the footer content
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: footerRef.current,
        start: "top bottom",
        end: "top 50%",
        scrub: 1,
      },
    });

    // Animate the content layer coming up
    tl.fromTo(
      contentLayerRef.current,
      { y: "100%" },
      { y: "0%", duration: 1, ease: "power2.out" }
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());

      // Clean up Three.js
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }

      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  // Set up Three.js scene
  useEffect(() => {
    if (!canvasRef.current || !headingRef.current) return;

    // Initialize scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = null; // Transparent background

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    cameraRef.current = camera;
    camera.position.z = 5;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });
    rendererRef.current = renderer;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x16db65, 2, 100);
    pointLight.position.set(0, 5, 5);
    scene.add(pointLight);

    // Load the energy orb model
    const loader = new GLTFLoader();
    loader.load("/models/energy_orb.glb", (gltf) => {
      orbModelRef.current = gltf.scene;

      // Make the model emissive/glowy
      gltf.scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (child.material) {
            // Clone the material to avoid sharing
            if (Array.isArray(child.material)) {
              child.material = child.material.map((mat) => {
                const newMat = mat.clone();
                newMat.emissive = new THREE.Color(0x16db65);
                newMat.emissiveIntensity = 0.7;
                return newMat;
              });
            } else {
              child.material = child.material.clone();
              child.material.emissive = new THREE.Color(0x16db65);
              child.material.emissiveIntensity = 0.7;
            }
          }
        }
      });

      setModelsLoaded(true);

      // Wait for the heading to be fully rendered then create particles
      setTimeout(() => {
        if (!headingRef.current) return;

        // Get actual screen position of the heading element for collision detection
        const headingRect = headingRef.current.getBoundingClientRect();
        const canvasRect = canvasRef.current!.getBoundingClientRect();

        // Calculate and store text boundaries (for Three.js space)
        // Convert from pixel coordinates to normalized device coordinates (-1 to 1)
        textBoundsRef.current = {
          top:
            -((headingRect.top - canvasRect.top) / canvasRect.height) * 2 + 1,
          bottom:
            -((headingRect.bottom - canvasRect.top) / canvasRect.height) * 2 +
            1,
          left:
            ((headingRect.left - canvasRect.left) / canvasRect.width) * 2 - 1,
          right:
            ((headingRect.right - canvasRect.left) / canvasRect.width) * 2 - 1,
        };

        console.log("Text bounds:", textBoundsRef.current);

        // Create particles with the loaded model
        createParticles();

        // Start animation loop
        animate();
      }, 500); // Wait for DOM to settle
    });

    // Handle window resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;

      // Update camera
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();

      // Update renderer
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);

      // Update text bounds
      if (headingRef.current) {
        const headingRect = headingRef.current.getBoundingClientRect();
        const canvasRect = canvasRef.current!.getBoundingClientRect();

        textBoundsRef.current = {
          top:
            -((headingRect.top - canvasRect.top) / canvasRect.height) * 2 + 1,
          bottom:
            -((headingRect.bottom - canvasRect.top) / canvasRect.height) * 2 +
            1,
          left:
            ((headingRect.left - canvasRect.left) / canvasRect.width) * 2 - 1,
          right:
            ((headingRect.right - canvasRect.left) / canvasRect.width) * 2 - 1,
        };
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);

      // Clean up
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }

      particlesRef.current.forEach((particle) => {
        if (particle.parent) {
          particle.parent.remove(particle);
        }
      });

      particlesRef.current = [];
    };
  }, []);

  // Create particles from the loaded model
  const createParticles = () => {
    if (!orbModelRef.current || !sceneRef.current) return;

    // Create multiple particles
    for (let i = 0; i < 30; i++) {
      // Clone the model for each particle
      const particle = orbModelRef.current.clone();

      // Scale down the model
      const scale = 0.1 + Math.random() * 0.1; // Random scale between 0.1 and 0.2
      particle.scale.set(scale, scale, scale);

      // Random starting position (above the visible area)
      particle.position.x = (Math.random() - 0.5) * 6;
      particle.position.y = Math.random() * 5 + 3; // Start above
      particle.position.z = (Math.random() - 0.5) * 2;

      // Store velocity for animation
      particle.userData.velocity = {
        x: (Math.random() - 0.5) * 0.03,
        y: -0.02 - Math.random() * 0.02, // Fall down
        z: (Math.random() - 0.5) * 0.01,
      };

      // Store rotation speed
      particle.userData.rotation = {
        x: (Math.random() - 0.5) * 0.04,
        y: (Math.random() - 0.5) * 0.04,
        z: (Math.random() - 0.5) * 0.04,
      };

      // Randomize color variations
      particle.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          // Pick a color: green, orange, or white with green glow
          const colorOptions = [
            0x16db65, // Green
            0xff4900, // Orange
            0xffffff, // White (with green emissive)
          ];
          const colorIndex = Math.floor(Math.random() * colorOptions.length);

          if (Array.isArray(child.material)) {
            child.material.forEach((mat) => {
              mat.color.setHex(colorOptions[colorIndex]);
            });
          } else {
            child.material.color.setHex(colorOptions[colorIndex]);
          }
        }
      });

      // Store original y position for reset
      particle.userData.originalY = particle.position.y;

      // Add to scene
      sceneRef.current.add(particle);
      particlesRef.current.push(particle);
    }
  };

  // Animation loop
  const animate = () => {
    if (
      !sceneRef.current ||
      !cameraRef.current ||
      !rendererRef.current ||
      !textBoundsRef.current
    ) {
      frameIdRef.current = requestAnimationFrame(animate);
      return;
    }

    // Update particles
    particlesRef.current.forEach((particle) => {
      // Update position based on velocity
      particle.position.x += particle.userData.velocity.x;
      particle.position.y += particle.userData.velocity.y;
      particle.position.z += particle.userData.velocity.z;

      // Update rotation
      particle.rotation.x += particle.userData.rotation.x;
      particle.rotation.y += particle.userData.rotation.y;
      particle.rotation.z += particle.userData.rotation.z;

      // Collision with text
      const { top, bottom, left, right } = textBoundsRef.current!;

      // Calculate particle bounds in normalized coordinates
      const particleX = particle.position.x;
      const particleY = particle.position.y;
      const particleSize = 0.2; // Approximate size of particle

      // Check if particle is within the text bounds horizontally
      const inHorizontalBounds =
        particleX + particleSize > left && particleX - particleSize < right;

      // Check for collision with top of text
      if (
        inHorizontalBounds &&
        particleY - particleSize <= top &&
        particleY + particleSize >= top &&
        particle.userData.velocity.y < 0
      ) {
        // Bounce off top of text
        particle.userData.velocity.y *= -0.7; // Bounce with energy loss
        particle.userData.velocity.x += (Math.random() - 0.5) * 0.04; // Add some randomness

        // Increase rotation for visual effect
        particle.userData.rotation.x *= 1.2;
        particle.userData.rotation.z *= 1.2;

        // console.log("Top collision detected!");
      }

      // Check for collision with bottom of text
      if (
        inHorizontalBounds &&
        particleY + particleSize >= bottom &&
        particleY - particleSize <= bottom &&
        particle.userData.velocity.y > 0
      ) {
        // Bounce off bottom of text
        particle.userData.velocity.y *= -0.7;
        particle.userData.velocity.x += (Math.random() - 0.5) * 0.04;

        // Increase rotation for visual effect
        particle.userData.rotation.x *= 1.2;
        particle.userData.rotation.z *= 1.2;

        // console.log("Bottom collision detected!");
      }

      // Check for collision with left edge of text
      if (
        particleY < top &&
        particleY > bottom &&
        particleX + particleSize >= left &&
        particleX - particleSize <= left &&
        particle.userData.velocity.x > 0
      ) {
        // Bounce off left edge
        particle.userData.velocity.x *= -0.7;

        // Increase rotation for visual effect
        particle.userData.rotation.y *= 1.2;

        // console.log("Left collision detected!");
      }

      // Check for collision with right edge of text
      if (
        particleY < top &&
        particleY > bottom &&
        particleX - particleSize <= right &&
        particleX + particleSize >= right &&
        particle.userData.velocity.x < 0
      ) {
        // Bounce off right edge
        particle.userData.velocity.x *= -0.7;

        // Increase rotation for visual effect
        particle.userData.rotation.y *= 1.2;

        // console.log("Right collision detected!");
      }

      // Bounce off floor (bottom of screen)
      if (particle.position.y < -2) {
        // Less elastic bounce on floor (more energy loss)
        particle.userData.velocity.y *= -0.5;
        particle.position.y = -2 + 0.01; // Prevent sticking to floor

        // Dampen horizontal movement on floor collision
        particle.userData.velocity.x *= 0.9;

        // If particle is moving very slowly after bounce, give it a small boost
        if (Math.abs(particle.userData.velocity.y) < 0.01) {
          particle.userData.velocity.y -= 0.005;
        }
      }

      // Bounce off walls (sides of screen)
      if (particle.position.x < -5 || particle.position.x > 5) {
        particle.userData.velocity.x *= -0.8;
      }

      // Apply gravity
      particle.userData.velocity.y -= 0.001;

      // Reset particle if it falls too far below or has very low energy
      if (
        particle.position.y < -10 ||
        (Math.abs(particle.userData.velocity.y) < 0.003 &&
          particle.position.y < -1.9)
      ) {
        particle.position.y = particle.userData.originalY;
        particle.position.x = (Math.random() - 0.5) * 6;

        // Reset velocity
        particle.userData.velocity = {
          x: (Math.random() - 0.5) * 0.03,
          y: -0.02 - Math.random() * 0.02,
          z: (Math.random() - 0.5) * 0.01,
        };
      }

      // Fade based on y position
      const opacity = 1 - Math.min(1, Math.max(0, -particle.position.y / 8));
      particle.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((mat) => {
              mat.transparent = true;
              mat.opacity = opacity;
            });
          } else {
            child.material.transparent = true;
            child.material.opacity = opacity;
          }
        }
      });
    });

    // Render scene
    rendererRef.current.render(sceneRef.current, cameraRef.current);

    // Continue animation loop
    frameIdRef.current = requestAnimationFrame(animate);
  };

  return (
    <footer
      ref={footerRef}
      className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-black via-black to-black"
    >
      {/* Three.js Canvas (absolute positioned) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10 pointer-events-none"
      />

      {/* Base layer */}
      <div className="absolute inset-0 bg-black/80 z-0"></div>

      {/* Content layer that slides up */}
      <div
        ref={contentLayerRef}
        className="absolute inset-0 flex flex-col justify-between px-6 py-12 md:px-12 lg:px-24 z-20"
      >
        {/* Top part with brand name */}
        <div className="flex-grow flex items-center justify-center">
          <h1
            ref={headingRef}
            className="text-[18vw] font-extrabold text-[#16db65] leading-none tracking-tighter"
          >
            Grind-Fuel
          </h1>
        </div>

        {/* Bottom part with footer info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-white/20 pt-8">
          <div className="space-y-2">
            <h3 className="text-[#16db65] font-bold text-lg">CONNECT</h3>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-[#16db65] transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-[#16db65] transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-[#16db65] transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="text-white/80">
            <h3 className="text-[#16db65] font-bold text-lg">LOCATION</h3>
            <p>New York, NY</p>
            <p>United States</p>
          </div>

          <div className="text-white/80 flex flex-col items-start md:items-end justify-start">
            <h3 className="text-[#16db65] font-bold text-lg">CONTACT</h3>
            <a
              href="mailto:hello@grindfuel.com"
              className="hover:text-white transition-colors"
            >
              hello@grindfuel.com
            </a>
            <a
              href="tel:+1234567890"
              className="hover:text-white transition-colors"
            >
              +1 (234) 567-890
            </a>
          </div>
        </div>

        <div className="mt-12 text-white/60 text-center md:text-left text-sm">
          <p>© {new Date().getFullYear()} GrindFuel. All rights reserved.</p>
          <p className="mt-1">Fuel your focus. Energize your grind.</p>
        </div>
      </div>
    </footer>
  );
}
