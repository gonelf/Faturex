# Integração AT - Fase 2: Envio SOAP Real para AT

## 🎯 Objetivo

Implementar envio automático **real** de faturas para a Autoridade Tributária portuguesa via webservice SOAP, substituindo a validação mock da Fase 1.

---

## 📋 Contexto da Fase 1

A Fase 1 (já implementada) criou:

✅ Multi-tenancy incremental
✅ Encriptação de credenciais AES-256-GCM
✅ Wizard de configuração UI
✅ API endpoints de gestão de credenciais
✅ **Mock validation** (aceita qualquer formato válido)

**Limitação atual**: Não há integração real com webservice AT.

---

## 🚀 Fase 2: Escopo

### **Objetivos Principais**

1. **Pesquisar documentação oficial do webservice SOAP da AT**
   - Endpoints de produção e homologação
   - Formato WSDL/XML
   - Autenticação (username/password vs certificados)
   - Estrutura de request/response

2. **Implementar cliente SOAP em Node.js**
   - Biblioteca: `soap` ou `strong-soap`
   - Wrapper TypeScript com tipos
   - Gestão de erros AT específicos

3. **Criar endpoint de envio de faturas**
   - `POST /api/invoices/:id/submit-to-at`
   - Validação de fatura finalizada
   - Geração de XML conforme AT
   - Envio via SOAP
   - Atualização de status

4. **Implementar queue e retry logic**
   - Queue de envios (BullMQ ou similar)
   - Retry exponencial backoff (2s, 4s, 8s, 16s)
   - Log detalhado de tentativas
   - Alertas de falhas persistentes

5. **Substituir mock validation por validação real**
   - `/api/at/validate-credentials` passa a chamar AT real
   - Verificar permissões WSE/WFA/WDT com AT
   - Retornar erros reais da AT

---

## 📚 Investigação Necessária

### **1. Documentação AT**

**Procurar:**
- Manual oficial de integração webservice AT
- WSDL endpoints (produção + homologação)
- Especificação XML de comunicação de faturas
- Códigos de erro AT
- Requisitos de certificados digitais

**Fontes:**
- Portal das Finanças: https://www.portaldasfinancas.gov.pt
- FAQ Webservice: https://info.portaldasfinancas.gov.pt/pt/apoio_contribuinte/questoes_frequentes/pages/faqs-00996.aspx
- Contacto técnico AT: `asi-psws@at.gov.pt` (para certificados teste)

**Questões a responder:**
- ✓ Qual o endpoint WSDL de homologação?
- ✓ Qual o endpoint WSDL de produção?
- ✓ Autenticação é username/password ou certificado obrigatório?
- ✓ Formato do XML de envio de fatura?
- ✓ Como obter certificado de teste?
- ✓ Prazo de resposta típico do webservice?

### **2. Exemplos de Referência**

**Projetos open-source:**
- AtWS (Delphi): https://github.com/nunopicado/AtWS
- Pesquisar no GitHub: "portugal autoridade tributaria soap"
- Analisar implementações de InvoiceXpress, Moloni, etc. (se disponível)

**Documentação de terceiros:**
- Guias de outros softwares certificados
- Artigos técnicos sobre integração AT

---

## 🏗️ Arquitetura Proposta

### **Estrutura de Ficheiros**

```
src/
├── services/
│   ├── at.service.ts              # Existente (atualizar)
│   ├── at-soap.service.ts         # NOVO - Cliente SOAP
│   └── at-queue.service.ts        # NOVO - Queue de envios
│
├── api/
│   └── at.routes.ts               # Existente (adicionar routes)
│
└── utils/
    ├── at-xml-builder.ts          # NOVO - Gerar XML AT
    └── at-error-parser.ts         # NOVO - Parse erros AT
```

### **Fluxo de Envio**

```
1. User finaliza fatura no Faturex
   ↓
2. POST /api/invoices/:id/finalize
   ↓
3. Fatura marcada como finalizada (status='F')
   ↓
4. [TRIGGER ou MANUAL] POST /api/invoices/:id/submit-to-at
   ↓
5. ATService.submitInvoice()
   ├─> Busca credenciais AT do tenant
   ├─> Valida fatura (finalizada, não enviada antes)
   ├─> ATXMLBuilder.buildInvoiceXML(invoice)
   ├─> ATSOAPService.sendInvoice(xml, credentials)
   │   ├─> Conecta ao WSDL AT
   │   ├─> Autentica (username/password ou certificado)
   │   ├─> Envia XML
   │   └─> Recebe resposta AT
   ├─> Parseia resposta (success/error)
   ├─> Log em at_submission_logs
   └─> Retorna resultado
   ↓
6. [Se erro] → Queue para retry (ATQueueService)
   ↓
7. Response ao cliente
```

---

## 📦 Implementação Técnica

### **1. at-soap.service.ts**

```typescript
/**
 * AT SOAP Client
 * Handles low-level SOAP communication with AT webservice
 */

import * as soap from 'soap';

interface ATSOAPConfig {
  wsdlUrl: string; // Homologação vs Produção
  username: string; // NIF/0001
  password: string;
  certificate?: Buffer; // Certificado digital (opcional)
}

interface ATInvoiceSubmissionResult {
  success: boolean;
  atResponseCode: string;
  atMessage: string;
  atDocumentId?: string;
  errorDetails?: any;
}

export class ATSOAPService {
  private client: soap.Client | null = null;

  async connect(config: ATSOAPConfig): Promise<void> {
    // Criar cliente SOAP
    this.client = await soap.createClientAsync(config.wsdlUrl);

    // Configurar autenticação
    if (config.certificate) {
      // Autenticação com certificado
      this.client.setSecurity(new soap.ClientSSLSecurity(
        config.certificate,
        config.certificate
      ));
    } else {
      // Autenticação username/password
      this.client.setWSSecurity(
        new soap.WSSecurity(config.username, config.password)
      );
    }
  }

  async submitInvoice(
    invoiceXML: string
  ): Promise<ATInvoiceSubmissionResult> {
    if (!this.client) {
      throw new Error('SOAP client not connected');
    }

    try {
      // Chamar método do webservice (nome exato depende do WSDL)
      const result = await this.client.SubmitInvoiceAsync({
        InvoiceData: invoiceXML,
      });

      // Parsear resposta AT
      return {
        success: result.Success === true,
        atResponseCode: result.ResponseCode,
        atMessage: result.Message,
        atDocumentId: result.DocumentId,
      };
    } catch (error) {
      return {
        success: false,
        atResponseCode: 'SOAP_ERROR',
        atMessage: error.message,
        errorDetails: error,
      };
    }
  }
}
```

### **2. at-xml-builder.ts**

```typescript
/**
 * AT XML Builder
 * Generates XML in AT-compliant format for invoice submission
 */

export interface InvoiceData {
  invoiceNo: string;
  invoiceDate: string;
  customerNif: string;
  netTotal: number;
  taxTotal: number;
  grossTotal: number;
  lines: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    taxRate: number;
  }>;
}

export class ATXMLBuilder {
  static buildInvoiceXML(invoice: InvoiceData): string {
    // Construir XML conforme especificação AT
    // Formato exato depende da documentação oficial

    return `
      <?xml version="1.0" encoding="UTF-8"?>
      <Invoice>
        <InvoiceNo>${invoice.invoiceNo}</InvoiceNo>
        <InvoiceDate>${invoice.invoiceDate}</InvoiceDate>
        <CustomerTaxID>${invoice.customerNif}</CustomerTaxID>
        <DocumentTotals>
          <NetTotal>${invoice.netTotal}</NetTotal>
          <TaxPayable>${invoice.taxTotal}</TaxPayable>
          <GrossTotal>${invoice.grossTotal}</GrossTotal>
        </DocumentTotals>
        <!-- ... mais campos conforme AT ... -->
      </Invoice>
    `;
  }
}
```

### **3. Atualizar at.service.ts**

```typescript
// Adicionar método real de validação
export async function validateCredentials(
  credentials: ATCredentials
): Promise<CredentialsValidationResult> {
  // Substituir mockATValidation por:
  const soapService = new ATSOAPService();

  try {
    await soapService.connect({
      wsdlUrl: AT_WSDL_URL_HOMOLOG,
      username: credentials.username,
      password: credentials.password,
    });

    // Fazer uma chamada de teste (verificar permissões)
    const result = await soapService.testConnection();

    return {
      valid: result.success,
      permissions: result.permissions,
      companyNif: extractNIF(credentials.username),
      companyName: result.companyName,
    };
  } catch (error) {
    return {
      valid: false,
      error: `Credenciais inválidas: ${error.message}`,
    };
  }
}

// Adicionar método de envio
export async function submitInvoiceToAT(
  invoiceId: string,
  tenantId: string
): Promise<SubmissionResult> {
  // 1. Buscar credenciais
  const credentials = await getDecryptedCredentials(tenantId);
  if (!credentials) {
    throw new Error('Credenciais AT não configuradas');
  }

  // 2. Buscar fatura
  const invoice = await getInvoice(invoiceId);
  if (invoice.documentStatus !== 'F') {
    throw new Error('Apenas faturas finalizadas podem ser enviadas');
  }

  // 3. Gerar XML
  const xml = ATXMLBuilder.buildInvoiceXML(invoice);

  // 4. Conectar SOAP
  const soapService = new ATSOAPService();
  await soapService.connect({
    wsdlUrl: AT_WSDL_URL_PRODUCTION,
    username: credentials.username,
    password: credentials.password,
  });

  // 5. Enviar
  const result = await soapService.submitInvoice(xml);

  // 6. Log
  await logSubmission(
    tenantId,
    'invoice',
    result.success ? 'success' : 'error',
    { xml },
    result,
    result.atMessage
  );

  return result;
}
```

### **4. Adicionar route em at.routes.ts**

```typescript
/**
 * POST /api/invoices/:id/submit-to-at
 * Submit finalized invoice to AT
 */
router.post('/invoices/:id/submit-to-at', async (req, res) => {
  try {
    const { id } = req.params;
    const tenantId = req.body.tenantId; // ou de req.user

    const result = await ATService.submitInvoiceToAT(id, tenantId);

    if (result.success) {
      res.status(200).json({
        success: true,
        data: result,
        message: 'Fatura enviada para AT com sucesso',
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.atMessage,
        code: result.atResponseCode,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
```

---

## 🧪 Testing Strategy

### **1. Ambiente de Homologação AT**

- Obter acesso ao ambiente de testes AT
- Solicitar certificado de teste via `asi-psws@at.gov.pt`
- Configurar WSDL URL de homologação

### **2. Testes Unitários**

```typescript
// test/at-soap.service.test.ts
describe('ATSOAPService', () => {
  it('should connect to AT webservice', async () => {
    const service = new ATSOAPService();
    await service.connect({
      wsdlUrl: TEST_WSDL_URL,
      username: 'TEST_USER',
      password: 'TEST_PASS',
    });
    expect(service.client).toBeDefined();
  });

  it('should submit invoice successfully', async () => {
    // Mock SOAP response
    const result = await service.submitInvoice(mockXML);
    expect(result.success).toBe(true);
  });
});
```

### **3. Testes de Integração**

- Testar com credenciais reais de homologação
- Validar XML gerado
- Verificar retry logic
- Testar cenários de erro AT

---

## 📊 Variáveis de Ambiente

Adicionar ao `.env`:

```bash
# AT Webservice URLs
AT_WSDL_URL_HOMOLOG=https://...homologacao...
AT_WSDL_URL_PRODUCTION=https://...producao...

# AT Environment (development/production)
AT_ENVIRONMENT=development

# AT Certificate Path (opcional)
AT_CERTIFICATE_PATH=/path/to/certificate.pem
```

---

## 🔐 Certificados Digitais

### **Quando são necessários?**

Pesquisar se AT exige certificado ou aceita username/password.

### **Como obter:**

1. Ambiente de teste: Solicitar via `asi-psws@at.gov.pt`
2. Produção: Obter certificado qualificado (ex: Multicert, DigitalSign)

### **Implementação:**

```typescript
import fs from 'fs';

const certificate = fs.readFileSync(
  process.env.AT_CERTIFICATE_PATH,
  'utf-8'
);

await soapService.connect({
  wsdlUrl: AT_WSDL_URL,
  username: credentials.username,
  password: credentials.password,
  certificate: Buffer.from(certificate),
});
```

---

## 📦 Dependências NPM

```bash
npm install soap
npm install --save-dev @types/soap

# Para queue (opcional Fase 2)
npm install bullmq ioredis
npm install --save-dev @types/ioredis
```

---

## ✅ Checklist de Implementação

### **Fase 2.1: Investigação**
- [ ] Encontrar documentação oficial SOAP AT
- [ ] Obter WSDL de homologação
- [ ] Obter WSDL de produção
- [ ] Identificar método SOAP de envio de fatura
- [ ] Documentar formato XML esperado
- [ ] Solicitar certificado de teste (se necessário)

### **Fase 2.2: Implementação Core**
- [ ] Criar `at-soap.service.ts`
- [ ] Criar `at-xml-builder.ts`
- [ ] Atualizar `validateCredentials()` com SOAP real
- [ ] Implementar `submitInvoiceToAT()`
- [ ] Adicionar route `POST /api/invoices/:id/submit-to-at`

### **Fase 2.3: UI Updates**
- [ ] Adicionar botão "Enviar para AT" na página de fatura
- [ ] Mostrar status de envio AT
- [ ] Exibir erros AT ao utilizador
- [ ] Histórico de envios na UI

### **Fase 2.4: Queue & Retry**
- [ ] Implementar queue de envios (BullMQ)
- [ ] Retry logic exponencial
- [ ] Job para processar envios pendentes
- [ ] Alertas de falhas persistentes

### **Fase 2.5: Testing**
- [ ] Testes unitários SOAP service
- [ ] Testes integração com AT homologação
- [ ] Validar XML gerado
- [ ] Testar todos os cenários de erro
- [ ] Performance testing (múltiplos envios)

### **Fase 2.6: Documentação**
- [ ] Atualizar README com instruções SOAP
- [ ] Documentar códigos de erro AT
- [ ] Guia de troubleshooting
- [ ] Atualizar AT_INTEGRATION_PHASE1.md

---

## 🚨 Riscos e Mitigações

| Risco | Mitigação |
|-------|-----------|
| Documentação AT incompleta | Contactar suporte técnico AT, analisar projetos open-source |
| Certificado digital obrigatório | Obter certificado teste rapidamente, planear aquisição produção |
| Webservice AT instável | Implementar retry robusto, timeouts adequados |
| Formato XML incorreto | Validar contra schema XSD oficial, testes extensivos |
| Rate limiting AT | Implementar queue com rate limiting |

---

## 📞 Contactos Úteis

- **Suporte técnico AT**: asi-psws@at.gov.pt
- **Linha Autoridade Tributária**: 217 206 707
- **Portal das Finanças**: https://www.portaldasfinancas.gov.pt

---

## 🎯 Critérios de Sucesso Fase 2

✅ Validação real de credenciais AT (não mock)
✅ Envio SOAP de fatura para AT homologação
✅ Envio SOAP de fatura para AT produção
✅ Retry automático em caso de erro
✅ Logs detalhados de todos os envios
✅ UI mostra status de envio AT
✅ Testes com ambiente de homologação passam
✅ Documentação completa atualizada

---

## 📝 Notas para Próximo Chat

**Ao iniciar Fase 2**, fornecer este documento ao Claude e pedir:

> "Implementa a Fase 2 da integração AT conforme documentado em `docs/AT_INTEGRATION_PHASE2.md`. Começa por pesquisar a documentação oficial do webservice SOAP da Autoridade Tributária portuguesa."

**Contexto a passar:**
- Fase 1 está completa (mock validation)
- Schema de BD já tem todas as tabelas necessárias
- Credenciais já são encriptadas e guardadas
- Falta apenas integração SOAP real

---

## 📚 Recursos de Referência

- Manual de Integração AT: (procurar link oficial)
- WSDL Homologação: (procurar link oficial)
- WSDL Produção: (procurar link oficial)
- Portaria n.º 363/2010: Assinaturas digitais
- Portaria n.º 195/2020: ATCUD e QR Codes
- SAF-T (PT) 1.04: Estrutura de dados

---

**Documento criado**: 2026-01-21
**Autor**: Claude (baseado em requisitos do projeto Faturex)
**Versão**: 1.0
