import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface GoogleSettings {
  id?: number;
  placeId?: string;
  apiKey?: string;
  reviewsJson?: string;
}

export default function GoogleReviews() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    placeId: "",
    reviewsJson: "",
  });

  const { data: googleSettingsData, isLoading } = useQuery<{ googleSettings: GoogleSettings }>({
    queryKey: ["/api/google-settings"],
  });

  useEffect(() => {
    if (googleSettingsData?.googleSettings) {
      setFormData({
        placeId: googleSettingsData.googleSettings.placeId || "",
        reviewsJson: googleSettingsData.googleSettings.reviewsJson || "",
      });
    }
  }, [googleSettingsData]);

  const updateGoogleSettingsMutation = useMutation({
    mutationFn: async (settings: Partial<GoogleSettings>) => {
      const response = await fetch("/api/google-settings", {
        method: "PUT",
        body: JSON.stringify(settings),
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
      queryClient.invalidateQueries({ queryKey: ["/api/google-settings"] });
      toast({
        title: "Configurações salvas com sucesso!",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Erro ao salvar configurações",
        description: error.message,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateGoogleSettingsMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Carregando configurações...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-brand-blue mb-2">Google Meu Negócio</h2>
        <p className="text-gray-600">Configure as avaliações do Google Meu Negócio</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <div className="space-y-2">
          <Label htmlFor="placeId">Place ID do Google</Label>
          <Input
            id="placeId"
            value={formData.placeId}
            onChange={(e) => setFormData({ ...formData, placeId: e.target.value })}
            placeholder="Ex: ChIJN1t_tDeuEmsRUsoyG83frY4"
          />
          <p className="text-sm text-gray-500">
            Para encontrar seu Place ID, acesse:{" "}
            <a
              href="https://developers.google.com/maps/documentation/places/web-service/place-id"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-blue hover:underline"
            >
              Google Place ID Finder
            </a>
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="reviewsJson">Avaliações (JSON)</Label>
          <Textarea
            id="reviewsJson"
            value={formData.reviewsJson}
            onChange={(e) => setFormData({ ...formData, reviewsJson: e.target.value })}
            placeholder='[{"author":"João Silva","rating":5,"text":"Excelente atendimento!"}]'
            rows={10}
            className="font-mono text-sm"
          />
          <p className="text-sm text-gray-500">
            Cole aqui o JSON das avaliações do Google. Cada avaliação deve ter: author (nome), rating (nota de 1-5), text (comentário) e date (opcional).
          </p>
        </div>

        <Button type="submit" disabled={updateGoogleSettingsMutation.isPending}>
          {updateGoogleSettingsMutation.isPending ? "Salvando..." : "Salvar Configurações"}
        </Button>
      </form>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-brand-blue mb-2">Como obter as avaliações?</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
          <li>Acesse o Google Meu Negócio e copie suas avaliações</li>
          <li>Formate no padrão JSON como mostrado no exemplo acima</li>
          <li>Cole no campo "Avaliações (JSON)" e salve</li>
          <li>As avaliações aparecerão automaticamente na seção "What Our Clients Say" da página principal</li>
        </ol>
      </div>
    </div>
  );
}
