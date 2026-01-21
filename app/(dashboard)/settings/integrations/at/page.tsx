'use client';

import React, { useState, useEffect } from 'react';
import { ATConfigurationWizard } from '@/components/ATConfigurationWizard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// Mock tenant ID - in production, get from auth context
const MOCK_TENANT_ID = '00000000-0000-0000-0000-000000000000';

interface ATCredentialsStatus {
  id: string;
  tenantId: string;
  atUsername: string;
  wseEnabled: boolean;
  wfaEnabled: boolean;
  wdtEnabled: boolean;
  isActive: boolean;
  lastValidatedAt?: string;
  validationError?: string;
}

export default function ATIntegrationPage() {
  const [showWizard, setShowWizard] = useState(false);
  const [credentials, setCredentials] = useState<ATCredentialsStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCredentials();
  }, []);

  const loadCredentials = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/at/credentials/${MOCK_TENANT_ID}`);

      if (response.status === 404) {
        // No credentials configured yet
        setCredentials(null);
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Erro ao carregar credenciais');
      }

      setCredentials(data.data);
    } catch (err) {
      console.error('Error loading credentials:', err);
      setCredentials(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCredentials = async () => {
    if (!confirm('Tem a certeza que deseja remover as credenciais AT?')) {
      return;
    }

    try {
      const response = await fetch(`/api/at/credentials/${MOCK_TENANT_ID}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Erro ao remover credenciais');
      }

      setCredentials(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover credenciais');
    }
  };

  const handleWizardComplete = () => {
    setShowWizard(false);
    loadCredentials();
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center">
          <div className="text-muted-foreground">A carregar...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Integração com Autoridade Tributária</h1>
        <p className="text-muted-foreground">
          Configure o envio automático de faturas para o Portal das Finanças
        </p>
      </div>

      {showWizard ? (
        <ATConfigurationWizard
          tenantId={MOCK_TENANT_ID}
          onComplete={handleWizardComplete}
          onSkip={() => setShowWizard(false)}
        />
      ) : credentials ? (
        <>
          {/* Configured state */}
          <Card className="p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">Configuração Ativa</h2>
                <p className="text-sm text-muted-foreground">
                  As faturas serão enviadas automaticamente para a AT
                </p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                Ativa
              </div>
            </div>

            <div className="grid gap-4 mb-6">
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-md">
                <div>
                  <span className="text-sm text-muted-foreground">Utilizador AT</span>
                  <p className="font-semibold">{credentials.atUsername}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Última validação</span>
                  <p className="font-semibold">
                    {credentials.lastValidatedAt
                      ? new Date(credentials.lastValidatedAt).toLocaleDateString('pt-PT')
                      : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-muted rounded-md">
                <h3 className="font-semibold mb-2 text-sm">Permissões ativas:</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    {credentials.wseEnabled ? (
                      <span className="text-green-600 mr-2">✓</span>
                    ) : (
                      <span className="text-muted-foreground mr-2">✗</span>
                    )}
                    <span>WSE - Gestão de séries</span>
                  </div>
                  <div className="flex items-center">
                    {credentials.wfaEnabled ? (
                      <span className="text-green-600 mr-2">✓</span>
                    ) : (
                      <span className="text-muted-foreground mr-2">✗</span>
                    )}
                    <span>WFA - Comunicação de faturas</span>
                  </div>
                  <div className="flex items-center">
                    {credentials.wdtEnabled ? (
                      <span className="text-green-600 mr-2">✓</span>
                    ) : (
                      <span className="text-muted-foreground mr-2">✗</span>
                    )}
                    <span>WDT - Documentos de transporte</span>
                  </div>
                </div>
              </div>

              {credentials.validationError && (
                <div className="p-3 bg-destructive/10 border border-destructive rounded-md text-destructive text-sm">
                  <strong>Erro:</strong> {credentials.validationError}
                </div>
              )}

              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive rounded-md text-destructive text-sm">
                  {error}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowWizard(true)}>
                Reconfigurar
              </Button>
              <Button variant="destructive" onClick={handleRemoveCredentials}>
                Remover integração
              </Button>
            </div>
          </Card>

          {/* Info cards */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-2">Como funciona?</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Quando finaliza uma fatura no Faturex, o documento é automaticamente
                enviado para o Portal das Finanças usando as suas credenciais.
              </p>
              <p className="text-sm text-muted-foreground">
                O prazo legal para comunicação é até o dia 8 do mês seguinte à emissão.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-2">Segurança</h3>
              <p className="text-sm text-muted-foreground mb-3">
                As suas credenciais são encriptadas com AES-256-GCM antes de serem
                armazenadas na base de dados.
              </p>
              <p className="text-sm text-muted-foreground">
                Apenas o sub-utilizador criado especificamente para webservices tem
                acesso limitado à AT.
              </p>
            </Card>
          </div>
        </>
      ) : (
        <>
          {/* Not configured state */}
          <Card className="p-8 text-center mb-6">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-muted-foreground"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>

            <h2 className="text-xl font-semibold mb-2">
              Integração AT não configurada
            </h2>
            <p className="text-muted-foreground mb-6">
              Configure o envio automático de faturas para a Autoridade Tributária
            </p>

            <div className="flex gap-3 justify-center">
              <Button onClick={() => setShowWizard(true)}>
                Configurar agora
              </Button>
              <Button variant="outline" asChild>
                <a
                  href="https://www.portaldasfinancas.gov.pt"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Portal das Finanças →
                </a>
              </Button>
            </div>
          </Card>

          {/* Benefits */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-2">⚡ Automático</h3>
              <p className="text-sm text-muted-foreground">
                Faturas enviadas automaticamente ao finalizar, sem intervenção manual
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-2">🔒 Seguro</h3>
              <p className="text-sm text-muted-foreground">
                Credenciais encriptadas e permissões limitadas apenas ao necessário
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-2">✓ Conformidade</h3>
              <p className="text-sm text-muted-foreground">
                Cumpre automaticamente com prazos legais de comunicação à AT
              </p>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
