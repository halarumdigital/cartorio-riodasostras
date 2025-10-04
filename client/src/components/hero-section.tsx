import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Banner } from "@shared/schema";

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const { data: bannersData } = useQuery<{ banners: Banner[] }>({
    queryKey: ["/api/banners"],
  });

  const activeBanners = bannersData?.banners?.filter(b => b.active) || [];

  useEffect(() => {
    if (activeBanners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeBanners.length);
    }, 10000); // 10 segundos

    return () => clearInterval(interval);
  }, [activeBanners.length]);

  if (!activeBanners.length) {
    return (
      <section className="hero-bg text-white" id="home">
        <div className="container mx-auto px-6 py-48 flex flex-col items-start justify-center">
          <p className="text-lg" data-testid="text-hero-subtitle">The Most Talented Law Firm</p>
          <h1 className="font-serif text-6xl md:text-7xl font-bold mt-2 leading-tight max-w-2xl" data-testid="text-hero-title">
            We Fight For Your Justice As Like A Friend.
          </h1>
          <a
            href="#contact"
            className="mt-8 bg-brand-gold text-white px-8 py-3 font-semibold hover:bg-opacity-90 transition-colors"
            data-testid="button-contact-us"
          >
            Contact Us Now
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-[800px] overflow-hidden" id="home">
      {activeBanners.map((banner, index) => (
        <div
          key={banner.id}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{
            opacity: currentSlide === index ? 1 : 0,
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${banner.imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
          }}
        >
          {banner.link && (
            <a
              href={banner.link}
              className="absolute inset-0"
              aria-label={banner.title}
            />
          )}
        </div>
      ))}

      {/* Indicadores */}
      {activeBanners.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {activeBanners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                currentSlide === index ? 'bg-white w-8' : 'bg-white/50'
              }`}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
