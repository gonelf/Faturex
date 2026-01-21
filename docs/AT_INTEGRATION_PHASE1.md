# Integração AT - Fase 1: MVP Backend & Wizard

## 📋 Resumo

Fase 1 implementa a estrutura base para integração com a Autoridade Tributária portuguesa, incluindo:

- ✅ Multi-tenancy incremental
- ✅ Gestão segura de credenciais AT
- ✅ Validação de credenciais (mock)
- ✅ Wizard de configuração
- ✅ Página de configurações

## 🏗️ Arquitetura

### Multi-Tenancy Incremental

Implementação híbrida que adiciona suporte multi-tenant apenas para novas features, mantendo compatibilidade com código existente:

```
Novas tabelas (multi-tenant):
├── tenants                  # Organizações
├── tenant_users             # Utilizadores por tenant
├── tenant_at_credentials    # Credenciais AT encriptadas
└── at_submission_logs       # Logs de envios

Tabelas existentes (single-tenant):
├── customers
├── products
├── invoices
└── ... (sem alterações)
```

## 🗄️ Base de Dados

### Novas Tabelas

#### `tenants`
```sql
- id: UUID (PK)
- company_name: VARCHAR(100)
- company_nif: VARCHAR(9) UNIQUE
- email, phone, address_*
- is_active: BOOLEAN
- created_at, updated_at: TIMESTAMPTZ
```

#### `tenant_users`
```sql
- id: UUID (PK)
- tenant_id: UUID (FK → tenants)
- user_id: UUID (Supabase Auth)
- role: VARCHAR(20) ['owner', 'admin', 'member', 'viewer']
- is_active: BOOLEAN
- created_at, updated_at: TIMESTAMPTZ
```

#### `tenant_at_credentials`
```sql
- id: UUID (PK)
- tenant_id: UUID (FK → tenants) UNIQUE
- at_username: VARCHAR(50)  # Formato: NIF/0001
- at_password_encrypted: TEXT  # AES-256-GCM
- wse_enabled, wfa_enabled, wdt_enabled: BOOLEAN
- certificate_path: TEXT
- last_validated_at: TIMESTAMPTZ
- validation_error: TEXT
- is_active: BOOLEAN
```

#### `at_submission_logs`
```sql
- id: UUID (PK)
- tenant_id: UUID (FK → tenants)
- invoice_id: UUID (FK → invoices)
- submission_type: VARCHAR(50)
- request_payload, response_payload: JSONB
- status: VARCHAR(20) ['pending', 'success', 'error', 'retry']
- retry_count, max_retries: INTEGER
- submitted_at, completed_at: TIMESTAMPTZ
```

### Migração

```bash
# Aplicar migração
psql -h your-supabase-host -U postgres -d postgres \
  -f database/migrations/001_add_multi_tenant_at_integration.sql

# Ou via Supabase Dashboard:
# SQL Editor → New Query → Colar conteúdo da migração → Run
```

## 🔐 Segurança

### Encriptação (AES-256-GCM)

**Serviço**: `/src/services/encryption.service.ts`

```typescript
// Encriptar
const encrypted = encrypt('password123');
// Resultado: "iv:encryptedData:authTag" (base64)

// Desencriptar
const plaintext = decrypt(encrypted);
```

**Configuração**:
```bash
# Gerar chave de encriptação (64 caracteres hex = 256 bits)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Adicionar ao .env
ENCRYPTION_KEY=sua_chave_gerada_aqui
```

### Formato de Credenciais AT

- **Username**: `NIF/NÚMERO` (ex: `123456789/0001`)
- **Password**: 8-14 caracteres (requisito AT)
- **Permissões**: WSE (séries), WFA (faturas), WDT (transporte)

## 🔌 API Endpoints

### Base URL: `/api/at`

#### POST `/api/at/validate-credentials`
Valida credenciais AT

**Request**:
```json
{
  "username": "123456789/0001",
  "password": "password123"
}
```

**Response**:
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
    "companyName": "Empresa Exemplo, Lda"
  }
}
```

#### POST `/api/at/credentials`
Guarda credenciais AT

**Request**:
```json
{
  "tenantId": "uuid",
  "username": "123456789/0001",
  "password": "password123"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "tenantId": "uuid",
    "atUsername": "123456789/0001",
    "wseEnabled": true,
    "wfaEnabled": true,
    "wdtEnabled": false,
    "isActive": true,
    "lastValidatedAt": "2026-01-21T12:00:00Z"
  }
}
```

#### GET `/api/at/credentials/:tenantId`
Obtém status das credenciais (sem password)

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "atUsername": "123456789/0001",
    "wseEnabled": true,
    "wfaEnabled": true,
    "isActive": true
  }
}
```

#### DELETE `/api/at/credentials/:tenantId`
Remove credenciais AT

**Response**:
```json
{
  "success": true,
  "message": "Credenciais removidas com sucesso"
}
```

## 🎨 UI/UX

### Wizard de Configuração

**Componente**: `/components/ATConfigurationWizard.tsx`

**Fluxo** (3 passos):

1. **Inserir Credenciais**
   - Input username (NIF/0001)
   - Input password (8-14 chars)
   - Instruções para criar sub-utilizador
   - Link para Portal das Finanças
   - Botões: "Configurar depois" | "Validar →"

2. **Verificação**
   - ✓ Credenciais válidas
   - Exibe NIF e nome da empresa
   - Exibe permissões (WSE/WFA/WDT)
   - Botões: "← Voltar" | "Guardar →"

3. **Concluir**
   - ✓ Tudo pronto!
   - Mensagem de sucesso
   - Botão: "Concluir configuração"

### Página de Configurações

**Página**: `/app/(dashboard)/settings/integrations/at/page.tsx`

**Estados**:

- **Não configurado**: CTA para configurar + benefícios
- **Configurado**: Status, permissões, opções (reconfigurar, remover)

**Navegação**: Sidebar → "Integrações"

## 🚧 Limitações da Fase 1 (Mock)

### Validação Mock

Atualmente, a validação de credenciais é **simulada**:

```typescript
// at.service.ts - mockATValidation()
// Aceita qualquer credencial com formato válido
// Retorna sempre: { valid: true, permissions: {...} }
```

**Fase 2** implementará:
- SOAP webservice real da AT
- Autenticação com certificados
- Validação real de permissões
- Envio real de faturas

## 📦 Variáveis de Ambiente

Adicionar ao `.env` / `.env.local`:

```bash
# Encriptação de credenciais AT
ENCRYPTION_KEY=sua_chave_256_bits_em_hex

# Supabase (já existentes)
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

## 🧪 Testing

### Teste Manual

1. **Iniciar aplicação**:
```bash
npm run dev
```

2. **Aceder página**:
```
http://localhost:3000/settings/integrations/at
```

3. **Testar wizard**:
   - Username: `123456789/0001`
   - Password: `password123` (8-14 chars)
   - Validar → Guardar → Concluir

4. **Verificar credenciais**:
   - Página deve mostrar "Configuração Ativa"
   - Username visível
   - Permissões listadas

### Teste API (via cURL)

```bash
# Validar credenciais
curl -X POST http://localhost:3000/api/at/validate-credentials \
  -H "Content-Type: application/json" \
  -d '{
    "username": "123456789/0001",
    "password": "password123"
  }'

# Guardar credenciais
curl -X POST http://localhost:3000/api/at/credentials \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "tenantId": "00000000-0000-0000-0000-000000000000",
    "username": "123456789/0001",
    "password": "password123"
  }'

# Obter credenciais
curl http://localhost:3000/api/at/credentials/00000000-0000-0000-0000-000000000000 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📚 Recursos

### Documentação AT

- [Portal das Finanças](https://www.portaldasfinancas.gov.pt)
- [FAQ Webservice AT](https://info.portaldasfinancas.gov.pt/pt/apoio_contribuinte/questoes_frequentes/pages/faqs-00996.aspx)
- Portaria n.º 363/2010 - Assinaturas Digitais
- Portaria n.º 195/2020 - ATCUD e QR Codes

### Guias Externos

- [InvoiceXpress - Criar Sub-utilizador](https://invoicexpress.helpscoutdocs.com/article/92-como-crio-um-sub-utilizador-no-portal-das-financas)
- [Moloni - Ativar Comunicação AT](https://www.moloni.pt/suporte/como-ativar-o-registo-de-series-de-faturacao-na-at)

## 🔜 Próximos Passos (Fase 2)

**Novo Chat** - Implementação SOAP:

1. Pesquisar documentação SOAP oficial da AT
2. Implementar cliente SOAP (Node.js)
3. Autenticação com certificados
4. Endpoint: `POST /api/invoices/:id/submit-to-at`
5. Queue de envios com retry logic
6. Sincronização de status
7. Testes com ambiente de homologação AT

## 📄 Licença

Este projeto é parte do Faturex - Portuguese Billing System.
SAF-T (PT) 1.04 Compliant.
