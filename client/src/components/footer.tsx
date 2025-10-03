export default function Footer() {
  return (
    <footer className="bg-brand-dark-gray text-gray-300">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Column */}
          <div data-testid="footer-about">
            <div className="flex items-center space-x-2 mb-6">
              <span className="font-serif text-2xl font-bold text-white" data-testid="text-footer-logo">BARRISTAR</span>
            </div>
            <p className="text-sm mb-4" data-testid="text-footer-description">
              Your trusted partner in legal matters. We are committed to providing exceptional legal services with integrity and dedication.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-brand-gold transition-colors" data-testid="link-footer-facebook">
                <span className="iconify" data-icon="mdi:facebook" data-width="24"></span>
              </a>
              <a href="#" className="hover:text-brand-gold transition-colors" data-testid="link-footer-twitter">
                <span className="iconify" data-icon="mdi:twitter" data-width="24"></span>
              </a>
              <a href="#" className="hover:text-brand-gold transition-colors" data-testid="link-footer-linkedin">
                <span className="iconify" data-icon="mdi:linkedin" data-width="24"></span>
              </a>
              <a href="#" className="hover:text-brand-gold transition-colors" data-testid="link-footer-instagram">
                <span className="iconify" data-icon="mdi:instagram" data-width="24"></span>
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div data-testid="footer-quick-links">
            <h3 className="text-white font-bold mb-6" data-testid="text-footer-quick-links-title">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#about" className="hover:text-brand-gold transition-colors" data-testid="link-footer-about">About Us</a></li>
              <li><a href="#practice-areas" className="hover:text-brand-gold transition-colors" data-testid="link-footer-practice-areas">Practice Areas</a></li>
              <li><a href="#attorneys" className="hover:text-brand-gold transition-colors" data-testid="link-footer-attorneys">Our Attorneys</a></li>
              <li><a href="#" className="hover:text-brand-gold transition-colors" data-testid="link-footer-case-results">Case Results</a></li>
              <li><a href="#" className="hover:text-brand-gold transition-colors" data-testid="link-footer-testimonials">Testimonials</a></li>
              <li><a href="#contact" className="hover:text-brand-gold transition-colors" data-testid="link-footer-contact">Contact Us</a></li>
            </ul>
          </div>
          
          {/* Practice Areas */}
          <div data-testid="footer-practice-areas">
            <h3 className="text-white font-bold mb-6" data-testid="text-footer-practice-areas-title">Practice Areas</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-brand-gold transition-colors" data-testid="link-footer-family-law">Family Law</a></li>
              <li><a href="#" className="hover:text-brand-gold transition-colors" data-testid="link-footer-criminal-defense">Criminal Defense</a></li>
              <li><a href="#" className="hover:text-brand-gold transition-colors" data-testid="link-footer-business-law">Business Law</a></li>
              <li><a href="#" className="hover:text-brand-gold transition-colors" data-testid="link-footer-personal-injury">Personal Injury</a></li>
              <li><a href="#" className="hover:text-brand-gold transition-colors" data-testid="link-footer-real-estate">Real Estate Law</a></li>
              <li><a href="#" className="hover:text-brand-gold transition-colors" data-testid="link-footer-estate-planning">Estate Planning</a></li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div data-testid="footer-contact">
            <h3 className="text-white font-bold mb-6" data-testid="text-footer-contact-title">Contact Info</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start space-x-3" data-testid="footer-contact-address">
                <span className="iconify text-brand-gold mt-1" data-icon="mdi:map-marker" data-width="20"></span>
                <span>121 King Street, Melbourne, Australia</span>
              </li>
              <li className="flex items-start space-x-3" data-testid="footer-contact-phone">
                <span className="iconify text-brand-gold mt-1" data-icon="mdi:phone" data-width="20"></span>
                <span>3164-5456854</span>
              </li>
              <li className="flex items-start space-x-3" data-testid="footer-contact-email">
                <span className="iconify text-brand-gold mt-1" data-icon="mdi:email" data-width="20"></span>
                <span>info@barristar.com</span>
              </li>
              <li className="flex items-start space-x-3" data-testid="footer-contact-hours">
                <span className="iconify text-brand-gold mt-1" data-icon="mdi:clock-outline" data-width="20"></span>
                <span>Mon - Fri: 9AM - 5PM</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Copyright Bar */}
      <div className="border-t border-gray-700">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <p data-testid="text-footer-copyright">&copy; 2024 Barristar Law Firm. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-brand-gold transition-colors" data-testid="link-footer-privacy">Privacy Policy</a>
              <a href="#" className="hover:text-brand-gold transition-colors" data-testid="link-footer-terms">Terms of Service</a>
              <a href="#" className="hover:text-brand-gold transition-colors" data-testid="link-footer-disclaimer">Disclaimer</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
