export default function QuickInfoCards() {
  return (
    <section className="bg-white py-10 md:-mt-16 relative z-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-50 border border-gray-200 p-8 flex items-center space-x-6 hover:shadow-lg transition-shadow" data-testid="card-appointment">
            <span className="iconify text-brand-gold" data-icon="streamline:collaboration-handshake-human-resources-team-collaboration-teams-handshake-teamwork-employee" data-width="60"></span>
            <div>
              <h3 className="text-lg font-bold text-brand-blue" data-testid="text-appointment-title">
                Book Your Appointment
              </h3>
              <p className="text-gray-500 text-sm" data-testid="text-appointment-description">
                You can book your appointment
              </p>
            </div>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 p-8 flex items-center space-x-6 hover:shadow-lg transition-shadow" data-testid="card-advice">
            <span className="iconify text-brand-gold" data-icon="la:balance-scale" data-width="60"></span>
            <div>
              <h3 className="text-lg font-bold text-brand-blue" data-testid="text-advice-title">
                Get Free Expert Advice
              </h3>
              <p className="text-gray-500 text-sm" data-testid="text-advice-description">We provide expert advice</p>
            </div>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 p-8 flex items-center space-x-6 hover:shadow-lg transition-shadow" data-testid="card-team">
            <span className="iconify text-brand-gold" data-icon="fluent:people-team-24-regular" data-width="60"></span>
            <div>
              <h3 className="text-lg font-bold text-brand-blue" data-testid="text-team-title">
                You Can Easily Join Our Team
              </h3>
              <p className="text-gray-500 text-sm" data-testid="text-team-description">Become a part of our team</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
