import { useQuery } from "@tanstack/react-query";

interface GoogleSettings {
  placeId?: string;
  reviewsJson?: string;
}

interface Review {
  author: string;
  rating: number;
  text: string;
  date?: string;
}

export default function Testimonials() {
  const { data: googleSettingsData } = useQuery<{ googleSettings: GoogleSettings }>({
    queryKey: ["/api/google-settings"],
  });

  let reviews: Review[] = [];

  try {
    if (googleSettingsData?.googleSettings?.reviewsJson) {
      reviews = JSON.parse(googleSettingsData.googleSettings.reviewsJson);
    }
  } catch (error) {
    console.error("Erro ao parsear avaliações:", error);
  }

  // Fallback para avaliações padrão se não houver avaliações do Google
  const defaultReviews: Review[] = [
    {
      author: "Cliente Satisfeito",
      rating: 5,
      text: "Excelente atendimento! Profissionais competentes e atenciosos.",
    },
  ];

  const displayReviews = reviews.length > 0 ? reviews.slice(0, 6) : defaultReviews;

  return (
    <section className="max-lg:py-16 py-24 max-lg:bg-white bg-brand-light-gray">
      <div className="container mx-auto max-lg:px-4 px-6">
        <div className="max-lg:text-center text-center max-lg:mb-8 mb-16">
          <p className="max-lg:text-sm max-lg:text-gray-500 max-lg:mb-2 text-brand-blue font-semibold" data-testid="text-testimonials-subtitle">Avaliações</p>
          <div className="w-16 h-0.5 bg-brand-blue my-4 mx-auto max-lg:hidden"></div>
          <h2 className="font-serif max-lg:text-3xl max-lg:font-bold text-4xl text-brand-blue font-bold" data-testid="text-testimonials-title">
            O que nossos clientes dizem
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-lg:gap-6 gap-8">
          {displayReviews.map((review, index) => (
            <div key={index} className="bg-white max-lg:p-6 max-lg:rounded-lg max-lg:shadow-md p-8 rounded-lg shadow-md">
              <div className="flex max-lg:mb-3 mb-4">
                {Array.from({ length: 5 }, (_, i) => (
                  <span
                    key={i}
                    className={`iconify ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                    data-icon="mdi:star"
                    data-width="20"
                  ></span>
                ))}
              </div>
              <p className="text-gray-600 max-lg:text-sm max-lg:mb-4 mb-6 italic">
                "{review.text}"
              </p>
              <div className="flex items-center">
                <div className="max-lg:w-10 max-lg:h-10 w-12 h-12 rounded-full bg-brand-blue flex items-center justify-center text-white font-bold max-lg:mr-3 mr-4 max-lg:text-sm">
                  {review.author.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold max-lg:text-sm text-brand-blue">
                    {review.author}
                  </h4>
                  {review.date && (
                    <p className="text-sm max-lg:text-xs text-gray-500">
                      {new Date(review.date).toLocaleDateString('pt-BR')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
