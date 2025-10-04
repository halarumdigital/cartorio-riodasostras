import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Contacts } from "@shared/schema";

interface SiteSettings {
  mainLogo?: string;
  browserTabName?: string;
}

interface SocialMedia {
  youtube?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { data: contactsData } = useQuery<{ contacts: Contacts }>({
    queryKey: ["/api/contacts"],
  });

  const { data: settingsData } = useQuery<{ settings: SiteSettings }>({
    queryKey: ["/api/site-settings"],
  });

  const { data: socialMediaData } = useQuery<{ socialMedia: SocialMedia }>({
    queryKey: ["/api/social-media"],
  });

  const contacts = contactsData?.contacts;
  const mainLogo = settingsData?.settings?.mainLogo;
  const siteName = settingsData?.settings?.browserTabName || "Tabelionato";
  const socialMedia = socialMediaData?.socialMedia;

  return (
    <header className="bg-white shadow-md">
      {/* Top bar */}
      <div className="bg-brand-blue text-white">
        <div className="container mx-auto px-6 py-2">
          <div className="flex items-center justify-between flex-wrap text-sm">
            <div className="flex items-center justify-center space-x-6 flex-wrap flex-1">
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
            <div className="flex gap-3">
              {socialMedia?.youtube && (
                <a
                  href={socialMedia.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-gold transition-colors"
                  aria-label="YouTube"
                >
                  <span className="iconify" data-icon="mdi:youtube" data-width="20"></span>
                </a>
              )}
              {socialMedia?.instagram && (
                <a
                  href={socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-gold transition-colors"
                  aria-label="Instagram"
                >
                  <span className="iconify" data-icon="mdi:instagram" data-width="20"></span>
                </a>
              )}
              {socialMedia?.facebook && (
                <a
                  href={socialMedia.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-gold transition-colors"
                  aria-label="Facebook"
                >
                  <span className="iconify" data-icon="mdi:facebook" data-width="20"></span>
                </a>
              )}
              {socialMedia?.tiktok && (
                <a
                  href={socialMedia.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-gold transition-colors"
                  aria-label="TikTok"
                >
                  <span className="iconify" data-icon="ic:baseline-tiktok" data-width="20"></span>
                </a>
              )}
            </div>
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
                style={{ height: '150px', width: 'auto' }}
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
                style={{ height: '150px', width: 'auto' }}
                className="object-contain"
              />
            ) : (
              <span className="font-serif text-3xl font-bold text-brand-blue">{siteName}</span>
            )}
          </a>

          <nav className="flex items-center space-x-8" style={{ lineHeight: '60px' }}>
            <a href="#home" className="nav-link text-brand-blue uppercase" data-testid="link-home">Home</a>
            <a href="#servicos" className="nav-link text-brand-blue uppercase" data-testid="link-servicos">Serviços</a>
            <a href="#services-online" className="nav-link text-brand-blue uppercase" data-testid="link-services-online">Serviços Online</a>
            <a href="/informacoes" className="nav-link text-brand-blue uppercase" data-testid="link-informacoes">Informações</a>
            <a href="#links" className="nav-link text-brand-blue uppercase" data-testid="link-links">Links</a>
            <a href="/contato" className="nav-link text-brand-blue uppercase" data-testid="link-contact">Contato</a>
          </nav>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t">
          <nav className="container mx-auto px-6 py-4 space-y-4">
            <a href="#home" className="block nav-link text-brand-blue uppercase" data-testid="mobile-link-home">Home</a>
            <a href="#servicos" className="block nav-link text-brand-blue uppercase" data-testid="mobile-link-servicos">Serviços</a>
            <a href="#services-online" className="block nav-link text-brand-blue uppercase" data-testid="mobile-link-services-online">Serviços Online</a>
            <a href="/informacoes" className="block nav-link text-brand-blue uppercase" data-testid="mobile-link-informacoes">Informações</a>
            <a href="#links" className="block nav-link text-brand-blue uppercase" data-testid="mobile-link-links">Links</a>
            <a href="/contato" className="block nav-link text-brand-blue uppercase" data-testid="mobile-link-contact">Contato</a>
          </nav>
        </div>
      )}
    </header>
  );
}
