import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md">
      {/* Top bar */}
      <div className="bg-brand-blue text-white">
        <div className="container mx-auto px-6 py-2 flex flex-wrap justify-between items-center text-sm">
          <div className="flex items-center space-x-6 flex-wrap">
            <div className="flex items-center space-x-2">
              <span className="iconify" data-icon="mdi:location" data-width="16"></span>
              <span>121 King Street, Melbourne, Australia</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="iconify" data-icon="mdi:phone" data-width="16"></span>
              <span>3164-5456854</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="iconify" data-icon="mdi:clock-outline" data-width="16"></span>
              <span>9AM - 5PM</span>
            </div>
          </div>
          <a 
            href="#contact" 
            data-testid="button-free-consulting"
            className="border border-white/50 rounded-full px-4 py-1.5 text-xs hover:bg-white hover:text-brand-blue transition-colors"
          >
            Free Consulting
          </a>
        </div>
      </div>
      
      {/* Main navigation */}
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <a href="#" className="flex items-center space-x-2" data-testid="link-logo">
          <img 
            src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40" 
            alt="Barristar Logo" 
            className="h-10 w-10 rounded-full object-cover"
          />
          <span className="font-serif text-3xl font-bold text-brand-blue">BARRISTAR</span>
        </a>
        
        <nav className="hidden lg:flex items-center space-x-8">
          <a href="#home" className="nav-link active text-brand-blue" data-testid="link-home">
            Home
            <span className="iconify dropdown-arrow" data-icon="mdi:chevron-down"></span>
          </a>
          <a href="#about" className="nav-link text-brand-blue" data-testid="link-about">About</a>
          <a href="#pages" className="nav-link text-brand-blue" data-testid="link-pages">
            Pages
            <span className="iconify dropdown-arrow" data-icon="mdi:chevron-down"></span>
          </a>
          <a href="#practice-areas" className="nav-link text-brand-blue" data-testid="link-practice-areas">Practice Areas</a>
          <a href="#attorneys" className="nav-link text-brand-blue" data-testid="link-attorneys">Attorneys</a>
          <a href="#news" className="nav-link text-brand-blue" data-testid="link-news">News</a>
          <a href="#contact" className="nav-link text-brand-blue" data-testid="link-contact">Contact</a>
        </nav>
        
        <div className="flex items-center space-x-4">
          <button 
            className="text-brand-blue hover:text-brand-gold transition-colors"
            data-testid="button-search"
          >
            <span className="iconify" data-icon="mdi:magnify" data-width="24"></span>
          </button>
          <button 
            className="lg:hidden text-brand-blue"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            data-testid="button-mobile-menu"
          >
            <span className="iconify" data-icon="mdi:menu" data-width="30"></span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t">
          <nav className="container mx-auto px-6 py-4 space-y-4">
            <a href="#home" className="block nav-link active text-brand-blue" data-testid="mobile-link-home">Home</a>
            <a href="#about" className="block nav-link text-brand-blue" data-testid="mobile-link-about">About</a>
            <a href="#pages" className="block nav-link text-brand-blue" data-testid="mobile-link-pages">Pages</a>
            <a href="#practice-areas" className="block nav-link text-brand-blue" data-testid="mobile-link-practice-areas">Practice Areas</a>
            <a href="#attorneys" className="block nav-link text-brand-blue" data-testid="mobile-link-attorneys">Attorneys</a>
            <a href="#news" className="block nav-link text-brand-blue" data-testid="mobile-link-news">News</a>
            <a href="#contact" className="block nav-link text-brand-blue" data-testid="mobile-link-contact">Contact</a>
          </nav>
        </div>
      )}
    </header>
  );
}
