-- ============================================================================
-- Portuguese Billing System - SAF-T (PT) 1.04 Compliant Database Schema
-- Compliant with Portaria n.º 363/2010 and Portaria n.º 195/2020
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- Table: taxes
-- SAF-T Reference: 2.5 - TaxTable
-- ============================================================================
CREATE TABLE taxes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- SAF-T Field: 2.5.1 - TaxType (IVA, IS)
    tax_type VARCHAR(3) NOT NULL CHECK (tax_type IN ('IVA', 'IS')),

    -- SAF-T Field: 2.5.2 - TaxCountryRegion
    tax_country_region VARCHAR(5) NOT NULL CHECK (tax_country_region IN ('PT', 'PT-MA', 'PT-AC')),

    -- SAF-T Field: 2.5.3 - TaxCode
    tax_code VARCHAR(10) NOT NULL,

    -- SAF-T Field: 2.5.4 - Description
    description VARCHAR(200) NOT NULL,

    -- SAF-T Field: 2.5.5 - TaxPercentage
    tax_percentage DECIMAL(5,2) NOT NULL,

    -- Active status
    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(tax_type, tax_country_region, tax_code)
);

-- ============================================================================
-- Table: customers
-- SAF-T Reference: 2.2 - Customer
-- ============================================================================
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- SAF-T Field: 2.2.1 - CustomerID
    customer_id VARCHAR(30) NOT NULL UNIQUE,

    -- SAF-T Field: 2.2.2 - AccountID
    account_id VARCHAR(30),

    -- SAF-T Field: 2.2.3 - CustomerTaxID (Portuguese NIF - 9 digits)
    customer_tax_id VARCHAR(9) NOT NULL,

    -- SAF-T Field: 2.2.4 - CompanyName
    company_name VARCHAR(100) NOT NULL,

    -- SAF-T Field: 2.2.7 - BillingAddress
    billing_address_detail VARCHAR(200),
    billing_address_city VARCHAR(50),
    billing_address_postal_code VARCHAR(8),
    billing_address_country VARCHAR(2) DEFAULT 'PT',

    -- SAF-T Field: 2.2.10 - SelfBillingIndicator
    self_billing_indicator BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_customers_tax_id ON customers(customer_tax_id);

-- ============================================================================
-- Table: products
-- SAF-T Reference: 2.4 - Product
-- ============================================================================
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- SAF-T Field: 2.4.1 - ProductType (P=Products, S=Services, O=Other, E=Expenses, I=Assets)
    product_type CHAR(1) NOT NULL CHECK (product_type IN ('P', 'S', 'O', 'E', 'I')),

    -- SAF-T Field: 2.4.2 - ProductCode
    product_code VARCHAR(60) NOT NULL UNIQUE,

    -- SAF-T Field: 2.4.5 - ProductDescription
    product_description VARCHAR(200) NOT NULL,

    -- SAF-T Field: 2.4.6 - ProductNumberCode (EAN/Barcode)
    product_number_code VARCHAR(60),

    -- Unit price
    unit_price DECIMAL(15,2) NOT NULL,

    -- Tax reference
    default_tax_id UUID REFERENCES taxes(id),

    -- SAF-T Field: Custom TaxExemptionReason reference
    tax_exemption_reason VARCHAR(200),

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_products_code ON products(product_code);

-- ============================================================================
-- Table: billing_series
-- Reference: Portaria n.º 195/2020 - ATCUD Requirements
-- Each series has independent sequential numbering and AT validation code
-- ============================================================================
CREATE TABLE billing_series (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Series identifier (e.g., "FT", "FR", "NC")
    series_code VARCHAR(10) NOT NULL UNIQUE,

    -- SAF-T Field: 4.1.4.2 - InvoiceType
    -- FT=Fatura, FS=Fatura Simplificada, FR=Fatura-Recibo, NC=Nota de Crédito, ND=Nota de Débito
    invoice_type VARCHAR(2) NOT NULL CHECK (invoice_type IN ('FT', 'FS', 'FR', 'NC', 'ND')),

    -- Description of the series
    description VARCHAR(100) NOT NULL,

    -- Validation Code from AT (Código de Validação da Série)
    -- This is provided by the Portuguese Tax Authority
    -- Used in ATCUD generation: ATCUD = validation_code + "-" + document_number
    validation_code VARCHAR(20) NOT NULL,

    -- Current sequential number (starts at 1)
    current_number INTEGER DEFAULT 0,

    -- Year for the series (optional, for yearly reset)
    series_year INTEGER,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- Table: invoices
-- SAF-T Reference: 4.1 - Invoice (SourceDocuments.SalesInvoices.Invoice)
-- ============================================================================
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Reference to billing series
    series_id UUID NOT NULL REFERENCES billing_series(id),

    -- SAF-T Field: 4.1.4.1 - InvoiceNo (Series/Number format)
    invoice_no VARCHAR(60) NOT NULL UNIQUE,

    -- Document number within the series (sequential)
    document_number INTEGER NOT NULL,

    -- SAF-T Field: 4.1.4.16 - ATCUD (Portaria n.º 195/2020)
    -- Format: ValidationCode-DocumentNumber (e.g., "CSVP8Y9-1")
    atcud VARCHAR(100) NOT NULL,

    -- SAF-T Field: 4.1.4.17 - Hash (Digital signature chain)
    -- RSA-SHA1 hash of: InvoiceDate;SystemEntryDate;InvoiceNo;GrossTotal;PreviousHash
    document_hash VARCHAR(344) NOT NULL,

    -- SAF-T Field: 4.1.4.18 - HashControl (4-character control)
    -- Characters at positions 1, 11, 21, 31 of the hash
    hash_control CHAR(4) NOT NULL,

    -- SAF-T Field: 4.1.4.3 - DocumentStatus
    document_status CHAR(1) DEFAULT 'N' CHECK (document_status IN ('N', 'A', 'F')),
    -- N=Normal, A=Cancelled, F=Finalized

    -- SAF-T Field: 4.1.4.4 - Hash field is above (document_hash)

    -- SAF-T Field: 4.1.4.5 - InvoiceDate
    invoice_date DATE NOT NULL,

    -- SAF-T Field: 4.1.4.6 - InvoiceType (linked from series)
    -- Stored in billing_series table

    -- SAF-T Field: 4.1.4.7 - SpecialRegimes (not implemented in this version)

    -- SAF-T Field: 4.1.4.8 - SourceID (User who created the document)
    source_id VARCHAR(30) NOT NULL,

    -- SAF-T Field: 4.1.4.9 - SystemEntryDate (Immutable timestamp)
    system_entry_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- SAF-T Field: 4.1.4.10 - CustomerID
    customer_id UUID NOT NULL REFERENCES customers(id),

    -- SAF-T Field: 4.1.4.14 - DocumentTotals
    -- 4.1.4.14.1 - TaxPayable
    tax_payable DECIMAL(15,2) NOT NULL DEFAULT 0,

    -- 4.1.4.14.2 - NetTotal
    net_total DECIMAL(15,2) NOT NULL DEFAULT 0,

    -- 4.1.4.14.3 - GrossTotal
    gross_total DECIMAL(15,2) NOT NULL DEFAULT 0,

    -- QR Code data string (Portaria n.º 195/2020)
    qr_code_data TEXT,

    -- Previous document hash for chaining
    previous_hash VARCHAR(344),

    -- Finalization timestamp (when document becomes immutable)
    finalized_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Ensure sequential numbering per series
    UNIQUE(series_id, document_number)
);

CREATE INDEX idx_invoices_no ON invoices(invoice_no);
CREATE INDEX idx_invoices_date ON invoices(invoice_date);
CREATE INDEX idx_invoices_customer ON invoices(customer_id);
CREATE INDEX idx_invoices_status ON invoices(document_status);

-- ============================================================================
-- Table: invoice_lines
-- SAF-T Reference: 4.1.4.13 - Line
-- ============================================================================
CREATE TABLE invoice_lines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,

    -- SAF-T Field: 4.1.4.13.1 - LineNumber
    line_number INTEGER NOT NULL,

    -- SAF-T Field: 4.1.4.13.2 - ProductCode
    product_id UUID NOT NULL REFERENCES products(id),

    -- SAF-T Field: 4.1.4.13.3 - Quantity
    quantity DECIMAL(15,4) NOT NULL,

    -- SAF-T Field: 4.1.4.13.4 - UnitOfMeasure
    unit_of_measure VARCHAR(20) DEFAULT 'UN',

    -- SAF-T Field: 4.1.4.13.5 - UnitPrice
    unit_price DECIMAL(15,2) NOT NULL,

    -- SAF-T Field: 4.1.4.13.6 - TaxBase (Net amount)
    tax_base DECIMAL(15,2) NOT NULL,

    -- SAF-T Field: 4.1.4.13.7 - TaxPointDate
    tax_point_date DATE NOT NULL,

    -- SAF-T Field: 4.1.4.13.10 - Description
    description VARCHAR(200),

    -- SAF-T Field: 4.1.4.13.12 - Tax
    tax_id UUID NOT NULL REFERENCES taxes(id),

    -- SAF-T Field: 4.1.4.13.14 - TaxExemptionReason
    tax_exemption_reason VARCHAR(200),

    -- SAF-T Field: 4.1.4.13.15 - SettlementAmount (Discount)
    settlement_amount DECIMAL(15,2) DEFAULT 0,

    -- Line totals
    line_net_total DECIMAL(15,2) NOT NULL,
    line_tax_amount DECIMAL(15,2) NOT NULL,
    line_gross_total DECIMAL(15,2) NOT NULL,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(invoice_id, line_number)
);

CREATE INDEX idx_invoice_lines_invoice ON invoice_lines(invoice_id);

-- ============================================================================
-- Table: document_status_history
-- SAF-T Reference: 4.1.4.3 - DocumentStatus audit trail
-- ============================================================================
CREATE TABLE document_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,

    -- Status code
    status_code CHAR(1) NOT NULL CHECK (status_code IN ('N', 'A', 'F')),

    -- SAF-T Field: 4.1.4.3.1 - InvoiceStatus
    status_description VARCHAR(100),

    -- SAF-T Field: 4.1.4.3.2 - InvoiceStatusDate
    status_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- SAF-T Field: 4.1.4.3.4 - SourceID (User who changed the status)
    source_id VARCHAR(30) NOT NULL,

    -- SAF-T Field: 4.1.4.3.5 - SourceBilling (Always 'P' for produced)
    source_billing CHAR(1) DEFAULT 'P' CHECK (source_billing IN ('P', 'I', 'M')),

    -- Reason for status change
    reason TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_status_history_invoice ON document_status_history(invoice_id);

-- ============================================================================
-- Function: Get next document number for a series (atomic)
-- ============================================================================
CREATE OR REPLACE FUNCTION get_next_document_number(p_series_id UUID)
RETURNS INTEGER AS $$
DECLARE
    v_next_number INTEGER;
BEGIN
    UPDATE billing_series
    SET current_number = current_number + 1
    WHERE id = p_series_id
    RETURNING current_number INTO v_next_number;

    RETURN v_next_number;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- Function: Prevent modifications to finalized documents
-- ============================================================================
CREATE OR REPLACE FUNCTION prevent_finalized_modification()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.document_status = 'F' THEN
        RAISE EXCEPTION 'Cannot modify finalized document. Document is immutable.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to invoices table
CREATE TRIGGER trigger_prevent_finalized_modification
BEFORE UPDATE OR DELETE ON invoices
FOR EACH ROW
EXECUTE FUNCTION prevent_finalized_modification();

-- ============================================================================
-- Function: Prevent deletion of finalized documents
-- ============================================================================
CREATE OR REPLACE FUNCTION prevent_finalized_deletion()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.document_status = 'F' THEN
        RAISE EXCEPTION 'Cannot delete finalized document. Document is immutable.';
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Apply deletion prevention trigger
CREATE TRIGGER trigger_prevent_finalized_deletion
BEFORE DELETE ON invoices
FOR EACH ROW
EXECUTE FUNCTION prevent_finalized_deletion();

-- ============================================================================
-- Initial Data: Common Portuguese Tax Rates
-- ============================================================================

-- IVA Continental (PT)
INSERT INTO taxes (tax_type, tax_country_region, tax_code, description, tax_percentage) VALUES
('IVA', 'PT', 'NOR', 'IVA taxa normal', 23.00),
('IVA', 'PT', 'INT', 'IVA taxa intermédia', 13.00),
('IVA', 'PT', 'RED', 'IVA taxa reduzida', 6.00),
('IVA', 'PT', 'ISE', 'IVA isento', 0.00);

-- IVA Madeira (PT-MA)
INSERT INTO taxes (tax_type, tax_country_region, tax_code, description, tax_percentage) VALUES
('IVA', 'PT-MA', 'NOR', 'IVA taxa normal (Madeira)', 22.00),
('IVA', 'PT-MA', 'INT', 'IVA taxa intermédia (Madeira)', 12.00),
('IVA', 'PT-MA', 'RED', 'IVA taxa reduzida (Madeira)', 5.00),
('IVA', 'PT-MA', 'ISE', 'IVA isento (Madeira)', 0.00);

-- IVA Açores (PT-AC)
INSERT INTO taxes (tax_type, tax_country_region, tax_code, description, tax_percentage) VALUES
('IVA', 'PT-AC', 'NOR', 'IVA taxa normal (Açores)', 18.00),
('IVA', 'PT-AC', 'INT', 'IVA taxa intermédia (Açores)', 9.00),
('IVA', 'PT-AC', 'RED', 'IVA taxa reduzida (Açores)', 4.00),
('IVA', 'PT-AC', 'ISE', 'IVA isento (Açores)', 0.00);

-- ============================================================================
-- Sample Billing Series
-- Note: validation_code should be obtained from AT (Portuguese Tax Authority)
-- ============================================================================
INSERT INTO billing_series (series_code, invoice_type, description, validation_code, series_year) VALUES
('FT', 'FT', 'Faturas', 'CSVP8Y9', 2026),
('FR', 'FR', 'Faturas-Recibo', 'ABCD123', 2026),
('NC', 'NC', 'Notas de Crédito', 'WXYZ456', 2026);

-- ============================================================================
-- Comments and Documentation
-- ============================================================================
COMMENT ON TABLE taxes IS 'SAF-T 2.5 - Tax Table - Portuguese tax rates (IVA/IS)';
COMMENT ON TABLE customers IS 'SAF-T 2.2 - Customer Master Data';
COMMENT ON TABLE products IS 'SAF-T 2.4 - Product Master Data';
COMMENT ON TABLE billing_series IS 'Billing series management with AT validation codes for ATCUD';
COMMENT ON TABLE invoices IS 'SAF-T 4.1 - Sales Invoices with RSA chaining and ATCUD';
COMMENT ON TABLE invoice_lines IS 'SAF-T 4.1.4.13 - Invoice line items';
COMMENT ON TABLE document_status_history IS 'SAF-T 4.1.4.3 - Document status audit trail';

COMMENT ON COLUMN invoices.atcud IS 'ATCUD - Portaria n.º 195/2020 - Format: ValidationCode-DocumentNumber';
COMMENT ON COLUMN invoices.document_hash IS 'RSA-SHA1 signature for document chaining - Portaria n.º 363/2010';
COMMENT ON COLUMN invoices.hash_control IS '4-character hash control (positions 1,11,21,31)';
COMMENT ON COLUMN invoices.system_entry_date IS 'Immutable timestamp - cannot be changed after creation';

-- ============================================================================
-- Table: contact_leads
-- Landing page contact form submissions
-- ============================================================================
CREATE TABLE contact_leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Contact information
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    business_type VARCHAR(100),
    message TEXT,

    -- Lead status
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'rejected')),

    -- Source tracking
    source VARCHAR(50) DEFAULT 'homepage_form',
    user_agent TEXT,
    ip_address INET,

    -- Follow-up
    notes TEXT,
    contacted_at TIMESTAMPTZ,
    assigned_to VARCHAR(50),

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_contact_leads_status ON contact_leads(status);
CREATE INDEX idx_contact_leads_created ON contact_leads(created_at DESC);
CREATE INDEX idx_contact_leads_email ON contact_leads(email);

COMMENT ON TABLE contact_leads IS 'Homepage contact form leads for sales follow-up';
