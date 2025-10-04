import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface Contacts {
  id?: number;
  whatsapp?: string;
  phone?: string;
  email?: string;
  address?: string;
  businessHours?: string;
}

export default function Contacts() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    whatsapp: "",
    phone: "",
    email: "",
    address: "",
    businessHours: "",
  });

  const { data: contactsData, isLoading } = useQuery<{ contacts: Contacts }>({
    queryKey: ["/api/contacts"],
  });

  useEffect(() => {
    if (contactsData?.contacts) {
      setFormData({
        whatsapp: contactsData.contacts.whatsapp || "",
        phone: contactsData.contacts.phone || "",
        email: contactsData.contacts.email || "",
        address: contactsData.contacts.address || "",
        businessHours: contactsData.contacts.businessHours || "",
      });
    }
  }, [contactsData]);

  const updateContactsMutation = useMutation({
    mutationFn: async (contacts: Partial<Contacts>) => {
      const response = await fetch("/api/contacts", {
        method: "PUT",
        body: JSON.stringify(contacts),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contacts"] });
      toast({
        title: "Contatos salvos com sucesso!",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Erro ao salvar contatos",
        description: error.message,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateContactsMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Carregando contatos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-serif font-bold text-brand-blue mb-6">
          Contatos
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            WhatsApp
          </label>
          <input
            type="text"
            value={formData.whatsapp}
            onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
            placeholder="(00) 00000-0000"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-gold focus:border-brand-gold"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Telefone
          </label>
          <input
            type="text"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="(00) 0000-0000"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-gold focus:border-brand-gold"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="contato@exemplo.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-gold focus:border-brand-gold"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Endereço
          </label>
          <textarea
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="Rua, número, bairro, cidade - UF"
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-gold focus:border-brand-gold"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Horário de Funcionamento
          </label>
          <textarea
            value={formData.businessHours}
            onChange={(e) => setFormData({ ...formData, businessHours: e.target.value })}
            placeholder="Segunda a Sexta: 8h às 18h"
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-gold focus:border-brand-gold"
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={updateContactsMutation.isPending}
            className="bg-brand-blue hover:bg-opacity-90"
          >
            {updateContactsMutation.isPending ? "Salvando..." : "Salvar Contatos"}
          </Button>
        </div>
      </form>
    </div>
  );
}
