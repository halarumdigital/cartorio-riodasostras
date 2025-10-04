import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Contacts } from "@shared/schema";

interface SiteSettings {
  mainLogo?: string;
  browserTabName?: string;
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { data: contactsData } = useQuery<{ contacts: Contacts }>({
    queryKey: ["/api/contacts"],
  });

  const { data: settingsData } = useQuery<{ settings: SiteSettings }>({
    queryKey: ["/api/site-settings"],
  });

  const contacts = contactsData?.contacts;
  const mainLogo = settingsData?.settings?.mainLogo;
  const siteName = settingsData?.settings?.browserTabName || "Tabelionato";

  return (
    <header className="bg-white shadow-md">
      {/* Top bar */}
      <div className="bg-brand-blue text-white">
        <div className="container mx-auto px-6 py-2">
          <div className="flex items-center justify-center space-x-6 flex-wrap text-sm">
            {contacts?.address && (
              <div className="flex items-center space-x-2">
                <span className="iconify" data-icon="mdi:location" data-width="16"></span>
                <span>{contacts.address}</span>
              </div>
            )}
            {contacts?.phone && (
              <a
                href={`https://wa.me/55${contacts.phone.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 hover:text-brand-gold transition-colors"
              >
                <span className="iconify" data-icon="mdi:whatsapp" data-width="16"></span>
                <span>{contacts.phone}</span>
              </a>
            )}
            {contacts?.businessHours && (
              <div className="flex items-center space-x-2">
                <span className="iconify" data-icon="mdi:clock-outline" data-width="16"></span>
                <span>{contacts.businessHours}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Main navigation */}
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center lg:hidden">
          <a href="/" className="flex items-center justify-center" data-testid="link-logo">
            {mainLogo ? (
              <img
                src={mainLogo}
                alt={siteName}
                style={{ height: '200px', width: 'auto' }}
                className="object-contain"
              />
            ) : (
              <span className="font-serif text-3xl font-bold text-brand-blue">{siteName}</span>
            )}
          </a>
          <button
            className="text-brand-blue"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            data-testid="button-mobile-menu"
          >
            <span className="iconify" data-icon="mdi:menu" data-width="30"></span>
          </button>
        </div>

        <div className="hidden lg:flex flex-col items-center">
          <a href="/" className="flex items-center justify-center mb-4" data-testid="link-logo">
            {mainLogo ? (
              <img
                src={mainLogo}
                alt={siteName}
                style={{ height: '200px', width: 'auto' }}
                className="object-contain"
              />
            ) : (
              <span className="font-serif text-3xl font-bold text-brand-blue">{siteName}</span>
            )}
          </a>

          <nav className="flex items-center space-x-8" style={{ lineHeight: '60px' }}>
            <a href="/" className="nav-link text-brand-blue uppercase" data-testid="link-home">Home</a>
            <a href="#servicos" className="nav-link text-brand-blue uppercase" data-testid="link-servicos">Serviços</a>
            <a href="#links" className="nav-link text-brand-blue uppercase" data-testid="link-links">Links</a>
            <a href="/contato" className="nav-link text-brand-blue uppercase" data-testid="link-contact">Contato</a>
          </nav>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t">
          <nav className="container mx-auto px-6 py-4 space-y-4">
            <a href="/" className="block nav-link text-brand-blue uppercase" data-testid="mobile-link-home">Home</a>
            <a href="#servicos" className="block nav-link text-brand-blue uppercase" data-testid="mobile-link-servicos">Serviços</a>
            <a href="#links" className="block nav-link text-brand-blue uppercase" data-testid="mobile-link-links">Links</a>
            <a href="/contato" className="block nav-link text-brand-blue uppercase" data-testid="mobile-link-contact">Contato</a>
          </nav>
        </div>
      )}
    </header>
  );
}
