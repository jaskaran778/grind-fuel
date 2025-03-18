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
export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <Navbar />
      <Hero />
      <ChooseYourPowerup />
      <Featured />
      <Parallax />
      <WhyUs />
      <Testimonials />
      <BgVideo />
      <CTA />
      <Circle />
      {/* <Paint /> */}
      <Footer />
    </div>
  );
}
