export default function AboutSection() {
  return (
    <section className="py-24 bg-white" id="about">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="absolute inset-0 bg-brand-blue transform -translate-x-4 translate-y-4"></div>
            <div className="relative z-10 p-4 bg-white">
              <img
                src="/uploads/sobre.jpg"
                alt="Sobre o Cartório"
                className="w-full h-auto"
                data-testid="img-about-lawyer"
              />
            </div>
          </div>

          <div className="text-gray-600">
            <p className="text-brand-blue font-semibold" data-testid="text-about-subtitle">Missão</p>
            <div className="w-16 h-0.5 bg-brand-blue my-4"></div>
            <p className="mb-8 text-lg leading-relaxed" data-testid="text-about-paragraph-1">
              Proporcionar à comunidade da Comarca de Rio das Ostras serviços notariais e de registro de excelência, pautados na agilidade, transparência e segurança jurídica. Atuamos com dedicação e profissionalismo em cada ato — de escrituras e reconhecimento de união estável a inventários, divórcios e registros civis — garantindo que nossos usuários tenham tranquilidade e confiança em suas demandas legais. Comprometemo-nos a oferecer um atendimento moderno e humanizado, em ambiente acessível e acolhedor, sempre respeitando as normas vigentes e promovendo o acesso à cidadania.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
