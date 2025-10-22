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
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPassword?: string;
  smtpSecure?: boolean;
  solicitacoesEmail?: string;
  apiUrl?: string;
  apiToken?: string;
  apiPort?: number;
}

export default function SiteSettings() {
  const { toast } = useToast();
  const [browserTabName, setBrowserTabName] = useState("");
  const [smtpHost, setSmtpHost] = useState("");
  const [smtpPort, setSmtpPort] = useState<number>(587);
  const [smtpUser, setSmtpUser] = useState("");
  const [smtpPassword, setSmtpPassword] = useState("");
  const [smtpSecure, setSmtpSecure] = useState(true);
  const [solicitacoesEmail, setSolicitacoesEmail] = useState("");
  const [apiUrl, setApiUrl] = useState("");
  const [apiToken, setApiToken] = useState("");
  const [apiPort, setApiPort] = useState<number>(3000);

  const { data: settingsData, isLoading } = useQuery<{ settings: SiteSettings }>({
    queryKey: ["/api/site-settings"],
  });

  useEffect(() => {
    if (settingsData?.settings) {
      if (settingsData.settings.browserTabName) {
        setBrowserTabName(settingsData.settings.browserTabName);
      }
      if (settingsData.settings.smtpHost) {
        setSmtpHost(settingsData.settings.smtpHost);
      }
      if (settingsData.settings.smtpPort) {
        setSmtpPort(settingsData.settings.smtpPort);
      }
      if (settingsData.settings.smtpUser) {
        setSmtpUser(settingsData.settings.smtpUser);
      }
      if (settingsData.settings.smtpPassword) {
        setSmtpPassword(settingsData.settings.smtpPassword);
      }
      if (settingsData.settings.smtpSecure !== undefined) {
        setSmtpSecure(settingsData.settings.smtpSecure);
      }
      if (settingsData.settings.solicitacoesEmail) {
        setSolicitacoesEmail(settingsData.settings.solicitacoesEmail);
      }
      if (settingsData.settings.apiUrl) {
        setApiUrl(settingsData.settings.apiUrl);
      }
      if (settingsData.settings.apiToken) {
        setApiToken(settingsData.settings.apiToken);
      }
      if (settingsData.settings.apiPort) {
        setApiPort(settingsData.settings.apiPort);
      }
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

  const handleSaveSmtpSettings = async () => {
    try {
      await updateSettingsMutation.mutateAsync({
        smtpHost,
        smtpPort,
        smtpUser,
        smtpPassword,
        smtpSecure,
      });
      toast({
        title: "Configurações SMTP salvas com sucesso!",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar configurações SMTP",
        description: error.message,
      });
    }
  };

  const handleSaveSolicitacoesEmail = async () => {
    try {
      await updateSettingsMutation.mutateAsync({ solicitacoesEmail });
      toast({
        title: "Email de solicitações salvo com sucesso!",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar email de solicitações",
        description: error.message,
      });
    }
  };

  const handleSaveApiSettings = async () => {
    try {
      await updateSettingsMutation.mutateAsync({
        apiUrl,
        apiToken,
        apiPort,
      });
      toast({
        title: "Configurações da API salvas com sucesso!",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar configurações da API",
        description: error.message,
      });
    }
  };

  const testEmailMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/test-email", {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || error.details);
      }
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Email de teste enviado!",
        description: `Verifique a caixa de entrada de ${data.emailDestino}`,
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Erro ao enviar email de teste",
        description: error.message,
      });
    },
  });

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

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-brand-blue mb-4">
            Configurações SMTP
          </h3>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
            <h4 className="font-semibold text-sm text-blue-900 mb-2">Configurações para Gmail:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Host: smtp.gmail.com</li>
              <li>• Porta: 587</li>
              <li>• <strong>Conexão Segura: DESMARCADO (porta 587 usa STARTTLS)</strong></li>
              <li>• Senha: Use uma Senha de App (não a senha normal)</li>
              <li className="mt-2">
                <a
                  href="https://myaccount.google.com/apppasswords"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  Criar Senha de App do Google →
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Servidor SMTP (Host)
                </label>
                <input
                  type="text"
                  value={smtpHost}
                  onChange={(e) => setSmtpHost(e.target.value)}
                  placeholder="smtp.gmail.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-gold focus:border-brand-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Porta SMTP
                </label>
                <input
                  type="number"
                  value={smtpPort}
                  onChange={(e) => setSmtpPort(Number(e.target.value))}
                  placeholder="587"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-gold focus:border-brand-gold"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Usuário SMTP (Email)
                </label>
                <input
                  type="email"
                  value={smtpUser}
                  onChange={(e) => setSmtpUser(e.target.value)}
                  placeholder="seu-email@gmail.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-gold focus:border-brand-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Senha SMTP (use Senha de App para Gmail)
                </label>
                <input
                  type="password"
                  value={smtpPassword}
                  onChange={(e) => setSmtpPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-gold focus:border-brand-gold"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="smtpSecure"
                  checked={smtpSecure}
                  onChange={(e) => setSmtpSecure(e.target.checked)}
                  className="h-4 w-4 text-brand-blue focus:ring-brand-gold border-gray-300 rounded"
                />
                <label htmlFor="smtpSecure" className="text-sm font-medium text-gray-700">
                  Usar conexão segura SSL/TLS direta (porta 465)
                </label>
              </div>
              {smtpPort === 587 && smtpSecure && (
                <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
                  ⚠️ Atenção: Porta 587 usa STARTTLS. Desmarque esta opção!
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Desmarque para porta 587 (STARTTLS). Marque apenas para porta 465 (SSL direto).
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                onClick={() => testEmailMutation.mutate()}
                disabled={testEmailMutation.isPending}
                variant="outline"
                className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white"
              >
                {testEmailMutation.isPending ? "Enviando..." : "Testar Email"}
              </Button>
              <Button
                onClick={handleSaveSmtpSettings}
                disabled={updateSettingsMutation.isPending}
                className="bg-brand-blue hover:bg-opacity-90"
              >
                {updateSettingsMutation.isPending ? "Salvando..." : "Salvar Configurações SMTP"}
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-brand-blue mb-4">
            Email para Solicitações
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Configure o email para onde serão enviadas as solicitações do site.
          </p>
          <div className="flex items-center space-x-4">
            <input
              type="email"
              value={solicitacoesEmail}
              onChange={(e) => setSolicitacoesEmail(e.target.value)}
              placeholder="solicitacoes@cartorio.com.br"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-gold focus:border-brand-gold"
            />
            <Button
              onClick={handleSaveSolicitacoesEmail}
              disabled={!solicitacoesEmail || updateSettingsMutation.isPending}
              className="bg-brand-blue hover:bg-opacity-90"
            >
              {updateSettingsMutation.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-brand-blue mb-4">
            Configurações da API
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Configure as informações de conexão com a API externa.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL da API
              </label>
              <input
                type="text"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="https://api.exemplo.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-gold focus:border-brand-gold"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Token da API
              </label>
              <input
                type="password"
                value={apiToken}
                onChange={(e) => setApiToken(e.target.value)}
                placeholder="••••••••••••••••••••"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-gold focus:border-brand-gold"
              />
              <p className="text-xs text-gray-500 mt-1">
                Token de autenticação para acesso seguro à API
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Porta da API
              </label>
              <input
                type="number"
                value={apiPort}
                onChange={(e) => setApiPort(Number(e.target.value))}
                placeholder="3000"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-gold focus:border-brand-gold"
              />
              <p className="text-xs text-gray-500 mt-1">
                Porta de conexão com o servidor da API (padrão: 3000)
              </p>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleSaveApiSettings}
                disabled={updateSettingsMutation.isPending}
                className="bg-brand-blue hover:bg-opacity-90"
              >
                {updateSettingsMutation.isPending ? "Salvando..." : "Salvar Configurações da API"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
