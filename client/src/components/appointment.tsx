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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const { data: contactsData } = useQuery<{ contacts: Contacts }>({
    queryKey: ["/api/contacts"],
  });

  const contacts = contactsData?.contacts;

  const sendMessageMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const formDataToSend = new FormData();
      formDataToSend.append('nome', data.nome);
      formDataToSend.append('email', data.email);
      formDataToSend.append('telefone', data.telefone);
      formDataToSend.append('mensagem', data.mensagem);
      formDataToSend.append('lido', 'false');

      // Add files
      selectedFiles.forEach(file => {
        formDataToSend.append('anexos', file);
      });

      const response = await fetch("/api/contact-messages", {
        method: "POST",
        body: formDataToSend,
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
      setSelectedFiles([]);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);

      // Validate max 5 files
      if (fileArray.length > 5) {
        toast({
          variant: "destructive",
          title: "Limite de arquivos excedido",
          description: "Você pode enviar no máximo 5 arquivos.",
        });
        return;
      }

      // Validate each file size (max 5MB)
      const invalidFiles = fileArray.filter(file => file.size > 5 * 1024 * 1024);
      if (invalidFiles.length > 0) {
        toast({
          variant: "destructive",
          title: "Arquivo muito grande",
          description: "Cada arquivo deve ter no máximo 5MB.",
        });
        return;
      }

      // Validate file types
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
      const invalidTypes = fileArray.filter(file => !allowedTypes.includes(file.type));
      if (invalidTypes.length > 0) {
        toast({
          variant: "destructive",
          title: "Tipo de arquivo inválido",
          description: "Apenas imagens (JPG, PNG, GIF) e PDFs são permitidos.",
        });
        return;
      }

      setSelectedFiles(fileArray);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
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
                    <div className="flex flex-col space-y-1">
                      {contacts.email.replace(/[\[\]"]/g, '').split(',').map((email, index) => (
                        <a
                          key={index}
                          href={`mailto:${email.trim()}`}
                          className="text-gray-300 hover:text-brand-gold transition-colors"
                        >
                          {email.trim()}
                        </a>
                      ))}
                    </div>
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Anexar arquivos (opcional)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/jpg,image/png,image/gif,application/pdf"
                  onChange={handleFileChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-brand-blue text-gray-800"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Máximo 5 arquivos de até 5MB cada (JPG, PNG, GIF ou PDF)
                </p>

                {selectedFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                        <span className="text-sm text-gray-700 truncate">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700 ml-2"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

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
