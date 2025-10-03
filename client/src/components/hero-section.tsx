export default function HeroSection() {
  return (
    <section className="hero-bg text-white">
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
