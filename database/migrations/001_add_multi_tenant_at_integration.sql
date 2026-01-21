-- ============================================================================
-- Migration: Add Multi-Tenant AT Integration Support
-- Created: 2026-01-21
-- Description: Adds tables for multi-tenant support and AT credentials management
-- ============================================================================

-- Enable UUID extension (idempotent)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- Table: tenants
-- Represents organizations/companies using the system
-- ============================================================================
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Company information
    company_name VARCHAR(100) NOT NULL,
    company_nif VARCHAR(9) NOT NULL UNIQUE,

    -- Contact information
    email VARCHAR(100),
    phone VARCHAR(20),

    -- Address
    address_detail VARCHAR(200),
    address_city VARCHAR(50),
    address_postal_code VARCHAR(8),
    address_country VARCHAR(2) DEFAULT 'PT',

    -- Settings
    is_active BOOLEAN DEFAULT TRUE,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tenants_nif ON tenants(company_nif);

-- ============================================================================
-- Table: tenant_users
-- Links Supabase Auth users to tenants (many-to-many relationship)
-- Allows multiple users per tenant and multiple tenants per user
-- ============================================================================
CREATE TABLE IF NOT EXISTS tenant_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Reference to tenant
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

    -- Reference to Supabase Auth user (auth.users)
    user_id UUID NOT NULL,

    -- Role within the tenant
    role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'viewer')),

    -- Status
    is_active BOOLEAN DEFAULT TRUE,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(tenant_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_tenant_users_tenant ON tenant_users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_users_user ON tenant_users(user_id);

-- ============================================================================
-- Table: tenant_at_credentials
-- Stores encrypted AT (Autoridade Tributária) credentials per tenant
-- Used for automatic invoice submission via webservice
-- ============================================================================
CREATE TABLE IF NOT EXISTS tenant_at_credentials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Reference to tenant
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

    -- AT Portal das Finanças sub-user credentials
    -- Format: "NIF/0001" (e.g., "123456789/0001")
    at_username VARCHAR(50) NOT NULL,

    -- Encrypted password (AES-256-GCM)
    -- Structure: {iv}:{encryptedData}:{authTag}
    at_password_encrypted TEXT NOT NULL,

    -- Permissions granted to this sub-user
    wse_enabled BOOLEAN DEFAULT FALSE,  -- WSE - Gestão de séries por webservice
    wfa_enabled BOOLEAN DEFAULT FALSE,  -- WFA - Comunicação de dados de faturas
    wdt_enabled BOOLEAN DEFAULT FALSE,  -- WDT - Documentos de transporte

    -- Optional certificate for advanced authentication
    certificate_path TEXT,

    -- Status
    is_active BOOLEAN DEFAULT TRUE,

    -- Validation metadata
    last_validated_at TIMESTAMPTZ,
    validation_error TEXT,

    -- Sync metadata
    last_sync_at TIMESTAMPTZ,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Only one active credential per tenant
    UNIQUE(tenant_id)
);

CREATE INDEX IF NOT EXISTS idx_tenant_at_credentials_tenant ON tenant_at_credentials(tenant_id);

-- ============================================================================
-- Table: at_submission_logs
-- Audit log for AT webservice submissions
-- ============================================================================
CREATE TABLE IF NOT EXISTS at_submission_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Reference to tenant
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

    -- Reference to invoice (if applicable)
    invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,

    -- Submission type
    submission_type VARCHAR(50) NOT NULL CHECK (submission_type IN (
        'invoice',
        'credit_note',
        'debit_note',
        'series_validation',
        'credentials_validation'
    )),

    -- Request/Response data
    request_payload JSONB,
    response_payload JSONB,

    -- Status
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'success', 'error', 'retry')),
    error_message TEXT,

    -- AT response code
    at_response_code VARCHAR(50),

    -- Retry metadata
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    next_retry_at TIMESTAMPTZ,

    -- Timing
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_at_submission_logs_tenant ON at_submission_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_at_submission_logs_invoice ON at_submission_logs(invoice_id);
CREATE INDEX IF NOT EXISTS idx_at_submission_logs_status ON at_submission_logs(status);
CREATE INDEX IF NOT EXISTS idx_at_submission_logs_submitted ON at_submission_logs(submitted_at);

-- ============================================================================
-- Comments
-- ============================================================================
COMMENT ON TABLE tenants IS 'Multi-tenant support - Organizations/companies using the system';
COMMENT ON TABLE tenant_users IS 'Links Supabase Auth users to tenants with role-based access';
COMMENT ON TABLE tenant_at_credentials IS 'Encrypted AT credentials per tenant for automatic invoice submission';
COMMENT ON TABLE at_submission_logs IS 'Audit log for AT webservice submissions and validations';

COMMENT ON COLUMN tenant_at_credentials.at_password_encrypted IS 'AES-256-GCM encrypted password - Format: {iv}:{encryptedData}:{authTag}';
COMMENT ON COLUMN tenant_at_credentials.wse_enabled IS 'WSE - Webservice de Comunicação e Gestão de Séries';
COMMENT ON COLUMN tenant_at_credentials.wfa_enabled IS 'WFA - Webservice de Comunicação de dados de faturas';
COMMENT ON COLUMN tenant_at_credentials.wdt_enabled IS 'WDT - Webservice de Comunicação de Documentos de Transporte';

-- ============================================================================
-- Sample Data: Create default tenant for existing data
-- ============================================================================
-- Insert a default tenant (optional - adjust as needed)
INSERT INTO tenants (id, company_name, company_nif, is_active)
VALUES (
    '00000000-0000-0000-0000-000000000000',
    'Tenant Padrão',
    '999999990',
    true
)
ON CONFLICT (company_nif) DO NOTHING;

-- ============================================================================
-- Migration Complete
-- ============================================================================
