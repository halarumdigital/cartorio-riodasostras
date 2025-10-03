export default function Testimonials() {
  const testimonials = [
    {
      name: "Jennifer Wilson",
      title: "Family Law Client",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60",
      testimonial: "Barristar Law Firm handled my divorce case with utmost professionalism and compassion. They fought for my rights and ensured the best outcome for me and my children.",
      testId: "testimonial-jennifer-wilson"
    },
    {
      name: "Robert Thompson",
      title: "Criminal Defense Client",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60",
      testimonial: "I was facing serious criminal charges and John Anderson defended me brilliantly. His expertise and dedication resulted in a favorable verdict. Highly recommended!",
      testId: "testimonial-robert-thompson"
    },
    {
      name: "David Martinez",
      title: "Business Law Client",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60",
      testimonial: "The team at Barristar helped me navigate a complex business merger. Their attention to detail and legal knowledge saved us from potential pitfalls. Excellent service!",
      testId: "testimonial-david-martinez"
    }
  ];

  return (
    <section className="py-24 bg-brand-light-gray">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-brand-gold font-semibold" data-testid="text-testimonials-subtitle">Testimonials</p>
          <div className="w-16 h-0.5 bg-brand-gold my-4 mx-auto"></div>
          <h2 className="font-serif text-4xl text-brand-blue font-bold" data-testid="text-testimonials-title">
            What Our Clients Say
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-8 rounded-lg shadow-md" data-testid={testimonial.testId}>
              <div className="flex mb-4" data-testid={`rating-${testimonial.testId}`}>
                <span className="iconify text-brand-gold" data-icon="mdi:star" data-width="20"></span>
                <span className="iconify text-brand-gold" data-icon="mdi:star" data-width="20"></span>
                <span className="iconify text-brand-gold" data-icon="mdi:star" data-width="20"></span>
                <span className="iconify text-brand-gold" data-icon="mdi:star" data-width="20"></span>
                <span className="iconify text-brand-gold" data-icon="mdi:star" data-width="20"></span>
              </div>
              <p className="text-gray-600 mb-6 italic" data-testid={`text-${testimonial.testId}-content`}>
                "{testimonial.testimonial}"
              </p>
              <div className="flex items-center">
                <img 
                  src={testimonial.image}
                  alt="Client photo" 
                  className="w-12 h-12 rounded-full object-cover mr-4"
                  data-testid={`img-${testimonial.testId}`}
                />
                <div>
                  <h4 className="font-bold text-brand-blue" data-testid={`text-${testimonial.testId}-name`}>
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-500" data-testid={`text-${testimonial.testId}-title`}>
                    {testimonial.title}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
