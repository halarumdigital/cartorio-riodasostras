export default function PracticeAreas() {
  const practiceAreas = [
    {
      icon: "mdi:human-male-female-child",
      title: "Family Law",
      description: "We handle divorce, custody, adoption, and other family-related legal matters with sensitivity and expertise.",
      testId: "practice-family-law"
    },
    {
      icon: "mdi:gavel",
      title: "Criminal Defense",
      description: "Aggressive defense strategies for clients facing criminal charges, protecting your rights every step of the way.",
      testId: "practice-criminal-defense"
    },
    {
      icon: "mdi:briefcase",
      title: "Business Law",
      description: "Comprehensive legal solutions for businesses, from formation to contracts, compliance, and litigation.",
      testId: "practice-business-law"
    },
    {
      icon: "mdi:account-injury",
      title: "Personal Injury",
      description: "Fighting for fair compensation for accident victims. We handle car accidents, workplace injuries, and more.",
      testId: "practice-personal-injury"
    },
    {
      icon: "mdi:home-city",
      title: "Real Estate Law",
      description: "Expert guidance on property transactions, leasing, zoning, and real estate disputes.",
      testId: "practice-real-estate"
    },
    {
      icon: "mdi:file-document-edit",
      title: "Estate Planning",
      description: "Protect your assets and ensure your wishes are honored with comprehensive estate planning services.",
      testId: "practice-estate-planning"
    }
  ];

  return (
    <section className="py-24 bg-brand-light-gray" id="practice-areas">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-brand-gold font-semibold" data-testid="text-practice-areas-subtitle">Practice Areas</p>
          <div className="w-16 h-0.5 bg-brand-gold my-4 mx-auto"></div>
          <h2 className="font-serif text-4xl text-brand-blue font-bold" data-testid="text-practice-areas-title">
            Our Legal Practice Areas
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {practiceAreas.map((area, index) => (
            <div 
              key={index} 
              className="bg-white p-8 hover:shadow-xl transition-shadow group"
              data-testid={area.testId}
            >
              <span className="iconify text-brand-gold group-hover:scale-110 transition-transform inline-block" data-icon={area.icon} data-width="60"></span>
              <h3 className="font-serif text-2xl text-brand-blue font-bold mt-6 mb-4" data-testid={`text-${area.testId}-title`}>
                {area.title}
              </h3>
              <p className="text-gray-600 mb-4" data-testid={`text-${area.testId}-description`}>
                {area.description}
              </p>
              <a 
                href="#contact" 
                className="text-brand-gold font-semibold hover:underline inline-flex items-center"
                data-testid={`link-${area.testId}-read-more`}
              >
                Read More
                <span className="iconify ml-1" data-icon="mdi:arrow-right" data-width="20"></span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
