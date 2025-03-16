import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import ChooseYourPowerup from "@/components/chooseyourpowerup";
import WhyUs from "@/components/whyus";
import Featured from "@/components/featured";
import Testimonials from "@/components/testimonials";
import CTA from "@/components/cta";
import BgVideo from "@/components/video";
import Footer from "@/components/footer";
export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <Navbar />
      <Hero />
      <ChooseYourPowerup />
      <Featured />
      <WhyUs />
      <Testimonials />
      <BgVideo />
      <CTA />
      <Footer />
    </div>
  );
}
