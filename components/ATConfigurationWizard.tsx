'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

interface ATConfigurationWizardProps {
  tenantId: string;
  onComplete?: () => void;
  onSkip?: () => void;
}

interface ValidationResult {
  valid: boolean;
  permissions?: {
    wse: boolean;
    wfa: boolean;
    wdt: boolean;
  };
  companyNif?: string;
  companyName?: string;
  error?: string;
}

type WizardStep = 1 | 2 | 3;

export function ATConfigurationWizard({
  tenantId,
  onComplete,
  onSkip,
}: ATConfigurationWizardProps) {
  const [step, setStep] = useState<WizardStep>(1);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);

  const handleValidateCredentials = async () => {
    if (!username || !password) {
      setError('Por favor preencha todos os campos');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/at/validate-credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Erro ao validar credenciais');
      }

      setValidationResult(data.data);
      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao validar credenciais');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCredentials = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/at/credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tenantId,
          username,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Erro ao guardar credenciais');
      }

      setStep(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao guardar credenciais');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = () => {
    if (onComplete) {
      onComplete();
    }
  };

  const handleSkipStep = () => {
    if (onSkip) {
      onSkip();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex items-center ${
                s < 3 ? 'flex-1' : ''
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step >= s
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    step > s ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Credenciais</span>
          <span>Verificação</span>
          <span>Concluir</span>
        </div>
      </div>

      {/* Step 1: Enter credentials */}
      {step === 1 && (
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">
            Passo 1: Inserir Credenciais AT
          </h2>

          <div className="mb-6 p-4 bg-muted rounded-md">
            <h3 className="font-semibold mb-2">Como criar sub-utilizador AT:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Aceder ao Portal das Finanças</li>
              <li>Ir para Gestão de Utilizadores</li>
              <li>Criar Novo Utilizador</li>
              <li>Ativar permissões: WSE + WFA</li>
            </ol>
            <a
              href="https://www.portaldasfinancas.gov.pt"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary text-sm underline mt-2 inline-block"
            >
              Abrir Portal das Finanças →
            </a>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="username">
                Utilizador AT (formato: NIF/0001)
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="123456789/0001"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="password">Password (8-14 caracteres)</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive rounded-md text-destructive text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={handleSkipStep}
                disabled={loading}
              >
                Configurar depois
              </Button>
              <Button
                onClick={handleValidateCredentials}
                disabled={loading || !username || !password}
              >
                {loading ? 'A validar...' : 'Validar credenciais →'}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Step 2: Verification */}
      {step === 2 && validationResult && (
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">
            Passo 2: Verificação
          </h2>

          <div className="space-y-4 mb-6">
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-center mb-2">
                <svg
                  className="w-5 h-5 text-green-600 mr-2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="font-semibold text-green-800">
                  Credenciais válidas
                </span>
              </div>
            </div>

            {validationResult.companyNif && (
              <div className="p-4 bg-muted rounded-md">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">NIF:</span>
                    <p className="font-semibold">{validationResult.companyNif}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Empresa:</span>
                    <p className="font-semibold">{validationResult.companyName}</p>
                  </div>
                </div>
              </div>
            )}

            {validationResult.permissions && (
              <div className="p-4 bg-muted rounded-md">
                <h3 className="font-semibold mb-2">Permissões ativas:</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    {validationResult.permissions.wse ? (
                      <span className="text-green-600 mr-2">✓</span>
                    ) : (
                      <span className="text-red-600 mr-2">✗</span>
                    )}
                    <span>WSE - Gestão de séries</span>
                  </div>
                  <div className="flex items-center">
                    {validationResult.permissions.wfa ? (
                      <span className="text-green-600 mr-2">✓</span>
                    ) : (
                      <span className="text-red-600 mr-2">✗</span>
                    )}
                    <span>WFA - Comunicação de faturas</span>
                  </div>
                  <div className="flex items-center">
                    {validationResult.permissions.wdt ? (
                      <span className="text-green-600 mr-2">✓</span>
                    ) : (
                      <span className="text-red-600 mr-2">✗</span>
                    )}
                    <span>WDT - Documentos de transporte</span>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive rounded-md text-destructive text-sm">
                {error}
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setStep(1)}
              disabled={loading}
            >
              ← Voltar
            </Button>
            <Button onClick={handleSaveCredentials} disabled={loading}>
              {loading ? 'A guardar...' : 'Guardar credenciais →'}
            </Button>
          </div>
        </Card>
      )}

      {/* Step 3: Success */}
      {step === 3 && (
        <Card className="p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M5 13l4 4L19 7"></path>
              </svg>
            </div>

            <h2 className="text-2xl font-bold mb-2">Tudo pronto!</h2>
            <p className="text-muted-foreground mb-6">
              As faturas serão agora enviadas automaticamente para a Autoridade
              Tributária.
            </p>

            <Button onClick={handleComplete} className="w-full">
              Concluir configuração
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
