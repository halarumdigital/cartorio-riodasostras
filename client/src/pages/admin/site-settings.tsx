import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface SiteSettings {
  id?: number;
  mainLogo?: string;
  footerLogo?: string;
  browserTabName?: string;
}

export default function SiteSettings() {
  const { toast } = useToast();
  const [browserTabName, setBrowserTabName] = useState("");

  const { data: settingsData, isLoading } = useQuery<{ settings: SiteSettings }>({
    queryKey: ["/api/site-settings"],
  });

  useEffect(() => {
    if (settingsData?.settings?.browserTabName) {
      setBrowserTabName(settingsData.settings.browserTabName);
    }
  }, [settingsData]);

  const uploadLogoMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("logo", file);
      const response = await fetch("/api/upload/logo", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      return response.json();
    },
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (settings: Partial<SiteSettings>) => {
      const response = await fetch("/api/site-settings", {
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
      queryClient.invalidateQueries({ queryKey: ["/api/site-settings"] });
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

  const handleMainLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await uploadLogoMutation.mutateAsync(file);
      await updateSettingsMutation.mutateAsync({ mainLogo: result.filePath });
      toast({
        title: "Logo principal enviada com sucesso!",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao enviar logo",
        description: error.message,
      });
    }
  };

  const handleFooterLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await uploadLogoMutation.mutateAsync(file);
      await updateSettingsMutation.mutateAsync({ footerLogo: result.filePath });
      toast({
        title: "Logo do rodapé enviada com sucesso!",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao enviar logo",
        description: error.message,
      });
    }
  };

  const handleSaveBrowserTabName = async () => {
    try {
      await updateSettingsMutation.mutateAsync({ browserTabName });
      toast({
        title: "Nome da aba salvo com sucesso!",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar nome da aba",
        description: error.message,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Carregando configurações...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-serif font-bold text-brand-blue mb-6">
          Configurações do Site
        </h2>
      </div>

      <div className="bg-white p-6 rounded-lg shadow space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-brand-blue mb-4">
            Logo Principal
          </h3>
          {settingsData?.settings?.mainLogo && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Logo atual:</p>
              <img
                src={settingsData.settings.mainLogo}
                alt="Logo Principal"
                className="h-20 object-contain border border-gray-200 p-2 rounded"
              />
            </div>
          )}
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleMainLogoChange}
              disabled={uploadLogoMutation.isPending}
              className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-brand-blue file:text-white hover:file:bg-opacity-90 disabled:opacity-50"
            />
            {uploadLogoMutation.isPending && (
              <p className="text-sm text-gray-500 mt-2">Enviando...</p>
            )}
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-brand-blue mb-4">
            Logo do Rodapé
          </h3>
          {settingsData?.settings?.footerLogo && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Logo atual:</p>
              <img
                src={settingsData.settings.footerLogo}
                alt="Logo Rodapé"
                className="h-20 object-contain border border-gray-200 p-2 rounded"
              />
            </div>
          )}
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFooterLogoChange}
              disabled={uploadLogoMutation.isPending}
              className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-brand-blue file:text-white hover:file:bg-opacity-90 disabled:opacity-50"
            />
            {uploadLogoMutation.isPending && (
              <p className="text-sm text-gray-500 mt-2">Enviando...</p>
            )}
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-brand-blue mb-4">
            Nome da Aba do Navegador
          </h3>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={browserTabName}
              onChange={(e) => setBrowserTabName(e.target.value)}
              placeholder="Nome do site na aba do navegador"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-gold focus:border-brand-gold"
            />
            <Button
              onClick={handleSaveBrowserTabName}
              disabled={!browserTabName || updateSettingsMutation.isPending}
              className="bg-brand-blue hover:bg-opacity-90"
            >
              {updateSettingsMutation.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
