export default function AboutSection() {
  return (
    <section className="py-24 bg-white" id="about">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="absolute inset-0 bg-brand-gold transform -translate-x-4 translate-y-4"></div>
            <div className="relative z-10 p-4 bg-white">
              <img 
                src="https://images.unsplash.com/photo-1556157382-97eda2d62296?ixlib=rb-4.0.3&auto=format&fit=crop&w=530&h=600" 
                alt="A female lawyer in a black blazer and glasses, sitting at a wooden desk and reviewing a book. A gavel is visible on the desk." 
                className="w-full h-auto"
                data-testid="img-about-lawyer"
              />
            </div>
          </div>
          
          <div className="text-gray-600">
            <p className="text-brand-gold font-semibold" data-testid="text-about-subtitle">About Us</p>
            <div className="w-16 h-0.5 bg-brand-gold my-4"></div>
            <h2 className="font-serif text-4xl text-brand-blue font-bold mb-6" data-testid="text-about-title">
              Welcome to Barristar Law Firm, where legal excellence meets unwavering commitment.
            </h2>
            <p className="mb-4" data-testid="text-about-paragraph-1">
              Established with a passion for justice and a dedication to serving our clients with the utmost integrity, Barristar Law Firm is a beacon of legal expertise in the ever-evolving of law.
            </p>
            <p className="mb-8" data-testid="text-about-paragraph-2">
              At Barristar, we understand that navigating the complexities of the legal system can be daunting. That's why our team of seasoned attorneys is committed to providing personalized, and effective legal solutions tailored to your unique needs.
            </p>
            
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="flex items-start space-x-3" data-testid="feature-expert-attorneys">
                <span className="iconify text-brand-gold mt-1" data-icon="mdi:check-circle" data-width="24"></span>
                <div>
                  <h4 className="font-bold text-brand-blue mb-1">Expert Attorneys</h4>
                  <p className="text-sm text-gray-500">Skilled legal professionals</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3" data-testid="feature-trusted-services">
                <span className="iconify text-brand-gold mt-1" data-icon="mdi:check-circle" data-width="24"></span>
                <div>
                  <h4 className="font-bold text-brand-blue mb-1">Trusted Services</h4>
                  <p className="text-sm text-gray-500">Reliable legal support</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3" data-testid="feature-support">
                <span className="iconify text-brand-gold mt-1" data-icon="mdi:check-circle" data-width="24"></span>
                <div>
                  <h4 className="font-bold text-brand-blue mb-1">24/7 Support</h4>
                  <p className="text-sm text-gray-500">Always here for you</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3" data-testid="feature-success-rate">
                <span className="iconify text-brand-gold mt-1" data-icon="mdi:check-circle" data-width="24"></span>
                <div>
                  <h4 className="font-bold text-brand-blue mb-1">Success Rate</h4>
                  <p className="text-sm text-gray-500">Proven track record</p>
                </div>
              </div>
            </div>
            
            <a 
              href="#contact" 
              className="inline-block bg-brand-blue text-white px-8 py-3 font-semibold hover:bg-opacity-90 transition-colors"
              data-testid="button-learn-more"
            >
              Learn More About Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
