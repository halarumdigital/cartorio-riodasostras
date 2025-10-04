import { useQuery } from "@tanstack/react-query";

interface Contacts {
  whatsapp?: string;
  phone?: string;
  email?: string;
  address?: string;
  businessHours?: string;
}

interface SiteSettings {
  browserTabName?: string;
  footerLogo?: string;
}

export default function Footer() {
  const { data: contactsData } = useQuery<{ contacts: Contacts }>({
    queryKey: ["/api/contacts"],
  });

  const { data: settingsData } = useQuery<{ settings: SiteSettings }>({
    queryKey: ["/api/site-settings"],
  });

  const contacts = contactsData?.contacts;
  const siteName = settingsData?.settings?.browserTabName || "Tabelionato";
  const footerLogo = settingsData?.settings?.footerLogo;

  return (
    <footer className="text-gray-300" style={{ backgroundColor: '#202841' }}>
      <div className="container mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row justify-center items-start gap-8 max-w-7xl mx-auto">
          {/* Logo Column */}
          <div className="flex-1 flex flex-col items-center md:items-start" data-testid="footer-logo">
            {footerLogo && (
              <div className="mb-4">
                <img src={footerLogo} alt={siteName} style={{ height: '200px', width: 'auto' }} />
              </div>
            )}
          </div>

          {/* About Column */}
          <div className="flex-1" data-testid="footer-about">
            <div className="flex items-center space-x-2 mb-6">
              <span className="font-serif text-2xl font-bold text-white" data-testid="text-footer-logo">{siteName}</span>
            </div>
            <p className="text-sm mb-4" data-testid="text-footer-description">
              Seu parceiro de confiança em serviços notariais e de protesto. Estamos comprometidos em fornecer serviços excepcionais com integridade e dedicação.
            </p>
          </div>

          {/* Serviços */}
          <div className="flex-1" data-testid="footer-quick-links">
            <h3 className="text-white font-bold mb-6" data-testid="text-footer-quick-links-title">Serviços</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="/certidao-de-escritura" className="hover:text-brand-gold transition-colors" data-testid="link-footer-certidao-escritura">Certidão de Escritura</a></li>
              <li><a href="/certidao-de-protesto" className="hover:text-brand-gold transition-colors" data-testid="link-footer-certidao-protesto">Certidão de Protesto</a></li>
              <li><a href="/certidao-de-procuracao" className="hover:text-brand-gold transition-colors" data-testid="link-footer-certidao-procuracao">Certidão de Procuração</a></li>
              <li><a href="/certidao-de-substabelecimento" className="hover:text-brand-gold transition-colors" data-testid="link-footer-certidao-substabelecimento">Certidão de Substabelecimento</a></li>
              <li><a href="/confirmacao-de-procuracao" className="hover:text-brand-gold transition-colors" data-testid="link-footer-confirmacao-procuracao">Confirmação de Procuração</a></li>
              <li><a href="/solicite-sua-escritura" className="hover:text-brand-gold transition-colors" data-testid="link-footer-solicite-escritura">Solicite Escritura</a></li>
              <li><a href="/contato" className="hover:text-brand-gold transition-colors" data-testid="link-footer-contato">Contato</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="flex-1" data-testid="footer-contact">
            <h3 className="text-white font-bold mb-6" data-testid="text-footer-contact-title">Contato</h3>
            <ul className="space-y-4 text-sm">
              {contacts?.address && (
                <li className="flex items-start space-x-3" data-testid="footer-contact-address">
                  <span className="iconify text-brand-gold mt-1" data-icon="mdi:map-marker" data-width="20"></span>
                  <span>{contacts.address}</span>
                </li>
              )}
              {contacts?.phone && (
                <li className="flex items-start space-x-3" data-testid="footer-contact-phone">
                  <span className="iconify text-brand-gold mt-1" data-icon="mdi:phone" data-width="20"></span>
                  <a
                    href={`https://wa.me/55${contacts.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-brand-gold transition-colors"
                  >
                    {contacts.phone}
                  </a>
                </li>
              )}
              <li className="flex items-start space-x-3" data-testid="footer-contact-email">
                <span className="iconify text-brand-gold mt-1" data-icon="mdi:email" data-width="20"></span>
                <a
                  href="mailto:registrocivilro@gmail.com"
                  className="hover:text-brand-gold transition-colors"
                >
                  registrocivilro@gmail.com
                </a>
              </li>
              {contacts?.businessHours && (
                <li className="flex items-start space-x-3" data-testid="footer-contact-hours">
                  <span className="iconify text-brand-gold mt-1" data-icon="mdi:clock-outline" data-width="20"></span>
                  <span>{contacts.businessHours}</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
      
      {/* Copyright Bar */}
      <div className="border-t border-gray-700">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm gap-4">
            <div className="text-gray-400">
              Feito pela <a href="https://halarum.dev" target="_blank" rel="noopener noreferrer" className="text-brand-gold hover:text-white transition-colors">Halarum.dev</a>
            </div>
            <a href="/politica-de-privacidade" className="hover:text-brand-gold transition-colors" data-testid="link-footer-privacy">Política de Privacidade</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
