import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import AboutSection from "@/components/about-section";
import PracticeAreas from "@/components/practice-areas";
import Statistics from "@/components/statistics";
import Testimonials from "@/components/testimonials";
import Appointment from "@/components/appointment";
import Gallery from "@/components/gallery";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="bg-white font-sans text-gray-800">
      <Header />
      <HeroSection />
      <AboutSection />
      <PracticeAreas />
      <Statistics />
      <Testimonials />
      <Appointment />
      <Gallery />
      <Footer />
    </div>
  );
}
