"use client";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";

interface TextDistortionEffectProps {
  text?: string;
  textColor?: string;
}

const Zajno: React.FC<TextDistortionEffectProps> = ({
  text = "GrindFuel",
  textColor = "#16db65",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const planeMeshRef = useRef<THREE.Mesh | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Mouse tracking state
  const easeFactor = useRef(0.2);
  const mousePosition = useRef({ x: 0.5, y: 0.5 });
  const targetMousePosition = useRef({ x: 0.5, y: 0.5 });
  const prevPosition = useRef({ x: 0.5, y: 0.5 });
  // Text position state for animation
  const textPosition = useRef({ x: 5.0 }); // Start off-screen to the right

  const vertexShader = `
    varying vec2 vUv;
    uniform float u_textPosX;
    
    void main() {
      vUv = uv;
      // Apply horizontal offset to position
      vec3 pos = position;
      pos.x += u_textPosX;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

  const fragmentShader = `
    varying vec2 vUv;
    uniform sampler2D u_texture;
    uniform vec2 u_mouse;
    uniform vec2 u_prevMouse;

    void main() {
      vec2 gridUV = floor(vUv * vec2(30.0, 30.0)) / vec2(30.0, 30.0);
      vec2 centerOfPixel = gridUV + vec2(1.0 / 30.0, 1.0 / 30.0);
      
      vec2 mouseDirection = u_mouse - u_prevMouse;
      
      vec2 pixelToMouseDirection = centerOfPixel - u_mouse;
      float pixelDistanceToMouse = length(pixelToMouseDirection);
      float strength = smoothstep(0.20, 0.0, pixelDistanceToMouse);
      
      vec2 uvOffset = strength * -mouseDirection * 0.3;
      vec2 uv = vUv - uvOffset;
      
      vec4 color = texture2D(u_texture, uv);
      gl_FragColor = color;
    }
  `;

  const createTextTexture = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;

    // Set canvas dimensions
    const canvasWidth = 2560;
    const canvasHeight = 1440;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Fill background
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Set text properties - using system default font
    const fontSize = Math.floor(canvasWidth * 0.2);
    ctx.fillStyle = textColor;
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Draw text
    ctx.fillText(text, canvasWidth / 2, canvasHeight / 2);

    // Create texture
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    return texture;
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear container
    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(0x000000);
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Create camera
    const aspectRatio = window.innerWidth / window.innerHeight;
    const camera = new THREE.OrthographicCamera(
      -1,
      1,
      1 / aspectRatio,
      -1 / aspectRatio,
      0.1,
      1000
    );
    camera.position.z = 1;
    cameraRef.current = camera;

    // Create text texture
    const texture = createTextTexture();

    // Create shader uniforms with text position parameter
    const uniforms = {
      u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
      u_prevMouse: { value: new THREE.Vector2(0.5, 0.5) },
      u_texture: { value: texture },
      u_textPosX: { value: textPosition.current.x }, // Add text position uniform
    };

    // Create plane with shader material
    const planeMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
      })
    );
    scene.add(planeMesh);
    planeMeshRef.current = planeMesh;

    // Animation loop
    const animate = () => {
      mousePosition.current.x +=
        (targetMousePosition.current.x - mousePosition.current.x) *
        easeFactor.current;
      mousePosition.current.y +=
        (targetMousePosition.current.y - mousePosition.current.y) *
        easeFactor.current;

      const material = planeMesh.material as THREE.ShaderMaterial;
      material.uniforms.u_mouse.value.set(
        mousePosition.current.x,
        1.0 - mousePosition.current.y
      );
      material.uniforms.u_prevMouse.value.set(
        prevPosition.current.x,
        1.0 - prevPosition.current.y
      );

      // Update text position uniform
      material.uniforms.u_textPosX.value = textPosition.current.x;

      renderer.render(scene, camera);
      prevPosition.current = { ...mousePosition.current };

      animationFrameId.current = requestAnimationFrame(animate);
    };

    // Start animation
    animate();
    setIsInitialized(true);

    // Handle resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;

      const aspectRatio = window.innerWidth / window.innerHeight;
      cameraRef.current.left = -1;
      cameraRef.current.right = 1;
      cameraRef.current.top = 1 / aspectRatio;
      cameraRef.current.bottom = -1 / aspectRatio;
      cameraRef.current.updateProjectionMatrix();

      rendererRef.current.setSize(window.innerWidth, window.innerHeight);

      // Update texture if needed
      if (planeMeshRef.current) {
        const material = planeMeshRef.current.material as THREE.ShaderMaterial;
        material.uniforms.u_texture.value = createTextTexture();
      }
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }

      if (rendererRef.current) {
        rendererRef.current.dispose();
      }

      if (planeMeshRef.current) {
        planeMeshRef.current.geometry.dispose();
        (planeMeshRef.current.material as THREE.Material).dispose();
      }
    };
  }, [text, textColor]);

  // Add GSAP animation for the text entry
  useEffect(() => {
    if (isInitialized && planeMeshRef.current) {
      // Animate the text from right to left with a bounce effect
      gsap.to(textPosition.current, {
        x: 0, // Target position (center)
        duration: 3.5,
        ease: "expo.out",
        delay: 0.1, // Small delay to ensure everything is ready
      });
    }
  }, [isInitialized]);

  const handleMouseMove = (event: React.MouseEvent) => {
    easeFactor.current = 0.04;
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      prevPosition.current = { ...targetMousePosition.current };
      targetMousePosition.current.x = (event.clientX - rect.left) / rect.width;
      targetMousePosition.current.y = (event.clientY - rect.top) / rect.height;
    }
  };

  const handleMouseEnter = (event: React.MouseEvent) => {
    easeFactor.current = 0.2;
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      mousePosition.current.x = targetMousePosition.current.x =
        (event.clientX - rect.left) / rect.width;
      mousePosition.current.y = targetMousePosition.current.y =
        (event.clientY - rect.top) / rect.height;
    }
  };

  const handleMouseLeave = () => {
    // Slow down the ease factor for smoother transition when mouse leaves
    easeFactor.current = 0.02;

    // Use setTimeout to delay the reset of target position
    setTimeout(() => {
      // Gradually move back to center
      targetMousePosition.current = { x: 0.5, y: 0.5 };
    }, 100);
  };

  return (
    <div
      ref={containerRef}
      className="absolute w-full h-full overflow-hidden bg-black"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  );
};

export default Zajno;
