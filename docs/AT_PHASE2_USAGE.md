# Guia de Utilização - AT Integration Phase 2

## 🚀 Quick Start

Este guia explica como utilizar a nova funcionalidade de envio automático de faturas para a Autoridade Tributária (AT) via webservice SOAP.

---

## 📋 Pré-requisitos

Antes de usar a integração AT Phase 2, certifique-se de que:

1. ✅ Completou a Fase 1 (credenciais AT configuradas)
2. ✅ Tem um sub-utilizador criado no Portal das Finanças com perfil **WFA**
3. ✅ Instalou as dependências: `npm install`
4. ✅ Configurou as variáveis de ambiente (ver abaixo)

---

## ⚙️ Configuração

### 1. Variáveis de Ambiente

Adicione ao seu `.env`:

```bash
# AT Environment
AT_ENVIRONMENT=development  # ou 'production'

# WSDL URLs
AT_WSDL_URL_PRODUCTION=https://servicos.portaldasfinancas.gov.pt:723/fatcorews/ws?wsdl
AT_WSDL_URL_HOMOLOG=https://servicos.portaldasfinancas.gov.pt:722/fatcorews/ws?wsdl

# Mock mode (para desenvolvimento sem acesso à AT)
AT_USE_MOCK_VALIDATION=true  # Mudar para 'false' em produção

# Opcional: Certificado digital (para produção)
# AT_CERTIFICATE_PATH=/path/to/certificate.pfx
# AT_CERTIFICATE_PASSWORD=your_certificate_password
```

### 2. Modo de Desenvolvimento vs Produção

#### Modo Desenvolvimento (Mock)
```bash
AT_ENVIRONMENT=development
AT_USE_MOCK_VALIDATION=true
```
- Usa validação simulada
- Não faz chamadas reais à AT
- Ideal para testes locais

#### Modo Produção (Real)
```bash
AT_ENVIRONMENT=production
AT_USE_MOCK_VALIDATION=false
```
- Usa webservice SOAP real da AT
- Requer credenciais válidas
- Requer acesso ao WSDL oficial

---

## 📤 Como Enviar uma Fatura para AT

### Passo 1: Finalizar a Fatura

Antes de enviar, a fatura **deve estar finalizada** (status = 'F'):

```http
POST /api/invoices/:invoiceId/finalize
Content-Type: application/json

{
  "sourceId": "user123"
}
```

### Passo 2: Enviar para AT

```http
POST /api/invoices/:invoiceId/submit-to-at
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
  "tenantId": "uuid-tenant-id"
}
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": {
    "atResponseCode": "0",
    "atMessage": "Fatura enviada com sucesso",
    "atDocumentId": "AT-DOC-123456"
  },
  "message": "Fatura enviada para AT com sucesso"
}
```

**Resposta de Erro (400):**
```json
{
  "success": false,
  "error": "Apenas faturas finalizadas podem ser enviadas para AT",
  "code": "INVALID_STATUS"
}
```

---

## 🔍 Verificar Status de Envio

### Consultar Logs de Submissão

```sql
SELECT * FROM at_submission_logs
WHERE invoice_id = 'your-invoice-id'
ORDER BY submitted_at DESC;
```

**Campos importantes:**
- `status`: 'pending', 'success', 'error', 'retry'
- `request_payload`: XML enviado
- `response_payload`: Resposta da AT
- `error_message`: Mensagem de erro (se houver)
- `at_response_code`: Código de resposta da AT

### Verificar se Fatura já foi Enviada

```sql
SELECT at_document_id, at_submitted_at
FROM invoices
WHERE id = 'your-invoice-id';
```

Se `at_document_id` não é null, a fatura já foi enviada com sucesso.

---

## 🧪 Testes

### Teste 1: Validação de Credenciais

```http
POST /api/at/validate-credentials
Content-Type: application/json

{
  "username": "123456789/0001",
  "password": "password123"
}
```

**Resposta esperada (Mock Mode):**
```json
{
  "success": true,
  "data": {
    "valid": true,
    "permissions": {
      "wse": true,
      "wfa": true,
      "wdt": false
    },
    "companyNif": "123456789",
    "companyName": "Empresa 123456789"
  }
}
```

### Teste 2: Envio de Fatura

1. Criar fatura draft
2. Finalizar fatura
3. Enviar para AT
4. Verificar logs

---

## ⚠️ Tratamento de Erros

### Erros Comuns

| Erro | Causa | Solução |
|------|-------|---------|
| `Credenciais AT não configuradas` | Tenant sem credenciais | Configure via wizard AT |
| `Apenas faturas finalizadas podem ser enviadas` | Status ≠ 'F' | Finalize a fatura primeiro |
| `Fatura já foi enviada anteriormente` | Duplicação | Verifique logs, não precisa reenviar |
| `SOAP_ERROR` | Falha na conexão AT | Verifique rede, WSDL, credenciais |
| `Dados de fatura inválidos` | XML inválido | Verifique campos obrigatórios |

### Retry Logic

A aplicação **não faz retry automático** por padrão. Para implementar:

**Opção 1: Manual**
```http
POST /api/invoices/:id/submit-to-at
```
Pode reenviar manualmente. O sistema verifica duplicação automaticamente.

**Opção 2: Queue (Futuro)**
Implementar com BullMQ para retry exponencial automático.

---

## 🔐 Segurança

### Credenciais AT

- ✅ Armazenadas **encriptadas** (AES-256-GCM)
- ✅ Chave de encriptação em `ENCRYPTION_KEY`
- ✅ Nunca expostas em logs ou APIs
- ✅ Desencriptadas apenas no momento do envio

### Certificados Digitais

Para produção com certificado:

1. Obter certificado de teste: asi-psws@at.gov.pt
2. Produção: Certificado qualificado (Multicert, DigitalSign)
3. Armazenar em local seguro
4. Configurar em `.env`:
   ```bash
   AT_CERTIFICATE_PATH=/secure/path/certificate.pfx
   AT_CERTIFICATE_PASSWORD=strong_password
   ```

---

## 📊 Monitorização

### Logs da Aplicação

```bash
# Ver logs de SOAP
grep "AT SOAP" logs/application.log

# Ver erros
grep "SOAP validation failed" logs/application.log
```

### Métricas Importantes

- Taxa de sucesso de envios
- Tempo médio de resposta AT
- Erros mais frequentes
- Faturas pendentes de envio

---

## 🛠️ Troubleshooting

### Problema: "Failed to connect to AT SOAP webservice"

**Causas possíveis:**
- WSDL URL incorreto
- Rede sem acesso ao Portal das Finanças
- Firewall bloqueando portas 722/723
- Certificado SSL inválido

**Solução:**
1. Verificar `AT_WSDL_URL_*` em `.env`
2. Testar conectividade: `curl -I https://servicos.portaldasfinancas.gov.pt:723/`
3. Verificar firewall
4. Contactar suporte AT: asi-psws@at.gov.pt

### Problema: "SOAP client not connected"

**Causa:** Chamada de método sem conectar primeiro

**Solução:** O código conecta automaticamente, mas se persistir:
```typescript
const soapService = new ATSOAPService();
await soapService.connect(config);
// ... usar métodos
soapService.disconnect();
```

### Problema: XML gerado está incorreto

**Solução:**
1. Validar dados da fatura antes de enviar
2. Verificar campos obrigatórios (NIF, ATCUD, totais)
3. Consultar logs de submissão para ver XML enviado
4. Comparar com especificação SAF-T (PT) 1.04

---

## 📚 Recursos Adicionais

### Documentação Oficial AT
- [Portal das Finanças](https://www.portaldasfinancas.gov.pt)
- [FAQ Webservices](https://info.portaldasfinancas.gov.pt/pt/apoio_contribuinte/questoes_frequentes/pages/faqs-00996.aspx)
- Email suporte: asi-psws@at.gov.pt

### Documentos do Projeto
- `docs/AT_INTEGRATION_PHASE1.md` - Fase 1 (Credenciais)
- `docs/AT_INTEGRATION_PHASE2.md` - Fase 2 (SOAP)
- `database/migrations/001_add_multi_tenant_at_integration.sql` - Schema

### Código Fonte
- `src/services/at-soap.service.ts` - Cliente SOAP
- `src/services/at-xml-builder.ts` - Gerador XML
- `src/services/at.service.ts` - Lógica de negócio
- `src/api/invoices.routes.ts` - API endpoints

---

## 🔄 Próximas Versões

### Fase 2.3: UI (Futuro)
- Botão "Enviar para AT" na página de fatura
- Indicador visual de status de envio
- Histórico de envios na UI

### Fase 2.4: Queue & Retry (Futuro)
- BullMQ para processamento assíncrono
- Retry exponencial automático
- Dashboard de monitorização

### Fase 2.5: Features Avançadas (Futuro)
- Envio automático após finalização
- Webhooks de notificação
- Suporte para documentos de transporte (WDT)
- Gestão de séries via webservice (WSE)

---

## 📞 Suporte

**Problemas técnicos:** Abrir issue no GitHub do projeto
**Questões sobre AT:** asi-psws@at.gov.pt ou 217 206 707

---

**Última atualização:** 2026-01-21
**Versão:** 1.0
