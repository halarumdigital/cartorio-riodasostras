import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import QuickInfoCards from "@/components/quick-info-cards";
import AboutSection from "@/components/about-section";
import PracticeAreas from "@/components/practice-areas";
import Statistics from "@/components/statistics";
import Attorneys from "@/components/attorneys";
import Appointment from "@/components/appointment";
import Testimonials from "@/components/testimonials";
import Blog from "@/components/blog";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="bg-white font-sans text-gray-800">
      <Header />
      <HeroSection />
      <QuickInfoCards />
      <AboutSection />
      <PracticeAreas />
      <Statistics />
      <Attorneys />
      <Appointment />
      <Testimonials />
      <Blog />
      <Footer />
    </div>
  );
}
