export default function Statistics() {
  const stats = [
    { number: "25+", label: "Years of Experience", testId: "stat-experience" },
    { number: "1200+", label: "Cases Won", testId: "stat-cases-won" },
    { number: "50+", label: "Expert Attorneys", testId: "stat-attorneys" },
    { number: "98%", label: "Client Satisfaction", testId: "stat-satisfaction" }
  ];

  return (
    <section className="py-24 bg-brand-blue text-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index} data-testid={stat.testId}>
              <div className="font-serif text-5xl font-bold text-brand-gold mb-2" data-testid={`text-${stat.testId}-number`}>
                {stat.number}
              </div>
              <p className="text-gray-300" data-testid={`text-${stat.testId}-label`}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
