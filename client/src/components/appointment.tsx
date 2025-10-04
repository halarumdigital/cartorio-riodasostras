import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import type { Contacts } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function Appointment() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    mensagem: ""
  });

  const { data: contactsData } = useQuery<{ contacts: Contacts }>({
    queryKey: ["/api/contacts"],
  });

  const contacts = contactsData?.contacts;

  const sendMessageMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch("/api/contact-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Mensagem enviada com sucesso!",
        description: "Entraremos em contato em breve.",
      });
      setFormData({
        nome: "",
        email: "",
        telefone: "",
        mensagem: ""
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Erro ao enviar mensagem",
        description: error.message,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessageMutation.mutate(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section className="appointment-bg text-white py-24" id="contact">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="space-y-4">
              {contacts?.phone && (
                <div className="flex items-start space-x-4" data-testid="contact-phone">
                  <span className="iconify text-brand-gold mt-1" data-icon="mdi:whatsapp" data-width="24"></span>
                  <div>
                    <h4 className="font-bold mb-1">WhatsApp</h4>
                    <a
                      href={`https://wa.me/55${contacts.phone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-brand-gold transition-colors"
                    >
                      {contacts.phone}
                    </a>
                  </div>
                </div>
              )}

              {contacts?.email && (
                <div className="flex items-start space-x-4" data-testid="contact-email">
                  <span className="iconify text-brand-gold mt-1" data-icon="mdi:email" data-width="24"></span>
                  <div>
                    <h4 className="font-bold mb-1">Email</h4>
                    <a
                      href={`mailto:${contacts.email}`}
                      className="text-gray-300 hover:text-brand-gold transition-colors"
                    >
                      {contacts.email}
                    </a>
                  </div>
                </div>
              )}

              {contacts?.address && (
                <div className="flex items-start space-x-4" data-testid="contact-address">
                  <span className="iconify text-brand-gold mt-1" data-icon="mdi:map-marker" data-width="24"></span>
                  <div>
                    <h4 className="font-bold mb-1">Onde estamos</h4>
                    <p className="text-gray-300">{contacts.address}</p>
                  </div>
                </div>
              )}

              {contacts?.businessHours && (
                <div className="flex items-start space-x-4" data-testid="contact-hours">
                  <span className="iconify text-brand-gold mt-1" data-icon="mdi:clock-outline" data-width="24"></span>
                  <div>
                    <h4 className="font-bold mb-1">Horário de Funcionamento</h4>
                    <p className="text-gray-300">{contacts.businessHours}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-lg">
            <form className="space-y-4" onSubmit={handleSubmit} data-testid="form-appointment">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="nome"
                  placeholder="Seu Nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-brand-blue text-gray-800"
                  data-testid="input-name"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Seu Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-brand-blue text-gray-800"
                  data-testid="input-email"
                  required
                />
              </div>

              <input
                type="tel"
                name="telefone"
                placeholder="Seu Telefone"
                value={formData.telefone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-brand-blue text-gray-800"
                data-testid="input-phone"
                required
              />

              <textarea
                name="mensagem"
                placeholder="Sua Mensagem"
                rows={4}
                value={formData.mensagem}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-brand-blue text-gray-800"
                data-testid="textarea-message"
                required
              ></textarea>

              <button
                type="submit"
                className="w-full bg-brand-blue text-white px-8 py-3 font-semibold hover:bg-opacity-90 transition-colors"
                data-testid="button-submit-request"
                disabled={sendMessageMutation.isPending}
              >
                {sendMessageMutation.isPending ? "Enviando..." : "Enviar Mensagem"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
