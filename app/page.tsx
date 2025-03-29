"use client";

import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import ChooseYourPowerup from "@/components/chooseyourpowerup";
import WhyUs from "@/components/whyus";
import Featured from "@/components/featured";
import Testimonials from "@/components/testimonials";
import CTA from "@/components/cta";
import BgVideo from "@/components/video";
import Footer from "@/components/footer";
import Circle from "@/components/circle";
import Parallax from "@/components/parallax";
import Paint from "@/components/Paint";
import Scene from "@/components/Scene";
import Zajno from "@/components/Zajno";
import { useScroll } from "framer-motion";
import { useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";
import HolographicReviews from "@/components/HolographicReviews";
import LocomotiveScroll from "locomotive-scroll";

export default function Home() {
  const locomotiveScroll = new LocomotiveScroll();

  return (
    <div className="overflow-x-hidden">
      <Navbar />
      {/* <Hero /> */}
      <Zajno />
      <div className="absolute bottom-0 left-0 right-0 flex justify-center mb-22 z-10">
        <div className="text-[#16db65] text-4xl  font-extrabold tracking-wider opacity-80 hover:opacity-100 transition-opacity duration-300 --font-custom-1">
          Fuel your focus. Energize your grind.
        </div>
      </div>
      {/* Add some spacing */}
      <div className="h-[100vh]"></div>
      {/* Featured/Parallax component */}
      <div className="relative z-10">
        <ChooseYourPowerup />
      </div>
      <Featured />
      {/* <Parallax /> */}

      <HolographicReviews />

      <WhyUs />
      {/* <Testimonials /> */}
      {/* /<BgVideo /> */}
      {/* <Circle /> */}
      <CTA />
      {/* <div className="relative w-full h-screen bg-black">
        <Zajno text="GrindFuel" textColor="#16db65" />
      </div> */}
      {/* <Paint /> */}
      <Footer />
    </div>
  );
}
