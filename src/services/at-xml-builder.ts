/**
 * AT XML Builder
 *
 * Generates XML documents in AT-compliant format for invoice submission
 * Based on SAF-T (PT) specification and AT webservice requirements
 *
 * References:
 * - SAF-T (PT) 1.04_01
 * - Portaria 363/2010 (Digital signatures)
 * - Portaria 195/2020 (ATCUD and QR codes)
 */

/**
 * Invoice data structure for AT submission
 */
export interface ATInvoiceData {
  // Document identification
  invoiceNo: string; // e.g., "FT 2026/1"
  documentNumber: number; // Sequential number
  atcud: string; // ATCUD code
  invoiceDate: string; // ISO date: YYYY-MM-DD
  invoiceType: string; // FT, FS, FR, NC, ND
  documentStatus: string; // N, A, F

  // Supplier (company issuing invoice)
  supplierNif: string;
  supplierName: string;
  supplierAddress?: string;
  supplierCity?: string;
  supplierPostalCode?: string;
  supplierCountry?: string;

  // Customer
  customerNif: string;
  customerName: string;
  customerAddress?: string;
  customerCity?: string;
  customerPostalCode?: string;
  customerCountry?: string;

  // Financial data
  netTotal: number;
  taxTotal: number;
  grossTotal: number;

  // Invoice lines
  lines: ATInvoiceLine[];

  // Digital signature (optional but recommended)
  documentHash?: string;
  hashControl?: string;

  // System info
  sourceId?: string; // User who created the invoice
  systemEntryDate?: string; // When document entered system
}

/**
 * Invoice line data
 */
export interface ATInvoiceLine {
  lineNumber: number;
  productCode?: string;
  productDescription: string;
  quantity: number;
  unitOfMeasure: string; // e.g., "UN", "KG", "HR"
  unitPrice: number;
  taxRate: number; // e.g., 23 for 23% IVA
  taxType: string; // e.g., "IVA"
  taxCode?: string; // e.g., "NOR" (Normal), "RED" (Reduzida), "ISE" (Isenta)
  taxExemptionReason?: string;
  lineNetTotal: number;
  lineTaxAmount: number;
  lineGrossTotal: number;
}

/**
 * AT XML Builder
 *
 * Generates XML documents for AT webservice submission
 */
export class ATXMLBuilder {
  /**
   * Build invoice XML in AT format
   *
   * Note: The exact XML structure depends on AT's official specification.
   * This implementation follows SAF-T (PT) structure, which is commonly used.
   * You may need to adjust based on the specific webservice requirements.
   *
   * @param invoice - Invoice data
   * @returns XML string
   */
  static buildInvoiceXML(invoice: ATInvoiceData): string {
    // Escape XML special characters
    const escape = (str: string | undefined): string => {
      if (!str) return '';
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
    };

    // Format decimal numbers to 2 decimal places
    const formatDecimal = (num: number): string => {
      return num.toFixed(2);
    };

    // Build invoice lines XML
    const linesXML = invoice.lines
      .map((line) => {
        return `
      <Line>
        <LineNumber>${line.lineNumber}</LineNumber>
        ${line.productCode ? `<ProductCode>${escape(line.productCode)}</ProductCode>` : ''}
        <ProductDescription>${escape(line.productDescription)}</ProductDescription>
        <Quantity>${formatDecimal(line.quantity)}</Quantity>
        <UnitOfMeasure>${escape(line.unitOfMeasure)}</UnitOfMeasure>
        <UnitPrice>${formatDecimal(line.unitPrice)}</UnitPrice>
        <TaxPointDate>${invoice.invoiceDate}</TaxPointDate>
        <Tax>
          <TaxType>${escape(line.taxType)}</TaxType>
          ${line.taxCode ? `<TaxCode>${escape(line.taxCode)}</TaxCode>` : ''}
          <TaxPercentage>${formatDecimal(line.taxRate)}</TaxPercentage>
        </Tax>
        ${line.taxExemptionReason ? `<TaxExemptionReason>${escape(line.taxExemptionReason)}</TaxExemptionReason>` : ''}
        <NetTotal>${formatDecimal(line.lineNetTotal)}</NetTotal>
        <TaxAmount>${formatDecimal(line.lineTaxAmount)}</TaxAmount>
        <GrossTotal>${formatDecimal(line.lineGrossTotal)}</GrossTotal>
      </Line>`;
      })
      .join('');

    // Build complete XML document
    // Note: This structure follows SAF-T (PT) format
    // Adjust based on AT's specific webservice requirements
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Invoice xmlns="urn:OECD:StandardAuditFile-Tax:PT_1.04_01">
  <InvoiceNo>${escape(invoice.invoiceNo)}</InvoiceNo>
  <ATCUD>${escape(invoice.atcud)}</ATCUD>
  <DocumentStatus>
    <InvoiceStatus>${escape(invoice.documentStatus)}</InvoiceStatus>
    ${invoice.sourceId ? `<SourceID>${escape(invoice.sourceId)}</SourceID>` : ''}
    ${invoice.systemEntryDate ? `<SystemEntryDate>${invoice.systemEntryDate}</SystemEntryDate>` : ''}
  </DocumentStatus>
  ${invoice.documentHash ? `<Hash>${escape(invoice.documentHash)}</Hash>` : ''}
  ${invoice.hashControl ? `<HashControl>${escape(invoice.hashControl)}</HashControl>` : ''}
  <InvoiceDate>${invoice.invoiceDate}</InvoiceDate>
  <InvoiceType>${escape(invoice.invoiceType)}</InvoiceType>

  <CustomerID>
    <CustomerTaxID>${escape(invoice.customerNif)}</CustomerTaxID>
    <CompanyName>${escape(invoice.customerName)}</CompanyName>
    ${
      invoice.customerAddress
        ? `<BillingAddress>
      <AddressDetail>${escape(invoice.customerAddress)}</AddressDetail>
      <City>${escape(invoice.customerCity || '')}</City>
      <PostalCode>${escape(invoice.customerPostalCode || '')}</PostalCode>
      <Country>${escape(invoice.customerCountry || 'PT')}</Country>
    </BillingAddress>`
        : ''
    }
  </CustomerID>

  <Lines>
    ${linesXML}
  </Lines>

  <DocumentTotals>
    <TaxPayable>${formatDecimal(invoice.taxTotal)}</TaxPayable>
    <NetTotal>${formatDecimal(invoice.netTotal)}</NetTotal>
    <GrossTotal>${formatDecimal(invoice.grossTotal)}</GrossTotal>
  </DocumentTotals>
</Invoice>`;

    return xml;
  }

  /**
   * Build simplified invoice submission XML
   *
   * Some AT webservices may accept a simplified format.
   * This method creates a minimal XML with essential fields only.
   *
   * @param invoice - Invoice data
   * @returns Simplified XML string
   */
  static buildSimplifiedInvoiceXML(invoice: ATInvoiceData): string {
    const escape = (str: string | undefined): string => {
      if (!str) return '';
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
    };

    const formatDecimal = (num: number): string => num.toFixed(2);

    return `<?xml version="1.0" encoding="UTF-8"?>
<SubmitInvoice>
  <InvoiceNo>${escape(invoice.invoiceNo)}</InvoiceNo>
  <ATCUD>${escape(invoice.atcud)}</ATCUD>
  <InvoiceDate>${invoice.invoiceDate}</InvoiceDate>
  <InvoiceType>${escape(invoice.invoiceType)}</InvoiceType>
  <SupplierNIF>${escape(invoice.supplierNif)}</SupplierNIF>
  <CustomerNIF>${escape(invoice.customerNif)}</CustomerNIF>
  <NetTotal>${formatDecimal(invoice.netTotal)}</NetTotal>
  <TaxTotal>${formatDecimal(invoice.taxTotal)}</TaxTotal>
  <GrossTotal>${formatDecimal(invoice.grossTotal)}</GrossTotal>
  ${invoice.documentHash ? `<Hash>${escape(invoice.documentHash)}</Hash>` : ''}
</SubmitInvoice>`;
  }

  /**
   * Convert database invoice to AT format
   *
   * This is a helper method to transform invoice data from your database
   * into the format required by AT.
   *
   * @param dbInvoice - Invoice from database
   * @returns AT-formatted invoice data
   */
  static convertFromDatabase(dbInvoice: any): ATInvoiceData {
    // Extract supplier info from environment or config
    const supplierNif = process.env.COMPANY_NIF || '';
    const supplierName = process.env.COMPANY_NAME || '';

    // Convert invoice lines
    const lines: ATInvoiceLine[] = (dbInvoice.lines || []).map((line: any, index: number) => ({
      lineNumber: index + 1,
      productCode: line.product_code,
      productDescription: line.description || line.product_description,
      quantity: parseFloat(line.quantity),
      unitOfMeasure: line.unit_of_measure || 'UN',
      unitPrice: parseFloat(line.unit_price),
      taxRate: parseFloat(line.tax_percentage || line.tax_rate || 23),
      taxType: line.tax_type || 'IVA',
      taxCode: line.tax_code,
      taxExemptionReason: line.tax_exemption_reason,
      lineNetTotal: parseFloat(line.line_net_total || line.tax_base),
      lineTaxAmount: parseFloat(line.line_tax_amount || 0),
      lineGrossTotal: parseFloat(line.line_gross_total || 0),
    }));

    return {
      invoiceNo: dbInvoice.invoice_no,
      documentNumber: dbInvoice.document_number,
      atcud: dbInvoice.atcud,
      invoiceDate: dbInvoice.invoice_date,
      invoiceType: dbInvoice.invoice_type || 'FT',
      documentStatus: dbInvoice.document_status,
      supplierNif,
      supplierName,
      customerNif: dbInvoice.customer_tax_id || dbInvoice.customer_nif,
      customerName: dbInvoice.customer_name || dbInvoice.company_name,
      customerAddress: dbInvoice.billing_address,
      customerCity: dbInvoice.customer_city,
      customerPostalCode: dbInvoice.postal_code,
      customerCountry: dbInvoice.customer_country || 'PT',
      netTotal: parseFloat(dbInvoice.net_total),
      taxTotal: parseFloat(dbInvoice.tax_payable),
      grossTotal: parseFloat(dbInvoice.gross_total),
      lines,
      documentHash: dbInvoice.document_hash,
      hashControl: dbInvoice.hash_control,
      sourceId: dbInvoice.source_id,
      systemEntryDate: dbInvoice.system_entry_date,
    };
  }

  /**
   * Validate invoice data before XML generation
   *
   * @param invoice - Invoice data
   * @returns Validation result
   */
  static validateInvoiceData(invoice: ATInvoiceData): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Required fields
    if (!invoice.invoiceNo) errors.push('Invoice number is required');
    if (!invoice.atcud) errors.push('ATCUD is required');
    if (!invoice.invoiceDate) errors.push('Invoice date is required');
    if (!invoice.customerNif) errors.push('Customer NIF is required');
    if (!invoice.supplierNif) errors.push('Supplier NIF is required');

    // Validate NIF format (9 digits)
    const nifRegex = /^\d{9}$/;
    if (invoice.customerNif && !nifRegex.test(invoice.customerNif)) {
      errors.push('Customer NIF must be 9 digits');
    }
    if (invoice.supplierNif && !nifRegex.test(invoice.supplierNif)) {
      errors.push('Supplier NIF must be 9 digits');
    }

    // Validate invoice lines
    if (!invoice.lines || invoice.lines.length === 0) {
      errors.push('Invoice must have at least one line');
    }

    // Validate totals
    if (invoice.netTotal < 0) errors.push('Net total cannot be negative');
    if (invoice.taxTotal < 0) errors.push('Tax total cannot be negative');
    if (invoice.grossTotal < 0) errors.push('Gross total cannot be negative');

    // Validate document status
    const validStatuses = ['N', 'A', 'F'];
    if (!validStatuses.includes(invoice.documentStatus)) {
      errors.push('Document status must be N, A, or F');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

export default ATXMLBuilder;
