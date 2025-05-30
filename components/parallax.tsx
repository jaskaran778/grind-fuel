"use client";

import { useEffect, useRef, useState } from "react";
import { useTransform, useScroll, motion } from "framer-motion";
import styles from "./parallax.module.scss";
import Image from "next/image";
import Lenis from "@studio-freight/lenis";

const images = [
  "/images/drinks (1).png",
  "/images/snacks (1).png",
  "/images/gum (1).png",
  "/images/drinks (4).png",
  "/images/snacks (2).png",
  "/images/gum (2).png",
  "/images/drinks (5).png",
  "/images/snacks (3).png",
  "/images/gum (3).png",
  "/images/snacks (5).png",
  "/images/gum (4).png",
  "/images/snacks (4).png",
  "/images/gum (5).png",
];
// const images = [
//   "/navbar/nav (5).jpg",
//   "/navbar/nav (5).jpg",
//   "/navbar/nav (5).jpg",
//   "/navbar/nav (5).jpg",
//   "/navbar/nav (5).jpg",
//   "/navbar/nav (5).jpg",
//   "/navbar/nav (5).jpg",
//   "/navbar/nav (5).jpg",
//   "/navbar/nav (5).jpg",
//   "/navbar/nav (5).jpg",
//   "/navbar/nav (5).jpg",
//   "/navbar/nav (5).jpg",
// ];

export default function Home() {
  const gallery = useRef(null);
  const [dimension, setDimension] = useState({ width: 0, height: 0 });

  const { scrollYProgress } = useScroll({
    target: gallery,
    offset: ["start end", "end start"],
  });

  const { height } = dimension;
  const y = useTransform(scrollYProgress, [0, 1], [0, height * 2]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, height * 3.3]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, height * 1.25]);
  const y4 = useTransform(scrollYProgress, [0, 1], [0, height * 3]);

  useEffect(() => {
    const lenis = new Lenis();

    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    const resize = () => {
      setDimension({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", resize);
    requestAnimationFrame(raf);
    resize();

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <main className={styles.main}>
      <div className={styles.spacer}></div>
      <div className={styles.heading}>
        <h2>What Our Customers Say</h2>
      </div>
      <div ref={gallery} className={styles.gallery}>
        <div className={styles.galleryWrapper}>
          <Column images={[images[0], images[1], images[2]]} y={y} />
          <Column images={[images[3], images[4], images[5]]} y={y2} />
          <Column images={[images[6], images[7], images[8]]} y={y3} />
          <Column images={[images[9], images[10], images[11]]} y={y4} />
        </div>
      </div>
      <div className={styles.spacer}></div>
    </main>
  );
}

const Column = ({ images, y }) => {
  return (
    <motion.div className={styles.column} style={{ y }}>
      {images.map((src, i) => {
        return (
          <div key={i} className={styles.imageContainer}>
            <Image src={`${src}`} alt="image" fill />
          </div>
        );
      })}
    </motion.div>
  );
};
